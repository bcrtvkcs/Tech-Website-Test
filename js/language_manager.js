// Language Manager for Aeronix Website
// Handles translation injection and language toggling (Vanilla JS version)

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
             location.reload();
        } else {
             applyLanguage(lang);
             updateToggleButton(lang);
             replayTextAnimation();
        }
    }

    // Function to replay text animation
    function replayTextAnimation() {
        const activeClass = 'aeronix-text-anim-active';
        if (document.body.classList.contains(activeClass)) {
            document.body.classList.remove(activeClass);
            void document.body.offsetWidth; // Trigger reflow
            document.body.classList.add(activeClass);
        } else {
             document.body.classList.add(activeClass);
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
                const parentTag = node.parentNode.tagName;
                if (parentTag === 'SCRIPT' || parentTag === 'STYLE' || parentTag === 'NOSCRIPT') continue;

                const text = node.nodeValue.trim();
                if (text && typeof tr_translations !== 'undefined' && tr_translations[text]) {
                    if (tr_translations[text].length > 0) {
                        node.nodeValue = node.nodeValue.replace(text, tr_translations[text]);
                    }
                }
            }

            // Handle attributes
            const elements = document.getElementsByTagName('*');
            for (let i = 0; i < elements.length; i++) {
                const el = elements[i];
                if (el.hasAttribute('alt')) {
                    const txt = el.getAttribute('alt').trim();
                    if (txt && typeof tr_translations !== 'undefined' && tr_translations[txt]) el.setAttribute('alt', tr_translations[txt]);
                }
                if (el.hasAttribute('placeholder')) {
                    const txt = el.getAttribute('placeholder').trim();
                    if (txt && typeof tr_translations !== 'undefined' && tr_translations[txt]) el.setAttribute('placeholder', tr_translations[txt]);
                }
                if (el.hasAttribute('title')) {
                    const txt = el.getAttribute('title').trim();
                    if (txt && typeof tr_translations !== 'undefined' && tr_translations[txt]) el.setAttribute('title', tr_translations[txt]);
                }
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
         // Simple check if we are in a subdirectory
         // This assumes scripts are loaded properly or we can find an image
         const existingImg = document.querySelector('img[src*="images/"]');
         if (existingImg) {
             const src = existingImg.getAttribute('src');
             const idx = src.indexOf('images/');
             if (idx !== -1) {
                 const prefix = src.substring(0, idx);
                 return prefix + path;
             }
         }
         // Fallback based on depth
         const depth = window.location.pathname.split('/').length - 2;
         // Handle root
         if (window.location.pathname.endsWith('index.htm') || window.location.pathname.endsWith('/')) {
             // standard structure
         }
         // Just try standard relative path if image detection fails
         let prefix = '';
         if (window.location.pathname.indexOf('/contact/') !== -1 || window.location.pathname.indexOf('/about/') !== -1) prefix = '../';
         return prefix + path;
    }

    function insertButton() {
         if (document.getElementById('lang-toggle-btn')) return true;

         // Find the theme toggle button to insert before it
         let targetContainer = null;
         let themeBtn = null;

         const buttons = document.querySelectorAll('button');
         for (const btn of buttons) {
             if (btn.querySelector('.lucide-sun') || btn.querySelector('.lucide-moon') || (btn.textContent && btn.textContent.includes('Toggle theme'))) {
                 themeBtn = btn;
                 targetContainer = btn.parentElement;
                 break;
             }
         }

         if (targetContainer && themeBtn) {
             const btn = document.createElement('button');
             btn.id = 'lang-toggle-btn';
             btn.className = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 cursor-pointer";

             const img = document.createElement('img');
             img.id = 'lang-toggle-img';
             img.style.width = '24px';
             img.style.height = '24px';
             img.style.borderRadius = '50%';
             img.style.objectFit = 'cover';

             btn.appendChild(img);

             // Insert the language button BEFORE the theme toggle button within the flex container
             targetContainer.insertBefore(btn, themeBtn);

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

    function init() {
        if (!document.body.classList.contains('aeronix-text-anim-active')) {
            document.body.classList.add('aeronix-text-anim-active');
        }

        const currentLang = getLanguage();
        if (currentLang === 'tr') {
             applyLanguage('tr');
        }
        insertButton();
    }

    if (document.readyState !== 'loading') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

})();
