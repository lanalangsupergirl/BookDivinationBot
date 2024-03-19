import { google } from 'googleapis';
import 'dotenv/config';

export async function addBotStatistics(id) {
  const sheetId = process.env.SHEET_ID;
  const tabId = 'uniqueUserId';
  const range = 'A2';

  const googleSheetClient = await getGoogleSheetClient();

  let idList = await readGoogleSheet(googleSheetClient, sheetId, tabId);

  if (idList.flat().includes(id.toString())) {
    return;
  } else {
    await writeGoogleSheet(googleSheetClient, sheetId, tabId, range, [[id]]);
  }

  return;
}

const serviceAccountKeyFile = 'google_key.json';

async function getGoogleSheetClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountKeyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const authClient = await auth.getClient();
  return google.sheets({
    version: 'v4',
    auth: authClient,
  });
}

async function readGoogleSheet(googleSheetClient, sheetId, tabName) {
  const res = await googleSheetClient.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}`,
  });

  return res.data.values;
}

async function writeGoogleSheet(googleSheetClient, sheetId, tabName, range, data) {
  await googleSheetClient.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${tabName}!${range}`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      majorDimension: 'ROWS',
      values: data,
    },
  });
}
