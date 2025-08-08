<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowRight, Sparkles, Zap, Shield } from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	// Simple static translations to avoid runtime errors
	const staticTexts = {
		getStarted: 'Get Started',
		learnMore: 'Learn More',
		lightningFast: {
			en: 'Lightning Fast',
			zh: '闪电般快速'
		},
		lightningFastDesc: {
			en: 'Launch your product in days instead of months with our optimized workflow.',
			zh: '通过我们优化的工作流程，在几天而不是几个月内发布您的产品。'
		},
		rockSolid: {
			en: 'Rock Solid',
			zh: '坚如磐石'
		},
		rockSolidDesc: {
			en: 'Built on proven technologies with enterprise-grade security and reliability.',
			zh: '基于经过验证的技术构建，具有企业级安全性和可靠性。'
		},
		builtForGrowth: {
			en: 'Built for Growth',
			zh: '为增长而生'
		},
		builtForGrowthDesc: {
			en: 'Scalable architecture that grows with your business from startup to enterprise.',
			zh: '可扩展的架构，随着您的业务从初创公司发展到企业级。'
		}
	};
	import type { HomepageContent, HeroData } from '$lib/content-types';
	import { getLocalizedText } from '$lib/content-types';

	interface Props {
		homepageContent?: HomepageContent | null;
		heroData?: HeroData | null;
		currentLang?: string;
	}

	let { homepageContent, heroData, currentLang = 'en' }: Props = $props();

	let mounted = $state(false);

	onMount(() => {
		// Use requestAnimationFrame to ensure DOM is ready
		requestAnimationFrame(() => {
			mounted = true;
		});
	});

	function handleGetStarted() {
		const url = homepageContent?.hero?.primaryButton?.url || '/auth/signin';
		goto(url);
	}

	function handleLearnMore() {
		const url = homepageContent?.hero?.secondaryButton?.url || '#features';
		if (url.startsWith('#')) {
			document.getElementById(url.slice(1))?.scrollIntoView({ behavior: 'smooth' });
		} else {
			goto(url);
		}
	}
</script>

<section class="relative min-h-screen flex items-center justify-center overflow-hidden tech-grid pt-32 pb-20 contain-layout" style="background-color: hsl(var(--background))">
	<!-- Animated Background -->
	<div class="absolute inset-0 animated-gradient opacity-30"></div>

	<!-- Minimal Background Elements -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-screen filter blur-3xl opacity-5" style="background-color: hsl(var(--primary))"></div>
		<div class="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full mix-blend-screen filter blur-3xl opacity-3" style="background-color: hsl(var(--secondary))"></div>
	</div>

	<!-- Particle Effect -->
	<div class="absolute inset-0">
		{#each Array(30) as _}
			<div
				class="absolute w-1 h-1 rounded-full opacity-30"
				style="
					background-color: hsl(var(--primary));
					left: {Math.random() * 100}%;
					top: {Math.random() * 100}%;
					animation: float {3 + Math.random() * 4}s ease-in-out infinite;
					animation-delay: {Math.random() * 5}s;
				"
			></div>
		{/each}
	</div>

	<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
		{#if mounted}
			<div in:fade={{ duration: 400, delay: 0 }}>
				<Badge variant="secondary" class="mb-16 backdrop-blur-sm text-base px-6 py-3 rounded-full" style="background-color: hsl(var(--secondary)); color: hsl(var(--secondary-foreground)); border-color: hsl(var(--border))">
					<Sparkles class="w-5 h-5 mr-3" />
					{getLocalizedText(heroData?.badge || homepageContent?.hero?.badge || '', currentLang) || 'The future of product development is here'}
				</Badge>
			</div>

			<div class="mb-12" in:fly={{ y: 20, duration: 600, delay: 200 }}>
				<!-- 品牌名 - 更大更突出 -->
				<h1 class="gradient-text font-bold tracking-tight mb-6 text-6xl md:text-8xl lg:text-9xl leading-none">
					<span class="block">{getLocalizedText(heroData?.title || homepageContent?.hero?.title || '', currentLang) || 'tenniszero.org'}</span>
				</h1>
				<!-- 核心 Slogan - 稍小但仍然突出 -->
				<h2 class="text-3xl md:text-4xl lg:text-5xl tracking-tight font-light leading-tight" style="color: hsl(var(--foreground) / 0.9)">
					<span class="block">{getLocalizedText(heroData?.subtitle || homepageContent?.hero?.subtitle || '', currentLang) || 'Build Your AI Startup Fast'}</span>
				</h2>
			</div>

			<div class="mb-16" in:fly={{ y: 20, duration: 500, delay: 300 }}>
				<p class="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-normal" style="color: hsl(var(--muted-foreground))">
					{getLocalizedText(heroData?.description || homepageContent?.hero?.description || '', currentLang) || 'AI SAAS boilerplate for Non-Programmers with authentication, payments, dashboard, and AI integrations.'}
				</p>
			</div>


			<div class="flex flex-col sm:flex-row gap-8 justify-center items-center mb-32" in:fly={{ y: 20, duration: 500, delay: 400 }}>
				<Button
					size="lg"
					class="px-12 py-8 text-lg font-semibold shadow-2xl"
					style="background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground))"
					onclick={handleGetStarted}
				>
					{getLocalizedText(homepageContent?.hero?.primaryButton?.text || '', currentLang) || staticTexts.getStarted}
					<ArrowRight class="ml-2 w-5 h-5" />
				</Button>
				<Button
					variant="outline"
					size="lg"
					class="px-12 py-8 text-lg font-semibold backdrop-blur-sm"
					style="border-color: hsl(var(--border)); color: hsl(var(--foreground)); background-color: hsl(var(--background) / 0.1)"
					onclick={handleLearnMore}
				>
					{getLocalizedText(homepageContent?.hero?.secondaryButton?.text || '', currentLang) || staticTexts.learnMore}
				</Button>
			</div>

			<!-- YouTube Video Section -->
			<div class="mb-16 max-w-4xl mx-auto" in:fade={{ duration: 600, delay: 600 }}>
				<div class="relative group">
					<div class="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
					<div class="relative backdrop-blur-sm rounded-xl overflow-hidden" style="background-color: hsl(var(--card)); border: 1px solid hsl(var(--border))">
						<iframe
							src="https://www.youtube.com/embed/zCA4Na6oOrI?autoplay=1&mute=1&loop=1&playlist=zCA4Na6oOrI"
							title="tenniszero.org Demo Video"
							class="w-full h-[400px] md:h-[500px] lg:h-[600px]"
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowfullscreen
						></iframe>
					</div>
				</div>
			</div>

			<!-- Feature Cards -->
			<div class="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto" in:fade={{ duration: 600, delay: 500 }}>
				<Card class="backdrop-blur-sm transition-all duration-300" style="background-color: hsl(var(--card)); border-color: hsl(var(--border))">
					<CardHeader>
						<div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style="background-color: hsl(var(--primary))">
							<Zap class="w-8 h-8" style="color: hsl(var(--primary-foreground))" />
						</div>
						<CardTitle class="text-2xl font-bold tracking-tight" style="color: hsl(var(--card-foreground))">{staticTexts.lightningFast[currentLang as 'en' | 'zh'] || staticTexts.lightningFast.en}</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription class="text-lg" style="color: hsl(var(--muted-foreground))">
							{staticTexts.lightningFastDesc[currentLang as 'en' | 'zh'] || staticTexts.lightningFastDesc.en}
						</CardDescription>
					</CardContent>
				</Card>

				<Card class="backdrop-blur-sm transition-all duration-300" style="background-color: hsl(var(--card)); border-color: hsl(var(--border))">
					<CardHeader>
						<div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style="background-color: hsl(var(--primary))">
							<Shield class="w-8 h-8" style="color: hsl(var(--primary-foreground))" />
						</div>
						<CardTitle class="text-2xl font-bold tracking-tight" style="color: hsl(var(--card-foreground))">{staticTexts.rockSolid[currentLang as 'en' | 'zh'] || staticTexts.rockSolid.en}</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription class="text-lg" style="color: hsl(var(--muted-foreground))">
							{staticTexts.rockSolidDesc[currentLang as 'en' | 'zh'] || staticTexts.rockSolidDesc.en}
						</CardDescription>
					</CardContent>
				</Card>

				<Card class="backdrop-blur-sm transition-all duration-300" style="background-color: hsl(var(--card)); border-color: hsl(var(--border))">
					<CardHeader>
						<div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style="background-color: hsl(var(--primary))">
							<Sparkles class="w-8 h-8" style="color: hsl(var(--primary-foreground))" />
						</div>
						<CardTitle class="text-2xl font-bold tracking-tight" style="color: hsl(var(--card-foreground))">{staticTexts.builtForGrowth[currentLang as 'en' | 'zh'] || staticTexts.builtForGrowth.en}</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription class="text-lg" style="color: hsl(var(--muted-foreground))">
							{staticTexts.builtForGrowthDesc[currentLang as 'en' | 'zh'] || staticTexts.builtForGrowthDesc.en}
						</CardDescription>
					</CardContent>
				</Card>
			</div>
		{:else}
			<!-- Loading state with simpler layout -->
			<div class="max-w-4xl mx-auto text-center">
				<Badge variant="secondary" class="mb-8 backdrop-blur-sm text-base px-6 py-3 rounded-full" style="background-color: hsl(var(--secondary)); color: hsl(var(--secondary-foreground)); border-color: hsl(var(--border))">
					<Sparkles class="w-5 h-5 mr-3" />
					The future of product development is here
				</Badge>

				<h1 class="text-6xl md:text-8xl font-bold mb-6" style="color: hsl(var(--foreground))">
					<span class="gradient-text">tenniszero.org</span>
					<span class="block text-4xl md:text-6xl mt-4" style="color: hsl(var(--foreground))">vibe your ai SAAS</span>
					<span class="block gradient-text-accent text-5xl md:text-7xl mt-2">
						Instantly.
					</span>
				</h1>
				<p class="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed" style="color: hsl(var(--muted-foreground))">
					<span class="gradient-text-secondary font-semibold">AI SAAS boilerplate for Non-Programmers</span> with authentication, payments, dashboard, and AI integrations.
				</p>
				<div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
					<Button
						size="lg"
						class="px-10 py-6 text-lg font-semibold shadow-2xl"
						style="background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground))"
						onclick={handleGetStarted}
					>
						Start Vibing
					</Button>
					<Button
						variant="outline"
						size="lg"
						class="px-10 py-6 text-lg font-semibold backdrop-blur-sm"
						style="border-color: hsl(var(--border)); color: hsl(var(--foreground)); background-color: hsl(var(--background) / 0.1)"
						onclick={handleLearnMore}
					>
						Explore Features
					</Button>
				</div>
			</div>
		{/if}
	</div>
</section>
