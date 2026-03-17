import re

with open("js/navigation.js", "r") as f:
    content = f.read()

# Instead of splitting by newline, we can replace the SVG block or simply match the word.
# Let's see how btn.textContent looks in Chrome for the exact HTML.
# In JS, textContent concatenates all text nodes.
# Let's write a python script to fix navigation.js to use:
# let key = btn.textContent.replace(/\\s+/g, ' ').replace(' ', '').trim();
# Actually:
# Array.from(btn.childNodes).find(n => n.nodeType === 3).textContent.trim()
# is the most robust way in JS to get just the text node directly inside the button.

new_content = re.sub(
    r"let key = btn\.textContent\.trim\(\);\n\s*// The button contains an SVG.*?\n\s*// Extract only the visible text\.\n\s*key = key\.split\('\\n'\)\[0\]\.trim\(\);",
    "let key = Array.from(btn.childNodes).find(n => n.nodeType === 3)?.textContent.trim() || btn.textContent.trim();",
    content,
    flags=re.DOTALL
)

with open("js/navigation.js", "w") as f:
    f.write(new_content)

print("Updated js/navigation.js")
