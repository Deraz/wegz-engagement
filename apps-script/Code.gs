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
 */

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
