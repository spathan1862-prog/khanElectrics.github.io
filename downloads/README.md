# downloads/

Place your application installer files in this folder.

## Supported file types
- `.exe`  — Windows installers
- `.apk`  — Android packages
- `.dmg`  — macOS packages (if ever needed)

## How the filenames map to apps.js

Each entry in the `apps` array in `js/apps.js` has a `download` property.
The value must match the filename you drop here exactly (case-sensitive).

### Current expected files

| File                          | App                          |
|-------------------------------|------------------------------|
| MedicoManager Setup 2.0.0.exe  | MedicoManager                |

## Steps to add a new installer
1. Copy your `.exe` / `.apk` file into this folder.
2. Open `js/apps.js`.
3. Push a new object into the `apps` array with `download: "downloads/YourFileName.exe"`.
4. Set `available: true` so the Download button appears.
5. Save and deploy.
