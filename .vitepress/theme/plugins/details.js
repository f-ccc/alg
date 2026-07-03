/**
 * markdown-it plugin for ??? / ???+ collapsible details blocks
 * Compatible with Material for MkDocs pymdownx.details syntax
 *
 * Usage:
 *   ??? note "Title"
 *       Content here
 *   ?!!
 *
 *   ???+ warning "Expanded Title"
 *       Expanded content
 *
 * Or implicitly closed by next ??? block or end of parent container:
 *   ??? note "A"
 *       Content A
 *   ??? tip "B"
 *       Content B
 */
module.exports = function detailsPlugin(md) {
  const startRE = /^\?\?\??\+?\s*(.*)$/

  function details(state, startLine, endLine, silent) {
    const startPos = state.bMarks[startLine] + state.tShift[startLine]
    const line = state.src.slice(startPos, state.eMarks[startLine])
    const match = line.match(startRE)

    if (!match) return false

    const raw = line
    const isExpanded = raw.startsWith('???+')
    const prefixLen = isExpanded ? 4 : 3
    const rest = raw.slice(prefixLen).trim()

    if (silent) return false

    // Parse type and title
    let type = ''
    let title = ''

    // Try to extract quoted title first: ??? "Title" or ??? type "Title"
    let remaining = rest

    // Check for type keyword before quoted title
    const typeMatch = remaining.match(/^(\w+)($|\s+)/)
    if (typeMatch) {
      type = typeMatch[1].toLowerCase()
      remaining = remaining.slice(typeMatch[1].length).trim()
    }

    // Try quoted title
    const titleMatch = remaining.match(/^"([^"]*)"\s*(.*)$/)
    if (titleMatch) {
      title = titleMatch[1]
      remaining = titleMatch[2].trim()
    } else if (remaining) {
      // No quotes, use remaining as title (excluding type)
      title = remaining
    }

    if (!title) {
      title = type || '详细信息'
    }

    // Find closing line
    // Closes at: ?!! marker, another ??? block, or end of container
    let closeLine = -1
    let explicitClose = false

    for (let line = startLine + 1; line < endLine; line++) {
      const pos = state.bMarks[line] + state.tShift[line]
      const checkLine = state.src.slice(pos, state.eMarks[line])
      const trimmed = checkLine.trim()

      // Explicit close: ?!!
      if (trimmed === '?!!') {
        closeLine = line
        explicitClose = true
        break
      }

      // Another ??? block (implicit close)
      if (trimmed.match(/^\?\?\??\+?\s/) || trimmed === '???' || trimmed === '???+') {
        closeLine = line
        break
      }
    }

    if (closeLine === -1) {
      closeLine = endLine
    }

    // Create tokens
    const tokenName = 'details_block'

    // Opening token
    const openToken = state.push(tokenName + '_open', 'details', 1)
    openToken.markup = isExpanded ? '???+' : '???'
    openToken.block = true
    openToken.map = [startLine, closeLine]
    openToken.info = rest
    openToken.meta = { type, title, isExpanded }

    // Summary inline token
    const summaryToken = state.push('inline', '', 0)
    summaryToken.content = title || type || '详细信息'
    summaryToken.children = []

    // Process inner content between start+1 and closeLine
    // state.md.block.tokenize will process all standard markdown inside
    // But we skip the close marker line
    let contentEnd = closeLine
    if (explicitClose) {
      state.md.block.tokenize(state, startLine + 1, closeLine)
      // tokenize sets state.line, but we need to manage it
    } else {
      state.md.block.tokenize(state, startLine + 1, closeLine)
    }

    // Closing token
    const closeToken = state.push(tokenName + '_close', 'details', -1)
    closeToken.markup = 'details_close'
    closeToken.block = true

    state.line = closeLine + (explicitClose ? 1 : 0)

    return true
  }

  // Register the block rule
  md.block.ruler.before('fence', 'details_block', details, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  })

  // Renderers
  md.renderer.rules['details_block_open'] = function(tokens, idx) {
    const meta = tokens[idx].meta || {}
    const expanded = meta.isExpanded ? ' open' : ''
    const typeClass = meta.type ? ` details-${meta.type}` : ''
    return `<details class="custom-details${typeClass}"${expanded}><summary>${md.utils.escapeHtml(meta.title || '详细信息')}</summary>\n`
  }

  md.renderer.rules['details_block_close'] = function() {
    return '</details>\n'
  }
}
