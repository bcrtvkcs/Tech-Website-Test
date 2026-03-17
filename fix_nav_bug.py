import re

with open("js/navigation.js", "r") as f:
    content = f.read()

# Make sure we didn't duplicate the fix.
if "key.split('\\n')[0]" in content:
    print("Fix already applied.")
else:
    print("Fix not found!")
