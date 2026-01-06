
(function() {
    function animateTextReveal() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Skip empty/whitespace-only nodes
                    if (!node.nodeValue.trim()) return NodeFilter.FILTER_SKIP;

                    // Skip specific parents
                    const parentTag = node.parentNode.tagName;
                    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SVG', 'CODE'].includes(parentTag)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        const nodesToReplace = [];
        let node;
        while (node = walker.nextNode()) {
            nodesToReplace.push(node);
        }

        const allSpans = [];

        nodesToReplace.forEach(textNode => {
            const text = textNode.nodeValue;
            const fragment = document.createDocumentFragment();

            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const span = document.createElement('span');
                span.textContent = char;
                span.style.opacity = '0';
                span.style.transition = 'opacity 0.3s ease';
                // Ensure span doesn't break layout unexpectedly,
                // though splitting text into spans can affect line breaks slightly depending on font rendering.
                // Usually inline is fine.

                fragment.appendChild(span);
                allSpans.push(span);
            }

            textNode.parentNode.replaceChild(fragment, textNode);
        });

        // Remove the loading state to allow elements to take up space (if display was none)
        // In our case, color was transparent. Removing class restores color inheritance.
        // But spans are opacity 0, so text remains invisible.
        document.documentElement.classList.remove('loading-state');

        // Trigger Animations
        allSpans.forEach(span => {
            // Random delay between 0 and 500ms
            const delay = Math.random() * 500;
            setTimeout(() => {
                span.style.opacity = '1';
            }, delay);
        });
    }

    // Wait for window load to ensure initial translation scripts (if any) have finished.
    if (document.readyState === 'complete') {
        animateTextReveal();
    } else {
        window.addEventListener('load', animateTextReveal);
    }
})();
