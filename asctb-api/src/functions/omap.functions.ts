import { OMAP_ORGAN, OMAP_HEADER_FIRST_COLUMN } from '../models/api.model';
import { buildMetadata, findHeaderIndex } from './api.functions';

export class OmapDataTransformer {
    private data: string[][];
    private headerRow: number;
    private _warnings: Set<string>;
    private metaData: Record<string, string | string[]>;
    private _transformedData: string[][];
    private columns: string[];

    constructor(data: string[][]) {
      this.data = data;
      this.headerRow = findHeaderIndex(0, this.data, OMAP_HEADER_FIRST_COLUMN);
      this.metaData = this.getMetaData();
      this._warnings = new Set<string>();
      this._transformedData = this.transformOmapData();
    }

    private transformOmapData(): string[][] {
      // Initializing with the MetaData
      const asctbConverted: string[][] = [];
      // Add metadata and new header row and the actual data
      asctbConverted.push(...this.data.slice(0, this.headerRow), this.createNewHeaderRow(), ...this.createData());
      return asctbConverted;
    }

    private createNewHeaderRow(): string[] {
      const maxProteins = this.data.slice(this.headerRow + 1).map(subArr => subArr[0].split(',').length);
      const newHeaderRow = ['AS/1', 'AS/1/LABEL', 'AS/1/ID'];
      for (let i = 1; i <= Math.max(...maxProteins); i++) {
        newHeaderRow.push(`BP/${i}`);
        newHeaderRow.push(`BP/${i}/LABEL`);
        newHeaderRow.push(`BP/${i}/ID`);
        newHeaderRow.push(`BP/${i}/NOTES`);
      }
      return newHeaderRow;
    }

    private createData(): string[][] {
      const dataObject: Record<string, string>[] = this.createMapOfOldColumnsAndValues();
      // Decides whether to take organs from table or constants
      const fetchOrgansFromTable = ['organ_id', 'organ_name'].every(column => this.columns.includes(column));
      const organ = OMAP_ORGAN[this.metaData.data_doi as string] ?? OMAP_ORGAN.default;
      if (!OMAP_ORGAN[this.metaData.data_doi as string] && !fetchOrgansFromTable) {
        this._warnings.add('WARNING: Organ Columns Missing and DOI mapping not present; Adding default Organ Columns.');
      }


      const transformedData: string[][] = [];
      const title = this.metaData.title;

      dataObject.forEach(data => {
        const uniprots = data.uniprot_accession_number.split(', ');
        const hgncIds = data.HGNC_ID.split(', ');
        const targetNames = data.target_name.split(', ');
        if (!(uniprots.length === hgncIds.length && hgncIds.length === targetNames.length)) {
          this.warnings.add('WARNING: Number of entires in column uniprot_accession_number, HGNC_ID,' +
                    `target_name are not equal in row ${data.rowNo}. uniprot_accession_number: ${uniprots.length};` +
                    `HGNC_ID: ${hgncIds.length}; target_name: ${targetNames.length}`);
        }
        let notes = `Extra information in "${title}", Row ${data.rowNo} \n`;
        notes += data.notes;

        if (data.uniprot_accession_number != '' && data.HGNC_ID != '' && data.target_name != '') {
          const newrow = fetchOrgansFromTable ? [data.organ_name, data.organ_name, data.organ_id] :
            [organ.name, organ.rdfs_label, organ.id];
          const maxBPs = Math.max(uniprots.length, hgncIds.length, targetNames.length);
          for (let i = 0; i < maxBPs; i++) {
            newrow.push(targetNames[i] ?? '', uniprots[i] ?? '', hgncIds[i] ?? '', notes ?? '');
          }
          transformedData.push(newrow);
        }
        else {
          transformedData.push(fetchOrgansFromTable ? [data.organ_name, data.organ_name, data.organ_id] :
            [organ.name, organ.rdfs_label, organ.id]);
        }
      });

      return transformedData;
    }

    /** Helper functions for createData */

    private getMetaData(): Record<string, string | string[]> {
      const warnings = new Set<string>();
      const metadataRows = this.data.slice(0, this.headerRow);
      return buildMetadata(metadataRows, warnings);
    }

    private createMapOfOldColumnsAndValues(): Record<string, string>[] {
      let dataObject: Record<string, string>[] = [];
      this.columns = this.data[this.headerRow].map(col => col);

      this.data.slice(this.headerRow + 1).forEach((subArr, index) => {
        const keyValuePairs = this.columns.reduce((acc: Record<string, string>, key, i) => {
          acc[key] = subArr[i];
          return acc;
        }, {});
        // 4 = Two blank rows + 1 for 0 indexing of headerrow + 1 for 0 indexing for subArr 
        keyValuePairs.rowNo = (index + this.headerRow + 4).toString();
        dataObject.push(keyValuePairs);
      });
      dataObject = this.createNotes(dataObject);
      return dataObject;
    }

    private createNotes(dataObject: Record<string, string>[]): Record<string, string>[] {
      const excludedKeys = ['uniprot_accession_number', 'HGNC_ID', 'target_name', 'rowNo'];
      dataObject.forEach(obj => {
        const entries = Object.entries(obj);
        const formattedEntries = entries
          .filter(([key, value]) => value !== undefined && value !== null && value !== '' && !excludedKeys.includes(key))
          .map(([key, value]) => `**${key}:** ${value}`);
        const result = `- ${formattedEntries.join('\n- ')}`;
        obj.notes = result;
      });
      return dataObject;
    }

    /** Getters */
    get transformedData(): string[][] {
      return this._transformedData;
    }

    get warnings(): Set<string> {
      return this._warnings;
    }
}
