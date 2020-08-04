const express = require("express");
var bodyParser = require("body-parser");
const axios = require("axios");
var cors = require("cors");
var path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

app.get("/", (req, res) => {
  res.sendFile('views/home.html', {root: __dirname});
});

app.get("/:sheetid/:gid", (req, res) => {
  var f1 = req.params.sheetid;
  var f2 = req.params.gid;
  axios
    .get(
      `https://docs.google.com/spreadsheets/d/${f1}/export?format=csv&gid=${f2}`
    )
    .then((response) => {
      if (response.status === 200) {
        res.status(206).send(response.data);
      }
    })
    .catch((err) => {
      if (err) {
        res.statusMessage = 'Node server could not fetch sheet'
        
        res.status(500).end();
      }
    });
});

app.listen(process.env.PORT || 5000)
