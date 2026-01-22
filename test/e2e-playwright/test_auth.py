from playwright.sync_api import Page, expect
import time

def test_register_and_login(page: Page):
    # Register
    page.goto("/register")
    timestamp = int(time.time())
    email = f"testuser{timestamp}@example.com"
    password = "password123"
    
    page.fill("form input[type='text']", f"TestUser{timestamp}")
    page.fill("form input[type='email']", email)
    page.fill("form input[type='password']", password)
    page.click("button[type='submit']")
    
    # Expect redirection
    page.wait_for_load_state("networkidle")
    
    # Login
    page.goto("/login")
    page.fill("form input[type='email']", email)
    page.fill("form input[type='password']", password)
    page.click("button[type='submit']")
    
    # Verify login success
    expect(page.locator("button:has-text('Logout')")).to_be_visible()

def test_login_failure(page: Page):
    page.goto("/login")
    page.fill("form input[type='email']", "wrong@example.com")
    page.fill("form input[type='password']", "wrongpassword")
    page.click("button[type='submit']")
    
    expect(page.locator("text=Invalid email or password")).to_be_visible()
