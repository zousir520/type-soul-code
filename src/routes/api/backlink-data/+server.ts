import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';
import type { BacklinkItem, BacklinkDataResponse } from '$lib/types/database';

// 导出类型供其他模块使用
export type { BacklinkItem, BacklinkDataResponse };

// 获取数据文件路径（仅在支持的环境中）
async function getDataFilePath() {
	if (typeof process === 'undefined' || !process.cwd) {
		return null;
	}
	const { join } = await import(/* @vite-ignore */ 'path');
	return join(process.cwd(), 'data', 'backlink-data.json');
}

export const GET: RequestHandler = async () => {
	try {
		// 1. 优先从数据库读取（如果 Supabase 已配置）
		if (supabase) {
			try {
				const { data, error } = await supabase
					.from('backlink_items')
					.select('*')
					.order('created_at', { ascending: true });

				if (!error && data) {
					console.log('Reading from database:', data.length, 'items');
					
					// 转换数据库格式到前端格式
					const transformedData: BacklinkDataResponse = {
						free: data
							.filter(item => item.type === 'free')
							.map(item => ({
								id: item.external_id,
								name: item.name,
								url: item.url,
								type: 'free',
								category: item.category,
								description: item.description,
								priority: item.priority,
								traffic: item.traffic,
								as: item.as_value,
								price: item.price,
								completed: item.completed,
								completedAt: item.completed_at,
								notes: item.notes || ''
							})),
						paid: data
							.filter(item => item.type === 'paid')
							.map(item => ({
								id: item.external_id,
								name: item.name,
								url: item.url,
								type: 'paid',
								category: item.category,
								description: item.description,
								priority: item.priority,
								traffic: item.traffic,
								as: item.as_value,
								price: item.price,
								completed: item.completed,
								completedAt: item.completed_at,
								notes: item.notes || ''
							}))
					};

					console.log('Transformed data:', {
						free: transformedData.free.length,
						paid: transformedData.paid.length
					});

					return json({
						success: true,
						data: transformedData,
						source: 'database'
					});
				}
			} catch (dbError) {
				console.warn('Database read failed, falling back to file:', dbError);
			}
		}

		// 2. 回退到文件读取
		const dataFilePath = await getDataFilePath();
		if (!dataFilePath) {
			return json({
				success: false,
				error: 'Backlink data not found in database and file system not available',
				data: { free: [], paid: [] }
			});
		}

		const { existsSync, readFileSync } = await import(/* @vite-ignore */ 'fs');
		if (!existsSync(dataFilePath)) {
			return json({
				success: false,
				error: 'Backlink data not found in database or file',
				data: { free: [], paid: [] }
			});
		}

		// 读取 JSON 文件
		const fileContent = readFileSync(dataFilePath, 'utf-8');
		const data: BacklinkDataResponse = JSON.parse(fileContent);

		// 验证数据结构
		if (!data.free || !data.paid) {
			return json({ 
				success: false, 
				error: 'Invalid data structure',
				data: { free: [], paid: [] }
			});
		}

		return json({
			success: true,
			data,
			source: 'file',
			message: `Loaded ${data.free.length} free and ${data.paid.length} paid backlink items`
		});

	} catch (error) {
		console.error('Error reading backlink data:', error);
		return json({ 
			success: false, 
			error: 'Failed to read backlink data',
			data: { free: [], paid: [] }
		}, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const requestData = await request.json();

		// 验证数据结构
		if (!requestData || !requestData.free || !requestData.paid) {
			return json({
				success: false,
				error: 'Invalid data format'
			}, { status: 400 });
		}

		// 1. 优先保存到数据库（如果 Supabase 已配置）
		if (supabase) {
			try {
				// 辅助函数：清理priority字段值
				const cleanPriority = (priority: string | number | null): string | null => {
					if (!priority) return null;
					
					const cleanValue = String(priority).toLowerCase()
						.replace(/优先级:\s*/g, '')
						.replace(/priority:\s*/g, '')
						.trim();
					
					if (['high', 'medium', 'low'].includes(cleanValue)) {
						return cleanValue;
					}
					
					// 根据数字值映射优先级
					const numValue = parseInt(String(priority), 10);
					if (!isNaN(numValue)) {
						if (numValue >= 4) return 'high';
						if (numValue >= 2) return 'medium';
						return 'low';
					}
					
					// 默认返回medium如果无法识别
					return 'medium';
				};

				// 准备插入数据
				const allItems = [...requestData.free, ...requestData.paid].map(item => ({
					external_id: item.id,
					name: item.name,
					url: item.url,
					type: item.type,
					category: item.category,
					description: item.description,
					priority: cleanPriority(item.priority),
					traffic: item.traffic,
					as_value: item.as, // 前端 as 字段映射到数据库 as_value
					price: item.price,
					completed: item.completed,
					completed_at: item.completedAt,
					notes: item.notes || ''
				}));

				console.log('Preparing to upsert', allItems.length, 'backlink items');

				// 直接使用 upsert 操作，不需要先删除，更快速
				const { error, data: upsertData } = await supabase
					.from('backlink_items')
					.upsert(allItems, {
						onConflict: 'external_id',
						ignoreDuplicates: false
					})
					.select('id');

				if (!error) {
					console.log('Backlink items successfully saved to database:', upsertData?.length, 'items');
					
					// 异步记录系统日志，不阻塞响应
					try {
						await supabase.rpc('log_system_event', {
							log_level: 'info',
							log_message: `Backlink data updated: ${requestData.free.length} free, ${requestData.paid.length} paid items`,
							log_source: '/api/backlink-data',
							log_context: {
								free_count: requestData.free.length,
								paid_count: requestData.paid.length
							}
						});
					} catch (logError) {
						console.warn('Failed to log system event:', logError);
					}

					return json({
						success: true,
						message: 'Backlink data saved successfully to database',
						data: requestData,
						storage: 'database',
						savedCount: upsertData?.length
					});
				} else {
					console.error('Database save failed:', error);
					throw error; // 抛出错误，让外层catch处理
				}
			} catch (dbError) {
				console.warn('Database operation failed, falling back to file:', dbError);
			}
		}

		// 2. 回退到文件保存（本地开发环境）
		const dataFilePath = await getDataFilePath();
		if (!dataFilePath) {
			return json({
				success: false,
				message: 'File system not available in this environment'
			}, { status: 501 });
		}

		const { writeFileSync } = await import(/* @vite-ignore */ 'fs');
		const dataToSave = {
			free: requestData.free,
			paid: requestData.paid
		};

		writeFileSync(dataFilePath, JSON.stringify(dataToSave, null, 2));

		return json({
			success: true,
			message: 'Backlink data saved successfully to file',
			data: dataToSave,
			storage: 'file'
		});
	} catch (error) {
		console.error('Error saving backlink data:', error);
		return json({
			success: false,
			error: 'Failed to save backlink data'
		}, { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ request }) => {
	try {
		const { id, type, completed, notes } = await request.json();

		if (!id || !type || (type !== 'free' && type !== 'paid')) {
			return json({
				success: false,
				error: 'Invalid parameters'
			}, { status: 400 });
		}

		// 1. 优先更新数据库（如果 Supabase 已配置）
		if (supabase) {
			try {
				const updateData: Record<string, unknown> = {
					completed: Boolean(completed),
					notes: notes || ''
				};

				if (completed) {
					updateData.completed_at = new Date().toISOString();
				} else {
					updateData.completed_at = null;
				}

				const { data, error } = await supabase
					.from('backlink_items')
					.update(updateData)
					.eq('external_id', id)
					.eq('type', type)
					.select()
					.single();

				if (!error && data) {
					// 记录系统日志
					await supabase.rpc('log_system_event', {
						log_level: 'info',
						log_message: `Backlink item updated: ${id}`,
						log_source: '/api/backlink-data',
						log_context: { 
							item_id: id, 
							type, 
							completed, 
							notes 
						}
					});

					// 转换回前端格式
					const updatedItem = {
						id: data.external_id,
						name: data.name,
						url: data.url,
						type: data.type,
						category: data.category,
						description: data.description,
						priority: data.priority,
						traffic: data.traffic,
						as: data.as_value,
						price: data.price,
						completed: data.completed,
						completedAt: data.completed_at,
						notes: data.notes
					};

					return json({
						success: true,
						message: 'Backlink item updated successfully in database',
						data: updatedItem,
						storage: 'database'
					});
				}

				console.warn('Database update failed:', error);
			} catch (dbError) {
				console.warn('Database operation failed, falling back to file:', dbError);
			}
		}

		// 2. 回退到文件更新
		const dataFilePath = await getDataFilePath();
		if (!dataFilePath) {
			return json({
				success: false,
				error: 'File system not available in this environment'
			}, { status: 501 });
		}

		const { existsSync, readFileSync, writeFileSync } = await import(/* @vite-ignore */ 'fs');
		if (!existsSync(dataFilePath)) {
			return json({
				success: false,
				error: 'Data not found in database or file'
			}, { status: 404 });
		}

		const fileContent = readFileSync(dataFilePath, 'utf-8');
		const data: BacklinkDataResponse = JSON.parse(fileContent);

		// 更新特定项目
		const itemType = type as 'free' | 'paid';
		const items = data[itemType];
		const itemIndex = items.findIndex((item: BacklinkItem) => item.id === id);

		if (itemIndex === -1) {
			return json({
				success: false,
				error: 'Item not found'
			}, { status: 404 });
		}

		// 更新项目
		items[itemIndex] = {
			...items[itemIndex],
			completed: Boolean(completed),
			completedAt: completed ? new Date().toISOString() : null,
			notes: notes || items[itemIndex].notes || ''
		};

		// 保存更新后的数据
		writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

		return json({
			success: true,
			message: 'Backlink item updated successfully in file',
			data: items[itemIndex],
			storage: 'file'
		});
	} catch (error) {
		console.error('Error updating backlink item:', error);
		return json({
			success: false,
			error: 'Failed to update backlink item'
		}, { status: 500 });
	}
};
