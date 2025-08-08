<script lang="ts">
	// Mock user data - will be replaced with real auth
	let user = $state({
		name: 'John Doe',
		email: 'john@example.com',
		avatar: '/avatar-placeholder.png',
		timezone: 'UTC',
		language: 'en',
		notifications: {
			email: true,
			push: false,
			marketing: true
		}
	});
	
	let isLoading = $state(false);
	let message = $state('');
	
	async function handleSaveProfile() {
		isLoading = true;
		try {
			// Mock API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			message = 'Profile updated successfully!';
			setTimeout(() => message = '', 3000);
		} catch (error) {
			message = 'Failed to update profile. Please try again.';
		} finally {
			isLoading = false;
		}
	}
	
	async function handleSaveNotifications() {
		isLoading = true;
		try {
			// Mock API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			message = 'Notification preferences updated!';
			setTimeout(() => message = '', 3000);
		} catch (error) {
			message = 'Failed to update notifications. Please try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Settings - SvelteKit Shipany</title>
</svelte:head>

<div class="space-y-6">
	<!-- Page header -->
	<div>
		<h1 class="text-2xl font-bold leading-7 text-gray-900 dark:theme-text-primary sm:truncate sm:text-3xl sm:tracking-tight">
			Settings
		</h1>
		<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
			Manage your account settings and preferences.
		</p>
	</div>

	{#if message}
		<div class="rounded-md bg-green-50 dark:bg-green-900 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-3">
					<p class="text-sm font-medium text-green-800 dark:text-green-200">
						{message}
					</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- Profile Settings -->
	<div class="theme-bg-card dark:bg-gray-800 shadow sm:rounded-lg">
		<div class="px-4 py-5 sm:p-6">
			<h3 class="text-base font-semibold leading-6 text-gray-900 dark:theme-text-primary">Profile Information</h3>
			<div class="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
				<p>Update your account's profile information and email address.</p>
			</div>
			<form class="mt-5 sm:flex sm:items-center" onsubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
				<div class="w-full sm:max-w-xs">
					<label for="name" class="sr-only">Name</label>
					<input
						type="text"
						id="name"
						bind:value={user.name}
						class="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:theme-text-primary dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
						placeholder="Your name"
					/>
				</div>
				<div class="mt-3 w-full sm:ml-4 sm:mt-0 sm:max-w-xs">
					<label for="email" class="sr-only">Email</label>
					<input
						type="email"
						id="email"
						bind:value={user.email}
						class="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:theme-text-primary dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
						placeholder="you@example.com"
					/>
				</div>
				<button
					type="submit"
					disabled={isLoading}
					class="mt-3 inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold theme-text-primary shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:ml-4 sm:mt-0 sm:w-auto disabled:opacity-50"
				>
					{isLoading ? 'Saving...' : 'Save'}
				</button>
			</form>
		</div>
	</div>

	<!-- Preferences -->
	<div class="theme-bg-card dark:bg-gray-800 shadow sm:rounded-lg">
		<div class="px-4 py-5 sm:p-6">
			<h3 class="text-base font-semibold leading-6 text-gray-900 dark:theme-text-primary">Preferences</h3>
			<div class="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
				<p>Configure your timezone and language preferences.</p>
			</div>
			<div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<label for="timezone" class="block text-sm font-medium leading-6 text-gray-900 dark:theme-text-primary">Timezone</label>
					<select
						id="timezone"
						bind:value={user.timezone}
						class="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:theme-text-primary dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
					>
						<option value="UTC">UTC</option>
						<option value="America/New_York">Eastern Time</option>
						<option value="America/Chicago">Central Time</option>
						<option value="America/Denver">Mountain Time</option>
						<option value="America/Los_Angeles">Pacific Time</option>
					</select>
				</div>
				<div>
					<label for="language" class="block text-sm font-medium leading-6 text-gray-900 dark:theme-text-primary">Language</label>
					<select
						id="language"
						bind:value={user.language}
						class="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:theme-text-primary dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
					>
						<option value="en">English</option>
						<option value="es">Spanish</option>
						<option value="fr">French</option>
						<option value="de">German</option>
						<option value="zh">Chinese</option>
					</select>
				</div>
			</div>
		</div>
	</div>

	<!-- Notification Settings -->
	<div class="theme-bg-card dark:bg-gray-800 shadow sm:rounded-lg">
		<div class="px-4 py-5 sm:p-6">
			<h3 class="text-base font-semibold leading-6 text-gray-900 dark:theme-text-primary">Notifications</h3>
			<div class="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
				<p>Choose how you want to be notified about account activity.</p>
			</div>
			<div class="mt-5 space-y-4">
				<div class="flex items-center">
					<input
						id="email-notifications"
						type="checkbox"
						bind:checked={user.notifications.email}
						class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
					/>
					<label for="email-notifications" class="ml-3 text-sm font-medium text-gray-900 dark:theme-text-primary">
						Email notifications
					</label>
				</div>
				<div class="flex items-center">
					<input
						id="push-notifications"
						type="checkbox"
						bind:checked={user.notifications.push}
						class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
					/>
					<label for="push-notifications" class="ml-3 text-sm font-medium text-gray-900 dark:theme-text-primary">
						Push notifications
					</label>
				</div>
				<div class="flex items-center">
					<input
						id="marketing-notifications"
						type="checkbox"
						bind:checked={user.notifications.marketing}
						class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
					/>
					<label for="marketing-notifications" class="ml-3 text-sm font-medium text-gray-900 dark:theme-text-primary">
						Marketing emails
					</label>
				</div>
			</div>
			<div class="mt-5">
				<button
					type="button"
					onclick={handleSaveNotifications}
					disabled={isLoading}
					class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold theme-text-primary shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
				>
					{isLoading ? 'Saving...' : 'Save Notifications'}
				</button>
			</div>
		</div>
	</div>

	<!-- Danger Zone -->
	<div class="theme-bg-card dark:bg-gray-800 shadow sm:rounded-lg">
		<div class="px-4 py-5 sm:p-6">
			<h3 class="text-base font-semibold leading-6 text-red-600 dark:text-red-400">Danger Zone</h3>
			<div class="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
				<p>Permanently delete your account and all associated data.</p>
			</div>
			<div class="mt-5">
				<button
					type="button"
					class="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold theme-text-primary shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
				>
					Delete Account
				</button>
			</div>
		</div>
	</div>
</div>
