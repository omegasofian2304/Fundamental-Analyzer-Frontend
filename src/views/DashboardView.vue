<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import TickerList from '@/components/TickerList.vue'
import ChartCard from '@/components/ChartCard.vue'
import { fetchTickers } from '@/services/serviceFetchTickers.js'
import { fetchHealthScore, fetchSharePrice } from '@/services/serviceFetch_data.js'

const tickers = ref([])
const tickersLoading = ref(true)

const selectedSymbol = ref(null)
const drawerOpen = ref(false)
const hasTickers = computed(() => tickers.value.length > 0)

// Each chart has its own state so one failing route doesn't hide the other chart.
function createChartState() {
  return reactive({ data: [], loading: false, error: '' })
}

const healthScore = createChartState()
const healthScoreLabel = ref('')
const sharePrice = createChartState()
let dataController = null

function selectTicker(symbol) {
  selectedSymbol.value = symbol
  drawerOpen.value = false
}

async function loadTickers() {
  tickersLoading.value = true
  try {
    tickers.value = await fetchTickers()
  } catch (error) {
    console.error('Failed to load tickers:', error)
    tickers.value = []
  } finally {
    tickersLoading.value = false
  }
  selectedSymbol.value = tickers.value[0]?.symbol ?? null
}

async function loadChart(state, symbol, signal, fetcher) {
  state.loading = true
  try {
    await fetcher()
  } catch (error) {
    if (error.name === 'AbortError') return
    console.error(`Failed to load data for ${symbol}:`, error)
    state.error = error.status === 404
        ? `Le ticker « ${symbol} » n'existe pas.`
        : 'Impossible de charger les données.'
  } finally {
    if (!signal.aborted) state.loading = false
  }
}

function loadTickerData(symbol) {
  // Cancel the previous requests so a slow response can't overwrite the current ticker's data.
  dataController?.abort()
  for (const state of [healthScore, sharePrice]) {
    state.data = []
    state.error = ''
    state.loading = false
  }
  healthScoreLabel.value = ''
  if (!symbol) return

  const controller = new AbortController()
  dataController = controller
  const { signal } = controller

  loadChart(healthScore, symbol, signal, async () => {
    const { data, label } = await fetchHealthScore(symbol, { signal })
    healthScore.data = data
    healthScoreLabel.value = label
  })
  loadChart(sharePrice, symbol, signal, async () => {
    sharePrice.data = await fetchSharePrice(symbol, { signal })
  })
}

watch(selectedSymbol, loadTickerData)
onMounted(loadTickers)
onBeforeUnmount(() => dataController?.abort())
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

      <div v-if="tickersLoading" class="flex flex-1 items-center justify-center p-4">
        <span class="loading loading-spinner loading-lg text-slate-400"></span>
      </div>
      <div v-else-if="hasTickers && selectedSymbol" class="flex flex-col gap-4 p-4 md:flex-1">
        <ChartCard
            :title="`${selectedSymbol} : health score`"
            :badge="healthScoreLabel"
            :data="healthScore.data"
            :loading="healthScore.loading"
            :error="healthScore.error"
        />
        <ChartCard
            :title="`${selectedSymbol} : share price`"
            :data="sharePrice.data"
            :loading="sharePrice.loading"
            :error="sharePrice.error"
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
