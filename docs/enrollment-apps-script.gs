/**
 * Portfolio → Google Sheet + email — handles BOTH the contact form and Python
 * tuition enrolments in a single deployment. Each submission is routed to its
 * own tab by the `type` field ('enrollment' → Enrollments tab, otherwise
 * Contacts tab).
 *
 * SETUP (full guide: docs/tuition-setup.md)
 *   1. Open your Google Sheet → Extensions → Apps Script.
 *   2. Replace the whole file with this, Save.
 *   3. Deploy → Manage deployments → edit your existing Web App deployment
 *      → Version: New version → Deploy. (Execute as: Me, Access: Anyone.)
 *   4. The Web App URL stays the same — no frontend env change needed. Both
 *      the contact form (VITE_GOOGLE_SCRIPT_URL) and enrolments post here.
 *
 * If you'd rather keep enrolments in a SEPARATE sheet/deployment, deploy this
 * from that sheet instead and set VITE_ENROLLMENT_SCRIPT_URL to its URL.
 */

// Where to send a notification email for each submission. Leave '' to disable.
const NOTIFY_EMAIL = 'ersharadbhandari@gmail.com';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.type === 'enrollment') return handleEnrollment(data);
    return handleContact(data);
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

// ── Python tuition enrolments → "Enrollments" tab ──────────────────────────
function handleEnrollment(data) {
  const sheet = getSheet('Enrollments', [
    'Timestamp', 'Name', 'Email', 'Phone', 'Course', 'Batch', 'Level', 'Goals', 'Location', 'IP', 'Source',
  ]);

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.email || '',
    data.phone || '',
    data.course || '',
    data.batch || '',
    data.level || '',
    data.goals || '',
    data.location || '',
    data.ip || '',
    data.source || '',
  ]);

  if (NOTIFY_EMAIL) {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'New class enrolment: ' + (data.name || '') + ' — ' + (data.course || ''),
      replyTo: data.email || NOTIFY_EMAIL,
      body:
        'Course: ' + (data.course || '') + '\n' +
        'Batch:  ' + (data.batch || '') + '\n\n' +
        'Name:   ' + (data.name || '') + '\n' +
        'Email:  ' + (data.email || '') + '\n' +
        'Phone:  ' + (data.phone || '') + '\n' +
        'Level:  ' + (data.level || '') + '\n' +
        'Goals:  ' + (data.goals || '') + '\n' +
        'Location: ' + (data.location || 'Unknown') + '\n' +
        'IP:     ' + (data.ip || ''),
    });
  }
  return jsonOut({ ok: true });
}

// ── Contact form → "Contacts" tab ──────────────────────────────────────────
function handleContact(data) {
  const sheet = getSheet('Contacts', [
    'Timestamp', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Location', 'IP', 'Source',
  ]);

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.email || '',
    data.phone || '',
    data.subject || '',
    data.message || '',
    data.location || '',
    data.ip || '',
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
        'Subject: ' + (data.subject || '') + '\n' +
        'Location: ' + (data.location || 'Unknown') + '\n' +
        'IP: ' + (data.ip || '') + '\n\n' +
        (data.message || ''),
    });
  }
  return jsonOut({ ok: true });
}

// ── Helpers ────────────────────────────────────────────────────────────────
// Return the tab named `name`, creating it (with a header row) if missing.
function getSheet(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(header);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(header);
  }
  return sheet;
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Lets you confirm the deployment works by visiting the URL in a browser.
function doGet() {
  return ContentService.createTextOutput('Portfolio contact + enrolment endpoint is live.');
}
