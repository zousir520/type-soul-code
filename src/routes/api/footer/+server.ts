import {
    handleApiError,
    successResponse,
    safeAsync,
    ApiErrorType
} from '$lib/utils/api-error-handler';
import { getFooterData } from '$lib/content';

export async function GET() {
    try {
        const footerConfig = await safeAsync(
            () => getFooterData(),
            'Failed to load footer configuration',
            ApiErrorType.CONTENT_ERROR
        );

        if (!footerConfig) {
            return handleApiError(new Error('Footer configuration not found'), '/api/footer');
        }

        return successResponse(footerConfig, 'Footer configuration loaded successfully', '/api/footer');
    } catch (error) {
        return handleApiError(error, '/api/footer');
    }
}