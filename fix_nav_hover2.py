import re

with open("js/navigation.js", "r") as f:
    content = f.read()

# Let's add debugging output to the console for the mouse events and make sure DOM is set up correctly.
# The button might have `data-state="closed"` hardcoded in HTML, so we should update its attributes when opening/closing
# dropdowns so that CSS rules (like `data-[state=open]:bg-accent/50`) actually apply.

new_content = re.sub(
    r"dropdown\.classList\.remove\('hidden'\);\s*btn\.setAttribute\('aria-expanded', 'true'\);",
    "dropdown.classList.remove('hidden');\n                btn.setAttribute('aria-expanded', 'true');\n                btn.setAttribute('data-state', 'open');",
    content
)

new_content = re.sub(
    r"dropdown\.classList\.add\('hidden'\);\s*btn\.setAttribute\('aria-expanded', 'false'\);",
    "dropdown.classList.add('hidden');\n                    btn.setAttribute('aria-expanded', 'false');\n                    btn.setAttribute('data-state', 'closed');",
    new_content
)

# Also fix the li relative positioning. If the parent <li> isn't relative, absolute positioning will be off.
new_content = re.sub(
    r"btn\.parentElement\.appendChild\(dropdown\);",
    "btn.parentElement.style.position = 'relative';\n            btn.parentElement.appendChild(dropdown);",
    new_content
)

with open("js/navigation.js", "w") as f:
    f.write(new_content)

print("Updated js/navigation.js")
