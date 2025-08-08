<script lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-svelte';
  import { getLocalizedText } from '$lib/content-types';
  import type { FAQData } from '$lib/content-types';
  
  interface Props {
    faqData?: FAQData | null;
    currentLang?: string;
  }
  
  let { faqData, currentLang = 'en' }: Props = $props();
  
  // 静态文本作为后备
  const staticTexts = {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about tenniszero.org',
    general: 'General',
    pricing: 'Pricing & Plans',
    technical: 'Technical',
    support: 'Support & Community'
  };
  
  // 管理展开状态
  let expandedItems = $state<Set<string>>(new Set());
  
  function toggleItem(questionId: string) {
    if (expandedItems.has(questionId)) {
      expandedItems.delete(questionId);
    } else {
      expandedItems.add(questionId);
    }
    expandedItems = new Set(expandedItems);
  }
</script>

<section id="faq" class="theme-bg-page py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-4xl text-center">
      <h2 class="text-base font-semibold leading-7 theme-text-primary/60">
        {getLocalizedText(faqData?.title || '', currentLang) || staticTexts.title}
      </h2>
      <p class="mt-2 text-4xl font-bold tracking-tight theme-text-primary sm:text-5xl">
        {getLocalizedText(faqData?.subtitle || '', currentLang) || staticTexts.subtitle}
      </p>
    </div>
    
    <div class="mx-auto mt-16 max-w-4xl">
      {#if faqData?.categories}
        {#each faqData.categories as category}
          <div class="mb-12">
            <!-- Category Header -->
            <div class="mb-6">
              <Badge class="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2 rounded-full">
                <HelpCircle class="w-4 h-4 mr-2" />
                {getLocalizedText(category.name, currentLang)}
              </Badge>
            </div>
            
            <!-- Questions in Category -->
            <div class="space-y-4">
              {#each category.questions as question}
                <Card class="theme-bg-page/60 theme-border backdrop-blur-xl hover:theme-bg-page/70 transition-all duration-300">
                  <CardHeader 
                    class="cursor-pointer"
                    onclick={() => toggleItem(question.id)}
                  >
                    <div class="flex items-center justify-between">
                      <CardTitle class="text-lg font-semibold theme-text-primary text-left">
                        {getLocalizedText(question.question, currentLang)}
                      </CardTitle>
                      <div class="ml-4 flex-shrink-0">
                        {#if expandedItems.has(question.id)}
                          <ChevronUp class="w-5 h-5 theme-text-primary/60" />
                        {:else}
                          <ChevronDown class="w-5 h-5 theme-text-primary/60" />
                        {/if}
                      </div>
                    </div>
                  </CardHeader>
                  
                  {#if expandedItems.has(question.id)}
                    <CardContent class="pt-0">
                      <CardDescription class="theme-text-primary/80 text-base leading-relaxed">
                        {getLocalizedText(question.answer, currentLang)}
                      </CardDescription>
                    </CardContent>
                  {/if}
                </Card>
              {/each}
            </div>
          </div>
        {/each}
      {:else}
        <!-- 静态后备内容 -->
        <div class="mb-12">
          <div class="mb-6">
            <Badge class="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2 rounded-full">
              <HelpCircle class="w-4 h-4 mr-2" />
              {staticTexts.general}
            </Badge>
          </div>
          
          <div class="space-y-4">
            <Card class="theme-bg-page/60 theme-border backdrop-blur-xl hover:theme-bg-page/70 transition-all duration-300">
              <CardHeader 
                class="cursor-pointer"
                onclick={() => toggleItem('what-is-vibby')}
              >
                <div class="flex items-center justify-between">
                  <CardTitle class="text-lg font-semibold theme-text-primary text-left">
                    What is tenniszero.org?
                  </CardTitle>
                  <div class="ml-4 flex-shrink-0">
                    {#if expandedItems.has('what-is-vibby')}
                      <ChevronUp class="w-5 h-5 theme-text-primary/60" />
                    {:else}
                      <ChevronDown class="w-5 h-5 theme-text-primary/60" />
                    {/if}
                  </div>
                </div>
              </CardHeader>
              
              {#if expandedItems.has('what-is-vibby')}
                <CardContent class="pt-0">
                  <CardDescription class="theme-text-primary/80 text-base leading-relaxed">
                    tenniszero.org is a comprehensive AI-powered startup boilerplate platform designed for non-programmers. It provides complete templates, tutorials, and tools to help you launch your SaaS product quickly without extensive coding knowledge.
                  </CardDescription>
                </CardContent>
              {/if}
            </Card>
            
            <Card class="theme-bg-page/60 theme-border backdrop-blur-xl hover:theme-bg-page/70 transition-all duration-300">
              <CardHeader 
                class="cursor-pointer"
                onclick={() => toggleItem('how-fast-launch')}
              >
                <div class="flex items-center justify-between">
                  <CardTitle class="text-lg font-semibold theme-text-primary text-left">
                    How quickly can I launch my product?
                  </CardTitle>
                  <div class="ml-4 flex-shrink-0">
                    {#if expandedItems.has('how-fast-launch')}
                      <ChevronUp class="w-5 h-5 theme-text-primary/60" />
                    {:else}
                      <ChevronDown class="w-5 h-5 theme-text-primary/60" />
                    {/if}
                  </div>
                </div>
              </CardHeader>
              
              {#if expandedItems.has('how-fast-launch')}
                <CardContent class="pt-0">
                  <CardDescription class="theme-text-primary/80 text-base leading-relaxed">
                    With tenniszero.org, you can launch your MVP in days instead of months. Our production-ready templates and streamlined deployment pipeline allow you to focus on your business logic rather than infrastructure setup.
                  </CardDescription>
                </CardContent>
              {/if}
            </Card>
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>
