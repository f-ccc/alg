<template>
  <nav class="algo-nav" aria-label="算法导航">
    <a
      v-for="algo in algorithms"
      :key="algo.slug"
      :href="algo.exists ? algo.link : undefined"
      class="algo-card"
      :class="{ 'algo-card--exists': algo.exists, 'algo-card--soon': !algo.exists }"
      :style="{ '--accent': algo.color }"
      :tabindex="algo.exists ? 0 : -1"
      :aria-disabled="!algo.exists"
    >
      <span class="algo-icon" v-html="algo.icon"></span>
      <span class="algo-label">{{ algo.label }}</span>
      <span class="algo-status">{{ algo.exists ? '→' : '准备中' }}</span>
    </a>
  </nav>
</template>

<script setup lang="ts">
const algorithms = [
  {
    slug: 'binary',
    label: '二分查找',
    link: '/posts/algorithms/binary',
    color: '#3b82f6',
    exists: true,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  },
  {
    slug: 'dsu',
    label: '并查集 DSU',
    link: '/posts/algorithms/dsu',
    color: '#22c55e',
    exists: true,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  },
  {
    slug: 'dp',
    label: '动态规划',
    link: '/posts/algorithms/dp',
    color: '#f59e0b',
    exists: true,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  },
  {
    slug: 'graph',
    label: '图论',
    link: '/posts/algorithms/graph',
    color: '#8b5cf6',
    exists: false,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  },
  {
    
  }
]
</script>

<style scoped>
.algo-nav {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin: 32px 0;
}

.algo-card {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1 1 180px;
  min-width: 0;
  padding: 20px;
  border-radius: var(--vp-border-radius);
  text-decoration: none;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.25s;
}

.algo-card--exists:hover {
  border-color: var(--accent);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--accent) 15%, transparent);
  transform: translateY(-3px);
}

.algo-card--soon {
  opacity: 0.5;
  cursor: default;
}

.algo-card--soon:hover {
  border-color: var(--vp-c-divider);
}

.algo-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  color: var(--accent);
}

.algo-icon svg {
  width: 100%;
  height: 100%;
}

.algo-label {
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-text);
  line-height: 1.3;
  flex: 1;
}

.algo-card--exists:hover .algo-label {
  color: var(--accent);
}

.algo-status {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--accent);
  flex-shrink: 0;
}

.algo-card--soon .algo-status {
  color: var(--vp-c-text-mute);
  font-weight: 400;
}

@media (max-width: 600px) {
  .algo-nav {
    gap: 10px;
    margin: 24px 0;
  }
  .algo-card {
    flex: 1 1 100%;
    padding: 14px 16px;
  }
  .algo-icon {
    width: 28px;
    height: 28px;
  }
  .algo-label {
    font-size: 0.9rem;
  }
}
</style>
