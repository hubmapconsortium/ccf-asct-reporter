## Data Format
---

Existing ontologies (Uberon, FMA, CL, HGNC, etc.) have thousands of terms and form a complex knowledge graph. They were designed for different purposes and frequently cover developmental and disease terms. For developing a reference atlas of the healthy human adult body within HuBMAP, we need a unified view of AS, CT, and B. In close collaboration with other consortia, we agreed to focus on part_of relationships so that the network graph can be simplified to a hierarchy. This makes it easier to develop user interfaces that enable investigators to quickly drill down, in an intuitive way, from whole-body, to organ, to organ parts, to cell types, and eventually to specific biomarkers assays associated with those cells. Also, the ASCT+B tables capture the located_in relationships of CT and AS and the characterize relationships between B and CT. The ASCT+B tables are not creating new ontologies. Rather, they help construct a uniform and simplified view of AS, CT, and B and their interlinkages relevant for the design of a healthy human reference atlas with cross-walks to multiple existing ontologies that are revised and extended in the process.


*The template for the ASCT+B Tables can be found [here](https://docs.google.com/spreadsheets/d/1F7D0y7pNPVIR3W4LjjtIMGg7rKTOxwyjVKzS-iiffz4/edit#gid=2034682742).*

<br>

#### “About Table” Information (first 10 rows)

The first 10 rows describes the following content,

- Organ name
- Author information name and ORCID (lead author first, co-authors following) on row 3
- Reviewer name(s) on row 4
- Date started
- Date last modified
- Version number
- List of major publications
- Coverage of table organ

<br>

#### Header Information (11th row)

The data is formatted in a specific way to keep it standardized across all organs and make it easier to convert the data into a machine-readable format. The 11th row is the most important row, and each column must have text in the following pattern(s)

<div class="text-center bg-light py-3">
  <h6 class="m-0">ENTITY/NUMBER/DATA_TYPE</h6>
</div>

<br>

- **ENTITY** values: `AS`, `CT`, `BP`, `BG`, `REF` (required)
- **NUMBER** can be non-negative numbers starting from 1 (required)
- **DATA_TYPE** values: `ID`, `LABEL`, `DOI` (optional)

<br>

###### Note

- For the data to be visualized, the data **must** conform to this structure. 
- There should be only one item per cell. Multiple items in a single cell separated by commas or any delimiter will be considered and visualized as a single entity. 
- Headers must be on row 11. The positioning of the columns do not matter (i.e `AS/1/LABEL` to be beside `AS/1`. It can be anywhere on the table as long as the column header is on row 11).

<div class="text-center"> 
  <img src="assets/docs/data-format/table.png" class="md-img p-2 w-100">
  <small>Screenshot of the ASCT+B Table Template</small>
</div>