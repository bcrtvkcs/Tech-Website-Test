// Mobile Menu Patch for Aeronix Website
// Adds missing 'About' link to the mobile menu by cloning the 'Contact' link.

(function() {
    console.log("Mobile Menu Patch Init");

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType !== 1) return;

                // Check for Mobile Menu Sheet/Dialog
                // Radix UI often uses role="dialog" or distinct attributes
                if (node.getAttribute('role') === 'dialog' ||
                    node.querySelector('[role="dialog"]') ||
                    node.getAttribute('data-slot') === 'sheet-content' ||
                    node.classList.contains('fixed') // Fallback heuristic for modal overlays
                ) {
                     patchMobileMenu(node);

                     // Also observe the dialog itself for child additions (content hydration)
                     const innerObserver = new MutationObserver(() => patchMobileMenu(node));
                     innerObserver.observe(node, { childList: true, subtree: true });
                }
            });
        });
    });

    function patchMobileMenu(container) {
        // Find the Contact link to clone
        // Search deeply in the container
        const allLinks = Array.from(container.querySelectorAll('a'));
        const contactLink = allLinks.find(el => {
            const href = el.getAttribute('href');
            return href && href.includes('contact');
        });

        if (contactLink) {
            // Check if About already exists to prevent duplicates
            const aboutExists = allLinks.some(el => {
                const href = el.getAttribute('href');
                return href && href.includes('about');
            });

            if (!aboutExists) {
                console.log("Found Contact link, inserting About link...");

                // Determine if we should clone the link or its parent (LI)
                let elementToClone = contactLink;
                let insertTarget = contactLink;
                let containerParent = contactLink.parentElement;

                // Heuristic: Check if wrapped in LI or a DIV acting as item
                if (containerParent.tagName === 'LI' ||
                    (containerParent.tagName === 'DIV' && containerParent.classList.contains('relative'))) {
                    elementToClone = containerParent;
                    insertTarget = containerParent;
                    containerParent = containerParent.parentElement;
                }

                const newElement = elementToClone.cloneNode(true);

                // Find the anchor inside the cloned element (or it is the element itself)
                const newLink = newElement.tagName === 'A' ? newElement : newElement.querySelector('a');

                if (newLink) {
                    // Update Href
                    const originalHref = contactLink.getAttribute('href');
                    if (originalHref) {
                        const newHref = originalHref.replace('contact', 'about');
                        newLink.setAttribute('href', newHref);
                    }

                    // Update Text
                    // Check if there is a button inside or specific structure
                    // We want to preserve styling
                    const innerBtn = newLink.querySelector('button');
                    if (innerBtn) {
                        innerBtn.textContent = "About";
                    } else {
                        // If no button, assuming text is directly in 'a' or in a span
                        // If we just set textContent, we might lose icons/spans if they existed (though Contact usually doesn't have icon here)
                        newLink.textContent = "About";
                    }

                    // Insert after Contact
                    if (containerParent && insertTarget) {
                        containerParent.insertBefore(newElement, insertTarget.nextSibling);
                    }
                }
            }
        }
    }

    // Start observing
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
             observer.observe(document.body, { childList: true, subtree: true });
        });
    }

})();
