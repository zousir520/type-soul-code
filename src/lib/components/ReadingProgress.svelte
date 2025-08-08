<script lang="ts">
	let { target = 'article' }: { target?: string } = $props(); // CSS selector for the content to track

	let progress = $state(0);
	let isVisible = $state(false);

	function updateProgress() {
		const element = document.querySelector(target);
		if (!element) return;

		const rect = element.getBoundingClientRect();
		const elementHeight = (element as HTMLElement).offsetHeight;
		const windowHeight = window.innerHeight;
		
		// Calculate how much of the element has been scrolled past
		const scrolled = Math.max(0, -rect.top);
		const maxScroll = elementHeight - windowHeight;
		
		if (maxScroll <= 0) {
			progress = 0;
			isVisible = false;
			return;
		}

		// Calculate progress percentage
		const progressPercent = Math.min(100, Math.max(0, (scrolled / maxScroll) * 100));
		progress = progressPercent;
		
		// Show progress bar when user starts scrolling
		isVisible = scrolled > 50;
	}

	// Set up scroll listener
	$effect(() => {
		if (typeof window !== 'undefined') {
			updateProgress();
			window.addEventListener('scroll', updateProgress, { passive: true });
			window.addEventListener('resize', updateProgress, { passive: true });

			return () => {
				window.removeEventListener('scroll', updateProgress);
				window.removeEventListener('resize', updateProgress);
			};
		}
	});
</script>

<!-- Reading Progress Bar -->
<div 
	class="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200 dark:bg-gray-700 transition-opacity duration-300 {
		isVisible ? 'opacity-100' : 'opacity-0'
	}"
>
	<div 
		class="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-150 ease-out"
		style="width: {progress}%"
	></div>
</div>


<style>
	/* Ensure the progress bar appears above other content */
	.fixed {
		z-index: 50;
	}
</style>
