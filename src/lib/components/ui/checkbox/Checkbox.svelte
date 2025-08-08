<script lang="ts">
	import { cn } from "$lib/utils.ts";
	import { Check } from "lucide-svelte";
	import type { HTMLInputAttributes } from "svelte/elements";

	interface Props extends HTMLInputAttributes {
		ref?: HTMLInputElement | null;
		class?: string;
		checked?: boolean;
		onCheckedChange?: (checked: boolean) => void;
	}
  //213  
	let {
		ref = $bindable(null),
		class: className,
		checked = $bindable(false),
		onCheckedChange,
		...restProps
	}: Props = $props();

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		checked = target.checked;
		onCheckedChange?.(checked);
	}
</script>

<div class="relative inline-flex items-center">
	<input
		bind:this={ref}
		type="checkbox"
		bind:checked
		onchange={handleChange}
		data-slot="checkbox"
		class={cn(
			"peer size-5 shrink-0 rounded-md border-2 border-gray-400 dark:border-gray-500 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-blue-600 checked:border-blue-600 hover:border-blue-500 transition-colors duration-200 appearance-none cursor-pointer",
			className
		)}
		{...restProps}
	/>
	{#if checked}
		<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
			<Check class="size-3.5 theme-text-primary font-bold stroke-[3]" />
		</div>
	{/if}
</div>