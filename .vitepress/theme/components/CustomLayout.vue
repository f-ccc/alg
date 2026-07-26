<script setup lang="ts">
import { ref } from 'vue'
import DefaultTheme from 'vitepress/theme'
import CustomOutlineTitle from './CustomOutlineTitle.vue'
import SearchModal from './SearchModal.vue'

const { Layout } = DefaultTheme
const searchModalRef = ref<InstanceType<typeof SearchModal>>()

function openSearch() {
  searchModalRef.value?.open()
}
</script>

<template>
  <Layout>
    <template #aside-top>
      <CustomOutlineTitle />
    </template>
    <template #nav-bar-content-before>
      <div class="search-bar" role="button" tabindex="0" @click="openSearch" @keydown.enter="openSearch">
        <svg class="search-bar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span class="search-bar-text">搜索文章</span>
        <kbd class="search-bar-hint">Ctrl+K</kbd>
      </div>
    </template>
    <template #layout-bottom>
      <SearchModal ref="searchModalRef" />
    </template>
  </Layout>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  margin-left: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-mute);
  cursor: text;
  transition: border-color 0.2s, background 0.2s;
  font-size: 0.85rem;
  min-width: 160px;
}
.search-bar:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-elv);
}
.search-bar-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--vp-c-text-mute);
}
.search-bar-text {
  line-height: 1;
  user-select: none;
}
.search-bar-hint {
  margin-left: auto;
  font-size: 0.7rem;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-mute);
  font-family: inherit;
  line-height: 1.4;
  opacity: 0.7;
  user-select: none;
  letter-spacing: 0.3px;
}
</style>
