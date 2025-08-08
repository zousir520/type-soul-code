export interface GameConfig {
	// 基本信息
	title: string;
	description: string;
	keyword: string;
	
	// Hero 区域配置
	hero: {
		type: 'iframe' | 'download' | 'video';
		iframeUrl?: string;
		downloadUrl?: string;
		videoUrl?: string;
		title: string;
		subtitle: string;
		backgroundImage?: string;
	};

	// What is 区域
	whatIs?: {
		title: string;
		content: string;
		highlights: Array<{
			number: string;
			label: string;
		}>;
	};

	// Features 区域
	features?: {
		title: string;
		subtitle: string;
		items: Array<{
			title: string;
			description: string;
			icon: string;
		}>;
	};

	// How to use 区域
	howToUse?: {
		title: string;
		subtitle: string;
		steps: Array<{
			step: string;
			title: string;
			description: string;
		}>;
	};

	// FAQ 区域
	faq?: {
		title: string;
		items: Array<{
			question: string;
			answer: string;
		}>;
	};
	
	// 游戏介绍区域 (保留向后兼容)
	about: {
		title: string;
		description: string;
		features: Array<{
			title: string;
			description: string;
			icon: string;
		}>;
	};
	
	// 推荐游戏
	relatedGames: Array<{
		id: string;
		title: string;
		description: string;
		thumbnail: string;
		url: string;
		category: string;
	}>;
	
	// 游戏统计
	stats: Array<{
		label: string;
		value: string;
	}>;
	
	// 社交链接
	social: {
		discord?: string;
		twitter?: string;
		youtube?: string;
		steam?: string;
	};
}

// 默认游戏配置
export const defaultGameConfig: GameConfig = {
	title: 'Awesome Game',
	description: 'An amazing gaming experience awaits you!',
	keyword: 'game',
	
	hero: {
		type: 'iframe',
		iframeUrl: '',
		title: 'Play Now',
		subtitle: 'Experience the ultimate gaming adventure',
		backgroundImage: '/game-bg.jpg'
	},
	
	about: {
		title: 'About This Game',
		description: 'Dive into an immersive world filled with challenges and excitement.',
		features: [
			{
				title: 'Epic Adventures',
				description: 'Explore vast worlds and complete challenging quests',
				icon: 'map'
			},
			{
				title: 'Multiplayer',
				description: 'Play with friends and compete against players worldwide',
				icon: 'users'
			},
			{
				title: 'Regular Updates',
				description: 'New content and features added regularly',
				icon: 'refresh'
			}
		]
	},
	
	relatedGames: [],
	
	stats: [
		{ label: 'Active Players', value: '10K+' },
		{ label: 'Levels', value: '50+' },
		{ label: 'Achievements', value: '100+' }
	],
	
	social: {}
};
