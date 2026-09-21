from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.auth.security import require_admin
from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.vehicle import Vehicle
from backend.app.schemas.vehicle import (
    VehicleCreate,
    VehicleResponse,
    VehicleUpdate,
)


router = APIRouter(
    prefix="/vehicles",
    tags=["Vehicles"]
)


# =========================
# GET ALL VEHICLES
# Search + Filter
# =========================
@router.get(
    "",
    response_model=list[VehicleResponse]
)
def get_vehicles(
    search: str | None = None,
    category: str | None = None,
    brand: str | None = None,
    transmission: str | None = None,
    fuel_type: str | None = None,
    max_price: float | None = Query(default=None, gt=0),
    available_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(Vehicle)

    if search:
        query = query.filter(
            Vehicle.name.ilike(f"%{search}%")
            | Vehicle.brand.ilike(f"%{search}%")
            | Vehicle.model.ilike(f"%{search}%")
        )

    if category:
        query = query.filter(
            Vehicle.category == category
        )

    if brand:
        query = query.filter(
            Vehicle.brand == brand
        )

    if transmission:
        query = query.filter(
            Vehicle.transmission == transmission
        )

    if fuel_type:
        query = query.filter(
            Vehicle.fuel_type == fuel_type
        )

    if max_price is not None:
        query = query.filter(
            Vehicle.price_per_day <= max_price
        )

    if available_only:
        query = query.filter(
            Vehicle.is_available.is_(True),
            Vehicle.status == "available"
        )

    return query.all()


# =========================
# GET ONE VEHICLE
# =========================
@router.get(
    "/{vehicle_id}",
    response_model=VehicleResponse
)
def get_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db)
):
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id
    ).first()

    if vehicle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )

    return vehicle


# =========================
# ADMIN - CREATE VEHICLE
# =========================
@router.post(
    "",
    response_model=VehicleResponse,
    status_code=status.HTTP_201_CREATED
)
def create_vehicle(
    vehicle_data: VehicleCreate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    existing_vehicle = db.query(Vehicle).filter(
        Vehicle.registration_number
        == vehicle_data.registration_number
    ).first()

    if existing_vehicle:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration number already exists"
        )

    new_vehicle = Vehicle(
        **vehicle_data.model_dump()
    )

    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)

    return new_vehicle


# =========================
# ADMIN - UPDATE VEHICLE
# =========================
@router.patch(
    "/{vehicle_id}",
    response_model=VehicleResponse
)
def update_vehicle(
    vehicle_id: int,
    vehicle_data: VehicleUpdate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id
    ).first()

    if vehicle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )

    update_data = vehicle_data.model_dump(
        exclude_unset=True
    )

    if "registration_number" in update_data:
        existing_vehicle = db.query(Vehicle).filter(
            Vehicle.registration_number
            == update_data["registration_number"],
            Vehicle.id != vehicle_id
        ).first()

        if existing_vehicle:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration number already exists"
            )

    for field, value in update_data.items():
        setattr(vehicle, field, value)

    db.commit()
    db.refresh(vehicle)

    return vehicle


# =========================
# ADMIN - DEACTIVATE VEHICLE
# =========================
@router.patch(
    "/{vehicle_id}/deactivate",
    response_model=VehicleResponse
)
def deactivate_vehicle(
    vehicle_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id
    ).first()

    if vehicle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )

    vehicle.is_available = False
    vehicle.status = "inactive"

    db.commit()
    db.refresh(vehicle)

    return vehicle


# =========================
# ADMIN - DELETE VEHICLE
# =========================
@router.delete(
    "/{vehicle_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_vehicle(
    vehicle_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id
    ).first()

    if vehicle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )

    db.delete(vehicle)
    db.commit()

    return None