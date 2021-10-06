import { JsonLd } from 'jsonld/jsonld-spec';
import { Edge_type, GraphData } from '../models/graph.model';
import { fixOntologyId, guessIri } from './lookup.functions';


export function makeJsonLdData(data: GraphData): JsonLd {
  const { nodes, edges } = data;
  const iriLookup: Record<number, string> = {};
  const nodeMap = new Map<string, any>();

  nodes.forEach((node, index) => {
    let ontologyId = node.metadata.ontologyId;
    let iri: string;
    if (ontologyId?.trim().length > 0 ?? false) {
      ontologyId = fixOntologyId(ontologyId);
      iri = guessIri(ontologyId);
    }
    if (!iri) {
      const suffix = node.name?.toLowerCase().trim().replace(/\W+/g, '-').replace(/[^a-z0-9-]+/g, '');
      ontologyId = `ASCTB-TEMP:${suffix}`;
      iri = `https://purl.org/ccf/ASCTB-TEMP_${suffix}`;
    }
    iriLookup[index] = iri;

    if (!nodeMap.has(iri)) {
      nodeMap.set(iri, {
        '@id': iri,
        '@type': 'owl:Class',
        'id': ontologyId,
        'asctb_type': node.type,
        'label': node.metadata.label || node.metadata.name,
        'preferred_label': node.name || node.metadata.label
      });
    }
  });

  edges.forEach((edge, index) => {
    const source = {
      iri: iriLookup[edge.source],
      type: nodes[edge.source].type,
      node: nodeMap.get(iriLookup[edge.source])
    };
    const target = {
      iri: iriLookup[edge.target],
      type: nodes[edge.target].type,
      node: nodeMap.get(iriLookup[edge.target])
    };

    if (source.iri !== target.iri) {
      switch (source.type + target.type) {
      case Edge_type.AS_AS:
        target.node.part_of = (target.node.part_of ?? new Set()).add(source.iri);
        break;
      case Edge_type.AS_CT:
        target.node.located_in = (target.node.located_in ?? new Set()).add(source.iri);
        break;
      case Edge_type.CT_CT:
        target.node.is_a = (target.node.is_a ?? new Set()).add(source.iri);
        break;
      case Edge_type.CT_G:
      case Edge_type.CT_P:
      case Edge_type.CT_BL:
      case Edge_type.CT_BM:
      case Edge_type.CT_BF:
        target.node.characterizes = (target.node.characterizes ?? new Set()).add(source.iri);
        break;
      case Edge_type.AS_G:
      case Edge_type.AS_P:
        target.node.occurs_in = (source.node.occurs_in ?? new Set()).add(source.iri);
        break;
      default:
        console.log(source.type + target.type);
      }
    }
  });

  for (const node of nodeMap.values()) {
    let subclasses = node['rdfs:subClassOf'] ?? [];
    Object.assign(node, {
      part_of: node.part_of ? [...node.part_of] : undefined,
      located_in: node.located_in ? [...node.located_in] : undefined,
      is_a: node.is_a ? [...node.is_a] : undefined,
      characterizes: node.characterizes ? [...node.characterizes] : undefined,
      occurs_in: node.occurs_in ? [...node.occurs_in] : undefined,
    });

    if (node.part_of) {
      subclasses = subclasses.concat(
        node.part_of.map((iri: string, index: number) => ({
          '@id': `_:n${node.id.replace(':','')}_ASAS${index}`,
          '@type': 'owl:Restriction',
          onProperty: 'ccf:ccf_part_of',
          // onProperty: 'http://purl.obolibrary.org/obo/RO_0001025',
          someValuesFrom: iri,
        }))
      );
    }
    if (node.located_in) {
      subclasses = subclasses.concat(
        node.located_in.map((iri: string, index: number) => ({
          '@id': `_:n${node.id.replace(':','')}_ASCT${index}`,
          '@type': 'owl:Restriction',
          onProperty: 'ccf:located_in',
          someValuesFrom: iri,
        }))
      );
    }
    if (node.is_a) {
      subclasses = subclasses.concat(
        node.is_a.map((iri: string, index: number) => ({
          '@id': `_:n${node.id.replace(':','')}_CTCT${index}`,
          '@type': 'owl:Restriction',
          onProperty: 'ccf:ct_is_a',
          someValuesFrom: iri,
        }))
      );
    }
    if (node.characterizes) {
      subclasses = subclasses.concat(
        node.characterizes.map((iri: string, index: number) => ({
          '@id': `_:n${node.id.replace(':','')}_CTBM${index}`,
          '@type': 'owl:Restriction',
          onProperty: 'ccf:characterizes',
          someValuesFrom: iri,
        }))
      );
    }
    if (node.occurs_in) {
      subclasses = subclasses.concat(
        node.occurs_in.map((iri: string, index: number) => ({
          '@id': `_:n${node.id.replace(':','')}_ASBM${index}`,
          '@type': 'owl:Restriction',
          onProperty: 'ccf:occurs_in',
          someValuesFrom: iri,
        }))
      );
    }

    if (subclasses.length > 0) {
      node['rdfs:subClassOf'] = subclasses;
    }
  }

  return {
    '@context': {
      ccf: 'http://purl.org/ccf/latest/ccf.owl#',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
      oboInOwl: 'http://www.geneontology.org/formats/oboInOwl#',
      owl: 'http://www.w3.org/2002/07/owl#',
      id: 'oboInOwl:id',
      label: 'rdfs:label',
      preferred_label: 'ccf:ccf_preferred_label',
      asctb_type: 'ccf:asctb_type',
      defines: {
        '@reverse': 'rdfs:isDefinedBy'
      },
      onProperty: {
        '@id': 'owl:onProperty',
        '@type': '@id'
      },
      someValuesFrom: {
        '@id': 'owl:someValuesFrom',
        '@type': '@id'
      },
      // part_of: {
      //   '@id': 'ccf:ccf_part_of',
      //   // '@id': 'http://purl.obolibrary.org/obo/RO_0001025',
      //   '@type': '@id'
      // },
      // located_in: {
      //   '@id': 'ccf:located_in',
      //   '@type': '@id'
      // },
      // is_a: {
      //   '@id': 'ccf:ct_is_a',
      //   '@type': '@id'
      // },
      // characterizes: {
      //   '@id': 'ccf:characterizes',
      //   '@type': '@id'
      // },
      // occurs_in: {
      //   '@id': 'ccf:occurs_in',
      //   '@type': '@id'
      // }
    },
    '@graph': [
      ...[
        {
          '@id': 'http://purl.org/ccf/latest/ccf.owl#',
          '@type': 'owl:Ontology',
          label: 'CCF ASCT+B Tables',
          defines: [
            {
              '@id': 'ccf:ccf_part_of',
              '@type': 'owl:ObjectProperty',
              label: 'ccf part of'
            },
            {
              '@id': 'ccf:characterizes',
              '@type': 'owl:ObjectProperty',
              label: 'characterizes'
            },
            {
              '@id': 'ccf:ct_is_a',
              '@type': 'owl:ObjectProperty',
              label: 'cell type is a'
            },
            {
              '@id': 'ccf:located_in',
              '@type': 'owl:ObjectProperty',
              label: 'located in'
            },
            {
              '@id': 'ccf:occurs_in',
              '@type': 'owl:ObjectProperty',
              label: 'occurs in'
            }
          ]
        },
        {
          '@id': 'oboInOwl:id',
          '@type': 'owl:AnnotationProperty',
          label: 'ID'
        }
      ],
      ...nodeMap.values()
    ]
  };
}
