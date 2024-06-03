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

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = process.env.SHEET_ID;
    const range = "Замовлення!C2:D";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    for (const row of rows) {
      const helper = row[0];
      const value = row[1];

      if (value === undefined || helper === undefined) {
        continue;
      }

      if (value === link) {
        return [true, helper];
      }
    }

    return [false, ""];
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
    return [false, ""];
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
