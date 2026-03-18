from playwright.sync_api import sync_playwright
import os

def dump():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Mobile menu
        filepath = f"file://{os.path.abspath('index.htm')}"
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        page.goto(filepath)
        page.wait_for_timeout(1000)

        # Test "Industries" to ensure the width is fully ~500px, rather than 224px (w-56)
        page.locator('header nav button:has-text("Industries")').hover()
        page.wait_for_timeout(500)

        # take screenshot
        page.screenshot(path='verification/desktop_hover_industries_fixed_width.png')
        browser.close()

if __name__ == '__main__':
    dump()
