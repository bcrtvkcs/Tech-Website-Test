import re

filepath = 'about/index.htm'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

start_indices = [m.start() for m in re.finditer(r'self\.__next_f\.push\(\[', content)]

for start in start_indices:
    chunk = content[start:start+50000]
    str_start = chunk.find("'0:{")
    if str_start != -1:
         # Find closing quote
         cursor = str_start + 1
         escaped = False
         while cursor < len(chunk):
             if escaped:
                 escaped = False
             else:
                 if chunk[cursor] == "\\":
                     escaped = True
                 elif chunk[cursor] == "'":
                     break
             cursor += 1

         # Print end of string
         end_of_str = chunk[cursor-50:cursor+10]
         print(f"End of string context: {end_of_str}")

         # Also check the beginning
         print(f"Start of string context: {chunk[str_start:str_start+50]}")

         # Check if there are any suspicious chars around the closing quote
