<script lang="ts">
	import { onMount } from 'svelte';

	let message = $state('');

	onMount(() => {
		// 页面加载时的初始化逻辑
	});
</script>

<svelte:head>
	<title>主题市场 - tenniszero.org</title>
</svelte:head>

<div class="theme-page">
	<div class="page-header">
		<h1>🎨 主题市场</h1>
		<p>美化您的网站，发现更多可能性</p>
	</div>

	<!-- 消息提示 -->
	{#if message}
		<div class="message-alert" class:success={message.includes('成功')} class:error={message.includes('失败')}>
			{message}
		</div>
	{/if}

	<!-- 主题市场内容 -->
	<div class="theme-content">
		<div class="construction-notice">
			<div class="construction-icon">
				🚧
			</div>
			<h2>主题市场正在建设中</h2>
			<p>我们正在努力为您准备精美的主题模板，敬请期待！</p>
			<div class="coming-soon">
				<h3>即将推出：</h3>
				<ul>
					<li>🎨 多种精美主题模板</li>
					<li>🌈 自定义颜色方案</li>
					<li>📱 响应式设计</li>
					<li>⚡ 快速切换主题</li>
					<li>🎯 行业专用模板</li>
				</ul>
			</div>
		</div>
	</div>
</div>

<style>
	.theme-page {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.page-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.page-header h1 {
		font-size: 2.5rem;
		font-weight: bold;
		color: #1f2937;
		margin-bottom: 0.5rem;
	}

	.page-header p {
		font-size: 1.125rem;
		color: #6b7280;
	}

	.message-alert {
		padding: 1rem;
		border-radius: 0.5rem;
		margin-bottom: 2rem;
		font-weight: 500;
	}

	.message-alert.success {
		background-color: #d1fae5;
		color: #065f46;
		border: 1px solid #a7f3d0;
	}

	.message-alert.error {
		background-color: #fee2e2;
		color: #991b1b;
		border: 1px solid #fca5a5;
	}

	.theme-content {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 400px;
	}

	.construction-notice {
		text-align: center;
		background: white;
		border-radius: 1rem;
		padding: 3rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		border: 1px solid #e5e7eb;
		max-width: 600px;
	}

	.construction-icon {
		font-size: 4rem;
		margin-bottom: 1.5rem;
	}

	.construction-notice h2 {
		font-size: 2rem;
		font-weight: bold;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	.construction-notice p {
		font-size: 1.125rem;
		color: #6b7280;
		margin-bottom: 2rem;
	}

	.coming-soon {
		text-align: left;
		background: #f9fafb;
		border-radius: 0.5rem;
		padding: 1.5rem;
		margin-top: 2rem;
	}

	.coming-soon h3 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	.coming-soon ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.coming-soon li {
		padding: 0.5rem 0;
		color: #374151;
		font-size: 1rem;
	}

	/* Dark mode support */
	:global(.dark) .page-header h1 {
		color: #f9fafb;
	}

	:global(.dark) .page-header p {
		color: #d1d5db;
	}

	:global(.dark) .construction-notice {
		background: #374151;
		border-color: #4b5563;
	}

	:global(.dark) .construction-notice h2 {
		color: #f9fafb;
	}

	:global(.dark) .construction-notice p {
		color: #d1d5db;
	}

	:global(.dark) .coming-soon {
		background: #4b5563;
	}

	:global(.dark) .coming-soon h3 {
		color: #f9fafb;
	}

	:global(.dark) .coming-soon li {
		color: #e5e7eb;
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
		.theme-page {
			padding: 1rem;
		}

		.page-header h1 {
			font-size: 2rem;
		}

		.construction-notice {
			padding: 2rem 1.5rem;
		}

		.construction-icon {
			font-size: 3rem;
		}

		.construction-notice h2 {
			font-size: 1.5rem;
		}
	}
</style>
