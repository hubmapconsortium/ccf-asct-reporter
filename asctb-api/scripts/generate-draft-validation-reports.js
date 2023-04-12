const sheetConfig = require('../../projects/v2/src/assets/sheet-config.json');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// sheets imports
const {google} = require('googleapis');
const sheets = google.sheets('v4');
const drive = google.drive('v3');

// sheets authenticate
const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
  keyFile: '/Users/abhaybharatrajde/Documents/ASCT+B/ccf-asct-reporter/asctb-api/scripts/credentials.json',
});

let OUT_DIR = 'reports';
let API_ENDPOINT = 'https://mmpyikxkcp.us-east-2.awsapprunner.com';
if (process.argv.length > 2) {
  OUT_DIR = process.argv[2];
}
if (process.argv.length > 3) {
  API_ENDPOINT = process.argv[3];
}

async function run() {
  const allDraftItems= [];

  sheetConfig.forEach((item) => {
    const version = item.version;
    if (version) {
      const versionWithDraft = version.find((v) => v.value.includes('DRAFT'));
      if (versionWithDraft) {
        allDraftItems.push(versionWithDraft);
      }
    }
  });

  getData(allDraftItems);
}

async function getData(draftItems) {
  const checkmark = '\u2705';
  const crossmark = '\u274C';
  const rows = [["","Invalid CSV file?",
  "Unmapped Metadata found?",
  "Invalid Header found?",
  "Missing Header Value found?",
  "Invalid Character found?",
  "Missing Uberon or CL IDs?",
  "Unmapped Data found?",
  "Bad Column found?"]];

  const sheetData = [];

  for (let i = 0; i < draftItems.length; i++) {
    const item = draftItems[i];
    const filename = `${item.value}.txt`;
    const sheetId = item.sheetId;
    const gid = item.gid;
    
    const apiUrl = `${API_ENDPOINT}/v2/csv?csvUrl=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F${sheetId}%2Fedit%23gid%3D${gid}&output=validate`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
      const data = await response.data;
      const filetitle = item.value.split('v1.')[0].split(/[_-]/);
      const title = filetitle.join(' ');  
      rows.push(
        [title.toLowerCase(), ...data.split('\n')
        .slice(0, 8)
        .map((d) => {
          const status = d.slice(-6);
          return status === 'passed' ? checkmark : crossmark;
        })]
      );

      // Google sheets
      const sheetRows = [];
      data.split('\n').map((line) => sheetRows.push([line]));
      sheetData.push({
        title: item.value,
        data: sheetRows,
      });


      fs.writeFileSync(path.resolve(OUT_DIR, filename), data)
    } catch (error) {
      console.log('error: ', error);
      process.exit(-1);
    }
  }

  // Create google sheet
  createSpreadsheet(sheetData);

  // Write CSV
  let csv = '';
  rows.forEach(row => {
    csv += row.join(',') + '\n'
  });

  fs.writeFileSync(path.resolve(OUT_DIR, 'summary.csv'), csv);

}


async function createSpreadsheet(array) {
  const authClient = await auth.getClient();

  // Create a new spreadsheet
  const res = await sheets.spreadsheets.create({
    auth: authClient,
    resource: {
      properties: {
        title: 'My Spreadsheet',
      },
    },
  });

  const spreadsheetId = res.data.spreadsheetId;


  await drive.permissions.create({
    auth: authClient,
    fileId: spreadsheetId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });


  // Loop through each item in the array and create a new sheet for it
  for (let i = 0; i < array.length; i++) {
    const item = array[i];

    // Add a new sheet to the spreadsheet
    const addSheetRes = await sheets.spreadsheets.batchUpdate({
      auth: authClient,
      spreadsheetId: spreadsheetId,
      resource: {
        requests: [
          {
            addSheet: {
              properties: {
                title: item.title,
              },
            },
          },
        ],
      },
    });

    const sheetId = addSheetRes.data.replies[0].addSheet.properties.sheetId;

    // Write the data to the sheet
    const writeRes = await sheets.spreadsheets.values.update({
      auth: authClient,
      spreadsheetId: spreadsheetId,
      range: `${item.title}!A1`,
      valueInputOption: 'RAW',
      resource: {
        values: item.data,
      },
    });
  }

  console.log(`Spreadsheet created with ID: ${spreadsheetId}`);
  console.log(`Link to the spreadsheet: https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0`)
}


run();
