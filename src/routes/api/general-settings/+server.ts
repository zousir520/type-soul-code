import {
    handleApiError,
    successResponse,
    safeAsync,
    ApiErrorType
} from '$lib/utils/api-error-handler';
import { getSettingsData } from '$lib/content';

export async function GET() {
	try {
		const settings = await safeAsync(
			() => getSettingsData('general'),
			'Failed to load general settings',
			ApiErrorType.CONTENT_ERROR
		);

		if (!settings) {
			return handleApiError(new Error('General settings not found'), '/api/general-settings');
		}

		return successResponse(settings, 'General settings loaded successfully', '/api/general-settings');
	} catch (error) {
		return handleApiError(error, '/api/general-settings');
	}
}