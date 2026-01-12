// Section Hider for Aeronix Website
// Hides specific sections ("Trusted by", "Partners", "Real Stories") that persist despite inline styles due to hydration.

(function() {
    const TARGETS = [
        "Trusted by",
        "Aeronix trusted partners",
        "Real Stories, Real Impact"
    ];

    // Also include Turkish translations just in case translation happens before we catch it
    const TARGETS_TR = [
        "İş Ortaklarımız", // Translation for "Trusted by" from translations.js
        "Aeronix güvenilir ortakları", // Translation for "Aeronix trusted partners"
        "Gerçek Hikayeler, Gerçek Etki" // Translation for "Real Stories, Real Impact"
    ];

    const ALL_TARGETS = [...TARGETS, ...TARGETS_TR];

    function hideSections() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            const text = node.nodeValue.trim();
            if (!text) continue;

            // Check if this text node matches one of our targets
            // We use strict equality or inclusion? "Trusted by" might be "Trusted by " in DOM.
            // Let's use includes for robustness, but careful about false positives.
            // "Trusted by" is short, but specific enough in this context.

            const matched = ALL_TARGETS.some(t => text.includes(t));

            if (matched) {
                // Find the closest section or container to hide
                let parent = node.parentElement;
                let sectionToHide = null;

                // Traverse up to find a <section> or a specific container
                // We want to be careful. The structure in index.htm is:
                // <section class="bg-secondary py-16"> ... <p>Trusted by</p> ... </section>
                // <section class="pt-16 pb-16"> ... <h2>Aeronix trusted partners</h2> ... </section>
                // <section class="bg-secondary"> ... <h2>Real Stories, Real Impact</h2> ... </section>

                while (parent && parent !== document.body) {
                    if (parent.tagName === 'SECTION') {
                        sectionToHide = parent;
                        break;
                    }
                    parent = parent.parentElement;
                }

                if (sectionToHide) {
                    // Hide it
                    if (sectionToHide.style.display !== 'none') {
                        sectionToHide.style.display = 'none';
                        sectionToHide.style.setProperty('display', 'none', 'important');
                        // console.log("Hiding section containing:", text);
                    }
                }
            }
        }
    }

    // Run aggressively at start to catch early hydration
    hideSections();

    // Polling loop
    // 100ms interval for the first 5 seconds, then 500ms thereafter
    let interval = 100;
    let duration = 0;

    function poll() {
        hideSections();

        duration += interval;
        if (duration > 5000 && interval === 100) {
            clearInterval(timer);
            interval = 500;
            timer = setInterval(poll, interval);
        }
    }

    let timer = setInterval(poll, interval);

    // Also listen for mutations
    const observer = new MutationObserver((mutations) => {
        hideSections();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
