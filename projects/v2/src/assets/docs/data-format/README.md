## Data Format
---

Existing ontologies (Uberon, FMA, CL, HGNC, etc.) have thousands of terms and form a complex knowledge graph. They were designed for different purposes and frequently cover developmental and disease terms. For developing a reference atlas of the healthy human adult body within HuBMAP, we need a unified view of AS, CT, and B. In close collaboration with other consortia, we agreed to focus on part_of relationships so that the network graph can be simplified to a hierarchy. This makes it easier to develop user interfaces that enable investigators to quickly drill down, in an intuitive way, from whole-body, to organ, to organ parts, to cell types, and eventually to specific biomarkers associated with those cells. The ASCT+B tables also capture the located_in relationships of CT and AS and the characterize relationships between B and CT. The ASCT+B tables are not creating new ontologies. Rather, they help construct a uniform and simplified view of AS, CT, and B and their interlinkages relevant for the design of a healthy human reference atlas with cross-walks to multiple existing ontologies that are revised and extended in the process.

The tables was authored using the Google sheets templates.

*The template for the ASCT+B Tables version 1 can be found [here](https://docs.google.com/spreadsheets/d/1tK916JyG5ZSXW_cXfsyZnzXfjyoN-8B2GXLbYD6_vF0/edit#gid=2034682742).*

*The template for the ASCT+B Tables version 2 can be found [here](https://docs.google.com/spreadsheets/d/1tK916JyG5ZSXW_cXfsyZnzXfjyoN-8B2GXLbYD6_vF0/edit#gid=559906129).*


<br>

#### Table Metadata Information (first 10 rows)

The first 10 rows describes the following content

| Row No.    | Variable Name          | Description                                                                                                                             |
|------------|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| 1          | Title                  | This cell is dedicated to the title of the sheet to specify the organ name                                                              |
| 3          | Author name(s)         | Lead author comes first, followed by co-authors separated by a semicolon (;)                                                            |
| 4          | Author ORCID ID(s)     | ORCID IDs for all authors. The lead author comes first, followed by co-authors separated by a semicolon (;); same sequence as in row 3. |
| 5          | Reviewer name(s)       | The names of the reviewers who review the table separated by a semicolon (;).                                                           |
| 6          | Reviewer ORCID ID(s)   | ORCID IDs for all reviewers separated by a semicolon (;); same sequence as in row 5.                                                    |
| 7          | General Publication(s) | Contains the publication DOI details separated by a semicolon (;)                                                                       |
| 8          | Data DOI               | This field contains the DOI link where the data is published                                                                            |
| 9          | Date                   | Date of creation in MM/DD/YYYY format.                                                                                                  |
| 10         | Version Number         | The version number of the table.                                                                                                        |


<br>

#### Header Information (11th row)

The data is formatted in a specific way to keep it standardized across all organs and make it easier to convert the data into a machine-readable format. The 11th row is the most important row, and each column must have text in the following pattern(s)

<div class="text-center bg-light py-3">
  <h6 class="m-0">ENTITY/n/DATA_TYPE</h6>
</div>

<br>

- **ENTITY** values: `AS`, `CT`, `BProtein`, `BGene`, `BProteoform`, `BLipid`, `BMetabolites`, `REF` (required)
- **n** can be non-negative numbers starting from 1 (required)
- **DATA_TYPE** values: `ID`, `LABEL`, `DOI` (optional)

<br>

| Column Name Format                                                          | Description                                                                                                                                            |
|-----------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| AS/n                                                                        | The name given by the SME to the anatomical structure.                                                                                                 |
| AS/n/LABEL                                                                  | The name given to the anatomical structure in the Uberon or FMA ontology (this may or may not be the same as the SME's assigned name).                 |
| AS/n/ID                                                                     | The Uberon or FMA ontology's unique ID for the anatomical structure.                                                                                   |
| CT/n                                                                        | The name given by the SME to the cell type.                                                                                                            |
| CT/n/LABEL                                                                  | The name given to the cell type in ontology (this may or may not be the same as the SME's assigned name).                                              |
| CT/n/ID                                                                     | The ontology's unique ID for the cell type.                                                                                                            |
| <BType>/n (BType can be BProtein, BGene, BProteoform, BLipid, BMetabolites) | The name given by the SME to the biomarker type.                                                                                                       |
| <BType>/n/LABEL                                                             | The name given to the biomarker type in the HGNC ontology (this may or may not be the same as the SME's assigned name).                                |
| <BType>/n/ID                                                                | The ontology's unique ID for the biomarker type.                                                                                                       |
| FTU                                                                         | If the FTU is present inside each row of the ASCT+B hierarchy, add a "1" to the FTU cell if it is there, or leave the cell empty if it is not present. |
| FTU/n                                                                       | The name given by the SME to the functional tissue unit (FTU).                                                                                         |
| FTU/n/LABEL                                                                 | The name given to the cell type in ontology (this may or may not be the same as the SME's FTU.                                                         |
| FTU/n/ID                                                                    | The ontology's unique ID for the FTU.                                                                                                                  |
| REF/n                                                                       | Bibliographic reference for the AS, CT, B, and their linkages; should include Authors (Year) Title. Venue.                                             |
| REF/n/DOI                                                                   | Unique Digital Object Identifier (DOI) for the journal article.                                                                                        |
| REF/n/NOTES                                                                 | Additional notes provided by the SME. |

<br>

###### Note

- For the data to be visualized, the data **must** conform to this structure. 
- There should be only one item per cell. Multiple items in a single cell separated by commas or any delimiter will be considered and visualized as a single entity. 
- Headers should start with `AS/1` as the first column from any row position. The positioning of all other columns do not matter (i.e `AS/1/LABEL` to be beside `AS/1`. It can be anywhere on the table as long as the column header begin with `AS/1` as the first column).

<div class="text-center"> 
  <img src="assets/docs/data-format/table.png" class="md-img p-2 w-100">
  <small>Screenshot of the ASCT+B Table Template</small>
</div>