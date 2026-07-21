<template>
  <div class="home-terminal">
    <!-- ===== Terminal Hero ===== -->
    <section class="term-hero">
      <div class="term-window">
        <div class="term-titlebar">
          <span class="term-dot term-dot--red"></span>
          <span class="term-dot term-dot--yellow"></span>
          <span class="term-dot term-dot--green"></span>
          <span class="term-title">about.md — 算法笔记</span>
        </div>
        <div class="term-body">
          <div class="term-line"><span class="term-prompt">$</span> cat about.md</div>
          <div class="term-line term-output"><span class="term-comment"># 算法笔记</span></div>
          <div class="term-line term-output"><span class="term-string">"以题会友，以码明志"</span></div>
          <div class="term-line term-output"><span class="term-comment"># 题解 / 数据结构 / 竞赛记录 / 模板</span></div>
          <div class="term-line term-spacer"></div>
          <div class="term-line"><span class="term-prompt">$</span> ls <span class="term-flag">-la</span> categories/</div>
          <div class="term-line term-output">
            <span class="term-dir">drwxr-xr-x</span>
            <span class="term-dirname">algorithms/</span>
            <span class="term-meta">4 篇文章</span>
          </div>
          <div class="term-line term-output">
            <span class="term-dir">drwxr-xr-x</span>
            <span class="term-dirname">data-structures/</span>
            <span class="term-meta">0 篇文章</span>
          </div>
          <div class="term-line term-output">
            <span class="term-dir">drwxr-xr-x</span>
            <span class="term-dirname">contest/</span>
            <span class="term-meta">0 篇文章</span>
          </div>
          <div class="term-line term-output">
            <span class="term-dir">drwxr-xr-x</span>
            <span class="term-dirname">templates/</span>
            <span class="term-meta">1 篇文章</span>
          </div>
          <div class="term-line term-spacer"></div>
          <div class="term-line">
            <span class="term-prompt">$</span>
            <span class="term-cursor" :class="{ blink: cursorBlink }">_</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 快捷入口按钮 ===== -->
    <section class="term-quick">
      <a href="/posts/algorithms/" class="term-quick-btn">cd algorithms/</a>
      <a href="/tags/" class="term-quick-btn">cat tags.md</a>
    </section>

    <!-- ===== 分类卡片 ===== -->
    <section class="term-section">
      <div class="term-section-header">
        <span class="term-section-prompt">$</span> tree categories/
      </div>
      <div class="code-cards">
        <a v-for="cat in categories" :key="cat.slug" :href="cat.link" class="code-card" :style="{ '--code-color': cat.color }">
          <div class="code-card-gutter">
            <span class="code-lineno">{{ cat.line }}</span>
          </div>
          <div class="code-card-body">
            <span class="code-keyword">{{ cat.keyword }}</span>
            <span class="code-punct">&lt;</span>
            <span class="code-type">{{ cat.type }}</span>
            <span class="code-punct">&gt;</span>
            <span class="code-ident">{{ cat.slug }}</span>
            <span class="code-punct">;</span>
            <div class="code-comment"><span class="code-comment-slash">//</span> {{ cat.desc }}</div>
            <div class="code-comment"><span class="code-comment-slash">//</span> <span class="code-count">{{ cat.count }} 篇文章</span></div>
          </div>
        </a>
      </div>
    </section>

    <!-- ===== 文件树文章列表 ===== -->
    <section class="term-section">
      <div class="term-section-header">
        <span class="term-section-prompt">$</span> find . -name <span class="term-string">"*.md"</span> | <span class="term-keyword">sort</span> -r
      </div>
      <div class="file-tree">
        <div class="tree-row tree-row--dir">
          <span class="tree-icon">📁</span>
          <span class="tree-dirname">algorithms</span>
        </div>
        <a v-for="post in algorithmPosts" :key="post.link" :href="post.link" class="tree-row tree-row--file">
          <span class="tree-icon">📄</span>
          <span class="tree-filename">{{ post.file }}</span>
          <span class="tree-date">{{ post.date }}</span>
        </a>
        <div class="tree-row tree-row--dir">
          <span class="tree-icon">📁</span>
          <span class="tree-dirname">templates</span>
        </div>
        <a v-for="post in templatePosts" :key="post.link" :href="post.link" class="tree-row tree-row--file">
          <span class="tree-icon">📄</span>
          <span class="tree-filename">{{ post.file }}</span>
          <span class="tree-date">{{ post.date }}</span>
        </a>
        <div class="tree-row tree-row--dir tree-row--empty">
          <span class="tree-icon">📁</span>
          <span class="tree-dirname">data-structures</span>
          <span class="tree-empty">(empty)</span>
        </div>
        <div class="tree-row tree-row--dir tree-row--empty">
          <span class="tree-icon">📁</span>
          <span class="tree-dirname">contest</span>
          <span class="tree-empty">(empty)</span>
        </div>
        <div class="tree-row tree-row--file">
          <span class="tree-icon">📄</span>
          <span class="tree-filename">README.md</span>
        </div>
      </div>
    </section>

    <!-- ===== Footer ===== -->
    <footer class="term-footer">
      <span class="term-footer-prompt">$</span> <span class="term-cursor" :class="{ blink: cursorBlink }">_</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const cursorBlink = ref(true)
let blinkTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  blinkTimer = setInterval(() => {
    cursorBlink.value = !cursorBlink.value
  }, 530)
})
onUnmounted(() => {
  if (blinkTimer) clearInterval(blinkTimer)
})

const categories = [
  { slug: 'algorithms', name: '题解', keyword: 'struct', type: 'string', color: '#22c55e', desc: 'LeetCode / Codeforces / AtCoder 题解', count: 4, line: 1 },
  { slug: 'data-structures', name: '数据结构', keyword: 'class', type: 'TreeNode', color: '#3b82f6', desc: '线段树 / 并查集 / Trie / 图论', count: 0, line: 2 },
  { slug: 'contest', name: '竞赛记录', keyword: 'fn', type: 'Result', color: '#eab308', desc: '参赛复盘 / Rating 变化 / 策略', count: 0, line: 3 },
  { slug: 'templates', name: '代码模板', keyword: 'template', type: 'T', color: '#f97316', desc: '常用算法模板，快速复制使用', count: 1, line: 4 },
]

const algorithmPosts = [
  { file: 'binary-search.md', date: '2026-07-03', link: '/posts/algorithms/binary' },
  { file: 'dsu.md', date: '2025-12-01', link: '/posts/algorithms/dsu' },
]

const templatePosts = [
  { file: 'cpp-template.md', date: '2025-12-01', link: '/posts/templates/cpp-template' },
]
</script>

<style scoped>
/* ===== 全局终端风 ===== */
.home-terminal {
  background: #0d1117;
  min-height: 100vh;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', monospace;
  color: #e6edf3;
  padding-bottom: 60px;
}
:global(.dark) .home-terminal {
  background: #0d1117;
}
:global(:root:not(.dark)) .home-terminal {
  background: #ffffff;
  color: #24292f;
}

/* ===== Terminal Window ===== */
.term-hero {
  padding: 32px 16px 0;
  max-width: 740px;
  margin: 0 auto;
}
.term-window {
  border-radius: 10px;
  border: 1px solid #30363d;
  overflow: hidden;
  background: #161b22;
}
:global(:root:not(.dark)) .term-window {
  background: #f6f8fa;
  border-color: #d0d7de;
}
.term-titlebar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #21262d;
  border-bottom: 1px solid #30363d;
}
:global(:root:not(.dark)) .term-titlebar {
  background: #eaeef2;
  border-color: #d0d7de;
}
.term-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.term-dot--red { background: #ff6b6b; }
.term-dot--yellow { background: #ffd93d; }
.term-dot--green { background: #6bcb77; }
.term-title {
  font-size: 12px;
  color: #8b949e;
  margin-left: 4px;
}
:global(:root:not(.dark)) .term-title {
  color: #57606a;
}
.term-body {
  padding: 18px 20px 20px;
  font-size: 14px;
  line-height: 1.7;
}
.term-line {
  white-space: pre-wrap;
  word-break: break-all;
}
.term-prompt {
  color: #6bcb77;
  margin-right: 8px;
  font-weight: 600;
}
.term-output {
  padding-left: 20px;
}
.term-comment { color: #8b949e; }
:global(:root:not(.dark)) .term-comment { color: #6e7781; }
.term-string { color: #a5d6ff; }
:global(:root:not(.dark)) .term-string { color: #0550ae; }
.term-flag { color: #ffa657; }
.term-dir { color: #8b949e; font-size: 12px; margin-right: 12px; }
:global(:root:not(.dark)) .term-dir { color: #6e7781; }
.term-dirname { color: #58a6ff; margin-right: 12px; }
:global(:root:not(.dark)) .term-dirname { color: #0969da; }
.term-meta { color: #8b949e; font-size: 12px; }
:global(:root:not(.dark)) .term-meta { color: #6e7781; }
.term-spacer { height: 8px; }
.term-cursor {
  display: inline-block;
  color: #6bcb77;
  font-weight: 700;
}
.term-cursor.blink {
  opacity: 0;
}

/* ===== 快捷按钮 ===== */
.term-quick {
  max-width: 740px;
  margin: 20px auto 0;
  padding: 0 16px;
  display: flex;
  gap: 12px;
  justify-content: center;
}
.term-quick-btn {
  padding: 8px 20px;
  border: 1px solid #30363d;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  color: #58a6ff;
  text-decoration: none;
  transition: all 0.2s;
  background: #161b22;
}
:global(:root:not(.dark)) .term-quick-btn {
  background: #f6f8fa;
  border-color: #d0d7de;
  color: #0969da;
}
.term-quick-btn:hover {
  background: #1f2937;
  border-color: #58a6ff;
}
:global(:root:not(.dark)) .term-quick-btn:hover {
  background: #eaeef2;
}

/* ===== Section ===== */
.term-section {
  max-width: 740px;
  margin: 36px auto 0;
  padding: 0 16px;
}
.term-section-header {
  font-size: 13px;
  color: #8b949e;
  margin-bottom: 14px;
  padding: 8px 12px;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 6px;
  font-family: inherit;
}
:global(:root:not(.dark)) .term-section-header {
  background: #f6f8fa;
  border-color: #d0d7de;
  color: #6e7781;
}
.term-section-prompt {
  color: #6bcb77;
  margin-right: 6px;
}
.term-keyword { color: #ff7b72; }
:global(:root:not(.dark)) .term-keyword { color: #cf222e; }

/* ===== 代码语法分类卡片 ===== */
.code-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.code-card {
  display: flex;
  text-decoration: none;
  border: 1px solid #30363d;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.2s;
  background: #161b22;
}
:global(:root:not(.dark)) .code-card {
  background: #f6f8fa;
  border-color: #d0d7de;
}
.code-card:hover {
  border-color: var(--code-color, #58a6ff);
  box-shadow: 0 0 0 1px var(--code-color, #58a6ff);
}
.code-card-gutter {
  width: 36px;
  background: #0d1117;
  display: flex;
  justify-content: center;
  padding-top: 12px;
  flex-shrink: 0;
  border-right: 1px solid #30363d;
}
:global(:root:not(.dark)) .code-card-gutter {
  background: #ffffff;
  border-color: #d0d7de;
}
.code-lineno {
  font-size: 11px;
  color: #484f58;
}
.code-card-body {
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.6;
  font-family: inherit;
}
.code-keyword { color: #ff7b72; }
:global(:root:not(.dark)) .code-keyword { color: #cf222e; }
.code-punct { color: #8b949e; }
:global(:root:not(.dark)) .code-punct { color: #6e7781; }
.code-type { color: #58a6ff; }
:global(:root:not(.dark)) .code-type { color: #0969da; }
.code-ident { color: #e6edf3; }
:global(:root:not(.dark)) .code-ident { color: #24292f; }
.code-comment {
  color: #8b949e;
  font-size: 11px;
  margin-top: 2px;
}
:global(:root:not(.dark)) .code-comment { color: #6e7781; }
.code-comment-slash { color: #484f58; }
:global(:root:not(.dark)) .code-comment-slash { color: #afb8c1; }
.code-count { color: var(--code-color, #58a6ff); }

/* ===== 文件树 ===== */
.file-tree {
  border: 1px solid #30363d;
  border-radius: 6px;
  overflow: hidden;
  background: #161b22;
}
:global(:root:not(.dark)) .file-tree {
  background: #f6f8fa;
  border-color: #d0d7de;
}
.tree-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-size: 13px;
  border-bottom: 1px solid #21262d;
  text-decoration: none;
  color: #e6edf3;
  transition: background 0.15s;
}
:global(:root:not(.dark)) .tree-row {
  color: #24292f;
  border-color: #d0d7de;
}
.tree-row:last-child {
  border-bottom: none;
}
.tree-row--dir {
  color: #58a6ff;
  font-weight: 600;
}
:global(:root:not(.dark)) .tree-row--dir {
  color: #0969da;
}
.tree-row--file:hover {
  background: #1c2128;
}
:global(:root:not(.dark)) .tree-row--file:hover {
  background: #eaeef2;
}
.tree-row--empty .tree-dirname {
  opacity: 0.5;
}
.tree-icon {
  font-size: 14px;
  flex-shrink: 0;
  width: 18px;
  text-align: center;
}
.tree-filename {
  flex: 1;
}
.tree-date {
  font-size: 11px;
  color: #8b949e;
}
:global(:root:not(.dark)) .tree-date {
  color: #6e7781;
}
.tree-empty {
  font-size: 11px;
  color: #484f58;
  font-style: italic;
}

/* ===== Footer ===== */
.term-footer {
  max-width: 740px;
  margin: 48px auto 0;
  padding: 0 16px;
  font-size: 14px;
  color: #8b949e;
}
.term-footer-prompt {
  color: #6bcb77;
  margin-right: 6px;
}

/* ===== Responsive ===== */
@media (max-width: 640px) {
  .code-cards {
    grid-template-columns: 1fr;
  }
  .term-body {
    font-size: 12px;
    padding: 14px 14px 16px;
  }
  .term-title {
    font-size: 11px;
  }
  .code-card-body {
    font-size: 12px;
  }
}
</style>
