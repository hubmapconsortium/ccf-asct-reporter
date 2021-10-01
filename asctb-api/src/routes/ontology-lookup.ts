import { Express, Request, Response } from 'express';
import { LookupResponse, OntologyCode } from '../models/lookup.model';
import { buildASCTApiUrl, buildHGNCApiUrl, buildHGNCLink, buildUniprotLink, buildEntrezLink } from '../functions/lookup.functions';
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

    switch (ontologyCode) {
    case OntologyCode.HGNC: {
      const response = await axios.get(buildHGNCApiUrl(termId), {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status === 200 && response.data) {
        const firstResult = response.data.response.docs[0];
        res.send({
          extraLinks: {
            'Uniprot Link': buildUniprotLink(firstResult.uniprot_ids[0]),
            'Entrez Link': buildEntrezLink(firstResult.entrez_id)
          },
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
      const response = await axios.get(
        buildASCTApiUrl(`${ontologyCode}:${termId}`)
      );
      if (response.status === 200 && response.data) {
        const firstResult = response.data._embedded.terms[0];

        res.send({
          label: firstResult.label,
          link: firstResult.iri,
          description: firstResult.annotation.definition
            ? firstResult.annotation.definition[0]
            : ''
        } as LookupResponse);
      } else {
        res.status(response.status).end();
      }
    }
    }
  });
}
