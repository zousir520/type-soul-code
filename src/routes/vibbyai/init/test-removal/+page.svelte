<script lang="ts">
	import { onMount } from 'svelte';
	import { CONFIG_STEPS } from '$lib/types/env-config';

	let steps = CONFIG_STEPS;
	let hasStorageStep = false;

	onMount(() => {
		// 检查是否还有存储步骤
		hasStorageStep = steps.some(step => step.id === 'storage');
	});
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-6">AWS S3 存储配置删除验证</h1>
	
	<div class="theme-bg-card rounded-lg shadow border p-6 mb-6">
		<h2 class="text-xl font-semibold mb-4">配置步骤检查</h2>
		
		{#if hasStorageStep}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4">
				<div class="flex items-center">
					<svg class="w-5 h-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
					</svg>
					<span class="text-red-800 font-medium">❌ 存储步骤仍然存在</span>
				</div>
			</div>
		{:else}
			<div class="bg-green-50 border border-green-200 rounded-lg p-4">
				<div class="flex items-center">
					<svg class="w-5 h-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span class="text-green-800 font-medium">✅ 存储步骤已成功删除</span>
				</div>
			</div>
		{/if}
	</div>

	<div class="theme-bg-card rounded-lg shadow border p-6">
		<h2 class="text-xl font-semibold mb-4">当前配置步骤列表</h2>
		<div class="space-y-3">
			{#each steps as step, index}
				<div class="flex items-center space-x-3 p-3 border theme-border rounded-lg">
					<span class="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
						{index + 1}
					</span>
					<div>
						<h3 class="font-medium text-gray-900">{step.title}</h3>
						<p class="text-sm theme-text-muted">{step.description}</p>
						<div class="flex items-center space-x-2 mt-1">
							<span class="text-xs px-2 py-1 theme-bg-muted text-gray-700 rounded">
								ID: {step.id}
							</span>
							<span class="text-xs px-2 py-1 {step.optional ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'} rounded">
								{step.optional ? '可选' : '必需'}
							</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="mt-6 text-center">
		<p class="text-sm text-gray-500">
			总共 {steps.length} 个配置步骤
		</p>
		<a 
			href="/vibbyai/init" 
			class="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 theme-text-primary rounded-lg hover:bg-blue-700 transition-colors"
		>
			返回初始化向导
		</a>
	</div>
</div>
