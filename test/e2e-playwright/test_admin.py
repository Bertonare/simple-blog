from playwright.sync_api import Page, expect
import time
import subprocess
import os
import re

def test_admin_create_and_delete_post(page: Page):
    # 1. Register a new user
    page.goto("/register")
    timestamp = int(time.time())
    username = f"AdminUser{timestamp}"
    email = f"admin{timestamp}@example.com"
    password = "password123"
    
    page.fill("form input[type='text']", username)
    page.fill("form input[type='email']", email)
    page.fill("form input[type='password']", password)
    page.click("button[type='submit']")
    
    # Wait for navigation to home (auto-login after register)
    page.wait_for_url("**/")
    
    # Logout so we can login again after promotion (or just to be clean)
    page.click("button:has-text('Logout')")
    page.wait_for_url("**/login")

    # 2. Promote user to admin using the script
    project_root = os.path.abspath(os.path.join(os.getcwd(), "..", ".."))
    script_path = os.path.join(project_root, "server", "scripts", "admin_tools.js")
    
    # Run the promotion command
    result = subprocess.run(
        ["node", script_path, "promote", email],
        capture_output=True,
        text=True,
        cwd=project_root 
    )
    
    assert result.returncode == 0, f"Failed to promote user: {result.stderr}"
    assert f"User {email} is now an admin" in result.stdout

    # 3. Login as the new admin
    page.goto("/login")
    page.fill("form input[type='email']", email)
    page.fill("form input[type='password']", password)
    page.click("button[type='submit']")
    
    # Verify we see the Admin Dashboard link and click it
    expect(page.locator("a[href='/admin']")).to_be_visible()
    
    # Go to Admin Dashboard
    page.click("a[href='/admin']")
    expect(page).to_have_url(re.compile(r"/admin$"))
    
    # 4. Create a new post
    page.click("a[href='/admin/post/new']")
    
    post_title = f"Test Post {timestamp}"
    post_content = "This is a test post content created by Playwright."
    
    # Title
    page.locator("form input[type='text']").nth(0).fill(post_title)
    # Categories (3rd text input: Title, Slug, Categories)
    page.locator("form input[type='text']").nth(2).fill("Tech")
    
    # Content (Quill editor)
    page.locator(".ql-editor").fill(post_content)
    
    page.click("button[type='submit']")
    
    # 5. Verify post appears in Admin Dashboard
    page.wait_for_url(re.compile(r"/admin$"))
    expect(page.locator(f"text={post_title}")).to_be_visible()
    
    # 6. Delete the post
    post_item = page.locator("li", has_text=post_title)
    
    # Set up dialog handler for the confirmation alert
    page.on("dialog", lambda dialog: dialog.accept())
    
    post_item.locator("button", has_text="Delete").click()
    
    # 7. Verify post is gone
    expect(post_item).not_to_be_visible()
