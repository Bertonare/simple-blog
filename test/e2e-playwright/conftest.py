import pytest
from playwright.sync_api import Page
import os
from pymongo import MongoClient

@pytest.fixture(scope="session")
def base_url():
    return os.getenv("BASE_URL", "http://localhost:3000")

@pytest.fixture(scope="function")
def page(page: Page, base_url):
    page.goto(base_url)
    yield page

@pytest.fixture(scope="session", autouse=True)
def cleanup_db():
    yield
    # Cleanup after tests
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/mern-blog")
    client = MongoClient(mongo_uri)
    try:
        db = client.get_database()
        
        # Delete test users (starting with testuser or admin and followed by digits)
        result_users = db.users.delete_many({"email": {"$regex": "^(testuser|admin)\\d+@example\\.com$"}})
        print(f"\nCleaned up {result_users.deleted_count} test users.")
        
        # Delete test posts (starting with Test Post)
        result_posts = db.posts.delete_many({"title": {"$regex": "^Test Post"}})
        print(f"Cleaned up {result_posts.deleted_count} test posts.")
        
    except Exception as e:
        print(f"\nError during cleanup: {e}")
    finally:
        client.close()
