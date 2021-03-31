## Visualization
---

This section goes over what the visualization comprises of, how it works and how the user the navigate through it.

<br>

##### Getting Started

1. Go to the ASCT+B Reporter via [this](https://ccf-asct-reporter.netlify.app/v2/) link.

2. Click on the **Go to Visualization** button and select the organ sheet that you would like to view.

<img src="assets/docs/visualization/gotovis.png" class="md-img p-2 w-25">

<br>
<br>
<br>


The visualization in the ASCT+B Reporter consists of a tree structure that respresents the relationships between **Anatomical Structures** (AS) and its substructures (colored in red). This tree is clumped with a bimodal network that represents the relationships between these AS and their **Cell Types** (CT, colored in blue) and their **Biomarkers** (B, colored in green).

<div class="text-center"> 
  <img src="assets/docs/visualization/vis1.png" class="md-img p-2 w-100">
  <small>ASCT+B Reporter Visualization</small>
</div>

<br>

#### Partonomy Tree

<img src="assets/docs/visualization/partonomy.png" class="md-img p-2 w-25 ml-5" align="right">

The partonomy tree visualizes anatomical structures (AS) and substructures. They are color coded in red. It makes use of [Vega's Tree Layout](https://vega.github.io/vega/examples/tree-layout/) to visualize relationships between anatomical structures and its substructures. The tree consists for a root node called `Body`. This node is a pseudo node, and is added to keep the visualization error free. Since it is a tree structure, having multiple parents for a node violated the algorithm. Therefore, to prevent any errors why [comparing](https://github.com/hubmapconsortium/ccf-asct-reporter/wiki/Compare) or linking your own sheet, the Body node acts as a singular parent.

On hovering over any AS nodes which is not on the last layer (leaf nodes) will reveal a tooltip that will show the structure's ontology link. Please note that this part of the visualization is not interactive. This part of the visualization cannot be sorted. Ontology links are shown below the name of the node by default. To know how to switch them off click [here](/docs?id=5).

<br>


##### Defining Uniqueness of Nodes

To create a error free visualization while also trying to capture the requirements of the data, the Reporter takes a few steps to define unique nodes. The algorithm uses a combination of,
1. name of the structure
2. ontology link of the structure
3. rdfs label of the structure
4. a custom comparator value that keeps tract of the current node's parent(s).

The comparator is needed because there are many instances where the node has the same name, ontology link and rdfs label, but have different parents. So if the comparator was not present, such nodes would get merged and would be show linked to the parent node that appears first in the visualization creating process. 

<br>

##### Peculiar Behavior

<img src="assets/docs/visualization/peculiar-table.png" class="md-img p-2 w-25" align="right">

Sometimes, the anatomical structures count can be lesser than the **absolute** count. This is due to the fact that this algorithm is a tree, and having multiple parent nodes is not allowed. So such nodes are clubbed together, if they occur. For example consider a table like the one given on the right,

<br>

Below is how the table would be visualized as,

<img src="assets/docs/visualization/peculiar-vis.png" class="md-img p-2 w-25">

<br>
<br>

Here, A3’s parent is A2 (in row 13), so even though there’s no structure after A2 in row 12, the A3 in row 2 will be added to A2. Which is why the number of connections are lesser as a lot of the nodes are getting matched together, giving a lower number. The reason it is this way is because the visualization is a *tree* and a node cannot have multiple parents. Therefore, the A2 in row 12 and A2 in row 13 cannot appear as 2 different nodes (unless they’re different with diff uberon or label) because then A3 would have 2 parents – which is not allowed by the visualization (Vega).

<br>

##### Last Layer of the Partonomy Tree

The nodes in the last layer of the partonomy tree are technically not a part of the partonomy tree. These nodes behave differently than all the other AS nodes (they can be horved and clicked on). The `x` and `y` coordinates from the last level of the partonomy tree are used to build the first level of the bimodal network, that is then placed on top of the layer layer of the partonomy tree. This is a perfect overlap because the coordinates for all the nodes are the same. By being placed in a custom built visualization, it follows the algorithm that makes it interactive. Hovering and clicking on these nodes will highlight the respective CT and B nodes that the node is connected to.

<br>

#### Bimodal Network

The bimodal network links the anatomical structures to the cell types, and then the cell types to the biomarkers. This section will be describing how that is done.

<br>

##### Cell Type Layer (CT nodes)

This is the second layer of the biomdal network that depicts the relationships between the Anatomical Structures and their typology of cells. These nodes are colored in blue. Hovering and clicking on these nodes will highlight the respective AS and B nodes that the node is connected to. These connections are made by using the last layer of the anatomical structures from the main data. These nodes are case sensitive. They are built by using 2 configuration variables `bimodal_distance_x` (which is the horizontal distance between the last layer of the AS nodes and the CT nodes) and `bimodal_distance_y` (which is the vertical distance between each CT node). These both can be configured on the fly (please see [Graph Controls](/docs?id=5)). Uniqueness of these nodes are defines by the combination of the name, ontology link and the rdfs label. Ontology links are shown below the name of the node by default. To know how to switch them off click [here](/docs?id=5).

These nodes have additional functions. To more about them click [here](/docs?id=4). 

<br>

##### Biomarker Layer (B nodes)

This is the third layer of the bimodal network that shows teh relationships between Cell Types and their Biomarkers. These nodes are colored in green.  Hovering and clicking on these nodes will highlight the respective CT and B nodes that the node is connected to. They are built by using 2 configuration variables `bimodal_distance_x`(which is the horizontal distance between the CT nodes and the B nodes) and `bimodal_distance_y` (which is the vertical distance between each B node). These both can be configured on the fly (please see [Graph Controls](/docs?id=5)). These nodes are case sensitive. Uniqueness of these nodes are defines by the combination of the name, ontology link and the rdfs label.  Ontology links are shown below the name of the node by default. To know how to switch them off click [here](/docs?id=5).

These nodes have additional functions. To more about them click [here](/docs?id=4).

<br> 

To sum it up, the image below depicts how the visualization is built,


<img src="assets/docs/visualization/workflow.png" class="md-img p-2 w-100">