<script lang="ts">
  import type { PageData } from './$types';
  import Navbar from '$lib/components/blocks/Navbar.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import { getLocalizedText } from '$lib/content-types';
  import { onMount } from 'svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  const { page } = data;

  let currentLocale = 'en';

  onMount(() => {
    currentLocale = localStorage.getItem('locale') || 'en';

    // Listen for locale changes
    const handleLocaleChange = (event: CustomEvent) => {
      currentLocale = event.detail.locale;
    };

    window.addEventListener('localeChanged', handleLocaleChange as EventListener);

    return () => {
      window.removeEventListener('localeChanged', handleLocaleChange as EventListener);
    };
  });
</script>

<SEO
  title={getLocalizedText(page.title, currentLocale)}
  description={getLocalizedText(page.description, currentLocale)}
  siteTitle={data.generalSettings?.title}
  siteUrl={data.generalSettings?.url}
  seo={page.seo}
  generalSeo={data.generalSettings?.seo}
/>

<div class="min-h-screen theme-bg-page" style="background-color: hsl(var(--background)) !important;">
  <!-- Navigation -->
  <Navbar siteName={data.generalSettings?.title} navigationData={data.navigationData} currentLang="en" />

  <!-- Main Content -->
  <main class="pt-32 pb-16">
    <div class="mx-auto max-w-4xl px-6 lg:px-8">
      <div class="prose prose-lg prose-invert max-w-none">
        {@html getLocalizedText(page.content, currentLocale)}
      </div>
    </div>
  </main>
</div>

<style>
  :global(.prose h1) {
    font-size: 2.25rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin-bottom: 2rem;
  }
  
  :global(.prose h2) {
    font-size: 1.5rem;
    font-weight: 600;
    color: hsl(var(--foreground));
    margin-top: 3rem;
    margin-bottom: 1.5rem;
  }
  
  :global(.prose h3) {
    font-size: 1.25rem;
    font-weight: 600;
    color: hsl(var(--foreground));
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  
  :global(.prose p) {
    color: hsl(var(--muted-foreground));
    line-height: 1.625;
    margin-bottom: 1.5rem;
  }
  
  :global(.prose strong) {
    color: hsl(var(--foreground));
    font-weight: 600;
  }
  
  :global(.prose ul) {
    color: hsl(var(--muted-foreground));
  }
  
  :global(.prose ul > li) {
    margin-top: 0.5rem;
  }
  
  :global(.prose li) {
    color: hsl(var(--muted-foreground));
  }
</style>
