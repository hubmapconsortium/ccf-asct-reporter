const express = require("express");
var bodyParser = require("body-parser");
const axios = require("axios");
var cors = require("cors");
var path = require('path');
var papa = require('papaparse');
var fs = require('fs');


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

interface IObjectKeys {
  [key: string]: string;
}
interface Structure {
  name?: string;
  id?: string;
  rdfs_label?: string;
}

interface RowI {
  organ?: Structure;
  anatomical_structures?: Array<Structure>;
  tissue_type?: Structure;
  cell_type?: Structure;
  biomarkers?: Array<Structure>;
}

class Row {
  organ: Structure;
  anatomical_structures: Array<Structure>;
  tissue_type: Structure;
  cell_type: Structure;
  biomarkers: Array<Structure>;

  constructor() {
    this.organ = {}
    this.anatomical_structures = []
    this.tissue_type = {}
    this.cell_type = {}
    this.biomarkers = []
  }
}

let  headerMap: any = {
  'Organ Name':'organ', 'Anatomical Structure':'anatomical_structures', 'Tissue Type': 'tissue_type', 'Cell Type': 'cell_type', 'Biomarker': 'biomarkers'}

let ids = '0123456789'

app.get("/new/:sheetid/:gid", async (req:any, res:any) => {
  var f1 = req.params.sheetid;
  var f2 = req.params.gid;

  
  
  try {
    const response = await axios.get(`https://docs.google.com/spreadsheets/d/${f1}/export?format=csv&gid=${f2}`)
    var data = papa.parse(response.data).data
    var headerRow = 11
    var headerLength = data[headerRow].length 
    var dataLength = data.length - headerRow
  
    
    var rows = [];
    for (var i = headerRow ; i < dataLength + headerRow; i ++ ) {
      let newRow: {[key: string]: any} = new Row()
      for (var j = 0 ; j < data[0].length; j ++) {
        if (data[i][j] === '') continue;
  
        let rowHeader = data[headerRow - 1][j].split('/')
        let key = headerMap[rowHeader[0]]
        if (rowHeader.length === 1) {
          newRow[key].name= data[i][j]
        } 
        
        if (rowHeader.length === 2 && Number(rowHeader[1])) {
          let s: Structure = {name: data[i][j]}
          newRow[key].push(s)
        } 
  
        if (rowHeader.length === 2 && rowHeader[1] == 'ID') {
          newRow[key].id = data[i][j]
        }
     
        if (rowHeader.length === 2 && rowHeader[1] == 'LABEL')
            newRow[key].rdfs_label = data[i][j]
        
  
        if (rowHeader.length === 3 && rowHeader[2] === 'ID') {
          newRow[key][parseInt(rowHeader[1]) - 1].id = data[i][j]
        } else if(rowHeader.length === 3 && rowHeader[2] === 'LABEL') {
          newRow[key][parseInt(rowHeader[1]) - 1].rdfs_label = data[i][j]
        }
        
      }
      rows.push(newRow)
    }
  } catch(err) {
    res.status(500).send({
      msg: 'Please check the table format or the sheet access',
      code: 500
    })
  }
  
  fs.writeFile("../src/app/tree/output.json", JSON.stringify({data: rows}), function(err:any) {
    if (err) throw err;
    console.log('complete');
    }
);
  res.send(rows)

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

app.listen(process.env.PORT || 5000)
