import re

with open("js/navigation.js", "r") as f:
    content = f.read()

# Try debugging with console.log
new_content = re.sub(
    r"btn\.parentElement\.addEventListener\('mouseenter', \(\) => {",
    "btn.parentElement.addEventListener('mouseenter', () => {\n                console.log('Hovered over:', key);",
    content
)

with open("js/navigation.js", "w") as f:
    f.write(new_content)

print("Updated js/navigation.js")
