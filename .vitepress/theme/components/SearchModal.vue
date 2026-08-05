<template>
  <Teleport to="body">
    <div v-if="visible" class="search-overlay" @click.self="close">
      <div class="search-modal" @keydown.esc="close">
        <div class="search-header">
          <svg class="search-magnifier" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            class="search-input"
            placeholder="搜索文章…"
            autocomplete="off"
            spellcheck="false"
            @keydown.up.prevent="move(-1)"
            @keydown.down.prevent="move(1)"
            @keydown.enter.prevent="openSelected"
          />
          <button class="search-close" @click="close" title="关闭 (ESC)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="search-body" v-if="debouncedQuery">
          <div class="result-count" v-if="results.length">
            {{ results.length }} 个符合条件的结果
          </div>

          <div class="result-list">
            <a
              v-for="(item, idx) in results"
              :key="item.post.link"
              :href="item.post.link"
              class="result-item"
              :class="{ selected: idx === selectedIdx }"
              @click="close"
              @mouseenter="selectedIdx = idx"
            >
              <svg class="result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <div class="result-body">
                <div class="result-title" v-html="highlightText(item.post.title, query)" />
                <div class="result-desc" v-html="highlightText(item.post.desc, query)" />
              </div>
            </a>
          </div>

          <div class="result-empty" v-if="!results.length">
            {{ loading && !index ? '正在加载索引…' : '暂无符合条件的结果' }}
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useDebounce } from '@vueuse/core'
import { highlightText } from '../utils/highlight'

/* ---------- posts data - from Vite plugin (avoid import.meta.glob HMR crash) ---------- */
interface Post {
  title: string
  desc: string
  /** 去除 frontmatter 和 markdown 标记后的纯文本 */
  text: string
  link: string
}

interface ScoredItem {
  post: Post
  score: number
}

// 懒加载虚拟模块：索引被 Rollup 拆成独立 chunk，首次打开搜索框时才下载
const index = shallowRef<Post[] | null>(null)
const loading = ref(false)
let loadPromise: Promise<void> | null = null

function ensureIndex(): void {
  if (index.value || loadPromise) return
  loading.value = true
  loadPromise = import('virtual:search-index')
    .then((m) => {
      index.value = m.default
    })
    .catch((e) => {
      loadPromise = null
      console.error('[search] 索引加载失败:', e)
    })
    .finally(() => {
      loading.value = false
    })
}

/* ---------- state ---------- */
const visible = ref(false)
const query = ref('')
const debouncedQuery = useDebounce(query, 150)
const results = ref<ScoredItem[]>([])
const inputRef = ref<HTMLInputElement>()
const selectedIdx = ref(-1)

/* ---------- OI-Wiki 纯 token 匹配排序 ---------- */
function tokenize(s: string): string[] {
  return s.toLowerCase().split(/\s+/).filter(Boolean)
}

function computeResults(raw: string): ScoredItem[] {
  const terms = tokenize(raw)
  if (!terms.length) return []

  const posts = index.value
  if (!posts) return []

  const scored: ScoredItem[] = []

  for (const post of posts) {
    const titleLow = post.title.toLowerCase()
    const textLow = post.text.toLowerCase()
    let score = 0

    for (const t of terms) {
      if (titleLow.includes(t)) score += 3
      else if (textLow.includes(t)) score += 1
    }

    if (score > 0) {
      scored.push({ post, score })
    }
  }

  scored.sort((a, b) => b.score - a.score)
  return scored
}

/* ---------- watcher ---------- */
// 同时监听索引加载完成，加载后自动重算当前输入
watch([debouncedQuery, index], ([q]) => {
  results.value = computeResults(q)
  selectedIdx.value = results.value.length ? 0 : -1
})

/* ---------- keyboard ---------- */
function move(dir: number) {
  if (!results.value.length) return
  selectedIdx.value += dir
  if (selectedIdx.value < 0) selectedIdx.value = results.value.length - 1
  if (selectedIdx.value >= results.value.length) selectedIdx.value = 0
  nextTick(() => {
    const el = document.querySelector('.result-item.selected')
    el?.scrollIntoView({ block: 'nearest' })
  })
}

function openSelected() {
  if (selectedIdx.value < 0 || selectedIdx.value >= results.value.length) return
  window.location.href = results.value[selectedIdx.value].post.link
  close()
}

/* ---------- open / close ---------- */
function open() {
  visible.value = true
  query.value = ''
  results.value = []
  selectedIdx.value = -1
  ensureIndex()
  nextTick(() => inputRef.value?.focus())
}

function close() {
  visible.value = false
  query.value = ''
  results.value = []
  selectedIdx.value = -1
}

defineExpose({ open, close })

/* ---------- Ctrl+K / ESC ---------- */
function onKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    open()
  }
  if (e.key === 'Escape' && visible.value) {
    close()
  }
}

let idleHandle: number | undefined

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  // 空闲时预取索引，避免首次打开搜索框时的等待
  if ('requestIdleCallback' in window) {
    idleHandle = window.requestIdleCallback(() => ensureIndex())
  } else {
    idleHandle = window.setTimeout(() => ensureIndex(), 1000)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  if (idleHandle !== undefined) {
    if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleHandle)
    else window.clearTimeout(idleHandle)
  }
})
</script>

<style scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 12vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}
.search-modal {
  width: min(90vw, 640px);
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background: var(--vp-c-bg-elv, #fff);
  border: 1px solid var(--vp-c-divider, #e5e7eb);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: modalIn 0.12s ease-out;
}
@keyframes modalIn {
  from { opacity: 0; transform: translateY(-10px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.search-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vp-c-divider, #e5e7eb);
}
.search-magnifier {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: var(--vp-c-text-mute, #6b7280);
}
.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--vp-c-text, #1a1a2e);
}
.search-input::placeholder {
  color: var(--vp-c-text-mute, #9ca3af);
}
.search-close {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--vp-c-text-mute, #6b7280);
  cursor: pointer;
  transition: background 0.12s;
}
.search-close:hover {
  background: var(--vp-c-bg-alt, #f5f5f5);
  color: var(--vp-c-text, #1a1a2e);
}
.search-close svg {
  width: 18px;
  height: 18px;
}
.search-body {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}
.result-count {
  padding: 8px 16px 4px;
  font-size: 0.8rem;
  color: var(--vp-c-text-mute, #6b7280);
}
.result-list {
  display: flex;
  flex-direction: column;
}
.result-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 16px;
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: background 0.1s, border-color 0.1s;
}
.result-item:hover,
.result-item.selected {
  background: var(--vp-c-bg-alt, #f5f5f5);
  border-left-color: var(--vp-c-brand-1, #2563eb);
}
.result-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 3px;
  color: var(--vp-c-text-mute, #9ca3af);
}
.result-body {
  flex: 1;
  min-width: 0;
}
.result-title {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.5;
  color: var(--vp-c-text, #1a1a2e);
  word-break: break-word;
}
.result-desc {
  font-size: 0.8rem;
  line-height: 1.5;
  margin-top: 3px;
  color: var(--vp-c-text-mute, #6b7280);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.result-empty {
  padding: 32px 16px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--vp-c-text-mute, #9ca3af);
}
</style>
