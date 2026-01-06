// Language Manager for Aeronix Website
// Handles translation injection and language toggling with React hydration support via Aggressive Polling

(function() {
    const LANG_STORAGE_KEY = 'aeronix_lang';
    const DEFAULT_LANG = 'en';

    // Helper to get current language
    function getLanguage() {
        try {
            const stored = localStorage.getItem(LANG_STORAGE_KEY);
            if (stored) return stored;

            // Auto-detect Turkish
            const browserLang = navigator.language || navigator.userLanguage;
            if (browserLang && browserLang.startsWith('tr')) {
                return 'tr';
            }
        } catch (e) {
            console.error("Error accessing localStorage", e);
        }

        return DEFAULT_LANG;
    }

    // Helper to set language
    function setLanguage(lang) {
        try {
            localStorage.setItem(LANG_STORAGE_KEY, lang);
        } catch(e) { console.error(e); }

        if (lang === 'en') {
             // Reload to clear Turkish changes cleanly
             location.reload();
        } else {
             applyLanguage(lang);
             updateToggleButton(lang);
        }
    }

    // Function to apply translations
    function applyLanguage(lang) {
        if (lang === 'en') return;

        if (lang === 'tr') {
            if (!document.body.classList.contains('lang-tr-active')) {
                document.body.classList.add('lang-tr-active');
            }

            // Walk the DOM and replace text
            const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while (node = walk.nextNode()) {
                // Skip if parent is script or style
                const parentTag = node.parentNode.tagName;
                if (parentTag === 'SCRIPT' || parentTag === 'STYLE' || parentTag === 'NOSCRIPT') continue;

                const text = node.nodeValue.trim();
                // Ensure tr_translations is available
                if (text && typeof tr_translations !== 'undefined' && tr_translations[text]) {
                    // Only replace if it's not already translated (to be safe, though key lookup implicitly handles this if keys are unique)
                    // But here we rely on the fact that 'Solutions' maps to 'Çözümler', so if text is 'Solutions', we replace.
                    // If text is 'Çözümler', tr_translations['Çözümler'] is undefined, so we skip.
                    if (tr_translations[text].length > 0) {
                        node.nodeValue = node.nodeValue.replace(text, tr_translations[text]);
                    }
                }
            }

            // Handle attributes
            const elements = document.getElementsByTagName('*');
            for (let i = 0; i < elements.length; i++) {
                const el = elements[i];
                // Alt text
                if (el.hasAttribute('alt')) {
                    const txt = el.getAttribute('alt').trim();
                    if (txt && typeof tr_translations !== 'undefined' && tr_translations[txt]) el.setAttribute('alt', tr_translations[txt]);
                }
                // Placeholder
                if (el.hasAttribute('placeholder')) {
                    const txt = el.getAttribute('placeholder').trim();
                    if (txt && typeof tr_translations !== 'undefined' && tr_translations[txt]) el.setAttribute('placeholder', tr_translations[txt]);
                }
                // Title
                if (el.hasAttribute('title')) {
                    const txt = el.getAttribute('title').trim();
                    if (txt && typeof tr_translations !== 'undefined' && tr_translations[txt]) el.setAttribute('title', tr_translations[txt]);
                }
                // Meta content (description)
                if (el.tagName.toLowerCase() === 'meta' && el.getAttribute('name') === 'description') {
                     const txt = el.getAttribute('content').trim();
                     if (txt && typeof tr_translations !== 'undefined' && tr_translations[txt]) el.setAttribute('content', tr_translations[txt]);
                }
            }
        }
    }

    // Toggle Button Logic
    function updateToggleButton(currentLang) {
        const btnImg = document.getElementById('lang-toggle-img');
        if (!btnImg) return;

        if (currentLang === 'en') {
            btnImg.src = getRelativeImagePath('images/tr.png');
            btnImg.alt = 'Switch to Turkish';
        } else {
            btnImg.src = getRelativeImagePath('images/en.png');
            btnImg.alt = 'Switch to English';
        }
    }

    function getRelativeImagePath(path) {
         const existingImg = document.querySelector('img[src*="images/"]');
         if (existingImg) {
             const src = existingImg.getAttribute('src');
             // Find where 'images/' starts
             const idx = src.indexOf('images/');
             if (idx !== -1) {
                 const prefix = src.substring(0, idx);
                 return prefix + path;
             }
         }
         return path; // Fallback
    }

    function insertButton() {
         if (document.getElementById('lang-toggle-btn')) return true;

         // Find target container
         let targetContainer = null;

         // Strategy 1: Look for the theme toggle button's screen reader text
         const spans = document.querySelectorAll('span.sr-only');
         for (let i = 0; i < spans.length; i++) {
             if (spans[i].textContent.includes('Toggle theme')) {
                 const btn = spans[i].closest('button');
                 if (btn) {
                     targetContainer = btn.parentElement;
                     break;
                 }
             }
         }

         // Strategy 2: Fallback to the specific Tailwind class structure for desktop
         if (!targetContainer) {
             try {
                // The container for the theme button in header
                targetContainer = document.querySelector('.hidden.flex-shrink-0.lg\\:flex');
             } catch(e) { console.error(e); }
         }

         if (targetContainer) {
             const btn = document.createElement('button');
             btn.id = 'lang-toggle-btn';
             btn.className = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 mr-2";
             btn.style.marginRight = "0.5rem";

             const img = document.createElement('img');
             img.id = 'lang-toggle-img';
             img.style.width = '24px';
             img.style.height = '24px';
             img.style.borderRadius = '50%';
             img.style.objectFit = 'cover';

             btn.appendChild(img);

             targetContainer.insertBefore(btn, targetContainer.firstChild);

             btn.addEventListener('click', () => {
                 const current = getLanguage();
                 const next = current === 'en' ? 'tr' : 'en';
                 setLanguage(next);
             });

             updateToggleButton(getLanguage());
             return true;
         }
         return false;
    }

    function checkAndEnforceState() {
        const currentLang = getLanguage();

        // 1. Enforce Button Presence (Always, even for English)
        insertButton();

        // Update button state (in case of hydration overwrites or just to be safe)
        updateToggleButton(currentLang);

        if (currentLang === 'en') return;

        // 2. Enforce Translation (Sentinel Check)
        // Check if "Solutions" is present in the DOM. If so, it means we reverted to English.
        // We use a specific, high-visibility element to avoid scanning the whole DOM every time.
        // However, looking for text content in body is reasonably fast if we exit early.
        // Or better: check if specific known elements are English.
        
        let needsTranslation = false;
        
        // Check 1: Menu item "Solutions"
        // XPath might be cleaner, but let's iterate links or headings
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        let checks = 0;
        while(node = walker.nextNode()) {
            checks++;
            if (checks > 100) break; // Optimization: only check first 100 text nodes (header is usually top)
            if (node.nodeValue.includes("Solutions") || node.nodeValue.includes("Industries")) {
                needsTranslation = true;
                break;
            }
        }

        if (needsTranslation) {
            applyLanguage('tr');
        }
        
        updateToggleButton(currentLang);
    }

    function init() {
        console.log("Language Manager Init (Polling Mode)");
        
        // Initial run
        const currentLang = getLanguage();
        if (currentLang === 'tr') {
             applyLanguage('tr');
        }
        insertButton();

        // Aggressive Polling Loop
        // Runs every 250ms indefinitely to catch React hydration and subsequent re-renders
        setInterval(() => {
            checkAndEnforceState();
        }, 250);
    }

    // Start initialization
    if (document.readyState !== 'loading') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

})();
