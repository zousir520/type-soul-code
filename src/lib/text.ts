import { derived } from 'svelte/store';
import { uiText, uiTextReady, loadUIText, switchLanguage, currentLocale, supportedLanguages } from './stores/ui-text';

// 创建一个派生存储，提供安全的文本访问
export const T = derived(
  uiText,
  ($uiText) => {
    // 如果文本未加载，返回一个空对象结构
    if (!$uiText) {
      return {
        nav: {},
        buttons: {},
        blog: {},
        common: {}
      };
    }
    return $uiText;
  }
);

// 导出所有需要的函数和存储
export { uiTextReady, loadUIText, switchLanguage, currentLocale, supportedLanguages };

// 初始化函数
export async function initText(): Promise<void> {
  await loadUIText();
}