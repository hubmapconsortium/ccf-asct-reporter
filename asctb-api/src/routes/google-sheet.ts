import axios from 'axios';
import { Express, Request, Response } from 'express';
import papa from 'papaparse';

import { PLAYGROUND_CSV } from '../../const';
import { makeASCTBData } from '../functions/api.functions';
import { makeGraphData } from '../functions/graph.functions';

export function setupGoogleSheetRoutes(app: Express): void {

  /**
   * Fetch a Google Sheet given the sheet id and gid. Parses the data and returns JSON format.
   */
  app.get('/v2/:sheetid/:gid', async (req: Request, res: Response) => {
    console.log(`${req.protocol}://${req.headers.host}${req.originalUrl}`);

    const f1 = req.params.sheetid;
    const f2 = req.params.gid;

    try {
      let response: {data: string};

      if (f1 === '0' && f2 === '0') {
        response = { data: PLAYGROUND_CSV };
      } else {
        response = await axios.get(
          `https://docs.google.com/spreadsheets/d/${f1}/export?format=csv&gid=${f2}`
        );
      }
      const { data, errors } = papa.parse<string[]>(response.data);

      const asctbData = makeASCTBData(data);

      return res.send({
        data: asctbData.data,
        metadata: asctbData.metadata,
        // warnings: asctbData.warnings + errors.map(n => 'SOMETHING'),
        csv: response.data,
        parsed: data
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        msg: 'Please check the table format or the sheet access',
        code: 500,
      });
    }
  });

  /**
   * Fetch a Google Sheet given the sheet id and gid. Parses the data and returns Graph format.
   */
  app.get('/v2/:sheetid/:gid/graph', async (req: Request, res: Response) => {
    console.log(`${req.protocol}://${req.headers.host}${req.originalUrl}`);
    const sheetID = req.params.sheetid;
    const gID = req.params.gid;
    try {
      let resp: {data: string};

      if (sheetID === '0' && gID === '0') {
        resp = { data: PLAYGROUND_CSV };
      } else {
        resp = await axios.get(
          `https://docs.google.com/spreadsheets/d/${sheetID}/export?format=csv&gid=${gID}`
        );
      }
      const { data } = papa.parse<string[]>(resp.data);
      const asctbData = makeASCTBData(data);
      const graphData = makeGraphData(asctbData.data);

      return res.send({
        data: graphData
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        msg: 'Please check the table format or the sheet access',
        code: 500,
      });
    }
  });
}
