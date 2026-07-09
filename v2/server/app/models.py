from pydantic import BaseModel


class PathologyPrediction(BaseModel):
    name: str
    probability: float
    op_point: float


class PredictResponse(BaseModel):
    filename: str
    size: tuple[int, int]
    predictions: list[PathologyPrediction]
    processing_time_ms: float | None = None


class HealthResponse(BaseModel):
    status: str
    version: str
    model_loaded: bool = False
