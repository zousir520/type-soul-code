// 语言参数验证器
import type { ParamMatcher } from '@sveltejs/kit';

// 支持的语言代码
const SUPPORTED_LANGUAGES = ['en', 'zh', 'es', 'jp', 'fr', 'de', 'ko'];

export const match: ParamMatcher = (param) => {
  return SUPPORTED_LANGUAGES.includes(param);
};