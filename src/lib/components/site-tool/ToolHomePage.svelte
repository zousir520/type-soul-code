<script lang="ts">
	import Hero from '$lib/components/blocks/Hero.svelte';
	import Pricing from '$lib/components/blocks/Pricing.svelte';
	import FAQ from '$lib/components/blocks/FAQ.svelte';
	import { Rocket, FileText, Zap, Shield, Database, Globe } from 'lucide-svelte';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { getLocalizedText } from '$lib/content-types';

	let { data, currentLocale } = $props();

	// Icon mapping function
	function getIconComponent(iconName: string) {
		const iconMap: Record<string, any> = {
			'rocket': Rocket,
			'template': FileText,
			'zap': Zap,
			'shield': Shield,
			'database': Database,
			'globe': Globe
		};
		return iconMap[iconName] || Zap;
	}
</script>

<!-- Hero Section -->
<Hero homepageContent={data.homepageContent} currentLang={currentLocale} />

<!-- Features Section -->
<section id="features" class="relative py-24 sm:py-32 overflow-hidden" style="background-color: hsl(var(--background))">
	<!-- Background Effects -->
	<div class="absolute inset-0" style="background: linear-gradient(to bottom, hsl(var(--background)), hsl(var(--muted)), hsl(var(--background)))"></div>
	<div class="absolute inset-0" style="background: radial-gradient(circle at center, hsl(var(--primary) / 0.1), transparent 50%)"></div>

	<div class="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl lg:text-center">
			<Badge variant="secondary" class="mb-12 backdrop-blur-sm" style="background-color: hsl(var(--secondary)); color: hsl(var(--secondary-foreground)); border-color: hsl(var(--border))">
				{data.homepageContent?.features?.badge ? getLocalizedText(data.homepageContent.features.badge, currentLocale) : 'Everything you need'}
			</Badge>
			<h2 class="mb-10 tracking-tight" style="color: hsl(var(--foreground)); font-family: 'Recursive', sans-serif; font-weight: 700;">
				{@html data.homepageContent?.features?.title ? getLocalizedText(data.homepageContent.features.title, currentLocale) : 'Ship faster with our <span class="gradient-text-accent">complete boilerplate</span>'}
			</h2>
			<p class="text-xl leading-relaxed mb-8" style="color: hsl(var(--muted-foreground))">
				{data.homepageContent?.features?.description ? getLocalizedText(data.homepageContent.features.description, currentLocale) : 'Don\'t waste time building the same features over and over. Our boilerplate includes everything you need to launch your SaaS quickly.'}
			</p>
		</div>

		<div class="mx-auto mt-20 max-w-2xl sm:mt-24 lg:mt-32 lg:max-w-none">
			<div class="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-{Math.min(data.featuresData?.features?.length || 3, 4)}">
				{#each data.featuresData?.features || [] as feature}
					{@const IconComponent = getIconComponent(feature.icon)}
					<Card class="backdrop-blur-sm transition-all duration-300" style="background-color: hsl(var(--card)); border-color: hsl(var(--border))">
						<CardHeader>
							<div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style="background-color: hsl(var(--primary))">
								<IconComponent class="w-8 h-8" style="color: hsl(var(--primary-foreground))" />
							</div>
							<CardTitle class="text-xl font-bold tracking-tight" style="color: hsl(var(--card-foreground))">{getLocalizedText(feature.title, currentLocale)}</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription style="color: hsl(var(--muted-foreground))">
								{getLocalizedText(feature.description, currentLocale)}
							</CardDescription>
						</CardContent>
					</Card>
				{/each}
			</div>
		</div>

		<div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
			{#each data.homepageContent?.hero?.stats || [] as stat, index}
				<Card class="backdrop-blur-sm text-center" style="background-color: hsl(var(--card)); border-color: hsl(var(--border))">
					<CardContent class="pt-6">
						<div class="text-3xl font-bold mb-2" style="color: hsl(var(--primary))">{stat.value}</div>
						<div style="color: hsl(var(--muted-foreground))">{stat.label}</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	</div>
</section>

<!-- Pricing Section -->
<Pricing pricingData={data.pricingData} currentLang={currentLocale} />

<!-- FAQ Section -->
<FAQ faqData={data.faqData} currentLang={currentLocale} />