# Prerendered social link previews

## What this is

The site is a client-rendered SPA. Social crawlers (Facebook, LinkedIn,
WhatsApp, X, Slack, iMessage…) **do not run JavaScript** — they read the raw
HTML at a URL. Without help, every shared link falls back to the homepage's
Open Graph tags (profile photo + site title), regardless of which page/article
was shared.

`scripts/prerender.mjs` (run automatically at the end of `npm run build`) fixes
this. It reads the built `dist/index.html` as a template and writes a real
static HTML file per route with that route's own `<title>`, description, and
Open Graph / Twitter tags baked in:

```
dist/index.html                         ← homepage (unchanged)
dist/projects/index.html                ← /projects
dist/experience/index.html              ← /experience
dist/blog/index.html                    ← /blog
dist/contact/index.html                 ← /contact
dist/blog/<slug>/index.html             ← one per published post
dist/sitemap.xml                         ← regenerated with every post + cover image
```

It also injects **`BlogPosting`** structured data into each article (so search
engines surface the post for its topic) and **`ContactPage`** data into
`/contact`, and **regenerates `dist/sitemap.xml`** to list every post (the
`public/sitemap.xml` is only a dev/preview fallback — the generated `dist`
version is what ships and always reflects the current posts).

Article files use `og:type=article` and the post's **cover image** as
`og:image` (absolute URL), so previews show the article title + image instead
of the portrait.

The post data comes from `src/features/blog/services/posts.data.ts`, which is
kept import-free so Node can import it directly (native TS type-stripping).
**Don't add runtime imports to that file** or the prerender step will fail.

## Required one-time hosting setup (CloudFront)

`aws s3 sync` uploads the prerendered files, but CloudFront must map a clean URL
like `/blog/<slug>` to the object `blog/<slug>/index.html`. Add a **CloudFront
Function** on the **viewer-request** event of the distribution's default
behavior:

```js
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Static assets (have a file extension) pass through untouched.
  if (uri.indexOf('.') !== -1 && !uri.endsWith('/')) {
    return request;
  }
  // "/" -> "/index.html"
  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
  } else {
    // "/blog/foo" -> "/blog/foo/index.html"
    request.uri = uri + '/index.html';
  }
  return request;
}
```

How it behaves:

- `/blog/name-mangling-in-python` → `/blog/name-mangling-in-python/index.html`
  (the prerendered file exists → served directly, crawler sees article tags). ✅
- `/projects`, `/experience`, `/blog`, `/contact` → their prerendered files. ✅
- `/assets/index-abc.js` → has an extension → passes through. ✅
- A route with **no** prerendered file (e.g. `/blog/tag/python`, `/admin`) →
  the object doesn't exist → CloudFront's existing SPA error-response
  (403/404 → `/index.html`, HTTP 200) serves the app, which then client-routes
  as before. ✅

### Steps

1. CloudFront console → **Functions** → create a function → paste the code
   above → **Publish**.
2. Open the distribution → **Behaviors** → edit the default (`*`) behavior →
   under **Function associations**, set **Viewer request** = this function →
   save.
3. Confirm the SPA fallback still exists: distribution → **Error pages** →
   `403` and `404` → response page path `/index.html`, response code `200`.
   (This is almost certainly already configured — it's what makes deep links
   work today.)

> If your origin is an **S3 *website* endpoint** (not the REST/OAC endpoint),
> S3 already resolves `…/` to `index.html`, so the function is only needed to
> turn `/blog/foo` into `/blog/foo/` — the same code handles it.

Deploys already invalidate `/*`, so no cache change is needed.

## Verifying

After a deploy, test the raw HTML a crawler would see (no JS):

```bash
curl -s https://sharadbhandari.com.np/blog/name-mangling-in-python \
  | grep -E 'og:title|og:image'
```

Then use the official preview debuggers (they also refresh their cache):

- Facebook / WhatsApp: https://developers.facebook.com/tools/debug/
- LinkedIn: https://www.linkedin.com/post-inspector/
- X: paste the link in a draft post

## Adding posts later

When the blog moves to a real backend, this static prerender only covers the
posts present at build time. At that point switch to one of: rebuild on publish
(webhook → CI), an SSG framework, or a prerender-at-edge service. Until then,
new posts added to `posts.data.ts` are covered automatically on the next build.
