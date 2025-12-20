# Planet Earth Trivia (No External Media)

A simple single-page trivia experience about "Планета Земля" built with vanilla HTML/CSS/JS. The app is GitHub Pages-friendly and ships without binary assets—media slots render placeholders by default.

## Features
- 100-question grid leading to individual trivia cards.
- Optional image/audio support via local assets; falls back to a media placeholder when none are provided.
- Visual feedback for correct/incorrect answers, with an educational fact revealed on correct selections.
- Lightweight Web Audio beep on correct answers (no external files).

## Customizing Questions
- Edit `questions.json` to adjust prompts, answers, and facts. Each entry supports:
  - `mediaType`: `"image"`, `"audio"`, or `"none"` (default).
  - `mediaSrc`: file path relative to the site root; leave empty for the built-in placeholder.
- Keep assets in `assets/images/` or your preferred folder. Avoid committing binary media if you want to stay file-only.

## Running Locally
```bash
python -m http.server 8000
# open http://localhost:8000
```

## Notes
- No binary media files are included; placeholders are shown unless you supply your own.
- Designed for static hosting (client-side only), suitable for GitHub Pages.
