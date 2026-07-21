<template>
  <div class="step-viewer" role="region" aria-label="二分查找步骤演示">
    <!-- 进度条 -->
    <div class="progress-container">
      <div
        class="progress-bar"
        role="progressbar"
        :aria-valuenow="current + 1"
        aria-valuemin="1"
        :aria-valuemax="steps.length"
        :style="{ width: `${((current + 1) / steps.length) * 100}%` }"
      ></div>
    </div>

    <!-- 进度文字 -->
    <div class="step-progress" role="status">{{ current + 1 }} / {{ steps.length }}</div>

    <!-- 步骤圆点指示器 -->
    <div class="step-dots">
      <button
        v-for="(_, i) in steps"
        :key="i"
        class="step-dot"
        :class="{ active: i === current }"
        :aria-label="'第 ' + (i + 1) + ' 步'"
        :aria-current="i === current ? 'step' : undefined"
        @click="current = i"
      ></button>
    </div>

    <!-- 图片 + 文字（带过渡） -->
    <Transition name="step-fade" mode="out-in">
      <div class="step-content" :key="current">
        <img
          :src="steps[current].img"
          :alt="steps[current].alt"
          loading="lazy"
          class="step-image"
        />
        <div class="step-desc" aria-live="polite">{{ steps[current].text }}</div>
      </div>
    </Transition>

    <!-- 按钮 -->
    <div class="step-buttons">
      <button class="step-btn" :disabled="current === 0" @click="goFirst" aria-label="跳到第一步">
        <svg class="step-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="19 20 9 12 19 4"/><line x1="5" y1="4" x2="5" y2="20"/></svg>
        上一步
      </button>
      <button class="step-btn step-btn--play" @click="toggleAutoPlay" :aria-label="autoPlaying ? '暂停自动播放' : '自动播放'">
        <svg v-if="!autoPlaying" class="step-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <svg v-else class="step-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        {{ autoPlaying ? '暂停' : '自动' }}
      </button>
      <button class="step-btn" :disabled="current === steps.length - 1" @click="next" aria-label="下一步">
        下一步
        <svg class="step-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 4 15 12 5 20"/><line x1="19" y1="4" x2="19" y2="20"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const steps = [
  { img: '/img/binary/1.png', alt: '二分查找第 1 步：初始化边界', text: '【初始化】设定左边界 l=-1，右边界 r=10（数组长度）。蓝色区间代表所有 < 12 的元素，绿色区间代表所有 >= 12 的元素，灰色为待确定区域。' },
  { img: '/img/binary/2.png', alt: '二分查找第 2 步：计算中点', text: '【计算中点】计算当前区间中点 mid = l + (r - l) / 2 = 4，对应元素值为 12。使用此公式可避免整数溢出。' },
  { img: '/img/binary/3.png', alt: '二分查找第 3 步：扩张右区间', text: '【扩张绿区】a[mid] = 12 >= 12，说明 mid 及右侧都属于 >=12 的区域。将右边界 r 更新为 mid=4，绿色区间扩展为 [4, 10)。' },
  { img: '/img/binary/4.png', alt: '二分查找第 4 步：计算中点', text: '【计算中点】新区间 l=-1, r=4，计算中点 mid = (-1 + 4) / 2 = 1，对应元素值为 5。' },
  { img: '/img/binary/5.png', alt: '二分查找第 5 步：扩张左区间', text: '【扩张蓝区】a[mid] = 5 < 12，说明 mid 及左侧都属于 <12 的区域。将左边界 l 更新为 mid=1，蓝色区间扩展为 (-1, 1]。' },
  { img: '/img/binary/6.png', alt: '二分查找第 6 步：计算中点', text: '【计算中点】新区间 l=1, r=4，计算中点 mid = (1 + 4) / 2 = 2，对应元素值为 8。' },
  { img: '/img/binary/7.png', alt: '二分查找第 7 步：扩张左区间', text: '【扩张蓝区】a[mid] = 8 < 12，将左边界 l 更新为 mid=2，蓝色区间扩展为 (-1, 2]。' },
  { img: '/img/binary/8.png', alt: '二分查找第 8 步：计算中点', text: '【计算中点】新区间 l=2, r=4，计算中点 mid = (2 + 4) / 2 = 3，对应元素值为 12。' },
  { img: '/img/binary/9.png', alt: '二分查找第 9 步：查找结束', text: '【查找结束】a[mid] = 12 >= 12，将右边界 r 更新为 mid=3。此时 l+1 == r（2+1=3），循环终止。r=3 就是第一个 >= 12 的元素下标。' },
]

const current = ref(0)
const autoPlaying = ref(false)
let autoTimer: ReturnType<typeof setInterval> | null = null
let touchStartX = 0

function prev() {
  if (current.value > 0) current.value--
}
function next() {
  if (current.value < steps.length - 1) current.value++
}
function goFirst() {
  current.value = 0
}
function goLast() {
  current.value = steps.length - 1
}

function toggleAutoPlay() {
  autoPlaying.value = !autoPlaying.value
}
function startAutoPlay() {
  stopAutoPlay()
  autoTimer = setInterval(() => {
    if (current.value >= steps.length - 1) {
      current.value = 0
    } else {
      current.value++
    }
  }, 4000)
}
function stopAutoPlay() {
  if (autoTimer) {
    clearInterval(autoTimer)
    autoTimer = null
  }
}
watch(autoPlaying, (v) => {
  if (v) startAutoPlay()
  else stopAutoPlay()
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
  if (e.key === 'Home') goFirst()
  if (e.key === 'End') goLast()
}

function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX
}
function onTouchEnd(e: TouchEvent) {
  const diff = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(diff) > 50) {
    if (diff > 0) prev()
    else next()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  stopAutoPlay()
})
</script>

<style scoped>
/* --- 过渡动画 --- */
.step-fade-enter-active,
.step-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.step-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.step-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
@media (prefers-reduced-motion: reduce) {
  .step-fade-enter-active,
  .step-fade-leave-active {
    transition: none;
  }
  .step-fade-enter-from,
  .step-fade-leave-to {
    opacity: 1;
    transform: none;
  }
}
</style>
