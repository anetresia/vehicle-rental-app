from datetime import datetime

from pydantic import BaseModel


class BookingCreate(BaseModel):
    vehicle_id: int
    start_date: datetime
    end_date: datetime


class BookingUpdate(BaseModel):
    status: str | None = None


class BookingResponse(BaseModel):
    id: int
    customer_id: int
    vehicle_id: int
    start_date: datetime
    end_date: datetime
    number_of_days: int
    price_per_day: float
    total_amount: float
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }