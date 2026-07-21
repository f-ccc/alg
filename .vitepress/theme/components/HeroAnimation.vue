<template>
  <div class="hero-visual" role="img" aria-label="二分查找算法动画演示">
    <div class="hero-visual-inner">
      <!-- 数组区域 -->
      <div class="array-container">
        <div
          v-for="(val, i) in array"
          :key="i"
          class="array-cell"
          :class="{
            'cell-l': i === visual.l,
            'cell-mid': i === visual.mid,
            'cell-r': i === visual.r,
            'cell-found': i === visual.found,
            'cell-eliminated': eliminatedSet.has(i),
          }"
          :style="{ transitionDelay: `${i * 30}ms` }"
        >
          <span class="cell-value">{{ val }}</span>
          <span class="cell-label" v-if="i === visual.l">L</span>
          <span class="cell-label" v-else-if="i === visual.mid">M</span>
          <span class="cell-label" v-else-if="i === visual.r">R</span>
        </div>
      </div>

      <!-- 状态信息 -->
      <div class="hero-status">
        <div class="status-badge status-step">步骤 {{ step + 1 }}/{{ steps.length }}</div>
        <div class="status-badge status-action">{{ currentStep.action }}</div>
        <button class="hero-play-btn" @click="togglePlay" :aria-label="playing ? '暂停' : '播放'">
          <svg v-if="playing" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'

const array = [5, 8, 12, 12, 15, 18, 22, 25, 30, 35]
const target = 12

interface StepState {
  l: number
  r: number
  mid: number
  found: number
  eliminated: number[]
  action: string
}

const steps: StepState[] = [
  { l: -1, r: 10, mid: -1, found: -1, eliminated: [], action: '初始化 l=-1, r=10' },
  { l: -1, r: 10, mid: 4, found: -1, eliminated: [], action: 'mid = (l+r)/2 = 4' },
  { l: -1, r: 4, mid: 4, found: -1, eliminated: [5,6,7,8,9], action: 'a[4]=12 ≥ 12 → r=4' },
  { l: -1, r: 4, mid: 1, found: -1, eliminated: [5,6,7,8,9], action: 'mid = (l+r)/2 = 1' },
  { l: 1, r: 4, mid: 1, found: -1, eliminated: [0,5,6,7,8,9], action: 'a[1]=8 < 12 → l=1' },
  { l: 1, r: 4, mid: 2, found: -1, eliminated: [0,5,6,7,8,9], action: 'mid = (l+r)/2 = 2' },
  { l: 2, r: 4, mid: 2, found: -1, eliminated: [0,1,5,6,7,8,9], action: 'a[2]=8 < 12 → l=2' },
  { l: 2, r: 4, mid: 3, found: -1, eliminated: [0,1,5,6,7,8,9], action: 'mid = (l+r)/2 = 3' },
  { l: 2, r: 3, mid: 3, found: 3, eliminated: [0,1,4,5,6,7,8,9], action: 'a[3]=12 ≥ 12 → r=3, 找到! l+1=r → stop' },
]

const step = ref(0)
const playing = ref(true)
const visual = reactive({ l: -2, r: -2, mid: -2, found: -2 })
const eliminatedSet = ref(new Set<number>())
const currentStep = computed(() => steps[step.value])
let timer: ReturnType<typeof setInterval> | null = null

function applyStep(idx: number) {
  const s = steps[idx]
  visual.l = s.l
  visual.r = s.r
  visual.mid = s.mid
  visual.found = s.found
  eliminatedSet.value = new Set(s.eliminated)
}

function nextStep() {
  if (step.value >= steps.length - 1) {
    step.value = 0
  } else {
    step.value++
  }
  applyStep(step.value)
}

function togglePlay() {
  playing.value = !playing.value
}

function startTimer() {
  stopTimer()
  timer = setInterval(nextStep, 2200)
}
function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

watch(playing, (v) => {
  if (v) startTimer()
  else stopTimer()
})

onMounted(() => {
  applyStep(0)
  startTimer()
})
onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.hero-visual {
  width: 100%;
  padding: 40px 20px 32px;
  background: linear-gradient(135deg, var(--vp-c-bg-alt) 0%, color-mix(in srgb, var(--vp-c-brand-1) 8%, var(--vp-c-bg-alt)) 100%);
  border-bottom: 1px solid var(--vp-c-divider);
}
.hero-visual-inner {
  max-width: 780px;
  margin: 0 auto;
}
.array-container {
  display: flex;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
}
.array-cell {
  width: 56px;
  height: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--vp-border-radius);
  background: var(--vp-c-bg-elv);
  border: 2px solid var(--vp-c-border);
  font-family: var(--vp-font-family-mono);
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text);
  position: relative;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.cell-l {
  border-color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 15%, var(--vp-c-bg-elv));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--vp-c-brand-1) 30%, transparent);
}
.cell-mid {
  border-color: #eab308;
  background: color-mix(in srgb, #eab308 20%, var(--vp-c-bg-elv));
  box-shadow: 0 0 0 2px rgba(234, 179, 8, 0.3);
  transform: scale(1.08);
}
.cell-r {
  border-color: #22c55e;
  background: color-mix(in srgb, #22c55e 15%, var(--vp-c-bg-elv));
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.3);
}
.cell-found {
  border-color: #22c55e;
  background: color-mix(in srgb, #22c55e 30%, var(--vp-c-bg-elv));
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.5);
  transform: scale(1.12);
  animation: found-pulse 1s ease-in-out infinite alternate;
}
@keyframes found-pulse {
  from { box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3); }
  to { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.15); }
}
.cell-eliminated {
  opacity: 0.3;
  border-color: var(--vp-c-divider);
}
.cell-value {
  line-height: 1;
}
.cell-label {
  position: absolute;
  bottom: -20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.cell-l .cell-label { color: var(--vp-c-brand-1); }
.cell-mid .cell-label { color: #eab308; }
.cell-r .cell-label { color: #22c55e; }

.hero-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 36px;
}
.status-badge {
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}
.status-step {
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-mute);
  border: 1px solid var(--vp-c-divider);
}
.status-action {
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
}
.hero-play-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-brand-1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.hero-play-btn:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}

@media (max-width: 640px) {
  .array-cell { width: 44px; height: 52px; font-size: 14px; }
  .hero-visual { padding: 24px 12px; }
  .status-action { font-size: 11px; padding: 3px 10px; }
}
</style>
