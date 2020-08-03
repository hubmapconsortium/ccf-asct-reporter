const express = require('express');
var bodyParser = require('body-parser');
const axios = require('axios')
var cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/:sheetid/:gid', (req, res) => {
    var f1 = req.params.sheetid;
    var f2 = req.params.gid
    axios.get(`https://docs.google.com/spreadsheets/d/${f1}/export?format=csv&gid=${f2}`)
        .then(response => {
            if (response.status === 200) {
                res.send({
                    data: response.data,
                    msg: 'Data fetched from node server',
                    status: response.status
                });
            } else {
                res.send({
                    data: [],
                    msg: 'Data fetched from node server',
                    status: response.status
                });
            }
        })
        .catch(err => {
            if (err) {
                res.send({
                    data: [],
                    msg: 'Error from node server',
                    status: 500
                })
            }
        })
});

app.listen(3000, () => console.log('Gator app listening on port 3000!'));