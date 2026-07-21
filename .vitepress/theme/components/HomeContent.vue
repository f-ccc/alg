<template>
  <div class="hc-page">
    <!-- 标题行 -->
    <header class="hc-header">
      <h1 class="hc-title">算法笔记</h1>
      <p class="hc-tagline"></p>
    </header>

    <!-- 分类快捷入口 -->
    <nav class="hc-cats">
      <a v-for="cat in categories" :key="cat.slug" :href="cat.link" class="hc-cat" :style="{ '--c': cat.color }">
        <span class="hc-cat-icon" v-html="cat.icon"></span>
        <span class="hc-cat-name">{{ cat.name }}</span>
        <span class="hc-cat-count">{{ cat.count }}</span>
      </a>
    </nav>

    <!-- 文章列表 -->
    <section class="hc-posts">
      <a v-for="(p, i) in posts" :key="i" :href="p.link" class="hc-card" :style="{ '--c': p.color }">
        <div class="hc-card-top">
          <span class="hc-card-tag" :style="{ background: p.color + '18', color: p.color }">{{ p.cat }}</span>
          <time class="hc-card-date">{{ p.date }}</time>
        </div>
        <h2 class="hc-card-title">{{ p.title }}</h2>
        <p class="hc-card-desc">{{ p.desc }}</p>
        <div class="hc-card-meta">
          <span class="hc-card-read">{{ p.readingTime }} min</span>
        </div>
      </a>
    </section>

    <!-- 页脚 -->
    <footer class="hc-footer">
      <p>算法笔记 &copy; {{ year }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()

const categories = [
  { slug: 'algorithms', name: '题解', link: '/posts/algorithms/', count: 4, color: '#2563eb', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  { slug: 'ds', name: '数据结构', link: '/posts/data-structures/', count: 0, color: '#8b5cf6', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>' },
  { slug: 'contest', name: '竞赛', link: '/posts/contest/', count: 0, color: '#f59e0b', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5h3A4 4 0 0 1 13 5.5V9"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5h-3A4 4 0 0 0 11 5.5V9"/><path d="M4 22h16"/><path d="M10 22V9"/><path d="M14 22V9"/></svg>' },
  { slug: 'templates', name: '模板', link: '/posts/templates/', count: 1, color: '#22c55e', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>' },
]

const posts = [
  { title: '二分查找', desc: '开区间 / 闭区间 / 左闭右开三种写法对比，附二分查找可视化交互演示。', link: '/posts/algorithms/binary', date: '2026-07-03', cat: '题解', color: '#2563eb', readingTime: 12 }, 
  { title: '并查集 DSU', desc: 'Disjoint Set Union 的原理、优化与应用，包括路径压缩和按秩合并。', link: '/posts/algorithms/dsu', date: '2025-12-01', cat: '题解', color: '#2563eb', readingTime: 10 },
  { title: 'C++ 竞赛模板', desc: '常用算法模板汇总，涵盖输入输出优化、常用数据结构和算法。', link: '/posts/templates/cpp-template', date: '2025-12-01', cat: '模板', color: '#22c55e', readingTime: 5 },
]
</script>

<style scoped>
.hc-page {
  max-width: 780px;
  margin: 0 auto;
  padding: 24px 24px 64px;
  background: var(--vp-c-bg);
}

/* --- 标题 --- */
.hc-header {
  margin-bottom: 36px;
}
.hc-title {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--vp-c-text);
  margin: 0 0 6px;
}
.hc-tagline {
  font-size: 0.95rem;
  color: var(--vp-c-text-mute);
  margin: 0;
}

/* --- 分类导航 --- */
.hc-cats {
  display: flex;
  gap: 8px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}
.hc-cat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px 6px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--c) 25%, transparent);
  transition: background 0.2s, transform 0.15s;
}
.hc-cat:hover {
  background: color-mix(in srgb, var(--c) 18%, transparent);
  transform: translateY(-1px);
}
.hc-cat-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
}
.hc-cat-icon svg { width: 100%; height: 100%; }
.hc-cat-name { line-height: 1; }
.hc-cat-count {
  font-size: 0.75rem;
  opacity: 0.7;
  background: color-mix(in srgb, var(--c) 15%, transparent);
  padding: 0 6px;
  border-radius: 8px;
  line-height: 1.4;
}

/* --- 文章网格 --- */
.hc-posts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.hc-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: var(--vp-border-radius);
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.2s;
}
.hc-card:hover {
  border-color: var(--c);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--c) 12%, transparent);
  transform: translateY(-2px);
}
.hc-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.hc-card-tag {
  font-size: 0.75rem;
  padding: 2px 10px;
  border-radius: 10px;
  font-weight: 600;
  line-height: 1.5;
}
.hc-card-date {
  font-size: 0.78rem;
  color: var(--vp-c-text-mute);
}
.hc-card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--vp-c-text);
  margin: 0 0 8px;
  line-height: 1.4;
}
.hc-card:hover .hc-card-title {
  color: var(--c);
}
.hc-card-desc {
  font-size: 0.85rem;
  color: var(--vp-c-text-mute);
  margin: 0 0 auto;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.hc-card-meta {
  margin-top: 14px;
}
.hc-card-read {
  font-size: 0.75rem;
  color: var(--vp-c-text-mute);
  font-weight: 500;
}

/* --- 页脚 --- */
.hc-footer {
  margin-top: 64px;
  text-align: center;
  font-size: 0.8rem;
  color: var(--vp-c-text-mute);
}

@media (max-width: 600px) {
  .hc-posts { grid-template-columns: 1fr; }
  .hc-page { padding: 32px 16px 48px; }
}
</style>
