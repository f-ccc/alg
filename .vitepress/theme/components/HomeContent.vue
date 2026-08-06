<template>
  <div class="hc-page">
    <!-- 标题行 -->
    <header class="hc-header">
      <h1 class="hc-title">算法笔记</h1>
    </header>

    <!-- 分类快捷入口 -->
    <nav class="hc-cats">
      <a v-for="cat in categories" :key="cat.slug" :href="cat.link" class="hc-cat" :style="{ '--c': cat.color }">
        <span class="hc-cat-icon" v-html="cat.icon"></span>
        <span class="hc-cat-name">{{ cat.name }}</span>
        <span class="hc-cat-count">{{ cat.count }}</span>
      </a>
    </nav>

    <!-- 文章列表（数据来自 vite 插件 virtual:home-posts，按日期倒序取最近 N 篇） -->
    <section class="hc-posts">
      <a v-for="p in displayedPosts" :key="p.link" :href="p.link" class="hc-card" :style="{ '--c': p.color }">
        <div class="hc-card-top">
          <span class="hc-card-tag" :style="{ background: p.color + '18', color: p.color }">{{ p.cat }}</span>
          <time v-if="p.date" class="hc-card-date">{{ p.date }}</time>
        </div>
        <h2 class="hc-card-title">{{ p.title }}</h2>
      </a>
    </section>

  </div>
</template>

<script setup lang="ts">
import homeData from 'virtual:home-posts'

const { categories, posts } = homeData
const LIMIT = 8
const displayedPosts = posts.slice(0, LIMIT)
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
  margin: 0;
  line-height: 1.4;
}
.hc-card:hover .hc-card-title {
  color: var(--c);
}

@media (max-width: 600px) {
  .hc-posts { grid-template-columns: 1fr; }
  .hc-page { padding: 32px 16px 48px; }
}
</style>
