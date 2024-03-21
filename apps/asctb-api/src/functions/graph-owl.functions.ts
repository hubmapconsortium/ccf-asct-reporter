import { JsonLd } from 'jsonld/jsonld-spec';
import { Readable } from 'stream';

export async function makeOwlData(data: JsonLd): Promise<string> {
  const inputReadable = new Readable({
    read: () => {
      inputReadable.push(JSON.stringify(data));
      inputReadable.push(null);
    },
  });

  // This package has some kind of incompatibility with how nx transpiles/executes modules
  // If imported top level the serve command fails with `require() of ES Module [...] not supported`
  // Dynamically importing the module works fine though!
  const { default: formats } = await import('@rdfjs-elements/formats-pretty');
  const input = formats.parsers.import('application/ld+json', inputReadable);
  const output = formats.serializers.import('application/rdf+xml', input);

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
