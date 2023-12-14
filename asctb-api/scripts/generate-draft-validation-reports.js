const sheetConfig = require("../../projects/v2/src/assets/sheet-config.json");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

let XLSX_FILE = "validation-report.xlsx";
let API_ENDPOINT = "https://apps.humanatlas.io/asctb-api";
if (process.argv.length > 2) {
  XLSX_FILE = process.argv[2];
}
if (process.argv.length > 3) {
  API_ENDPOINT = process.argv[3];
}

async function run() {
  const allDraftItems = [];

  sheetConfig.forEach((item) => {
    const version = item.version;
    if (version) {
      const versionWithDraft = version.find((v) => v.value.includes("DRAFT"));
      if (versionWithDraft) {
        allDraftItems.push(versionWithDraft);
      }
    }
  });

  getData(allDraftItems);
}

async function getData(draftItems) {
  const checkmark = "\u2705";
  const crossmark = "\u274C";
  const rows = [
    [
      "",
      "Invalid CSV file?",
      "Unmapped Metadata found?",
      "Invalid Header found?",
      "Missing Header Value found?",
      "Invalid Character found?",
      "Missing Uberon or CL IDs?",
      "Unmapped Data found?",
      "Bad Column found?",
      "CT/1 has CL ID?"
    ],
  ];
  const workbook = XLSX.utils.book_new();
  const worksheets = {};

  for (let i = 0; i < draftItems.length; i++) {
    const item = draftItems[i];
    const sheetId = item.sheetId;
    const gid = item.gid;
    const apiUrl = `${API_ENDPOINT}/v2/csv?csvUrl=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F${sheetId}%2Fedit%23gid%3D${gid}&output=validate`;

    const filetitle = item.value.split("v1.")[0].split(/[_-]/);
    const title = filetitle.join(" ").trim().toLowerCase();

    try {
      const response = await axios.get(apiUrl);
      const data = await response.data;

      rows.push([
        title,
        ...data
          .split("\n")
          .slice(0, rows[0].length - 1)
          .map((d) => {
            const status = d.slice(-6);
            return status === "passed" ? checkmark : crossmark;
          }),
      ]);

      worksheets[title] = data.split("\n").map((n) => [n]);
    } catch (error) {
      worksheets[title] = [["Invalid CSV file? failed"]];
      rows.push([
        title,
        crossmark,
        crossmark,
        crossmark,
        crossmark,
        crossmark,
        crossmark,
        crossmark,
        crossmark,
        crossmark,
      ]);
      console.log(
        "Invalid CSV!",
        item.value,
        `https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=${gid}`
      );
    }
  }

  const summarySheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
  for (const [title, data] of Object.entries(worksheets)) {
    const individualSheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, individualSheet, title);
  }
  XLSX.writeFile(workbook, XLSX_FILE, { compression: true });
}

run();
