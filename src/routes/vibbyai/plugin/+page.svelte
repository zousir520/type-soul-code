<script lang="ts">
	import { onMount } from 'svelte';

	let message = $state('');

	onMount(() => {
		// 页面加载时的初始化逻辑
	});
</script>

<svelte:head>
	<title>插件市场 - tenniszero.org</title>
</svelte:head>

<div class="plugin-page">
	<div class="page-header">
		<h1>🔌 插件市场</h1>
		<p>扩展您的网站功能，发现更多可能性</p>
	</div>

	<!-- 消息提示 -->
	{#if message}
		<div class="message-alert" class:success={message.includes('成功')} class:error={message.includes('失败')}>
			{message}
		</div>
	{/if}

	<!-- 插件市场内容 -->
	<div class="plugin-content">
		<div class="construction-notice">
			<div class="construction-icon">
				🚧
			</div>
			<h2>插件市场正在建设中</h2>
			<p>我们正在努力为您准备强大的功能插件，敬请期待！</p>
			<div class="coming-soon">
				<h3>即将推出：</h3>
				<ul>
					<li>🎮 游戏插件 - 快速嵌入iframe游戏</li>
					<li>📊 数据分析插件 - 网站流量统计</li>
					<li>💬 聊天插件 - 在线客服系统</li>
					<li>🛒 电商插件 - 购物车和支付</li>
					<li>📧 邮件插件 - 邮件营销工具</li>
					<li>🔍 SEO插件 - 搜索引擎优化</li>
				</ul>
			</div>
		</div>
	</div>
</div>

<style>
	.plugin-page {
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

	.plugin-content {
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
		.plugin-page {
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
