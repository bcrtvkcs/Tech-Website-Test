with open('/app/js/navigation.js', 'r') as f:
    text = f.read()

# Let's replace the brute force logic with targeted logic that only modifies the specific wrappers
old_mouseenter = """                // Brute force: Remove any hidden/closed states from ALL inner containers
                const innerDivs = dropdown.querySelectorAll('div');
                innerDivs.forEach(div => {
                    div.classList.remove('hidden', 'invisible');
                    div.setAttribute('data-state', 'open');

                    // Specific fix for Radix UI animation wrappers
                    if(div.hasAttribute('data-motion')) {
                        div.setAttribute('data-motion', 'from-start');
                    }

                    // Override any lingering inline display:none or opacity:0
                    div.style.display = 'block';
                    div.style.opacity = '1';
                    div.style.visibility = 'visible';
                    div.style.pointerEvents = 'auto'; // Re-enable clicking inside menu
                });"""

new_mouseenter = """                // Propagate open state to specific Radix UI container wrappers
                const viewport = dropdown.querySelector('div[data-slot="navigation-menu-viewport"]');
                if(viewport) {
                    viewport.setAttribute('data-state', 'open');
                    viewport.style.display = ''; // clear any inline display
                    viewport.classList.remove('hidden', 'invisible');
                }
                const contentWrapper = dropdown.querySelector('div[data-slot="navigation-menu-content"]');
                if(contentWrapper) {
                    contentWrapper.setAttribute('data-state', 'open');
                    contentWrapper.setAttribute('data-motion', 'from-start'); // For animation to trigger
                    contentWrapper.style.display = ''; // clear any inline display
                    contentWrapper.classList.remove('hidden', 'invisible');
                    contentWrapper.style.pointerEvents = 'auto'; // Re-enable clicking inside menu
                }"""

old_mouseleave1 = """                // Trigger closing animations on inner containers too
                const innerDivs = dropdown.querySelectorAll('div');
                innerDivs.forEach(div => {
                    div.setAttribute('data-state', 'closed');
                    if(div.hasAttribute('data-motion')) {
                        div.setAttribute('data-motion', 'to-start');
                    }
                });"""

new_mouseleave1 = """                const viewport = dropdown.querySelector('div[data-slot="navigation-menu-viewport"]');
                if(viewport) viewport.setAttribute('data-state', 'closed');
                const contentWrapper = dropdown.querySelector('div[data-slot="navigation-menu-content"]');
                if(contentWrapper) {
                    contentWrapper.setAttribute('data-state', 'closed');
                    contentWrapper.setAttribute('data-motion', 'to-start');
                }"""

old_mouseleave2 = """                    // Fully hide inner content so it doesn't ghost on screen
                    innerDivs.forEach(div => {
                        div.classList.add('hidden');
                        div.style.display = 'none';
                    });"""

new_mouseleave2 = """"""

text = text.replace(old_mouseenter, new_mouseenter)
text = text.replace(old_mouseleave1, new_mouseleave1)
text = text.replace(old_mouseleave2, new_mouseleave2)

with open('/app/js/navigation.js', 'w') as f:
    f.write(text)
