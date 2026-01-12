
from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_hider(page: Page):
    # Navigate to the page
    page.goto("http://localhost:3000/index.htm")

    # Wait for the script to execute and potentially poll
    # My script runs immediately on load, then polling.
    # Let's wait a bit to be sure.
    time.sleep(2)

    # Define the text content we want to verify is hidden
    targets = [
        "Trusted by",
        "Aeronix trusted partners",
        "Real Stories, Real Impact"
    ]

    for target in targets:
        # Find elements containing the text
        # We need to be careful. The text node itself isn't an element we can easily check visibility of in Playwright
        # without selecting the parent element.
        # Let's use get_by_text.
        locator = page.get_by_text(target)

        # We expect it to be hidden.
        # Note: If there are multiple matches (e.g. hidden and visible), this might be tricky.
        # But we expect ALL instances on the main page to be hidden by my script if I did it right?
        # Actually my script iterates all text nodes.

        count = locator.count()
        print(f"Found {count} elements for '{target}'")

        if count > 0:
            # Check if at least one is visible? No, we want ALL to be hidden.
            # However, Playwright's get_by_text might match hidden elements too.
            # We want to assert that NO visible element with this text exists.

            # Let's iterate and check visibility
            for i in range(count):
                element = locator.nth(i)
                # We expect it to be hidden.
                # Note: `to_be_hidden()` passes if the element is not in the DOM or has display:none/visibility:hidden.
                expect(element).to_be_hidden(timeout=1000)
                print(f"Verified '{target}' instance {i} is hidden.")
        else:
            print(f"'{target}' not found in DOM (which is also good if removed entirely, though we only hid it).")

    # Take a full page screenshot to visually confirm
    # Scroll a bit to trigger any lazy loading if relevant, though we are checking static text presence.
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    time.sleep(1)
    page.evaluate("window.scrollTo(0, 0)")
    time.sleep(1)

    page.screenshot(path="verification/verification.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_hider(page)
            print("Verification successful!")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
