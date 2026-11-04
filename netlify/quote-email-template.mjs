// Branded notification email for a new quote request.
// Uses tables and inline styles because email apps ignore most modern CSS.

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const isEmail = (value) => /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+$/.test(value);

const detailRow = (label, href, text) => `
        <tr>
          <td class="label" width="90" valign="top" style="padding:12px 0; border-top:1px solid #E6DFD0; font-size:14px; line-height:22px; font-weight:800; color:#121212;">${label}</td>
          <td class="value" valign="top" style="padding:12px 0; border-top:1px solid #E6DFD0; font-size:16px; line-height:22px; color:#3A3A3A; word-break:break-word;"><a href="${href}" style="color:#1E2A5A; font-weight:700;">${escapeHtml(text)}</a></td>
        </tr>`;

export function renderQuoteEmail(fields, logoUrl) {
  const clean = (key) => String(fields[key] ?? '').trim();
  const name = clean('name') || 'Website visitor';
  const firstName = name.split(/\s+/)[0];
  const phone = clean('phone');
  const email = clean('email');
  const service = clean('service') || 'Not sure yet';
  const message = clean('message');

  const dial = phone.replace(/[^\d+]/g, '');
  const replyTo = isEmail(email) ? email : null;
  const mailto = replyTo ? `mailto:${encodeURIComponent(replyTo).replace(/%40/g, '@')}?subject=${encodeURIComponent('Your Got It Maid quote')}` : null;

  const buttons = [
    dial && `<a class="btn" href="tel:${dial}" style="display:inline-block; margin:0 10px 12px 0; padding:14px 26px; background-color:#C8102E; color:#FFFFFF; border:3px solid #121212; border-radius:12px; font-size:17px; line-height:22px; font-weight:800; text-decoration:none;">Call ${escapeHtml(firstName)}</a>`,
    mailto && `<a class="btn" href="${escapeHtml(mailto)}" style="display:inline-block; margin:0 0 12px 0; padding:14px 26px; background-color:#FFFFFF; color:#121212; border:3px solid #121212; border-radius:12px; font-size:17px; line-height:22px; font-weight:800; text-decoration:none;">Reply by email</a>`,
  ].filter(Boolean).join('\n      ');

  const details = [
    dial && detailRow('Phone', `tel:${dial}`, phone),
    mailto && detailRow('Email', escapeHtml(mailto.split('?')[0]), email),
  ].filter(Boolean).join('');

  const messageBlock = message ? `
    <tr><td class="pad" style="padding:10px 36px 36px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FFF8EC; border-left:6px solid #C8102E; border-radius:6px;">
        <tr><td style="padding:18px 20px;">
          <p style="margin:0 0 6px; font-size:14px; line-height:20px; font-weight:800; color:#121212;">About their space</p>
          <p style="margin:0; font-size:16px; line-height:25px; color:#3A3A3A; word-break:break-word;">${escapeHtml(message).replace(/\r?\n/g, '<br>')}</p>
        </td></tr>
      </table>
    </td></tr>` : '<tr><td height="26" style="height:26px; font-size:0; line-height:0;">&nbsp;</td></tr>';

  const subject = `New quote request: ${service} from ${name}`.replace(/[\r\n\t]+/g, ' ').slice(0, 150);

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(subject)}</title>
<style>
  @media (max-width: 480px) {
    .pad { padding-left: 22px !important; padding-right: 22px !important; }
    .name { font-size: 28px !important; line-height: 34px !important; }
    .btn { display: block !important; margin: 0 0 12px 0 !important; text-align: center !important; }
    .label, .value { display: block !important; width: auto !important; }
    .label { padding-bottom: 2px !important; }
    .value { padding-top: 0 !important; border-top: 0 !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:#FFF8EC;">
<div style="display:none; max-height:0; overflow:hidden; opacity:0;">${escapeHtml(name)} is asking about: ${escapeHtml(service)}.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FFF8EC;">
<tr><td align="center" style="padding:28px 12px 36px;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px; background-color:#FFFFFF; border:3px solid #121212; border-radius:20px; border-collapse:separate; overflow:hidden; font-family:Rubik, 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <tr><td height="12" style="height:12px; background-color:#C8102E; font-size:0; line-height:0;">&nbsp;</td></tr>

    <tr><td align="center" class="pad" style="padding:26px 36px 22px; background-color:#FFF8EC; border-bottom:3px solid #121212;">
      <img src="${escapeHtml(logoUrl)}" width="168" height="94" alt="Got It Maid in the Valley" style="display:block; width:168px; height:auto; border:0;">
    </td></tr>

    <tr><td class="pad" style="padding:34px 36px 8px;">
      <p style="margin:0 0 8px; font-size:13px; line-height:18px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; color:#C8102E;">New quote request</p>
      <h1 class="name" style="margin:0 0 14px; font-size:34px; line-height:40px; font-weight:800; color:#121212; word-break:break-word;">${escapeHtml(name)}</h1>
      <span style="display:inline-block; padding:6px 14px; background-color:#121212; color:#FFFFFF; border-radius:999px; font-size:15px; line-height:20px; font-weight:800;">${escapeHtml(service)}</span>
    </td></tr>

    <tr><td class="pad" style="padding:24px 36px 8px;">
      ${buttons}
    </td></tr>

    <tr><td class="pad" style="padding:16px 36px 6px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${details}
      </table>
    </td></tr>
${messageBlock}
    <tr><td align="center" class="pad" style="padding:18px 36px; background-color:#1E2A5A; font-size:13px; line-height:20px; color:#E4E8F4;">
      Sent from the quote form on your website
    </td></tr>
  </table>

</td></tr>
</table>
</body>
</html>`;

  const text = [
    'New quote request',
    `Name: ${name}`,
    `Service: ${service}`,
    phone && `Phone: ${phone}`,
    email && `Email: ${email}`,
    message && `\nAbout their space:\n${message}`,
  ].filter(Boolean).join('\n');

  return { subject, html, text, replyTo };
}
