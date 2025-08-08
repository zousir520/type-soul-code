import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';
import {
    handleApiError,
    successResponse,
    ApiErrors,
    safeAsync,
    ApiErrorType
} from '$lib/utils/api-error-handler';

// 获取数据文件路径（仅在支持的环境中）
async function getProgressFilePath() {
	if (typeof process === 'undefined' || !process.cwd) {
		return null;
	}
	try {
		const pathModule = await import(/* @vite-ignore */ 'path');
		return pathModule.join(process.cwd(), 'data', 'seo-progress.json');
	} catch {
		return null;
	}
}

// 确保数据目录存在（仅在支持的环境中）
async function ensureDataDir() {
	if (typeof process === 'undefined' || !process.cwd) {
		return;
	}
	try {
		const fsModule = await import(/* @vite-ignore */ 'fs');
		const pathModule = await import(/* @vite-ignore */ 'path');
		const dataDir = pathModule.join(process.cwd(), 'data');
		if (!fsModule.existsSync(dataDir)) {
			fsModule.mkdirSync(dataDir, { recursive: true });
		}
	} catch {
		// 在Cloudflare Workers中会失败，这是预期的
	}
}

// 在支持的环境中初始化（异步）
ensureDataDir().catch(() => {
	// 在Cloudflare Workers中会失败，这是预期的
});

// 默认进度结构
const defaultProgress = {
	month1: {
		anchors: {
			'homepage-only': false,
			'natural-anchors': false,
			'avoid-over-optimization': false
		},
		social: {
			'setup-main-profiles': false,
			'create-50-100-profiles': false,
			'ensure-consistency': false
		},
		signals: {
			'post-content': false,
			'engage-interactions': false,
			'build-activity': false
		},
		citations: {
			'create-business-profiles': false,
			'submit-50-100-directories': false,
			'consider-bbb': false
		},
		additional: {
			'submit-niche-directories': false,
			'publish-press-releases': false,
			'ensure-indexing': false
		},
		optional: {
			'non-spam-blog-comments': false,
			'non-spam-forum-comments': false,
			'web2-properties': false,
			'qa-links': false,
			'audio-video-content': false,
			'slideshow-links': false,
			'cloud-stacking': false,
			'free-parasites': false,
			'review-sites': false
		}
	},
	month2: {
		core: {
			'focus-homepage-natural': false,
			'no-traffic-focus': false,
			'build-impactful-links': false
		},
		methods: {
			'guest-posts': false,
			'niche-edits': false,
			'haro': false
		},
		implementation: {
			'use-providers': false,
			'self-outreach': false,
			'hire-va': false,
			'active-outreach': false,
			'competitor-analysis': false,
			'skyscraper-technique': false,
			'link-bait': false
		}
	},
	month3: {
		timing: {
			'implement-with-traffic': false,
			'continue-guest-posts': false,
			'maintain-continuity': false
		},
		distribution: {
			'maintain-homepage-ratio': false,
			'adjust-based-on-competitors': false
		},
		targets: {
			'money-pages': false,
			'category-product-pages': false,
			'hub-pages': false,
			'link-bait-content': false,
			'analyze-competitor-patterns': false,
			'focus-internal-linking': false
		},
		anchors: {
			'introduce-exact-match': false,
			'implement-slowly': false,
			'keep-small-percentages': false,
			'use-variations': false,
			'avoid-over-optimization': false
		}
	}
};

type SeoProgressData = typeof defaultProgress;

// 深度合并函数，保留已保存的数据
function deepMerge(target: any, source: any): any {
	if (!source || typeof source !== 'object') return target;
	if (!target || typeof target !== 'object') return source;
	
	const result = { ...target };
	
	for (const key in source) {
		if (source.hasOwnProperty(key)) {
			if (typeof source[key] === 'object' && source[key] !== null &&
				typeof target[key] === 'object' && target[key] !== null) {
				result[key] = deepMerge(target[key], source[key]);
			} else {
				result[key] = source[key];
			}
		}
	}
	
	return result;
}

async function readFromDatabase(): Promise<SeoProgressData> {
	if (!supabase) return defaultProgress;

	try {
		const { data, error } = await supabase
			.from('seo_progress')
			.select('*')
			.order('month', { ascending: true })
			.order('category', { ascending: true })
			.order('task_key', { ascending: true });

		if (error) {
			console.error('Failed to read SEO progress from database:', error);
			return defaultProgress;
		}

		const result: Record<string, Record<string, Record<string, boolean>>> = { ...defaultProgress };
		
		for (const item of data || []) {
			if (!result[item.month]) {
				result[item.month] = {};
			}
			if (!result[item.month][item.category]) {
				result[item.month][item.category] = {};
			}
			result[item.month][item.category][item.task_key] = item.completed;
		}

		return result as SeoProgressData;
	} catch (error) {
		console.error('Database error reading SEO progress:', error);
		return defaultProgress;
	}
}

async function readFromFile(): Promise<SeoProgressData> {
	try {
		const progressFilePath = await getProgressFilePath();
		if (!progressFilePath) {
			return defaultProgress;
		}

		const fsModule = await import(/* @vite-ignore */ 'fs');
		if (fsModule.existsSync(progressFilePath)) {
			const fileContent = fsModule.readFileSync(progressFilePath, 'utf-8');
			const parsedData = JSON.parse(fileContent);
			// 使用深度合并：保留文件中的数据，只对缺失的字段使用默认值
			return deepMerge(defaultProgress, parsedData);
		}
	} catch (error) {
		console.error('Failed to read SEO progress file:', error);
	}
	return defaultProgress;
}

async function writeToDatabase(data: SeoProgressData): Promise<void> {
	if (!supabase) {
		console.error('supabase is null - database not configured');
		throw new Error('Database not configured');
	}

	console.log('Attempting to write to database with supabase');

try {
	// Convert nested object to flat array
	const records = [];
	for (const [month, categories] of Object.entries(data)) {
		for (const [category, tasks] of Object.entries(categories)) {
			for (const [taskKey, completed] of Object.entries(tasks)) {
				records.push({
					month,
					category,
					task_key: taskKey,
					task_name: taskKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // 添加task_name字段
					completed,
					completed_at: completed ? new Date().toISOString() : null
				});
			}
		}
	}

	console.log(`Preparing to insert ${records.length} records`);
	console.log('Sample record:', records[0]);

	// Clear existing data and insert new data - 修复删除操作
	const deleteResult = await supabase.from('seo_progress').delete().not('id', 'is', null);
	console.log('Delete result:', deleteResult);
	
	if (records.length > 0) {
		const insertResult = await supabase
			.from('seo_progress')
			.insert(records);

		console.log('Insert result:', insertResult);

		if (insertResult.error) {
			console.error('Failed to write SEO progress to database:', insertResult.error);
			throw insertResult.error;
		}
	}

	console.log('Database write completed successfully');

	// Log the operation
	await supabase.rpc('log_system_event', {
		log_level: 'info',
		log_message: 'SEO progress data updated',
		log_context: { records_count: records.length }
	});

	} catch (error) {
		console.error('Database error writing SEO progress:', error);
		throw error;
	}
}

async function writeToFile(data: SeoProgressData): Promise<void> {
	try {
		const progressFilePath = await getProgressFilePath();
		if (!progressFilePath) {
			throw new Error('File system not available in this environment');
		}

		const fsModule = await import(/* @vite-ignore */ 'fs');
		fsModule.writeFileSync(progressFilePath, JSON.stringify(data, null, 2));
	} catch (error) {
		console.error('Failed to write SEO progress file:', error);
		throw error;
	}
}

export const GET: RequestHandler = async () => {
	try {
		let progress = defaultProgress;
		
		// Try database first, then file fallback
		const savedProgress = await safeAsync(
			async () => {
				let data = await readFromDatabase();
				if (Object.keys(data).length === 0) {
					data = await readFromFile();
				}
				return data;
			},
			'Failed to read SEO progress data',
			ApiErrorType.DATABASE_ERROR
		);

		// 深度合并：保留已保存的数据，只对缺失的字段使用默认值
		progress = deepMerge(defaultProgress, savedProgress);
		
		return successResponse(progress, 'SEO progress loaded successfully', '/api/seo-progress');
	} catch (error) {
		return handleApiError(error, '/api/seo-progress');
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const progress = await safeAsync(
			() => request.json(),
			'Failed to parse request data',
			ApiErrorType.VALIDATION_ERROR
		);
		
		// Validate data structure
		if (!progress || typeof progress !== 'object') {
			throw ApiErrors.ValidationError('Invalid data format');
		}

		// 优先使用数据库存储
		await safeAsync(
			async () => {
				try {
					await writeToDatabase(progress);
					console.log('SEO progress saved to database successfully');
				} catch (dbError) {
					console.warn('Database write failed, falling back to file:', dbError);
					await writeToFile(progress);
				}
			},
			'Failed to save SEO progress data',
			ApiErrorType.DATABASE_ERROR
		);
		
		return successResponse(progress, 'SEO progress saved successfully', '/api/seo-progress');
	} catch (error) {
		return handleApiError(error, '/api/seo-progress');
	}
};
