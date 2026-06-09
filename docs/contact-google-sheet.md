# Contact form → Google Sheet (free, no backend, no API key)

This routes every contact-form submission into a Google Sheet you own, and
emails you a copy — using a Google Apps Script "Web App". It's free and needs
no API key.

## 1. Create the Sheet
1. Go to <https://sheets.google.com> and create a new blank spreadsheet
   (e.g. name it **Portfolio Contacts**).

## 2. Add the script
1. In the sheet: **Extensions → Apps Script**.
2. Delete any placeholder code and paste the entire contents of
   [`google-apps-script.gs`](./google-apps-script.gs) (in this folder).
3. Set `NOTIFY_EMAIL` at the top to the address you want notifications at
   (default is `ersharadbhandari@gmail.com`).
4. Click the **Save** (disk) icon.

## 3. Deploy as a Web App
1. Click **Deploy → New deployment**.
2. Click the gear icon → choose **Web app**.
3. Configure:
   - **Description**: `portfolio contact`
   - **Execute as**: **Me**
   - **Who has access**: **Anyone**  ← important, so the public site can post
4. Click **Deploy**. Approve the permissions prompt (Google will warn it's an
   "unverified app" — that's expected for your own script; click *Advanced →
   Go to … (unsafe)* and allow).
5. Copy the **Web app URL** (looks like
   `https://script.google.com/macros/s/AKfy…/exec`).

## 4. Wire it into the site
1. In your project root, create a `.env` file (copy from `.env.example`).
2. Set:
   ```
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfy…/exec
   ```
3. Rebuild / redeploy. Done — submissions now land in the Sheet and your inbox.

> **Note:** environment variables are read at *build time* by Vite. Set
> `VITE_GOOGLE_SCRIPT_URL` in your CI/CD (GitHub Actions) environment too, or
> the production build won't include it. If you only set it locally, the
> deployed site keeps using the WhatsApp fallback.

## Updating the script later
If you change the script, **Deploy → Manage deployments → edit → New version**.
Re-deploying with a *new deployment* gives a new URL; editing the existing
deployment keeps the same URL (preferred).
