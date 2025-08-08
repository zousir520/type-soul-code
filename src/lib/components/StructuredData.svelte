<script lang="ts">
  interface StructuredDataRecord {
    name?: string;
    description?: string;
    url?: string;
    title?: string;
    image?: string;
    author?: string;
    datePublished?: string;
    dateModified?: string;
    [key: string]: unknown;
  }

  interface Props {
    type?: 'website' | 'article' | 'organization';
    data?: StructuredDataRecord;
  }

  let { type = 'website', data = {} }: Props = $props();
  
  const baseUrl = 'https://tenniszero.org';
  
  function generateStructuredData() {
    switch (type) {
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": data.name || "tenniszero.org",
          "description": data.description || "AI SAAS boilerplate for Non-Programmers",
          "url": data.url || baseUrl,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/blog?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "tenniszero.org",
            "url": baseUrl
          }
        };
      
      case 'article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.description,
          "image": data.image || `${baseUrl}/og-image.jpg`,
          "author": {
            "@type": "Person",
            "name": data.author || "tenniszero.org Team"
          },
          "publisher": {
            "@type": "Organization",
            "name": "tenniszero.org",
            "url": baseUrl
          },
          "datePublished": data.datePublished,
          "dateModified": data.dateModified || data.datePublished,
          "url": data.url
        };
      
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "tenniszero.org",
          "url": baseUrl,
          "description": "AI SAAS boilerplate for Non-Programmers with authentication, payments, dashboard, and AI integrations",
          "foundingDate": "2024",
          "sameAs": [
            "https://twitter.com/vibby_ai",
            "https://github.com/gstarwd/tenniszero.org"
          ]
        };
      
      default:
        return {};
    }
  }
  
  const structuredData = $derived(generateStructuredData());
</script>

<svelte:head>
  <script type="application/ld+json">
    {@html JSON.stringify(structuredData)}
  </script>
</svelte:head>
