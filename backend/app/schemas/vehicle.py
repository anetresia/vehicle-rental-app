from datetime import datetime

from pydantic import BaseModel, Field


class VehicleCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    brand: str = Field(min_length=2, max_length=100)
    model: str = Field(min_length=1, max_length=100)

    manufacturing_year: int = Field(
        ge=1900,
        le=2100
    )

    registration_number: str = Field(
        min_length=2,
        max_length=50
    )

    category: str = Field(
        min_length=2,
        max_length=50
    )

    transmission: str = Field(
        min_length=2,
        max_length=20
    )

    fuel_type: str = Field(
        min_length=2,
        max_length=30
    )

    seats: int = Field(
        ge=1,
        le=100
    )

    price_per_day: float = Field(
        gt=0
    )

    image: str | None = None

    mileage: float | None = Field(
        default=None,
        ge=0
    )

    color: str = Field(
        min_length=2,
        max_length=50
    )

    is_available: bool = True
    status: str = "available"


class VehicleUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    brand: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    model: str | None = Field(
        default=None,
        min_length=1,
        max_length=100
    )

    manufacturing_year: int | None = Field(
        default=None,
        ge=1900,
        le=2100
    )

    registration_number: str | None = Field(
        default=None,
        min_length=2,
        max_length=50
    )

    category: str | None = Field(
        default=None,
        min_length=2,
        max_length=50
    )

    transmission: str | None = Field(
        default=None,
        min_length=2,
        max_length=20
    )

    fuel_type: str | None = Field(
        default=None,
        min_length=2,
        max_length=30
    )

    seats: int | None = Field(
        default=None,
        ge=1,
        le=100
    )

    price_per_day: float | None = Field(
        default=None,
        gt=0
    )

    image: str | None = None

    mileage: float | None = Field(
        default=None,
        ge=0
    )

    color: str | None = Field(
        default=None,
        min_length=2,
        max_length=50
    )

    is_available: bool | None = None
    status: str | None = None


class VehicleResponse(BaseModel):
    id: int
    name: str
    brand: str
    model: str
    manufacturing_year: int
    registration_number: str
    category: str
    transmission: str
    fuel_type: str
    seats: int
    price_per_day: float
    image: str | None
    mileage: float | None
    color: str
    is_available: bool
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }