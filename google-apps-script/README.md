## Google Apps Script setup

1. Open Google Sheets with the Google account you want to own the submissions.
2. Create a new spreadsheet.
3. Open `Extensions` -> `Apps Script`.
4. Replace the default code with the contents of `google-apps-script/Code.gs`.
5. Save the project.
6. Run `setupSheet` once to create the `Orders` sheet header.
7. Run `testEmail` once and grant Google permission when prompted.
7. Deploy as a web app:
   - Execute as: `Me`
   - Who has access: `Anyone`
8. Copy the deployed web app URL.
9. Replace `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL` in `index.html` with that URL.

Important:
- After changing the Apps Script code, deploy a new web app version again.
- If rows appear in the sheet but no email arrives, the issue is Apps Script mail authorization or Gmail delivery, not the website form.

Submissions will:
- be saved to the `Orders` sheet
- send an email notification to `gndsquare2@gmail.com`

The script already stores each submission in Google Sheets with these columns:
- `Timestamp`
- `Name`
- `Phone`
- `City/State`
- `Bundle`
- `Address`
