import { request } from '@/services/serviceFetchApi.js'

function byTime(a, b) {
  return a.time.localeCompare(b.time)
}

// Expected response: { ticker: 'AAPL', score: 72.45, label: 'sous-évalué', date: '2026-10-08' }
// An array of these objects (score history) is also accepted.
export async function fetchHealthScore(symbol, options) {
  const response = await request(`/history/${encodeURIComponent(symbol)}`, options)
  const entries = (Array.isArray(response.history) ? response.history : []).filter((entry) => entry?.date);

  const sorted = entries
      .map((entry) => ({ time: entry.date, value: Number(entry.score), label: entry.label }))
      .sort(byTime)

  return {
    data: sorted.map(({ time, value }) => ({ time, value })),
    label: sorted.at(-1)?.label ?? '',
  }
}

// Expected response: { ticker: 'AAPL', prices: [{ date: '2021-10-01', close: 142.65 }, ...] }
export async function fetchSharePrice(symbol, options) {
  const response = await request(`/price/${encodeURIComponent(symbol)}`, options)
  const prices = Array.isArray(response?.prices) ? response.prices : []

  return prices
      .map((price) => ({ time: price.date, value: Number(price.close) }))
      .sort(byTime)
}
