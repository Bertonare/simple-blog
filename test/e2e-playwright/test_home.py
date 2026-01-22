from playwright.sync_api import Page, expect

def test_home_page_loads(page: Page):
    expect(page).to_have_title("BlogSpace")
    expect(page.locator("text=Simple Space")).to_be_visible()
    expect(page.locator("text=Latest Posts")).to_be_visible()
