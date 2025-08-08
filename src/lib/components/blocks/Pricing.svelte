<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Check, Star } from 'lucide-svelte';
  import { getLocalizedText } from '$lib/content-types';
  import type { PricingData } from '$lib/content-types';

  interface Props {
    pricingData?: PricingData | null;
    currentLang?: string;
  }

  let { pricingData, currentLang = 'en' }: Props = $props();

  // 静态文本作为后备
  const staticTexts = {
    title: 'Simple, transparent pricing',
    subtitle: 'Choose the plan that\'s right for you',
    getStarted: 'Get Started',
    popular: 'Most Popular'
  };
</script>

<section id="pricing" class="theme-bg-page py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-4xl text-center">
      <h2 class="text-base font-semibold leading-7 theme-text-primary/60">
        {getLocalizedText(pricingData?.title || '', currentLang) || staticTexts.title}
      </h2>
      <p class="mt-2 text-4xl font-bold tracking-tight theme-text-primary sm:text-5xl">
        {getLocalizedText(pricingData?.subtitle || '', currentLang) || staticTexts.subtitle}
      </p>
    </div>

    <div class="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-x-8 xl:gap-x-12">
      {#if pricingData?.plans}
        {#each pricingData.plans as plan}
          <Card class="relative {plan.popular ? 'ring-2 ring-blue-400 theme-bg-page/60' : 'ring-1 ring-white/20 theme-bg-page/40'} rounded-3xl p-8 xl:p-10 backdrop-blur-xl theme-border">
            {#if plan.popular}
              <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge class="bg-blue-500 theme-text-primary px-4 py-2 rounded-full shadow-lg">
                  <Star class="w-4 h-4 mr-1" />
                  {staticTexts.popular}
                </Badge>
              </div>
            {/if}

            <CardHeader class="pb-6">
              <CardTitle class="text-lg font-semibold leading-8 theme-text-primary">
                {getLocalizedText(plan.name, currentLang)}
              </CardTitle>
              <CardDescription class="text-sm leading-6 theme-text-primary/70">
                {getLocalizedText(plan.description, currentLang)}
              </CardDescription>

              <div class="mt-6 flex items-baseline gap-x-2">
                <span class="text-5xl font-bold tracking-tight theme-text-primary">
                  {getLocalizedText(plan.price, currentLang)}
                </span>
                <span class="text-sm font-semibold leading-6 tracking-wide theme-text-primary/60">
                  {getLocalizedText(plan.period, currentLang)}
                </span>
              </div>
            </CardHeader>

            <CardContent>
              <ul class="mt-8 space-y-3 text-sm leading-6 theme-text-primary/80">
                {#each plan.features as feature}
                  <li class="flex gap-x-3">
                    <Check class="h-6 w-5 flex-none text-blue-400" />
                    <span>{getLocalizedText(feature, currentLang)}</span>
                  </li>
                {/each}
              </ul>

              <div class="mt-8">
                <Button
                  class="w-full {plan.popular ? 'bg-blue-500 hover:bg-blue-600 theme-text-primary' : 'theme-bg-card/10 hover:theme-bg-card/20 theme-text-primary ring-1 ring-inset ring-white/30'} rounded-2xl py-3 px-6 text-center text-sm font-semibold shadow-sm backdrop-blur-sm"
                  onclick={() => window.location.href = plan.buttonUrl}
                >
                  {getLocalizedText(plan.buttonText, currentLang)}
                </Button>
              </div>
            </CardContent>
          </Card>
        {/each}
      {:else}
        <!-- 静态后备内容 -->
        <Card class="ring-1 ring-white/20 theme-bg-page/40 rounded-3xl p-8 xl:p-10 backdrop-blur-xl theme-border">
          <CardHeader class="pb-6">
            <CardTitle class="text-lg font-semibold leading-8 theme-text-primary">
              免费版
            </CardTitle>
            <CardDescription class="text-sm leading-6 theme-text-primary/70">
              完美的入门选择
            </CardDescription>

            <div class="mt-6 flex items-baseline gap-x-2">
              <span class="text-5xl font-bold tracking-tight theme-text-primary">¥0</span>
              <span class="text-sm font-semibold leading-6 tracking-wide theme-text-primary/60">永久免费</span>
            </div>
          </CardHeader>

          <CardContent>
            <ul class="mt-8 space-y-3 text-sm leading-6 theme-text-primary/80">
              <li class="flex gap-x-3">
                <Check class="h-6 w-5 flex-none text-blue-400" />
                <span>延后一个版本的免费开源模板</span>
              </li>
              <li class="flex gap-x-3">
                <Check class="h-6 w-5 flex-none text-blue-400" />
                <span>社区支持</span>
              </li>
              <li class="flex gap-x-3">
                <Check class="h-6 w-5 flex-none text-blue-400" />
                <span>基础文档</span>
              </li>
              <li class="flex gap-x-3">
                <Check class="h-6 w-5 flex-none text-blue-400" />
                <span>MIT 开源协议</span>
              </li>
            </ul>

            <div class="mt-8">
              <Button class="w-full theme-bg-card/10 hover:theme-bg-card/20 theme-text-primary ring-1 ring-inset ring-white/30 rounded-2xl py-3 px-6 text-center text-sm font-semibold shadow-sm backdrop-blur-sm">
                免费开始
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card class="relative ring-2 ring-blue-400 theme-bg-page/60 rounded-3xl p-8 xl:p-10 backdrop-blur-xl theme-border">
          <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge class="bg-blue-500 theme-text-primary px-4 py-2 rounded-full shadow-lg">
              <Star class="w-4 h-4 mr-1" />
              最受欢迎
            </Badge>
          </div>

          <CardHeader class="pb-6">
            <CardTitle class="text-lg font-semibold leading-8 theme-text-primary">
              专业版
            </CardTitle>
            <CardDescription class="text-sm leading-6 theme-text-primary/70">
              快速发布所需的一切
            </CardDescription>

            <div class="mt-6 flex items-baseline gap-x-2">
              <span class="text-5xl font-bold tracking-tight theme-text-primary">¥1299</span>
              <span class="text-sm font-semibold leading-6 tracking-wide theme-text-primary/60">一次性付费</span>
            </div>
          </CardHeader>

          <CardContent>
            <ul class="mt-8 space-y-3 text-sm leading-6 theme-text-primary/80">
              <li class="flex gap-x-3">
                <Check class="h-6 w-5 flex-none text-blue-400" />
                <span>✅ 持续更新的 tenniszero.org 使用教程</span>
              </li>
              <li class="flex gap-x-3">
                <Check class="h-6 w-5 flex-none text-blue-400" />
                <span>✅ 持续更新的 AI coding 教程</span>
              </li>
              <li class="flex gap-x-3">
                <Check class="h-6 w-5 flex-none text-blue-400" />
                <span>✅ 实时更新</span>
              </li>
              <li class="flex gap-x-3">
                <Check class="h-6 w-5 flex-none text-blue-400" />
                <span>✅ 迭代需求优先处理</span>
              </li>
              <li class="flex gap-x-3">
                <Check class="h-6 w-5 flex-none text-blue-400" />
                <span>✅ 免费的数据统计</span>
              </li>
              <li class="flex gap-x-3">
                <Check class="h-6 w-5 flex-none text-blue-400" />
                <span>✅ 付费用户群</span>
              </li>
              <li class="flex gap-x-3">
                <Check class="h-6 w-5 flex-none text-blue-400" />
                <span>✅ 送10套高级模板（单买要100刀）</span>
              </li>
              <li class="flex gap-x-3">
                <Check class="h-6 w-5 flex-none text-blue-400" />
                <span>✅ 赠送50元的大模型API接口credits</span>
              </li>
            </ul>

            <div class="mt-8">
              <Button class="w-full bg-blue-500 hover:bg-blue-600 theme-text-primary rounded-2xl py-3 px-6 text-center text-sm font-semibold shadow-sm">
                获取专业版
              </Button>
            </div>
          </CardContent>
        </Card>
      {/if}
    </div>
  </div>
</section>
