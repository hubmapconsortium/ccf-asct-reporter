import axios from 'axios';
import { Express, Request, Response } from 'express';
import { expand } from 'jsonld';
import papa from 'papaparse';

import { makeASCTBData } from '../functions/api.functions';
import { makeJsonLdData } from '../functions/graph-jsonld.functions';
import { makeGraphData } from '../functions/graph.functions';
import { UploadedFile } from '../models/api.model';


export function setupCSVRoutes(app: Express): void {

  /**
   * Fetch a CSV given a link and parse it into json or graph output
   */
  app.get('/v2/csv', async (req: Request, res: Response) => {
    console.log(`${req.protocol}://${req.headers.host}${req.originalUrl}`);

    // query parameters
    const url = req.query.csvUrl as string;
    const expanded = req.query.expanded !== 'false';
    const output = req.query.output as 'json' | 'graph' | 'jsonld' | string;

    try {
      let csvData = '';
      let parsedCsvData: any[] = [];

      const asctbDataResponses = await Promise.all(
        url.split('|').map(async (csvUrl) => {
          const response = await axios.get(csvUrl);
          csvData = response.data;

          const data = papa.parse(response.data, { skipEmptyLines: 'greedy' }).data;
          parsedCsvData = data;
          return makeASCTBData(data);
        })
      );
      const asctbData = ([] as any[]).concat(...asctbDataResponses);

      if (output === 'jsonld') {
        let graphData = makeJsonLdData(makeGraphData(asctbData));
        if (expanded) {
          graphData = await expand(graphData);
        }
        return res.send(graphData);
      } else if (output === 'graph') {
        const graphData = makeGraphData(asctbData);
        return res.send({
          data: graphData
        });
      } else {
        // The default is returning the json
        return res.send({
          data: asctbData,
          csv: csvData,
          parsed: parsedCsvData,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        msg: 'Please check the CSV format',
        code: 500,
      });
    }
  });

  /**
   * Parse a CSV into JSON format given the raw file formData
   */
  app.post('/v2/csv', async (req: Request, res: Response) => {
    console.log(`${req.protocol}://${req.headers.host}${req.originalUrl}`);

    const file = req.files.csvFile as UploadedFile;

    if (file.mimetype !== 'text/csv' || file.size > 10000000) {
      return res.status(400).send({
        msg: 'File must be a CSV less than 10 MB.',
        code: 400
      });
    }

    const dataString = file.data.toString();
    console.log('File uploaded: ', file.name);

    try {
      const data = papa.parse(dataString, { skipEmptyLines: 'greedy' }).data;
      const asctbData = await makeASCTBData(data);

      return res.send({
        data: asctbData,
        csv: dataString,
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
}
