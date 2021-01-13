const express = require("express");
var bodyParser = require("body-parser");
const axios = require("axios");
var cors = require("cors");
var path = require('path');
var papa = require('papaparse');
var fs = require('fs');

import { PLAYGROUND_CSV } from './const'


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

interface IObjectKeys {
  [key: string]: string;
}

enum BM_TYPE {
  G = 'gene',
  P = 'protein'
}

class Structure {
  name?: string;
  id?: string;
  rdfs_label?: string;
  b_type?: BM_TYPE;

  constructor(name: string) {
    this.name = name;
    this.id = '';
    this.rdfs_label = '';
    
  }
}

class Row {
  anatomical_structures: Array<Structure>;
  cell_types: Array<Structure>;
  biomarkers: Array<Structure>;

  constructor() {
    this.anatomical_structures = []
    this.cell_types = []
    this.biomarkers = []
  }
}

let headerMap: any = {
 'AS':'anatomical_structures', 'CT': 'cell_types', 'BG': 'biomarkers', 'BP': 'biomarkers'
}

app.get("/v2/:sheetid/:gid", async (req:any, res:any) => {
  console.log(req.protocol + "://" + req.headers.host + req.originalUrl)

  let f1 = req.params.sheetid;
  let f2 = req.params.gid;
  
  try {
    const response = await axios.get(`https://docs.google.com/spreadsheets/d/${f1}/export?format=csv&gid=${f2}`);
    let data = papa.parse(response.data).data

    const asctbData = await makeASCTBData(data);

    return res.send({
      data: asctbData,
      csv: response.data,
      parsed: data
    })
  } catch(err) {
    console.log(err)
    return res.status(500).send({
      msg: 'Please check the table format or the sheet access',
      code: 500
    })
  }
})

app.get("/v2/playground", async (req: any, res: any) => {
  console.log(req.protocol + "://" + req.headers.host + req.originalUrl)

  try {
    const parsed = papa.parse(PLAYGROUND_CSV).data
    const data = await makeASCTBData(parsed);
    return res.send({
      data: data,
      csv: PLAYGROUND_CSV,
      parsed: parsed
      
    })
  } catch(err) {
    console.log(err)
    return res.status(500).send({
      msg: JSON.stringify(err),
      code: 500
    })
  }
})


app.get("/", (req:any, res:any) => {
  res.sendFile('views/home.html', {root: __dirname});
});
   
app.get("/:sheetid/:gid", async (req: any, res: any) => {
  var f1 = req.params.sheetid;
  var f2 = req.params.gid;

  try {
    const response = await axios.get(`https://docs.google.com/spreadsheets/d/${f1}/export?format=csv&gid=${f2}`)
    if (response.headers['content-type'] !== 'text/csv') {
      res.statusMessage = 'Please check if the sheet has the right access'
      res.status(500).end();
      return
    }

    if (response.status === 200) {
      res.status(206).send(response.data);
    }

  } catch (err) {
    console.log(err)
    res.statusMessage = err
    res.status(500).end();
  }
});

function makeASCTBData(data: any) {
  return new Promise((res, rej) => {
    let rows = [];
    let headerRow = 11
    let dataLength = data.length
  

    try {
      for (let i = headerRow ; i < dataLength; i ++ ) {
        let newRow: {[key: string]: any} = new Row()
  
        for (let j = 0 ; j < data[0].length; j ++) {
          if (data[i][j] === '') continue;
    
          let rowHeader = data[headerRow - 1][j].split('/');
          let key = headerMap[rowHeader[0]]
          
          if (key === undefined) continue;
  
          if (rowHeader.length === 2 && Number(rowHeader[1])) {
            let s = new Structure(data[i][j])
            if (rowHeader[0] === 'BG') s.b_type = BM_TYPE.G
            if (rowHeader[0] === 'BP') s.b_type = BM_TYPE.P
            newRow[key].push(s)
          } 
          
    
          if (rowHeader.length === 3 && rowHeader[2] === 'ID') {
            let n = newRow[key][parseInt(rowHeader[1]) - 1]
            if (n)
            n.id = data[i][j]
          } else if(rowHeader.length === 3 && rowHeader[2] === 'LABEL') {
            let n = newRow[key][parseInt(rowHeader[1]) - 1];
            if (n)
            n.rdfs_label = data[i][j]
          }
          
        }
        rows.push(newRow)
        
      } 
      res(rows)
    } catch(err) {
      rej(err)
    }

  })
}

app.listen(process.env.PORT || 5000)
