with open("js/navigation.js", "r") as f:
    content = f.read()

target = "let key = Array.from(btn.childNodes).find(n => n.nodeType === 3)?.textContent.trim() || btn.textContent.trim();"
replacement = """
        let rawText = btn.textContent;
        let key = rawText.replace(/\\s+/g, ' ').trim().split(' ')[0];
        if (rawText.includes('Solutions')) key = 'Solutions';
        if (rawText.includes('Industries')) key = 'Industries';
        if (rawText.includes('Services')) key = 'Services';
        console.log('Processed Key:', key);
"""

new_content = content.replace(target, replacement)

with open("js/navigation.js", "w") as f:
    f.write(new_content)

print("Updated js/navigation.js")
