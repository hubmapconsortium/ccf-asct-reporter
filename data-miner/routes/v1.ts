
const express = require('express');
const axios = require('axios');
const app = express.Router();


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

module.exports = app;