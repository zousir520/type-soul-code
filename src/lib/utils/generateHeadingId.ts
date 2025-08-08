/**
 * 统一的标题ID生成函数
 * 确保TOC解析和HTML渲染使用相同的ID生成逻辑
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff\s-]/g, '') // 保留中英文、数字、空格、连字符
    .replace(/\s+/g, '-') // 空格转连字符
    .replace(/-+/g, '-') // 多个连字符合并
    .replace(/^-|-$/g, ''); // 去掉首尾连字符
}