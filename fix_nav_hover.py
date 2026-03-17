import re

with open("js/navigation.js", "r") as f:
    content = f.read()

# Make sure CSS pointer-events on hover isn't an issue.
# But more likely, `dropdown` elements are appended correctly but there's an issue with how CSS works.
# In the original, hover works with Radix. Radix adds/removes state="open".
# Let's write the dropdown correctly and ensure it's positioned correctly and we update the state so SVG rotates.

# Add debugging to navigation.js to see if event fires and what `key` is.
new_content = content.replace(
    "let key = Array.from(btn.childNodes).find(n => n.nodeType === 3)?.textContent.trim() || btn.textContent.trim();",
    "let key = Array.from(btn.childNodes).find(n => n.nodeType === 3)?.textContent.trim() || btn.textContent.trim();\n        // console.log('Dropdown key:', key);"
)

with open("js/navigation.js", "w") as f:
    f.write(new_content)

print("Updated js/navigation.js")
