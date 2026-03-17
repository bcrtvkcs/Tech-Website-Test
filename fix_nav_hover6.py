import re

with open("js/navigation.js", "r") as f:
    content = f.read()

# Let's fix the dropdown styling to be more visible and easier to debug, and ensure it isn't "hidden" by something else.
# The class contains `hidden`. We use `dropdown.classList.remove('hidden');`.
# Maybe the opacity is 0 or it's animating?
# The class: absolute top-full left-0 mt-2 w-56 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 hidden

new_content = re.sub(
    r"dropdown\.className = 'absolute top-full left-0 mt-2 w-56 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 hidden';",
    "dropdown.className = 'absolute top-full left-0 mt-2 w-56 rounded-md border bg-popover text-popover-foreground shadow-md outline-none hidden';\n            dropdown.style.display = 'none';",
    content
)

new_content = re.sub(
    r"dropdown\.classList\.remove\('hidden'\);",
    "dropdown.classList.remove('hidden');\n                dropdown.style.display = 'block';\n                dropdown.style.opacity = '1';\n                dropdown.style.visibility = 'visible';",
    new_content
)

new_content = re.sub(
    r"dropdown\.classList\.add\('hidden'\);",
    "dropdown.classList.add('hidden');\n                    dropdown.style.display = 'none';",
    new_content
)

with open("js/navigation.js", "w") as f:
    f.write(new_content)

print("Updated js/navigation.js")
