<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { ConfigStep } from '$lib/types/env-config';

	interface Props {
		steps: ConfigStep[];
		currentStep: number;
		isStepValid: (stepIndex: number) => boolean;
	}

	let { steps, currentStep, isStepValid }: Props = $props();

	const dispatch = createEventDispatcher();

	function handleStepClick(stepIndex: number) {
		// 只允许点击已完成的步骤或当前步骤
		if (stepIndex <= currentStep) {
			dispatch('stepClick', stepIndex);
		}
	}

	function getStepStatus(stepIndex: number): 'completed' | 'current' | 'upcoming' | 'invalid' {
		if (stepIndex < currentStep) {
			return isStepValid(stepIndex) ? 'completed' : 'invalid';
		} else if (stepIndex === currentStep) {
			return 'current';
		} else {
			return 'upcoming';
		}
	}

	function getStepClasses(stepIndex: number): string {
		const status = getStepStatus(stepIndex);
		const baseClasses = 'relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200';
		
		switch (status) {
			case 'completed':
				return `${baseClasses} bg-green-600 border-green-600 theme-text-primary cursor-pointer hover:bg-green-700`;
			case 'current':
				return `${baseClasses} bg-blue-600 border-blue-600 theme-text-primary shadow-lg ring-4 ring-blue-200 dark:ring-blue-800`;
			case 'invalid':
				return `${baseClasses} bg-red-100 border-red-300 text-red-600 dark:bg-red-900 dark:border-red-700 dark:text-red-400`;
			case 'upcoming':
				return `${baseClasses} theme-bg-muted border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-500`;
			default:
				return baseClasses;
		}
	}

	function getConnectorClasses(stepIndex: number): string {
		const status = getStepStatus(stepIndex);
		const nextStatus = stepIndex < steps.length - 1 ? getStepStatus(stepIndex + 1) : 'upcoming';
		
		if (status === 'completed' || (status === 'current' && nextStatus !== 'upcoming')) {
			return 'bg-green-600';
		} else if (status === 'current') {
			return 'bg-blue-600';
		} else {
			return 'bg-gray-300 dark:bg-gray-600';
		}
	}

	function getStepIcon(stepIndex: number): string {
		const status = getStepStatus(stepIndex);
		
		if (status === 'completed') {
			return 'M4.5 12.75l6 6 9-13.5'; // Check icon
		} else if (status === 'invalid') {
			return 'M6 18L18 6M6 6l12 12'; // X icon
		} else {
			return (stepIndex + 1).toString(); // Step number
		}
	}

	function isStepClickable(stepIndex: number): boolean {
		return stepIndex <= currentStep;
	}
</script>

<div class="mb-8">
	<!-- Desktop Step Indicator -->
	<div class="hidden md:block">
		<div class="flex items-center justify-center space-x-4">
			{#each steps as step, index}
				<div class="flex items-center">
					<!-- Step Circle -->
					<button
						onclick={() => handleStepClick(index)}
						disabled={!isStepClickable(index)}
						class={getStepClasses(index)}
						title={step.title}
					>
						{#if getStepStatus(index) === 'completed'}
							<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d={getStepIcon(index)} />
							</svg>
						{:else if getStepStatus(index) === 'invalid'}
							<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d={getStepIcon(index)} />
							</svg>
						{:else}
							<span class="text-sm font-semibold">{index + 1}</span>
						{/if}
					</button>

					<!-- Step Label -->
					<div class="ml-3 min-w-0">
						<p class="text-sm font-medium text-gray-900 dark:theme-text-primary">{step.title}</p>
						{#if step.optional}
							<p class="text-xs text-gray-500 dark:text-gray-400">Optional</p>
						{/if}
					</div>

					<!-- Connector Line -->
					{#if index < steps.length - 1}
						<div class="flex-1 mx-4">
							<div class={`h-0.5 ${getConnectorClasses(index)} transition-colors duration-200`}></div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- Mobile Step Indicator -->
	<div class="md:hidden">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-medium text-gray-900 dark:theme-text-primary">
				{steps[currentStep].title}
			</h3>
			<span class="text-sm text-gray-500 dark:text-gray-400">
				{currentStep + 1} / {steps.length}
			</span>
		</div>

		<!-- Progress Bar -->
		<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
			<div 
				class="bg-blue-600 h-2 rounded-full transition-all duration-300"
				style="width: {((currentStep + 1) / steps.length) * 100}%"
			></div>
		</div>

		<!-- Step Navigation -->
		<div class="flex items-center justify-center space-x-2">
			{#each steps as step, index}
				<button
					onclick={() => handleStepClick(index)}
					disabled={!isStepClickable(index)}
					class="w-3 h-3 rounded-full transition-all duration-200 {
						index === currentStep 
							? 'bg-blue-600 ring-2 ring-blue-200 dark:ring-blue-800' 
							: index < currentStep 
								? 'bg-green-600' 
								: 'bg-gray-300 dark:bg-gray-600'
					} {isStepClickable(index) ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'}"
					title={step.title}
				></button>
			{/each}
		</div>
	</div>

	<!-- Current Step Info -->
	<div class="mt-6 text-center">
		<div class="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/50 rounded-full">
			<div class="w-2 h-2 bg-blue-600 rounded-full"></div>
			<span class="text-sm font-medium text-blue-800 dark:text-blue-200">
				{steps[currentStep].category === 'basic' ? '基础配置' :
				 steps[currentStep].category === 'database' ? '数据库' :
				 steps[currentStep].category === 'auth' ? '认证' :
				 steps[currentStep].category === 'payment' ? '支付' :
				 steps[currentStep].category === 'storage' ? '存储' :
				 steps[currentStep].category === 'analytics' ? '分析' : '其他'}
			</span>
			{#if steps[currentStep].optional}
				<span class="text-xs px-2 py-1 theme-bg-muted dark:bg-gray-700 theme-text-muted dark:text-gray-400 rounded-full">
					可选
				</span>
			{/if}
		</div>
	</div>
</div>

<style>
	button:disabled {
		cursor: not-allowed;
	}
	
	button:not(:disabled):hover {
		transform: translateY(-1px);
	}
</style>
