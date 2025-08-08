import type {
  Plugin,
  PluginManager as IPluginManager,
  PluginManagerConfig,
  PluginState,
  PluginSettings,
  CMSCollection,
  CMSPage,
  PluginEvent,
  DependencyResolution
} from './types.js';
import { PluginError } from './types.js';
import { PluginRegistry } from './PluginRegistry.js';
import { PluginStorage } from './PluginStorage.js';
import { PluginLoader } from './PluginLoader.js';

// 简单的 EventEmitter 实现，用于浏览器环境
class SimpleEventEmitter {
  private events: Map<string, Function[]> = new Map();

  on(event: string, listener: Function): this {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(listener);
    return this;
  }

  emit(event: string, ...args: any[]): boolean {
    const listeners = this.events.get(event);
    if (!listeners) return false;

    listeners.forEach(listener => {
      try {
        listener(...args);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
    return true;
  }

  off(event: string, listener?: Function): this {
    if (!listener) {
      this.events.delete(event);
      return this;
    }

    const listeners = this.events.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
    return this;
  }

  removeAllListeners(event?: string): this {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }
}

export class PluginManager extends SimpleEventEmitter implements IPluginManager {
  private registry: PluginRegistry;
  private storage: PluginStorage;
  private loader: PluginLoader;
  private config: PluginManagerConfig;
  
  private hooks: Map<string, Array<{ handler: Function; priority: number }>> = new Map();
  private filters: Map<string, Array<{ handler: Function; priority: number }>> = new Map();
  private cmsCollections: Map<string, CMSCollection[]> = new Map();
  private cmsPages: Map<string, CMSPage[]> = new Map();
  
  private loadingPlugins: Set<string> = new Set();
  private activePlugins: Set<string> = new Set();

  constructor(config: Partial<PluginManagerConfig> = {}) {
    super();
    
    this.config = {
      pluginsDir: './plugins',
      autoLoad: true,
      enableHotReload: false,
      maxConcurrentLoads: 5,
      cacheEnabled: true,
      securityMode: 'moderate',
      ...config
    };
    
    this.registry = new PluginRegistry();
    this.storage = new PluginStorage();
    this.loader = new PluginLoader(this.config);
    
    if (this.config.autoLoad) {
      this.autoLoadPlugins();
    }
  }

  // 插件管理方法
  async install(plugin: Plugin): Promise<void> {
    const pluginId = plugin.metadata.id;
    
    try {
      this.emit('plugin:installing', { pluginId });
      
      // 检查是否已安装
      if (await this.isInstalled(pluginId)) {
        throw new PluginError(`Plugin ${pluginId} is already installed`, pluginId, 'ALREADY_INSTALLED');
      }
      
      // 验证插件
      const validation = this.loader.validate(plugin);
      if (validation !== true) {
        throw new PluginError(`Plugin validation failed: ${validation}`, pluginId, 'VALIDATION_FAILED');
      }
      
      // 检查依赖
      const depResolution = await this.resolveDependencies(plugin);
      if (!depResolution.satisfied) {
        throw new PluginError(
          `Missing dependencies: ${depResolution.missing.join(', ')}`,
          pluginId,
          'MISSING_DEPENDENCIES',
          depResolution
        );
      }
      
      // 注册插件
      this.registry.register(plugin);
      
      // 执行安装钩子
      if (plugin.onInstall) {
        await plugin.onInstall();
      }
      
      // 保存插件状态
      const state: PluginState = {
        id: pluginId,
        isActive: false,
        isInstalled: true,
        settings: plugin.getDefaultSettings?.() || {},
        installedAt: new Date()
      };
      
      await this.storage.setPluginState(pluginId, state);
      
      this.emit('plugin:installed', { pluginId, plugin });
      
    } catch (error) {
      this.emit('plugin:error', { pluginId, error });
      throw error;
    }
  }

  async activate(pluginId: string): Promise<void> {
    try {
      this.emit('plugin:activating', { pluginId });
      
      const plugin = this.registry.get(pluginId);
      if (!plugin) {
        throw new PluginError(`Plugin ${pluginId} not found`, pluginId, 'NOT_FOUND');
      }
      
      if (this.activePlugins.has(pluginId)) {
        throw new PluginError(`Plugin ${pluginId} is already active`, pluginId, 'ALREADY_ACTIVE');
      }
      
      // 检查依赖
      const depResolution = await this.resolveDependencies(plugin);
      if (!depResolution.satisfied) {
        throw new PluginError(
          `Missing dependencies: ${depResolution.missing.join(', ')}`,
          pluginId,
          'MISSING_DEPENDENCIES'
        );
      }
      
      // 执行激活钩子
      if (plugin.onActivate) {
        await plugin.onActivate();
      }
      
      // 注册插件功能
      this.registerPluginFeatures(plugin);
      
      // 更新状态
      this.activePlugins.add(pluginId);
      const state = await this.storage.getPluginState(pluginId);
      if (state) {
        state.isActive = true;
        state.activatedAt = new Date();
        await this.storage.setPluginState(pluginId, state);
      }
      
      this.emit('plugin:activated', { pluginId, plugin });
      
    } catch (error) {
      this.emit('plugin:error', { pluginId, error });
      throw error;
    }
  }

  async deactivate(pluginId: string): Promise<void> {
    try {
      this.emit('plugin:deactivating', { pluginId });
      
      const plugin = this.registry.get(pluginId);
      if (!plugin) {
        throw new PluginError(`Plugin ${pluginId} not found`, pluginId, 'NOT_FOUND');
      }
      
      if (!this.activePlugins.has(pluginId)) {
        throw new PluginError(`Plugin ${pluginId} is not active`, pluginId, 'NOT_ACTIVE');
      }
      
      // 执行停用钩子
      if (plugin.onDeactivate) {
        await plugin.onDeactivate();
      }
      
      // 注销插件功能
      this.unregisterPluginFeatures(pluginId);
      
      // 更新状态
      this.activePlugins.delete(pluginId);
      const state = await this.storage.getPluginState(pluginId);
      if (state) {
        state.isActive = false;
        await this.storage.setPluginState(pluginId, state);
      }
      
      this.emit('plugin:deactivated', { pluginId, plugin });
      
    } catch (error) {
      this.emit('plugin:error', { pluginId, error });
      throw error;
    }
  }

  async uninstall(pluginId: string): Promise<void> {
    try {
      this.emit('plugin:uninstalling', { pluginId });
      
      const plugin = this.registry.get(pluginId);
      if (!plugin) {
        throw new PluginError(`Plugin ${pluginId} not found`, pluginId, 'NOT_FOUND');
      }
      
      // 先停用插件
      if (this.activePlugins.has(pluginId)) {
        await this.deactivate(pluginId);
      }
      
      // 执行卸载钩子
      if (plugin.onUninstall) {
        await plugin.onUninstall();
      }
      
      // 清理数据
      await this.storage.deletePluginState(pluginId);
      await this.storage.deletePluginSettings(pluginId);
      
      // 注销插件
      this.registry.unregister(pluginId);
      
      this.emit('plugin:uninstalled', { pluginId });
      
    } catch (error) {
      this.emit('plugin:error', { pluginId, error });
      throw error;
    }
  }

  async update(pluginId: string, newVersion: string): Promise<void> {
    try {
      this.emit('plugin:updating', { pluginId, newVersion });
      
      const plugin = this.registry.get(pluginId);
      if (!plugin) {
        throw new PluginError(`Plugin ${pluginId} not found`, pluginId, 'NOT_FOUND');
      }
      
      const oldVersion = plugin.metadata.version;
      
      // 执行更新钩子
      if (plugin.onUpdate) {
        await plugin.onUpdate(oldVersion, newVersion);
      }
      
      // 执行数据迁移
      if (plugin.migrate) {
        await plugin.migrate(oldVersion, newVersion);
      }
      
      // 更新版本信息
      plugin.metadata.version = newVersion;
      
      this.emit('plugin:updated', { pluginId, oldVersion, newVersion });
      
    } catch (error) {
      this.emit('plugin:error', { pluginId, error });
      throw error;
    }
  }

  // 查询方法
  getActivePlugins(): Plugin[] {
    return Array.from(this.activePlugins)
      .map(id => this.registry.get(id))
      .filter(Boolean) as Plugin[];
  }

  getInstalledPlugins(): Plugin[] {
    return this.registry.getAll();
  }

  getPlugin(id: string): Plugin | null {
    return this.registry.get(id);
  }

  async getPluginState(id: string): Promise<PluginState | null> {
    return await this.storage.getPluginState(id);
  }

  isActive(pluginId: string): boolean {
    return this.activePlugins.has(pluginId);
  }

  async isInstalled(pluginId: string): Promise<boolean> {
    const state = await this.storage.getPluginState(pluginId);
    return state?.isInstalled || false;
  }

  // 私有辅助方法
  private async autoLoadPlugins(): Promise<void> {
    try {
      const states = await this.storage.getAllPluginStates();
      
      for (const state of states) {
        if (state.isInstalled) {
          try {
            const plugin = await this.loader.load(state.id);
            this.registry.register(plugin);
            
            if (state.isActive) {
              await this.activate(state.id);
            }
          } catch (error) {
            console.error(`Failed to load plugin ${state.id}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Failed to auto-load plugins:', error);
    }
  }

  private async resolveDependencies(plugin: Plugin): Promise<DependencyResolution> {
    const result: DependencyResolution = {
      satisfied: true,
      missing: [],
      conflicts: []
    };

    if (!plugin.metadata.dependencies) {
      return result;
    }

    for (const [depId, requiredVersion] of Object.entries(plugin.metadata.dependencies)) {
      const depPlugin = this.registry.get(depId);
      
      if (!depPlugin) {
        result.missing.push(depId);
        result.satisfied = false;
      } else {
        // 简单版本检查（实际应该使用semver）
        if (depPlugin.metadata.version !== requiredVersion) {
          result.conflicts.push({
            plugin: depId,
            required: requiredVersion,
            actual: depPlugin.metadata.version
          });
          result.satisfied = false;
        }
      }
    }

    return result;
  }

  private registerPluginFeatures(plugin: Plugin): void {
    const pluginId = plugin.metadata.id;
    
    // 注册钩子
    if (plugin.getHooks) {
      const hooks = plugin.getHooks();
      hooks.forEach(hook => {
        this.addHook(hook.name, hook.handler, hook.priority);
      });
    }
    
    // 注册过滤器
    if (plugin.getFilters) {
      const filters = plugin.getFilters();
      filters.forEach(filter => {
        this.addFilter(filter.name, filter.handler, filter.priority);
      });
    }
    
    // 注册CMS集合
    if (plugin.getCMSCollections) {
      const collections = plugin.getCMSCollections();
      this.registerCMSCollections(pluginId, collections);
    }
    
    // 注册CMS页面
    if (plugin.getCMSPages) {
      const pages = plugin.getCMSPages();
      this.registerCMSPages(pluginId, pages);
    }
  }

  private unregisterPluginFeatures(pluginId: string): void {
    // 注销CMS功能
    this.unregisterCMSCollections(pluginId);
    this.unregisterCMSPages(pluginId);
    
    // 注销钩子和过滤器需要更复杂的逻辑
    // 这里简化处理，实际应该跟踪每个插件注册的钩子
  }

  // 钩子系统实现
  addHook(name: string, handler: Function, priority: number = 10): void {
    if (!this.hooks.has(name)) {
      this.hooks.set(name, []);
    }
    
    const hooks = this.hooks.get(name)!;
    hooks.push({ handler, priority });
    hooks.sort((a, b) => a.priority - b.priority);
  }

  removeHook(name: string, handler: Function): void {
    const hooks = this.hooks.get(name);
    if (hooks) {
      const index = hooks.findIndex(h => h.handler === handler);
      if (index !== -1) {
        hooks.splice(index, 1);
      }
    }
  }

  async runHook(name: string, ...args: any[]): Promise<any[]> {
    const hooks = this.hooks.get(name) || [];
    const results = [];
    
    for (const { handler } of hooks) {
      try {
        const result = await handler(...args);
        results.push(result);
      } catch (error) {
        console.error(`Hook ${name} failed:`, error);
      }
    }
    
    return results;
  }

  // 过滤器系统实现
  addFilter(name: string, handler: Function, priority: number = 10): void {
    if (!this.filters.has(name)) {
      this.filters.set(name, []);
    }
    
    const filters = this.filters.get(name)!;
    filters.push({ handler, priority });
    filters.sort((a, b) => a.priority - b.priority);
  }

  removeFilter(name: string, handler: Function): void {
    const filters = this.filters.get(name);
    if (filters) {
      const index = filters.findIndex(f => f.handler === handler);
      if (index !== -1) {
        filters.splice(index, 1);
      }
    }
  }

  applyFilter(name: string, value: any, ...args: any[]): any {
    const filters = this.filters.get(name) || [];
    
    return filters.reduce((currentValue, { handler }) => {
      try {
        return handler(currentValue, ...args);
      } catch (error) {
        console.error(`Filter ${name} failed:`, error);
        return currentValue;
      }
    }, value);
  }

  // CMS集成方法
  registerCMSCollections(pluginId: string, collections: CMSCollection[]): void {
    this.cmsCollections.set(pluginId, collections);
  }

  unregisterCMSCollections(pluginId: string): void {
    this.cmsCollections.delete(pluginId);
  }

  getCMSCollections(): CMSCollection[] {
    const allCollections: CMSCollection[] = [];
    for (const collections of this.cmsCollections.values()) {
      allCollections.push(...collections);
    }
    return allCollections;
  }

  registerCMSPages(pluginId: string, pages: CMSPage[]): void {
    this.cmsPages.set(pluginId, pages);
  }

  unregisterCMSPages(pluginId: string): void {
    this.cmsPages.delete(pluginId);
  }

  getCMSPages(): CMSPage[] {
    const allPages: CMSPage[] = [];
    for (const pages of this.cmsPages.values()) {
      allPages.push(...pages);
    }
    return allPages;
  }

  // 配置管理
  async getPluginSettings(pluginId: string): Promise<PluginSettings> {
    return await this.storage.getPluginSettings(pluginId);
  }

  async updatePluginSettings(pluginId: string, settings: PluginSettings): Promise<void> {
    const plugin = this.registry.get(pluginId);
    
    // 验证设置
    if (plugin?.validateSettings) {
      const validation = plugin.validateSettings(settings);
      if (validation !== true) {
        throw new PluginError(`Invalid settings: ${validation}`, pluginId, 'INVALID_SETTINGS');
      }
    }
    
    await this.storage.setPluginSettings(pluginId, settings);
  }

  // 动态加载方法
  async loadPlugin(pluginId: string): Promise<Plugin> {
    if (this.loadingPlugins.has(pluginId)) {
      throw new PluginError(`Plugin ${pluginId} is already loading`, pluginId, 'ALREADY_LOADING');
    }
    
    this.loadingPlugins.add(pluginId);
    
    try {
      const plugin = await this.loader.load(pluginId);
      this.registry.register(plugin);
      this.emit('plugin:loaded', { pluginId, plugin });
      return plugin;
    } finally {
      this.loadingPlugins.delete(pluginId);
    }
  }

  async unloadPlugin(pluginId: string): Promise<void> {
    if (this.activePlugins.has(pluginId)) {
      await this.deactivate(pluginId);
    }
    
    await this.loader.unload(pluginId);
    this.registry.unregister(pluginId);
    this.emit('plugin:unloaded', { pluginId });
  }

  async reloadPlugin(pluginId: string): Promise<void> {
    await this.unloadPlugin(pluginId);
    await this.loadPlugin(pluginId);
  }
}
