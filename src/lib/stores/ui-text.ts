import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// 定义语言配置类型
export type LanguageConfig = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isDefault: boolean;
};

// 定义UI文本类型
export type UITextType = {
  _meta: {
    supportedLanguages: LanguageConfig[];
  };
  en: {
    nav: Record<string, string>;
    buttons: Record<string, string>;
    blog: Record<string, string>;
    common: Record<string, string>;
  };
  zh: {
    nav: Record<string, string>;
    buttons: Record<string, string>;
    blog: Record<string, string>;
    common: Record<string, string>;
  };
};

// 创建UI文本存储
export const uiTextData = writable<UITextType | null>(null);
export const currentLocale = writable<'en' | 'zh'>('en');
export const uiTextReady = writable(false);

// 创建派生存储，根据当前语言提供文本
export const uiText = derived(
  [uiTextData, currentLocale],
  ([$uiTextData, $currentLocale]) => {
    if (!$uiTextData) {
      return null;
    }
    return $uiTextData[$currentLocale];
  }
);

// 加载UI文本
export async function loadUIText(): Promise<void> {
  try {
    const response = await fetch('/api/ui-text');
    if (!response.ok) {
      throw new Error(`Failed to load UI text: ${response.statusText}`);
    }
    
    const data = await response.json();
    uiTextData.set(data);
    
    // 从localStorage加载当前语言
    if (browser) {
      const savedLocale = localStorage.getItem('locale') as 'en' | 'zh';
      if (savedLocale && (savedLocale === 'en' || savedLocale === 'zh')) {
        currentLocale.set(savedLocale);
      }
    }
    
    uiTextReady.set(true);
  } catch (error) {
    console.error('Error loading UI text:', error);
    uiTextReady.set(true); // 即使出错也标记为已加载，避免无限加载
  }
}

// 切换语言
export function switchLanguage(newLocale: 'en' | 'zh'): void {
  currentLocale.set(newLocale);

  // 保存当前语言到localStorage
  if (browser) {
    localStorage.setItem('locale', newLocale);
  }
}

// 获取支持的语言列表
export const supportedLanguages = derived(
  uiTextData,
  ($uiTextData) => {
    if (!$uiTextData || !$uiTextData._meta) {
      // 如果数据未加载，返回默认配置
      return [
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', isDefault: true },
        { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', isDefault: false }
      ];
    }
    return $uiTextData._meta.supportedLanguages;
  }
);