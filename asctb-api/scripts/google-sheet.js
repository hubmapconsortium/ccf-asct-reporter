const {google} = require('googleapis');
const sheets = google.sheets('v4');
const drive = google.drive('v3');

const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
  keyFile: '/Users/abhaybharatrajde/Documents/ASCT+B/ccf-asct-reporter/asctb-api/scripts/credentials.json',
});

// AIzaSyCoCeWx08OPqKLmvUwoY5vB_Vfpyrrn078
//clientid: 493633774716-mq7k4srjnvmoalp07bqgr38s4lb8jfnr.apps.googleusercontent.com
//clientsecret: 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

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

const array = [
  {
    title: 'Jagrut',
    data: [['big data string 1', 'abba'], ['big data string 1', 'abba']],
  },
  {
    title: 'Sheet2',
    data: [['big data string 1', 'abba', 'sdjfsdjf']],
  },
];

createSpreadsheet(array);

