<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Menu, X, Sparkles } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import { getLocalizedText } from '$lib/content-types';
	import { T, currentLocale } from '$lib/text';

	// 使用新的文本API
	const getNavText = (key: string, fallback: string): string => {
		return $T?.nav?.[key] || fallback;
	};

	const getButtonText = (key: string, fallback: string): string => {
		return $T?.buttons?.[key] || fallback;
	};

	// Smart navigation function for anchor links
	function handleAnchorNavigation(href: string) {
		const currentPath = $page.url.pathname;
		const isZhPage = currentPath.startsWith('/zh');
		const langPrefix = isZhPage ? '/zh' : '';

		if (href.startsWith('#')) {
			// Check if we're on the homepage (with or without language prefix)
			const isHomePage = currentPath === '/' || currentPath === '/zh' || currentPath === '';

			if (isHomePage) {
				// If we're on the homepage, scroll to the section
				const element = document.querySelector(href);
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' });
				}
			} else {
				// If we're on another page, navigate to homepage with the anchor and language prefix
				goto(`${langPrefix}/${href}`);
			}
		} else {
			// Regular navigation for non-anchor links, preserve language prefix
			const targetPath = href.startsWith('/') ? href : `/${href}`;
			goto(`${langPrefix}${targetPath}`);
		}
	}

	interface Props {
		siteName?: string;
		navigationData?: any;
		currentLang?: string;
	}

	let { siteName = 'tennis zero', navigationData, currentLang = 'en' }: Props = $props();

	let mounted = false;
	let mobileMenuOpen = $state(false);
	let scrolled = $state(false);

	onMount(() => {
		mounted = true;

		// Handle scroll effect
		const handleScroll = () => {
			scrolled = window.scrollY > 50;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function handleGetStarted() {
		goto('/auth/signin');
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	// Generate navigation items from CMS data or fallback to static
	const navItems = $derived.by(() => {
		if (navigationData?.menuItems) {
			return navigationData.menuItems.map((item: any) => ({
				name: getLocalizedText(item.label, currentLang) || item.name || item.label?.en || item.label,
				href: item.href || item.url || '#',
				class: item.class
			}));
		}

		// Fallback to static navigation items
		return [
			{ name: getNavText('features', 'Features'), href: '#features' },
			{ name: getNavText('pricing', 'Pricing'), href: '#pricing' },
			{ name: 'FAQ', href: '#faq' },
			{ name: getNavText('blog', 'Blog'), href: '/blog' },
			{ name: getNavText('about', 'About'), href: '/about' },
			{ name: getNavText('contact', 'Contact'), href: '/contact' }
		];
	});
</script>

<nav class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">
	<div class="backdrop-blur-xl rounded-3xl px-6 py-4 shadow-2xl transition-all duration-300" style="background-color: hsl(var(--background) / 0.6); border: 1px solid hsl(var(--border) / 0.3)">
		<div class="flex items-center justify-between space-x-6">
			<!-- Logo -->
			<div class="flex items-center">
				<a href="/" class="flex items-center space-x-3">
					<div class="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" style="background-color: hsl(var(--primary))">
						<Sparkles class="w-6 h-6" style="color: hsl(var(--primary-foreground))" />
					</div>
					<span class="text-xl font-bold" style="color: hsl(var(--foreground))">{siteName}</span>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center space-x-4">
				{#each navItems as item}
					<button
						onclick={() => handleAnchorNavigation(item.href)}
						class="transition-colors duration-300 font-medium text-sm bg-transparent border-none cursor-pointer whitespace-nowrap"
						style="color: hsl(var(--muted-foreground)); {item.class || ''}"
					>
						{item.name}
					</button>
				{/each}
			</div>

			<!-- Desktop CTA -->
			<div class="hidden md:flex items-center gap-3">
				<LanguageSwitcher />
				<Button
					size="sm"
					class="rounded-2xl px-4 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
					style="background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground))"
					onclick={handleGetStarted}
				>
					{getButtonText('getStarted', 'Get Started')}
				</Button>
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden">
				<Button
					variant="ghost"
					size="sm"
					class="theme-text-primary hover:theme-text-muted hover:theme-bg-card/20 rounded-2xl p-3 transition-all duration-300"
					onclick={toggleMobileMenu}
				>
					{#if mobileMenuOpen}
						<X class="w-5 h-5" />
					{:else}
						<Menu class="w-5 h-5" />
					{/if}
				</Button>
			</div>
		</div>
	</div>

<!-- Mobile Navigation -->
{#if mobileMenuOpen}
	<div class="fixed top-24 left-1/2 transform -translate-x-1/2 md:hidden theme-bg-page/80 backdrop-blur-2xl border theme-border rounded-3xl shadow-2xl z-40 w-80 max-w-[90vw] hover:theme-bg-page/90 transition-all duration-300">
		<div class="px-8 py-8 space-y-6">
			{#each navItems as item}
				<button
					onclick={() => {
						handleAnchorNavigation(item.href);
						mobileMenuOpen = false;
					}}
					class="block w-full theme-text-primary/80 hover:theme-text-primary transition-colors duration-300 font-medium py-3 text-center hover:theme-bg-card/10 rounded-2xl bg-transparent border-none cursor-pointer"
				>
					{item.name}
				</button>
			{/each}
			<div class="pt-6 border-t theme-border">
				<LanguageSwitcher />
			</div>
		</div>
	</div>
{/if}
</nav>
