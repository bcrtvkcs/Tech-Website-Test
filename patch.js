const fs = require('fs');
let code = fs.readFileSync('js/navigation.js', 'utf8');
code = code.replace("// dropdown.style.display = 'none';", "dropdown.style.display = 'none';");
fs.writeFileSync('js/navigation.js', code);
