<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { page } = useData()

const title = computed(() => page.value?.title || '')
</script>

<template>
  <div class="custom-outline-title" v-if="title">
    <span class="custom-outline-title-text">{{ title }}</span>
  </div>
</template>
