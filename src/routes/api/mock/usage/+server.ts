import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Mock usage data for demonstration
const mockUsageData = {
	stats: [
		{
			name: 'API Calls This Month',
			value: '2,847',
			change: '+12%',
			changeType: 'positive'
		},
		{
			name: 'Credits Remaining',
			value: '7,153',
			change: '-5%',
			changeType: 'negative'
		},
		{
			name: 'Average Response Time',
			value: '245ms',
			change: '-8%',
			changeType: 'positive'
		},
		{
			name: 'Success Rate',
			value: '99.2%',
			change: '+0.1%',
			changeType: 'positive'
		}
	],
	history: [
		{ date: '2024-01-01', calls: 120, credits: 240 },
		{ date: '2024-01-02', calls: 150, credits: 300 },
		{ date: '2024-01-03', calls: 180, credits: 360 },
		{ date: '2024-01-04', calls: 200, credits: 400 },
		{ date: '2024-01-05', calls: 175, credits: 350 },
		{ date: '2024-01-06', calls: 220, credits: 440 },
		{ date: '2024-01-07', calls: 190, credits: 380 }
	],
	endpoints: [
		{
			path: '/v1/generate',
			description: 'Text generation',
			calls: 1234,
			percentage: 43.4
		},
		{
			path: '/v1/analyze',
			description: 'Content analysis',
			calls: 856,
			percentage: 30.1
		},
		{
			path: '/v1/translate',
			description: 'Language translation',
			calls: 757,
			percentage: 26.5
		}
	],
	limits: [
		{
			name: 'Monthly API Calls',
			used: 2847,
			total: 10000,
			percentage: 28.47
		},
		{
			name: 'Credits Used',
			used: 2847,
			total: 10000,
			percentage: 28.47
		},
		{
			name: 'Storage Used',
			used: 1.2,
			total: 5,
			unit: 'GB',
			percentage: 24
		}
	]
};

export const GET: RequestHandler = async () => {
	// Simulate API delay
	await new Promise(resolve => setTimeout(resolve, 500));
	
	return json({
		code: 0,
		message: 'success',
		data: mockUsageData
	});
};
