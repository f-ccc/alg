<template>
  <div class="oi-home">
    <!-- 分类标签导航 -->
    <nav class="oi-tabs">
      <button
        v-for="cat in categories"
        :key="cat.key"
        class="oi-tab"
        :class="{ active: activeCat === cat.key }"
        @click="activeCat = cat.key"
      >
        {{ cat.label }}
      </button>
    </nav>

    <div class="oi-main">
      <!-- 左侧二级导航 -->
      <aside class="oi-sidebar">
        <template v-if="currentCat">
          <div v-for="group in currentCat.groups" :key="group.name" class="oi-group">
            <h3 class="oi-group-title">{{ group.name }}</h3>
            <a
              v-for="item in group.items"
              :key="item.link"
              :href="item.link"
              class="oi-sidelink"
              :class="{ active: item.active }"
            >
              {{ item.label }}
            </a>
          </div>
        </template>
        <p v-else class="oi-placeholder">选择一个分类</p>
      </aside>

      <!-- 右侧文章列表 -->
      <section class="oi-content">
        <template v-if="currentCat && currentCat.articles.length">
          <h2 class="oi-content-title">{{ currentCat.label }}</h2>
          <div class="oi-article-list">
            <a v-for="a in currentCat.articles" :key="a.link" :href="a.link" class="oi-article">
              <span class="oi-article-title">{{ a.title }}</span>
              <span class="oi-article-date">{{ a.date }}</span>
            </a>
          </div>
        </template>
        <div v-else class="oi-empty">
          <p>该分类暂无文章</p>
        </div>
      </section>
    </div>

    <footer class="oi-footer">
      <p>算法笔记 &copy; {{ year }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const year = new Date().getFullYear()
const activeCat = ref('')

interface Article {
  title: string
  link: string
  date: string
}

interface SideGroup {
  name: string
  items: { label: string; link: string; active?: boolean }[]
}

interface Category {
  key: string
  label: string
  groups: SideGroup[]
  articles: Article[]
}

const categories: Category[] = [
  {
    key: 'search',
    label: '搜索',
    groups: [
      { name: '基础', items: [
        { label: '二分查找', link: '/posts/algorithms/binary' },
        { label: 'DFS', link: '#' },
        { label: 'BFS', link: '#' },
      ]},
    ],
    articles: [
      { title: '二分查找（开区间 / 闭区间 / 左闭右开）', link: '/posts/algorithms/binary', date: '2026-07-03' },
    ],
  },
  {
    key: 'dp',
    label: '动态规划',
    groups: [
      { name: '背包', items: [
        { label: '01 背包', link: '#' },
        { label: '完全背包', link: '#' },
      ]},
      { name: '区间 DP', items: [
        { label: '石子合并', link: '#' },
      ]},
      { name: '树形 DP', items: [
        { label: '树上背包', link: '#' },
      ]},
    ],
    articles: [],
  },
  {
    key: 'string',
    label: '字符串',
    groups: [
      { name: '匹配', items: [
        { label: 'KMP', link: '#' },
        { label: 'AC 自动机', link: '#' },
      ]},
      { name: '其他', items: [
        { label: 'Trie 树', link: '#' },
        { label: '后缀数组', link: '#' },
      ]},
    ],
    articles: [],
  },
  {
    key: 'math',
    label: '数学',
    groups: [
      { name: '数论', items: [
        { label: '质数', link: '#' },
        { label: 'GCD/LCM', link: '#' },
        { label: '同余', link: '#' },
      ]},
      { name: '组合', items: [
        { label: '排列组合', link: '#' },
      ]},
    ],
    articles: [],
  },
  {
    key: 'ds',
    label: '数据结构',
    groups: [
      { name: '基础', items: [
        { label: '并查集 DSU', link: '/posts/algorithms/dsu' },
        { label: '线段树', link: '#' },
        { label: '树状数组', link: '#' },
        { label: 'Trie', link: '#' },
      ]},
    ],
    articles: [
      { title: '并查集 DSU', link: '/posts/algorithms/dsu', date: '2025-12-01' },
    ],
  },
  {
    key: 'graph',
    label: '图论',
    groups: [
      { name: '最短路', items: [
        { label: 'Dijkstra', link: '#' },
        { label: 'Floyd', link: '#' },
        { label: 'SPFA', link: '#' },
      ]},
      { name: '生成树', items: [
        { label: 'Kruskal', link: '#' },
        { label: 'Prim', link: '#' },
      ]},
    ],
    articles: [],
  },
  {
    key: 'geom',
    label: '计算几何',
    groups: [
      { name: '基础', items: [
        { label: '向量', link: '#' },
        { label: '凸包', link: '#' },
      ]},
    ],
    articles: [],
  },
  {
    key: 'misc',
    label: '杂项',
    groups: [
      { name: '技巧', items: [
        { label: '对拍', link: '#' },
        { label: '暴力', link: '#' },
        { label: '贪心', link: '#' },
      ]},
    ],
    articles: [],
  },
  {
    key: 'topic',
    label: '专题',
    groups: [
      { name: '竞赛', items: [
        { label: '洛谷题单', link: '#' },
        { label: 'Codeforces', link: '#' },
      ]},
    ],
    articles: [],
  },
]

const currentCat = computed(() => categories.find(c => c.key === activeCat.value))
</script>

<style scoped>
.oi-home {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 20px 48px;
  min-height: 100vh;
}

/* --- 分类标签 --- */
.oi-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.oi-tab {
  padding: 6px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.oi-tab:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.oi-tab.active {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}

/* --- 主体: 左 nav + 右内容 --- */
.oi-main {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

/* --- 左侧二级导航 --- */
.oi-sidebar {
  width: 200px;
  flex-shrink: 0;
  position: sticky;
  top: 80px;
}
.oi-group {
  margin-bottom: 20px;
}
.oi-group-title {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--vp-c-text-mute);
  margin: 0 0 8px;
}
.oi-sidelink {
  display: block;
  padding: 4px 0 4px 12px;
  font-size: 0.9rem;
  color: var(--vp-c-text);
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: all 0.15s;
}
.oi-sidelink:hover {
  color: var(--vp-c-brand-1);
  border-left-color: var(--vp-c-brand-2);
}
.oi-sidelink.active {
  color: var(--vp-c-brand-1);
  border-left-color: var(--vp-c-brand-1);
  font-weight: 600;
}
.oi-placeholder {
  color: var(--vp-c-text-mute);
  font-size: 0.9rem;
}

/* --- 右侧文章列表 --- */
.oi-content {
  flex: 1;
  min-width: 0;
}
.oi-content-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 20px;
  color: var(--vp-c-text);
}
.oi-article-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.oi-article {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.15s;
}
.oi-article:hover {
  background: var(--vp-c-bg-alt);
}
.oi-article-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--vp-c-text);
}
.oi-article:hover .oi-article-title {
  color: var(--vp-c-brand-1);
}
.oi-article-date {
  font-size: 0.8rem;
  color: var(--vp-c-text-mute);
  flex-shrink: 0;
  margin-left: 12px;
}
.oi-empty {
  text-align: center;
  padding: 48px 0;
  color: var(--vp-c-text-mute);
}

/* --- 页脚 --- */
.oi-footer {
  margin-top: 64px;
  text-align: center;
  font-size: 0.8rem;
  color: var(--vp-c-text-mute);
}

@media (max-width: 720px) {
  .oi-main { flex-direction: column; }
  .oi-sidebar { width: 100%; position: static; display: flex; flex-wrap: wrap; gap: 12px; }
  .oi-group { margin-bottom: 0; }
}
</style>
