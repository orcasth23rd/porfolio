# Marián — UX/UI Design Portfolio

A hand-coded portfolio site — plain HTML, CSS and JavaScript. No framework, no build step, no dependencies. Served as static files on GitHub Pages.

**Live site:** _add the URL here once Pages is switched on_

## Structure

```
.
├── index.html                 ← homepage: hero, selected work, about, experience, contact
├── projects/
│   ├── project-02.html        ← Running App — wearable UI design
│   └── project-03.html        ← graphic design (in progress)
├── css/style.css              ← design tokens + all styling
├── js/main.js                 ← theme toggle, mobile nav, scroll reveal, hero tilt, scroll progress
└── assets/images/             ← project imagery, portrait, favicon
```

Each card in the homepage's "Selected work" grid links to its matching page in `projects/`. Adding a fourth project means duplicating one of those files and adding one `<a class="work-card">` block to `index.html` — no CSS changes needed.

## Preview it locally

No build tools required. Either open `index.html` directly in a browser, or — to match exactly how it behaves online — run a small local server from this folder:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a new **public** repository on GitHub. Naming it exactly `<your-username>.github.io` serves the site from the root of that domain, which reads better on a CV than a `/repo-name/` subpath.
2. Push this folder to it:
   ```
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```
3. In the repo on GitHub: **Settings → Pages → Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`, and save.
4. The site goes live a minute or two later at `https://<your-username>.github.io/` (or `.../<repo-name>/`).

Every push to `main` redeploys automatically.

### Connecting a custom domain later

1. Add a file named `CNAME` (no extension) at the repo root containing just the domain, e.g. `marianbado.com`.
2. At the registrar, add DNS records — for an apex domain, four `A` records pointing at `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; for a `www` subdomain, a `CNAME` record pointing at `<your-username>.github.io`.
3. Back in **Settings → Pages**, enter the domain and enable **Enforce HTTPS** once it becomes available (can take up to 24 hours after DNS propagates).

## Design notes

The palette and type scale live as CSS custom properties at the top of `css/style.css` — changing a value there updates the whole site in both light and dark mode. Current palette: `#fafafa` ground, `#121212` text, `#5a5a5a` and `#ababab` greys, and `#2563eb` as the single accent.

Type is Satoshi, loaded from Fontshare, falling back to Inter and then system sans — if Fontshare is ever unreachable the site degrades cleanly rather than breaking.

Dark and light mode follow the visitor's system setting, with a header toggle to override (remembered in `localStorage`). Motion — scroll reveal, hero photo tilt, page transitions, the scroll progress bar — all respect `prefers-reduced-motion`, and the tilt is skipped on touch devices where it has no meaning. Open Graph tags are in place on every page so shared links render properly on LinkedIn.

## Still to add

- Real screenshots for the Running App case study (currently placeholder graphics)
- The graphic design case study (`projects/project-03.html`)
- Portrait photo, `assets/resume.pdf`, and the LinkedIn / GitHub / Figma profile links in the Contact section
- Once the site is live: change the `og:image` tags in each HTML file from relative paths to full `https://` URLs, so link previews render on LinkedIn and in email
