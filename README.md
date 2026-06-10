# Spots

Spots is a responsive, single-page social app where users manage a profile and share image "spots." It fetches data from a REST API and supports the full set of CRUD interactions — editing the profile and avatar, adding and deleting posts, and liking/unliking cards — all wrapped in accessible modals with real-time form validation.

## Live Demo

https://alvarez-j1.github.io/se_project_spots/

## Features

- **Live data via REST API** — loads the user profile and existing cards on page load.
- **Edit profile** — update name and description (persisted to the API).
- **Edit avatar** — update the profile picture from an image URL.
- **Add posts** — create a new card with an image link and caption.
- **Like / unlike** — toggle likes with the like state synced to the server.
- **Delete with confirmation** — remove a card only after confirming in a dedicated modal.
- **Image preview** — click a card image to open a full-size preview.
- **Real-time form validation** — inline error messages and a submit button that stays disabled until input is valid.
- **Accessible modals** — close via the close button, clicking the overlay, or pressing `Escape`; icon-only controls have descriptive labels.
- **Loading states** — submit buttons show "Saving…"/"Deleting…" during in-flight requests.
- **Responsive layout** — optimized for desktop and mobile, down to 320px.

## Tech Stack

- HTML5 & CSS3 (Flexbox, CSS Grid)
- JavaScript (ES6+), organized into modules
- BEM methodology for CSS naming
- REST API integration via the Fetch API
- Webpack (bundling), Babel (transpiling), PostCSS (autoprefixer + cssnano)
- normalize.css
- GitHub Pages deployment via `gh-pages`

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm

### Installation

```bash
git clone https://github.com/Alvarez-J1/se_project_spots.git
cd se_project_spots
npm install
```

### Available Scripts

- `npm run dev` — start the development server with live reload.
- `npm run build` — create an optimized production build in `dist/`.
- `npm run deploy` — build and publish to GitHub Pages.

## Project Structure

```text
src/
  blocks/    BEM component styles (profile, cards, modal, header, footer, …)
  images/    SVG icons and assets
  pages/     entry point (index.js), page styles, form validation
  utils/     API client (Api.js) and helpers
  vendor/    normalize.css and fonts
  index.html
```
