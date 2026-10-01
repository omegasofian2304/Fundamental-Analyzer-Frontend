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

const selectedSymbol = ref(tickers.value[0]?.symbol ?? null)
const drawerOpen = ref(false)
const hasTickers = computed(() => tickers.value.length > 0)

function selectTicker(symbol) {
  selectedSymbol.value = symbol
  drawerOpen.value = false
}

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

const healthScoreData = computed(() =>
    selectedSymbol.value ? mockSeries(`${selectedSymbol.value}-score`, 70) : []
)
const sharePriceData = computed(() =>
    selectedSymbol.value ? mockSeries(`${selectedSymbol.value}-price`, 180) : []
)
</script>

<template>
  <div class="drawer md:drawer-open bg-slate-900">
    <input id="ticker-drawer" v-model="drawerOpen" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content flex min-h-screen flex-col">
      <div class="navbar gap-2 bg-slate-900 px-4 md:hidden">
        <label for="ticker-drawer" aria-label="Ouvrir la liste des tickers" class="btn btn-square btn-ghost text-slate-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>
        <span class="text-lg font-semibold text-slate-100">{{ selectedSymbol }}</span>
      </div>

      <div class="flex flex-col gap-4 p-4 md:flex-1">
        <ChartCard
            :title="`${selectedSymbol} : health score`"
            :data="healthScoreData"
        />
        <ChartCard
            :title="`${selectedSymbol} : share price`"
            :data="sharePriceData"
        />
      </div>
      <div v-else class="flex flex-1 items-center justify-center p-4">
        <p class="text-center text-sm font-medium text-slate-400">
          Aucun ticker disponible. Impossible de charger les données.
        </p>
      </div>
    </div>

    <div class="drawer-side z-20">
      <label for="ticker-drawer" aria-label="Fermer la liste des tickers" class="drawer-overlay"></label>
      <TickerList
          :model-value="selectedSymbol"
          :tickers="tickers"
          class="w-72 md:my-4 md:ml-4 md:w-64"
          @update:model-value="selectTicker"
      />
    </div>
  </div>
</template>
