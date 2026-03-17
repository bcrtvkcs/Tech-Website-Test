const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('index.htm', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

const navItems = document.querySelectorAll('nav [data-slot="navigation-menu-item"] button');
console.log('navItems length:', navItems.length);

const navItems2 = document.querySelectorAll('nav li > button');
console.log('navItems2 length:', navItems2.length);
