# GitHub Profile Explorer

A React app that looks up any GitHub username and displays their profile stats and public repositories, sortable by recent activity, star count, or name.

**Live demo:** _add your deployed link here (e.g. Vercel/Netlify) after deploying_

## Features

- Search any GitHub username using the public GitHub REST API
- Profile overview: avatar, bio, location, company, blog link
- Stats: public repos, followers, following, gists
- Repository grid with stars, forks, primary language, and last-updated date
- Sort repositories by recently updated / most starred / name
- Responsive layout, dark-themed UI
- Graceful handling of invalid usernames and network errors

## Tech Stack

- React 18 (functional components + hooks: `useState`)
- Vite for build tooling
- GitHub REST API (`api.github.com`) — no auth/backend required
- Plain CSS (no framework) with CSS variables for theming

## Getting Started

```bash
npm install
npm run dev
```

Open the printed local URL in your browser.

### Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  App.jsx        # Main component: search form, profile card, repo grid
  index.css      # Global styles
  main.jsx       # App entry point
```

## Possible Next Steps

- Add pagination for users with 100+ repositories
- Cache recent searches in memory
- Add a contribution graph using the GitHub GraphQL API
- Deploy to Vercel/Netlify and link the live demo here

## Author

Nitin Malhotra — [github.com/nitinmalhotra001](https://github.com/nitinmalhotra001)
