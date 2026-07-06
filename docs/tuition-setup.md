# Python tuition enrolments → its own Google Sheet + email

The `/tuition` ("Learn Python with Me") page lets visitors browse your Python
courses and enroll in a batch. Each enrolment is **saved to a Google Sheet you
own and emailed to you** — using the same free, backend-free, no-API-key Google
Apps Script mechanism the contact form uses. **No payment is taken online**; you
follow up to confirm the seat and arrange payment.

This guide sets up enrolments in a **separate sheet + separate URL** from your
contact messages, so the two never mix.

---

## How it works
1. Visitor opens **Learn Python with Me** (`/tuition`), picks a course, clicks
   **Enroll**, chooses a batch, and submits their details.
2. Your site POSTs the enrolment to your **enrolment** Apps Script URL
   (`VITE_ENROLLMENT_SCRIPT_URL`).
3. You get an **email** + a new row in the **Enrollments** sheet.
4. If no URL is configured, it safely falls back to Web3Forms, then to a
   prefilled **WhatsApp** message — so an enrolment is never lost.

Data captured per enrolment:
`Timestamp, Name, Email, Phone, Course, Batch, Level, Goals, Location
(city-level from IP), IP, Source`.

---

## ✅ Manual setup checklist — what you need to do

Everything below is done by **you**, once. It takes ~10 minutes. No coding.

### 1. Create the enrolment Google Sheet
- Go to <https://sheets.google.com> → **Blank spreadsheet**.
- Name it e.g. **Python Enrollments** (keep it separate from your contacts sheet).

### 2. Add the script
- In that sheet: **Extensions → Apps Script**.
- Delete any placeholder code and paste the **entire** contents of
  [`enrollment-apps-script.gs`](./enrollment-apps-script.gs).
- Check `NOTIFY_EMAIL` at the top is the address you want enrolment alerts at
  (default: `ersharadbhandari@gmail.com`).
- Click **Save** (💾).

### 3. Deploy it as a Web App
- **Deploy → New deployment**.
- Click the gear ⚙️ → choose **Web app**.
- Set:
  - **Description**: `python enrolments`
  - **Execute as**: **Me**
  - **Who has access**: **Anyone**  ← required, so the public site can post.
- Click **Deploy** and approve the permissions prompt. Google warns it's an
  "unverified app" — that's expected for your own script: click
  *Advanced → Go to … (unsafe)* and allow.
- **Copy the Web app URL** (looks like
  `https://script.google.com/macros/s/AKfy…/exec`).
- (Optional sanity check: open that URL in a browser — it should say
  *"Portfolio contact + enrolment endpoint is live."*)

### 4. Add the URL to your site's environment
- In the project root, add to your `.env` (copy from
  [`.env.example`](../.env.example)):
  ```
  VITE_ENROLLMENT_SCRIPT_URL=https://script.google.com/macros/s/AKfy…/exec
  ```
- **Important:** Vite reads env vars at **build time**. Add the same variable
  to your **GitHub Actions / hosting environment** too, or the deployed site
  won't include it and will fall back to WhatsApp. (Set it wherever
  `VITE_GOOGLE_SCRIPT_URL` is already configured for production.)

### 5. Rebuild / redeploy
- Push to `main` (your normal deploy) or run `npm run build`. Done — enrolments
  now land in your **Python Enrollments** sheet and your inbox.

### 6. Fill in your real courses & timings
Edit [`src/content/site.ts`](../src/content/site.ts):
- **`courses`** — title, level, summary, duration, `sessionsPerWeek`, `price`
  (display only — no payment is taken), highlights, and an `icon` (lucide key:
  `code`, `boxes`, `server`, `terminal`, `graduation`, `sparkles`, `database`,
  `zap`, …). Each course also has:
  - **`days`** — the weekdays it meets, e.g. `'Sun / Tue / Thu'`. Split days
    across the week so courses never clash (the samples use Beginner 3 days,
    DSA 2 days, Backend 2 days = one full week, no overlap).
  - **`startDate`**, **`seats`** (capacity), and **`status`**
    (`open` | `filling` | `closed`). Set a course `closed` once it fills — it
    shows as *Full*. **Seats are tracked by you, by hand, against the sheet.**
- **`batches`** — the two **shared time slots** every course offers
  (Morning `7:00–8:00 AM`, Evening `7:00–8:00 PM`). Same times for all courses;
  only the days differ. Edit these once to change the class times site-wide.

---

## Later: updating the script
Change the script → **Deploy → Manage deployments → edit (✏️) the existing
deployment → Version: _New version_ → Deploy.** Editing the existing deployment
keeps the **same URL** (nothing to change in your env). Creating a *new*
deployment gives a new URL (you'd then update `VITE_ENROLLMENT_SCRIPT_URL`).

## Alternative: one sheet for both contact + enrolments
If you'd rather **not** keep a separate sheet, skip
`VITE_ENROLLMENT_SCRIPT_URL`. The enrol form then falls back to
`VITE_GOOGLE_SCRIPT_URL` (your contact endpoint). The provided
`enrollment-apps-script.gs` handles **both** message types and routes them to
separate tabs (`Contacts` and `Enrollments`) within the same spreadsheet — so
you'd paste that script into your existing contact sheet and redeploy it. A
separate URL (the checklist above) is cleaner and recommended.

## Delivery fallbacks (no setup needed)
With no Apps Script URL and no Web3Forms key configured, the enrol form opens a
**prefilled WhatsApp message** to `VITE_WHATSAPP_NUMBER` (or `profile.whatsapp`).
WhatsApp is also offered as an explicit "Or WhatsApp" option and shown if a
submission errors — so enrolments are never lost.
