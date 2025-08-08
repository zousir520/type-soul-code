<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import type { SidebarItem } from '$lib/docs/buildSidebarTree.ts';
  import { ChevronDown, ChevronRight, FileText, Folder } from 'lucide-svelte';
  
  interface Props {
    items: SidebarItem[];
    currentPath?: string;
    mobile?: boolean;
  }
  
  let { items, currentPath, mobile = false }: Props = $props();
  
  // 展开状态管理
  let expandedItems = $state(new Set<string>());
  
  // 初始化时展开包含当前页面的路径
  onMount(() => {
    if (currentPath) {
      const pathParts = currentPath.split('/').filter(Boolean);
      let currentExpanded = '';
      
      for (const part of pathParts) {
        currentExpanded += '/' + part;
        expandedItems.add(currentExpanded);
      }
      expandedItems = new Set(expandedItems);
    }
  });
  
  function toggleExpanded(path: string) {
    const newSet = new Set(expandedItems);
    if (newSet.has(path)) {
      newSet.delete(path);
    } else {
      newSet.add(path);
    }
    expandedItems = newSet;
  }
  
  function isActive(itemPath: string): boolean {
    return $page.url.pathname === itemPath;
  }
  
  function isParentActive(item: SidebarItem): boolean {
    if (!item.children) return false;
    return item.children.some(child => 
      isActive(child.path) || (child.children && isParentActive(child))
    );
  }
</script>

<aside class="{mobile ? 'w-full' : 'w-56 lg:w-64 border-r theme-border dark:theme-border theme-bg-card dark:theme-bg-page h-screen sticky top-0 overflow-y-auto hidden md:block'}">
  <div class="px-4 py-6">
    <h2 class="mb-4 text-lg font-semibold">Documentation</h2>
    
    <nav class="space-y-1">
      {#each items as item}
        {@render SidebarItemComponent(item, 0)}
      {/each}
    </nav>
  </div>
</aside>

{#snippet SidebarItemComponent(item: SidebarItem, level: number)}
  <div class="relative">
    {#if item.children && item.children.length > 0}
      <!-- 文件夹项 -->
      <div class="flex items-center">
        <button
          class="sidebar-item flex items-center w-full px-2 py-1.5 text-sm text-left rounded-md hover:bg-accent hover:text-accent-foreground"
          class:bg-accent={isParentActive(item)}
          class:text-accent-foreground={isParentActive(item)}
          style="padding-left: {level * 1 + 0.5}rem"
          onclick={() => toggleExpanded(item.path)}
        >
          {#if expandedItems.has(item.path)}
            <ChevronDown class="mr-2 h-4 w-4 shrink-0" />
          {:else}
            <ChevronRight class="mr-2 h-4 w-4 shrink-0" />
          {/if}
          <Folder class="mr-2 h-4 w-4 shrink-0 theme-text-muted dark:text-gray-400" />
          <span class="truncate">{item.title}</span>
        </button>
      </div>
      
      {#if expandedItems.has(item.path)}
        <div class="mt-1 space-y-1">
          {#each item.children as child}
            {@render SidebarItemComponent(child, level + 1)}
          {/each}
        </div>
      {/if}
    {:else}
      <!-- 文件项 -->
      <a
        href={item.path}
        class="sidebar-item flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
        class:bg-accent={isActive(item.path)}
        class:text-accent-foreground={isActive(item.path)}
        class:font-medium={isActive(item.path)}
        style="padding-left: {level * 1 + 0.5}rem"
      >
        <FileText class="mr-2 h-4 w-4 shrink-0 theme-text-muted dark:text-gray-400" />
        <span class="truncate">{item.title}</span>
      </a>
    {/if}
  </div>
{/snippet}

<style>
  /* 自定义滚动条样式 */
  aside {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--border)) transparent;
  }
  
  aside::-webkit-scrollbar {
    width: 6px;
  }
  
  aside::-webkit-scrollbar-track {
    background: transparent;
  }
  
  aside::-webkit-scrollbar-thumb {
    background-color: hsl(var(--border));
    border-radius: 3px;
  }
  
  aside::-webkit-scrollbar-thumb:hover {
    background-color: hsl(var(--border));
  }
  
  /* 快速点击反馈 */
  .sidebar-item {
    will-change: background-color;
  }
  
  .sidebar-item:active {
    transform: scale(0.99);
    transition: transform 0.1s ease;
  }
</style>