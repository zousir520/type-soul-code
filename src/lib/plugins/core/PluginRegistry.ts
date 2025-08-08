import type { Plugin, PluginRegistry as IPluginRegistry } from './types.js';

/**
 * 插件注册表 - 管理已注册的插件
 */
export class PluginRegistry implements IPluginRegistry {
  private plugins: Map<string, Plugin> = new Map();

  /**
   * 注册插件
   */
  register(plugin: Plugin): void {
    const pluginId = plugin.metadata.id;
    
    if (this.plugins.has(pluginId)) {
      throw new Error(`Plugin ${pluginId} is already registered`);
    }
    
    // 验证插件基本信息
    this.validatePlugin(plugin);
    
    this.plugins.set(pluginId, plugin);
  }

  /**
   * 注销插件
   */
  unregister(pluginId: string): void {
    this.plugins.delete(pluginId);
  }

  /**
   * 获取插件
   */
  get(pluginId: string): Plugin | null {
    return this.plugins.get(pluginId) || null;
  }

  /**
   * 获取所有插件
   */
  getAll(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * 检查插件是否存在
   */
  has(pluginId: string): boolean {
    return this.plugins.has(pluginId);
  }

  /**
   * 清空注册表
   */
  clear(): void {
    this.plugins.clear();
  }

  /**
   * 获取插件数量
   */
  size(): number {
    return this.plugins.size;
  }

  /**
   * 获取所有插件ID
   */
  getPluginIds(): string[] {
    return Array.from(this.plugins.keys());
  }

  /**
   * 根据条件查找插件
   */
  findPlugins(predicate: (plugin: Plugin) => boolean): Plugin[] {
    return this.getAll().filter(predicate);
  }

  /**
   * 根据作者查找插件
   */
  findByAuthor(author: string): Plugin[] {
    return this.findPlugins(plugin => plugin.metadata.author === author);
  }

  /**
   * 根据关键词查找插件
   */
  findByKeyword(keyword: string): Plugin[] {
    return this.findPlugins(plugin => 
      plugin.metadata.keywords?.includes(keyword) || false
    );
  }

  /**
   * 根据版本范围查找插件
   */
  findByVersionRange(minVersion: string, maxVersion?: string): Plugin[] {
    return this.findPlugins(plugin => {
      const version = plugin.metadata.version;
      const isAboveMin = this.compareVersions(version, minVersion) >= 0;
      const isBelowMax = maxVersion ? this.compareVersions(version, maxVersion) <= 0 : true;
      return isAboveMin && isBelowMax;
    });
  }

  /**
   * 获取插件依赖关系图
   */
  getDependencyGraph(): Map<string, string[]> {
    const graph = new Map<string, string[]>();
    
    for (const plugin of this.plugins.values()) {
      const dependencies = plugin.metadata.dependencies 
        ? Object.keys(plugin.metadata.dependencies)
        : [];
      graph.set(plugin.metadata.id, dependencies);
    }
    
    return graph;
  }

  /**
   * 检查循环依赖
   */
  checkCircularDependencies(): string[] {
    const graph = this.getDependencyGraph();
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const cycles: string[] = [];

    const dfs = (pluginId: string, path: string[]): void => {
      if (recursionStack.has(pluginId)) {
        const cycleStart = path.indexOf(pluginId);
        const cycle = path.slice(cycleStart).concat(pluginId);
        cycles.push(cycle.join(' -> '));
        return;
      }

      if (visited.has(pluginId)) {
        return;
      }

      visited.add(pluginId);
      recursionStack.add(pluginId);

      const dependencies = graph.get(pluginId) || [];
      for (const dep of dependencies) {
        dfs(dep, [...path, pluginId]);
      }

      recursionStack.delete(pluginId);
    };

    for (const pluginId of graph.keys()) {
      if (!visited.has(pluginId)) {
        dfs(pluginId, []);
      }
    }

    return cycles;
  }

  /**
   * 获取插件加载顺序（拓扑排序）
   */
  getLoadOrder(): string[] {
    const graph = this.getDependencyGraph();
    const inDegree = new Map<string, number>();
    const result: string[] = [];
    const queue: string[] = [];

    // 初始化入度
    for (const pluginId of graph.keys()) {
      inDegree.set(pluginId, 0);
    }

    // 计算入度
    for (const dependencies of graph.values()) {
      for (const dep of dependencies) {
        if (inDegree.has(dep)) {
          inDegree.set(dep, (inDegree.get(dep) || 0) + 1);
        }
      }
    }

    // 找到入度为0的节点
    for (const [pluginId, degree] of inDegree.entries()) {
      if (degree === 0) {
        queue.push(pluginId);
      }
    }

    // 拓扑排序
    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      const dependencies = graph.get(current) || [];
      for (const dep of dependencies) {
        if (inDegree.has(dep)) {
          const newDegree = (inDegree.get(dep) || 0) - 1;
          inDegree.set(dep, newDegree);
          
          if (newDegree === 0) {
            queue.push(dep);
          }
        }
      }
    }

    // 检查是否有循环依赖
    if (result.length !== graph.size) {
      throw new Error('Circular dependency detected in plugins');
    }

    return result;
  }

  /**
   * 验证插件
   */
  private validatePlugin(plugin: Plugin): void {
    const { metadata } = plugin;
    
    if (!metadata.id) {
      throw new Error('Plugin must have an id');
    }
    
    if (!metadata.name) {
      throw new Error('Plugin must have a name');
    }
    
    if (!metadata.version) {
      throw new Error('Plugin must have a version');
    }
    
    if (!metadata.author) {
      throw new Error('Plugin must have an author');
    }
    
    // 验证ID格式（只允许字母、数字、连字符、下划线）
    if (!/^[a-zA-Z0-9_-]+$/.test(metadata.id)) {
      throw new Error('Plugin ID must contain only letters, numbers, hyphens, and underscores');
    }
    
    // 验证版本格式（简单的语义版本检查）
    if (!/^\d+\.\d+\.\d+/.test(metadata.version)) {
      throw new Error('Plugin version must follow semantic versioning (x.y.z)');
    }
  }

  /**
   * 比较版本号
   */
  private compareVersions(version1: string, version2: string): number {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    const maxLength = Math.max(v1Parts.length, v2Parts.length);
    
    for (let i = 0; i < maxLength; i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;
      
      if (v1Part > v2Part) return 1;
      if (v1Part < v2Part) return -1;
    }
    
    return 0;
  }

  /**
   * 导出插件信息
   */
  export(): Array<{
    id: string;
    name: string;
    version: string;
    author: string;
    description: string;
    dependencies?: Record<string, string>;
  }> {
    return this.getAll().map(plugin => ({
      id: plugin.metadata.id,
      name: plugin.metadata.name,
      version: plugin.metadata.version,
      author: plugin.metadata.author,
      description: plugin.metadata.description,
      dependencies: plugin.metadata.dependencies
    }));
  }

  /**
   * 获取插件统计信息
   */
  getStats(): {
    totalPlugins: number;
    pluginsByAuthor: Record<string, number>;
    averageVersion: string;
    dependencyCount: number;
  } {
    const plugins = this.getAll();
    const totalPlugins = plugins.length;
    
    // 按作者统计
    const pluginsByAuthor: Record<string, number> = {};
    for (const plugin of plugins) {
      const author = plugin.metadata.author;
      pluginsByAuthor[author] = (pluginsByAuthor[author] || 0) + 1;
    }
    
    // 计算平均版本（简化计算）
    const versions = plugins.map(p => p.metadata.version);
    const majorVersions = versions.map(v => parseInt(v.split('.')[0]));
    const avgMajor = Math.round(majorVersions.reduce((a, b) => a + b, 0) / majorVersions.length);
    const averageVersion = `${avgMajor}.0.0`;
    
    // 依赖数量
    const dependencyCount = plugins.reduce((count, plugin) => {
      return count + (plugin.metadata.dependencies ? Object.keys(plugin.metadata.dependencies).length : 0);
    }, 0);
    
    return {
      totalPlugins,
      pluginsByAuthor,
      averageVersion,
      dependencyCount
    };
  }
}
