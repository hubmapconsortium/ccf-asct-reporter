import { parsers, serializers } from '@rdfjs-elements/formats-pretty';
import { JsonLd } from 'jsonld/jsonld-spec';
import { Readable } from 'stream';


export async function makeOwlData(data: JsonLd): Promise<string> {
  const inputReadable = new Readable({
    read: () => {
      inputReadable.push(JSON.stringify(data));
      inputReadable.push(null);
    }
  });

  const input = parsers.import('application/ld+json', inputReadable);
  const output = serializers.import('application/rdf+xml', input);

  return new Promise((resolve) => {
    let xmlString = '';
    output.on('data', (xmlData: string) => {
      xmlString += xmlData;
    });
    output.on('end', () => {
      resolve(xmlString);
    });
  });
}
