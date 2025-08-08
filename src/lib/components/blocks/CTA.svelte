<script lang="ts">
	import { goto } from '$app/navigation';
	
	function handleGetStarted() {
		goto('/auth/signin');
	}
</script>

<section class="bg-blue-600 dark:bg-blue-700">
	<div class="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="text-3xl font-bold tracking-tight theme-text-primary sm:text-4xl">
				Ready to ship your SaaS?
				<br />
				Start building today.
			</h2>
			<p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
				Join thousands of developers who have shipped their SaaS products faster with our comprehensive boilerplate.
			</p>
			<div class="mt-10 flex items-center justify-center gap-x-6">
				<button
					on:click={handleGetStarted}
					class="rounded-md theme-bg-card px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
				>
					Get started
				</button>
				<a href="/docs" class="text-sm font-semibold leading-6 theme-text-primary hover:text-blue-100 transition-colors">
					View documentation <span aria-hidden="true">→</span>
				</a>
			</div>
		</div>
	</div>
</section>
