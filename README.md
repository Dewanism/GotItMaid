# Got It Maid in the Valley

One-page website for Got It Maid in the Valley Cleaning Services, Chilliwack, BC.
Designed and built by [Promontory Web Designs](https://www.promontorywebdesigns.com).

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Structure

```
index.html          Page content
thank-you.html      Shown after a quote request is sent (noindex)
css/styles.css      Styles and design tokens
js/main.js          Mobile menu, scroll reveal, form placeholder
assets/images/      Logos, headshot, icons, share image
```

When the quote form is connected to a form service, set its success redirect to `/thank-you.html`.

## Deploy

Static files only, so it can be hosted on Netlify, Cloudflare Pages, GitHub Pages or any web host. Upload the folder as is.
