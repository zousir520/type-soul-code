<script lang="ts">
	const features = [
		{
			name: 'Authentication & User Management',
			description: 'Complete auth system with OAuth providers, user profiles, and session management.',
			icon: '🔐'
		},
		{
			name: 'Payment Integration',
			description: 'Stripe integration with subscription management, invoicing, and webhook handling.',
			icon: '💳'
		},
		{
			name: 'Dashboard & Analytics',
			description: 'Beautiful admin dashboard with user analytics, metrics, and data visualization.',
			icon: '📊'
		},
		{
			name: 'Database & ORM',
			description: 'PostgreSQL with Drizzle ORM, migrations, and type-safe database operations.',
			icon: '🗄️'
		},
		{
			name: 'API Management',
			description: 'RESTful APIs with rate limiting, API key management, and comprehensive documentation.',
			icon: '🔌'
		},
		{
			name: 'Internationalization',
			description: 'Multi-language support with dynamic locale switching and translation management.',
			icon: '🌍'
		},
		{
			name: 'Email & Notifications',
			description: 'Transactional emails, notification system, and communication templates.',
			icon: '📧'
		},
		{
			name: 'SEO & Performance',
			description: 'Optimized for search engines with meta tags, sitemaps, and performance monitoring.',
			icon: '🚀'
		}
	];
</script>

<section id="features" class="py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl lg:text-center">
			<h2 class="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Everything you need</h2>
			<p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:theme-text-primary sm:text-4xl">
				Ship faster with our complete boilerplate
			</p>
			<p class="mt-6 text-lg leading-8 theme-text-muted dark:theme-text-muted">
				Don't waste time building the same features over and over. Our boilerplate includes everything you need to launch your SaaS quickly.
			</p>
		</div>
		<div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
			<dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
				{#each features as feature}
					<div class="flex flex-col">
						<dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:theme-text-primary">
							<span class="text-2xl">{feature.icon}</span>
							{feature.name}
						</dt>
						<dd class="mt-4 flex flex-auto flex-col text-base leading-7 theme-text-muted dark:theme-text-muted">
							<p class="flex-auto">{feature.description}</p>
						</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>
</section>
