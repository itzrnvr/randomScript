const {google} = require('googleapis');
// const gKeys = require('./googleServiceAccount.json')
// Fetch environment variable and convert from Base64 to JSON

//const gKeys = require('./googleServiceAccount.json');
const gKeys = JSON.parse(Buffer.from(process.env.GOOGLE_CREDENTIALS, 'base64').toString('utf8'))

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];


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
  return client;
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


module.exports = {getAuth, getKeys, clearAndUpdateWorkingColumn}
