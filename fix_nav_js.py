with open("js/navigation.js", "r") as f:
    content = f.read()

# find: const key = btn.textContent.trim();
# replace with:
# let key = btn.textContent.trim();
# // If textContent contains SVG text or newlines, extract just the first word
# key = key.split('\n')[0].trim();

new_content = content.replace(
    "const key = btn.textContent.trim();",
    "let key = btn.textContent.trim();\n        // The button contains an SVG, so textContent has newlines and extra spaces.\n        // Extract only the visible text.\n        key = key.split('\\n')[0].trim();"
)

with open("js/navigation.js", "w") as f:
    f.write(new_content)

print("Updated js/navigation.js")
