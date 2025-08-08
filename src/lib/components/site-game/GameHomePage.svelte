<script lang="ts">
    import { onMount } from 'svelte';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
    import { Button } from '$lib/components/ui/button';
    import { Badge } from '$lib/components/ui/badge';
    import { Play, Download, Users, Map, RefreshCw, ExternalLink, ChevronDown } from 'lucide-svelte';
    import type { GameConfig } from '$lib/types/game-config';

    let { gameConfig }: { gameConfig: GameConfig } = $props();

    let iframeLoaded = $state(false);
    let heroVisible = $state(false);
    
    // Intersection Observer for lazy loading
    let heroSection: HTMLElement;
    
    function handleIntersection(entries: IntersectionObserverEntry[]) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !heroVisible) {
                heroVisible = true;
                // Preload iframe after hero is visible
                setTimeout(() => {
                    iframeLoaded = true;
                }, 500);
            }
        });
    }

    // Icon mapping
    function getIconComponent(iconName: string) {
        const iconMap: Record<string, any> = {
            'map': Map,
            'users': Users,
            'refresh': RefreshCw,
            'play': Play,
            'download': Download,
            'external': ExternalLink
        };
        return iconMap[iconName] || Play;
    }


    onMount(() => {
        // Set up intersection observer for performance
        if (heroSection) {
            const observer = new IntersectionObserver(handleIntersection, {
                rootMargin: '50px'
            });
            observer.observe(heroSection);
            
            return () => observer.disconnect();
        }
    });
</script>

<svelte:head>
    <title>{gameConfig.title} - Create Amazing Music Beats Online</title>
    <meta name="description" content="{gameConfig.description}" />
    <meta name="keywords" content="{gameConfig.keyword}, music game, beat maker, rhythm game, online music creation, interactive music, sound mixing" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="{gameConfig.title} - Create Amazing Music Beats Online" />
    <meta property="og:description" content="{gameConfig.description}" />
    <meta property="og:image" content="{gameConfig.hero.backgroundImage || '/og-game-image.jpg'}" />
    <meta property="og:url" content="https://tenniszero.org" />
    <meta property="og:site_name" content="tenniszero.org" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{gameConfig.title} - Create Amazing Music Beats Online" />
    <meta name="twitter:description" content="{gameConfig.description}" />
    <meta name="twitter:image" content="{gameConfig.hero.backgroundImage || '/og-game-image.jpg'}" />
    
    <!-- Additional SEO -->
    <meta name="robots" content="index, follow" />
    <meta name="googlebot" content="index, follow" />
    <meta name="language" content="en" />
    <meta name="author" content="tenniszero.org" />
    <meta name="publisher" content="tenniszero.org" />
    <meta name="theme-color" content="#8b5cf6" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://tenniszero.org" />
    
    <!-- Preload critical resources -->
    <link rel="preload" href="{gameConfig.hero.iframeUrl}" as="document" crossorigin="anonymous" />
    
    <!-- Structured Data -->
    {@html `
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        "name": "${gameConfig.title}",
        "description": "${gameConfig.description}",
        "genre": "Music Game",
        "gamePlatform": ["Web Browser", "Desktop", "Mobile"],
        "operatingSystem": "Cross-platform",
        "applicationCategory": "Game",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "50000",
            "bestRating": "5"
        },
        "publisher": {
            "@type": "Organization",
            "name": "tenniszero.org",
            "url": "https://tenniszero.org"
        },
        "url": "https://tenniszero.org",
        "sameAs": [
            "${gameConfig.social.twitter || ''}",
            "${gameConfig.social.youtube || ''}",
            "${gameConfig.social.discord || ''}"
        ]
    }
    </script>
    `}
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <!-- Animated background elements -->
        <div class="absolute inset-0">
            <div class="absolute top-20 left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div class="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <!-- Hero Section -->
        <section id="hero" bind:this={heroSection} class="relative min-h-screen flex items-center justify-center overflow-hidden z-10 pt-24" itemscope itemtype="https://schema.org/VideoGame">
            <div class="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8">
                <div class="text-center mb-16">
                    <div class="inline-flex items-center px-6 py-3 rounded-full theme-bg-card/10 backdrop-blur-md border theme-border mb-8">
                        <span class="text-2xl mr-2">🎵</span>
                        <span class="theme-text-primary font-medium">Music Creation Game</span>
                    </div>
                    <h1 class="text-6xl md:text-8xl font-black theme-text-primary mb-8 tracking-tight leading-none" itemprop="name">
                        <span class="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                            {gameConfig.title}
                        </span>
                    </h1>
                    <p class="text-2xl md:text-3xl theme-text-primary/90 mb-12 max-w-4xl mx-auto leading-relaxed font-medium" itemprop="description">
                        {gameConfig.description}
                    </p>
                </div>

                <!-- Game Display Area -->
                <div class="max-w-5xl mx-auto mb-16">
                    <div class="relative group">
                        <!-- Glow effect -->
                        <div class="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                        <div class="relative theme-bg-page/80 backdrop-blur-xl rounded-2xl p-6 border theme-border">
                            <div class="flex items-center justify-between mb-4">
                                <div class="flex items-center space-x-3">
                                    <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                </div>
                                <div class="theme-text-primary/60 text-sm font-mono">🎮 {gameConfig.keyword}</div>
                            </div>
                            
                            {#if iframeLoaded}
                                <iframe
                                    src="https://www.youtube.com/embed/zCA4Na6oOrI?autoplay=1&mute=1&loop=1&playlist=zCA4Na6oOrI"
                                    title="{gameConfig.title} Demo Video"
                                    class="w-full h-[600px] md:h-[700px] lg:h-[800px] rounded-xl border-0 shadow-2xl"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowfullscreen
                                    itemprop="url"
                                ></iframe>
                            {:else}
                                <div class="w-full h-[600px] rounded-xl bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                                    <div class="text-center theme-text-primary">
                                        <div class="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-transparent mx-auto mb-4"></div>
                                        <p class="text-lg font-medium">Loading {gameConfig.keyword} Demo...</p>
                                        <button
                                            onclick={() => iframeLoaded = true}
                                            class="mt-4 px-6 py-3 theme-bg-card/20 hover:theme-bg-card/30 rounded-lg transition-colors border theme-border"
                                        >
                                            ▶ Load Video
                                        </button>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- What is Section -->
        <section id="what-is" class="py-32 relative z-10" itemscope itemtype="https://schema.org/AboutPage">
            <div class="max-w-4xl mx-auto px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-5xl md:text-6xl font-black theme-text-primary mb-8 tracking-tight" itemprop="name">
                        What is <span class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{gameConfig.keyword}?</span>
                    </h2>
                    <p class="text-xl theme-text-primary/80 leading-relaxed mb-16">
                        {gameConfig.whatIs?.content || `${gameConfig.keyword} is an innovative music creation platform that revolutionizes how you make beats and melodies.`}
                    </p>
                    
                    <!-- Large Number Highlights -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {#each gameConfig.whatIs?.highlights || [
                            { number: "10M+", label: `Players Love ${gameConfig.keyword}` },
                            { number: "∞", label: `Combinations in ${gameConfig.keyword}` },
                            { number: "0", label: `Experience Required` }
                        ] as highlight}
                            <div class="group">
                                <div class="theme-bg-card/10 backdrop-blur-xl rounded-2xl p-8 border theme-border hover:theme-bg-card/20 transition-all duration-300 group-hover:scale-105">
                                    <div class="text-7xl md:text-8xl font-black mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                        {highlight.number}
                                    </div>
                                    <p class="theme-text-primary/80 font-medium">{highlight.label}</p>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="py-32 relative z-10">
            <div class="max-w-4xl mx-auto px-6 lg:px-8">
                <div class="text-center mb-20">
                    <h2 class="text-5xl md:text-6xl font-black theme-text-primary mb-8 tracking-tight">
                        Features of <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{gameConfig.keyword}</span>
                    </h2>
                    <p class="text-xl theme-text-primary/80">
                        Discover what makes {gameConfig.keyword} the ultimate music creation platform
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {#each gameConfig.features?.items || gameConfig.about.features as feature, index}
                        <div class="group relative">
                            <div class="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <div class="relative theme-bg-card/10 backdrop-blur-xl border theme-border rounded-2xl p-8 hover:theme-bg-card/20 transition-all duration-300 group-hover:scale-105 h-full">
                                <div class="text-5xl mb-6">{feature.icon || '🎵'}</div>
                                <h3 class="text-2xl font-bold theme-text-primary mb-4">{feature.title}</h3>
                                <p class="theme-text-primary/70 leading-relaxed">{feature.description}</p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </section>

        <!-- How to Use Section -->
        <section id="how-to-use" class="py-32 relative z-10">
            <div class="max-w-4xl mx-auto px-6 lg:px-8">
                <div class="text-center mb-20">
                    <h2 class="text-5xl md:text-6xl font-black theme-text-primary mb-8 tracking-tight">
                        How to Use <span class="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">{gameConfig.keyword}</span>
                    </h2>
                    <p class="text-xl theme-text-primary/80">
                        Master {gameConfig.keyword} in 4 simple steps
                    </p>
                </div>

                <div class="space-y-8">
                    {#each gameConfig.howToUse?.steps || [
                        { step: "01", title: `Start ${gameConfig.keyword}`, description: `Launch the ${gameConfig.keyword} interface` },
                        { step: "02", title: `Create Music`, description: `Use intuitive controls to make beats` },
                        { step: "03", title: `Mix Sounds`, description: `Layer multiple elements together` },
                        { step: "04", title: `Share Creation`, description: `Export and share your masterpiece` }
                    ] as step, index}
                        <div class="flex items-start space-x-8 group">
                            <div class="flex-shrink-0">
                                <div class="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                                    <span class="text-2xl font-black theme-text-primary">{step.step}</span>
                                </div>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-2xl font-bold theme-text-primary mb-3 group-hover:text-purple-300 transition-colors">{step.title}</h3>
                                <p class="theme-text-primary/70 leading-relaxed text-lg">{step.description}</p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </section>

        <!-- FAQ Section -->
        <section id="faq" class="py-32 relative z-10">
            <div class="max-w-4xl mx-auto px-6 lg:px-8">
                <div class="text-center mb-20">
                    <h2 class="text-5xl md:text-6xl font-black theme-text-primary mb-8 tracking-tight">
                        FAQ About <span class="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{gameConfig.keyword}</span>
                    </h2>
                    <p class="text-xl theme-text-primary/80">
                        Everything you need to know about {gameConfig.keyword}
                    </p>
                </div>

                <div class="space-y-6">
                    {#each gameConfig.faq?.items || [] as faqItem, index}
                        <details class="group theme-bg-card/10 backdrop-blur-xl border theme-border rounded-2xl overflow-hidden">
                            <summary class="p-6 cursor-pointer list-none flex items-center justify-between hover:theme-bg-card/20 transition-colors">
                                <h3 class="text-lg font-semibold theme-text-primary pr-8">{faqItem.question}</h3>
                                <ChevronDown class="w-5 h-5 theme-text-primary/60 group-open:rotate-180 transition-transform duration-200" />
                            </summary>
                            <div class="px-6 pb-6">
                                <p class="theme-text-primary/70 leading-relaxed">{faqItem.answer}</p>
                            </div>
                        </details>
                    {/each}
                </div>
            </div>
        </section>

        <!-- Related Games Section -->
        {#if gameConfig.relatedGames.length > 0}
            <section class="py-32 relative z-10">
                <div class="max-w-4xl mx-auto px-6 lg:px-8">
                    <div class="text-center mb-20">
                        <h2 class="text-5xl md:text-6xl font-black theme-text-primary mb-8 tracking-tight">
                            More Games Like <span class="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{gameConfig.keyword}</span>
                        </h2>
                        <p class="text-xl theme-text-primary/80">Explore similar music creation experiences</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {#each gameConfig.relatedGames as game}
                            <div class="group relative">
                                <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                                <div class="relative theme-bg-card/10 backdrop-blur-xl border theme-border rounded-2xl overflow-hidden hover:theme-bg-card/20 transition-all duration-300 group-hover:scale-105">
                                    <div class="aspect-video relative overflow-hidden">
                                        {#if game.thumbnail}
                                            <img
                                                src={game.thumbnail}
                                                alt="{game.title} - {game.description}"
                                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                loading="lazy"
                                                decoding="async"
                                                width="400"
                                                height="300"
                                            />
                                        {:else}
                                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
                                                <Play class="w-16 h-16 theme-text-primary" />
                                            </div>
                                        {/if}
                                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    </div>
                                    <div class="p-6">
                                        <h3 class="text-xl font-bold theme-text-primary mb-3">{game.title}</h3>
                                        <p class="theme-text-primary/70 mb-6 leading-relaxed">{game.description}</p>
                                        <a href={game.url} target="_blank" rel="noopener noreferrer"
                                           class="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 theme-text-primary font-medium transition-all duration-300 hover:shadow-lg">
                                            <ExternalLink class="w-4 h-4 mr-2" />
                                            Play Game
                                        </a>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </section>
        {/if}

        <!-- Footer CTA -->
        <section class="py-24 relative z-10">
            <div class="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                <h2 class="text-4xl md:text-5xl font-black theme-text-primary mb-8">
                    Ready to Create with <span class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{gameConfig.keyword}?</span>
                </h2>
                <p class="text-xl theme-text-primary/80 mb-12">
                    Join millions creating amazing music with {gameConfig.keyword}
                </p>
                <a href="#hero"
                   class="inline-flex items-center px-12 py-6 bg-gradient-to-r from-purple-600 to-blue-600 theme-text-primary text-xl font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    🎵 Start Creating Now
                </a>
            </div>
        </section>
    </div>

<style>
    @keyframes tilt {
        0%, 50%, 100% {
            transform: rotate(0deg);
        }
        25% {
            transform: rotate(0.5deg);
        }
        75% {
            transform: rotate(-0.5deg);
        }
    }
    
    .animate-tilt {
        animation: tilt 10s infinite linear;
    }
    
    .delay-1000 {
        animation-delay: 1s;
    }
    
    .delay-2000 {
        animation-delay: 2s;
    }
    
    /* Enhanced glassmorphism effects */
    .backdrop-blur-xl {
        backdrop-filter: blur(20px);
    }
    
    .backdrop-blur-md {
        backdrop-filter: blur(12px);
    }

    /* Smooth scrolling */
    html {
        scroll-behavior: smooth;
    }

    /* Content max width constraint */
    section {
        max-width: 960px;
        margin-left: auto;
        margin-right: auto;
    }

    /* Performance optimizations */
    .animate-tilt {
        will-change: transform;
    }
    
    .group:hover .group-hover\:scale-105 {
        will-change: transform;
    }
    
    .group:hover .group-hover\:scale-110 {
        will-change: transform;
    }

    /* Critical CSS for above-the-fold content */
    .hero-gradient {
        background: linear-gradient(135deg, #581c87 0%, #1e3a8a 50%, #312e81 100%);
    }

    /* Optimize animations for lower-end devices */
    @media (prefers-reduced-motion: reduce) {
        .animate-pulse,
        .animate-tilt,
        .group-hover\:scale-105,
        .group-hover\:scale-110 {
            animation: none !important;
            transform: none !important;
            transition: none !important;
        }
    }

    /* GPU acceleration for smooth animations */
    .backdrop-blur-xl,
    .backdrop-blur-md {
        transform: translateZ(0);
    }

    /* Optimize font loading */
    h1, h2, h3 {
        font-display: swap;
    }
</style>
