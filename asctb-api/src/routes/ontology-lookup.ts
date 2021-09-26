import { Express, Request, Response } from 'express';
import { LookupResponse, OntologyCode } from '../models/lookup.model';
import { buildASCTApiUrl, buildHGNCApiUrl, buildHGNCLink } from '../functions/lookup.functions';
import axios from 'axios';

export function setupOntologyLookupRoutes(app: Express): void {

  /**
   * Given an ontology code (UBERON, FMA, CL, or HGNC), and a numerical ID of a term,
   * call the corresponding external ontology API to fetch data about that term, including
   * label and description.
   */
  app.get('/lookup/:ontology/:id', async (req: Request, res: Response) => {
    const ontologyCode = req.params.ontology.toUpperCase();
    const termId = req.params.id;
    const output = req.query.output as 'graph' | string;

    switch (ontologyCode) {
    case OntologyCode.HGNC: {
      const response = await axios.get(buildHGNCApiUrl(termId), {
        headers: { 'Content-Type': 'application/json' }
      }
      );
      if (response.status === 200 && response.data) {
        const firstResult = response.data.response.docs[0];

        const details = {
          label: firstResult.symbol,
          link: buildHGNCLink(firstResult.hgnc_id),
          description: firstResult.name ? firstResult.name : ''
        };
        res.send({
          ...(output == 'graph' && {'additionalInfo':  firstResult}),
          ...details
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

        const details = {
          label: firstResult.label,
          link: firstResult.iri,
          description: firstResult.annotation.definition ? firstResult.annotation.definition[0] : ''
        };
        res.send({
          ...(output == 'graph' && {'additionalInfo':  firstResult}),
          ...details
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
}
