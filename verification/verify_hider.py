
from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_hider(page: Page):
    # List of pages to verify
    pages_to_check = [
        "http://localhost:3000/aerwatch/index.htm",
        "http://localhost:3000/aeraccess/index.htm",
        "http://localhost:3000/aermeal/index.htm"
    ]

    # Define the text content we want to verify is hidden
    targets = [
        "Trusted by"
    ]

    for url in pages_to_check:
        print(f"Checking {url}...")
        try:
            # Navigate to the page
            page.goto(url)

            # Wait for the script to execute and potentially poll
            time.sleep(2)

            for target in targets:
                # Find elements containing the text
                locator = page.get_by_text(target)

                count = locator.count()
                print(f"  Found {count} elements for '{target}'")

                if count > 0:
                    # Check visibility for all found elements
                    for i in range(count):
                        element = locator.nth(i)
                        # We expect it to be hidden.
                        expect(element).to_be_hidden(timeout=2000)
                        print(f"  Verified '{target}' instance {i} is hidden.")
                else:
                    print(f"  '{target}' not found in DOM (this is acceptable if removed entirely).")

            print(f"Verified {url} successfully.")

        except Exception as e:
            print(f"Failed to verify {url}: {e}")
            page.screenshot(path=f"verification/error_{url.split('/')[-2]}.png")
            raise e

    # Take a screenshot of the last page as proof
    page.screenshot(path="verification/verification_final.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_hider(page)
            print("All pages verified successfully!")
        except Exception as e:
            print(f"Verification failed: {e}")
            exit(1)
        finally:
            browser.close()
