const express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/:sheetid/:gid', (req, res) => {
    var f1 = req.params.sheetid;
    var f2 = req.params.gid
    request(`https://docs.google.com/spreadsheets/d/${f1}/export?format=csv&gid=${f2}`, (err, response, body) => {
        if (err) {
            res.send({
                data: [],
                msg: 'Error from node server',
                status: 500
            })
        }
        if (response.statusCode == 200) {
            res.send({
                data: body,
                msg: 'Data fetched from node server',
                status: response.statusCode
            });
        } else {
            res.send({
                data: [],
                msg: 'Data fetched from node server',
                status: response.statusCode
            });
        }
    })
});

app.listen(3000, () => console.log('Gator app listening on port 3000!'));