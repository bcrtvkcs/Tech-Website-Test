document.addEventListener('DOMContentLoaded', () => {
    // A daha robust selector for the theme toggle button based on the SVG classes
    let themeToggleButton = null;
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
        if (btn.querySelector('.lucide-sun') || btn.querySelector('.lucide-moon')) {
            themeToggleButton = btn;
            break;
        }
    }

    if (!themeToggleButton) return;

    themeToggleButton.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
        }

        localStorage.setItem('theme', newTheme);
    });
});
