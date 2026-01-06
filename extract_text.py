from bs4 import BeautifulSoup
import os
import json
import re

# Set of tags to extract text from
TAGS_TO_EXTRACT = {
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'span', 'button', 'li', 'label', 'option', 'strong', 'em', 'small', 'div'
}

# Attributes to extract
ATTRS_TO_EXTRACT = ['alt', 'placeholder', 'title', 'content'] # added content for meta desc

translations = {}

def clean_text(text):
    return ' '.join(text.split())

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')

    # Text nodes
    for element in soup.find_all(text=True):
        if element.parent.name in ['script', 'style', 'noscript']:
            continue
        text = clean_text(element.string)
        if text and len(text) > 1 and not text.isdigit(): # Filter out empty/tiny/numeric strings
             translations[text] = ""

    # Attributes
    for tag in soup.find_all(True):
        for attr in ATTRS_TO_EXTRACT:
            if tag.has_attr(attr):
                # Special case for meta description
                if tag.name == 'meta' and attr == 'content' and tag.get('name') != 'description':
                    continue

                text = clean_text(tag[attr])
                if text and len(text) > 1:
                     translations[text] = ""

# Walk through directories
for root, dirs, files in os.walk('.'):
    if '_next' in root or '.git' in root or 'js' in root:
        continue
    for file in files:
        if file.endswith('.htm'):
            process_file(os.path.join(root, file))

# Create the JS file content
js_content = "const tr_translations = {\n"
for key in sorted(translations.keys()):
    # Escape quotes in keys
    safe_key = key.replace('"', '\\"')
    js_content += f'    "{safe_key}": "",\n'
js_content += "};\n"

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Extracted {len(translations)} strings to js/translations.js")
