const {google} = require('googleapis');
const { v4: uuidv4 } = require('uuid');
// const gKeys = require('./googleServiceAccount.json')
// Fetch environment variable and convert from Base64 to JSON

const gKeys = require('./googleServiceAccount.json');
const { retail } = require('googleapis/build/src/apis/retail');
//const gKeys = JSON.parse(Buffer.from(process.env.GOOGLE_CREDENTIALS, 'base64').toString('utf8'))

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const HIDDEN_SHEETS = []


let auth = null;

async function authorize() {
  // load the service account keys
  const keys = gKeys;

  const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    SCOPES // Ensure proper scopes are set
  );
  
  // authenticate and return the client
  await client.authorize();
  auth = client
  return client;
}


const deleteLookupSheet = async function(sheet) {
  !auth && await authorize()
  const gsapi = google.sheets({ version: 'v4', auth });
  const targetSheetId = '12Hnf-syC5jQyvklShdc2d_Yj4MgLFggRmZsq-nDGkkc'; // replace with your google sheet ID

  // first, we need to get the sheetId of the 'LOOKUP_SHEET'
  const response = await gsapi.spreadsheets.get({
    spreadsheetId: targetSheetId,
  });

  const sheets = response.data.sheets;
  let lookupSheetId;
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].properties.title === sheet) {
      lookupSheetId = sheets[i].properties.sheetId;
      break;
    }
  }

  if (lookupSheetId === undefined) {
    console.log("LOOKUP_SHEET not found");
    return;
  }

  // now we can delete the sheet
  const requests = [{
    deleteSheet: {
      sheetId: lookupSheetId,
    }
  }];

  await gsapi.spreadsheets.batchUpdate({
    spreadsheetId: targetSheetId,
    resource: {
      requests
    },
  });
}


const deleteMultipleSheetsByTitle = async (sheetTitlesToDelete = HIDDEN_SHEETS) => {
  // Authorize, if not already done
  if(sheetTitlesToDelete.length == 0) return
  !auth && await authorize();

  const gsapi = google.sheets({ version: 'v4', auth });
  const targetSheetId = '12Hnf-syC5jQyvklShdc2d_Yj4MgLFggRmZsq-nDGkkc'; // Replace with your Google Sheet ID

  // Get all the sheets in the spreadsheet
  const response = await gsapi.spreadsheets.get({
      spreadsheetId: targetSheetId,
  });

  // Extract sheet IDs corresponds to the titles specified in sheetTitlesToDelete
  const targetSheets = response.data.sheets.filter(sheet => sheetTitlesToDelete.includes(sheet.properties.title));
  const sheetIdsToDelete = targetSheets.map(sheet => sheet.properties.sheetId);

  // Generate the deleteSheet requests
  const requests = sheetIdsToDelete.map(sheetId => ({
      deleteSheet: {
          sheetId
      }
  }));

  // Execute the batchUpdate operation
  await gsapi.spreadsheets.batchUpdate({
      spreadsheetId: targetSheetId,
      resource: {
          requests
      },
  });
}


const createHiddenSheet = async function(auth) {
  const sheet = uuidv4();
  const gsapi = google.sheets({ version: 'v4', auth });
  const targetSheetId = '12Hnf-syC5jQyvklShdc2d_Yj4MgLFggRmZsq-nDGkkc'; // replace with your google sheet ID

  const requests = [{
    addSheet: {
      properties: {
        hidden: true,
        title: sheet
      }
    }
  }];

  await gsapi.spreadsheets.batchUpdate({
    spreadsheetId: targetSheetId,
    resource: {
      requests
    },
  });
  
  return sheet
}

const createSearchFormula = async function(auth, sheet, token) {
  const gsapi = google.sheets({ version: 'v4', auth });
  const tokenToFind = token;
  const targetSheetId = '12Hnf-syC5jQyvklShdc2d_Yj4MgLFggRmZsq-nDGkkc'; // replace with your google sheet ID
  
  const newValues = [[`=MATCH(\"${'a123456789'}\", access!A:A, 0)`]];
  
  await gsapi.spreadsheets.values.update({
    spreadsheetId: targetSheetId,
    range: `${sheet}!A1`,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: newValues
    },
  });
}

const getMatchingRow = async function (auth, sheet) {
  const gsapi = google.sheets({ version: 'v4', auth });
  const targetSheetId = '12Hnf-syC5jQyvklShdc2d_Yj4MgLFggRmZsq-nDGkkc'; // replace with your google sheet ID

  const resp = await gsapi.spreadsheets.values.get({
    spreadsheetId: targetSheetId,
    range: `${sheet}!A1`,
  });
  
  const matchRowNum = resp.data.values ? resp.data.values[0][0] : null ;
  
  if (matchRowNum === null) {
    console.log('No match found');
    return null;
  }

  // now get the data in the matching row
  const rowResp = await gsapi.spreadsheets.values.get({
    spreadsheetId: targetSheetId,
    range: `access!A${matchRowNum}:E${matchRowNum}`,
  });

  const rowData = rowResp.data.values ? rowResp.data.values[0] : null;
  return rowData;
}



async function getLimit(token) {

  !auth && await authorize()
  const sheet = await createHiddenSheet(auth);
  await createSearchFormula(auth, sheet, token);
  let rowNumber = await getMatchingRow(auth, sheet);
  HIDDEN_SHEETS.push(sheet)
  return rowNumber
}



async function listMajors(auth) {
  const keys = []
  const sheets = google.sheets({version: 'v4', auth});
  
  return new Promise((resolve, reject) => {
      // Using spreadsheets.values.batchGet to fetch the keys
      sheets.spreadsheets.values.batchGet({
          spreadsheetId: '12Hnf-syC5jQyvklShdc2d_Yj4MgLFggRmZsq-nDGkkc',
          ranges: ['GPT-4!A2:A'],
      }, (err, res) => {
          if (err) reject('The API returned an error: ' + err);
          console.log(res);
          const response = res.data.valueRanges[0];
          if (response.values.length) {
              // Print all keys
              response.values.map((row) => {
                  keys.push(row[0])
                  console.log(`${row[0]}`);
              });
              resolve(keys); // resolve the Promise with keys
          } else {
              reject('No data found.');
          }
      });
  });
}


async function clearAndUpdateWorkingColumn(auth, newValues) {
  const sheets = google.sheets({version: 'v4', auth});
  const spreadsheetId = '12Hnf-syC5jQyvklShdc2d_Yj4MgLFggRmZsq-nDGkkc'; // the ID of your spreadsheet
  const rangeToClear = 'workinggpt4!A:A'; // your working column range like 'Sheet1!A:A'

  // Clear the column first  
  try {
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: rangeToClear,
      resource: {}
    });
    console.log('Column has been cleared');
  } catch (err) {
    console.log('The API returned an error while clearing the column: ' + err);
  }

  // Now add new entries
  const rangeToUpdate = 'workinggpt4!A1'; // Update this to represent your range as 'SheetName!CellStart:CellEnd'
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: rangeToUpdate,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: newValues.map(entry => [entry]) // Wrapping each entry with [] to match the format needed for Google Sheets
      }
    });
    console.log('Column has been updated');
  } catch (err) {
    console.log('The API returned an error while updating the entries: ' + err);
  }
}


async function getAuth() {
  return authorize();
}



async function getKeys() {

    const auth = await getAuth();
    const keys = await listMajors(auth); // wait for the Promise from listMajors to resolve
    return keys
}


module.exports = {deleteMultipleSheetsByTitle, deleteLookupSheet, getAuth,  getLimit, getKeys, clearAndUpdateWorkingColumn}
