# Spotify | By ViratPod — Documentation

A lightweight, static, Spotify-inspired music player built with plain HTML, CSS and JavaScript. This repository is a client-only demo that reads song and playlist data from local JSON files and plays bundled audio assets.

<img src="./assets/icons/spotify-icon.svg" alt="" width="5%">

---

## Table of contents
- About
- Technologies / Languages
- Quick start (run locally)
- Website / Demo
- Features
- Project structure (important files)
- Data format (how to add songs & playlists)
- How the app works (high-level — brief)
- Customization & theming
- Troubleshooting & limitations
- Contributing
- License & credits

---

## About
This is a static, responsive music player UI inspired by Spotify. It demonstrates:
- Dynamic UI rendering from JSON data.
- Core audio controls (play/pause, next/prev, shuffle, repeat, seek, volume).
- Responsive layout and a simple mobile-friendly player bar.

How I made this (short):
- Built with plain HTML, organized CSS, and vanilla JavaScript — no frameworks or build tools.
- Song and playlist data live in local JSON files and are fetched at runtime.
- A single (centralized) audio instance manages playback and simple state (current track, modes).
- Emphasis on a clean, responsive UI and an approachable codebase so others can reuse or extend it.

Result:
- A polished, responsive UI with smooth playback controls suitable as a demo or starter template.

It is intended as a demo / UI template that you can run in any static web server or use as a starting point for a deeper project.

---

## Technologies / Languages used
- HTML5 — structure and semantic layout (`index.html`)
- CSS3 — styling and responsive rules (`styles/*.css`)
- JavaScript (vanilla) — rendering, state & audio controls (`script/index.js`)
- JSON — static content files that hold songs and playlists (`data/song.json`, `data/playlist.json`)
- Assets — images (JPG), icons (SVG), and audio (MP3)

No build tools, frameworks, or bundlers required — this is a plain static site.

---

## Quick start

Important: The app uses fetch() to load local JSON files. Many browsers block fetch() when you open index.html directly with the `file://` protocol. Start a simple HTTP server.

Recommended ways to run locally:

- Using Python 3 (in the project root):
  - python3 -m http.server 8000
  - Open: http://localhost:8000

- Using Node (http-server):
  - npm install -g http-server
  - http-server -p 8000
  - Open: http://localhost:8000

- Or use your editor's Live Server extension (VS Code: "Live Server").

Then open http://localhost:8000 in a modern browser (Chrome, Firefox, Edge, Safari). The UI is responsive and works on desktop and mobile.

---

## Website / Demo
- Author / Repo: [ViratPod · GitHub](https://github.com/virat-pod)
- Live demo (optional): If you publish a live demo (GitHub Pages, Netlify, Vercel, etc.), add the URL here so users can try it online. Example format:
  - Live demo: https://spotify-vibes.vercel.app

Tip: After deploying, replace the example above with your real demo URL so visitors can launch the app without running it locally.

---

## Features
- Dynamic rendering of "song sections" (from data/song.json) and "playlists" (from data/playlist.json).
- Play / Pause, Next / Previous track
- Shuffle and Repeat modes
- Seekable progress bar with current / total time
- Volume control
- Playlist view with album art and song metadata
- Responsive layout with a compact mobile player bar

---

## Project structure (selected files)

Top-level:
- index.html — app entry HTML
- script/index.js — application logic, rendering, audio controls
- data/song.json — songs grouped by sections (Title + songs array)
- data/playlist.json — playlists referencing song IDs and cover art
- styles/ — CSS files:
  - navbar.css
  - layout.css
  - player.css
  - responsive.css
  - scrollbar.css
  - animation.css
- assets/ — images, play covers, and svg icons
- audio/ — bundled mp3 files used by the app

---

## Data format — how to add songs and playlists

All song metadata is stored in `data/song.json`. Each top-level entry represents a section (Title and songs array). Example structure:

data/song.json (example)
```json
[
  {
    "Title": "Top Songs",
    "songs": [
      {
        "id": 1,
        "title": "Gehra Hua",
        "artist": "Arijit Singh",
        "cover": "./assets/covers/gehra_hua.jpg",
        "audio": "./audio/gehra_hua.mp3",
        "duration": "6:02"
      }
      // ... more songs
    ]
  }
  // ... more sections
]
```

- id — unique integer per song across all sections (used by playlists).
- title, artist — displayed in UI.
- cover — relative path to image file.
- audio — relative path to audio file (mp3).
- duration — optional display string.

To add a new song:
1. Add the audio file to `audio/` and a cover image to `assets/covers/`.
2. Add a new song object with a unique id into an existing section in `data/song.json`. Example:
```json
{
  "id": 9,
  "title": "New Song",
  "artist": "Artist Name",
  "cover": "./assets/covers/new_song.jpg",
  "audio": "./audio/new_song.mp3",
  "duration": "3:30"
}
```

Playlists are managed in `data/playlist.json`:

data/playlist.json (example)
```json
[
  {
    "id": "liked",
    "name": "Liked Songs",
    "cover": "./assets/playCovers/liked_img.jpg",
    "songs": [3, 2, 1, 4, 5]
  }
]
```

- id — playlist identifier string.
- name — display name.
- cover — playlist artwork path.
- songs — array of song ids (numbers) referencing ids from `data/song.json`.

Update both JSON files and refresh the page to see changes.

---

## How the JavaScript works (high level — brief)

This is a concise, non-deep summary of the main approach so you can understand how the app is put together:

- Data: fetch() reads `data/song.json` and `data/playlist.json` at startup.
- Rendering: JSON data is rendered into DOM nodes (song sections, song cards, sidebar playlists).
- Playback: a single audio element (or a centralized audio instance) handles play/pause, seeking, volume, and time updates.
- State: the app tracks a currentTrack id and playback modes (shuffle/repeat) to determine next/previous behavior.
- Events: UI controls (card clicks, play button, progress slider, volume) wire to simple event listeners that update the audio element and UI.

If you want to extend things, the code is intentionally straightforward:
- Look at render functions in `script/index.js`.
- Playback control logic is centralized and easy to modify (search for play, progressbar, shuffle, repeat).

---

## Customization & theming

- Change colors & layout:
  - styles/layout.css, styles/player.css, styles/navbar.css contain the main style rules.
  - The player progress/volume use CSS custom properties in linear-gradient backgrounds. Adjust those for brand colors.

- Replace logo / icon:
  - assets/icons/spotify-icon.svg — swap with your own SVG or replace the inline file path.

- Responsive breakpoints:
  - styles/responsive.css contains media queries targeting max-width: 1120px and 480px for mobile behavior.

- Add animations:
  - styles/animation.css includes animation helpers used across elements.

- Swap fonts:
  - In navbar.css you'll find an @import for Google Fonts — replace or augment as needed.

---

## Troubleshooting & known limitations

- fetch() + file:// — If you open index.html by double clicking (file:// protocol) the browser may block fetch requests to local JSON. Use a local HTTP server (see Quick start).
- Cross-browser notes — The app uses standard DOM APIs and HTML5 audio. Test on modern browsers (Chrome/Edge/Firefox/Safari). Mobile Safari may have stricter autoplay/gesture policies: require a user interaction to start audio.
- Large audio files — Bundled MP3s are included; for production, serve optimized streams or use lazy-loading.
- No backend/auth — This is a static demo; there’s no user authentication, persistence, or cloud syncing. Liked songs are not persisted across reloads (unless you add localStorage).
- Accessibility — Basic keyboard and ARIA support are not fully implemented. Consider adding focus states and ARIA attributes for improved a11y.

---

## Quick developer tips & examples

Programmatically add a song (example snippet, update JSON files manually or use a build step):
```json
// add to data/song.json -> songs list
{
  "id": 9,
  "title": "My New Song",
  "artist": "My Artist",
  "cover": "./assets/covers/new.jpg",
  "audio": "./audio/new.mp3",
  "duration": "3:15"
}
```

Add to a playlist (data/playlist.json):
```json
{
  "id": "new-playlist",
  "name": "My Playlist",
  "cover": "./assets/playCovers/my_playlist.jpg",
  "songs": [9, 5, 2]
}
```

Play a song programmatically (conceptual, follow the project's audio logic):
```js
// pseudo-code: locate song by id then call the app's play function
const song = flatSongs.find(s => s.id === 9);
if (song) {
  // set audio.src = song.audio; audio.play();
  // update UI with song.cover, title, artist
}
```

Add localStorage persistence for "liked" songs (suggested):
- When user likes/unlikes a song, update an array in localStorage, then re-render the playlist accordingly.

---

## Contributing

- Fork, create a feature branch, and open a pull request.
- Keep JSON files consistent (unique ids).
- If adding large audio assets, prefer streaming or a remote host to keep repository size manageable.
- Add tests or check cross-browser behavior before submitting major UI changes.

---

## Recommended next steps
- Add localStorage for liked songs and last-played track.
- Implement keyboard shortcuts (space to play/pause, arrow keys to seek).
- Consider extracting a minimal state module to simplify feature additions.
- Add ARIA roles and keyboard navigation for accessibility.

---

## License & credits
- This repository currently has no explicit license file. If you plan to reuse, consider adding a LICENSE (MIT is common for UI templates).
- Author: ViratPod (see index.html link to https://github.com/virat-pod/spotifyByPod)

---

If you want, I can:
- Generate a sample MIT LICENSE file
- Provide a small checklist to convert this into a reusable NPM package or a simple React/Vue project
- Create quick unit tests for the core playback logic
