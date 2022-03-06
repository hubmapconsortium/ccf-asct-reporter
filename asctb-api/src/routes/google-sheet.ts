
import { Express, Request, Response } from 'express';
import { fetchGeneralPublicationsData, makeASCTBData } from '../functions/api.functions';
import { PLAYGROUND_CSV } from '../../const';
import { makeGraphData } from '../functions/graph.functions';
import axios from 'axios';
import papa from 'papaparse';

export function setupGoogleSheetRoutes(app: Express): void {

  /**
   * Fetch a Google Sheet given the sheet id and gid. Parses the data and returns JSON format.
   */
  app.get('/v2/:sheetid/:gid', async (req: Request, res: Response) => {
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
      const generalPublications = await fetchGeneralPublicationsData(data)
      const asctbData = await makeASCTBData(data);

      return res.send({
        data: asctbData,
        generalPublications: generalPublications,
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

  /**
   * Fetch a Google Sheet given the sheet id and gid. Parses the data and returns Graph format.
   */
  app.get('/v2/:sheetid/:gid/graph', async (req: Request, res: Response) => {
    console.log(`${req.protocol}://${req.headers.host}${req.originalUrl}`);
    const sheetID = req.params.sheetid;
    const gID = req.params.gid;
    try {
      let resp: any;

      if (sheetID === '0' && gID === '0') {
        resp = { data: PLAYGROUND_CSV };
      } else {
        resp = await axios.get(
          `https://docs.google.com/spreadsheets/d/${sheetID}/export?format=csv&gid=${gID}`
        );
      }
      const data = papa.parse(resp.data).data;
      const asctbData = await makeASCTBData(data);
      const graphData = makeGraphData(asctbData);

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
