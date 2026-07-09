from pydantic import BaseModel


class PathologyPrediction(BaseModel):
    name: str
    probability: float
    op_point: float


class SaliencyMap(BaseModel):
    map: list[float]
    width: int
    height: int


class PredictResponse(BaseModel):
    filename: str
    size: tuple[int, int]
    predictions: list[PathologyPrediction]
    processing_time_ms: float | None = None
    saliency: SaliencyMap | None = None


class HealthResponse(BaseModel):
    status: str
    version: str
    model_loaded: bool = False
