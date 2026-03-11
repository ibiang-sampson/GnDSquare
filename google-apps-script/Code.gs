const SHEET_NAME = "Orders";
const NOTIFICATION_EMAIL = "gndsquare2@gmail.com";

function doPost(e) {
  try {
    const data = normalizePayload_(e);
    const sheet = getSheet_();

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
      replyTo: Session.getActiveUser().getEmail(),
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
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Name", "Phone", "City/State", "Bundle", "Address"]);
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  return sheet;
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
