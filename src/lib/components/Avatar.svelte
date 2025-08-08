<script lang="ts">
	interface Props {
		name?: string;
		size?: number;
		className?: string;
	}

	let { name = '', size = 48, className = '' }: Props = $props();

	// Cache for computed values to improve performance
	const cache = new Map<string, { hash: number; colorIndex: number; patternIndex: number; initials: string }>();

	// Simple hash function to generate consistent values from name
	function simpleHash(str: string): number {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return Math.abs(hash);
	}

	// Generate avatar properties based on name with caching
	function getAvatarData(inputName: string) {
		const key = inputName || 'Anonymous';

		if (cache.has(key)) {
			return cache.get(key)!;
		}

		const hash = simpleHash(key);
		const data = {
			hash,
			colorIndex: hash % 12,
			patternIndex: (hash >> 4) % 4,
			initials: key
				.split(' ')
				.map(word => word.charAt(0))
				.join('')
				.toUpperCase()
				.slice(0, 2) || 'A'
		};

		cache.set(key, data);
		return data;
	}

	const avatarData = $derived(getAvatarData(name));
	const { colorIndex, patternIndex, initials } = $derived(avatarData);

	// Color palette - carefully chosen for good contrast and aesthetics
	const colors = [
		{ bg: '#3B82F6', text: '#FFFFFF' }, // Blue
		{ bg: '#10B981', text: '#FFFFFF' }, // Emerald
		{ bg: '#F59E0B', text: '#FFFFFF' }, // Amber
		{ bg: '#EF4444', text: '#FFFFFF' }, // Red
		{ bg: '#8B5CF6', text: '#FFFFFF' }, // Violet
		{ bg: '#06B6D4', text: '#FFFFFF' }, // Cyan
		{ bg: '#84CC16', text: '#FFFFFF' }, // Lime
		{ bg: '#F97316', text: '#FFFFFF' }, // Orange
		{ bg: '#EC4899', text: '#FFFFFF' }, // Pink
		{ bg: '#6366F1', text: '#FFFFFF' }, // Indigo
		{ bg: '#14B8A6', text: '#FFFFFF' }, // Teal
		{ bg: '#A855F7', text: '#FFFFFF' }  // Purple
	];

	const selectedColor = $derived(colors[colorIndex]);

	// Generate SVG pattern based on pattern type - optimized for performance
	function generatePattern(patternType: number): string {
		// Pre-computed patterns to avoid string concatenation
		const patterns = [
			// Circles pattern
			'<circle cx="25%" cy="25%" r="8%" fill="rgba(255,255,255,0.2)"/><circle cx="75%" cy="75%" r="6%" fill="rgba(255,255,255,0.15)"/>',

			// Triangles pattern
			'<polygon points="20,20 40,20 30,35" fill="rgba(255,255,255,0.2)"/><polygon points="60,60 80,60 70,75" fill="rgba(255,255,255,0.15)"/>',

			// Squares pattern
			'<rect x="15%" y="15%" width="15%" height="15%" fill="rgba(255,255,255,0.2)"/><rect x="70%" y="70%" width="10%" height="10%" fill="rgba(255,255,255,0.15)"/>',

			// Dots pattern
			'<circle cx="20%" cy="30%" r="3%" fill="rgba(255,255,255,0.2)"/><circle cx="80%" cy="20%" r="2%" fill="rgba(255,255,255,0.15)"/><circle cx="70%" cy="80%" r="4%" fill="rgba(255,255,255,0.1)"/>'
		];

		return patterns[patternType] || patterns[0];
	}

	const pattern = $derived(generatePattern(patternIndex));
</script>

<div 
	class="inline-flex items-center justify-center rounded-full font-medium select-none {className}"
	style="width: {size}px; height: {size}px; background-color: {selectedColor.bg}; color: {selectedColor.text}; font-size: {size * 0.4}px;"
	title={name}
>
	<svg 
		width="100%" 
		height="100%" 
		viewBox="0 0 100 100" 
		class="absolute inset-0 rounded-full"
	>
		{@html pattern}
	</svg>
	<span class="relative z-10 font-semibold">
		{initials}
	</span>
</div>

<style>
	div {
		position: relative;
		overflow: hidden;
	}
</style>
