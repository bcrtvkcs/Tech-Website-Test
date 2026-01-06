import os

def inject_scripts(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Determine relative path to js/ folder
    rel_path = os.path.relpath('.', os.path.dirname(filepath))
    if rel_path == '.':
        script_prefix = "js/"
    else:
        script_prefix = os.path.relpath('.', os.path.dirname(filepath)).replace(os.sep, '/') + '/js/'

    injection = f'<script src="{script_prefix}translations.js"></script><script src="{script_prefix}language_manager.js"></script>'

    if injection in content:
        print(f"Skipping {filepath}, already injected.")
        return

    # Replace </body> with scripts + </body>
    if '</body>' in content:
        new_content = content.replace('</body>', f'{injection}</body>')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Injected into {filepath}")
    else:
        print(f"No body tag in {filepath}")

# Walk and process
for root, dirs, files in os.walk('.'):
    if '_next' in root or '.git' in root or 'js' in root:
        continue
    for file in files:
        if file.endswith('.htm'):
            inject_scripts(os.path.join(root, file))
