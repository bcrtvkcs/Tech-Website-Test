import re
import json

def reproduce_patch():
    filepath = 'about/index.htm'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # --- Locate ---
    match = re.search(r"self\.__next_f\.push\(\[\s*1,\s*'(.*?)'\s*\]\);", content, re.DOTALL)
    # Note: Regex might fail if string has escaped single quotes.
    # But for now let's try the Python manual extraction I used in patch_hydration.

    # ... (Copying the robust extraction logic) ...
    start_indices = [m.start() for m in re.finditer(r'self\.__next_f\.push\(\[', content)]
    target_json_str = None
    target_start_index = -1
    target_end_index = -1

    for start in start_indices:
        chunk = content[start:start+50000]
        str_start = chunk.find("'0:{")
        if str_start != -1:
             cursor = str_start + 1
             extracted = ""
             escaped = False
             str_content_start_abs = start + str_start + 1

             while cursor < len(chunk):
                 char = chunk[cursor]
                 if escaped:
                     extracted += char
                     escaped = False
                 else:
                     if char == "\\":
                         escaped = True
                         extracted += char
                     elif char == "'":
                         break
                     else:
                         extracted += char
                 cursor += 1

             try:
                 decoded = extracted.encode('utf-8').decode('unicode_escape')
                 if "The Company" in decoded:
                     target_json_str = decoded
                     target_start_index = str_content_start_abs
                     target_end_index = start + cursor
                     break
             except Exception:
                 pass

    if not target_json_str:
        print("Could not find block.")
        return

    # --- Parse ---
    json_payload = target_json_str[2:] # Strip 0:
    data = json.loads(json_payload)

    # --- Modify ---
    def find_section_container(node):
        if isinstance(node, list):
            for child in node:
                if isinstance(child, list) and len(child) > 3 and child[0] == "$" and child[1] == "section":
                     props = child[3]
                     if "The Company" in str(props):
                         return node
            for item in node:
                res = find_section_container(item)
                if res: return res
        elif isinstance(node, dict):
             for value in node.values():
                 res = find_section_container(value)
                 if res: return res
        return None

    sections_list = find_section_container(data)

    # Helper to build a section
    def build_section(key, title, p1_children, p2_children=None):
        paragraphs = []
        paragraphs.append(["$", "p", "0", {"className": "leading-relaxed", "children": p1_children}])
        if p2_children:
            paragraphs.append(["$", "p", "1", {"className": "leading-relaxed", "children": p2_children}])
        return ["$", "section", str(key), {"className": "px-6 py-8 md:px-8", "children": ["$", "div", None, {"className": "mx-auto max-w-4xl space-y-4", "children": [["$", "h2", None, {"className": "text-3xl font-bold tracking-tight", "children": title}], paragraphs]}]}]

    aeronix_strong = ["$", "strong", None, {"children": "Aeronix"}]
    vision_p1 = ["At ", aeronix_strong, ", our vision is to be a reliable, innovative, and benchmark technology solution partner that redefines the safety, security, and efficiency standards of organizations conducting critical operations in Turkey with intelligent solutions based on artificial intelligence, computer vision, biometrics, IoT, and video analytics."]
    vision_p2 = "We aim to be a pioneering brand that accelerates digital transformation in different sectors, promotes a data-driven decision-making culture, and brings global technologies together with local needs."
    vision_section = build_section("TEMP_KEY", "Our Vision", vision_p1, vision_p2)

    mission_p1 = ["At ", aeronix_strong, ", our mission is to effectively introduce the advanced technology products and services of Australian-based Aervision to the Turkish market, adding real-time, secure, and sustainable value to the operational processes of organizations operating in a wide range of sectors, from aviation to public sector, healthcare to education, mining to retail."]
    mission_p2 = "With our intelligent system integrations, local expertise, and strong service infrastructure, we offer solutions that reduce risks, increase operational efficiency, and enable organizations to move towards the future with greater confidence."
    mission_section = build_section("TEMP_KEY", "Our Mission", mission_p1, mission_p2)

    new_sections = []
    new_sections.append(sections_list[0])
    new_sections.append(vision_section)
    new_sections.append(mission_section)
    new_sections.extend(sections_list[2:])

    for idx, sec in enumerate(new_sections):
        sec[2] = str(idx)

    sections_list[:] = new_sections

    # --- Serialize ---
    new_json_str = json.dumps(data, separators=(',', ':'))
    full_str = "0:" + new_json_str

    # --- ESCAPING CHECK ---
    # Here is where I suspect the bug lies.
    # full_str contains the valid JSON + "0:".

    # We want to put this into a JS single-quoted string.
    # So we must escape \ and '.

    full_str_js = full_str.replace("\\", "\\\\").replace("'", "\\'")

    # --- Verify Result ---
    # To verify, we simulate JS parsing.
    # JS parsing: \ -> literal, ' -> '
    # So we reverse the replace.

    decoded_js = full_str_js.replace("\\'", "'").replace("\\\\", "\\")

    if decoded_js != full_str:
        print("Round trip failed!")
    else:
        print("Round trip passed.")

    # Check for trailing garbage or weird chars
    print(f"Original length: {len(full_str)}")
    print(f"Escaped length: {len(full_str_js)}")

    if len(full_str) > 13953:
        print(f"Context at 13953: {full_str[13940:13970]}")

    # Apply to content
    new_content = content[:target_start_index] + full_str_js + content[target_end_index:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print("Repatched.")

if __name__ == "__main__":
    reproduce_patch()
