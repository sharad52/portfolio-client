# Marketplace offers → Google Sheet + email

The `/marketplace` page lists applications you sell. Visitors either **Buy now**
(at the asking price) or **Make an offer** (any amount ≥ the listing's
`minimumBid`). Each request is **saved to an "Offers" tab in a Google Sheet you
own and emailed to you** — the same backend-free Apps Script mechanism as the
contact form and tuition enrolments. **No payment is taken online**; you reply
to accept / counter, then arrange payment and handover.

## How it works
1. Visitor opens **Marketplace**, clicks **Buy now** or **Make an offer**.
2. Bids below `minimumBid` are rejected in the form before sending.
3. The site POSTs `{ type: 'offer', … }` to `VITE_MARKETPLACE_SCRIPT_URL`
   (falls back to `VITE_GOOGLE_SCRIPT_URL`).
4. You get an **email** + a new row in the **Offers** tab:
   `Timestamp, Product, Type, Amount, Name, Email, Phone, Message, Location, IP, Source`.
5. With no Apps Script URL, it falls back to Web3Forms, then a prefilled
   **WhatsApp** message — an offer is never lost.

## ✅ Setup checklist (one-off)
1. Paste the updated [`enrollment-apps-script.gs`](./enrollment-apps-script.gs)
   (it now also handles `type: 'offer'`) into the Apps Script of the sheet you
   want offers in.
2. **Deploy → Manage deployments → edit (✏️) → Version: New version → Deploy.**
   Editing the existing deployment keeps the same URL.
3. Either do nothing more (offers ride on `VITE_GOOGLE_SCRIPT_URL` /
   `VITE_ENROLLMENT_SCRIPT_URL`'s sheet) **or** deploy it from a separate sheet
   and set `VITE_MARKETPLACE_SCRIPT_URL` in `.env` **and** as a GitHub repo
   secret (the deploy workflow already passes it through).
4. Rebuild / redeploy.

> If you go with option "do nothing more", make sure the script at
> `VITE_GOOGLE_SCRIPT_URL` is the updated one — an old script would file
> offers under **Contacts**.

## Managing listings
Edit `products` in [`src/content/site.ts`](../src/content/site.ts):
- `askingPrice` / `minimumBid` — whole numbers in `currency` (`NPR` or `USD`).
  Omit `minimumBid` to disable bidding (Buy now only).
- `status` — `available` | `under-offer` | `sold`. `sold` disables both buttons.
- `logo` — an image under `public/` (e.g. `/images/marketplace/app.webp`);
  falls back to the lucide `icon` key when omitted.
- `features`, `includes`, `techStack`, `demoUrl`, `featured`.

The highest current bid is **not** shown publicly — that would need a readable
backend. You see all bids in the sheet and respond individually.
