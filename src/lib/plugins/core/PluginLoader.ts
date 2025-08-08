import type { Plugin, PluginLoader as IPluginLoader, PluginManagerConfig } from './types.js';

/**
 * 插件加载器 - 负责动态加载和卸载插件
 */
export class PluginLoader implements IPluginLoader {
  private loadedPlugins: Map<string, Plugin> = new Map();
  private config: PluginManagerConfig;

  constructor(config: PluginManagerConfig) {
    this.config = config;
  }

  /**
   * 加载插件
   */
  async load(pluginPath: string): Promise<Plugin> {
    try {
      // 检查是否已加载
      if (this.loadedPlugins.has(pluginPath)) {
        return this.loadedPlugins.get(pluginPath)!;
      }

      let plugin: Plugin;

      // 根据环境选择加载方式
      if (typeof window !== 'undefined') {
        // 浏览器环境 - 动态导入
        plugin = await this.loadInBrowser(pluginPath);
      } else {
        // Node.js环境 - 文件系统加载
        plugin = await this.loadInNode(pluginPath);
      }

      // 验证插件
      const validation = this.validate(plugin);
      if (validation !== true) {
        throw new Error(`Plugin validation failed: ${validation}`);
      }

      // 缓存插件
      this.loadedPlugins.set(pluginPath, plugin);

      return plugin;
    } catch (error) {
      throw new Error(`Failed to load plugin ${pluginPath}: ${error}`);
    }
  }

  /**
   * 卸载插件
   */
  async unload(pluginId: string): Promise<void> {
    // 从缓存中移除
    for (const [path, plugin] of this.loadedPlugins.entries()) {
      if (plugin.metadata.id === pluginId) {
        this.loadedPlugins.delete(path);
        break;
      }
    }

    // 在支持的环境中清理模块缓存
    if (typeof require !== 'undefined' && require.cache) {
      // Node.js环境
      for (const path of Object.keys(require.cache)) {
        if (path.includes(pluginId)) {
          delete require.cache[path];
        }
      }
    }
  }

  /**
   * 重新加载插件
   */
  async reload(pluginId: string): Promise<Plugin> {
    await this.unload(pluginId);
    return await this.load(pluginId);
  }

  /**
   * 验证插件
   */
  validate(plugin: Plugin): boolean | string {
    try {
      // 检查必需的元数据
      if (!plugin.metadata) {
        return 'Plugin must have metadata';
      }

      const { metadata } = plugin;

      if (!metadata.id) {
        return 'Plugin must have an id';
      }

      if (!metadata.name) {
        return 'Plugin must have a name';
      }

      if (!metadata.version) {
        return 'Plugin must have a version';
      }

      if (!metadata.author) {
        return 'Plugin must have an author';
      }

      // 验证ID格式
      if (!/^[a-zA-Z0-9_-]+$/.test(metadata.id)) {
        return 'Plugin ID must contain only letters, numbers, hyphens, and underscores';
      }

      // 验证版本格式
      if (!/^\d+\.\d+\.\d+/.test(metadata.version)) {
        return 'Plugin version must follow semantic versioning (x.y.z)';
      }

      // 验证生命周期方法（如果存在）
      const lifecycleMethods = ['onInstall', 'onActivate', 'onDeactivate', 'onUninstall', 'onUpdate'];
      for (const method of lifecycleMethods) {
        if (plugin[method] && typeof plugin[method] !== 'function') {
          return `${method} must be a function`;
        }
      }

      // 验证CMS方法（如果存在）
      const cmsMethods = ['getCMSCollections', 'getCMSPages'];
      for (const method of cmsMethods) {
        if (plugin[method] && typeof plugin[method] !== 'function') {
          return `${method} must be a function`;
        }
      }

      // 验证前端方法（如果存在）
      const frontendMethods = ['getComponents', 'getRoutes'];
      for (const method of frontendMethods) {
        if (plugin[method] && typeof plugin[method] !== 'function') {
          return `${method} must be a function`;
        }
      }

      return true;
    } catch (error) {
      return `Validation error: ${error}`;
    }
  }

  /**
   * 获取已加载的插件
   */
  getLoadedPlugins(): Plugin[] {
    return Array.from(this.loadedPlugins.values());
  }

  /**
   * 检查插件是否已加载
   */
  isLoaded(pluginId: string): boolean {
    for (const plugin of this.loadedPlugins.values()) {
      if (plugin.metadata.id === pluginId) {
        return true;
      }
    }
    return false;
  }

  /**
   * 清空加载缓存
   */
  clearCache(): void {
    this.loadedPlugins.clear();
  }

  // 私有方法

  /**
   * 在浏览器环境中加载插件
   */
  private async loadInBrowser(pluginPath: string): Promise<Plugin> {
    try {
      // 动态导入插件模块
      const module = await import(pluginPath);
      
      // 支持不同的导出格式
      let plugin: Plugin;
      
      if (module.default) {
        // ES6 默认导出
        plugin = typeof module.default === 'function' 
          ? new module.default() 
          : module.default;
      } else if (module.plugin) {
        // 命名导出
        plugin = typeof module.plugin === 'function' 
          ? new module.plugin() 
          : module.plugin;
      } else {
        // 直接导出
        plugin = module;
      }

      return plugin;
    } catch (error) {
      throw new Error(`Failed to load plugin in browser: ${error}`);
    }
  }

  /**
   * 在Node.js环境中加载插件
   */
  private async loadInNode(pluginPath: string): Promise<Plugin> {
    try {
      // 使用动态导入或require
      let module: any;
      
      if (pluginPath.endsWith('.mjs') || pluginPath.includes('esm')) {
        // ES模块
        module = await import(pluginPath);
      } else {
        // CommonJS模块
        if (typeof require !== 'undefined') {
          // 清除缓存以支持热重载
          if (require.cache[pluginPath]) {
            delete require.cache[pluginPath];
          }
          module = require(pluginPath);
        } else {
          // 在不支持require的环境中使用动态导入
          module = await import(pluginPath);
        }
      }

      // 支持不同的导出格式
      let plugin: Plugin;
      
      if (module.default) {
        plugin = typeof module.default === 'function' 
          ? new module.default() 
          : module.default;
      } else if (module.plugin) {
        plugin = typeof module.plugin === 'function' 
          ? new module.plugin() 
          : module.plugin;
      } else {
        plugin = module;
      }

      return plugin;
    } catch (error) {
      throw new Error(`Failed to load plugin in Node.js: ${error}`);
    }
  }

  /**
   * 预加载插件（不执行，只验证）
   */
  async preload(pluginPath: string): Promise<boolean> {
    try {
      const plugin = await this.load(pluginPath);
      const validation = this.validate(plugin);
      return validation === true;
    } catch (error) {
      console.error(`Preload failed for ${pluginPath}:`, error);
      return false;
    }
  }

  /**
   * 批量加载插件
   */
  async loadBatch(pluginPaths: string[]): Promise<Array<{ path: string; plugin?: Plugin; error?: Error }>> {
    const results = [];
    const maxConcurrent = this.config.maxConcurrentLoads || 5;
    
    // 分批处理以避免过多并发
    for (let i = 0; i < pluginPaths.length; i += maxConcurrent) {
      const batch = pluginPaths.slice(i, i + maxConcurrent);
      
      const batchPromises = batch.map(async (path) => {
        try {
          const plugin = await this.load(path);
          return { path, plugin };
        } catch (error) {
          return { path, error: error as Error };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    return results;
  }

  /**
   * 获取插件加载统计
   */
  getLoadStats(): {
    totalLoaded: number;
    loadedPlugins: Array<{ id: string; name: string; version: string }>;
    memoryUsage?: number;
  } {
    const plugins = this.getLoadedPlugins();
    
    return {
      totalLoaded: plugins.length,
      loadedPlugins: plugins.map(p => ({
        id: p.metadata.id,
        name: p.metadata.name,
        version: p.metadata.version
      })),
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  /**
   * 估算内存使用量
   */
  private estimateMemoryUsage(): number | undefined {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed;
    }
    return undefined;
  }
}
