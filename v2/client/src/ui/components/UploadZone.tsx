import { useRef, useState, type ChangeEvent, type DragEvent } from "react"
import { useAppStore } from "../../store"
import { uploadAndPredict } from "../../api"

export function UploadZone() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const { upload, setUpload, addPrediction, addLog, setNotification } =
    useAppStore()

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      addLog({
        message: `Invalid file type: ${file.type}`,
        severity: "warning",
        filename: file.name,
      })
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setUpload({ status: "uploading", filename: file.name, previewUrl })
    addLog({
      message: "Uploading...",
      severity: "info",
      filename: file.name,
    })

    try {
      setUpload({ status: "processing" })
      addLog({
        message: "Sending to inference server...",
        severity: "info",
        filename: file.name,
      })
      const res = await uploadAndPredict(file)

      const pathologies = res.predictions.map((p) => ({
        name: p.name,
        probability: p.probability,
        opPoint: p.opPoint,
      }))

      addPrediction({
        id: crypto.randomUUID(),
        filename: res.filename,
        previewUrl,
        pathologies,
        rawLogits: res.predictions.map((p) => p.probability),
        timestamp: Date.now(),
      })

      setUpload({ status: "done" })
      setNotification({
        message: `Prediction complete for ${res.filename} (${res.processingTimeMs}ms)`,
        type: "success",
      })
      addLog({
        message: `Prediction complete (${res.processingTimeMs}ms)`,
        severity: "success",
        filename: res.filename,
        pathologies,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      setUpload({ status: "error", error: msg })
      setNotification({ message: msg, type: "error" })
      addLog({
        message: `Error: ${msg}`,
        severity: "error",
        filename: file.name,
      })
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const onDragOver = (e: DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const onDragLeave = () => setDragging(false)

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const isBusy = upload.status === "processing" || upload.status === "uploading"

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`w-full max-w-xl cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
          dragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]"
            : "border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-900/50"
        } ${isBusy ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <svg
            className="w-12 h-12 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <div>
            <p className="text-base font-medium text-gray-700 dark:text-gray-300">
              {isBusy ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  {upload.status === "uploading"
                    ? "Uploading..."
                    : "Processing..."}
                </span>
              ) : (
                <>
                  Drop your chest X-ray here
                  <br />
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-500">
                    or click to browse
                  </span>
                </>
              )}
            </p>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600">
            PNG, JPG, DICOM &mdash; 224&times;224 recommended
          </p>
        </div>
      </div>

      {upload.error && (
        <div className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {upload.error}
        </div>
      )}

      {upload.previewUrl && (
        <img
          src={upload.previewUrl}
          alt="Preview"
          className="max-h-64 rounded-xl shadow-lg dark:shadow-gray-900"
        />
      )}
    </div>
  )
}
