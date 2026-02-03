// Menu Enforcer for Aeronix Website
// Enforces the presence of the "About" menu item to counteract Next.js hydration

(function() {
    console.log("Menu Enforcer Init");

    function getRelativePath(targetPath) {
        // Find an existing script or link to determine relative depth
        // Or simpler: find the 'Contact' link and modify its href
        const contactLink = document.querySelector('a[href*="contact/index.htm"]');
        if (contactLink) {
            const contactHref = contactLink.getAttribute('href');
            // Replace 'contact/index.htm' with 'about/index.htm'
            return contactHref.replace('contact/index.htm', 'about/index.htm');
        }

        // Fallback for when we are IN the contact directory (href might be "index.htm")
        // But wait, if we are in contact/index.htm, the link to contact is usually just "index.htm" or similar?
        // Let's look at contact/index.htm content from previous read_file.
        // In contact/index.htm: <a ... href="index.htm">Contact</a> (WAIT, no)
        // Let's re-verify contact/index.htm header in a moment.
        // Actually, looking at about/index.htm: href="../contact/index.htm"
        // Looking at index.htm: href="contact/index.htm"
        // So simply replacing "contact/index.htm" with "about/index.htm" covers most cases.

        // Special case: inside contact/index.htm, the contact link might be "index.htm" (self) or similar?
        // Let's assume standard structure:
        // root: contact/index.htm -> about/index.htm
        // about: ../contact/index.htm -> index.htm (self) -> wait, about/index.htm link to about is "index.htm"

        return "about/index.htm"; // Default fallback
    }

    function enforceAboutLink() {
        // 1. Find the Contact Menu Item
        // We look for the <a> tag inside the nav
        // Selector: nav ul li a

        // We look for text content "Contact" or "İletişim" OR href containing "contact"
        const links = document.querySelectorAll('nav a');
        let contactLink = null;

        for (let link of links) {
            if (link.href.includes('contact') || link.textContent.trim() === 'Contact' || link.textContent.trim() === 'İletişim') {
                // Ensure it's in the main nav (hidden lg:flex usually)
                if (link.closest('ul') && link.closest('nav')) {
                    contactLink = link;
                    break;
                }
            }
        }

        if (!contactLink) return;

        const contactLi = contactLink.closest('li');
        if (!contactLi) return;

        // 2. Check if About link exists next
        const nextLi = contactLi.nextElementSibling;
        if (nextLi && nextLi.querySelector('a') && (nextLi.querySelector('a').textContent.trim() === 'About' || nextLi.querySelector('a').textContent.trim() === 'Hakkında')) {
            return; // Already exists
        }

        // 3. Create About Link
        const aboutLi = contactLi.cloneNode(true);
        const aboutLink = aboutLi.querySelector('a');

        // Set Text
        // Check current language to set initial text, though translations.js handles it
        // We'll set it to "About" and let translations take over if needed
        aboutLink.textContent = 'About';

        // Set Href
        const contactHref = contactLink.getAttribute('href');
        let aboutHref = '';

        if (contactHref === 'index.htm') {
            // We are in contact/index.htm
            // about is ../about/index.htm
            aboutHref = '../about/index.htm';
        } else if (contactHref.includes('contact/index.htm')) {
            // normal case: path/to/contact/index.htm -> path/to/about/index.htm
            aboutHref = contactHref.replace('contact/index.htm', 'about/index.htm');
        } else if (contactHref.endsWith('/contact/')) {
             aboutHref = contactHref.replace('/contact/', '/about/');
        } else {
            // Fallback: try to deduce depth
            // If contact is "../contact/index.htm", we want "../about/index.htm"
            if (contactHref.includes('contact')) {
                 aboutHref = contactHref.replace('contact', 'about');
            } else {
                 aboutHref = 'about/index.htm';
            }
        }

        aboutLink.setAttribute('href', aboutHref);

        // Remove "active" styles if copied from active contact link
        // (Next.js often uses data-attributes or classes)
        aboutLink.removeAttribute('data-active');
        aboutLink.removeAttribute('aria-current');

        // Insert after Contact
        contactLi.parentElement.insertBefore(aboutLi, contactLi.nextSibling);
    }

    // Run on load
    enforceAboutLink();

    // Polling to fight hydration
    setInterval(enforceAboutLink, 250);

})();
