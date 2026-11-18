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

## Search visibility (SEO)
Every listing gets its own indexable page at `/marketplace/<slug>` (e.g.
[`/marketplace/bereach`](https://sharadbhandari.com.np/marketplace/bereach)),
built to rank for searches like *"expense tracker app source code"*.

- **Copy lives in `products`** in `src/content/site.ts`: `seo.title`,
  `seo.description`, `seo.keywords`, `overview`, `sections`, `audiences`,
  `faq`, `platforms`. Use the words a buyer would type — they're reused in the
  `<title>`, meta description, visible headings and structured data.
- **Prerendered** by `scripts/prerender.mjs` into
  `dist/marketplace/<slug>/index.html` with the full text in the HTML (no JS
  needed), plus `Product` + `SoftwareApplication`, `BreadcrumbList` and
  `FAQPage` JSON-LD from `src/features/marketplace/seo.ts` (shared with the
  React page), and a sitemap entry with the share image.
- **Share image**: `ogImage` (1200×630, e.g. `/images/marketplace/bereach-og.png`)
  is what Google Images, WhatsApp, Facebook and LinkedIn show for the link.

After deploying to `main`:
1. Google Search Console → **URL inspection** → paste the product URL →
   **Request indexing**. Also resubmit `sitemap.xml` under **Sitemaps**.
2. Check the structured data with Google's
   [Rich Results Test](https://search.google.com/test/rich-results).
3. Ranking takes weeks. Links pointing at the product page (LinkedIn posts,
   a blog article, the BeReach app's own website, GitHub READMEs) speed it up
   more than anything on the page itself.

> The asking price is published in the structured data — set the real price
> before deploying.
