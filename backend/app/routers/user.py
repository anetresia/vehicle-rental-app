from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.auth.security import get_current_user, require_admin
from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.schemas.user import UserResponse, UserUpdate


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# =========================
# GET MY PROFILE
# =========================
@router.get(
    "/me",
    response_model=UserResponse
)
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user


# =========================
# UPDATE MY PROFILE
# =========================
@router.patch(
    "/me",
    response_model=UserResponse
)
def update_my_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    update_data = user_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    return current_user


# =========================
# ADMIN - GET ALL CUSTOMERS
# =========================
@router.get(
    "/customers",
    response_model=list[UserResponse]
)
def get_all_customers(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    customers = db.query(User).filter(
        User.role == "customer"
    ).all()

    return customers


# =========================
# ADMIN - GET ONE CUSTOMER
# =========================
@router.get(
    "/customers/{customer_id}",
    response_model=UserResponse
)
def get_customer(
    customer_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    customer = db.query(User).filter(
        User.id == customer_id,
        User.role == "customer"
    ).first()

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )

    return customer


# =========================
# ADMIN - ACTIVATE CUSTOMER
# =========================
@router.patch(
    "/customers/{customer_id}/activate",
    response_model=UserResponse
)
def activate_customer(
    customer_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    customer = db.query(User).filter(
        User.id == customer_id,
        User.role == "customer"
    ).first()

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )

    customer.is_active = True

    db.commit()
    db.refresh(customer)

    return customer


# =========================
# ADMIN - DEACTIVATE CUSTOMER
# =========================
@router.patch(
    "/customers/{customer_id}/deactivate",
    response_model=UserResponse
)
def deactivate_customer(
    customer_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    customer = db.query(User).filter(
        User.id == customer_id,
        User.role == "customer"
    ).first()

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )

    customer.is_active = False

    db.commit()
    db.refresh(customer)

    return customer