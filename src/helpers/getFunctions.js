const { google } = require("googleapis");
const fs = require("fs");

function getRegisteredUsers() {
  try {
    const data = fs.readFileSync("./storage/registered_users.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading registered users:", error.message);
    return [];
  }
}

function getPendingUsers() {
  try {
    const data = fs.readFileSync("./storage/pending_users.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading pending users:", error.message);
    return [];
  }
}

async function getHelperFromSheet(link) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const SPREADSHEET_ID = process.env.SHEET_ID;
    const SHEET_NAME = "Table";

    const columnValuesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:A`,
    });
    const columnValues = columnValuesResponse.data.values.flat();

    const rowIndex = columnValues.findIndex((value) => value === link);

    if (rowIndex === -1) {
      return false;
    }

    const helperResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!B${rowIndex + 2}:A${rowIndex + 2}`,
    });
    const helperData = helperResponse.data.values[0];

    const helperName = helperData[1];

    return helperName;
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
    return null;
  }
}

module.exports = {
  getRegisteredUsers,
  getPendingUsers,
  getHelperFromSheet,
};
