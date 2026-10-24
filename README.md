# TPG Game Video Check

Coach tool for The Perfect Goalie: record goalie game-video scenes on the phone, present them on the Mac (Zoom), and generate the Game Video Check PDF.

- Static site, no build step. Netlify publishes this folder as-is (`netlify.toml`).
- Sign-in and data: XquiX Studio Supabase project (publishable key only). Only the Game Tracker inbox (`gc_scene_marks`) lives in XquiX Studio, owned and migrated by XquiX Studio. Game Checks themselves are stored on the device.
- `vendor/` holds pinned copies of supabase-js 2.45.4, jsPDF 2.5.1 and pdf.js 3.11.174 so the app works offline.
