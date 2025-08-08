<script lang="ts">
  import type { PageData } from './$types';
  import SEO from '$lib/components/SEO.svelte';
  import { BookOpen, FileText, Folder, Globe } from 'lucide-svelte';
  
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
  
  // 所有可能的语言配置
  const allLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'jp', name: '日本語', flag: '🇯🇵' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' }
  ];
  
  // 只显示有文档内容的语言
  const availableLanguages = allLanguages.filter(lang => 
    data.availableLanguages?.includes(lang.code)
  );
  
  const currentLang = availableLanguages.find(lang => lang.code === data.language) || availableLanguages[0];
  const otherLanguages = availableLanguages.filter(lang => lang.code !== data.language);
</script>

<SEO
  title="Documentation - tenniszero.org"
  description="Comprehensive documentation for tenniszero.org platform"
/>

<div class="min-h-screen bg-background">
  <div class="container mx-auto px-4 py-12">
    <!-- 头部 -->
    <div class="text-center mb-12">
      <div class="flex items-center justify-center mb-6">
        <BookOpen class="h-12 w-12 text-primary mr-4" />
        <h1 class="text-4xl font-bold tracking-tight">Documentation</h1>
        <div class="ml-4 flex items-center">
          <Globe class="h-6 w-6 text-muted-foreground mr-2" />
          <span class="text-2xl">{currentLang.flag}</span>
        </div>
      </div>
      <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
        Complete guide to using and developing with tenniszero.org platform
      </p>
      
      <!-- 语言切换器 -->
      {#if availableLanguages.length > 1}
        <div class="mt-6">
          <div class="inline-flex rounded-lg border border-border bg-card p-1">
            <a
              href="/docs"
              class="flex items-center px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium"
            >
              <span class="mr-2">{currentLang.flag}</span>
              {currentLang.name}
            </a>
            {#each otherLanguages.slice(0, 3) as lang}
              <a
                href="/docs/{lang.code}"
                class="flex items-center px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted text-sm font-medium transition-colors"
              >
                <span class="mr-2">{lang.flag}</span>
                {lang.name}
              </a>
            {/each}
            {#if otherLanguages.length > 3}
              <div class="px-3 py-2 text-xs text-muted-foreground">
                +{otherLanguages.length - 3} more
              </div>
            {/if}
          </div>
        </div>
      {/if}
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
                  View all {section.items.length} documents →
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
        <h3 class="text-lg font-semibold mb-4">Need Help?</h3>
        <p class="text-muted-foreground mb-6">
          Can't find what you're looking for? Try our search function or check these resources:
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a 
            href="/docs/01-getting-started/quick-start"
            class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Quick Start Guide
          </a>
          <a 
            href="/docs/06-troubleshooting/common-issues"
            class="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors"
          >
            Common Issues
          </a>
          <a 
            href="/docs/05-api/api-reference"
            class="bg-accent text-accent-foreground px-4 py-2 rounded-md hover:bg-accent/80 transition-colors border"
          >
            API Reference
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