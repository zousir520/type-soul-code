<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';

	// Test data with different author names
	const testAuthors = [
		'John Doe',
		'Jane Smith', 
		'Alex Johnson',
		'Maria Garcia',
		'David Chen',
		'Sarah Wilson',
		'Michael Brown',
		'Emily Davis',
		'Robert Taylor',
		'Lisa Anderson',
		'Anonymous',
		'A',
		'AB',
		'Very Long Author Name',
		'张三',
		'李四'
	];

	const sizes = [24, 32, 40, 48, 64, 80];
</script>

<svelte:head>
	<title>Avatar Test - SvelteKit Shipany</title>
	<meta name="description" content="Testing avatar generation for different authors" />
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:theme-bg-muted py-16">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center mb-16">
			<h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:theme-text-primary sm:text-5xl">
				Avatar Test
			</h1>
			<p class="mt-4 text-xl leading-8 theme-text-muted dark:theme-text-muted">
				Testing randomly generated avatars for different authors
			</p>
		</div>

		<!-- Different Authors -->
		<section class="mb-16">
			<h2 class="text-2xl font-bold text-gray-900 dark:theme-text-primary mb-8">Different Authors</h2>
			<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
				{#each testAuthors as author}
					<div class="flex flex-col items-center space-y-3">
						<Avatar name={author} size={64} />
						<div class="text-center">
							<p class="text-sm font-medium text-gray-900 dark:theme-text-primary truncate max-w-20">
								{author}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Different Sizes -->
		<section class="mb-16">
			<h2 class="text-2xl font-bold text-gray-900 dark:theme-text-primary mb-8">Different Sizes</h2>
			<div class="flex items-end space-x-6 justify-center">
				{#each sizes as size}
					<div class="flex flex-col items-center space-y-3">
						<Avatar name="John Doe" {size} />
						<p class="text-sm theme-text-muted dark:text-gray-400">{size}px</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- Consistency Test -->
		<section class="mb-16">
			<h2 class="text-2xl font-bold text-gray-900 dark:theme-text-primary mb-8">Consistency Test</h2>
			<p class="theme-text-muted dark:text-gray-400 mb-6">
				Same author should always generate the same avatar:
			</p>
			<div class="flex space-x-4 justify-center">
				{#each Array(5) as _, i}
					<div class="flex flex-col items-center space-y-2">
						<Avatar name="Sarah Wilson" size={48} />
						<p class="text-xs text-gray-500">#{i + 1}</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- Blog Card Example -->
		<section class="mb-16">
			<h2 class="text-2xl font-bold text-gray-900 dark:theme-text-primary mb-8">Blog Card Example</h2>
			<div class="max-w-md mx-auto theme-bg-card dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
				<div class="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
				<div class="p-6">
					<h3 class="text-lg font-semibold text-gray-900 dark:theme-text-primary mb-2">
						How to Build Better Products
					</h3>
					<p class="theme-text-muted dark:theme-text-muted mb-4">
						Learn the essential principles of product development and user experience design.
					</p>
					<div class="flex items-center space-x-3">
						<Avatar name="Emily Davis" size={40} />
						<div>
							<p class="text-sm font-medium text-gray-900 dark:theme-text-primary">Emily Davis</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">5 min read • Jan 7, 2025</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Performance Note -->
		<section class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
			<h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
				Performance Features
			</h3>
			<ul class="text-sm text-blue-800 dark:text-blue-200 space-y-1">
				<li>• Pure CSS and SVG - no external images</li>
				<li>• Deterministic generation - same author always gets same avatar</li>
				<li>• Lightweight - less than 2KB per avatar</li>
				<li>• Scalable - works at any size</li>
				<li>• Accessible - includes proper alt text and titles</li>
			</ul>
		</section>
	</div>
</div>
