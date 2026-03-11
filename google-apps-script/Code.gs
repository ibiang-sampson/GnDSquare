const SHEET_NAME = "Orders";
const NOTIFICATION_EMAIL = "gndsquare2@gmail.com";
const SHEET_HEADERS = ["Timestamp", "Name", "Phone", "City/State", "Bundle", "Address"];

function doPost(e) {
  try {
    const data = normalizePayload_(e);
    const sheet = getSheet_();
    ensureSheetHeaders_(sheet);

    sheet.appendRow([
      new Date(),
      data.name,
      data.phone,
      data.location,
      data.bundle,
      data.address,
    ]);

    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: "New UV Toilet Sterilizer Order",
      body: [
        "A new order was submitted.",
        "",
        `Name: ${data.name}`,
        `Phone: ${data.phone}`,
        `City/State: ${data.location}`,
        `Bundle: ${data.bundle}`,
        `Address: ${data.address}`,
      ].join("\n"),
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function setupSheet() {
  const sheet = getSheet_();
  ensureSheetHeaders_(sheet);
}

function testEmail() {
  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: "Test email from UV Toilet Sterilizer form",
    body: "This is a test email from your Google Apps Script setup.",
  });
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  return sheet;
}

function ensureSheetHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(SHEET_HEADERS);
    return;
  }

  const firstRow = sheet.getRange(1, 1, 1, SHEET_HEADERS.length).getValues()[0];
  const headersMatch = SHEET_HEADERS.every((header, index) => firstRow[index] === header);

  if (!headersMatch) {
    sheet.insertRows(1, 1);
    sheet.getRange(1, 1, 1, SHEET_HEADERS.length).setValues([SHEET_HEADERS]);
  }
}

function normalizePayload_(e) {
  const params = e && e.parameter ? e.parameter : {};

  return {
    name: (params.name || "").trim(),
    phone: (params.phone || "").trim(),
    location: (params.location || "").trim(),
    bundle: (params.bundle || "").trim(),
    address: (params.address || "").trim(),
  };
}
