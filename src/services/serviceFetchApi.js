// Server address only: the routes (/companies, /score/AAPL, /price/AAPL) are added by the services.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// Mock responses: '/score/AAPL' is answered by src/mocks/score/AAPL.json
const mockFiles = import.meta.glob('../mocks/**/*.json', { import: 'default' })

function httpError(status) {
  const error = new Error(`Request failed with status ${status}`)
  error.status = status
  return error
}

async function mockRequest(path, { signal } = {}) {
  // Small delay so the loading states are visible.
  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, 50)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
  const loadFile = mockFiles[`../mocks${decodeURIComponent(path)}.json`]
  if (!loadFile) throw httpError(404)
  return structuredClone(await loadFile())
}

export async function request(path, options = {}) {
  if (USE_MOCK) return mockRequest(path, options)

  const response = await fetch(`${API_BASE_URL}${path}`, options)
  if (!response.ok) throw httpError(response.status)
  return response.json()
}
