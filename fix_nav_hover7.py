import re

with open("js/navigation.js", "r") as f:
    content = f.read()

# Check if there is a CSS issue masking the elements or z-index issue.
# Wait, let's just make the dropdown ALWAYS visible for a moment to see if it even renders.
new_content = re.sub(
    r"dropdown\.className = 'absolute top-full left-0 mt-2 w-56 rounded-md border bg-popover text-popover-foreground shadow-md outline-none hidden';",
    "dropdown.className = 'absolute top-full left-0 mt-2 w-56 rounded-md border bg-popover text-popover-foreground shadow-md outline-none';",
    content
)

new_content = re.sub(
    r"dropdown\.style\.display = 'none';",
    "// dropdown.style.display = 'none';",
    new_content
)

with open("js/navigation.js", "w") as f:
    f.write(new_content)

print("Updated js/navigation.js")
