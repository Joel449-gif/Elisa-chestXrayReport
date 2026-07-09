const BASE_URL = import.meta.env.VITE_API_URL ?? "/api"

export interface PredictResponse {
  filename: string
  size: [number, number]
  predictions: Array<{
    name: string
    probability: number
    opPoint: number
  }>
  processingTimeMs?: number
}

export async function uploadAndPredict(
  file: File,
  signal?: AbortSignal,
): Promise<PredictResponse> {
  const form = new FormData()
  form.append("file", file)

  const res = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    body: form,
    signal,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.detail ?? `Prediction failed: ${res.statusText}`)
  }

  return res.json()
}

export async function healthCheck(): Promise<{ status: string; version: string }> {
  const res = await fetch(`${BASE_URL}/health`)
  if (!res.ok) throw new Error("API unreachable")
  return res.json()
}
