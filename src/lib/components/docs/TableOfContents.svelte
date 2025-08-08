<script lang="ts">
  import type { TocItem } from '$lib/docs/parseToc.ts';
  import { onMount } from 'svelte';
  
  interface Props {
    items: TocItem[];
    language?: string;
  }
  
  let { items, language = 'en' }: Props = $props();
  let activeId = $state('');
  
  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
          }
        }
      },
      {
        rootMargin: '-80px 0% -80% 0%',
        threshold: 0
      }
    );
    
    // 观察所有标题元素
    const headings = document.querySelectorAll('h2[id], h3[id]');
    headings.forEach((heading) => observer.observe(heading));
    
    return () => {
      observer.disconnect();
    };
  });
  
  function scrollToHeading(id: string) {
    console.log('🎯 TOC Click - Looking for ID:', id);
    const element = document.getElementById(id);
    
    if (element) {
      console.log('✅ Found element:', element.tagName, element.textContent?.substring(0, 50));
      
      try {
        // 找到主内容容器（有overflow-y-auto的容器）
        const mainContainer = document.querySelector('main.overflow-y-auto');
        console.log('📦 Main container found:', !!mainContainer);
        
        if (mainContainer) {
          // 针对容器内部滚动
          const containerRect = mainContainer.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          const currentScrollTop = mainContainer.scrollTop;
          
          // 计算元素相对于容器的位置
          const relativeTop = elementRect.top - containerRect.top;
          const targetScrollTop = currentScrollTop + relativeTop - 120; // 120px偏移
          
          console.log('📏 Container scroll calculation:', {
            containerRect: containerRect.top,
            elementRect: elementRect.top,
            relativeTop,
            currentScrollTop,
            targetScrollTop
          });
          
          mainContainer.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
          });
          
          console.log('✅ Container scroll executed');
        } else {
          // 回退到窗口滚动
          console.log('⚠️ No container found, using window scroll');
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      } catch (error) {
        console.error('❌ Scroll error:', error);
      }
    } else {
      console.error('❌ Element not found for ID:', id);
      // Debug: show all available headings
      const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      console.log('🔍 All headings in DOM:', Array.from(allHeadings).map(h => ({
        tag: h.tagName,
        id: h.id,
        text: h.textContent?.trim().substring(0, 40)
      })));
    }
  }
</script>

<aside class="w-48 xl:w-56 flex-shrink-0 hidden lg:block sticky top-0 h-screen overflow-y-auto">
  <div class="px-4 pt-20 pb-6 border-l theme-border dark:theme-border">
    <h3 class="mb-4 text-sm font-semibold text-gray-900 dark:theme-text-primary">
      {language === 'zh' ? '目录' : 'Table of Contents'}
    </h3>
    
    {#if items.length > 0}
      <nav class="space-y-1">
        {#each items as item}
          {@render TocItemComponent(item)}
        {/each}
      </nav>
    {:else}
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {language === 'zh' ? '没有目录项' : 'No table of contents'}
      </p>
    {/if}
  </div>
</aside>

{#snippet TocItemComponent(item: TocItem)}
  <div>
    <button
      class="block w-full text-left text-sm theme-text-muted dark:text-gray-400 hover:text-gray-900 dark:hover:theme-text-primary transition-colors py-1.5 px-2 rounded-md hover:theme-bg-muted dark:hover:bg-gray-800"
      class:text-blue-600={activeId === item.id} 
      class:dark:text-blue-400={activeId === item.id}
      class:bg-blue-50={activeId === item.id}
      class:dark:bg-blue-900={activeId === item.id}
      class:dark:bg-opacity-20={activeId === item.id}
      class:font-medium={activeId === item.id}
      class:ml-0={item.level === 2}
      class:ml-3={item.level === 3}
      onclick={(event) => {
        console.log('🖱️ TOC button clicked!', { id: item.id, text: item.text });
        event.preventDefault();
        event.stopPropagation();
        scrollToHeading(item.id);
      }}
    >
      {item.text}
    </button>
    
    {#if item.children}
      {#each item.children as child}
        {@render TocItemComponent(child)}
      {/each}
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
    width: 4px;
  }
  
  aside::-webkit-scrollbar-track {
    background: transparent;
  }
  
  aside::-webkit-scrollbar-thumb {
    background-color: hsl(var(--border));
    border-radius: 2px;
  }
  
  aside::-webkit-scrollbar-thumb:hover {
    background-color: hsl(var(--border));
  }
</style>