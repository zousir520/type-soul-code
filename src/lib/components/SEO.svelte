<script lang="ts">
  interface SEOData {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
    author?: string;
    twitterHandle?: string;
    facebookAppId?: string;
  }

  interface Props {
    title: string;
    description: string;
    siteTitle?: string;
    siteUrl?: string;
    seo?: SEOData;
    generalSeo?: any;
    currentLang?: string;
    alternateUrls?: Array<{lang: string, url: string}>;
    robots?: string;
  }

  let {
    title,
    description,
    siteTitle = 'tenniszero.org',
    siteUrl = 'https://tenniszero.org',
    seo = {},
    generalSeo = {},
    currentLang = 'en',
    alternateUrls = []
  }: Props = $props();

  // Construct final meta values
  const metaTitle = seo.title || `${title} - ${siteTitle}`;
  const metaDescription = seo.description || description;
  const keywords = [...(seo.keywords || []), ...(generalSeo.keywords || [])];
  const ogImage = seo.ogImage || generalSeo.defaultOgImage || '/og-default.jpg';
  const author = seo.author || generalSeo.author || 'tenniszero.org Team';
  const twitterHandle = generalSeo.twitterHandle || '@vibbyai';
  const canonicalUrl = seo.canonicalUrl || `${siteUrl}${typeof window !== 'undefined' ? window.location.pathname : ''}`;
</script>

<svelte:head>
  <!-- Basic Meta Tags -->
  <title>{metaTitle}</title>
  <meta name="description" content={metaDescription} />
  {#if keywords.length > 0}
    <meta name="keywords" content={keywords.join(', ')} />
  {/if}
  <meta name="author" content={author} />
  
  <!-- Canonical URL -->
  <link rel="canonical" href={canonicalUrl} />
  
  <!-- Robots -->
  {#if seo.noIndex}
    <meta name="robots" content="noindex, nofollow" />
  {:else}
    <meta name="robots" content="index, follow" />
  {/if}
  
  <!-- Open Graph -->
  <meta property="og:title" content={metaTitle} />
  <meta property="og:description" content={metaDescription} />
  <meta property="og:image" content={`${siteUrl}${ogImage}`} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={siteTitle} />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={metaTitle} />
  <meta name="twitter:description" content={metaDescription} />
  <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
  {#if twitterHandle}
    <meta name="twitter:site" content={twitterHandle} />
    <meta name="twitter:creator" content={twitterHandle} />
  {/if}
  
  <!-- Facebook -->
  {#if generalSeo.facebookAppId}
    <meta property="fb:app_id" content={generalSeo.facebookAppId} />
  {/if}
  
  <!-- Language and Alternate URLs -->
  <meta name="language" content={currentLang} />
  {#each alternateUrls as alternate}
    <link rel="alternate" hreflang={alternate.lang} href={alternate.url} />
  {/each}

  <!-- Additional Meta -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta charset="utf-8" />
  {#if seo.noIndex || generalSeo.noIndex}
    <meta name="robots" content="noindex, nofollow" />
  {/if}
</svelte:head>
