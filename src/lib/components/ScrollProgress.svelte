<script lang="ts">
	let progress = $state(0);
	let isVisible = $state(false);

	function updateProgress() {
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
		
		if (scrollHeight <= 0) {
			progress = 0;
			isVisible = false;
			return;
		}

		// Calculate progress percentage
		const progressPercent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
		progress = progressPercent;
		
		// Show progress bar when user starts scrolling
		isVisible = scrollTop > 100;
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

<!-- Simple Page Scroll Progress Bar -->
<div 
	class="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200/50 dark:bg-gray-700/50 transition-opacity duration-300 {
		isVisible ? 'opacity-100' : 'opacity-0'
	}"
>
	<div 
		class="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-150 ease-out"
		style="width: {progress}%"
	></div>
</div>
