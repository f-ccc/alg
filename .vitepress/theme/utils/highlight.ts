/**
 * 关键词文本高亮
 * - 在原文上做大小写不敏感匹配（不依赖 toLowerCase 定位，避免 Unicode 大小写折叠改变字符数导致切片错位）
 * - 输出前全量 HTML 转义，防止正文中的 < > & 等破坏 v-html 渲染
 * - 多词按长度降序匹配、单遍扫描，避免重叠嵌套
 */

/** HTML 特殊字符转义 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** 词列表 → 正则模式：去重、转义元字符、过滤空项、长词在前（避免被短词拆开） */
export function buildTermPattern(terms: string[]): string {
  const parts = [...new Set(terms)]
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
  return parts.join('|')
}

/**
 * 关键词文本高亮
 * @param text 原始文本
 * @param keyword 搜索关键词（按空白分词）
 */
export function highlightText(text: string, keyword: string) {
  if (!keyword.trim()) return escapeHtml(text)
  const pattern = buildTermPattern(keyword.trim().split(/\s+/))
  if (!pattern) return escapeHtml(text)

  const reg = new RegExp(`(${pattern})`, 'gi')
  let result = ''
  let last = 0
  let m: RegExpExecArray | null
  while ((m = reg.exec(text)) !== null) {
    result += escapeHtml(text.slice(last, m.index))
    result += `<span style="color:#dc2626;font-weight:bold">${escapeHtml(m[0])}</span>`
    last = m.index + m[0].length
    if (m[0].length === 0) reg.lastIndex++ // 零长匹配守卫，防止死循环
  }
  result += escapeHtml(text.slice(last))
  return result
}
