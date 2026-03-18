from playwright.sync_api import sync_playwright
import os

def test_animations():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Test desktop
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        filepath = f"file://{os.path.abspath('index.htm')}"
        page.goto(filepath)

        solutions_btn = page.locator('header nav button:has-text("Solutions")')
        solutions_btn.wait_for(state='visible')

        print("Testing desktop hover...")
        solutions_btn.hover()
        page.wait_for_timeout(300) # wait for open animation
        page.screenshot(path="verification/desktop_hover_anim.png")

        # Test mobile
        mobile_page = browser.new_page(viewport={'width': 375, 'height': 667})
        mobile_page.goto(filepath)

        # We need to find the correct hamburger menu icon
        menu_btn = mobile_page.locator('svg.lucide-menu').locator('..')

        print("Testing mobile menu open...")
        menu_btn.click()
        mobile_page.wait_for_timeout(300) # wait for open
        mobile_page.screenshot(path="verification/mobile_menu_full.png")

        # Test sub-menu
        mobile_page.locator('#mobile-menu-sheet button:has-text("Industries")').click()
        mobile_page.wait_for_timeout(300)
        mobile_page.screenshot(path="verification/mobile_menu_sub.png")

        browser.close()

if __name__ == '__main__':
    test_animations()
