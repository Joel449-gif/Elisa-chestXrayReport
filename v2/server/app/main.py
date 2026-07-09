import io
import os
import time
from pathlib import Path

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from PIL import Image

from .models import PredictResponse, PathologyPrediction, HealthResponse
from .inference import predict

app = FastAPI(title="ELISA V2", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="ok",
        version="2.0.0",
        model_loaded=False,
    )


@app.post("/api/predict", response_model=PredictResponse)
async def predict_endpoint(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    start = time.time()
    results = predict(image)
    elapsed = (time.time() - start) * 1000

    return PredictResponse(
        filename=file.filename or "unknown",
        size=(image.width, image.height),
        predictions=[
            PathologyPrediction(name=name, probability=prob, op_point=op)
            for name, prob, op in results
        ],
        processing_time_ms=round(elapsed, 1),
    )


if not os.environ.get("VERCEL"):
    static_dir = Path(__file__).resolve().parent.parent.parent / "client" / "dist"
    if static_dir.is_dir():
        app.mount("/", StaticFiles(directory=str(static_dir), html=True), name="static")
