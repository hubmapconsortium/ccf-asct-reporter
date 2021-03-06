const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const v2Routes = require('./routes/v2');
const v1Routes = require('./routes/v1');

export const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use('/', v1Routes)
app.use('/v2', v2Routes)

app.get("/", (req:any, res:any) => {
  res.sendFile('views/home.html', {root: __dirname});
});

app.listen(process.env.PORT || 5000);
