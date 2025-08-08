<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  
  let username = '';
  let password = '';
  let loading = false;
  let error = '';

  // 获取重定向URL
  const redirect = $page.url.searchParams.get('redirect') || '/vibbyai';

  async function handleLogin() {
    loading = true;
    error = '';
    
    try {
      const response = await fetch('/vibbyai/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // 登录成功，重定向到目标页面
        goto(redirect);
      } else {
        error = data.error || '登录失败';
      }
    } catch (err) {
      error = '网络错误，请重试';
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        登录到 tenniszero.org
      </h2>
      <p class="mt-2 text-center text-sm theme-text-muted">
        使用您的管理员账户访问后台
      </p>
    </div>
    
    <form class="mt-8 space-y-6" on:submit|preventDefault={handleLogin}>
      <div class="rounded-md shadow-sm space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">
            用户名
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            bind:value={username}
            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="输入用户名"
            disabled={loading}
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            密码
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            bind:value={password}
            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="输入密码"
            disabled={loading}
          />
        </div>
      </div>

      {#if error}
        <div class="rounded-md bg-red-50 p-4">
          <div class="text-sm text-red-700">
            {error}
          </div>
        </div>
      {/if}

      <div>
        <button
          type="submit"
          disabled={loading}
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md theme-text-primary bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {#if loading}
            登录中...
          {:else}
            登录
          {/if}
        </button>
      </div>
    </form>

    <div class="mt-6">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-gray-50 text-gray-500">提示</span>
        </div>
      </div>

      <div class="mt-4 text-center text-sm theme-text-muted">
        <p>请使用环境变量中配置的管理员账户登录</p>
        <p class="mt-1 text-xs">ADMIN_USERNAME 和 ADMIN_PASSWORD</p>
      </div>
    </div>
  </div>
</div>
