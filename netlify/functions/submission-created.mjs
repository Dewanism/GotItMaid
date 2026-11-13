// Emails a branded notification through Resend when Netlify verifies a form submission.
// Netlify runs this automatically because of its file name, so don't rename it.
// Set in Netlify's environment variables:
//   RESEND_API_KEY    Resend API key
//   CONTACT_TO_EMAIL  Who receives requests (comma-separate several addresses)

import { renderQuoteEmail } from '../quote-email-template.mjs';

// Sent from Promontory's domain, which is verified in Resend
const FROM = 'Got It Maid Website <forms@contact.promontorywebdesigns.com>';

export default async (req) => {
  console.log('Form submission received');

  const { RESEND_API_KEY, CONTACT_TO_EMAIL } = process.env;
  const missing = [!RESEND_API_KEY && 'RESEND_API_KEY', !CONTACT_TO_EMAIL && 'CONTACT_TO_EMAIL'].filter(Boolean);
  if (missing.length) {
    console.error(`Quote email not sent: missing environment variable ${missing.join(' and ')}. Set it in Netlify and redeploy.`);
    return new Response('Missing configuration', { status: 500 });
  }

  const { payload } = await req.json();
  if (!payload?.data) {
    console.error(`Quote email not sent: unexpected event body, payload keys: ${Object.keys(payload ?? {}).join(', ')}`);
    return new Response('Unexpected event body', { status: 400 });
  }

  const siteUrl = process.env.URL || 'https://gotitmaid.netlify.app';
  const { subject, html, text, replyTo } = renderQuoteEmail(payload.data, `${siteUrl}/assets/images/email-logo.png`);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: CONTACT_TO_EMAIL.split(',').map((address) => address.trim()).filter(Boolean),
        subject,
        html,
        text,
        ...(replyTo && { reply_to: replyTo }),
      }),
    });

    const result = await response.text();
    if (!response.ok) {
      console.error(`Quote email not sent: Resend returned ${response.status}: ${result}`);
      return new Response('Email failed', { status: 502 });
    }
    console.log('Quote email accepted by Resend', result);
    return new Response('ok');
  } catch (error) {
    console.error('Quote email not sent: could not reach Resend', error);
    return new Response('Email failed', { status: 502 });
  }
};
