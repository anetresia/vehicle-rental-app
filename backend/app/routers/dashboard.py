from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.auth.security import require_admin
from backend.app.database import get_db
from backend.app.models.booking import Booking
from backend.app.models.user import User
from backend.app.models.vehicle import Vehicle


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


# =========================
# ADMIN - DASHBOARD STATS
# =========================
@router.get("/stats")
def get_dashboard_stats(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    total_customers = db.query(User).filter(
        User.role == "customer"
    ).count()

    total_vehicles = db.query(Vehicle).count()

    available_vehicles = db.query(Vehicle).filter(
        Vehicle.is_available.is_(True),
        Vehicle.status == "available"
    ).count()

    total_bookings = db.query(Booking).count()

    pending_bookings = db.query(Booking).filter(
        Booking.status == "pending"
    ).count()

    confirmed_bookings = db.query(Booking).filter(
        Booking.status == "confirmed"
    ).count()

    active_bookings = db.query(Booking).filter(
        Booking.status == "active"
    ).count()

    completed_bookings = db.query(Booking).filter(
        Booking.status == "completed"
    ).count()

    cancelled_bookings = db.query(Booking).filter(
        Booking.status == "cancelled"
    ).count()

    total_revenue = db.query(
        func.sum(Booking.total_amount)
    ).filter(
        Booking.status == "completed"
    ).scalar()

    return {
        "total_customers": total_customers,
        "total_vehicles": total_vehicles,
        "available_vehicles": available_vehicles,
        "total_bookings": total_bookings,
        "pending_bookings": pending_bookings,
        "confirmed_bookings": confirmed_bookings,
        "active_bookings": active_bookings,
        "completed_bookings": completed_bookings,
        "cancelled_bookings": cancelled_bookings,
        "total_revenue": total_revenue or 0
    }