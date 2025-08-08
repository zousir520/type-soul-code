<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Sidebar from './Sidebar.svelte';
  import TableOfContents from './TableOfContents.svelte';
  import SearchDialog from './SearchDialog.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import type { SidebarItem } from '$lib/docs/buildSidebarTree.ts';
  import type { TocItem } from '$lib/docs/parseToc.ts';
  import type { SearchResult } from '$lib/docs/buildSearchIndex.ts';
  import { searchStore } from '$lib/stores/search.js';
  import { ChevronRight, Home, Search, Menu, X } from 'lucide-svelte';
  
  interface Breadcrumb {
    title: string;
    path: string;
  }
  
  interface Props {
    title?: string;
    description?: string;
    content: string;
    sidebarTree: SidebarItem[];
    toc: TocItem[];
    breadcrumbs: Breadcrumb[];
    currentPath: string;
    language?: string;
  }
  
  let { 
    title = 'Documentation',
    description = 'tenniszero.org Documentation',
    content,
    sidebarTree,
    toc,
    breadcrumbs,
    currentPath,
    language = 'en'
  }: Props = $props();
  
  let showSearch = $state(false);
  let showMobileSidebar = $state(false);
  
  onMount(() => {
    // Initialize search index
    searchStore.initialize(language);
    
    // Add keyboard shortcut for search
    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        showSearch = true;
      } else if (event.key === '/') {
        // Only trigger if not typing in an input field
        if (!(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
          event.preventDefault();
          showSearch = true;
        }
      } else if (event.key === 'Escape') {
        showSearch = false;
      }
    };
    
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  });
  
  function handleSearchSelect(result: SearchResult) {
    goto(result.path);
    showSearch = false;
  }
  
  function handleSearchClose() {
    showSearch = false;
  }
</script>

<SEO {title} {description} />

<div class="min-h-screen" style="background-color: hsl(var(--card))">
  <div class="flex h-screen">
    <!-- 左侧边栏 -->
    <Sidebar items={sidebarTree} {currentPath} />
    
    <!-- 主内容区域 -->
    <div class="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
      <!-- 顶部搜索栏 -->
      <div class="sticky top-0 z-10 backdrop-blur-sm border-b shadow-sm" style="background-color: hsl(var(--card) / 0.95); border-color: hsl(var(--border))">
        <div class="px-4 md:px-6 py-3 flex items-center gap-3">
          <!-- 移动端菜单按钮 -->
          <button
            onclick={() => showMobileSidebar = true}
            class="md:hidden p-2 rounded-md hover:bg-accent" style="color: hsl(var(--muted-foreground))"
          >
            <Menu class="h-5 w-5" />
          </button>
          
          <!-- 搜索按钮 -->
          <button
            onclick={() => showSearch = true}
            class="flex-1 max-w-sm flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors" style="color: hsl(var(--muted-foreground)); background-color: hsl(var(--muted)); border: 1px solid hsl(var(--border))"
          >
            <Search class="h-4 w-4 mr-2" />
            <span class="flex-1 text-left">
              {language === 'zh' ? '搜索文档...' : 'Search documentation...'}
            </span>
            <kbd class="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs font-mono rounded" style="background-color: hsl(var(--card)); border: 1px solid hsl(var(--border))">
              ⌘K /
            </kbd>
          </button>
        </div>
      </div>
      
      <!-- 内容和TOC区域 -->
      <div class="flex flex-1 overflow-hidden">
        <!-- 文档内容 -->
        <main class="flex-1 min-w-0 px-4 md:px-8 py-8 overflow-y-auto min-h-screen">
          <!-- 面包屑导航 -->
          {#if breadcrumbs.length > 1}
            <nav class="mb-6 flex items-center space-x-2 text-sm" style="color: hsl(var(--muted-foreground))">
              {#each breadcrumbs as crumb, index}
                {#if index === 0}
                  <Home class="h-4 w-4" />
                {/if}
                
                {#if index < breadcrumbs.length - 1}
                  <a 
                    href={crumb.path}
                    class="transition-colors hover:text-foreground" style="color: hsl(var(--muted-foreground))"
                  >
                    {crumb.title}
                  </a>
                  <ChevronRight class="h-4 w-4" />
                {:else}
                  <span class="font-medium" style="color: hsl(var(--foreground))">{crumb.title}</span>
                {/if}
              {/each}
            </nav>
          {/if}
          
          <!-- 文档内容 -->
          <article class="prose prose-neutral dark:prose-invert max-w-none lg:max-w-4xl prose-headings:scroll-mt-32 prose-sm md:prose-base lg:prose-lg pb-96">
            {@html content}
          </article>
          
          <!-- 页脚导航 -->
          <div class="mt-16 pt-12 pb-32 border-t" style="border-color: hsl(var(--border))">
            <div class="flex justify-between">
              <div class="text-sm" style="color: hsl(var(--muted-foreground))">
                <p>Last updated: {new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US')}</p>
              </div>
              
              <!-- 语言切换链接 -->
              <div class="text-sm">
                {#if language === 'en'}
                  <a 
                    href="{currentPath.replace('/docs/', '/docs/zh/')}"
                    class="text-primary hover:underline"
                  >
                    中文
                  </a>
                {:else}
                  <a 
                    href="{currentPath.replace('/docs/zh/', '/docs/')}"
                    class="text-primary hover:underline"
                  >
                    English
                  </a>
                {/if}
              </div>
            </div>
          </div>
        </main>
        
        <!-- 右侧目录 -->
        <TableOfContents items={toc} {language} />
      </div>
    </div>
  </div>
</div>

<!-- Search Dialog -->
<SearchDialog
  open={showSearch}
  {language}
  onselect={handleSearchSelect}
  onclose={handleSearchClose}
/>

<!-- 移动端侧边栏 -->
{#if showMobileSidebar}
  <!-- 背景遮罩 -->
  <div 
    class="fixed inset-0 z-40 md:hidden" style="background-color: hsl(var(--background) / 0.5)"
    onclick={() => showMobileSidebar = false}
  ></div>
  
  <!-- 侧边栏内容 -->
  <div class="fixed inset-y-0 left-0 w-80 border-r z-50 md:hidden" style="background-color: hsl(var(--card)); border-color: hsl(var(--border))">
    <div class="flex items-center justify-between p-4 border-b" style="border-color: hsl(var(--border))">
      <h2 class="text-lg font-semibold">Documentation</h2>
      <button
        onclick={() => showMobileSidebar = false}
        class="p-2 rounded-md hover:bg-accent" style="color: hsl(var(--muted-foreground))"
      >
        <X class="h-5 w-5" />
      </button>
    </div>
    
    <div class="overflow-y-auto h-full pb-20">
      <Sidebar items={sidebarTree} {currentPath} mobile={true} />
    </div>
  </div>
{/if}

<style>
  /* 确保代码块不会溢出 */
  :global(.prose pre) {
    @apply overflow-x-auto;
  }
  
  /* 为标题添加锚点链接样式 */
  :global(.prose h2[id]:hover::before),
  :global(.prose h3[id]:hover::before) {
    content: "#";
    position: absolute;
    left: -1.5rem;
    color: hsl(var(--muted-foreground));
    font-weight: normal;
  }
  
  :global(.prose h2[id]),
  :global(.prose h3[id]) {
    position: relative;
  }
  
  /* 改善表格样式 */
  :global(.prose table) {
    @apply w-full border-collapse;
  }
  
  :global(.prose th) {
    background-color: hsl(var(--muted));
    font-weight: 600;
  }
  
  :global(.prose td),
  :global(.prose th) {
    border: 1px solid hsl(var(--border));
    padding: 0.5rem 1rem;
  }
  
  /* 改善代码块样式 */
  :global(.prose code) {
    background-color: hsl(var(--muted));
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }
  
  :global(.prose pre code) {
    @apply bg-transparent p-0;
  }
</style>