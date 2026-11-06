# Zohaib Majeed - Portfolio

A streaming-style personal portfolio with four profile views and a password-protected admin page.

- `index.html` - the portfolio (reads its content from `/content.json`)
- `admin.html` - admin editor (log in with the admin password, edit content, save)
- `api/content.js` - serves the saved content from Vercel Blob
- `api/save.js` - saves content (checks the admin password)

## Deploy on Vercel
1. Import this repo in Vercel (Framework: Other).
2. Create a Blob store and connect it to the project (adds `BLOB_READ_WRITE_TOKEN`).
3. Add env var `ADMIN_HASH` = SHA-256 hex of your admin password
   (e.g. run: `echo -n "yourpassword" | sha256sum`). Never commit the password itself.
4. Deploy. Open `/admin.html`, log in and save once so the content exists.
