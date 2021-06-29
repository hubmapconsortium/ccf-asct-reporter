## Data Format
---

Existing ontologies (Uberon, FMA, CL, HGNC, etc.) have thousands of terms and form a complex knowledge graph. They were designed for different purposes and frequently cover developmental and disease terms. For developing a reference atlas of the healthy human adult body within HuBMAP, we need a unified view of AS, CT, and B. In close collaboration with other consortia, we agreed to focus on part_of relationships so that the network graph can be simplified to a hierarchy. This makes it easier to develop user interfaces that enable investigators to quickly drill down, in an intuitive way, from whole-body, to organ, to organ parts, to cell types, and eventually to specific biomarkers associated with those cells. The ASCT+B tables also capture the located_in relationships of CT and AS and the characterize relationships between B and CT. The ASCT+B tables are not creating new ontologies. Rather, they help construct a uniform and simplified view of AS, CT, and B and their interlinkages relevant for the design of a healthy human reference atlas with cross-walks to multiple existing ontologies that are revised and extended in the process.


*The template for the ASCT+B Tables version 1 can be found [here](https://docs.google.com/spreadsheets/d/1tK916JyG5ZSXW_cXfsyZnzXfjyoN-8B2GXLbYD6_vF0/edit#gid=2034682742).*

*The template for the ASCT+B Tables version 2 can be found [here](https://docs.google.com/spreadsheets/d/1tK916JyG5ZSXW_cXfsyZnzXfjyoN-8B2GXLbYD6_vF0/edit#gid=559906129).*

*The template for the ASCT+B Tables version 2 can be found [here](https://docs.google.com/spreadsheets/d/1tK916JyG5ZSXW_cXfsyZnzXfjyoN-8B2GXLbYD6_vF0/edit#gid=559906129).*

<br>

#### “About Table” Information (first 10 rows)

The first 10 rows describes the following content,

- Organ name on row 1
- Author name(s) (lead author first, co-authors following) on row 3
- Author ORCID ID(s) (lead author first, co-authors following) on row 4
- Reviewer name(s) on row 5
- General publication on row 6
- Data DOI on row 7
- Date table is published row 8
- Version number of published table row 9

<br>

#### Header Information (11th row)

The data is formatted in a specific way to keep it standardized across all organs and make it easier to convert the data into a machine-readable format. The 11th row is the most important row, and each column must have text in the following pattern(s)

<div class="text-center bg-light py-3">
  <h6 class="m-0">ENTITY/NUMBER/DATA_TYPE</h6>
</div>

<br>

- **ENTITY** values: `AS`, `CT`, `BProtein`, `BGene`, `BProteoform`, `BLipid`, `BMetabolites`, `REF` (required)
- **NUMBER** can be non-negative numbers starting from 1 (required)
- **DATA_TYPE** values: `ID`, `LABEL`, `DOI` (optional)

<br>

###### Note

- For the data to be visualized, the data **must** conform to this structure. 
- There should be only one item per cell. Multiple items in a single cell separated by commas or any delimiter will be considered and visualized as a single entity. 
- Headers should start with `AS/1` as the first column from any row position. The positioning of all other columns do not matter (i.e `AS/1/LABEL` to be beside `AS/1`. It can be anywhere on the table as long as the column header begin with `AS/1` as the first column).

<div class="text-center"> 
  <img src="assets/docs/data-format/table.png" class="md-img p-2 w-100">
  <small>Screenshot of the ASCT+B Table Template</small>
</div>
