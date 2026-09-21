from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.auth.security import get_current_user, require_admin
from backend.app.database import get_db
from backend.app.models.booking import Booking
from backend.app.models.user import User
from backend.app.models.vehicle import Vehicle
from backend.app.schemas.booking import BookingCreate, BookingResponse

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)


# =========================
# CUSTOMER - CREATE BOOKING
# =========================
@router.post(
    "",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED
)
def create_booking(
    booking_data: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Only customers can create bookings
    if current_user.role != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only customers can create bookings"
        )

    # Check vehicle
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == booking_data.vehicle_id
    ).first()

    if vehicle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )

    # Check vehicle status
    if (
        not vehicle.is_available
        or vehicle.status != "available"
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle is not available"
        )

    # Check dates
    if booking_data.start_date >= booking_data.end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date must be after start date"
        )

    # Prevent booking past dates
    if booking_data.start_date < datetime.now(
        booking_data.start_date.tzinfo
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start date cannot be in the past"
        )

    # Check overlapping bookings
    overlapping_booking = db.query(Booking).filter(
        Booking.vehicle_id == booking_data.vehicle_id,
        Booking.status.in_(
            ["confirmed", "active"]
        ),
        Booking.start_date < booking_data.end_date,
        Booking.end_date > booking_data.start_date
    ).first()

    if overlapping_booking:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Vehicle is already booked for these dates"
        )

    # Calculate rental days
    rental_duration = (
        booking_data.end_date - booking_data.start_date
    )

    number_of_days = rental_duration.days

    if rental_duration.seconds > 0:
        number_of_days += 1

    if number_of_days < 1:
        number_of_days = 1

    # Price comes from database, not customer
    price_per_day = vehicle.price_per_day

    total_amount = (
        number_of_days * price_per_day
    )

    new_booking = Booking(
        customer_id=current_user.id,
        vehicle_id=vehicle.id,
        start_date=booking_data.start_date,
        end_date=booking_data.end_date,
        number_of_days=number_of_days,
        price_per_day=price_per_day,
        total_amount=total_amount,
        status="pending"
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return new_booking


# =========================
# CUSTOMER - MY BOOKINGS
# =========================
@router.get(
    "/my",
    response_model=list[BookingResponse]
)
def get_my_bookings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    bookings = db.query(Booking).filter(
        Booking.customer_id == current_user.id
    ).all()

    return bookings


# =========================
# CUSTOMER - MY BOOKING DETAIL
# =========================
@router.get(
    "/my/{booking_id}",
    response_model=BookingResponse
)
def get_my_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        Booking.customer_id == current_user.id
    ).first()

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    return booking


# =========================
# CUSTOMER - CANCEL BOOKING
# =========================
@router.patch(
    "/my/{booking_id}/cancel",
    response_model=BookingResponse
)
def cancel_my_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        Booking.customer_id == current_user.id
    ).first()

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    if booking.status not in [
        "pending",
        "confirmed"
    ]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This booking cannot be cancelled"
        )

    booking.status = "cancelled"

    db.commit()
    db.refresh(booking)

    return booking


# =========================
# ADMIN - GET ALL BOOKINGS
# =========================
@router.get(
    "/admin/all",
    response_model=list[BookingResponse]
)
def get_all_bookings(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return db.query(Booking).all()


# =========================
# ADMIN - GET BOOKING DETAIL
# =========================
@router.get(
    "/admin/{booking_id}",
    response_model=BookingResponse
)
def get_booking_by_admin(
    booking_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(
        Booking.id == booking_id
    ).first()

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    return booking


# =========================
# ADMIN - UPDATE BOOKING STATUS
# =========================
@router.patch(
    "/admin/{booking_id}/status",
    response_model=BookingResponse
)
def update_booking_status(
    booking_id: int,
    booking_status: str,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    allowed_statuses = [
        "pending",
        "confirmed",
        "active",
        "completed",
        "cancelled"
    ]

    booking_status = booking_status.lower()

    if booking_status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid booking status"
        )

    booking = db.query(Booking).filter(
        Booking.id == booking_id
    ).first()

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # Check overlap again before confirming
    if booking_status == "confirmed":
        overlapping_booking = db.query(Booking).filter(
            Booking.vehicle_id == booking.vehicle_id,
            Booking.id != booking.id,
            Booking.status.in_(
                ["confirmed", "active"]
            ),
            Booking.start_date < booking.end_date,
            Booking.end_date > booking.start_date
        ).first()

        if overlapping_booking:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Vehicle is already booked for these dates"
            )

    booking.status = booking_status

    db.commit()
    db.refresh(booking)

    return booking