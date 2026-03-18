from playwright.sync_api import sync_playwright
import os

def test_hover():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        filepath = f"file://{os.path.abspath('index.htm')}"
        page.goto(filepath)

        # Wait for the desktop "Solutions" menu button
        solutions_btn = page.locator('nav li > button:has-text("Solutions")')
        solutions_btn.wait_for(state='visible')

        parent_li = solutions_btn.locator('..')
        dropdown = parent_li.locator('div.absolute')

        # Initial state: hidden
        print(f"Initially visible: {dropdown.is_visible()}")

        # Hover
        parent_li.hover()
        page.wait_for_timeout(200) # wait for js
        print(f"After hover visible: {dropdown.is_visible()}")
        page.screenshot(path="verification/hover_open.png")

        # Move away
        page.mouse.move(0, 0)
        page.wait_for_timeout(300) # wait for timeout + a bit
        print(f"After mouse leave visible: {dropdown.is_visible()}")
        page.screenshot(path="verification/hover_closed.png")

        browser.close()

if __name__ == '__main__':
    test_hover()
