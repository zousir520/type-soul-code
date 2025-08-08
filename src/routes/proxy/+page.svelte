<script>
	import { page } from '$app/stores';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	// 解构数据
	const {
		generalSettings,
		pricingData,
		faqData,
		navigationData,
		heroData,
		featuresData,
		homeFAQData,
		footerData
	} = data;
</script>

<svelte:head>
	<title>Proxy - Vibby AI</title>
	<meta name="description" content="Proxy page for data loading" />
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:theme-bg-muted">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="theme-bg-card dark:bg-gray-800 rounded-lg shadow-sm border theme-border dark:theme-border">
			<div class="p-6">
				<h1 class="text-2xl font-bold text-gray-900 dark:theme-text-primary mb-6">
					Data Proxy Page
				</h1>
				
				<div class="space-y-6">
					<div class="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4">
						<h2 class="font-medium text-blue-900 dark:text-blue-100 mb-2">
							Loaded Data Summary
						</h2>
						<div class="text-sm text-blue-800 dark:text-blue-200 space-y-1">
							<p>✅ General Settings: {generalSettings ? 'Loaded' : 'Failed'}</p>
							<p>✅ Pricing Data: {pricingData ? 'Loaded' : 'Failed'}</p>
							<p>✅ FAQ Data: {faqData ? 'Loaded' : 'Failed'}</p>
							<p>✅ Navigation Data: {navigationData ? 'Loaded' : 'Failed'}</p>
							<p>✅ Hero Data: {heroData ? 'Loaded' : 'Failed'}</p>
							<p>✅ Features Data: {featuresData ? 'Loaded' : 'Failed'}</p>
							<p>✅ Home FAQ Data: {homeFAQData ? 'Loaded' : 'Failed'}</p>
							<p>✅ Footer Data: {footerData ? 'Loaded' : 'Failed'}</p>
						</div>
					</div>

					{#if generalSettings}
						<div class="bg-green-50 dark:bg-green-900/50 rounded-lg p-4">
							<h3 class="font-medium text-green-900 dark:text-green-100 mb-2">
								General Settings
							</h3>
							<pre class="text-xs text-green-800 dark:text-green-200 overflow-auto">
{JSON.stringify(generalSettings, null, 2)}
							</pre>
						</div>
					{/if}

					<div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
						<h3 class="font-medium text-gray-900 dark:text-gray-100 mb-2">
							Purpose
						</h3>
						<p class="text-sm theme-text-muted dark:text-gray-400">
							This proxy page is used to load and test CMS data loading functionality.
							It ensures all content sources are working correctly.
						</p>
					</div>

					<div class="flex space-x-4">
						<a 
							href="/" 
							class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm theme-text-primary bg-blue-600 hover:bg-blue-700"
						>
							Back to Home
						</a>
						<a 
							href="/vibbyai" 
							class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 theme-bg-card hover:bg-gray-50 dark:bg-gray-700 dark:theme-text-muted dark:border-gray-600 dark:hover:bg-gray-600"
						>
							Admin Dashboard
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
