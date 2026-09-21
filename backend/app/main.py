from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routers import auth, user, vehicle, booking


app = FastAPI(
    title="Vehicle Rental Management API",
    version="1.0.0"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routers
app.include_router(
    auth.router,
    prefix="/api"
)

app.include_router(
    user.router,
    prefix="/api"
)

app.include_router(
    vehicle.router,
    prefix="/api"
)

app.include_router(
    booking.router,
    prefix="/api"
)


@app.get("/")
def root():
    return {
        "message": "Vehicle Rental Management API is running"
    }