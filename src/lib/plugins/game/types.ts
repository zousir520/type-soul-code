// 游戏插件相关类型定义

export interface GameConfig {
  id: string;
  name: string;
  type: 'homegame' | 'recommendgame';
  iframe_url: string;
  iframe_width?: string;
  iframe_height?: string;
  iframe_attributes?: Record<string, string>;
  is_active: boolean;
  display_order?: number;
  thumbnail?: string;
  description?: string;
  category?: string;
  tags?: string[];
  rating?: number;
  play_count?: number;
  created_at: string;
  updated_at: string;
}

export interface GamePluginSettings {
  // 功能开关
  enable_hero_game: boolean;
  enable_recommend_games: boolean;
  
  // 显示设置
  max_recommend_games: number;
  show_game_thumbnails: boolean;
  show_game_ratings: boolean;
  show_play_counts: boolean;
  
  // 默认iframe设置
  default_iframe_width: string;
  default_iframe_height: string;
  default_iframe_sandbox: string;
  
  // 安全设置
  allowed_domains: string[];
  enable_csp: boolean;
  
  // 样式设置
  hero_game_container_class: string;
  recommend_games_container_class: string;
  game_item_class: string;
  
  // 性能设置
  lazy_load_games: boolean;
  preload_hero_game: boolean;
  cache_duration: number;
}

export interface GameDisplayOptions {
  width?: string;
  height?: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  sandbox?: string;
  allow?: string;
  loading?: 'lazy' | 'eager';
  className?: string;
  style?: Record<string, string>;
}

export interface GameCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  display_order: number;
}

export interface GameStats {
  total_games: number;
  active_games: number;
  hero_games: number;
  recommend_games: number;
  total_plays: number;
  average_rating: number;
  categories: Array<{
    category: string;
    count: number;
  }>;
}

export interface GameFilter {
  category?: string;
  type?: 'homegame' | 'recommendgame';
  is_active?: boolean;
  min_rating?: number;
  tags?: string[];
  search?: string;
}

export interface GameSort {
  field: 'name' | 'created_at' | 'updated_at' | 'rating' | 'play_count' | 'display_order';
  direction: 'asc' | 'desc';
}

// 游戏事件类型
export type GameEvent = 
  | 'game:loaded'
  | 'game:played'
  | 'game:error'
  | 'game:fullscreen'
  | 'game:exit_fullscreen'
  | 'game:paused'
  | 'game:resumed';

export interface GameEventData {
  gameId: string;
  gameName: string;
  gameType: 'homegame' | 'recommendgame';
  timestamp: Date;
  data?: any;
}

// 游戏安全策略
export interface GameSecurityPolicy {
  allowed_domains: string[];
  blocked_domains: string[];
  sandbox_attributes: string[];
  csp_directives: Record<string, string>;
  max_iframe_size: {
    width: number;
    height: number;
  };
  require_https: boolean;
  block_popups: boolean;
}

// 游戏性能配置
export interface GamePerformanceConfig {
  lazy_loading: boolean;
  preload_strategy: 'none' | 'hero' | 'visible' | 'all';
  cache_strategy: 'none' | 'memory' | 'disk' | 'both';
  max_concurrent_loads: number;
  timeout_duration: number;
  retry_attempts: number;
}

// 游戏分析数据
export interface GameAnalytics {
  game_id: string;
  event_type: GameEvent;
  timestamp: Date;
  user_id?: string;
  session_id: string;
  duration?: number;
  metadata?: Record<string, any>;
}

// 游戏组件属性
export interface GameComponentProps {
  game: GameConfig;
  options?: GameDisplayOptions;
  onLoad?: (game: GameConfig) => void;
  onError?: (error: Error, game: GameConfig) => void;
  onPlay?: (game: GameConfig) => void;
  className?: string;
  style?: Record<string, string>;
}

// 游戏列表组件属性
export interface GameListProps {
  games: GameConfig[];
  type?: 'homegame' | 'recommendgame';
  limit?: number;
  showThumbnails?: boolean;
  showRatings?: boolean;
  showPlayCounts?: boolean;
  onGameSelect?: (game: GameConfig) => void;
  className?: string;
  itemClassName?: string;
}

// 游戏管理API接口
export interface GameAPI {
  // 游戏CRUD
  getGames(filter?: GameFilter, sort?: GameSort): Promise<GameConfig[]>;
  getGame(id: string): Promise<GameConfig | null>;
  createGame(game: Omit<GameConfig, 'id' | 'created_at' | 'updated_at'>): Promise<GameConfig>;
  updateGame(id: string, updates: Partial<GameConfig>): Promise<GameConfig>;
  deleteGame(id: string): Promise<void>;
  
  // 游戏状态管理
  activateGame(id: string): Promise<void>;
  deactivateGame(id: string): Promise<void>;
  reorderGames(gameIds: string[]): Promise<void>;
  
  // 游戏分类
  getCategories(): Promise<GameCategory[]>;
  createCategory(category: Omit<GameCategory, 'id'>): Promise<GameCategory>;
  updateCategory(id: string, updates: Partial<GameCategory>): Promise<GameCategory>;
  deleteCategory(id: string): Promise<void>;
  
  // 游戏统计
  getStats(): Promise<GameStats>;
  getGameAnalytics(gameId: string, startDate?: Date, endDate?: Date): Promise<GameAnalytics[]>;
  recordGameEvent(event: Omit<GameAnalytics, 'timestamp'>): Promise<void>;
  
  // 游戏验证
  validateGameUrl(url: string): Promise<boolean>;
  checkGameSecurity(game: GameConfig): Promise<{ safe: boolean; issues: string[] }>;
  
  // 游戏导入导出
  exportGames(): Promise<string>;
  importGames(data: string): Promise<{ success: number; errors: string[] }>;
}

// 游戏插件配置
export interface GamePluginConfig {
  settings: GamePluginSettings;
  security: GameSecurityPolicy;
  performance: GamePerformanceConfig;
  api_endpoints: {
    games: string;
    categories: string;
    analytics: string;
  };
  cms_collections: string[];
  default_games: GameConfig[];
}

// 游戏错误类型
export class GameError extends Error {
  constructor(
    message: string,
    public gameId: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'GameError';
  }
}

// 游戏验证结果
export interface GameValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  security_issues: string[];
  performance_issues: string[];
}

// 游戏缓存接口
export interface GameCache {
  get(key: string): Promise<any>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  size(): Promise<number>;
}
