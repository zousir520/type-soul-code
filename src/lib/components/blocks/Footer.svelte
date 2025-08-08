<script lang="ts">
	import { getLocalizedText } from '$lib/content-types';

	interface Props {
		footerData?: any;
		currentLang?: string;
	}

	let { footerData, currentLang = 'en' }: Props = $props();

	// Social media icons mapping
	const socialIcons: Record<string, string> = {
		twitter: '𝕏',
		github: '⚡',
		linkedin: '💼',
		discord: '💬',
		facebook: '📘',
		instagram: '📷',
		youtube: '📺'
	};

	function getSocialIcon(platform: string): string {
		return socialIcons[platform.toLowerCase()] || '🔗';
	}
</script>

<footer style="background-color: hsl(var(--background)); border-top: 1px solid hsl(var(--border))">
	<div class="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
		<div class="xl:grid xl:grid-cols-3 xl:gap-8">
			<!-- Company Info -->
			<div class="space-y-8">
				<div>
					<a href={footerData?.companyInfo?.logo?.url || '/'} class="flex items-center space-x-3">
						<div class="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style="background-color: hsl(var(--primary))">
							<span class="font-bold text-lg" style="color: hsl(var(--primary-foreground))">V</span>
						</div>
						<span class="text-2xl font-bold" style="color: hsl(var(--foreground))">
							{footerData?.companyInfo?.name || 'tenniszero.org'}
						</span>
					</a>
				</div>
				<p class="text-sm leading-6 max-w-md" style="color: hsl(var(--muted-foreground))">
					{footerData?.companyInfo?.description ? getLocalizedText(footerData.companyInfo.description, currentLang) : 'AI-powered SaaS platform for modern businesses.'}
				</p>

				<!-- Social Media Links -->
				{#if footerData?.socialMedia?.length}
					<div class="flex space-x-6">
						{#each footerData.socialMedia as social}
							<a
								href={social.url}
								class="text-gray-400 hover:theme-text-primary transition-colors duration-300"
								target="_blank"
								rel="noopener noreferrer"
								aria-label={social.label}
							>
								<span class="text-xl">{getSocialIcon(social.platform)}</span>
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Links -->
			<div class="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
				{#if footerData?.links?.length}
					{#each footerData.links as linkGroup}
						<div class="md:grid md:grid-cols-1 md:gap-8">
							<div>
								<h3 class="text-sm font-semibold leading-6 theme-text-primary">
									{linkGroup.category ? getLocalizedText(linkGroup.category, currentLang) : ''}
								</h3>
								<ul role="list" class="mt-6 space-y-4">
									{#each linkGroup.items || [] as item}
										<li>
											<a
												href={item.href}
												class="text-sm leading-6 theme-text-muted hover:theme-text-primary transition-colors duration-300"
											>
												{item.label ? getLocalizedText(item.label, currentLang) : item.name || ''}
											</a>
										</li>
									{/each}
								</ul>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Bottom Section -->
		<div class="mt-16 border-t theme-border pt-8 sm:mt-20 md:flex md:items-center md:justify-between">
			<div class="flex space-x-6 md:order-2">
				{#if footerData?.bottomLinks?.length}
					{#each footerData.bottomLinks as link}
						<a
							href={link.href}
							class="text-sm leading-6 text-gray-400 hover:theme-text-primary transition-colors duration-300"
						>
							{link.label ? getLocalizedText(link.label, currentLang) : ''}
						</a>
					{/each}
				{/if}
			</div>
			<p class="mt-8 text-xs leading-5 text-gray-400 md:order-1 md:mt-0">
				{footerData?.copyright?.text ? getLocalizedText(footerData.copyright.text, currentLang) : '© 2024 tenniszero.org. All rights reserved.'}
			</p>
		</div>
	</div>
</footer>
