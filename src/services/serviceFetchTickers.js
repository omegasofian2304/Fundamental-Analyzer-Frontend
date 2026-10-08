import { request } from '@/services/serviceFetchApi.js'

// Expected response: [{ ticker: 'AAPL', name: 'Apple Inc.' }, ...]
export async function fetchTickers(options) {
  const companies = await request('/companies', options)
  if (!Array.isArray(companies)) return []

  return companies
      .map((company) => ({ symbol: company.ticker, name: company.name }))
      .filter((company) => company.symbol)
}
