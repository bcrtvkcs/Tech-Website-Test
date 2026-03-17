import re

with open("js/navigation.js", "r") as f:
    content = f.read()

# Replace the desktop dropdown section
start_marker = "// --- Desktop Dropdowns ---"
end_marker = "// --- Mobile Menu ---"
start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_desktop_logic = """// --- Desktop Dropdowns ---
    const navItems = document.querySelectorAll('nav [data-slot="navigation-menu-item"] button');

    // Create dropdown containers
    navItems.forEach(btn => {
        let rawText = btn.textContent;
        let key = rawText.replace(/\\s+/g, ' ').trim().split(' ')[0];
        if (rawText.includes('Solutions')) key = 'Solutions';
        if (rawText.includes('Industries')) key = 'Industries';
        if (rawText.includes('Services')) key = 'Services';

        if (menuData[key]) {
            const liParent = btn.parentElement;
            liParent.style.position = 'relative';

            const dropdown = document.createElement('div');
            // Adding a small padding top so hover doesn't break when moving mouse down from button
            dropdown.className = 'absolute top-full left-0 mt-2 w-56 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 hidden';
            dropdown.style.backgroundColor = 'var(--background)';
            dropdown.style.border = '1px solid var(--border)';
            dropdown.style.zIndex = '1000';

            // Invisible bridge to connect button and dropdown for smooth hover
            const bridge = document.createElement('div');
            bridge.style.position = 'absolute';
            bridge.style.top = '-8px';
            bridge.style.left = '0';
            bridge.style.right = '0';
            bridge.style.height = '8px';
            bridge.style.backgroundColor = 'transparent';
            dropdown.appendChild(bridge);

            const ul = document.createElement('ul');
            ul.className = 'p-2 relative';

            const upCount = (window.location.pathname.match(/\\//g) || []).length - 1;
            let finalHrefPrefix = upCount > 0 ? '../'.repeat(upCount) : '';

            // if we are in local file system
            if (window.location.protocol === 'file:') {
                 const cssLink = document.querySelector('link[href*="css/main.css"]');
                 if (cssLink) {
                     const matches = cssLink.getAttribute('href').match(/\\.\\.\\//g);
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
                btn.setAttribute('aria-expanded', 'true');
                btn.setAttribute('data-state', 'open');
            });
            liParent.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    dropdown.classList.add('hidden');
                    btn.setAttribute('aria-expanded', 'false');
                    btn.setAttribute('data-state', 'closed');
                }, 100);
            });
        }
    });

    """

new_content = content[:start_idx] + new_desktop_logic + content[end_idx:]

with open("js/navigation.js", "w") as f:
    f.write(new_content)

print("Updated js/navigation.js")
