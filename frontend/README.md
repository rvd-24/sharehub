# ShareHub Frontend

Static React-in-browser frontend for ShareHub.

## Google Sign-In configuration

Open `index.html` and set:

- `window.GOOGLE_CLIENT_ID` to your Google OAuth Web Client ID
- `window.SHAREHUB_API_BASE` to your backend URL (default: `http://localhost:4000`)

## Run

Serve this folder with any static server, for example:

- VS Code Live Server, or
- `python -m http.server 5500`

Then open `http://localhost:5500/frontend/`.
