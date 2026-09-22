# User model import pannrom
from backend.app.models.user import User

# Booking model import pannrom
# SQLAlchemy relationship properly load aaga idhu thevai
from backend.app.models.booking import Booking

# Vehicle model import pannrom
from backend.app.models.vehicle import Vehicle

# Database session import pannrom
from backend.app.database import SessionLocal

# Password hash panna function import pannrom
from backend.app.auth.security import hash_password


def create_admin():
    # Database connection/session create pannrom
    db = SessionLocal()

    try:
        # Already admin account irukka-nu check pannrom
        existing_admin = db.query(User).filter(
            User.email == "admin@gmail.com"
        ).first()

        # Already irundha duplicate admin create panna maatom
        if existing_admin:
            print("Admin already exists!")
            return

        # New admin user create pannrom
        admin = User(
            full_name="Admin User",
            email="admin@gmail.com",
            phone="0771234567",
            hashed_password=hash_password("admin123"),
            role="admin",
            is_active=True,
        )

        # Admin-ai database session-kku add pannrom
        db.add(admin)

        # Database-la save pannrom
        db.commit()

        # Created admin details refresh pannrom
        db.refresh(admin)

        print("================================")
        print("Admin created successfully!")
        print("Email: admin@gmail.com")
        print("Password: admin123")
        print("Role: admin")
        print("================================")

    except Exception as error:
        # Error vandha changes rollback pannrom
        db.rollback()
        print("Error creating admin:")
        print(error)

    finally:
        # Database connection close pannrom
        db.close()


if __name__ == "__main__":
    create_admin()