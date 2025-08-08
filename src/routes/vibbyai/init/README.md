# tenniszero.org 系统初始化向导

这是一个完整的系统初始化向导实现，帮助用户快速配置 tenniszero.org 平台的各种服务和功能。

## 文件结构

```
src/routes/vibbyai/init/
├── +page.svelte                 # 主向导页面
├── steps/                       # 配置步骤组件
│   ├── StepWelcome.svelte      # 欢迎页面
│   ├── StepBasic.svelte        # 基础配置
│   ├── StepDatabase.svelte     # 数据库配置
│   ├── StepSecurity.svelte     # 安全配置
│   ├── StepEmail.svelte        # 邮件服务配置
│   ├── StepAnalytics.svelte    # 网站分析配置
│   ├── StepSocialAuth.svelte   # 社交登录配置
│   ├── StepPayment.svelte      # 支付服务配置
│   └── StepComplete.svelte     # 完成页面
├── test/
│   └── +page.svelte            # 测试页面
└── README.md                   # 本文件
```

## 核心功能

### 1. 环境变量管理服务
- **位置**: `src/lib/services/env-manager.ts`
- **功能**: 读取、写入、验证环境变量配置
- **特性**: 
  - 类型安全的配置接口
  - 配置验证和错误处理
  - 加密密钥生成
  - 安全的敏感信息处理

### 2. 步骤化配置向导
- **多步骤流程**: 7个配置步骤 + 欢迎和完成页面
- **响应式设计**: 支持桌面和移动设备
- **实时验证**: 输入验证和格式检查
- **连接测试**: 各服务的连接测试功能

### 3. API 接口
- **配置管理**: `/api/env-config` - CRUD 操作
- **服务测试**:
  - `/api/test-supabase` - 数据库连接测试
  - `/api/test-email` - 邮件服务测试

## 支持的服务

### 必需服务
1. **基础配置**: 网站 URL、运行环境
2. **数据库**: Supabase 配置和连接测试
3. **安全**: 加密密钥生成和管理

### 可选服务
4. **邮件服务**: SMTP 配置（Gmail、Outlook、企业邮箱）
5. **网站分析**: Google Analytics、Microsoft Clarity
6. **社交登录**: GitHub OAuth、Google OAuth
7. **支付服务**: Stripe 配置和环境验证

## 技术特性

### 安全性
- **加密存储**: 敏感信息使用 AES-256-GCM 加密
- **密钥管理**: 安全的密钥生成和验证
- **权限控制**: 管理员权限验证
- **输入验证**: 严格的输入格式验证

### 用户体验
- **进度指示**: 清晰的步骤进度显示
- **实时反馈**: 即时的验证和错误提示
- **连接测试**: 一键测试服务连接
- **配置预览**: 完成后的配置摘要

### 开发体验
- **类型安全**: 完整的 TypeScript 类型定义
- **模块化**: 可复用的步骤组件
- **可扩展**: 易于添加新的配置步骤
- **文档完整**: 详细的使用和开发文档

## 使用方法

### 1. 访问向导
```
/vibbyai/init
```

### 2. 配置流程
1. 欢迎页面 - 介绍和准备
2. 基础配置 - 网站 URL 和环境
3. 数据库配置 - Supabase 设置
4. 安全配置 - 加密密钥生成
5. 邮件服务 - SMTP 配置（可选）
6. 网站分析 - GA 和 Clarity（可选）
7. 社交登录 - OAuth 配置（可选）
8. 支付服务 - Stripe 配置（可选）
9. 完成页面 - 摘要和下一步

### 3. 配置测试
每个步骤都提供连接测试功能：
- 数据库连接验证
- 邮件发送测试
- 配置格式验证

## 开发指南

### 添加新的配置步骤

1. **创建步骤组件**:
```svelte
<!-- src/routes/vibbyai/init/steps/StepNewService.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { EnvConfig, ConfigStep } from '$lib/services/env-manager';
  
  // 组件逻辑
</script>

<!-- 组件模板 -->
```

2. **更新配置定义**:
```typescript
// src/lib/services/env-manager.ts
export interface EnvConfig {
  // 添加新的配置字段
  NEW_SERVICE_KEY?: string;
}

// 更新配置步骤
export const CONFIG_STEPS: ConfigStep[] = [
  // 添加新步骤
  {
    id: 'new-service',
    title: 'New Service',
    description: 'Configure new service',
    fields: [...]
  }
];
```

3. **添加 API 测试端点**（如果需要）:
```typescript
// src/routes/api/test-new-service/+server.ts
export const POST: RequestHandler = async ({ request }) => {
  // 测试逻辑
};
```

### 自定义样式和主题

向导使用 Tailwind CSS，可以通过修改类名来自定义样式：

```svelte
<!-- 自定义按钮样式 -->
<button class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
  Custom Button
</button>
```

### 扩展验证规则

在 `env-manager.ts` 中添加新的验证函数：

```typescript
export function validateNewService(config: EnvConfig): ValidationResult {
  const errors: string[] = [];
  
  if (!config.NEW_SERVICE_KEY) {
    errors.push('New service key is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

## 部署注意事项

### 环境变量
确保生产环境中设置了必要的环境变量：
```bash
NODE_ENV=production
PUBLIC_SITE_URL=https://your-domain.com
# 其他配置...
```

### 权限设置
- 确保 `.env` 文件有适当的读写权限
- 生产环境中限制对初始化向导的访问
- 定期备份配置文件

### 安全考虑
- 在生产环境中禁用测试端点
- 使用 HTTPS 保护敏感数据传输
- 定期轮换加密密钥和 API 密钥

## 故障排除

### 常见问题
1. **配置保存失败**: 检查文件权限和磁盘空间
2. **服务连接失败**: 验证网络连接和凭证
3. **加密错误**: 确保加密密钥格式正确

### 调试模式
设置环境变量启用详细日志：
```bash
DEBUG=vibbyai:init
```

### 重置配置
如需重新配置，删除 `.env` 文件并重新运行向导。

## 贡献指南

欢迎贡献代码和改进建议！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证。详见 LICENSE 文件。
