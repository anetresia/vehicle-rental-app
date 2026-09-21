from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    brand: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    model: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    manufacturing_year: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    registration_number: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    category: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    transmission: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    fuel_type: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    seats: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    price_per_day: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    image: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    mileage: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    color: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    is_available: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="available",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    bookings = relationship(
        "Booking",
        back_populates="vehicle",
    )