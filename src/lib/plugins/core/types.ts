// 插件系统核心类型定义

export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  homepage?: string;
  repository?: string;
  license?: string;
  keywords?: string[];
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

export interface CMSField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'url' | 'email' | 'text' | 'select' | 'multiselect' | 'date' | 'datetime' | 'json';
  label: string;
  description?: string;
  required?: boolean;
  default?: any;
  options?: Array<{ value: any; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => boolean | string;
  };
}

export interface CMSCollection {
  name: string;
  label: string;
  description?: string;
  fields: CMSField[];
  permissions?: {
    create?: boolean;
    read?: boolean;
    update?: boolean;
    delete?: boolean;
  };
  hooks?: {
    beforeCreate?: (data: any) => Promise<any>;
    afterCreate?: (data: any) => Promise<void>;
    beforeUpdate?: (data: any) => Promise<any>;
    afterUpdate?: (data: any) => Promise<void>;
    beforeDelete?: (id: string) => Promise<void>;
    afterDelete?: (id: string) => Promise<void>;
  };
}

export interface CMSPage {
  name: string;
  label: string;
  description?: string;
  component: string;
  route?: string;
  permissions?: string[];
}

export interface PluginComponent {
  name: string;
  component: any;
  props?: Record<string, any>;
  slot?: string;
  priority?: number;
}

export interface PluginRoute {
  path: string;
  component: any;
  layout?: any;
  preload?: (context: { params: Record<string, string>; url?: URL; route?: any }) => Promise<any>;
  permissions?: string[];
}

export interface PluginHook {
  name: string;
  handler: (...args: any[]) => any;
  priority?: number;
}

export interface PluginFilter {
  name: string;
  handler: (value: any, ...args: any[]) => any;
  priority?: number;
}

export interface PluginSettings {
  [key: string]: any;
}

export interface PluginState {
  id: string;
  isActive: boolean;
  isInstalled: boolean;
  settings: PluginSettings;
  installedAt?: Date;
  activatedAt?: Date;
  lastError?: string;
}

export interface Plugin {
  // 基本信息
  metadata: PluginMetadata;
  
  // 生命周期钩子
  onInstall?(): Promise<void>;
  onActivate?(): Promise<void>;
  onDeactivate?(): Promise<void>;
  onUninstall?(): Promise<void>;
  onUpdate?(oldVersion: string, newVersion: string): Promise<void>;
  
  // CMS集成
  getCMSCollections?(): CMSCollection[];
  getCMSPages?(): CMSPage[];
  
  // 前端集成
  getComponents?(): PluginComponent[];
  getRoutes?(): PluginRoute[];
  
  // 钩子和过滤器
  getHooks?(): PluginHook[];
  getFilters?(): PluginFilter[];
  
  // 设置和配置
  getDefaultSettings?(): PluginSettings;
  validateSettings?(settings: PluginSettings): boolean | string;
  
  // 依赖检查
  checkDependencies?(): Promise<boolean>;
  
  // 数据迁移
  migrate?(fromVersion: string, toVersion: string): Promise<void>;
  
  // 索引签名 - 允许动态访问插件方法
  [key: string]: any;
}

export interface PluginManagerConfig {
  pluginsDir: string;
  autoLoad: boolean;
  enableHotReload: boolean;
  maxConcurrentLoads: number;
  cacheEnabled: boolean;
  securityMode: 'strict' | 'moderate' | 'permissive';
}

export interface PluginManager {
  // 插件管理
  install(plugin: Plugin): Promise<void>;
  activate(pluginId: string): Promise<void>;
  deactivate(pluginId: string): Promise<void>;
  uninstall(pluginId: string): Promise<void>;
  update(pluginId: string, newVersion: string): Promise<void>;
  
  // 查询
  getActivePlugins(): Plugin[];
  getInstalledPlugins(): Plugin[];
  getPlugin(id: string): Plugin | null;
  getPluginState(id: string): Promise<PluginState | null>;
  isActive(pluginId: string): boolean;
  isInstalled(pluginId: string): Promise<boolean>;
  
  // 动态加载
  loadPlugin(pluginId: string): Promise<Plugin>;
  unloadPlugin(pluginId: string): Promise<void>;
  reloadPlugin(pluginId: string): Promise<void>;
  
  // 钩子系统
  addHook(name: string, handler: Function, priority?: number): void;
  removeHook(name: string, handler: Function): void;
  runHook(name: string, ...args: any[]): Promise<any[]>;
  
  // 过滤器系统
  addFilter(name: string, handler: Function, priority?: number): void;
  removeFilter(name: string, handler: Function): void;
  applyFilter(name: string, value: any, ...args: any[]): any;
  
  // 事件系统
  emit(event: string, data?: any): void;
  on(event: string, handler: Function): void;
  off(event: string, handler: Function): void;
  
  // 配置管理
  getPluginSettings(pluginId: string): PluginSettings;
  updatePluginSettings(pluginId: string, settings: PluginSettings): Promise<void>;
  
  // CMS集成
  registerCMSCollections(pluginId: string, collections: CMSCollection[]): void;
  unregisterCMSCollections(pluginId: string): void;
  getCMSCollections(): CMSCollection[];
  
  registerCMSPages(pluginId: string, pages: CMSPage[]): void;
  unregisterCMSPages(pluginId: string): void;
  getCMSPages(): CMSPage[];
}

export interface PluginRegistry {
  register(plugin: Plugin): void;
  unregister(pluginId: string): void;
  get(pluginId: string): Plugin | null;
  getAll(): Plugin[];
  has(pluginId: string): boolean;
  clear(): void;
}

export interface PluginLoader {
  load(pluginPath: string): Promise<Plugin>;
  unload(pluginId: string): Promise<void>;
  reload(pluginId: string): Promise<Plugin>;
  validate(plugin: Plugin): boolean | string;
}

export interface PluginStorage {
  getPluginState(pluginId: string): Promise<PluginState | null>;
  setPluginState(pluginId: string, state: PluginState): Promise<void>;
  deletePluginState(pluginId: string): Promise<void>;
  getAllPluginStates(): Promise<PluginState[]>;
  
  getPluginSettings(pluginId: string): Promise<PluginSettings>;
  setPluginSettings(pluginId: string, settings: PluginSettings): Promise<void>;
  deletePluginSettings(pluginId: string): Promise<void>;
}

// 插件事件类型
export type PluginEvent = 
  | 'plugin:installing'
  | 'plugin:installed'
  | 'plugin:activating'
  | 'plugin:activated'
  | 'plugin:deactivating'
  | 'plugin:deactivated'
  | 'plugin:uninstalling'
  | 'plugin:uninstalled'
  | 'plugin:updating'
  | 'plugin:updated'
  | 'plugin:error'
  | 'plugin:loaded'
  | 'plugin:unloaded';

// 插件错误类型
export class PluginError extends Error {
  constructor(
    message: string,
    public pluginId: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'PluginError';
  }
}

// 依赖解析结果
export interface DependencyResolution {
  satisfied: boolean;
  missing: string[];
  conflicts: Array<{
    plugin: string;
    required: string;
    actual: string;
  }>;
}

// 插件安全策略
export interface PluginSecurityPolicy {
  allowedDomains: string[];
  allowedAPIs: string[];
  maxMemoryUsage: number;
  maxExecutionTime: number;
  sandboxEnabled: boolean;
}

// 插件性能指标
export interface PluginPerformanceMetrics {
  pluginId: string;
  loadTime: number;
  memoryUsage: number;
  cpuUsage: number;
  errorCount: number;
  lastAccessed: Date;
}
