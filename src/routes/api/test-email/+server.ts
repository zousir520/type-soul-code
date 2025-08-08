import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { EMAIL_SERVICE_API_KEY, EMAIL_SERVICE_URL, TEST_EMAIL } = await request.json();

		if (!EMAIL_SERVICE_API_KEY || !EMAIL_SERVICE_URL) {
			return json({
				success: false,
				message: '请提供邮件服务 API 配置信息 (EMAIL_SERVICE_API_KEY, EMAIL_SERVICE_URL)'
			}, { status: 400 });
		}

		// 使用通用 HTTP API 发送邮件（例如 Resend, SendGrid, Mailgun 等）
		const emailData = {
			from: 'test@tenniszero.org',
			to: TEST_EMAIL || 'admin@tenniszero.org',
			subject: 'tenniszero.org 邮件服务测试',
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h2 style="color: #2563eb;">🎉 邮件服务配置测试成功！</h2>
					<p>恭喜！您的邮件服务配置已成功设置。</p>
					<div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
						<h3 style="margin-top: 0; color: #374151;">配置信息：</h3>
						<ul style="color: #6b7280;">
							<li><strong>邮件服务:</strong> ${EMAIL_SERVICE_URL}</li>
							<li><strong>测试时间:</strong> ${new Date().toISOString()}</li>
							<li><strong>收件人:</strong> ${TEST_EMAIL || 'admin@tenniszero.org'}</li>
						</ul>
					</div>
					<p style="color: #6b7280; font-size: 14px;">
						这是一封自动生成的测试邮件，来自 tenniszero.org 平台。
					</p>
					<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
					<p style="color: #9ca3af; font-size: 12px; text-align: center;">
						tenniszero.org - AI-Powered Platform<br>
						<a href="https://tenniszero.org" style="color: #2563eb;">https://tenniszero.org</a>
					</p>
				</div>
			`
		};

		// 使用 fetch 调用邮件服务 API
		const response = await fetch(EMAIL_SERVICE_URL, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${EMAIL_SERVICE_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(emailData)
		});

		if (!response.ok) {
			const errorData = await response.text();
			throw new Error(`邮件服务 API 错误: ${response.status} - ${errorData}`);
		}

		const result = await response.json();

		return json({
			success: true,
			message: `测试邮件发送成功！邮件ID: ${result.id || 'N/A'}`
		});

	} catch (error) {
		console.error('Email test error:', error);
		
		let errorMessage = '邮件测试失败：';
		
		if (error instanceof Error) {
			if (error.message.includes('fetch')) {
				errorMessage += '网络连接失败，请检查邮件服务 URL 和网络连接';
			} else if (error.message.includes('401')) {
				errorMessage += 'API 密钥认证失败，请检查 EMAIL_SERVICE_API_KEY';
			} else if (error.message.includes('403')) {
				errorMessage += 'API 访问被拒绝，请检查权限配置';
			} else {
				errorMessage += error.message;
			}
		} else {
			errorMessage += '未知错误';
		}

		return json({
			success: false,
			message: errorMessage
		}, { status: 500 });
	}
};
