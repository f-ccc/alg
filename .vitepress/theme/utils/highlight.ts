/**
 * 关键词文本高亮 - 完全按用户要求实现
 * @param text 原始文本
 * @param keyword 搜索关键词
 */
export function highlightText(text: string, keyword: string) {
  if (!keyword.trim()) return text
  // 转义正则特殊字符
  const safeKey = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const reg = new RegExp(`(${safeKey})`, 'gi')
  return text.replace(reg, '<span style="color:#dc2626;font-weight:bold">$1</span>')
}
