<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  tickers: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const search = ref('')

const filteredTickers = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return props.tickers

  return props.tickers.filter(
      (ticker) =>
          ticker.symbol.toLowerCase().includes(query)

  )
})

function selectTicker(symbol) {
  emit('update:modelValue', symbol)
}

function formatChange(changePercent) {
  const sign = changePercent > 0 ? '+' : ''
  return `${sign}${changePercent.toFixed(2)}%`
}
</script>

<template>
  <aside class="flex h-full w-64 flex-col gap-2 rounded-xl bg-slate-800 p-3">
    <label class="flex items-center gap-2 rounded-full bg-slate-700/60 px-3 py-2 text-sm text-slate-300">
      <span class="h-3 w-3 rounded-full border border-slate-400"></span>
      <input
          v-model="search"
          type="text"
          placeholder="Rechercher un ticker..."
          class="w-full bg-transparent text-slate-100 placeholder-slate-400 outline-none"
      />
    </label>

    <ul class="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
      <li v-for="ticker in filteredTickers" :key="ticker.symbol">
        <button
            type="button"
            class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors"
            :class="ticker.symbol === modelValue ? 'bg-slate-100 text-slate-900' : 'text-slate-100 hover:bg-slate-700/60'"
            @click="selectTicker(ticker.symbol)"
        >
          <span>
            <span class="block text-sm font-semibold">{{ ticker.symbol }}</span>
          </span>
          <span
              class="text-sm font-medium"
              :class="ticker.changePercent >= 0 ? 'text-emerald-500' : 'text-red-500'"
          >
            {{ formatChange(ticker.changePercent) }}
          </span>
        </button>
      </li>
    </ul>
  </aside>
</template>
