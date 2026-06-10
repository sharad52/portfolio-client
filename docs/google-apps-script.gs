/**
 * Portfolio contact form → Google Sheet + email notification.
 * Paste this into Extensions → Apps Script of your Google Sheet,
 * then Deploy as a Web App (Execute as: Me, Access: Anyone).
 * Full guide: docs/contact-google-sheet.md
 */

// Where to send a notification email for each submission. Leave '' to disable.
const NOTIFY_EMAIL = 'ersharadbhandari@gmail.com';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Write a header row the first time.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Source']);
    }

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.subject || '',
      data.message || '',
      data.source || '',
    ]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: 'New portfolio message: ' + (data.subject || data.name || 'No subject'),
        replyTo: data.email || NOTIFY_EMAIL,
        body:
          'Name: ' + (data.name || '') + '\n' +
          'Email: ' + (data.email || '') + '\n' +
          'Phone: ' + (data.phone || '') + '\n' +
          'Subject: ' + (data.subject || '') + '\n\n' +
          (data.message || ''),
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Lets you confirm the deployment works by visiting the URL in a browser.
function doGet() {
  return ContentService.createTextOutput('Portfolio contact endpoint is live.');
}
