<script lang="ts">
  import type { PageData } from './$types';
  import SEO from '$lib/components/SEO.svelte';
  import { BookOpen, FileText, Folder } from 'lucide-svelte';
  
  interface DocSection {
    title: string;
    path: string;
    description?: string;
    items: DocItem[];
  }
  
  interface DocItem {
    title: string;
    path: string;
    description?: string;
  }
  
  let { data }: { data: PageData } = $props();
</script>

<SEO
  title="文档 - tenniszero.org"
  description="tenniszero.org平台的完整文档指南"
/>

<div class="min-h-screen bg-background">
  <div class="container mx-auto px-4 py-12">
    <!-- 头部 -->
    <div class="text-center mb-12">
      <div class="flex items-center justify-center mb-6">
        <BookOpen class="h-12 w-12 text-primary mr-4" />
        <h1 class="text-4xl font-bold tracking-tight">文档</h1>
      </div>
      <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
        使用和开发tenniszero.org平台的完整指南
      </p>
    </div>

    <!-- 文档概览 -->
    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {#each data.sections as section}
        <div class="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <Folder class="h-6 w-6 text-primary mr-3" />
            <h2 class="text-xl font-semibold">
              <a href={section.path} class="hover:text-primary transition-colors">
                {section.title}
              </a>
            </h2>
          </div>
          
          {#if section.description}
            <p class="text-muted-foreground mb-4">
              {section.description}
            </p>
          {/if}

          <div class="space-y-2">
            {#each section.items.slice(0, 5) as item}
              <div class="flex items-start">
                <FileText class="h-4 w-4 text-muted-foreground mr-2 mt-0.5 shrink-0" />
                <div class="min-w-0 flex-1">
                  <a 
                    href={item.path}
                    class="text-sm font-medium hover:text-primary transition-colors block truncate"
                  >
                    {item.title}
                  </a>
                  {#if item.description}
                    <p class="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  {/if}
                </div>
              </div>
            {/each}
            
            {#if section.items.length > 5}
              <div class="pt-2">
                <a 
                  href={section.path}
                  class="text-sm text-primary hover:underline"
                >
                  查看全部 {section.items.length} 个文档 →
                </a>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <!-- 底部帮助信息 -->
    <div class="mt-16 text-center">
      <div class="bg-muted rounded-lg p-8">
        <h3 class="text-lg font-semibold mb-4">需要帮助？</h3>
        <p class="text-muted-foreground mb-6">
          找不到您要的内容？尝试使用搜索功能或查看这些资源：
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a 
            href="/zh/docs/01-getting-started/quick-start"
            class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            快速开始指南
          </a>
          <a 
            href="/zh/docs/06-troubleshooting/common-issues"
            class="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors"
          >
            常见问题
          </a>
          <a 
            href="/zh/docs/05-api/api-reference"
            class="bg-outline text-foreground px-4 py-2 rounded-md hover:bg-accent transition-colors border"
          >
            API 参考
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>