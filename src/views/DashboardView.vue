<script setup>
import { computed, ref } from 'vue'
import TickerList from '@/components/TickerList.vue'
import ChartCard from '@/components/ChartCard.vue'

const tickers = ref([
  { symbol: 'AAPL', changePercent: 1.24 },
  { symbol: 'TSLA', changePercent: -2.10 },
  { symbol: 'MSFT', changePercent: 0.58 },
  { symbol: 'GOOGL', changePercent: 0.92 },
  { symbol: 'AMZN', changePercent: -0.34 },
  { symbol: 'NVDA', changePercent: 3.47 },
  { symbol: 'BLAQ', changePercent: 3.37 },
  { symbol: 'POLF', changePercent: 3.67 },
  { symbol: 'HAKK', changePercent: 8.47 },
  { symbol: 'MALO', changePercent: -3.47 },
  { symbol: 'KAID', changePercent: 6.47 },
  { symbol: 'IKII', changePercent: 3.47 },
  { symbol: 'GIBA', changePercent: 0.47 },

])

const selectedSymbol = ref(tickers.value[0].symbol)

// TODO: replace with real data from serviceFetchFinnhub.js once it's implemented.
function mockSeries(symbol, base) {
  let seed = [...symbol].reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  let value = base
  const today = new Date()

  return Array.from({ length: 30 }, (_, i) => {
    value += (random() - 0.5) * base * 0.05
    const date = new Date(today)
    date.setDate(date.getDate() - (29 - i))
    return { time: date.toISOString().slice(0, 10), value: Number(value.toFixed(2)) }
  })
}

const healthScoreData = computed(() => mockSeries(`${selectedSymbol.value}-score`, 70))
const sharePriceData = computed(() => mockSeries(`${selectedSymbol.value}-price`, 180))
</script>

<template>
  <div class="flex h-screen gap-4 bg-slate-900 p-4">
    <TickerList v-model="selectedSymbol" :tickers="tickers" />

    <div class="flex flex-1 flex-col gap-4">
      <ChartCard
          :title="`${selectedSymbol} : health score`"
          :data="healthScoreData"
      />
      <ChartCard
          :title="`${selectedSymbol} : share price`"
          :data="sharePriceData"
      />
    </div>
  </div>
</template>
