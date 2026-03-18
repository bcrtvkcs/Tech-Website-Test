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
    const navItems = document.querySelectorAll('nav li > button');

    // Create dropdown containers
    navItems.forEach(btn => {
        let rawText = btn.textContent;
        let key = rawText.replace(/\s+/g, ' ').trim().split(' ')[0];
        if (rawText.includes('Solutions')) key = 'Solutions';
        if (rawText.includes('Industries')) key = 'Industries';
        if (rawText.includes('Services')) key = 'Services';

        if (menuData[key]) {
            const liParent = btn.parentElement;
            liParent.style.position = 'relative';

            const dropdown = document.createElement('div');
            // Adding a small padding top so hover doesn't break when moving mouse down from button
            dropdown.className = 'absolute top-full left-0 mt-2 w-56 rounded-md border bg-popover text-popover-foreground shadow-md outline-none hidden z-50';
            dropdown.style.display = 'none';
            dropdown.style.backgroundColor = 'var(--background)';
            dropdown.style.border = '1px solid var(--border)';
            // Setup transitions for dropdown container
            dropdown.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'translateY(-10px)';

            // Invisible bridge to connect button and dropdown for smooth hover
            const bridge = document.createElement('div');
            bridge.style.position = 'absolute';
            bridge.style.top = '-10px';
            bridge.style.left = '0';
            bridge.style.right = '0';
            bridge.style.height = '10px';
            bridge.style.backgroundColor = 'transparent';
            dropdown.appendChild(bridge);

            const ul = document.createElement('ul');
            ul.className = 'p-2 relative';

            const upCount = (window.location.pathname.match(/\//g) || []).length - 1;
            let finalHrefPrefix = upCount > 0 ? '../'.repeat(upCount) : '';

            // if we are in local file system
            if (window.location.protocol === 'file:') {
                 const cssLink = document.querySelector('link[href*="css/main.css"]');
                 if (cssLink) {
                     const matches = cssLink.getAttribute('href').match(/\.\.\//g);
                     finalHrefPrefix = matches ? '../'.repeat(matches.length) : '';
                 }
            }

            menuData[key].forEach(item => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = finalHrefPrefix + item.href;
                a.textContent = item.text;
                a.className = 'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm font-medium';
                li.appendChild(a);
                ul.appendChild(li);
            });

            dropdown.appendChild(ul);
            liParent.appendChild(dropdown);

            // Hover events
            let timeout;
            liParent.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
                dropdown.classList.remove('hidden');
                dropdown.style.display = 'block';
                dropdown.style.visibility = 'visible';

                // Slight delay to allow display:block to apply before animating opacity/transform
                requestAnimationFrame(() => {
                    dropdown.style.opacity = '1';
                    dropdown.style.transform = 'translateY(0)';
                });

                btn.setAttribute('aria-expanded', 'true');
                btn.setAttribute('data-state', 'open');
            });
            liParent.addEventListener('mouseleave', () => {
                // Animate out
                dropdown.style.opacity = '0';
                dropdown.style.transform = 'translateY(-10px)';

                timeout = setTimeout(() => {
                    dropdown.classList.add('hidden');
                    dropdown.style.display = 'none';
                    dropdown.style.visibility = 'hidden';
                    btn.setAttribute('aria-expanded', 'false');
                    btn.setAttribute('data-state', 'closed');
                }, 200); // Wait for transition to finish
            });
        }
    });

    // --- Mobile Menu ---
    const mobileMenuTrigger = document.querySelector('.lg\\:hidden button');
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
        content.style.overflowY = 'auto';
        content.style.maxHeight = 'calc(100vh - 60px)';
        content.className = 'flex flex-col gap-4 py-4';

        // Determine root prefix for links
        let rootPrefix = '';
        const cssLink = document.querySelector('link[href*="css/main.css"]');
        if (cssLink) {
             const href = cssLink.getAttribute('href');
             const matches = href.match(/\.\.\//g);
             if (matches) rootPrefix = '../'.repeat(matches.length);
        }

        // Array to hold all animated elements for staggered entry
        const animatedElements = [];

        // Build mobile links
        const homeLink = document.createElement('a');
        homeLink.href = rootPrefix + 'index.htm';
        homeLink.textContent = 'Home';
        homeLink.className = 'text-lg font-medium hover:underline';
        content.appendChild(homeLink);
        animatedElements.push(homeLink);

        Object.keys(menuData).forEach(category => {
            const catHeader = document.createElement('div');
            catHeader.className = 'text-lg font-bold mt-2';
            catHeader.textContent = category;
            content.appendChild(catHeader);
            animatedElements.push(catHeader);

            menuData[category].forEach(item => {
                const link = document.createElement('a');
                link.href = rootPrefix + item.href;
                link.textContent = item.text;
                link.className = 'text-muted-foreground hover:text-foreground block py-1 ml-4';
                content.appendChild(link);
                animatedElements.push(link);
            });
        });

        const contactLink = document.createElement('a');
        contactLink.href = rootPrefix + 'contact/index.htm';
        contactLink.textContent = 'Contact';
        contactLink.className = 'text-lg font-medium hover:underline mt-2';
        content.appendChild(contactLink);
        animatedElements.push(contactLink);

        const aboutLink = document.createElement('a');
        aboutLink.href = rootPrefix + 'about/index.htm';
        aboutLink.textContent = 'About';
        aboutLink.className = 'text-lg font-medium hover:underline';
        content.appendChild(aboutLink);
        animatedElements.push(aboutLink);

        // Setup initial staggered styles
        animatedElements.forEach(el => {
            el.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            el.style.opacity = '0';
            el.style.transform = 'translateX(20px)'; // start slightly to the right
        });

        sheet.appendChild(closeBtn);
        sheet.appendChild(content);
        document.body.appendChild(overlay);
        document.body.appendChild(sheet);

        // Event Listeners
        const toggleMenu = (open) => {
            if (open) {
                overlay.style.display = 'block'; overlay.classList.remove('hidden');
                sheet.style.display = 'block'; sheet.classList.remove('hidden');

                // minimal delay to allow transition of the sheet itself
                requestAnimationFrame(() => {
                    overlay.setAttribute('data-state', 'open');
                    sheet.setAttribute('data-state', 'open');

                    // Trigger staggered animation for list items
                    animatedElements.forEach((el, index) => {
                        setTimeout(() => {
                            el.style.opacity = '1';
                            el.style.transform = 'translateX(0)';
                        }, 100 + (index * 40)); // 100ms base delay + 40ms per item
                    });
                });
            } else {
                overlay.setAttribute('data-state', 'closed');
                sheet.setAttribute('data-state', 'closed');

                // Instantly hide list items so they can animate again next time
                animatedElements.forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateX(20px)';
                });

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
