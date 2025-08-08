<script lang="ts">
  import { onMount } from 'svelte';
  import { Search, FileText, X } from 'lucide-svelte';
  import type { SearchResult } from '$lib/docs/buildSearchIndex.ts';
  
  import { searchStore } from '$lib/stores/search.js';
  
  interface Props {
    open?: boolean;
    language?: string;
    onselect?: (result: SearchResult) => void;
    onclose?: () => void;
  }
  
  let { open = false, language = 'en', onselect, onclose }: Props = $props();
  
  let query = $state('');
  let results = $state<SearchResult[]>([]);
  let selectedIndex = $state(0);
  let searchInput = $state<HTMLInputElement>();
  
  $effect(() => {
    if (open && searchInput) {
      searchInput.focus();
    }
  });
  
  
  // Search effect
  $effect(() => {
    if (query.trim()) {
      // Simple direct search without store complexity
      const searchTerm = query.toLowerCase();
      const searchResults: SearchResult[] = [];
      
      // Get search data directly
      fetch(`/search-index-${language}.json`)
        .then(response => response.json())
        .then((documents: any[]) => {
          for (const doc of documents) {
            let score = 0;
            const titleMatch = doc.title.toLowerCase().includes(searchTerm);
            const contentMatch = doc.content.toLowerCase().includes(searchTerm);
            const descriptionMatch = doc.description?.toLowerCase().includes(searchTerm);
            
            if (titleMatch) score += 3;
            if (descriptionMatch) score += 2;
            if (contentMatch) score += 1;
            
            if (score > 0) {
              searchResults.push({
                id: doc.id,
                title: doc.title,
                excerpt: generateExcerpt(doc.content, query),
                path: doc.path
              });
            }
          }
          
          // Sort by score
          searchResults.sort((a, b) => {
            const aScore = a.title.toLowerCase().includes(searchTerm) ? 3 : 1;
            const bScore = b.title.toLowerCase().includes(searchTerm) ? 3 : 1;
            return bScore - aScore;
          });
          
          results = searchResults.slice(0, 10);
          if (results.length > 0 && selectedIndex >= results.length) {
            selectedIndex = 0;
          }
        })
        .catch(() => {
          results = [];
        });
    } else {
      results = [];
    }
  });
  
  function generateExcerpt(content: string, query: string): string {
    const words = content.toLowerCase().split(/\s+/);
    const queryLower = query.toLowerCase();
    const queryIndex = words.findIndex(word => word.includes(queryLower));
    
    if (queryIndex === -1) {
      return content.slice(0, 150) + '...';
    }
    
    const start = Math.max(0, queryIndex - 10);
    const end = Math.min(words.length, queryIndex + 20);
    const excerpt = words.slice(start, end).join(' ');
    
    return (start > 0 ? '...' : '') + excerpt + (end < words.length ? '...' : '');
  }
  
  function handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        close();
        break;
      case 'ArrowDown':
        event.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        break;
      case 'Enter':
        event.preventDefault();
        if (results[selectedIndex]) {
          selectResult(results[selectedIndex]);
        }
        break;
    }
  }
  
  function selectResult(result: SearchResult) {
    onselect?.(result);
    close();
  }
  
  function close() {
    onclose?.();
    query = '';
    results = [];
    selectedIndex = 0;
  }
</script>

{#if open}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 theme-bg-page/50 z-[100]" 
    role="button"
    tabindex="-1"
    onclick={close}
    onkeydown={(e) => e.key === 'Enter' && close()}
  ></div>
  
  <!-- Search Dialog -->
  <div class="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-auto z-[101] px-4">
    <div class="theme-bg-card dark:theme-bg-page border theme-border dark:theme-border rounded-lg shadow-2xl overflow-hidden">
      <!-- Search Input -->
      <div class="flex items-center px-4 py-3 border-b theme-border dark:theme-border">
        <Search class="h-5 w-5 theme-text-muted dark:text-gray-400 mr-3" />
        <input
          bind:this={searchInput}
          bind:value={query}
          placeholder={language === 'zh' ? '搜索文档...' : 'Search documentation...'}
          class="flex-1 bg-transparent text-gray-900 dark:theme-text-primary placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
          onkeydown={handleKeydown}
        />
        <button
          onclick={close}
          class="ml-3 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
      
      <!-- Search Results -->
      {#if query && results.length > 0}
        <div class="max-h-96 overflow-y-auto">
          {#each results as result, index}
            <button
              class="w-full text-left px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border-b theme-border dark:theme-border last:border-b-0"
              class:theme-bg-muted={index === selectedIndex}
              class:dark-bg-gray-700={index === selectedIndex}
              onclick={() => selectResult(result)}
            >
              <div class="flex items-start">
                <FileText class="h-4 w-4 theme-text-muted dark:text-gray-400 mt-1 mr-3 shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 dark:theme-text-primary truncate">
                    {result.title}
                  </div>
                  <div class="text-sm theme-text-muted dark:text-gray-400 mt-1 line-clamp-2">
                    {result.excerpt}
                  </div>
                </div>
              </div>
            </button>
          {/each}
        </div>
      {:else if query && results.length === 0}
        <div class="px-4 py-8 text-center theme-text-muted dark:text-gray-400">
          {language === 'zh' ? '未找到相关结果' : 'No results found'}
        </div>
      {:else}
        <div class="px-4 py-8 text-center theme-text-muted dark:text-gray-400">
          {language === 'zh' ? '输入关键词开始搜索' : 'Start typing to search'}
        </div>
      {/if}
      
      <!-- Footer -->
      <div class="px-4 py-2 theme-bg-muted dark:bg-gray-800 text-xs theme-text-muted dark:text-gray-400 border-t theme-border dark:theme-border">
        <div class="flex justify-between items-center">
          <span>
            {language === 'zh' ? '使用' : 'Use'} ↑↓ {language === 'zh' ? '导航' : 'to navigate'}, ↵ {language === 'zh' ? '选择' : 'to select'}, ESC {language === 'zh' ? '关闭' : 'to close'}
          </span>
          {#if results.length > 0}
            <span>
              {results.length} {language === 'zh' ? '个结果' : results.length === 1 ? 'result' : 'results'}
            </span>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .dark .dark-bg-gray-700 {
    background-color: rgb(55 65 81);
  }
</style>