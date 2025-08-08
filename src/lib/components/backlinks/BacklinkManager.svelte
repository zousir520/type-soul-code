<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Textarea } from "$lib/components/ui/textarea";
	import { onMount } from 'svelte';
	import type { BacklinkItem } from '../../../routes/api/backlink-data/+server';

	let activeSubTab = $state('free');
	let backlinkItems = $state<{ free: BacklinkItem[], paid: BacklinkItem[] }>({ free: [], paid: [] });
	let loading = $state(false);
	let saving = $state(false);

	const subTabs = [
		{ id: 'free', label: '免费外链', icon: '🆓' },
		{ id: 'paid', label: '付费外链', icon: '💰' }
	];

	// 加载外链数据
	async function loadBacklinkData() {
		loading = true;
		try {
			// 加载外链数据（现在包含状态信息）
			const dataResponse = await fetch('/api/backlink-data');
			if (dataResponse.ok) {
				const data = await dataResponse.json();
				if (data.success) {
					backlinkItems = data.data;
				}
			}
		} catch (error) {
			console.error('Error loading backlink data:', error);
		} finally {
			loading = false;
		}
	}

	// 保存进度
	async function saveProgress() {
		saving = true;
		try {
			const response = await fetch('/api/backlink-data', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(backlinkItems)
			});

			if (response.ok) {
				const result = await response.json();
				if (result.success) {
					backlinkItems = result.data;
				}
			}
		} catch (error) {
			console.error('Error saving progress:', error);
		} finally {
			saving = false;
		}
	}

	// 切换项目完成状态
	async function toggleItemCompletion(item: BacklinkItem, completed: boolean) {
		const type = item.type;
		const items = backlinkItems[type];
		const itemIndex = items.findIndex(i => i.id === item.id);

		if (itemIndex >= 0) {
			items[itemIndex].completed = completed;
			items[itemIndex].completedAt = completed ? new Date().toISOString() : null;
		}

		// 自动保存
		await saveProgress();
	}

	// 更新备注
	async function updateNotes(item: BacklinkItem, notes: string) {
		const type = item.type;
		const items = backlinkItems[type];
		const itemIndex = items.findIndex(i => i.id === item.id);

		if (itemIndex >= 0) {
			items[itemIndex].notes = notes;
		}

		// 自动保存
		await saveProgress();
	}

	// 获取完成统计
	function getCompletionStats(type: 'free' | 'paid') {
		const items = backlinkItems[type];
		const completed = items.filter(item => item.completed).length;
		return { total: items.length, completed, percentage: items.length > 0 ? Math.round((completed / items.length) * 100) : 0 };
	}

	onMount(() => {
		loadBacklinkData();
	});
</script>

<div class="space-y-6">
	<!-- Sub Tab Navigation -->
	<div class="flex space-x-1 theme-bg-muted dark:bg-gray-800 p-1 rounded-lg">
		{#each subTabs as tab}
			<button
				onclick={() => activeSubTab = tab.id}
				class="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors {
					activeSubTab === tab.id
						? 'theme-bg-card dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
						: 'theme-text-muted dark:text-gray-400 hover:text-gray-900 dark:hover:theme-text-primary'
				}"
			>
				<span>{tab.icon}</span>
				{tab.label}
				{#if backlinkItems[tab.id as 'free' | 'paid'].length > 0}
					<Badge variant="outline" class="ml-1">
						{getCompletionStats(tab.id as 'free' | 'paid').completed}/{getCompletionStats(tab.id as 'free' | 'paid').total}
					</Badge>
				{/if}
			</button>
		{/each}
	</div>

	{#if loading}
		<div class="text-center py-8">
			<p class="theme-text-muted dark:text-gray-400">加载外链数据中...</p>
		</div>
	{:else}
		<!-- Progress Overview -->
		{#if backlinkItems[activeSubTab as 'free' | 'paid'].length > 0}
			<Card class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
				<CardHeader>
					<CardTitle class="text-blue-800 dark:text-blue-200">
						{activeSubTab === 'free' ? '🆓 免费外链进度' : '💰 付费外链进度'}
					</CardTitle>
					<CardDescription class="text-blue-600 dark:text-blue-300">
						{(() => {
							const stats = getCompletionStats(activeSubTab as 'free' | 'paid');
							return `已完成 ${stats.completed} / ${stats.total} 项 (${stats.percentage}%)`;
						})()}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
						<div
							class="h-3 rounded-full transition-all duration-300 {
								activeSubTab === 'free' ? 'bg-green-500' : 'bg-blue-500'
							}"
							style="width: {getCompletionStats(activeSubTab as 'free' | 'paid').percentage}%"
						></div>
					</div>
				</CardContent>
			</Card>
		{/if}

		<!-- Backlink Items List -->
		<Card>
			<CardHeader>
				<CardTitle class="flex items-center justify-between">
					<span>
						{activeSubTab === 'free' ? '🆓 免费外链列表' : '💰 付费外链列表'}
					</span>
					<Button onclick={saveProgress} disabled={saving} size="sm">
						{saving ? '保存中...' : '保存进度'}
					</Button>
				</CardTitle>
				<CardDescription>
					{activeSubTab === 'free' 
						? '管理免费外链资源，包括目录提交、社交媒体等' 
						: '管理付费外链资源，包括客座文章、利基编辑等'
					}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{#if backlinkItems[activeSubTab as 'free' | 'paid'].length === 0}
					<div class="text-center py-8">
						<p class="theme-text-muted dark:text-gray-400">
							{activeSubTab === 'free' ? '暂无免费外链数据' : '暂无付费外链数据'}
						</p>
						<p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
							请确保 data/backlink.xlsx 文件存在并包含相应的工作表
						</p>
					</div>
				{:else}
					<div class="space-y-4">
						{#each backlinkItems[activeSubTab as 'free' | 'paid'] as item}
							<div class="border theme-border dark:theme-border rounded-lg p-4 {item.completed ? 'bg-green-50 dark:bg-green-900/20' : ''}">
								<div class="flex items-start gap-3">
									<Checkbox
										checked={item.completed}
										onCheckedChange={(checked) => toggleItemCompletion(item, Boolean(checked))}
										class="mt-1"
									/>
									<div class="flex-1 min-w-0">
										<div class="flex items-center gap-2 mb-2">
											<h4 class="font-medium text-gray-900 dark:theme-text-primary truncate">
												{item.name}
											</h4>
											{#if item.priority}
												<Badge variant={
													item.priority === 'high' ? 'destructive' :
													item.priority === 'medium' ? 'default' : 'secondary'
												}>
													{item.priority === 'high' ? '高优先级' : 
													 item.priority === 'medium' ? '中优先级' : '低优先级'}
												</Badge>
											{/if}
											{#if item.category}
												<Badge variant="outline">{item.category}</Badge>
											{/if}
										{#if item.traffic}
											<Badge variant="secondary">流量: {item.traffic}</Badge>
										{/if}
										{#if item.as}
											<Badge variant="secondary">AS: {item.as}</Badge>
										{/if}
										{#if item.price}
											<Badge variant="default">💰 {item.price}</Badge>
										{/if}
										</div>
										
										{#if item.url}
											<a 
												href={item.url} 
												target="_blank" 
												rel="noopener noreferrer"
												class="text-sm text-blue-600 dark:text-blue-400 hover:underline block mb-2"
											>
												{item.url}
											</a>
										{/if}
										


										<!-- Notes -->
										<div class="mt-3">
											<Textarea
												placeholder="添加备注..."
												value={item.notes}
												oninput={(e) => updateNotes(item, (e.target as HTMLTextAreaElement)?.value || '')}
												class="text-sm"
												rows={2}
											/>
										</div>

										{#if item.completedAt}
											<p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
												完成时间: {new Date(item.completedAt).toLocaleString('zh-CN')}
											</p>
										{/if}
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</CardContent>
		</Card>
	{/if}
</div>
