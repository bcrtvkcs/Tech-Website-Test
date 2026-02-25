# Aeronix Technologies Website

This is a static HTML website for Aeronix Technologies.

## Structure

- `index.htm` and subdirectories: Static HTML pages.
- `css/`: Stylesheets (Tailwind build + Swiper).
- `js/`: JavaScript logic (Navigation, Sliders, Translations, etc.).
- `images/`, `videos/`, `fonts/`: Assets.

## Editing

- **Styles:** `css/main.css` contains the main styles.
- **Scripts:**
  - `js/navigation.js`: Handles desktop dropdowns and mobile menu.
  - `js/sliders.js`: Initializes Swiper carousels.
  - `js/contact.js`: Handles contact form submission (mailto).
  - `js/translations.js`: Contains translation strings.
  - `js/language_manager.js`: Handles language switching.

## Local Development

You can run this site with any static file server, e.g.:

```bash
python3 -m http.server
```
