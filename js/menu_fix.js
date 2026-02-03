// Menu Fix for Aeronix Website
// Prevents menu headers from wrapping (especially "Ana Sayfa" in Turkish)
// Applies white-space: nowrap to menu items that are NOT paragraphs.

(function() {
    console.log("Menu Fix Init");

    // 1. Inject CSS for Desktop Menu (Top Level Only)
    // We strictly target the top-level navigation items to avoid affecting mega-menu content (paragraphs)
    const style = document.createElement('style');
    style.innerHTML = `
        /* Desktop Top Level Navigation Items */
        [data-slot="navigation-menu-list"] > [data-slot="navigation-menu-item"] > [data-slot="navigation-menu-link"],
        [data-slot="navigation-menu-list"] > [data-slot="navigation-menu-item"] > [data-slot="navigation-menu-trigger"] {
            white-space: nowrap !important;
            width: auto !important;
            min-width: max-content !important;
        }
    `;
    document.head.appendChild(style);

    // 2. Mobile Menu Handling (MutationObserver)
    // The mobile menu is likely a Dialog/Sheet that gets inserted into the DOM when clicked.
    // We watch for its appearance and apply styles to its links/buttons, excluding those with paragraphs.

    function fixMobileMenuElements(container) {
        // Find all links and buttons that might be menu items
        // We broadly select a and button to catch all potential nav items
        const elements = container.querySelectorAll('a, button');

        elements.forEach(el => {
            // EXCLUSION: Do not touch items containing paragraphs (user requirement)
            if (el.querySelector('p')) {
                return;
            }

            // HEURISTIC: Ensure it looks like a menu item
            // Most menu items have text content.
            if (!el.textContent.trim()) return;

            // Apply style to force single line
            el.style.whiteSpace = 'nowrap';

            // Optional: prevent flex-col from forcing wrapping if width is constrained
            // el.style.flexDirection = 'row'; // Risky if layout depends on col
        });
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType !== 1) return; // Skip non-element nodes

                // Check for common Mobile Menu / Dialog attributes
                // Radix UI often uses role="dialog" or data-state="open"
                const isDialog = node.getAttribute('role') === 'dialog';
                const hasDialog = node.querySelector('[role="dialog"]');
                const isSheet = node.getAttribute('data-slot') === 'sheet-content';
                const hasSheet = node.querySelector('[data-slot="sheet-content"]');

                if (isDialog || hasDialog || isSheet || hasSheet) {
                    // It's a dialog/menu! Fix its elements.
                    fixMobileMenuElements(node);

                    // Also observe the node specifically in case content loads lazily inside it
                    // (Optional, but good for robustness)
                }
            });
        });
    });

    // Observe body for added dialogs/sheets
    observer.observe(document.body, { childList: true, subtree: true });

})();
