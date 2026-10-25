<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createChart, BaselineSeries } from 'lightweight-charts'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  badge: {
    type: String,
    default: '',
  },
})

const chartContainer = ref(null)
let chart = null
let series = null
let resizeObserver = null

const badgeClass = computed(() => {
  const label = props.badge.toLowerCase()
  if (label.includes('sous')) return 'badge-success'
  if (label.includes('sur')) return 'badge-error'
  return 'badge-ghost'
})

const hasData = computed(() => Array.isArray(props.data) && props.data.length > 0)

function renderData() {
  if (!hasData.value) return
  series?.applyOptions({
    baseValue: { type: 'price', price: props.data[0]?.value ?? 0 },
  })
  series?.setData(props.data)
  chart?.timeScale().fitContent()
}

onMounted(() => {
  chart = createChart(chartContainer.value, {
    autoSize: true,
    layout: {
      background: { color: '#f8fafc' },
      textColor: '#475569',
    },
    grid: {
      vertLines: { visible: true },
      horzLines: { color: '#e2e8f0' },
    },
    rightPriceScale: { borderVisible: true },
    timeScale: { borderVisible: true },
  })

  series = chart.addSeries(BaselineSeries, {
    baseValue: { type: 'price', price: props.data[0]?.value ?? 0 },
    topLineColor: '#10b981',
    topFillColor1: 'rgba(16, 185, 129, 0.28)',
    topFillColor2: 'rgba(16, 185, 129, 0.05)',
    bottomLineColor: '#ef4444',
    bottomFillColor1: 'rgba(239, 68, 68, 0.05)',
    bottomFillColor2: 'rgba(239, 68, 68, 0.28)',
    lineWidth: 2,
  })

  renderData()

  resizeObserver = new ResizeObserver(() => chart?.timeScale().fitContent())
  resizeObserver.observe(chartContainer.value)
})

watch(() => props.data, renderData)

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chart?.remove()
})
</script>

<template>
  <section class="flex flex-col rounded-xl bg-white p-4 md:flex-1">
    <div class="mb-3 flex items-center gap-2">
      <h2 class="text-sm font-semibold text-slate-800">{{ title }}</h2>
      <span v-if="badge" class="badge badge-sm" :class="badgeClass">{{ badge }}</span>
    </div>
    <div class="relative h-64 min-h-0 md:h-auto md:flex-1">
      <div ref="chartContainer" class="h-full w-full"></div>
      <div
          v-if="loading || error || !hasData"
          class="absolute inset-0 flex items-center justify-center rounded-lg bg-white/90 px-4 text-center text-sm font-medium"
          :class="error && !loading ? 'text-red-500' : 'text-slate-500'"
      >
        <span v-if="loading" class="loading loading-spinner loading-md"></span>
        <template v-else-if="error">{{ error }}</template>
        <template v-else>Aucune donnée disponible pour le moment.</template>
      </div>
    </div>
  </section>
</template>
