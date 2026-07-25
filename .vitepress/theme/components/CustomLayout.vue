<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import CustomOutlineTitle from './CustomOutlineTitle.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #aside-top>
      <CustomOutlineTitle />
    </template>
  </Layout>
</template>
