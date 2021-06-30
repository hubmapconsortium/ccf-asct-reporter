## Visualization Functions
---

To make the visualization more interactive, there are certain functions like sorting, sizing, and filtering that can be performed on various nodes. These functionalities only apply to CT and B nodes. The figure below shows the visualization functions that can be accessed via the control pane on the left.

<img src="assets/docs/vis-functions/vf.png" alt="Vis Functions Full" class="md-img p-2 w-50" >

<br>
<br>
<br>


##### Terminologies

- **Indegree**: Number of incoming links into a node
- **Outdegree**: Number of outgoing links from the node
- **Degree**: Sum of the indegree and outdegree

<br>

##### Sorting

CT and B nodes can be sorted *alphabetically* or by their *degree*. By default, these nodes are sorted Alphabecially. Selecting any of the options will cause the visualization to re-render.

<br>

##### Sizing

CT and B nodes can be sized based on their *indegree*, *outdegree* and *degree*. By default, all the nodes are sized based on the default value of `300`. Since the outdegree is the same and the indegree for the B nodes, you can just sort B nodes by their *degree*. Selecting any of the options will cause the visualization to re-render.

<br>

##### Filtering

The Reporter currently supports two types of bomarkers,

- Protein (denoted by BProtein in the ASCT+B Tables)
- Gene (denoted by BGene in the ASCT+B Tables)
- Proteoform (denoted by BProteoform in the ASCT+B Tables)
- Lipid (denoted by BLipid in the ASCT+B Tables)
- Metabolites (denoted by BMetabolites in the ASCT+B Tables)

By using the third select menu in the biomarker Functions, B nodes can be filtered based on their type. Selecting any of the options will cause the visualization to re-render.
