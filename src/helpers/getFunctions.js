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

    const sheetId = process.env.SHEET_ID;
    const sheetName = "А24, травень 2024";

    const columnValuesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!C2:C`,
    });

    const columnValues = columnValuesResponse.data.values.flat();

    const rowIndex = columnValues.findIndex((value) => value === link);

    if (rowIndex === -1) {
      return false;
    }

    const helperResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!B${rowIndex + 2}:C${rowIndex + 2}`,
    });
    const helperData = helperResponse.data.values[0];

    const helperName = helperData[0];

    return helperName;
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
    return false;
  }
}

async function getTagsFromSheet(userToModify) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const sheetId = process.env.SHEET_ID;
    const sheetName = "Теги";

    const headersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!1:1`,
    });
    const headers = headersResponse.data.values[0];

    const columnIndex = headers.findIndex((header) => header === userToModify);

    if (columnIndex === -1) {
      console.error(`User '${userToModify}' not found in the sheet.`);
      return [];
    }

    const columnValuesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!${String.fromCharCode(
        65 + columnIndex
      )}2:${String.fromCharCode(65 + columnIndex)}`,
    });
    const columnValues = columnValuesResponse.data.values.flat();

    return columnValues;
  } catch (error) {
    console.error("Error getting tags from Google Sheets:", error);
    return [];
  }
}

module.exports = {
  getRegisteredUsers,
  getPendingUsers,
  getHelperFromSheet,
  getTagsFromSheet,
};
