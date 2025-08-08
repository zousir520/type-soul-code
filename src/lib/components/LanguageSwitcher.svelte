<script lang="ts">
  import { currentLocale, switchLanguage, supportedLanguages } from '$lib/text';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';

  // 检测当前语言
  let currentLang = $state('en');
  let isOpen = $state(false);

  // 根据URL检测当前语言
  $effect(() => {
    if (browser) {
      const pathname = $page.url.pathname;
      if (pathname.startsWith('/zh')) {
        currentLang = 'zh';
      } else {
        currentLang = 'en';
      }
    }
  });

  // 获取当前语言信息
  const getCurrentLanguage = () => {
    const languages = $supportedLanguages;
    return languages.find(lang => lang.code === currentLang) || languages[0];
  };

  // 切换语言
  function switchToLanguage(langCode: string) {
    if (langCode === currentLang) {
      isOpen = false;
      return;
    }

    switchLanguage(langCode as 'en' | 'zh');

    if (browser) {
      const currentPath = $page.url.pathname;
      const searchParams = $page.url.search;
      let newPath;

      if (langCode === 'en') {
        // 切换到英文：移除语言前缀，使用根路由
        if (currentPath.startsWith('/zh')) {
          newPath = currentPath.replace(/^\/zh/, '') || '/';
        } else {
          newPath = currentPath;
        }
      } else {
        // 切换到其他语言：添加语言前缀
        if (currentPath.startsWith('/zh')) {
          // 从中文切换到其他语言
          newPath = currentPath.replace(/^\/zh/, `/${langCode}`);
        } else {
          // 从英文切换到其他语言
          newPath = `/${langCode}${currentPath}`;
        }
      }

      // 使用goto进行客户端导航
      goto(newPath + searchParams, { replaceState: true, noScroll: true });
    }

    isOpen = false;
  }

  // 点击外部关闭下拉菜单
  function handleClickOutside(event: Event) {
    if (!(event.target as Element)?.closest('.language-switcher')) {
      isOpen = false;
    }
  }

  // 键盘事件处理
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      isOpen = false;
    }
  }

  // 绑定全局事件
  $effect(() => {
    if (browser) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeydown);

      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleKeydown);
      };
    }
  });
</script>

<div class="language-switcher relative">
  <!-- 触发按钮 -->
  <button
    onclick={() => isOpen = !isOpen}
    class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:theme-text-muted hover:text-gray-900 dark:hover:theme-text-primary transition-colors duration-200 rounded-md hover:theme-bg-muted dark:hover:bg-gray-800"
    aria-expanded={isOpen}
    aria-haspopup="true"
  >
    <!-- 地球图标 (CSS) -->
    <div class="globe-icon w-4 h-4"></div>
    <span class="hidden sm:inline">{getCurrentLanguage().nativeName}</span>
    <span class="sm:hidden">{getCurrentLanguage().flag}</span>
    <!-- 下拉箭头 (CSS) -->
    <div class="chevron-down w-4 h-4 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"></div>
  </button>

  <!-- 下拉菜单 -->
  {#if isOpen}
    <div class="absolute right-0 top-full mt-1 w-48 theme-bg-card dark:bg-gray-800 border theme-border dark:theme-border rounded-md shadow-lg z-50 py-1">
      {#each $supportedLanguages as language}
        <button
          onclick={() => switchToLanguage(language.code)}
          class="w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:theme-bg-muted dark:hover:bg-gray-700 transition-colors duration-150 {
            language.code === currentLang
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              : 'text-gray-700 dark:theme-text-muted'
          }"
        >
          <span class="text-lg">{language.flag}</span>
          <div class="flex flex-col">
            <span class="font-medium">{language.nativeName}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">{language.name}</span>
          </div>
          {#if language.code === currentLang}
            <span class="ml-auto text-blue-600 dark:text-blue-400">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </span>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .language-switcher {
    /* 确保下拉菜单正确定位 */
    position: relative;
  }

  /* 地球图标 */
  .globe-icon {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3s-4.5 4.03-4.5 9 2.015 9 4.5 9zm0 0c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3s-4.5 4.03-4.5 9 2.015 9 4.5 9zm-9-9a9 9 0 1118 0 9 9 0 01-18 0z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }

  /* 下拉箭头图标 */
  .chevron-down {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }

  /* 暗色模式下的图标颜色调整 */
  :global(.dark) .globe-icon {
    filter: invert(1);
  }

  :global(.dark) .chevron-down {
    filter: invert(1);
  }
</style>
