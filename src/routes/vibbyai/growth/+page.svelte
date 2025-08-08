<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { onMount } from 'svelte';
	import BacklinkManager from '$lib/components/backlinks/BacklinkManager.svelte';

	let activeTab = $state('overview');
	let seoProgress = $state({} as Record<string, any>);
	let loading = $state(false);
	let saving = $state(false);

	// 加载 SEO 进度
	async function loadSeoProgress() {
		loading = true;
		try {
			const response = await fetch('/api/seo-progress');
			if (response.ok) {
				const result = await response.json();
				// 处理标准化API响应格式
				if (result.success && result.data) {
					seoProgress = result.data;
				} else {
					console.error('Invalid API response format:', result);
					seoProgress = {};
				}
			}
		} catch (error) {
			console.error('Error loading SEO progress:', error);
		} finally {
			loading = false;
		}
	}

	// 保存 SEO 进度
	async function saveSeoProgress() {
		saving = true;
		try {
			const response = await fetch('/api/seo-progress', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(seoProgress)
			});

			if (response.ok) {
				const result = await response.json();
				// 处理标准化API响应格式
				if (result.success) {
					console.log('SEO progress saved successfully:', result.message);
					// 如果API返回了更新后的数据，使用它来更新本地状态
					if (result.data) {
						seoProgress = result.data;
					}
				} else {
					console.error('Save failed:', result.error || result.message);
				}
			} else {
				console.error('Save request failed with status:', response.status);
			}
		} catch (error) {
			console.error('Error saving SEO progress:', error);
		} finally {
			saving = false;
		}
	}

	// 切换 todo 状态
	function toggleTodo(month: string, category: string, item: string) {
		if (!seoProgress[month]) {
			seoProgress[month] = {};
		}
		if (!seoProgress[month][category]) {
			seoProgress[month][category] = {};
		}

		seoProgress[month][category][item] = !seoProgress[month][category][item];
		saveSeoProgress(); // 自动保存
	}

	// 获取 todo 状态
	function getTodoStatus(month: string, category: string, item: string): boolean {
		return seoProgress[month]?.[category]?.[item] || false;
	}

	// 计算完成百分比
	function getCompletionPercentage(month: string): number {
		if (!seoProgress[month]) return 0;

		let total = 0;
		let completed = 0;

		Object.values(seoProgress[month]).forEach((category: any) => {
			Object.values(category).forEach((status: any) => {
				total++;
				if (status) completed++;
			});
		});

		return total > 0 ? Math.round((completed / total) * 100) : 0;
	}

	onMount(() => {
		loadSeoProgress();
	});

	const tabs = [
		{ id: 'overview', label: '概览', icon: '📊' },
		{ id: 'search-platforms', label: '搜索平台', icon: '🔍' },
		{ id: 'seo', label: 'SEO 教程', icon: '📚' },
		{ id: 'backlinks', label: '外链', icon: '🔗' },
		{ id: 'analytics', label: '数据分析', icon: '📈' },
		{ id: 'tools', label: '工具管理', icon: '🛠️' }
	];

	const seoMonths = [
		{
			month: 1,
			monthKey: 'month1',
			title: '第一个月 - 基础铺垫 (Pillow Links)',
			description: '建立自然的外链档案，为后续高质量外链做准备',
			status: 'foundation',
			tasks: [
				{
					category: 'A. 锚文本和目标页面',
					categoryKey: 'anchors',
					items: [
						{ text: '仅针对首页建设外链', key: 'homepage-only' },
						{ text: '使用自然锚文本（品牌词、URL、通用词）', key: 'natural-anchors' },
						{ text: '避免过度优化的关键词锚文本', key: 'avoid-over-optimization' }
					]
				},
				{
					category: 'B. 社交媒体档案',
					categoryKey: 'social',
					items: [
						{ text: '手动设置主要社交媒体账号', key: 'setup-main-profiles' },
						{ text: '创建 50-100 个社交媒体档案', key: 'create-50-100-profiles' },
						{ text: '确保信息一致性和完整性', key: 'ensure-consistency' }
					]
				},
				{
					category: 'C. 社交信号',
					categoryKey: 'signals',
					items: [
						{ text: '在 Reddit、X(Twitter)、LinkedIn、Facebook 发布内容', key: 'post-content' },
						{ text: '进行点赞、评论、分享等互动', key: 'engage-interactions' },
						{ text: '建立社交媒体活跃度', key: 'build-activity' }
					]
				},
				{
					category: 'D. 引用和目录',
					categoryKey: 'citations',
					items: [
						{ text: '在主要平台（如 Yelp）创建商业档案', key: 'create-business-profiles' },
						{ text: '提交到 50-100 个"简单"目录', key: 'submit-50-100-directories' },
						{ text: '考虑 BBB（Better Business Bureau）认证', key: 'consider-bbb' }
					]
				},
				{
					category: 'E. 其他元素',
					categoryKey: 'additional',
					items: [
						{ text: '提交到行业相关目录', key: 'submit-niche-directories' },
						{ text: '发布 50-150 个新闻稿（从便宜到昂贵）', key: 'publish-press-releases' },
						{ text: '确保新闻稿被索引', key: 'ensure-indexing' }
					]
				},
				{
					category: 'F. 可选元素（适度使用）',
					categoryKey: 'optional',
					items: [
						{ text: '非垃圾博客评论', key: 'non-spam-blog-comments' },
						{ text: '非垃圾论坛评论', key: 'non-spam-forum-comments' },
						{ text: 'Web 2.0 属性', key: 'web2-properties' },
						{ text: '问答平台链接', key: 'qa-links' },
						{ text: '音频/视频内容', key: 'audio-video-content' },
						{ text: '幻灯片链接', key: 'slideshow-links' },
						{ text: '云堆叠', key: 'cloud-stacking' },
						{ text: '免费寄生虫', key: 'free-parasites' },
						{ text: '评论网站（如 Trustpilot）', key: 'review-sites' }
					]
				}
			]
		},
		{
			month: 2,
			monthKey: 'month2',
			title: '第二个月 - 高质量外链建设',
			description: '开始投入更多成本，建设能"移动指针"的高质量外链',
			status: 'building',
			tasks: [
				{
					category: '核心策略',
					categoryKey: 'core',
					items: [
						{ text: '继续专注首页和自然锚文本', key: 'focus-homepage-natural' },
						{ text: '暂时不关注流量，专注权重传递', key: 'no-traffic-focus' },
						{ text: '建设能显著影响排名的外链', key: 'build-impactful-links' }
					]
				},
				{
					category: '主要外链方法',
					categoryKey: 'methods',
					items: [
						{ text: '客座文章 (Guest Posts)', key: 'guest-posts' },
						{ text: '利基编辑 (Niche Edits) - 在现有文章中插入链接', key: 'niche-edits' },
						{ text: 'HARO (Help A Reporter Out) - 帮助记者回答问题获得媒体链接', key: 'haro' }
					]
				},
				{
					category: '实施方法',
					categoryKey: 'implementation',
					items: [
						{ text: '通过服务提供商购买', key: 'use-providers' },
						{ text: '自己实施外联', key: 'self-outreach' },
						{ text: '雇佣虚拟助手 (VA)', key: 'hire-va' },
						{ text: '主动外联', key: 'active-outreach' },
						{ text: '竞争对手链接分析和复制', key: 'competitor-analysis' },
						{ text: '摩天大楼技术 (Skyscraper Technique)', key: 'skyscraper-technique' },
						{ text: '链接诱饵 (Link Bait)', key: 'link-bait' }
					]
				}
			]
		},
		{
			month: 3,
			monthKey: 'month3',
			title: '第三个月及以后 - 内页外链分布',
			description: '网站开始获得流量后，将外链分布到内页',
			status: 'advanced',
			tasks: [
				{
					category: '时机和流量',
					categoryKey: 'timing',
					items: [
						{ text: '网站开始获得自然流量时实施', key: 'implement-with-traffic' },
						{ text: '继续客座文章、利基编辑和 HARO', key: 'continue-guest-posts' },
						{ text: '保持外链建设的连续性', key: 'maintain-continuity' }
					]
				},
				{
					category: '链接分布比例',
					categoryKey: 'distribution',
					items: [
						{ text: '首页仍保持主要比例（通常 50-80%）', key: 'maintain-homepage-ratio' },
						{ text: '根据竞争对手分析调整比例', key: 'adjust-based-on-competitors' }
					]
				},
				{
					category: '目标页面类型',
					categoryKey: 'targets',
					items: [
						{ text: '商业页面 (Money Pages)', key: 'money-pages' },
						{ text: '分类/产品页面', key: 'category-product-pages' },
						{ text: '枢纽页面 (Hub Pages)', key: 'hub-pages' },
						{ text: '链接诱饵内容', key: 'link-bait-content' },
						{ text: '分析竞争对手的自然模式', key: 'analyze-competitor-patterns' },
						{ text: '重视内部链接建设', key: 'focus-internal-linking' }
					]
				},
				{
					category: '锚文本策略',
					categoryKey: 'anchors',
					items: [
						{ text: '引入精确匹配和部分匹配锚文本', key: 'introduce-exact-match' },
						{ text: '必须缓慢实施', key: 'implement-slowly' },
						{ text: '保持小比例', key: 'keep-small-percentages' },
						{ text: '使用变化形式', key: 'use-variations' },
						{ text: '避免过度优化', key: 'avoid-over-optimization' }
					]
				}
			]
		}
	];

	const bestPractices = [
		{
			title: '链接多样性',
			description: '确保各种不同类型的链接，避免过度依赖单一类型',
			icon: '🔗'
		},
		{
			title: '锚文本多样性',
			description: '参考竞争对手，使用各种锚文本类型，避免过度优化',
			icon: '📝'
		},
		{
			title: '目标URL多样性',
			description: '分析竞争对手，将链接分布到不同页面，不要集中在单一页面',
			icon: '🎯'
		},
		{
			title: '自然方法',
			description: '总体原则：有疑问时，保持自然。这是所有外链决策的指导原则',
			icon: '🌿'
		}
	];

	// SEO 工具数据
	const seoTools = [
		{
			name: 'Google Search Console',
			description: 'Monitor and optimize your site\'s presence in Google search results',
			url: 'https://search.google.com/search-console',
			icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5a3 3 0 11-6 0 3 3 0 016 0z',
			color: 'blue',
			category: 'Google'
		},
		{
			name: 'Google Analytics',
			description: 'Track and analyze your website traffic and user behavior',
			url: 'https://analytics.google.com/',
			icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
			color: 'orange',
			category: 'Google'
		},
		{
			name: 'Bing Webmaster Tools',
			description: 'Microsoft Bing search engine optimization and monitoring',
			url: 'https://www.bing.com/webmasters/',
			icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
			color: 'blue',
			category: 'Microsoft'
		},
		{
			name: 'Yandex Webmaster',
			description: 'Russian search engine optimization and indexing tools',
			url: 'https://webmaster.yandex.com/',
			icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
			color: 'red',
			category: 'Yandex'
		},
		{
			name: 'Naver Search Advisor',
			description: 'Korean search engine optimization and webmaster tools',
			url: 'https://searchadvisor.naver.com/',
			icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
			color: 'green',
			category: 'Naver'
		},
		{
			name: 'DuckDuckGo',
			description: 'Privacy-focused search engine - no webmaster tools but good for testing',
			url: 'https://duckduckgo.com/',
			icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
			color: 'orange',
			category: 'Privacy'
		},
		{
			name: 'Seznam Webmaster',
			description: 'Czech search engine optimization tools',
			url: 'https://www.seznam.cz/webmaster/',
			icon: 'M13 10V3L4 14h7v7l9-11h-7z',
			color: 'purple',
			category: 'Seznam'
		}
	];

	function getToolColorClasses(color: string) {
		const colors = {
			blue: 'bg-blue-100 dark:bg-blue-700/40 text-blue-600 dark:text-blue-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-600/50',
			green: 'bg-green-100 dark:bg-green-700/40 text-green-600 dark:text-green-300 group-hover:bg-green-200 dark:group-hover:bg-green-600/50',
			purple: 'bg-purple-100 dark:bg-purple-700/40 text-purple-600 dark:text-purple-300 group-hover:bg-purple-200 dark:group-hover:bg-purple-600/50',
			orange: 'bg-orange-100 dark:bg-orange-700/40 text-orange-600 dark:text-orange-300 group-hover:bg-orange-200 dark:group-hover:bg-orange-600/50',
			red: 'bg-red-100 dark:bg-red-700/40 text-red-600 dark:text-red-300 group-hover:bg-red-200 dark:group-hover:bg-red-600/50'
		};
		return colors[color as keyof typeof colors] || colors.blue;
	}

	const bonusTactics = [
		{
			title: '垃圾策略',
			description: '仅限高级用户，风险极高',
			risk: 'high',
			details: ['Fiverr 服务', '案例研究示例', '需要谨慎考虑']
		},
		{
			title: '301 重定向策略',
			description: '使用过期域名的链接权重',
			risk: 'medium',
			details: ['购买过期或老域名', '重定向现有链接权重', '需要仔细实施']
		},
		{
			title: '数字公关 (Digital PR)',
			description: '达到 DR 40 后推荐，或预算允许时',
			risk: 'low',
			details: ['相对安全的策略', '需要一定预算', '效果显著']
		},
		{
			title: 'PBN (私人博客网络)',
			description: '仅限高级用户，小比例使用',
			risk: 'high',
			details: ['需要专业知识', '高风险策略', '仅占小比例']
		}
	];
</script>

<div class="container mx-auto px-4 py-8">
	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:theme-text-primary">Growth 管理</h1>
			<p class="theme-text-muted dark:text-gray-400 mt-2">SEO 外链建设、数据分析和增长工具管理</p>
		</div>
	</div>

	<!-- Tab Navigation -->
	<div class="flex space-x-1 mb-8 theme-bg-muted dark:bg-gray-800 p-1 rounded-lg">
		{#each tabs as tab}
			<button
				onclick={() => activeTab = tab.id}
				class="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors {
					activeTab === tab.id
						? 'theme-bg-card dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
						: 'theme-text-muted dark:text-gray-400 hover:text-gray-900 dark:hover:theme-text-primary'
				}"
			>
				<span>{tab.icon}</span>
				{tab.label}
			</button>
		{/each}
	</div>

	<!-- 保存状态指示器 -->
	{#if saving}
		<div class="fixed top-4 right-4 bg-blue-600 theme-text-primary px-4 py-2 rounded-lg shadow-lg z-50">
			<div class="flex items-center gap-2">
				<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				保存中...
			</div>
		</div>
	{/if}

	<!-- Tab Content -->
	{#if activeTab === 'overview'}
		<!-- Overview Tab -->
		<div class="space-y-6">
			<!-- SEO 进度概览 -->
			<Card class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
				<CardHeader>
					<CardTitle class="text-blue-800 dark:text-blue-200">📊 SEO 外链建设进度</CardTitle>
					<CardDescription class="text-blue-600 dark:text-blue-300">
						跟踪您的 SEO 外链建设进度
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
						{#each seoMonths as monthData}
							<div class="theme-bg-card dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
								<div class="flex items-center justify-between mb-2">
									<h4 class="font-medium text-gray-900 dark:theme-text-primary">第 {monthData.month} 个月</h4>
									<Badge variant={
										monthData.status === 'foundation' ? 'default' :
										monthData.status === 'building' ? 'secondary' :
										'outline'
									}>
										{getCompletionPercentage(monthData.monthKey)}%
									</Badge>
								</div>
								<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
									<div
										class="h-2 rounded-full transition-all duration-300 {
											monthData.status === 'foundation' ? 'bg-green-500' :
											monthData.status === 'building' ? 'bg-blue-500' :
											'bg-purple-500'
										}"
										style="width: {getCompletionPercentage(monthData.monthKey)}%"
									></div>
								</div>
								<p class="text-xs theme-text-muted dark:text-gray-400 mt-2">{monthData.description}</p>
							</div>
						{/each}
					</div>
					<Button onclick={() => activeTab = 'seo'} class="w-full">
						开始 SEO 教程
					</Button>
				</CardContent>
			</Card>

			<!-- 功能卡片 -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card>
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<span>🔍</span>
							搜索平台
						</CardTitle>
						<CardDescription>搜索引擎站长工具</CardDescription>
					</CardHeader>
					<CardContent>
						<p class="text-sm theme-text-muted dark:text-gray-400 mb-4">
							管理各大搜索引擎的站长工具和分析平台。
						</p>
						<Button onclick={() => activeTab = 'search-platforms'} class="w-full">
							查看搜索平台
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<span>📚</span>
							SEO 外链建设
						</CardTitle>
						<CardDescription>系统化的外链建设策略</CardDescription>
					</CardHeader>
					<CardContent>
						<p class="text-sm theme-text-muted dark:text-gray-400 mb-4">
							按月份分阶段的外链建设教程，从基础铺垫到高级策略。
						</p>
						<Button onclick={() => activeTab = 'seo'} variant="outline" class="w-full">
							查看 SEO 教程
						</Button>
					</CardContent>
				</Card>

			<Card>
				<CardHeader>
					<CardTitle class="flex items-center gap-2">
						<span>📈</span>
						数据分析
					</CardTitle>
					<CardDescription>流量和排名监控</CardDescription>
				</CardHeader>
				<CardContent>
					<p class="text-sm theme-text-muted dark:text-gray-400 mb-4">
						监控网站流量、关键词排名和外链效果。
					</p>
					<Button onclick={() => activeTab = 'analytics'} variant="outline" class="w-full">
						查看分析
					</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle class="flex items-center gap-2">
						<span>🛠️</span>
						工具管理
					</CardTitle>
					<CardDescription>SEO 工具和平台管理</CardDescription>
				</CardHeader>
				<CardContent>
					<p class="text-sm theme-text-muted dark:text-gray-400 mb-4">
						管理各种 SEO 工具、外链平台和提交状态。
					</p>
					<Button onclick={() => activeTab = 'tools'} variant="outline" class="w-full">
						管理工具
					</Button>
				</CardContent>
			</Card>
		</div>
	</div>

{:else if activeTab === 'search-platforms'}
	<!-- Search Platforms Tab -->
	<div class="space-y-6">
		<!-- Page header -->
		<Card>
			<CardHeader>
				<CardTitle class="flex items-center gap-2">
					<span>🔍</span>
					搜索平台工具
				</CardTitle>
				<CardDescription>
					管理各大搜索引擎的站长工具和分析平台
				</CardDescription>
			</CardHeader>
		</Card>

		<!-- SEO Tools Grid -->
		<Card>
			<CardHeader>
				<CardTitle>搜索引擎站长工具</CardTitle>
				<CardDescription>提交网站到各大搜索引擎，监控索引状态和搜索表现</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{#each seoTools as tool}
						<a
							href={tool.url}
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center space-x-3 p-3 rounded-lg border theme-border dark:border-gray-500 bg-gray-50 dark:bg-gray-500/30 hover:theme-bg-muted dark:hover:bg-gray-500 hover:border-blue-300 dark:hover:border-blue-400 transition-all duration-200"
						>
							<div class="flex-shrink-0">
								<div class="w-8 h-8 {getToolColorClasses(tool.color)} rounded-md flex items-center justify-center">
									<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" d={tool.icon} />
									</svg>
								</div>
							</div>
							<div class="flex-1 min-w-0">
								<div class="flex items-center justify-between">
									<h4 class="text-sm font-medium text-gray-900 dark:theme-text-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
										{tool.name}
									</h4>
									<svg class="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-1" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
									</svg>
								</div>
							</div>
						</a>
					{/each}
				</div>
			</CardContent>
		</Card>

		<!-- Quick Tips -->
		<Card class="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
			<CardHeader>
				<CardTitle class="flex items-center gap-2 text-blue-900 dark:text-blue-100">
					<svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189 6.01 6.01 0 01-3 0 6.01 6.01 0 001.5.189zm0 0V9.75a6 6 0 013-5.25m-3 5.25a6 6 0 01-3-5.25m3 5.25V8.25m0 0V7.5a6 6 0 013-5.25M12 8.25v.75" />
					</svg>
					SEO 优化建议
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="text-sm text-blue-800 dark:text-blue-200 space-y-2">
					<div class="flex items-start gap-2">
						<span class="text-blue-600 dark:text-blue-400">•</span>
						<span>提交 sitemap.xml 到各大搜索引擎以加快索引速度</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-blue-600 dark:text-blue-400">•</span>
						<span>定期监控索引状态，及时发现和修复爬取错误</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-blue-600 dark:text-blue-400">•</span>
						<span>使用结构化数据标记提升搜索结果展示效果</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-blue-600 dark:text-blue-400">•</span>
						<span>保持内容更新频率，提升网站活跃度和相关性</span>
					</div>
				</div>
			</CardContent>
		</Card>
	</div>

{:else if activeTab === 'seo'}
		<!-- SEO Tutorial Tab -->
		<div class="space-y-8">
			<!-- Best Practices Section -->
			<Card class="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
				<CardHeader>
					<CardTitle class="text-blue-800 dark:text-blue-200">🎯 SEO 外链建设最佳实践</CardTitle>
					<CardDescription class="text-blue-600 dark:text-blue-300">
						遵循这些核心原则，确保外链建设的自然性和有效性
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each bestPractices as practice}
							<div class="flex items-start gap-3 p-4 theme-bg-card dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
								<span class="text-2xl">{practice.icon}</span>
								<div>
									<h4 class="font-medium text-gray-900 dark:theme-text-primary">{practice.title}</h4>
									<p class="text-sm theme-text-muted dark:text-gray-400 mt-1">{practice.description}</p>
								</div>
							</div>
						{/each}
					</div>
				</CardContent>
			</Card>

			<!-- Monthly Strategy -->
			<div class="space-y-6">
				{#each seoMonths as monthData}
					<Card class="border-l-4 {
						monthData.status === 'foundation' ? 'border-l-green-500' :
						monthData.status === 'building' ? 'border-l-blue-500' :
						'border-l-purple-500'
					}">
						<CardHeader>
							<div class="flex items-center justify-between">
								<CardTitle class="flex items-center gap-3">
									<Badge variant={
										monthData.status === 'foundation' ? 'default' :
										monthData.status === 'building' ? 'secondary' :
										'outline'
									}>
										Month {monthData.month}
									</Badge>
									{monthData.title}
								</CardTitle>
							</div>
							<CardDescription>{monthData.description}</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="space-y-6">
								{#each monthData.tasks as task}
									<div>
										<div class="flex items-center justify-between mb-3">
											<h4 class="font-medium text-gray-900 dark:theme-text-primary flex items-center gap-2">
												<span class="w-2 h-2 bg-blue-500 rounded-full"></span>
												{task.category}
											</h4>
											<div class="text-xs text-gray-500 dark:text-gray-400">
												{task.items.filter(item => getTodoStatus(monthData.monthKey, task.categoryKey, item.key)).length}/{task.items.length} 完成
											</div>
										</div>
										<ul class="space-y-3 ml-4">
											{#each task.items as item}
												<li class="flex items-start gap-3 text-sm">
													<label class="flex items-start gap-2 cursor-pointer group">
														<input
															type="checkbox"
															checked={getTodoStatus(monthData.monthKey, task.categoryKey, item.key)}
															onchange={() => toggleTodo(monthData.monthKey, task.categoryKey, item.key)}
															class="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
														/>
														<span class="text-gray-700 dark:theme-text-muted group-hover:text-gray-900 dark:group-hover:theme-text-primary transition-colors {
															getTodoStatus(monthData.monthKey, task.categoryKey, item.key)
																? 'line-through text-gray-500 dark:text-gray-500'
																: ''
														}">
															{item.text}
														</span>
													</label>
												</li>
											{/each}
										</ul>
									</div>
								{/each}

								<!-- 月度进度条 -->
								<div class="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
									<div class="flex items-center justify-between mb-2">
										<span class="text-sm font-medium text-gray-700 dark:theme-text-muted">月度完成进度</span>
										<span class="text-sm theme-text-muted dark:text-gray-400">{getCompletionPercentage(monthData.monthKey)}%</span>
									</div>
									<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
										<div
											class="bg-blue-600 h-2 rounded-full transition-all duration-300"
											style="width: {getCompletionPercentage(monthData.monthKey)}%"
										></div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				{/each}
			</div>

			<!-- Bonus Tactics Section -->
			<Card class="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
				<CardHeader>
					<CardTitle class="text-yellow-800 dark:text-yellow-200">⚠️ 高级外链策略 (谨慎使用)</CardTitle>
					<CardDescription class="text-yellow-600 dark:text-yellow-300">
						这些策略风险较高，仅适合有经验的 SEO 专家使用
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each bonusTactics as tactic}
							<div class="p-4 theme-bg-card dark:bg-gray-800 rounded-lg border border-yellow-200 dark:border-yellow-700">
								<div class="flex items-center justify-between mb-2">
									<h4 class="font-medium text-gray-900 dark:theme-text-primary">{tactic.title}</h4>
									<Badge variant={
										tactic.risk === 'high' ? 'destructive' :
										tactic.risk === 'medium' ? 'secondary' :
										'default'
									}>
										{tactic.risk === 'high' ? '高风险' : tactic.risk === 'medium' ? '中风险' : '低风险'}
									</Badge>
								</div>
								<p class="text-sm theme-text-muted dark:text-gray-400 mb-3">{tactic.description}</p>
								<ul class="space-y-1">
									{#each tactic.details as detail}
										<li class="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
											<span>•</span>
											{detail}
										</li>
									{/each}
								</ul>
							</div>
						{/each}
					</div>
				</CardContent>
			</Card>
		</div>

	{:else if activeTab === 'backlinks'}
		<!-- Backlinks Tab -->
		<BacklinkManager />

	{:else if activeTab === 'analytics'}
		<!-- Analytics Tab -->
		<div class="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>📈 数据分析</CardTitle>
					<CardDescription>监控 SEO 效果和网站表现</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
							<div class="text-2xl font-bold text-blue-600 dark:text-blue-400">--</div>
							<div class="text-sm theme-text-muted dark:text-gray-400">域名权重 (DR)</div>
						</div>
						<div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
							<div class="text-2xl font-bold text-green-600 dark:text-green-400">--</div>
							<div class="text-sm theme-text-muted dark:text-gray-400">外链总数</div>
						</div>
						<div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
							<div class="text-2xl font-bold text-purple-600 dark:text-purple-400">--</div>
							<div class="text-sm theme-text-muted dark:text-gray-400">引用域名</div>
						</div>
					</div>
					<p class="text-sm theme-text-muted dark:text-gray-400 mt-4">
						数据分析功能正在开发中，将集成 Ahrefs、SEMrush 等工具的 API。
					</p>
				</CardContent>
			</Card>
		</div>

	{:else if activeTab === 'tools'}
		<!-- Tools Tab -->
		<div class="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>🛠️ SEO 工具管理</CardTitle>
					<CardDescription>管理外链平台、工具和提交状态</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<div class="p-4 border theme-border dark:theme-border rounded-lg">
								<h4 class="font-medium text-gray-900 dark:theme-text-primary mb-2">外链平台</h4>
								<p class="text-sm theme-text-muted dark:text-gray-400">管理客座文章和利基编辑平台</p>
								<Badge variant="outline" class="mt-2">开发中</Badge>
							</div>
							<div class="p-4 border theme-border dark:theme-border rounded-lg">
								<h4 class="font-medium text-gray-900 dark:theme-text-primary mb-2">HARO 管理</h4>
								<p class="text-sm theme-text-muted dark:text-gray-400">Help A Reporter Out 请求跟踪</p>
								<Badge variant="outline" class="mt-2">开发中</Badge>
							</div>
							<div class="p-4 border theme-border dark:theme-border rounded-lg">
								<h4 class="font-medium text-gray-900 dark:theme-text-primary mb-2">目录提交</h4>
								<p class="text-sm theme-text-muted dark:text-gray-400">目录和引用网站提交状态</p>
								<Badge variant="outline" class="mt-2">开发中</Badge>
							</div>
						</div>
						<p class="text-sm theme-text-muted dark:text-gray-400">
							工具管理功能正在开发中，将包含平台管理、提交跟踪、收录检查等功能。
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	{/if}
</div>
