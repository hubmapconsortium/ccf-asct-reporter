/* tslint:disable:variable-name */
const express = require('express');
var bodyParser = require('body-parser');
const axios = require('axios');
var cors = require('cors');
var path = require('path');
var papa = require('papaparse');
var fs = require('fs');

import { PLAYGROUND_CSV } from '../const';
import { LookupResponse, OntologyCode } from './models';
import { buildASCTApiUrl, buildHGNCApiUrl, buildHGNCLink } from './url-util';

export const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../')));

interface Reference {
  id?: string;
  doi?: string;
  notes?: string;
}

enum BM_TYPE {
  G = 'gene',
  P = 'protein',
  BL = 'lipids',
  BM = 'metalloids',
  BF = 'proteoforms',
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
  biomarkers_protein: Array<Structure>;
  biomarkers_gene: Array<Structure>;
  biomarkers_lipids: Array<Structure>;
  biomarkers_meta: Array<Structure>;
  biomarkers_prot: Array<Structure>;
  references: Reference[];

  constructor() {
    this.anatomical_structures = [];
    this.cell_types = [];
    this.biomarkers_protein = [];
    this.biomarkers_gene = [];
    this.biomarkers = [];
    this.biomarkers_lipids = [];
    this.biomarkers_meta = [];
    this.biomarkers_prot = [];
    this.references = [];
  }
}

const headerMap: any = {
  AS: 'anatomical_structures',
  CT: 'cell_types',
  BG: 'biomarkers_gene',
  BP: 'biomarkers_protein',
  BGene: 'biomarkers_gene',
  BProtein: 'biomarkers_protein',
  REF: 'references',
  BLipid: 'biomarkers_lipids',
  BMetabolites: 'biomarkers_meta',
  BProteoform: 'biomarkers_prot',
  BL: 'biomarkers_lipids',
  BM: 'biomarkers_meta',
  BF: 'biomarkers_prot',
};

app.get('/v2/:sheetid/:gid', async (req: any, res: any) => {
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

app.post('/v2/csv', async (req: any, res: any) => {
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

app.get('/v2/playground', async (req: any, res: any) => {
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

app.post('/v2/playground', async (req: any, res: any) => {
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

app.get('/', (req: any, res: any) => {
  res.sendFile('views/home.html', { root: path.join(__dirname, '../../') });
});

app.get('/:sheetid/:gid', async (req: any, res: any) => {
  var f1 = req.params.sheetid;
  var f2 = req.params.gid;

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
app.get('/lookup/:ontology/:id',  async (req: any, res: any) => {
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
      res.statusMessage = "Invalid ID";
      res.status(400).end();
      break;
    }
  }

});

function makeASCTBData(data: any) {
  return new Promise((res, rej) => {
    const rows = [];
    let headerRow = 0;
    const dataLength = data.length;

    try {
      for (let i = headerRow; i < dataLength; i++) {
        if (data[i][0] !== 'AS/1') {
          continue;
        }
        headerRow = i + 1;
        break;
      }

      for (let i = headerRow; i < dataLength; i++) {
        const newRow: { [key: string]: any } = new Row();

        for (let j = 0; j < data[0].length; j++) {
          if (data[i][j] === '') {
            continue;
          }

          const rowHeader = data[headerRow - 1][j].split('/');
          const key = headerMap[rowHeader[0]];

          if (key === undefined) {
            continue;
          }

          if (rowHeader.length === 2 && Number(rowHeader[1])) {
            if (rowHeader[0] === 'REF') {
              const ref: Reference = { id: data[i][j] };
              newRow[key].push(ref);
            } else {
              const s = new Structure(data[i][j]);
              if (rowHeader[0] === 'BGene' || rowHeader[0] === 'BG') {
                s.b_type = BM_TYPE.G;
              }
              if (rowHeader[0] === 'BProtein' || rowHeader[0] === 'BP') {
                s.b_type = BM_TYPE.P;
              }
              if (rowHeader[0] === 'BLipid' || rowHeader[0] === 'BL') {
                s.b_type = BM_TYPE.BL;
              }
              if (rowHeader[0] === 'BMetabolites' || rowHeader[0] === 'BM') {
                s.b_type = BM_TYPE.BM;
              }
              if (rowHeader[0] === 'BProteoform' || rowHeader[0] === 'BF') {
                s.b_type = BM_TYPE.BF;
              }
              newRow[key].push(s);
            }
          }

          if (rowHeader.length === 3 && rowHeader[2] === 'ID') {
            const n = newRow[key][parseInt(rowHeader[1]) - 1];
            if (n) {
              n.id = data[i][j];
            }
          } else if (rowHeader.length === 3 && rowHeader[2] === 'LABEL') {
            const n = newRow[key][parseInt(rowHeader[1]) - 1];
            if (n) {
              n.rdfs_label = data[i][j];
            }
          } else if (rowHeader.length === 3 && rowHeader[2] === 'DOI') {
            const n: Reference = newRow[key][parseInt(rowHeader[1]) - 1];
            if (n) {
              n.doi = data[i][j];
            }
          } else if (rowHeader.length === 3 && rowHeader[2] === 'NOTES') {
            const n: Reference = newRow[key][parseInt(rowHeader[1]) - 1];
            if (n) {
              n.notes = data[i][j];
            }
          }
        }

        rows.push(newRow);
      }

      for (const row of rows) {
        row.biomarkers = row.biomarkers_gene
          .concat(row.biomarkers_protein)
          .concat(row.biomarkers_lipids)
          .concat(row.biomarkers_meta)
          .concat(row.biomarkers_prot);
      }
      res(rows);
    } catch (err) {
      rej(err);
    }
  });
}

app.listen(process.env.PORT || 5000);

