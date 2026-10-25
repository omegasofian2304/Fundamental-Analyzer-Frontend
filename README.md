# Fundamental Analyzer - Frontend

Frontend for **Fundamental Analyzer**, a Vue.js application that displays the fundamental health score of publicly listed companies alongside their stock price on an interactive dashboard.

## Tech stack

- **Framework:** Vue 3 (Composition API)
- **Routing:** Vue Router 5
- **Build:** Vite 8
- **CSS:** Tailwind CSS 3 + DaisyUI 4
- **Charts:** Lightweight Charts 5 (TradingView)

## Architecture

```
src/
├── assets/
│   └── main.css                # Tailwind imports
├── components/
│   ├── ChartCard.vue           # Reusable chart component with loading/error states
│   └── TickerList.vue          # Sidebar with search and ticker selection
├── mocks/                      # Mock data for offline development
│   ├── companies.json
│   ├── price/                  # Mock price history per ticker
│   └── score/                  # Mock score history per ticker
├── router/
│   └── index.js                # Route definitions
├── services/
│   ├── serviceFetchApi.js      # HTTP client with mock/API switching
│   ├── serviceFetchTickers.js  # Fetches the list of available tickers
│   └── serviceFetch_data.js    # Fetches health score and price data
├── stores/                     # Pinia stores (reserved)
├── utils/                      # Utility functions (reserved)
├── views/
│   └── DashboardView.vue       # Main dashboard with two charts
├── App.vue                     # Root component
└── main.js                     # App entry point
```

## Features

- Ticker sidebar with real-time search filtering
- Two synchronized charts per ticker: health score history and stock price
- Baseline chart rendering (green above baseline, red below)
- Score label badge (sous-évaluée / correctement valorisée / sur-évaluée)
- Request cancellation via AbortController when switching tickers
- Responsive layout with collapsible drawer on mobile
- Mock mode for development without a running backend

## API endpoints consumed

| Method | Endpoint             | Service                | Description                          |
|--------|----------------------|------------------------|--------------------------------------|
| GET    | `/companies`         | serviceFetchTickers.js | List available companies             |
| GET    | `/history/{ticker}`  | serviceFetch_data.js   | Get score history for a ticker       |
| GET    | `/price/{ticker}`    | serviceFetch_data.js   | Get historical price for a ticker    |

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode (with backend):
   ```bash
   npm run dev
   ```

3. Run in mock mode (no backend needed):
   ```bash
   npm run dev:mock
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Environment variables

| Variable        | Description                          | Default                 |
|-----------------|--------------------------------------|-------------------------|
| `VITE_API_URL`  | Backend API base URL                 | `http://localhost:8000`  |
| `VITE_USE_MOCK` | Use mock data instead of real API    | `false`                  |