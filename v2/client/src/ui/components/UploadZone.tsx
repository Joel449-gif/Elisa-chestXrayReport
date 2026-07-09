import { useRef, type ChangeEvent } from "react"
import { useAppStore } from "../../store"
import { uploadAndPredict } from "../../api"

export function UploadZone() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { upload, setUpload, addPrediction } = useAppStore()

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return

    const previewUrl = URL.createObjectURL(file)
    setUpload({ status: "uploading", filename: file.name, previewUrl })

    try {
      setUpload({ status: "processing" })
      const res = await uploadAndPredict(file)

      addPrediction({
        id: crypto.randomUUID(),
        filename: res.filename,
        previewUrl,
        pathologies: res.predictions.map((p) => ({
          name: p.name,
          probability: p.probability,
          opPoint: p.opPoint,
        })),
        rawLogits: res.predictions.map((p) => p.probability),
        timestamp: Date.now(),
      })

      setUpload({ status: "done" })
    } catch (err) {
      setUpload({
        status: "error",
        error: err instanceof Error ? err.message : "Unknown error",
      })
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
      />

      <button
        onClick={() => inputRef.current?.click()}
        disabled={upload.status === "processing" || upload.status === "uploading"}
        className="px-6 py-3 rounded-lg bg-[#0E46A3] text-white font-semibold
                   hover:bg-[#0A3578] disabled:opacity-50 transition-colors"
      >
        {upload.status === "uploading"
          ? "Uploading..."
          : upload.status === "processing"
            ? "Processing..."
            : "Upload Chest X-Ray"}
      </button>

      {upload.error && (
        <p className="text-red-600 text-sm">Error: {upload.error}</p>
      )}

      {upload.previewUrl && (
        <img
          src={upload.previewUrl}
          alt="Preview"
          className="max-h-64 rounded shadow-md"
        />
      )}
    </div>
  )
}
