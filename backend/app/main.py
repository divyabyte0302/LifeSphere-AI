"""LifeSphere AI-X — AI Smart Preventive Health System FastAPI Backend.

Main application entrypoint configuring CORS, exception handlers,
Firebase Admin initialization, and REST API route registration.
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.firebase_setup import initialize_firebase
from app.api import (
    health,
    environment,
    predictions,
    recommendations,
    emergency,
    users,
    appointments,
    analytics,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.debug else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("lifesphere.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager initializing external services on startup."""
    logger.info("Starting LifeSphere AI-X Backend Engine...")
    logger.info(f"Runtime Environment: {settings.environment}")
    logger.info(f"Allowed CORS Origins: {settings.allowed_origins}")
    # Initialize Firebase Admin SDK
    initialize_firebase()
    yield
    logger.info("Shutting down LifeSphere AI-X Backend Engine...")


# Initialize FastAPI application with comprehensive metadata
app = FastAPI(
    title="LifeSphere AI-X API",
    description=(
        "AI Smart Preventive Health & Environmental Intelligence System.\n\n"
        "Integrates personal health information, wearable telemetry, ambient weather, "
        "and air quality indices to model preventive risks and safe interventions."
    ),
    version="2.4.0-phase3",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure CORS restricted to configured frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handlers for consistent JSON error structures
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Format Pydantic schema validation failures into clean, structured responses."""
    errors = []
    for err in exc.errors():
        field_path = " -> ".join([str(loc) for loc in err.get("loc", [])])
        errors.append(f"{field_path}: {err.get('msg')}")

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation Error",
            "detail": "; ".join(errors),
            "code": "VALIDATION_FAILED",
        },
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch unhandled exceptions and prevent internal stack leak in API responses."""
    logger.error(f"Unhandled server error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "detail": "An unexpected server error occurred while processing the request.",
            "code": "INTERNAL_SERVER_ERROR",
        },
    )


# Root redirect / status
@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "LifeSphere AI-X FastAPI Backend",
        "status": "online",
        "documentation": "/docs",
        "version": "2.4.0-phase3",
    }


# Register API Routers
app.include_router(health.router)
app.include_router(environment.router)
app.include_router(predictions.router)
app.include_router(recommendations.router)
app.include_router(emergency.router)
app.include_router(users.router)
app.include_router(appointments.router)
app.include_router(analytics.router)

