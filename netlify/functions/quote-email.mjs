// Emails a branded notification through Resend when Netlify verifies a quote form submission.
// Set in Netlify's environment variables:
//   RESEND_API_KEY   Resend API key
//   QUOTE_EMAIL_TO   Who receives requests (comma-separate several addresses)
//   QUOTE_EMAIL_FROM Sender, e.g. Got It Maid Website <quotes@notifications.example.com>

import { renderQuoteEmail } from '../quote-email-template.mjs';

export default {
  async formSubmitted(event) {
    const { RESEND_API_KEY, QUOTE_EMAIL_TO, QUOTE_EMAIL_FROM } = process.env;
    if (!RESEND_API_KEY || !QUOTE_EMAIL_TO || !QUOTE_EMAIL_FROM) {
      throw new Error('Missing RESEND_API_KEY, QUOTE_EMAIL_TO or QUOTE_EMAIL_FROM');
    }

    const siteUrl = process.env.URL || 'https://gotitmaid.netlify.app';
    const { subject, html, text, replyTo } = renderQuoteEmail(event.data, `${siteUrl}/assets/images/email-logo.png`);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: QUOTE_EMAIL_FROM,
        to: QUOTE_EMAIL_TO.split(',').map((address) => address.trim()).filter(Boolean),
        subject,
        html,
        text,
        ...(replyTo && { reply_to: replyTo }),
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend returned ${response.status}: ${await response.text()}`);
    }
  },
};
