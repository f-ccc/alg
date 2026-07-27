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
      </a>
    </section>

  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()

const categories = [
  { slug: 'alg', 
    name: '算法', 
    link: '/posts/algorithms/', 
    count: 1, 
    color: '#8b5cf6', 
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>' 
  },
  { slug: 'slove', 
    name: '题解', 
    link: '/posts/contest/', 
    count: 2, 
    color: '#2563eb', 
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' 
  },
  // { slug: 'contest', 
  //   name: '竞赛', 
  //   link: '/posts/contest/', 
  //   count: 0, color: '#f59e0b', 
  //   icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5h3A4 4 0 0 1 13 5.5V9"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5h-3A4 4 0 0 0 11 5.5V9"/><path d="M4 22h16"/><path d="M10 22V9"/><path d="M14 22V9"/></svg>' 
  // },
  { slug: 'templates', 
    name: '模板', 
    link: '/posts/templates/', 
    count: 7, 
    color: '#22c55e', 
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>' 
  },
]

// #f97316  orange-500 橙
// #f59e0b  amber-500   琥珀黄
// #eab308  yellow-500 亮黄
// #84cc16  lime-500    青柠绿
// #22c55e  green-500   草绿
// #10b981  emerald-500 翡翠绿
// #14b8a6  teal-500    水鸭青
// #06b6d4  cyan-500    浅青蓝
// #0ea5e9  sky-500     天蓝色
// #3b82f6  blue-500    原版蓝
// #6366f1  indigo-500  靛蓝
// #8b5cf6  violet-500 紫罗兰
// #a855f7  purple-500  紫色
// #ec4899  pink-500    粉色
// #f43f5e  rose-500    玫红
const posts = [
  {
    title: '二维叉积',
    desc: '',
    link: '/posts/algorithms/二维叉积',
    date: '2026-7-24',
    cat: '算法',
    color: '#a855f7',
  },
  {
    title: '26牛客暑假多校3',
    desc: '',
    link: '/posts/contest/牛客/26牛客暑假多校3',
    date: '2026-7-24',
    cat: '题解',
    color: '#ec4899',
  },
  { title: '26牛客暑假多校2',
    desc: '',
    link: '/posts/contest/牛客/26牛客暑假多校2',
    date: '2026-7-22',
    cat: '题解',
    color: '#3b82f6'
  }
  // { title: '', desc: '', link: '', date: '', cat: '', color: '#2563eb' }, 
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
