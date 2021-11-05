## Visualization
---
This section goes over what the visualization is comprised of, how it works, and how the user navigates through it.

<br>

##### Getting Started

1. Go to the ASCT+B Reporter via [this](https://ccf-asct-reporter.netlify.app/v2/) link.

2. Click on the **Go to Visualization** button and select the organ sheet that you would like to view.

<img src="assets/docs/visualization/gotovis.png" class="md-img p-2 w-25">

<br>
<br>
<br>

A organ selector table pops up. Select the organ you would like to view. The table will show the organ's name, the organ's Version drop down. If you would like to view the organ's version, select the version from the drop down. If there is only one version for any organ, the drop down will not show but instead a simple label will be shown.

<br>
<img src="assets/docs/visualization/organ-selector-table.png" class="md-img p-2 w-50">

<br>
<br>

After you select the organ, when you click on the **Submit** button, the organ sheets will be loaded and Visualization will be rendered.


The visualization in the ASCT+B Reporter consists of a tree structure that representing the relationships between **Anatomical Structures** (AS) and their substructures (colored in red). This tree is combined with a bimodal network that represents the relationships between these AS and their **Cell Types** (CT, colored in blue) and their **Biomarkers** (B, colored in green).

<div class="text-center"> 
  <img src="assets/docs/visualization/vis1.png" class="md-img p-2 w-100">
  <small>ASCT+B Reporter Visualization</small>
</div>

<br>

#### Partonomy Tree

<img src="assets/docs/visualization/partonomy.png" class="md-img p-2 w-25 ml-5" align="right">

The partonomy tree visualizes anatomical structures (AS) and substructures and color codes them in red. It makes use of [Vega's Tree Layout](https://vega.github.io/vega/examples/tree-layout/) to visualize relationships between anatomical structures and their substructures. The tree consists of a root node called Body. This node is a pseudo node and is added to keep the visualization error free. Since it is a tree structure, having multiple parents for a node would violate the algorithm. Thus, to prevent any errors while comparing or linking your own sheet, the Body node acts as a singular parent.

Hovering over any AS nodes which are not on the last layer (leaf nodes) will reveal a tooltip that will show the structure's ontology link. Please note that this part of the visualization is not interactive and cannot be sorted. Ontology links are shown below the name of the node by default. To learn how to switch them off check the *Visualization Functions* section.

<br>


##### Defining Uniqueness of Nodes

To create an error-free visualization while also trying to capture the requirements of the data, the Reporter takes a few steps to define unique nodes. The algorithm uses a combination of the structure’s name, ontology link, and rdfs label, along with a custom comparator value that keeps track of the current node’s parent(s).

The comparator is needed because there are many instances where nodes with the same name, ontology link, and rdfs label will have different parents. If the comparator was not present, such nodes would get merged and shown as linked to the parent node that appears first in the visualization creating process.

<br>

##### Peculiar Behavior

<img src="assets/docs/visualization/peculiar-table.png" class="md-img p-2 w-25" align="right">

Sometimes, the anatomical structures count can be less than the absolute count. This is because the algorithm is a tree, and having multiple parent nodes is not allowed. Therefore, such nodes are clubbed together, if they occur. For example, consider a table like the one given on the right:

<br>

Below is how the table would be visualized as,

<img src="assets/docs/visualization/peculiar-vis.png" class="md-img p-2 w-25">

<br>
<br>

Here, A3’s parent is A2 (in row 13), so even though there’s no structure after A2 in row 12, the A3 in row 2 will be added to A2. This is why the number of connections is lower than the absolute count. Because a node in a tree visualization cannot have multiple parents, A2 in row 12 and A2 in row 13 cannot appear as different nodes because A3 would then have two parents.

<br>

##### Last Layer of the Partonomy Tree

The nodes in the last layer of the partonomy tree are technically not a part of the partonomy tree. These nodes behave differently than all the other AS nodes (they can be hovered over and clicked on). The x and y coordinates from the last level of the partonomy tree are used to build the first level of the bimodal network, which is then placed on top of the layer of the partonomy tree. This is a perfect overlap because the coordinates for all the nodes are the same. By being placed in a custom-built visualization, it follows the algorithm that makes it interactive. Hovering and clicking on these nodes will highlight the respective CT and B nodes to which they connect.

<br>

#### Bimodal Network

The bimodal network links the anatomical structures to the cell types, and then the cell types to the biomarkers. This section will describe how that is done.

<br>

##### Cell Type Layer (CT nodes)

This is the second layer of the bimodal network that depicts the relationships between anatomical structures and their cell types. Hovering and clicking on these blue nodes will highlight the respective AS and B nodes to which they connect. These connections are made by using the last layer of the anatomical structures from the main data. These nodes are case sensitive. They are built by using two configuration variables `bimodal_distance_x` (the horizontal distance between the last layer of the AS nodes and the CT nodes) and `bimodal_distance_y` (the vertical distance between each CT node), both of which can be configured on the fly (see Graph Controls). Node uniqueness is defined by the combination of the name, ontology link, and rdfs label. Ontology links are shown below the name of the node by default. To know how to switch them off, click here; to learn additional functions, click here.

<br>

##### Biomarker Layer (B nodes)

This is the third layer of the bimodal network that shows the relationships between cell types and their biomarkers. Hovering and clicking on these green nodes will highlight the respective CT and B nodes to which they connect. They are built by using two configuration variables `bimodal_distance_x` (the horizontal distance between the CT nodes and the B nodes) and `bimodal_distance_y` (the vertical distance between each B node), both of which can be configured on the fly (see Graph Controls). These nodes are case sensitive. Node uniqueness is defined by the combination of the name, ontology link, and rdfs label. Ontology links are shown below the name of the node by default. To know how to switch them off, click here; to learn additional functions, click here.

<br> 

To sum it up, the image below depicts how the visualization is built:


<img src="assets/docs/visualization/workflow.png" class="md-img p-2 w-100">


<br>
<br>
<br>

#### Interaction

The last layer of the partonomy tree (AS nodes), CT nodes, and B nodes are interactive.

##### Hover

Hovering over these nodes will highlight pathways linking them to other nodes. The nodes that are not a part of the relations are greyed. When a node is hovered over, a tooltip pops up that has the following data:

- Name
- Degree
- Indegree
- Outdegree
- Ontology ID
- rdfs:label

The image below shows a screenshot of a hovered-over node,

<img src="assets/docs/visualization/hover.png" class="md-img p-2 w-50">

<br>
<br>

##### Click

Clicking on a node will cause the highlights between the nodes to persist. The nodes that are not related have their opacities further reduced. The node text should also be bolded. The image below shows a screenshot of a clicked-over node.

<img src="assets/docs/visualization/click.png" class="md-img p-2 w-50">

<br>
<br>


**Info Sheet**

Clicking on the name of a node will cause a bottom sheet to pop up that shows the *description*, *ontology ID*, and the *IRI* of the particular node fetched from [this](https://www.ebi.ac.uk/) API. Note that this only works for AS nodes that have ontology IDs. The image below shows a screenshot of the bottom sheet.

<img src="assets/docs/visualization/bottomsheet.png" class="md-img p-2 w-50">

<br>
<br>

**References**

Clicking on a path will open a bottom sheet which lists the DOI References.

<img src="assets/docs/visualization/doi.png" class="md-img p-2 w-50">

<br>
<br>