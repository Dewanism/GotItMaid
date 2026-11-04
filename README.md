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
js/main.js          Mobile menu, scroll reveal, nav highlight
assets/images/      Logos, headshot, icons, share image (WebP, with -400/-560/-240/-210 sizes for srcset)
assets/fonts/       Self-hosted Rubik and Pacifico (latin subsets, SIL Open Font License)
```

The quote form uses Netlify Forms and redirects to `/thank-you.html` after a submission. It only works when deployed on Netlify.

## Deploy

Hosted on Netlify, with static files and no build step. In the Netlify dashboard, enable form detection and then redeploy.

New quote requests are emailed by `netlify/functions/quote-email.mjs` through [Resend](https://resend.com), using the design in `netlify/quote-email-template.mjs`. Set these in Netlify's environment variables, then redeploy:

- `RESEND_API_KEY`: Resend API key
- `QUOTE_EMAIL_TO`: who receives requests (comma-separate several addresses)
- `QUOTE_EMAIL_FROM`: the sender, on a domain verified in Resend

Keep Netlify's own form notification on as a backup. It can only send to Netlify team members.
