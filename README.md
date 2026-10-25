# ADMISK Investment Limited – website (Angular 21 + Tailwind CSS v4)

## Run
```bash
npm install
npm start        # http://localhost:4200
npm run build    # output in dist/
```
Requires Node 20.19+ / 22.12+ / 24+.

## Where things live
- `src/app/content.ts` – all company text (divisions, offices, vision 2030, roadmap, etc.)
- `src/app/media.ts` – every image and video URL (placeholders: picsum.photos + an MDN CC0 clip). Replace with your own files, e.g. put them in `public/` and use `/hero.mp4`.
- `src/app/pages.ts` – page components (Home, About, Divisions, Division detail, Solutions, Vision 2030, Why ADMISK, Roadmap, Contact)
- `src/app/app.ts` – header, mobile menu, footer
- `src/styles.css` – Tailwind v4 theme tokens (colors, font)

## To do before launch
- Replace the placeholder logo (blue "C" mark in `app.ts`) with the real logo.
- Confirm the email (`COMPANY.email`) and the company name (`COMPANY.name` / `legal`).
- Contact form opens a mailto draft; connect a form backend when ready.
