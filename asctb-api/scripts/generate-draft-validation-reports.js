const sheetConfig = require('../../projects/v2/src/assets/sheet-config.json');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

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
  const headers = ["Validation Tests"];
  const columns = [["Validation Invalid CSV file?",
    "Unmapped Metadata found?",
    "Invalid Header found?",
    "Missing Header Value found?",
    "Invalid Character found?",
    "Missing Uberon or CL IDs?",
    "Unmapped Data found?",
    "Bad Column found?"]];
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
      headers.push(title.toLowerCase());

      // const validationResults = data.split('\n').slice(0, 8).map((d)=>d.slice(-6));
      // validationResults.forEach((validationResult) => {
      //   const result = validationResult === 'passed' ? '✅' : '❌';  
      //   columns.push(result);
      // })
      // console.log(validationResult);
      columns.push(
        data.split('\n')
        .slice(0, 8)
        .map((d) => {
          const status = d.slice(-6);
          return status === 'passed' ? '✅' : '❌';
        })
      );

      fs.writeFileSync(path.resolve(OUT_DIR, filename), data)
    } catch (error) {
      console.log('error: ', error);
      process.exit(-1);
    }
  }

  // Write CSV

  // Add values to the first row of the CSV
  let csv = headers.join(',') + '\n';

  // Add each row of validations to the CSV
  for (let i = 0; i < columns[0].length; i++) {
    let row = [];
    for (let j = 0; j < columns.length; j++) {
      row.push(columns[j][i]);
    }
    csv += row.join(',') + '\n';
  }

  fs.writeFileSync(path.resolve(OUT_DIR, 'summary.csv'), csv);

}

run();
