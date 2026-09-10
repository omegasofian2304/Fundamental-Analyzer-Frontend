<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createChart, BaselineSeries } from 'lightweight-charts'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
})

const chartContainer = ref(null)
let chart = null
let series = null
let resizeObserver = null

function renderData() {
  series?.applyOptions({
    baseValue: { type: 'price', price: props.data[0]?.value ?? 0 },
  })
  series?.setData(props.data)
  chart?.timeScale().fitContent()
}

onMounted(() => {
  chart = createChart(chartContainer.value, {
    autoSize: false,
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
  <section class="flex flex-1 flex-col rounded-xl bg-white p-4">
    <h2 class="mb-3 text-sm font-semibold text-slate-800">{{ title }}</h2>
    <div ref="chartContainer" class="min-h-0 flex-1"></div>
  </section>
</template>
