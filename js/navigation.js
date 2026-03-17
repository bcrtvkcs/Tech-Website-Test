document.addEventListener('DOMContentLoaded', function() {
    const menuData = {
        'Solutions': [
            { text: 'AerWatch®', href: 'aerwatch/index.htm' },
            { text: 'AerAccess®', href: 'aeraccess/index.htm' },
            { text: 'AerMeal®', href: 'aermeal/index.htm' }
        ],
        'Industries': [
            { text: 'Aviation', href: 'industry/aviation/index.htm' },
            { text: 'Banking and Finance', href: 'industry/finance/index.htm' },
            { text: 'Cities', href: 'industry/cities/index.htm' },
            { text: 'Correctional Facilities', href: 'industry/corrections/index.htm' },
            { text: 'Education', href: 'industry/education/index.htm' },
            { text: 'Parking', href: 'industry/parking/index.htm' },
            { text: 'Public Transport', href: 'industry/public-transport/index.htm' },
            { text: 'Retail', href: 'industry/retail/index.htm' }
        ],
        'Services': [
            { text: 'Custom Enterprise Solution', href: 'services/enterprise/index.htm' },
            { text: 'Professional Services', href: 'services/professional/index.htm' },
            { text: 'Managed Services', href: 'services/managed/index.htm' }
        ]
    };

    // --- Desktop Dropdowns ---
    const navItems = document.querySelectorAll('nav [data-slot="navigation-menu-item"] button');

    // Create dropdown containers
    navItems.forEach(btn => {
        const key = btn.textContent.trim();
        if (menuData[key]) {
            const dropdown = document.createElement('div');
            dropdown.className = 'absolute top-full left-0 mt-2 w-56 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 hidden';
            dropdown.style.backgroundColor = 'var(--background)';
            dropdown.style.border = '1px solid var(--border)';
            dropdown.style.zIndex = '1000';

            const ul = document.createElement('ul');
            ul.className = 'p-2';

            menuData[key].forEach(item => {
                const li = document.createElement('li');
                const a = document.createElement('a');

                // Adjust href based on current depth
                // Simple heuristic: if we are in a subdir, prepend ../
                // However, the cleanest way is to assume hrefs are relative to root, and we fix them
                // But here we will rely on the fact that the pages are at different depths.
                // Better approach: Use absolute paths or fix relative paths based on document location.
                // For this static export, relative paths are tricky.
                // Let's try to detect depth.
                const depth = window.location.pathname.split('/').length - 2; // -2 because leading slash and filename
                let relativePrefix = '';
                if (!window.location.pathname.endsWith('index.htm') && !window.location.pathname.endsWith('/')) {
                     // handling file.html
                }

                // A simpler way for static sites:
                // check if the current page is index.htm in root
                // We can use a base tag or just robust relative path logic.
                // Let's assume the links in menuData are relative to root.
                // We need to prefix them with appropriate ../

                let link = item.href;
                // Basic fix for depth
                const path = window.location.pathname;
                const segments = path.split('/').filter(p => p.length > 0 && p !== 'index.htm');
                // if we are at root /, segments is empty or just ['']
                // but local file system paths might be different.

                // Let's trust the browser to resolve relative if we simply put the correct relative path.
                // Actually, since we are moving to "decoupled", we can just use the provided links
                // IF we are at root. If we are in subfolder, we need ../

                let upCount = 0;
                if (window.location.protocol === 'file:') {
                     // Crude depth check for local file testing
                     // Can't reliably detect root without a marker.
                     // But we can check where 'css/main.css' is pointing in the head.
                     const cssLink = document.querySelector('link[href*="css/main.css"]');
                     if (cssLink) {
                         const href = cssLink.getAttribute('href');
                         const matches = href.match(/\.\.\//g);
                         if (matches) upCount = matches.length;
                     }
                } else {
                    // For http server
                    upCount = segments.length;
                }

                let finalHref = link;
                for(let i=0; i<upCount; i++) {
                    finalHref = '../' + finalHref;
                }

                a.href = finalHref;
                a.textContent = item.text;
                a.className = 'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground';

                li.appendChild(a);
                ul.appendChild(li);
            });

            dropdown.appendChild(ul);
            btn.parentElement.appendChild(dropdown);

            // Hover events
            let timeout;
            btn.parentElement.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
                dropdown.classList.remove('hidden');
                btn.setAttribute('aria-expanded', 'true');
            });
            btn.parentElement.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    dropdown.classList.add('hidden');
                    btn.setAttribute('aria-expanded', 'false');
                }, 100);
            });
        }
    });

    // --- Mobile Menu ---
    const mobileMenuTrigger = document.querySelector('.lg\\:hidden button[data-slot="sheet-trigger"]');
    if (mobileMenuTrigger) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 hidden';
        overlay.id = 'mobile-menu-overlay';

        const sheet = document.createElement('div');
        sheet.className = 'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm hidden';
        sheet.id = 'mobile-menu-sheet';

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary';
        closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x h-4 w-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg><span class="sr-only">Close</span>';

        // Content
        const content = document.createElement('div');
        content.className = 'flex flex-col gap-4 py-4';

        // Determine root prefix for links
        let rootPrefix = '';
        const cssLink = document.querySelector('link[href*="css/main.css"]');
        if (cssLink) {
             const href = cssLink.getAttribute('href');
             const matches = href.match(/\.\.\//g);
             if (matches) rootPrefix = '../'.repeat(matches.length);
        }

        // Build mobile links
        const homeLink = document.createElement('a');
        homeLink.href = rootPrefix + 'index.htm';
        homeLink.textContent = 'Home';
        homeLink.className = 'text-lg font-medium hover:underline';
        content.appendChild(homeLink);

        Object.keys(menuData).forEach(category => {
            const catHeader = document.createElement('div');
            catHeader.className = 'text-lg font-bold mt-2';
            catHeader.textContent = category;
            content.appendChild(catHeader);

            menuData[category].forEach(item => {
                const link = document.createElement('a');
                link.href = rootPrefix + item.href;
                link.textContent = item.text;
                link.className = 'text-muted-foreground hover:text-foreground block py-1 ml-4';
                content.appendChild(link);
            });
        });

        const contactLink = document.createElement('a');
        contactLink.href = rootPrefix + 'contact/index.htm';
        contactLink.textContent = 'Contact';
        contactLink.className = 'text-lg font-medium hover:underline mt-2';
        content.appendChild(contactLink);

        const aboutLink = document.createElement('a');
        aboutLink.href = rootPrefix + 'about/index.htm';
        aboutLink.textContent = 'About';
        aboutLink.className = 'text-lg font-medium hover:underline';
        content.appendChild(aboutLink);

        sheet.appendChild(closeBtn);
        sheet.appendChild(content);
        document.body.appendChild(overlay);
        document.body.appendChild(sheet);

        // Event Listeners
        const toggleMenu = (open) => {
            if (open) {
                overlay.classList.remove('hidden');
                sheet.classList.remove('hidden');
                // minimal delay to allow transition
                requestAnimationFrame(() => {
                    overlay.setAttribute('data-state', 'open');
                    sheet.setAttribute('data-state', 'open');
                });
            } else {
                overlay.setAttribute('data-state', 'closed');
                sheet.setAttribute('data-state', 'closed');
                setTimeout(() => {
                    overlay.classList.add('hidden');
                    sheet.classList.add('hidden');
                }, 300);
            }
        };

        mobileMenuTrigger.addEventListener('click', () => toggleMenu(true));
        closeBtn.addEventListener('click', () => toggleMenu(false));
        overlay.addEventListener('click', () => toggleMenu(false));
    }
});
