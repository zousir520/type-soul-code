<script lang="ts">
	const currentYear = new Date().getFullYear();

	const footerNavigation = {
		product: [
			{ name: 'Features', href: '/features' },
			{ name: 'Pricing', href: '/pricing' },
			{ name: 'Documentation', href: '/docs' },
			{ name: 'API Reference', href: '/api' }
		],
		company: [
			{ name: 'About', href: '/about' },
			{ name: 'Blog', href: '/blog' },
			{ name: 'Careers', href: '/careers' },
			{ name: 'Contact', href: '/contact' }
		],
		resources: [
			{ name: 'Community', href: '/community' },
			{ name: 'Help Center', href: '/help' },
			{ name: 'Status', href: '/status' },
			{ name: 'Changelog', href: '/changelog' }
		],
		legal: [
			{ name: 'Privacy Policy', href: '/privacy' },
			{ name: 'Terms of Service', href: '/terms' },
			{ name: 'Cookie Policy', href: '/cookies' },
			{ name: 'GDPR', href: '/gdpr' }
		]
	};

	const socialLinks = [
		{
			name: 'Twitter',
			href: 'https://twitter.com/shipany',
			icon: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84'
		},
		{
			name: 'GitHub',
			href: 'https://github.com/shipany',
			icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
		},
		{
			name: 'LinkedIn',
			href: 'https://linkedin.com/company/shipany',
			icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
		},
		{
			name: 'Discord',
			href: 'https://discord.gg/shipany',
			icon: 'M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z'
		}
	];
</script>

<footer class="theme-bg-card dark:theme-bg-muted border-t theme-border dark:theme-border">
	<div class="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
		<div class="xl:grid xl:grid-cols-3 xl:gap-8">
			<!-- Company info -->
			<div class="space-y-8 xl:col-span-1">
				<div class="flex items-center space-x-2">
					<div class="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
						<span class="theme-text-primary font-bold text-sm">S</span>
					</div>
					<span class="text-xl font-bold text-gray-900 dark:theme-text-primary">ShipAny</span>
				</div>
				<p class="text-sm leading-6 theme-text-muted dark:text-gray-400">
					Ship any idea quickly with our comprehensive development platform. Built for developers, entrepreneurs, and creators who want to turn their ideas into reality.
				</p>
				<div class="flex space-x-6">
					{#each socialLinks as social}
						<a
							href={social.href}
							target="_blank"
							rel="noopener noreferrer"
							class="text-gray-400 hover:text-gray-500 dark:hover:theme-text-muted transition-colors duration-200"
						>
							<span class="sr-only">{social.name}</span>
							<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path d={social.icon} />
							</svg>
						</a>
					{/each}
				</div>
			</div>

			<!-- Navigation links -->
			<div class="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
				<div class="md:grid md:grid-cols-2 md:gap-8">
					<div>
						<h3 class="text-sm font-semibold leading-6 text-gray-900 dark:theme-text-primary">Product</h3>
						<ul role="list" class="mt-6 space-y-4">
							{#each footerNavigation.product as item}
								<li>
									<a
										href={item.href}
										class="text-sm leading-6 theme-text-muted dark:text-gray-400 hover:text-gray-900 dark:hover:theme-text-primary transition-colors duration-200"
									>
										{item.name}
									</a>
								</li>
							{/each}
						</ul>
					</div>
					<div class="mt-10 md:mt-0">
						<h3 class="text-sm font-semibold leading-6 text-gray-900 dark:theme-text-primary">Company</h3>
						<ul role="list" class="mt-6 space-y-4">
							{#each footerNavigation.company as item}
								<li>
									<a
										href={item.href}
										class="text-sm leading-6 theme-text-muted dark:text-gray-400 hover:text-gray-900 dark:hover:theme-text-primary transition-colors duration-200"
									>
										{item.name}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				</div>
				<div class="md:grid md:grid-cols-2 md:gap-8">
					<div>
						<h3 class="text-sm font-semibold leading-6 text-gray-900 dark:theme-text-primary">Resources</h3>
						<ul role="list" class="mt-6 space-y-4">
							{#each footerNavigation.resources as item}
								<li>
									<a
										href={item.href}
										class="text-sm leading-6 theme-text-muted dark:text-gray-400 hover:text-gray-900 dark:hover:theme-text-primary transition-colors duration-200"
									>
										{item.name}
									</a>
								</li>
							{/each}
						</ul>
					</div>
					<div class="mt-10 md:mt-0">
						<h3 class="text-sm font-semibold leading-6 text-gray-900 dark:theme-text-primary">Legal</h3>
						<ul role="list" class="mt-6 space-y-4">
							{#each footerNavigation.legal as item}
								<li>
									<a
										href={item.href}
										class="text-sm leading-6 theme-text-muted dark:text-gray-400 hover:text-gray-900 dark:hover:theme-text-primary transition-colors duration-200"
									>
										{item.name}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</div>

		<!-- Newsletter signup -->
		<div class="mt-16 border-t theme-border dark:theme-border pt-8 lg:flex lg:items-center lg:justify-between">
			<div>
				<h3 class="text-sm font-semibold leading-6 text-gray-900 dark:theme-text-primary">Subscribe to our newsletter</h3>
				<p class="mt-2 text-sm leading-6 theme-text-muted dark:text-gray-400">
					Get the latest updates, articles, and resources delivered to your inbox.
				</p>
			</div>
			<form class="mt-6 sm:flex sm:max-w-md lg:mt-0">
				<label for="email-address" class="sr-only">Email address</label>
				<input
					type="email"
					name="email-address"
					id="email-address"
					autocomplete="email"
					required
					class="w-full min-w-0 appearance-none rounded-md border border-gray-300 dark:border-gray-600 theme-bg-card dark:bg-gray-800 px-3 py-2 text-base text-gray-900 dark:theme-text-primary placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64 sm:text-sm xl:w-full"
					placeholder="Enter your email"
				/>
				<div class="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
					<button
						type="submit"
						class="flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold theme-text-primary shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors duration-200"
					>
						Subscribe
					</button>
				</div>
			</form>
		</div>

		<!-- Copyright -->
		<div class="mt-8 border-t theme-border dark:theme-border pt-8 md:flex md:items-center md:justify-between">
			<div class="flex space-x-6 md:order-2">
				<a href="/privacy" class="text-sm leading-6 theme-text-muted dark:text-gray-400 hover:text-gray-900 dark:hover:theme-text-primary transition-colors duration-200">
					Privacy
				</a>
				<a href="/terms" class="text-sm leading-6 theme-text-muted dark:text-gray-400 hover:text-gray-900 dark:hover:theme-text-primary transition-colors duration-200">
					Terms
				</a>
			</div>
			<p class="mt-8 text-xs leading-5 text-gray-500 dark:text-gray-400 md:order-1 md:mt-0">
				&copy; {currentYear} ShipAny, Inc. All rights reserved.
			</p>
		</div>
	</div>
</footer>
