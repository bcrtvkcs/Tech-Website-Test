from playwright.sync_api import sync_playwright
import os

def test_animations():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Test desktop
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        filepath = f"file://{os.path.abspath('index.htm')}"
        page.goto(filepath)

        solutions_btn = page.locator('nav li > button:has-text("Solutions")')
        solutions_btn.wait_for(state='visible')
        parent_li = solutions_btn.locator('..')

        print("Testing desktop hover...")
        parent_li.hover()
        page.wait_for_timeout(50) # wait for open animation
        page.screenshot(path="verification/desktop_hover_anim_reverted.png")

        # Test mobile
        mobile_page = browser.new_page(viewport={'width': 375, 'height': 667})
        mobile_page.goto(filepath)

        menu_btn = mobile_page.locator('.lg\\:hidden button').first
        menu_btn.wait_for(state='visible')

        print("Testing mobile menu open...")
        menu_btn.click()
        mobile_page.wait_for_timeout(150) # wait for halfway open (staggered items)
        mobile_page.screenshot(path="verification/mobile_menu_halfway_reverted.png")

        mobile_page.wait_for_timeout(500) # wait for fully open
        mobile_page.screenshot(path="verification/mobile_menu_full_reverted.png")

        browser.close()

if __name__ == '__main__':
    test_animations()
