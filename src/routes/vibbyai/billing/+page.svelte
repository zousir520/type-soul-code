<script lang="ts">
	// Mock billing data
	const currentPlan = {
		name: 'Pro Plan',
		price: '$199',
		period: 'one-time',
		features: [
			'Continuously updated tenniszero.org tutorials',
			'Continuously updated AI coding tutorials',
			'Real-time updates',
			'Priority feature requests',
			'Free analytics dashboard',
			'Exclusive paid user community',
			'10 premium templates (worth $100)',
			'$50 AI API credits included'
		]
	};

	const billingHistory = [
		{
			id: 1,
			date: '2024-01-15',
			description: 'Pro Plan - One-time payment',
			amount: '$199.00',
			status: 'paid'
		},
		{
			id: 2,
			date: '2024-01-10',
			description: 'Additional API Credits',
			amount: '$25.00',
			status: 'paid'
		},
		{
			id: 3,
			date: '2024-01-01',
			description: 'Free Plan Upgrade',
			amount: '$0.00',
			status: 'completed'
		}
	];

	const usageBreakdown = [
		{ service: 'API Calls', usage: '2,847', limit: '10,000', cost: '$0.00' },
		{ service: 'Storage', usage: '1.2 GB', limit: '5 GB', cost: '$0.00' },
		{ service: 'Premium Templates', usage: '3', limit: '10', cost: '$0.00' },
		{ service: 'AI Credits', usage: '847', limit: '5,000', cost: '$0.00' }
	];
</script>

<svelte:head>
	<title>Billing - tenniszero.org Dashboard</title>
</svelte:head>

<div class="space-y-6">
	<!-- Page header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900 dark:theme-text-primary">Billing & Subscription</h1>
		<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
			Manage your subscription, view usage, and download invoices.
		</p>
	</div>

	<!-- Current plan -->
	<div class="theme-bg-card dark:bg-gray-800 overflow-hidden shadow rounded-lg">
		<div class="p-6">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="text-lg font-medium text-gray-900 dark:theme-text-primary">Current Plan</h3>
					<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
						You're currently on the {currentPlan.name}
					</p>
				</div>
				<div class="text-right">
					<p class="text-2xl font-bold text-gray-900 dark:theme-text-primary">{currentPlan.price}</p>
					<p class="text-sm text-gray-500 dark:text-gray-400">{currentPlan.period}</p>
				</div>
			</div>
			
			<div class="mt-6">
				<h4 class="text-sm font-medium text-gray-900 dark:theme-text-primary">Plan Features</h4>
				<ul class="mt-3 space-y-2">
					{#each currentPlan.features as feature}
						<li class="flex items-center text-sm theme-text-muted dark:theme-text-muted">
							<svg class="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							{feature}
						</li>
					{/each}
				</ul>
			</div>

			<div class="mt-6 flex space-x-3">
				<button class="bg-blue-600 hover:bg-blue-700 theme-text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors">
					Upgrade Plan
				</button>
				<button class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:theme-text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors">
					Change Plan
				</button>
			</div>
		</div>
	</div>

	<!-- Usage breakdown -->
	<div class="theme-bg-card dark:bg-gray-800 overflow-hidden shadow rounded-lg">
		<div class="p-6">
			<h3 class="text-lg font-medium text-gray-900 dark:theme-text-primary">Current Usage</h3>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
				Your usage for the current billing period.
			</p>
			
			<div class="mt-6 overflow-hidden">
				<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
					<thead class="bg-gray-50 dark:bg-gray-700">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:theme-text-muted uppercase tracking-wider">
								Service
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:theme-text-muted uppercase tracking-wider">
								Usage
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:theme-text-muted uppercase tracking-wider">
								Limit
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:theme-text-muted uppercase tracking-wider">
								Cost
							</th>
						</tr>
					</thead>
					<tbody class="theme-bg-card dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
						{#each usageBreakdown as item}
							<tr>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:theme-text-primary">
									{item.service}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
									{item.usage}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
									{item.limit}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
									{item.cost}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- Billing history -->
	<div class="theme-bg-card dark:bg-gray-800 overflow-hidden shadow rounded-lg">
		<div class="p-6">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="text-lg font-medium text-gray-900 dark:theme-text-primary">Billing History</h3>
					<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
						Your recent transactions and invoices.
					</p>
				</div>
				<button class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:theme-text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors">
					Download All
				</button>
			</div>
			
			<div class="mt-6 overflow-hidden">
				<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
					<thead class="bg-gray-50 dark:bg-gray-700">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:theme-text-muted uppercase tracking-wider">
								Date
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:theme-text-muted uppercase tracking-wider">
								Description
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:theme-text-muted uppercase tracking-wider">
								Amount
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:theme-text-muted uppercase tracking-wider">
								Status
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:theme-text-muted uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody class="theme-bg-card dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
						{#each billingHistory as transaction}
							<tr>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
									{transaction.date}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:theme-text-primary">
									{transaction.description}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
									{transaction.amount}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {transaction.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'}">
										{transaction.status}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
									<button class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
										Download
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
