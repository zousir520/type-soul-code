<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let loading = true;
	let error = null;
	let debugInfo = '';

	onMount(() => {
		if (browser) {
			debugInfo += 'Browser environment detected\n';

			// 检查是否已经有 access token
			const hash = window.location.hash;
			if (hash.includes('access_token')) {
				debugInfo += 'Access token found in URL\n';
			} else {
				debugInfo += 'No access token in URL\n';
			}

			// 加载 Sveltia CMS，使用多个 CDN 备用
			const cdnUrls = [
				'https://unpkg.com/@sveltia/cms@latest/dist/sveltia-cms.js',
				'https://cdn.jsdelivr.net/npm/@sveltia/cms@latest/dist/sveltia-cms.js',
				'https://esm.sh/@sveltia/cms@latest/dist/sveltia-cms.js'
			];

			let currentCdnIndex = 0;

			function loadCmsScript() {
				if (currentCdnIndex >= cdnUrls.length) {
					debugInfo += 'All CDN sources failed\n';
					error = 'Failed to load CMS script from all sources';
					loading = false;
					return;
				}

				const script = document.createElement('script');
				script.type = 'module';
				script.src = cdnUrls[currentCdnIndex];

				debugInfo += `Trying CDN ${currentCdnIndex + 1}: ${script.src}\n`;

				script.onload = () => {
					debugInfo += `CDN ${currentCdnIndex + 1} loaded successfully\n`;
					loading = false;

					// 等待 Sveltia CMS 初始化
					setTimeout(() => {
						const cmsElement = document.querySelector('#sveltia-cms');
						if (cmsElement && cmsElement.children.length > 0) {
							debugInfo += 'Sveltia CMS initialized successfully\n';
						} else {
							debugInfo += 'Sveltia CMS element found but no content\n';
							// 不设置错误，因为 CMS 可能需要更多时间初始化
						}
					}, 5000);
				};

				script.onerror = () => {
					debugInfo += `CDN ${currentCdnIndex + 1} failed, trying next...\n`;
					currentCdnIndex++;
					// 移除失败的脚本
					document.head.removeChild(script);
					// 尝试下一个 CDN
					setTimeout(loadCmsScript, 1000);
				};

				document.head.appendChild(script);
			}

			loadCmsScript();
		}
	});
</script>

<svelte:head>
	<title>Sveltia CMS</title>
	<link rel="icon" type="image/x-icon" href="https://sveltia.com/favicon.ico">
</svelte:head>

{#if loading}
	<div class="loading">
		<h2>Loading Sveltia CMS...</h2>
		<p>Please wait while we initialize the content management system.</p>
		<div class="spinner"></div>
	</div>
{:else if error}
	<div class="error">
		<h2>Error Loading CMS</h2>
		<p>{error}</p>
		<details>
			<summary>Debug Information</summary>
			<pre>{debugInfo}</pre>
		</details>
		<button on:click={() => window.location.reload()}>Reload Page</button>
	</div>
{/if}

<div id="sveltia-cms" class:hidden={loading || error}></div>

<!-- Debug panel (only show if there are issues) -->
{#if debugInfo && (loading || error)}
	<div class="debug-panel">
		<h3>Debug Info:</h3>
		<pre>{debugInfo}</pre>
		<p>Current URL: {browser ? window.location.href : 'N/A'}</p>
	</div>
{/if}

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	#sveltia-cms {
		width: 100vw;
		height: 100vh;
	}

	.hidden {
		display: none;
	}

	.loading, .error {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		padding: 2rem;
		text-align: center;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	.loading h2, .error h2 {
		margin-bottom: 1rem;
		color: #333;
	}

	.loading p, .error p {
		color: #666;
		margin-bottom: 2rem;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #3498db;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.error {
		background-color: #fef2f2;
		color: #dc2626;
	}

	.error h2 {
		color: #dc2626;
	}

	.error button {
		background-color: #dc2626;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 1rem;
		margin-top: 1rem;
	}

	.error button:hover {
		background-color: #b91c1c;
	}

	.debug-panel {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #f8f9fa;
		border-top: 1px solid #dee2e6;
		padding: 1rem;
		max-height: 200px;
		overflow-y: auto;
		font-family: monospace;
		font-size: 0.875rem;
	}

	.debug-panel h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
	}

	.debug-panel pre {
		margin: 0;
		white-space: pre-wrap;
		color: #495057;
	}

	details {
		margin: 1rem 0;
		text-align: left;
	}

	summary {
		cursor: pointer;
		padding: 0.5rem;
		background: #f8f9fa;
		border: 1px solid #dee2e6;
		border-radius: 0.25rem;
	}

	details pre {
		margin: 0.5rem 0;
		padding: 1rem;
		background: #f8f9fa;
		border: 1px solid #dee2e6;
		border-radius: 0.25rem;
		overflow-x: auto;
	}
</style>
