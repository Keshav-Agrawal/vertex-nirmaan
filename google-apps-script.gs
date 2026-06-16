/**
 * Vertex Nirmaan — Enquiry API (Google Apps Script)
 * ---------------------------------------------------
 * This turns a Google Sheet into a tiny backend for the website's
 * enquiry form and the hidden admin page.
 *
 * SETUP (see SETUP.md for the full walkthrough):
 *   1. Create a Google Sheet.
 *   2. Extensions ▸ Apps Script, paste this whole file, Save.
 *   3. Deploy ▸ New deployment ▸ Web app
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   4. Copy the Web app URL (ends in /exec) into config.js (VN_API_URL).
 *
 * IMPORTANT: keep ADMIN_TOKEN the same as VN_ADMIN_PASSWORD in config.js.
 */

var SHEET_NAME  = 'Enquiries';
var ADMIN_TOKEN = '12345678'; // must match VN_ADMIN_PASSWORD in config.js
var HEADERS = ['ID','Timestamp','Name','Phone','Email','Service','City','Budget','Message','Status'];

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) { sh = ss.insertSheet(SHEET_NAME); }
  if (sh.getLastRow() === 0) { sh.appendRow(HEADERS); }
  return sh;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function readAll() {
  var sh = getSheet();
  var values = sh.getDataRange().getValues();
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var r = values[i];
    if (!r[0]) continue;
    rows.push({
      id: String(r[0]), timestamp: r[1], name: r[2], phone: r[3],
      email: r[4], service: r[5], city: r[6], budget: r[7],
      message: r[8], status: r[9] || 'New'
    });
  }
  return rows.reverse(); // newest first
}

function findRowById(sh, id) {
  var ids = sh.getRange(1, 1, Math.max(sh.getLastRow(), 1), 1).getValues();
  for (var i = 1; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 1;
  }
  return -1;
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.action === 'list') {
    if (p.token !== ADMIN_TOKEN) return json({ ok: false, error: 'unauthorized' });
    return json({ ok: true, data: readAll() });
  }
  return json({ ok: true, message: 'Vertex Nirmaan enquiry API is running.' });
}

function doPost(e) {
  var body = {};
  try { body = JSON.parse(e.postData.contents); }
  catch (err) { body = (e && e.parameter) || {}; }

  var action = body.action || 'add';
  var sh = getSheet();

  // Public: anyone can submit a new enquiry
  if (action === 'add') {
    var id = 'VN' + Date.now() + Math.floor(Math.random() * 1000);
    sh.appendRow([
      id, new Date(), body.name || '', body.phone || '', body.email || '',
      body.service || '', body.city || '', body.budget || '',
      body.message || '', 'New'
    ]);
    return json({ ok: true, id: id });
  }

  // Everything below requires the admin token
  if (body.token !== ADMIN_TOKEN) return json({ ok: false, error: 'unauthorized' });

  if (action === 'update') {
    var row = findRowById(sh, body.id);
    if (row < 0) return json({ ok: false, error: 'not found' });
    var map = { name: 3, phone: 4, email: 5, service: 6, city: 7, budget: 8, message: 9, status: 10 };
    Object.keys(map).forEach(function (k) {
      if (typeof body[k] !== 'undefined') sh.getRange(row, map[k]).setValue(body[k]);
    });
    return json({ ok: true });
  }

  if (action === 'delete') {
    var r = findRowById(sh, body.id);
    if (r < 0) return json({ ok: false, error: 'not found' });
    sh.deleteRow(r);
    return json({ ok: true });
  }

  return json({ ok: false, error: 'unknown action' });
}
