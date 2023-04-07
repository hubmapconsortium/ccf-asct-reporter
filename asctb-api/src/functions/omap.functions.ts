import { OMAP_ORGAN, OMAP_HEADER_FIRST_COLUMN, Structure } from '../models/api.model';
import { buildMetadata, findHeaderIndex } from './api.functions';

export class OmapDataTransformer {
    private data: string[][];
    private headerRow: number;

    constructor(data: string[][]) {
        this.data = data;
    }

    public transformOmapData(): string[][] {
        this.headerRow = findHeaderIndex(0, this.data, OMAP_HEADER_FIRST_COLUMN);
        // Initializing with the MetaData
        const asctbConverted: string[][] = [];
        // Add metadata and new header row and the actual data
        asctbConverted.push(...this.data.slice(0, this.headerRow), this.createNewHeaderRow(), ...this.createData());
        return asctbConverted;
    }

    private createNewHeaderRow(): string[] {
        let maxProteins = this.data.slice(this.headerRow + 1).map(subArr => subArr[0].split(',').length);
        let newHeaderRow = ['AS/1', 'AS/1/LABEL', 'AS/1/ID'];
        for (let i = 1; i <= Math.max(...maxProteins); i++) {
            newHeaderRow.push(`BP/${i}`);
            newHeaderRow.push(`BP/${i}/LABEL`);
            newHeaderRow.push(`BP/${i}/ID`);
        }
        return newHeaderRow;
    }

    private createData(): string[][] {
        const organ = this.getDOIOrganMapping();
        const dataObject: Record<string, string>[] = this.createMapOfOldColumnsAndValues();
        let transformedData: string[][] = [];

        dataObject.map(data => {
            const uniprots = data['uniprot_accession_number'].split(', ');
            const hgncIds = data['HGNC_ID'].split(', ');
            let targetNames = data['target_name'].split(', ');

            if (data['uniprot_accession_number'] != '' && data['HGNC_ID'] != '' && data['target_name'] != '') {
                let newrow = [organ.name, organ.rdfs_label, organ.id];
                const maxBPs = Math.max(uniprots.length, hgncIds.length, targetNames.length);
                for (let i = 0; i < maxBPs; i++) {
                    newrow.push(targetNames[i] ?? '', uniprots[i] ?? '', hgncIds[i] ?? '')
                }
                transformedData.push(newrow);
            }
            else {
                transformedData.push([organ.name, organ.rdfs_label, organ.id]);
            }
        });

        return transformedData;
    }

    /** Helper functions for createData */

    // Future releases will have organ column so will need to update this
    private getDOIOrganMapping(): Structure {
        const warnings = new Set<string>();
        const metadataRows = this.data.slice(0, this.headerRow);
        const metadata = buildMetadata(metadataRows, warnings);
        return OMAP_ORGAN[metadata.data_doi as string];
    }

    private createMapOfOldColumnsAndValues(): Record<string, string>[] {
        let dataObject: Record<string, string>[] = [];
        const columns = this.data[this.headerRow].map(col => col);

        this.data.slice(this.headerRow + 1).map(subArr => {
            const keyValuePairs = columns.reduce((acc: Record<string, string>, key, index) => {
                acc[key] = subArr[index];
                return acc;
            }, {});
            dataObject.push(keyValuePairs);
        });
        return dataObject;
    }
}
