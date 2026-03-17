with open("js/navigation.js", "r") as f:
    content = f.read()

# We need to target the LI, right now btn.parentElement is a DIV? Wait, what is btn.parentElement?
# Let's check index.htm structure for the buttons
