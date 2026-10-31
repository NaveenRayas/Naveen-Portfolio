# Naveen C — Portfolio

A complete, static personal portfolio for **Naveen C**, Full Stack Developer. Built with HTML5, CSS3 and vanilla JavaScript, with no backend, database or build step.

The site is designed to deploy directly to GitHub Pages at:

```text
https://YOUR-USERNAME.github.io/naveen-portfolio/
```

## Features

- Premium dark theme with blue, cyan and purple gradient accents
- Responsive layouts for mobile, tablet and desktop
- Animated hero, typing effect, scroll reveals, marquee and hover states
- Sticky header with scroll progress and active-section navigation
- Accessible mobile navigation with keyboard support and focus management
- Profile photograph with a built-in initials fallback
- Three project cards with custom CSS interface previews
- Education timeline and certification cards
- Contact section with email, LinkedIn, GitHub and a copy-email button
- No contact form, phone number, fake statistics or invented experience
- Reduced-motion support and keyboard-visible focus styles

## Project structure

```text
naveen-portfolio/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── profile.jpg
│   └── favicon.svg
├── README.md
└── render.yaml
```

## Add your photograph

Replace `assets/profile.jpg` with your own portrait. Keep the same filename and a portrait-friendly aspect ratio (for example 4:5 or 3:4). The image uses `object-fit: cover`.

If the file is missing or fails to load, the site automatically shows a styled **NC** initials placeholder.

## Run locally in VS Code

1. Open the project folder in VS Code.
2. Install the **Live Server** extension by Ritwick Dey.
3. Right-click `index.html` and choose **Open with Live Server**.
4. The site opens at a local address such as `http://127.0.0.1:5500/`.

Alternatively, use a terminal:

```bash
# With Node.js installed
npx serve .

# On Windows PowerShell, if npx is blocked by the execution policy
npx.cmd serve .

# Or with Python installed
python -m http.server 5500
```

Then visit `http://localhost:3000` (for `serve`) or `http://localhost:5500` (for Python).

Because this is a static website, opening `index.html` directly in a browser also works. A local server is recommended for consistent asset paths.

## Upload to GitHub

Create a new empty repository named `naveen-portfolio` on GitHub, then run the following from this folder.

```bash
git init
git add .
git commit -m "Build Naveen C portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/naveen-portfolio.git
git push -u origin main
```

This folder should be its own Git repository. If it is nested inside a larger local repository, copy or move the portfolio folder to a separate location before running the commands, so only the portfolio is pushed.

## Enable GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch **main** and folder **/ (root)**.
5. Click **Save**.
6. GitHub will publish the site at:

```text
https://YOUR-USERNAME.github.io/naveen-portfolio/
```

The first deployment can take a minute or two. All paths in this project are relative, so no extra configuration is required for the project subpath.

## Optional: deploy with Render

A `render.yaml` file is included for Render's static site runtime.

1. Push the repository to GitHub.
2. In Render, choose **New → Static Site** and connect the repository.
3. Render reads `render.yaml`, publishes the repository root and applies basic security headers.
4. Deploy. The GitHub Pages workflow remains the primary deployment method.

## Customization checklist

- Replace `assets/profile.jpg` with your photograph.
- Update the email address in `index.html` if it changes. It appears in the hero, mobile menu, contact section, footer and the copy button's `data-email` attribute.
- Update LinkedIn and GitHub URLs in `index.html` if the handles change.
- Update `assets/favicon.svg` if you want a different monogram.
- Update project links if repositories move.

## Notes

- The contact section intentionally uses direct email and social links instead of a fake form.
- Project preview interfaces are decorative CSS mockups, not screenshots or claims about live data.
- No personal phone number is displayed.
- The copyright year is generated dynamically in `script.js`.
- Certification cards contain only the information supplied: provider and certification name. No credential IDs or dates are invented.
