<script>
  import { T, currentLocale, switchLanguage } from '$lib/text';
</script>

<div class="container mx-auto p-8">
  <h1 class="text-3xl font-bold mb-8">多语言测试页面 / Multilingual Test Page</h1>
  
  <div class="mb-8">
    <h2 class="text-xl font-semibold mb-4">当前语言 / Current Language</h2>
    <div class="p-4 theme-bg-muted rounded-lg text-gray-800">
      {$currentLocale === 'en' ? 'English' : '中文'}
    </div>
  </div>

  <div class="mb-8">
    <h2 class="text-xl font-semibold mb-4">输入框测试 / Input Field Test</h2>
    <div class="grid grid-cols-2 gap-4">
      <div class="p-4 theme-bg-muted rounded-lg">
        <label for="test-input-light" class="block mb-2 text-gray-800">浅色背景输入框 / Light Background Input:</label>
        <input
          id="test-input-light"
          type="text"
          placeholder={$currentLocale === 'en' ? "Enter text here" : "在此输入文本"}
          class="w-full p-2 border border-gray-300 rounded-lg text-gray-800"
        />
      </div>
      <div class="p-4 bg-gray-800 rounded-lg">
        <label for="test-input-dark" class="block mb-2 theme-text-primary">深色背景输入框 / Dark Background Input:</label>
        <input
          id="test-input-dark"
          type="text"
          placeholder={$currentLocale === 'en' ? "Enter text here" : "在此输入文本"}
          class="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 theme-text-primary"
        />
      </div>
    </div>
  </div>
  
  <div class="mb-8">
    <h2 class="text-xl font-semibold mb-4">导航文本 / Navigation Text</h2>
    <div class="grid grid-cols-2 gap-4">
      <div class="p-4 theme-bg-muted rounded-lg text-gray-800">
        <strong>Home/首页:</strong> {$T?.nav?.home}
      </div>
      <div class="p-4 theme-bg-muted rounded-lg text-gray-800">
        <strong>About/关于:</strong> {$T?.nav?.about}
      </div>
      <div class="p-4 theme-bg-muted rounded-lg text-gray-800">
        <strong>Blog/博客:</strong> {$T?.nav?.blog}
      </div>
      <div class="p-4 theme-bg-muted rounded-lg text-gray-800">
        <strong>Contact/联系:</strong> {$T?.nav?.contact}
      </div>
    </div>
  </div>
  
  <div class="mb-8">
    <h2 class="text-xl font-semibold mb-4">按钮文本 / Button Text</h2>
    <div class="grid grid-cols-2 gap-4">
      <div class="p-4 theme-bg-muted rounded-lg text-gray-800">
        <strong>Get Started/开始使用:</strong> {$T?.buttons?.getStarted}
      </div>
      <div class="p-4 theme-bg-muted rounded-lg text-gray-800">
        <strong>Learn More/了解更多:</strong> {$T?.buttons?.learnMore}
      </div>
      <div class="p-4 theme-bg-muted rounded-lg text-gray-800">
        <strong>Submit/提交:</strong> {$T?.buttons?.submit}
      </div>
      <div class="p-4 theme-bg-muted rounded-lg text-gray-800">
        <strong>Cancel/取消:</strong> {$T?.buttons?.cancel}
      </div>
    </div>
  </div>
  
  <div class="mb-8">
    <h2 class="text-xl font-semibold mb-4">语言切换 / Language Switch</h2>
    <div class="flex gap-4">
      <button 
        class="px-4 py-2 bg-blue-500 theme-text-primary rounded-lg hover:bg-blue-600"
        on:click={() => switchLanguage('en')}
      >
        Switch to English
      </button>
      <button 
        class="px-4 py-2 bg-blue-500 theme-text-primary rounded-lg hover:bg-blue-600"
        on:click={() => switchLanguage('zh')}
      >
        切换到中文
      </button>
    </div>
  </div>
</div>