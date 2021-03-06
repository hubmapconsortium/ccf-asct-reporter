
import { PLAYGROUND_CSV } from './../const'
import { makeASCTBData } from "./../utils/data";
const papa = require('papaparse');
const express = require('express');
const app = express.Router();
const axios = require("axios");

app.get("/:sheetid/:gid", async (req:any, res:any) => {
  let f1 = req.params.sheetid;
  let f2 = req.params.gid;
   
  try {
    let response: any;

    if (f1 === '0' && f2 === '0') {
      response = {data: PLAYGROUND_CSV}
    } else {
      response = await axios.get(`https://docs.google.com/spreadsheets/d/${f1}/export?format=csv&gid=${f2}`);
    }
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

app.get("/playground", async (req: any, res: any) => {

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

app.post('/playground', async (req: any, res: any) => {
  const csv = papa.unparse(req.body);
  try {
    const data = await makeASCTBData(req.body.data);
    res.send({
      data: data,
      parsed: req.body,
      csv: csv
    })
  } catch(err) {
    console.log(err)
    return res.status(500).send({
      msg: JSON.stringify(err),
      code: 500
    })
  }
})

module.exports = app;