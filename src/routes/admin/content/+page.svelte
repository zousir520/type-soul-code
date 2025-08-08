<script lang="ts">

	let contentSource = $state('local-only');
	let githubOwner = $state('gstarwd');
	let githubRepo = $state('sveltia_cms_git');
	let githubBranch = $state('main');
	let githubToken = $state('');
	let testResult = $state<{ success: boolean; message: string; posts?: any[] } | null>(null);
	let isLoading = $state(false);

	async function testGitHubConnection() {
		isLoading = true;
		testResult = null;

		try {
			const response = await fetch('/api/admin/test-github', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					owner: githubOwner,
					repo: githubRepo,
					branch: githubBranch,
					token: githubToken
				})
			});

			const result = await response.json();
			testResult = result;
		} catch (error) {
			testResult = {
				success: false,
				message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
			};
		} finally {
			isLoading = false;
		}
	}

	async function updateContentSource() {
		isLoading = true;

		try {
			const response = await fetch('/api/admin/update-content-source', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					source: contentSource,
					github: {
						owner: githubOwner,
						repo: githubRepo,
						branch: githubBranch,
						token: githubToken
					}
				})
			});

			if (response.ok) {
				alert('Content source updated successfully! Please restart the server for changes to take effect.');
			} else {
				alert('Failed to update content source');
			}
		} catch (error) {
			alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen bg-gray-50 dark:theme-bg-muted py-12">
	<div class="mx-auto max-w-4xl px-6 lg:px-8">
		<div class="theme-bg-card dark:bg-gray-800 shadow rounded-lg">
			<div class="px-6 py-8">
				<h1 class="text-2xl font-bold text-gray-900 dark:theme-text-primary mb-8">Content Source Configuration</h1>

				<!-- Content Source Selection -->
				<div class="mb-8">
					<label for="content-source" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
						Content Source Strategy
					</label>
					<select
						id="content-source"
						bind:value={contentSource}
						class="block w-full rounded-md border border-gray-300 dark:border-gray-600 theme-bg-card dark:bg-gray-700 px-3 py-2 text-gray-900 dark:theme-text-primary focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					>
						<option value="local-only">Local Files Only</option>
						<option value="github-first">GitHub First (fallback to local)</option>
						<option value="github-only">GitHub Only</option>
					</select>
					<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
						Choose how to load blog content. "Local Files Only" uses files in src/content/blog.
					</p>
				</div>

				<!-- GitHub Configuration -->
				<div class="mb-8 space-y-4">
					<h2 class="text-lg font-semibold text-gray-900 dark:theme-text-primary">GitHub Repository Settings</h2>
					
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="github-owner" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-1">
								GitHub Owner
							</label>
							<input
								id="github-owner"
								type="text"
								bind:value={githubOwner}
								placeholder="username or organization"
								class="block w-full rounded-md border border-gray-300 dark:border-gray-600 theme-bg-card dark:bg-gray-700 px-3 py-2 text-gray-900 dark:theme-text-primary focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							/>
						</div>
						
						<div>
							<label for="github-repo" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-1">
								Repository Name
							</label>
							<input
								id="github-repo"
								type="text"
								bind:value={githubRepo}
								placeholder="repository-name"
								class="block w-full rounded-md border border-gray-300 dark:border-gray-600 theme-bg-card dark:bg-gray-700 px-3 py-2 text-gray-900 dark:theme-text-primary focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label for="github-branch" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-1">
								Branch
							</label>
							<input
								id="github-branch"
								type="text"
								bind:value={githubBranch}
								placeholder="main"
								class="block w-full rounded-md border border-gray-300 dark:border-gray-600 theme-bg-card dark:bg-gray-700 px-3 py-2 text-gray-900 dark:theme-text-primary focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label for="github-token" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-1">
								GitHub Token (Optional)
							</label>
							<input
								id="github-token"
								type="password"
								bind:value={githubToken}
								placeholder="ghp_xxxxxxxxxxxx"
								class="block w-full rounded-md border border-gray-300 dark:border-gray-600 theme-bg-card dark:bg-gray-700 px-3 py-2 text-gray-900 dark:theme-text-primary focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							/>
							<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
								Required for private repositories
							</p>
						</div>
					</div>
				</div>

				<!-- Test Connection -->
				<div class="mb-8">
					<button
						onclick={testGitHubConnection}
						disabled={isLoading}
						class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium theme-text-primary shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if isLoading}
							<svg class="animate-spin -ml-1 mr-2 h-4 w-4 theme-text-primary" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Testing...
						{:else}
							Test GitHub Connection
						{/if}
					</button>
				</div>

				<!-- Test Results -->
				{#if testResult}
					<div class="mb-8 rounded-md p-4 {testResult.success ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}">
						<div class="flex">
							<div class="flex-shrink-0">
								{#if testResult.success}
									<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
										<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
									</svg>
								{:else}
									<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
										<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
									</svg>
								{/if}
							</div>
							<div class="ml-3">
								<h3 class="text-sm font-medium {testResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}">
									{testResult.success ? 'Connection Successful' : 'Connection Failed'}
								</h3>
								<div class="mt-2 text-sm {testResult.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}">
									<p>{testResult.message}</p>
									{#if testResult.posts && testResult.posts.length > 0}
										<p class="mt-2">Found {testResult.posts.length} blog posts:</p>
										<ul class="mt-1 list-disc list-inside">
											{#each testResult.posts.slice(0, 5) as post}
												<li>{post}</li>
											{/each}
											{#if testResult.posts.length > 5}
												<li>... and {testResult.posts.length - 5} more</li>
											{/if}
										</ul>
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- Save Configuration -->
				<div class="flex justify-end">
					<button
						onclick={updateContentSource}
						disabled={isLoading}
						class="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium theme-text-primary shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if isLoading}
							<svg class="animate-spin -ml-1 mr-2 h-4 w-4 theme-text-primary" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Saving...
						{:else}
							Save Configuration
						{/if}
					</button>
				</div>

				<!-- Instructions -->
				<div class="mt-8 rounded-md bg-blue-50 dark:bg-blue-900/20 p-4">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
							</svg>
						</div>
						<div class="ml-3">
							<h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">Setup Instructions</h3>
							<div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
								<ol class="list-decimal list-inside space-y-1">
									<li>Create a GitHub repository for your blog content</li>
									<li>Create a folder structure: <code class="bg-blue-100 dark:bg-blue-800 px-1 rounded">src/content/blog/</code></li>
									<li>Add your blog posts as Markdown files in that folder</li>
									<li>Update the Sveltia CMS config to point to your repository</li>
									<li>Test the connection above and save the configuration</li>
								</ol>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
