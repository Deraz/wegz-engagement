/**
 * Wishes collector — Google Apps Script for the engagement invitation.
 *
 * Setup (Youssef's Google account, ~3 minutes):
 *  1. Create a new Google Sheet (sheets.new), name it e.g. "Engagement Wishes".
 *  2. Extensions → Apps Script, delete the sample code, paste this file, save.
 *  3. Deploy → New deployment → type "Web app":
 *       - Execute as:        Me
 *       - Who has access:    Anyone
 *     → Deploy, authorize when asked, and copy the Web app URL (ends in /exec).
 *  4. Put that URL into INVITE.wishesUrl in script.js on the site.
 *
 * Each submission appends a row: [When, Name, Message] to a "Wishes" tab.
 *
 * The admin panel (admin.html) reads wishes back via GET with ?key=...
 * Set your own secret below before deploying — anyone who has this key
 * can read the wishes. After editing, redeploy: Deploy → Manage
 * deployments → ✏️ edit → Version: "New version" → Deploy (URL stays the same).
 */

var ADMIN_KEY = "CHANGE-ME"; // ← set a long random secret, then redeploy

function doGet(e) {
  var key = (e && e.parameter && e.parameter.key) || "";
  if (!key || key !== ADMIN_KEY) return respond({ ok: false, error: "unauthorized" });

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Wishes");
  if (!sheet || sheet.getLastRow() < 2) return respond({ ok: true, wishes: [] });

  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
  var wishes = rows.map(function (r) {
    return { at: r[0], name: String(r[1]), message: String(r[2]) };
  }).reverse(); // newest first
  return respond({ ok: true, wishes: wishes });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(5000);
  try {
    var data = {};
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      data = (e && e.parameter) || {};
    }

    var name = String(data.name || "").slice(0, 200);
    var message = String(data.message || "").slice(0, 2000);
    if (!message) return respond({ ok: false, error: "empty message" });

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Wishes") || ss.insertSheet("Wishes");
    if (sheet.getLastRow() === 0) sheet.appendRow(["When", "Name", "Message"]);
    sheet.appendRow([new Date(), name, message]);

    return respond({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
