"""Database initialization script"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from app.core.database import engine, Base
from app.models import (
    StudentLearningProfile,
    LearningResource,
    StudentStruggle,
    ResourceRecommendation,
    StudentBehaviorTracking
)


def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    print(f"Database URL: {engine.url}")
    
    try:
        Base.metadata.create_all(bind=engine)
        print("SUCCESS: All tables created successfully!")
        print("\nTables created:")
        print("  - student_learning_profiles")
        print("  - learning_resources")
        print("  - student_struggles")
        print("  - resource_recommendations")
        print("  - student_behavior_tracking")
    except Exception as e:
        print(f"ERROR: Failed to create tables: {e}")
        sys.exit(1)


def drop_tables():
    """Drop all database tables"""
    print("WARNING: This will delete ALL data!")
    confirm = input("Are you sure you want to drop all tables? (yes/no): ")
    
    if confirm.lower() == "yes":
        print("Dropping all tables...")
        try:
            Base.metadata.drop_all(bind=engine)
            print("SUCCESS: All tables dropped successfully!")
        except Exception as e:
            print(f"ERROR: Failed to drop tables: {e}")
            sys.exit(1)
    else:
        print("Operation cancelled.")


def reset_database():
    """Drop and recreate all tables"""
    print("RESETTING DATABASE...")
    print("This will delete ALL data and recreate tables.")
    confirm = input("Are you sure? (yes/no): ")
    
    if confirm.lower() == "yes":
        print("\nStep 1: Dropping tables...")
        try:
            Base.metadata.drop_all(bind=engine)
            print("  Tables dropped successfully!")
        except Exception as e:
            print(f"  ERROR: {e}")
            sys.exit(1)
        
        print("\nStep 2: Creating tables...")
        try:
            Base.metadata.create_all(bind=engine)
            print("  Tables created successfully!")
        except Exception as e:
            print(f"  ERROR: {e}")
            sys.exit(1)
        
        print("\nSUCCESS: Database reset complete!")
        print("\nNext steps:")
        print("  1. Run 'python scripts/generate_sample_data.py' to populate with sample data")
        print("  2. Start the API server: 'uvicorn app.main:app --reload --port 8005'")
    else:
        print("Operation cancelled.")


if __name__ == "__main__":
    print("=" * 60)
    print("  EduMind - Learning Style Service")
    print("  Database Initialization")
    print("=" * 60)
    print()
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "create":
            create_tables()
        elif command == "drop":
            drop_tables()
        elif command == "reset":
            reset_database()
        else:
            print(f"Unknown command: {command}")
            print("Usage: python init_db.py [create|drop|reset]")
    else:
        print("Usage: python init_db.py [create|drop|reset]")
        print()
        print("Commands:")
        print("  create - Create all database tables")
        print("  drop   - Drop all database tables")
        print("  reset  - Drop and recreate all tables (careful!)")













