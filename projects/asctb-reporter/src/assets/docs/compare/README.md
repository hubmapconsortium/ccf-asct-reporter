## Compare
---

You can now compare your own data with that visualized by the ASCT+B Reporter. In order to do this, you will need to have your data in the ASCT+B table Google Sheets template with public access so it can be uploaded into the Reporter. NOTE: .xls files are not supported. The compare feature is particularly useful if you have data from your own research that you would like to compare to the data in the ASCT+B Master Tables.

<br>

#### Usage

1. 1.	To access the compare feature, go to the toolbar at the top and click on *Compare* (shown in the image below)

   <img src="assets/docs/compare/toolbar.png" alt="Compare Icon Toolbar" class="md-img p-2 w-75">
   <br>
   <br>

2. A drawer will pop up from the side that will show a few instructions and the various input fields.
   - **Title** (optional): This is the title by which the uploaded sheet can be identified. By default it is given a title in the format `Sheet <number>`. This number corresponds to the index of the sheet in the compare feature. If you have added sheets, the default title of the sheets would be `Sheet 1` and `Sheet 2` respectively.
   - **Description** (optional): This field holds a small description of your data. It is empty by default. 
   - **Google Sheet Link (or CSV)** (optional): This field will hold the sheet link to your data. Your data has to be in the specified format that can be found [here](https://docs.google.com/spreadsheets/d/1tK916JyG5ZSXW_cXfsyZnzXfjyoN-8B2GXLbYD6_vF0/edit#gid=559906129).
   - **Upload File** (optional): You can upload your own file by clicking the **Upload** attachments icon.
   We should upload a file or a link to a Google Sheet. This is required if you want to compare your data with the data in the ASCT+B Master Tables.
   - **Color selector** (optional): This is a swatch that will allow you to choose the color. A random color is assigned by default. 
   
   <br>
   <img src="assets/docs/compare/cmp-updated.png" alt="Compare Dialog" class="md-img p-2 w-50">
   <br>
   <br>

3. Additional sheets can also be added in the same way by clicking on the **+ Add** button at the bottom.
4. 4.	Clicking on *Compare* will then render the new data on the visualization after the Reporter has successfully received the data (sometimes this can take a few seconds). The results of the compared data are shown below (with the updated legend).

   <img src="assets/docs/compare/result.png" alt="Compare Results" class="md-img p-2 w-50">
   <img src="assets/docs/compare/legend.png" alt="Compare Legend" class="md-img p-2 w-25" align="right">
   <br>
   <br>

5. Reports are generated for each of the sheets separately that lists various statistics (common counts, uncommon counts etc). More information about the report can be found in the Report section.

#### Characteristics

   - All links (paths, relationships) that are common between the master data and the uploaded data are highlighted in the selected color.
   - All nodes that are common between the master table and the uploaded data are highlighted in the selected color.
   - All the new nodes have been added to the visualization with a dashed line around them in the selected color.

<br>

#### Note

In order for the compare feature to work properly, make sure,
- The Google Sheet you’re using has public access; permissions on Google should look something like this:

   <img src="assets/docs/compare/permissions.png" alt="Compare Results" class="md-img p-2 w-50">
   <br>
   <br>
- The data should be in the format specified [here](https://docs.google.com/spreadsheets/d/1tK916JyG5ZSXW_cXfsyZnzXfjyoN-8B2GXLbYD6_vF0/edit#gid=559906129). Its completely fine to not include headers that are not required for your data. For example, if you have just cell types in your data you can just have `CT/1` in your sheet, and that would work fine with the Reporter. Therefore, the headers matter.

<br>

*To try it out, go to the [Kidney Visualization](/vis?sheet=kidney&version=latest) and try to compare [this](https://docs.google.com/spreadsheets/d/1qG7Uy7G-SMN3p1nqz1ulOBxbb2Oif2A7OnX94U39B08/edit#gid=0) sheet to replicate the above demonstration.*



