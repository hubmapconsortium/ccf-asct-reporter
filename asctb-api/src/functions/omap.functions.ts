import { OMAP_ORGAN } from '../models/api.model';
import { buildMetadata } from './api.functions';
import * as fs from 'fs';


interface headerow {
    isOmap: boolean;
    headerRow: number;
};

export function transformOmapData(data: string[][], headerRow: number): string[][] {
    const warnings = new Set<string>();
    const metadataRows = data.slice(0, headerRow);
    const metadata = buildMetadata(metadataRows, warnings);
    const organ = OMAP_ORGAN[metadata.data_doi as string];
    const columns = data[headerRow].map(col => col);

    let asctbConverted: string[][] = [];

    for (let i = 0; i < headerRow; i++) {
        asctbConverted.push(data[i]);
    }
    console.log(asctbConverted);

    let maxProteins = data.slice(headerRow + 1).map(subArr => subArr[0].split(',').length);

    let newHeaderRow = ['AS/1', 'AS/1/LABEL', 'AS/1/ID'];

    for (let i = 1; i <= Math.max(...maxProteins); i++) {
        newHeaderRow.push(`BP/${i}`);
        newHeaderRow.push(`BP/${i}/LABEL`);
        newHeaderRow.push(`BP/${i}/ID`);
    }
    asctbConverted.push(newHeaderRow);

    let dataObject: Record<string, string>[] = [];

    data.slice(headerRow + 1).map(subArr => {
        const keyValuePairs = columns.reduce((acc: Record<string, string>, key, index) => {
            acc[key] = subArr[index];
            return acc;
        }, {});
        dataObject.push(keyValuePairs);
    });

    dataObject.map(data => {
        const uniprots = data['uniprot_accession_number'].split(', '); // 2
        const hgncIds = data['HGNC_ID'].split(', '); // 3
        let targetNames = data['target_name'].split(', '); // 1

        if (data['uniprot_accession_number'] != '' && data['HGNC_ID'] != '' && data['target_name'] != '') {
            let newrow = [organ.name, organ.rdfs_label, organ.id];
            const maxBPs = Math.max(uniprots.length, hgncIds.length, targetNames.length);
            for (let i = 0; i < maxBPs; i++) {
                newrow.push(targetNames[i] ?? '', uniprots[i] ?? '', hgncIds[i] ?? '')
            }
            asctbConverted.push(newrow);
        }
        else {
            asctbConverted.push([]);
        }
    });
    return asctbConverted;
}

export function getOmapHeaderRow(data: String[][], omapHeader: String, asctbHeader: string): headerow {
    let result: headerow;
    data.map((subData, i) => {
        console.log(subData);
        if (subData[0] == omapHeader) {
            result = { isOmap: true, headerRow: i };
            return;
        }
        if (subData[0] == asctbHeader) {
            result = { isOmap: false, headerRow: i };
            return;
        }
    })

    return result;
}



export const arrayToCsv = (array: any[], fileName: string): void => {
    let csvContent = '';

    // Convert array to CSV format
    array.forEach(row => {
        const csvRow = row.map((value: any) => `"${value}"`).join(",");
        csvContent += csvRow + '\n';
    });

    // Write CSV content to file
    fs.writeFile(fileName, csvContent, (err) => {
        if (err) {
            console.error(`Failed to write CSV file: ${err}`);
        } else {
            console.log(`CSV file "${fileName}" has been saved successfully.`);
        }
    });
};