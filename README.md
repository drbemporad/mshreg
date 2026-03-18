# MSH Laws & Regulations — PWA

Offline reference app for Montana State Hospital statutes and administrative rules.

**Covers:**
- MCA Title 53, Chapter 21, Parts 1 & 6 (Treatment of the Seriously Mentally Ill; Montana State Hospital)
- ARM 37.106.3 (Construction & Minimum Standards — All Health Care Facilities)
- ARM 37.106.4 (Minimum Standards for a Hospital)

---

## Deploy to GitHub Pages

1. **Create a new GitHub repository** (public, any name — e.g. `msh-regs`)

2. **Push these files to the repo root:**
   ```
   index.html
   manifest.json
   sw.js
   icon-192.png
   icon-512.png
   README.md
   ```

3. **Enable GitHub Pages:**
   - Go to **Settings → Pages**
   - Source: **Deploy from a branch**
   - Branch: `main` (or `master`), folder: `/ (root)`
   - Click **Save**

4. Your app will be live at:
   ```
   https://<your-username>.github.io/<repo-name>/
   ```

---

## Install to Android Homescreen (Chrome)

1. Open the GitHub Pages URL in **Chrome on Android**
2. Tap the **⋮ menu → Add to Home screen**
3. Confirm — the app icon appears on your homescreen
4. Launch it like a native app (no browser chrome, works fully offline)

> Chrome requires HTTPS for PWA install prompts. GitHub Pages serves over HTTPS automatically — no configuration needed.

---

## Updates

The app uses a **cache-first** strategy:

- **First load / offline:** served instantly from the device cache
- **When online:** the service worker silently fetches the latest `index.html` in the background and compares it to the cached version
- **If changed:** a green banner appears at the bottom of the screen: *"A newer version is available"* with a **Reload** button
- Tapping **Reload** loads the updated version immediately
- Tapping **Later** dismisses the banner for that session

**To push an update:** simply commit changes to `index.html` and push to GitHub. The next time a user opens the app while online, the update banner will appear within a few seconds.

If you also change `sw.js`, bump the `CACHE_NAME` version string (e.g. `msh-regs-v1` → `msh-regs-v2`) to force all cached assets to be refreshed.

---

## File Structure

```
msh-regs/
├── index.html      ← The entire app (HTML + CSS + JS, self-contained)
├── manifest.json   ← PWA identity, icons, display mode
├── sw.js           ← Service worker (offline cache + update detection)
├── icon-192.png    ← Android homescreen icon (192×192)
├── icon-512.png    ← Splash screen / high-res icon (512×512)
└── README.md
```

---

## Offline Behavior

Once installed (or visited once while online), the app runs fully offline. All content is embedded in `index.html` — no external API calls, no CDN dependencies at runtime.

> Note: Google Fonts (`Playfair Display`, `Source Serif 4`, `JetBrains Mono`) are loaded from `fonts.googleapis.com` on first load if online. If offline on first load, the browser falls back to system serif/monospace fonts. After any online visit, fonts may be cached by the browser's own cache independently of the service worker.

---

*Source: Montana Code Annotated 2023/2025 · ARM Title 37 · Verify current text at leg.mt.gov and rules.mt.gov*
