with open('/app/js/navigation.js', 'r') as f:
    text = f.read()

# Replace 'w-56' with 'w-max' in the outer dropdown class
text = text.replace("dropdown.className = 'absolute top-full left-0 mt-2 w-56 rounded-md border",
                    "dropdown.className = 'absolute top-full left-0 mt-2 w-max rounded-md border")

# Remove the override of viewport's class and contentDiv's position. We want to keep the original Tailwind classes like min-w-[500px] intact.
old_viewport_logic = """
            // Adjust the inner viewport classes to prevent double border/background
            const viewport = dropdown.querySelector('div[data-slot="navigation-menu-viewport"]');
            if(viewport) {
                viewport.className = '';
                viewport.style.border = 'none';
                viewport.style.boxShadow = 'none';
                viewport.style.width = '100%';
                viewport.style.height = 'auto';
            }
            const contentDiv = dropdown.querySelector('div[data-slot="navigation-menu-content"]');
            if(contentDiv) {
                contentDiv.className = 'p-4';
                contentDiv.style.position = 'relative';
            }
"""

new_viewport_logic = """
            // Keep original Radix UI inner classes, just strip out the border and background of the outer wrapper since the inner one has it
            dropdown.style.border = 'none';
            dropdown.style.backgroundColor = 'transparent';
            dropdown.style.boxShadow = 'none';
"""

text = text.replace(old_viewport_logic, new_viewport_logic)

with open('/app/js/navigation.js', 'w') as f:
    f.write(text)
