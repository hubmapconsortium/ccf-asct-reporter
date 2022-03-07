## Report
---

The report computes and generates various statistics from the data (current organ sheet). These can be exported in XL format. The numbers in the report are affected by the applied filters (eg. count for gene biomarkers, protein biomarkers etc).


#### Usage

1. Click on the **Report** button in the nav-bar to generate and dsiplay the report.

   <img src="assets/docs/report/nav.png" alt="Report Icon Nav" class="md-img p-2 w-75">
   <br>
   <br>

2. The generated report will pop up from the right.

   <img src="assets/docs/report/report.png" alt="Report" class="md-img p-2 w-75">
   <br>
   <br>

3. To download the report in XL format, click on the *Download* button at the top. If there are multiple compare sheets, they will appear as different sheets in the XL workbook.

   <img src="assets/docs/report/report-download.png" alt="Report Download" class="md-img p-2 w-25">
   <br>
   <br>

<br>

#### Report Tabs

<br>

##### Main Sheet

This tab will contain the statistics of the master table of that selected organ. The main sections of this tab are,

- **Unique Entities**: Unique counts of AS, CT and B.
- **Entity Links**: Count of the linkages between various entities, namely,
    - part_of
    - located_in
    - characterizes
- **Ontology Links**: Separate graphs showing the count of structures that have Ontology IDs and that do not.
- **Alphabetical listing of AS, CT and B**: This section has expandable panels that name provide the names of the nodes for which the counts were generated above. 
- **Counts By Organ and Biomarker Type**: If selected single organ is selected, this section will not be shown and there will be a expandable panel for Biomarkers type that contains counts for each Biomarker type in the above mentioned section. If multiple organs are selected, there will be a Table that contains counts all AS, CT, B and their tree and biomodal links.

<br>
Counts for each Biomarker type are shown in the following format if single organ is selected.:
<br>
<br>
<img src="assets/docs/report/biomarker-type.png" alt="Biomarker Type" class="md-img p-2 w-50">

<br>
<br>
If multiple organs are selected, the counts are shown in the following table format:
<br>
<br>
<img src="assets/docs/report/counts-by-organ.png" alt="Counts Table" class="md-img p-2 w-50">

<br>
<br>

##### How the counts are determined is explained below.

- **Counts**: Counts of AS, CT. The counts are calculated based on the unique ontology id entities in the master table. If the Id is not present then it is matched with the name of the entity.

- **Tree Links and Bimodal Links**: Count of the tree links between AS and AS and Biomodal links between AS - CT and CT - B. The counts are calculated based on the numbers of nodes that are connected with edges between AS-AS and AS-CT and CT-CT and CT-B.

- **Biomarker Counts**: BP, BG, BM, BL, and BF  Biomarker counts are calculated utilizing the master table's unique biomarker id entities, as well as the Biomarker Type. If the Id isn't present, the entity's name in connection to the Biomarker Type is used instead.


##### Compare Sheet

Each compare sheet has its own report. In order for data to be visible in this tab, make sure to use the compare feature and upload your data. These sheets can be individually downloaded as well as deleted. Once the data is there, the tab will look something like this:

<img src="assets/docs/report/compare-report.png" alt="Report Download" class="md-img p-2 w-25">
   <br>
   <br>


