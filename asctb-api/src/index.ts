/* tslint:disable:variable-name */
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import papa from 'papaparse';

import { PLAYGROUND_CSV } from '../const';
import { LookupResponse, OntologyCode } from './api.model';
import { buildASCTApiUrl, buildHGNCApiUrl, buildHGNCLink, makeASCTBData } from './api.functions';
import express from 'express';

export const app: express.Application = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../')));



app.get('/v2/:sheetid/:gid', async (req: express.Request, res: express.Response) => {
  console.log(`${req.protocol}://${req.headers.host}${req.originalUrl}`);

  const f1 = req.params.sheetid;
  const f2 = req.params.gid;

  try {
    let response: any;

    if (f1 === '0' && f2 === '0') {
      response = { data: PLAYGROUND_CSV };
    } else {
      response = await axios.get(
        `https://docs.google.com/spreadsheets/d/${f1}/export?format=csv&gid=${f2}`
      );
    }
    const data = papa.parse(response.data).data;

    const asctbData = await makeASCTBData(data);

    return res.send({
      data: asctbData,
      csv: response.data,
      parsed: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      msg: 'Please check the table format or the sheet access',
      code: 500,
    });
  }
});

app.post('/v2/csv', async (req: express.Request, res: express.Response) => {
  console.log(`${req.protocol}://${req.headers.host}${req.originalUrl}`);
  const url = req.body.csvUrl;

  try {
    const response = await axios.get(url);

    const data = papa.parse(response.data, {skipEmptyLines: 'greedy'}).data;
    const asctbData = await makeASCTBData(data);

    return res.send({
      data: asctbData,
      csv: response.data,
      parsed: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      msg: 'Please check the CSV format',
      code: 500,
    });
  }
});

app.get('/v2/playground', async (req: express.Request, res: express.Response) => {
  console.log(`${req.protocol}://${req.headers.host}${req.originalUrl}`);
  try {
    const parsed = papa.parse(PLAYGROUND_CSV).data;
    const data = await makeASCTBData(parsed);
    return res.send({
      data: data,
      csv: PLAYGROUND_CSV,
      parsed: parsed,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      msg: JSON.stringify(err),
      code: 500,
    });
  }
});

app.post('/v2/playground', async (req: express.Request, res: express.Response) => {
  const csv = papa.unparse(req.body);
  try {
    const data = await makeASCTBData(req.body.data);
    return res.send({
      data: data,
      parsed: req.body,
      csv: csv,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      msg: JSON.stringify(err),
      code: 500,
    });
  }
});

app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile('views/home.html', { root: path.join(__dirname, '../../') });
});

app.get('/:sheetid/:gid', async (req: express.Request, res: express.Response) => {
  const f1 = req.params.sheetid;
  const f2 = req.params.gid;

  try {
    const response = await axios.get(
      `https://docs.google.com/spreadsheets/d/${f1}/export?format=csv&gid=${f2}`
    );
    if (response.headers['content-type'] !== 'text/csv') {
      res.statusMessage = 'Please check if the sheet has the right access';
      res.status(500).end();
      return;
    }

    if (response.status === 200) {
      res.status(206).send(response.data);
    }
  } catch (err) {
    console.log(err);
    res.statusMessage = err;
    res.status(500).end();
  }
});

/**
 * Given an ontology code (UBERON, FMA, CL, or HGNC), and a numerical ID of a term,
 * call the corresponding external ontology API to fetch data about that term, including
 * label and description.
 */
app.get('/lookup/:ontology/:id',  async (req: express.Request, res: express.Response) => {
  const ontologyCode = req.params.ontology.toUpperCase();
  const termId = req.params.id;

  switch (ontologyCode) {
  case OntologyCode.HGNC: {
    const response = await axios.get(buildHGNCApiUrl(termId), {
      headers: {'Content-Type': 'application/json'}
    }
    );
    if (response.status === 200 && response.data) {
      const firstResult = response.data.response.docs[0];

      res.send({
        label: firstResult.symbol,
        link: buildHGNCLink(firstResult.hgnc_id),
        description: firstResult.name ? firstResult.name : ''
      } as LookupResponse);

    } else {
      res.status(response.status).end();
    }
    break;
  }
  case OntologyCode.UBERON:
  case OntologyCode.CL:
  case OntologyCode.FMA: {
    const response = await axios.get(buildASCTApiUrl(`${ontologyCode}:${termId}`));
    if (response.status === 200 && response.data) {
      const firstResult = response.data._embedded.terms[0];

      res.send({
        label: firstResult.label,
        link: firstResult.iri,
        description: firstResult.annotation.definition ? firstResult.annotation.definition[0] : ''
      } as LookupResponse);

    } else {
      res.status(response.status).end();
    }
    break;
  }
  default: {
    // 400
    res.statusMessage = 'Invalid ID';
    res.status(400).end();
    break;
  }
  }

});



app.listen(process.env.PORT || 5000);

