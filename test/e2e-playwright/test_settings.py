from playwright.sync_api import Page, expect

def test_dark_mode_toggle(page: Page):
    page.goto("/")
    
    # Check initial state (assuming light or system, but we check toggle behavior)
    # next-themes usually adds class="dark" to html element
    
    # Find toggle button
    toggle_btn = page.locator("button[aria-label='Toggle Theme']")
    
    # Click to toggle
    toggle_btn.click()
    
    # Verify dark class appears on html
    # We might need to check if it was already dark?
    # Usually defaults to system. If system is light, clicking -> dark.
    # Let's check if 'dark' class is present on html.
    
    # Wait for attribute change
    # expect(page.locator("html")).to_have_class(re.compile(r"dark")) 
    # But checking if class contains 'dark'
    
    # Simple check: verify functionality by toggling and checking change
    # Note: next-themes might take a moment or depend on system preference.
    # We can force a state or just check that clicking it changes something.
    
    # Let's assume default is light or we can see the icon change?
    # Icon checking: FaMoon vs FaSun.
    # If light (default for many), shows Moon (to switch to dark).
    # If dark, shows Sun.
    
    # Let's relying on HTML class which is robust for next-themes
    
    # Get initial class
    html = page.locator("html")
    initial_class = html.get_attribute("class") or ""
    
    toggle_btn.click()
    
    # Expect class to change
    expect(html).not_to_have_attribute("class", initial_class)
    
    # Specific check: if it was empty/light, now should have dark.
    if "dark" not in initial_class:
        expect(html).to_have_class("dark")
    else:
        expect(html).not_to_have_class("dark")

def test_language_translation(page: Page):
    page.goto("/")
    
    # Default is likely EN check "Home" in navbar or "Latest Posts" if translated (but page.js is hardcoded)
    # Navbar uses translation. Let's check Navbar "Home".
    expect(page.locator("nav >> text=Home")).to_be_visible()
    
    # Find Language Toggle
    # It has text EN/ID
    lang_toggle = page.locator("button:has-text('EN')") # The toggle button container
    
    lang_toggle.click()
    
    # Expect text to change to ID "Beranda"
    expect(page.locator("nav >> text=Beranda")).to_be_visible()
    expect(page.locator("nav >> text=Home")).not_to_be_visible()
    
    # Toggle back
    lang_toggle.click()
    expect(page.locator("nav >> text=Home")).to_be_visible()
