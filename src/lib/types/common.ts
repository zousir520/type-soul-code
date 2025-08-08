// 通用类型定义
export interface GenericRecord {
  [key: string]: unknown;
}

// API 响应相关类型
export interface BaseApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ApiResponse<TData = unknown> extends BaseApiResponse {
  data?: TData;
}

export interface PaginatedResponse<TData = unknown> extends BaseApiResponse {
  data: TData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 内容相关类型
export interface ContentItem {
  id: string;
  title: string;
  content: string;
  description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface BlogPost extends ContentItem {
  slug: string;
  author?: string;
  published?: boolean;
  featured_image?: string;
  excerpt?: string;
}

// 设置和配置类型
export interface ConfigValue {
  key: string;
  value: unknown;
  description?: string;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
}

export interface UserSettings {
  [key: string]: unknown;
}

// 用户相关类型
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
  metadata?: GenericRecord;
  created_at: string;
  updated_at: string;
}

// 插件相关类型
export interface PluginConfig {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  settings: GenericRecord;
  dependencies?: string[];
}

export interface PluginHookResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

// 日志和事件类型
export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: GenericRecord;
  source?: string;
  timestamp: string;
}

export interface EventData {
  type: string;
  payload: GenericRecord;
  timestamp: string;
  source?: string;
}

// 错误处理类型
export interface ErrorDetails {
  code: string;
  message: string;
  details?: GenericRecord;
  stack?: string;
}

// 表单和验证类型
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  custom?: (value: unknown) => boolean | string;
}

export interface FormField {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  default?: unknown;
  options?: Array<{ value: unknown; label: string }>;
  validation?: ValidationRule;
}

// 数据库相关类型
export interface DatabaseRecord {
  id: string;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

// HTTP 请求/响应类型
export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

export interface HttpResponse<TData = unknown> {
  status: number;
  statusText: string;
  data: TData;
  headers: Record<string, string>;
}

// 文件和媒体类型
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  url?: string;
  path?: string;
  metadata?: GenericRecord;
}

// 搜索和过滤类型
export interface SearchParams {
  query?: string;
  filters?: GenericRecord;
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

export interface SearchResult<TData = unknown> {
  items: TData[];
  total: number;
  query: string;
  facets?: GenericRecord;
}