// Language Manager for Aeronix Website
// Handles translation injection and language toggling

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

        applyLanguage(lang);
        updateToggleButton(lang);
    }

    // Function to apply translations
    function applyLanguage(lang) {
        if (lang === 'en') {
            if (document.body.classList.contains('lang-tr-active')) {
                location.reload();
            }
            return;
        }

        if (lang === 'tr') {
            document.body.classList.add('lang-tr-active');

            // Walk the DOM and replace text
            const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while (node = walk.nextNode()) {
                // Skip if parent is script or style
                if (node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE') continue;

                const text = node.nodeValue.trim();
                if (text && typeof tr_translations !== 'undefined' && tr_translations[text]) {
                    // Check if we have a translation
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

    function init() {
        console.log("Language Manager Init");
        const currentLang = getLanguage();

        if (currentLang === 'tr') {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => applyLanguage('tr'));
            } else {
                applyLanguage('tr');
            }
        }

        const insertButton = () => {
             // Find target container
             let targetContainer = null;

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

             if (!targetContainer) {
                 try {
                    targetContainer = document.querySelector('.hidden.flex-shrink-0.lg\\:flex');
                 } catch(e) { console.error(e); }
             }

             if (targetContainer && !document.getElementById('lang-toggle-btn')) {
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

                 updateToggleButton(currentLang);
                 return true;
             }
             return false;
        };

        // Use MutationObserver to wait for element
        const observer = new MutationObserver((mutations, obs) => {
            if (insertButton()) {
                obs.disconnect(); // Stop observing once inserted
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Try immediately once
        if (document.readyState !== 'loading') {
            insertButton();
        } else {
            document.addEventListener('DOMContentLoaded', insertButton);
        }
    }

    init();

})();
