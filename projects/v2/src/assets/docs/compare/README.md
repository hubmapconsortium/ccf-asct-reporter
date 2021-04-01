## Compare
---

You can now compare your own data with the ASCT+B Master data that is visualized on the Reporter. In order to do this, you will need to have you data on Google Sheets (uploading XL files is not supported) with public access, that can be uploaded in the Reporter. This feature is particularly useful if you have a subset of the data that you have found in your research and you would like to see how it compares to the data in the ASCT+B Tables.

<br>

#### Usage

1. To access the Compare feature, head over to the toolbar at the top and click on *Compare* (shown in the image below)

   <img src="assets/docs/compare/toolbar.png" alt="Compare Icon Toolbar" class="md-img p-2 w-50">
   <br>
   <br>

2. A drawer will pop up from the side that will show a few instructions and the various input fields.
   - **Title**: *Optional*. This is the title by which the uploaded sheet can be identified by. By default it is given a title in the format `Sheet <number>`. This number corresponds to the index of the sheet in the compare feature. If you have added sheets, the default title of the sheets would be `Sheet 1` and `Sheet 2` respectively.
   - **Description**: *Optional*. This field holds a small description about what your data is about. It is empty by default.
   - **Google Sheets Link**: *Required*. This field will hold the sheet link to your data. Your data has to be in the specified format that can be found [here](https://docs.google.com/spreadsheets/d/1bsA-HngthTD7NtzAfab8t3EVjFFT439-Pc-mp_mdZUU/edit#gid=0).
   - **Color picker**: *Optional*. This is a swatch that will allow you to pick the color. A random color is assigned my default.
   
   <br>
   <img src="assets/docs/compare/cmp.png" alt="Compare Dialog" class="md-img p-2 w-50">
   <br>
   <br>

3. Additional sheets can also be added in the same way by clicking on the **+ Add** button at the bottom.
4. Clicking on **Compare** will then render the new data on the visualization after the Reporter have successfully received the data. (sometimes this can take a few seconds). The results of a compared data is shown below (with the updated legend),

   <img src="assets/docs/compare/result.png" alt="Compare Results" class="md-img p-2 w-50">
   <img src="assets/docs/compare/legend.png" alt="Compare Legend" class="md-img p-2 w-25" align="right">
   <br>
   <br>

#### Characteristics

   - All links (paths, relationships) that are common between the master data and the uploaded data are highlighted in the selected color.
   - All nodes that are common between teh master data and the uploaded data are highlighted in the selected color.
   - All the new nodes have been added to the visualization with a dashed stoke around them in the selected color.

<br>

#### Note

In order for the compare feature to work properly, make sure,
- The sheet on Google Sheets has public access. The permissions on Google should look something like this,

   <img src="assets/docs/compare/permissions.png" alt="Compare Results" class="md-img p-2 w-25">
   <br>
   <br>
- The data should be in the format specified [here](https://docs.google.com/spreadsheets/d/1bsA-HngthTD7NtzAfab8t3EVjFFT439-Pc-mp_mdZUU/edit#gid=0). Its completely fine to not include headers that are not required for your data. For example, if you have just cell types in your data you can just have `CT/1` in your sheet, and that would work fine with the Reporter. Therefore, the headers matter.

<br>

*To try it out, head to the [Kidney Visualization](/vis?sheet=kidney&version=latest) and try to compare [this](https://docs.google.com/spreadsheets/d/1qG7Uy7G-SMN3p1nqz1ulOBxbb2Oif2A7OnX94U39B08/edit#gid=0) sheet to replicate the above demonstration.*



