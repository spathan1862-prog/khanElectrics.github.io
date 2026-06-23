# images/apps/

Place your app icon image files in this folder.

## Supported formats
- `.png`  — recommended (supports transparency)
- `.svg`  — vector, scales perfectly
- `.webp` — smaller file size

## Recommended size
**512 × 512 px** — the card will scale it down to 72 × 72 px.

## How the filenames map to apps.js

Each entry in the `apps` array in `js/apps.js` has an `icon` property.
Set it to the path relative to `apps.html`, e.g. `"images/apps/medical.png"`.

If `icon` is left as an empty string `""`, the page automatically shows
a platform icon (monitor for Windows, smartphone for Android) instead.

## Current expected icons

| File            | App                          |
|-----------------|------------------------------|
| medical.png     | Medical Management Software  |
