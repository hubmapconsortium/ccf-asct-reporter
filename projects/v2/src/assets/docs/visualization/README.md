## Visualization
---

### Data Format

The data that the visualization uses can be found [here](https://docs.google.com/spreadsheets/d/1tK916JyG5ZSXW_cXfsyZnzXfjyoN-8B2GXLbYD6_vF0/edit#gid=2034682742). The data is formatted in a specific way to keep it standardized across all organs and make it easier to convert the data in to a machine readable format. Below are some of the key characteristics of the tables,
- First 10 rows are reserved for author details, comments and other meta data.
- The 11th row is the most important row where each column has to have text in the following pattern(s) - `ENTITY/NUMBER/DATA_TYPE`
   - ENTITY can be `AS`, `CT`, `BP`, `BG`, `REF`
   - NUMBER can be non-negative numbers starting from 1
   - DATA_TYPE can be `ID`, `LABEL`, `DOI`

- Example: `AS/1`, `AS/1/ID`, `BP/1/LABEL`

##### Important 

- For the data to be visualized, the data **must** conform to this structure. 
- There should be only one item per cell. Multiple items in a single cell separated by commas or any delimiter will be considered and visualized as a single entity. 
- Headers must be on row 11. The positioning of the columns do not matter (i.e `AS/1/LABEL` does have to be beside `AS/1`. It can be anywhere on the table as long as the column header is on row 11).


### Partonomy Tree

The partonomy tree visualizes anatomical structures (AS) and substructures. They are color coded in red. It makes use of [Vega's Tree Layout](https://vega.github.io/vega/examples/tree-layout/) to visualize relationships between anatomical structures and substructures. The tree consists for a root node called `Body`. This node is a pseudo node, and is added to keep the visualization error free. Since it is a tree structure, having multiple parents for a node violated the algorithm. Therefore, to precent any errors why [comparing](https://github.com/hubmapconsortium/ccf-asct-reporter/wiki/Compare) or linking your own sheet to envision, the Body node acts as a singular parent.

On hovering over any AS nodes which is not on the last layer (leaf nodes) will reveal a tooltip that will show the structure's ontology link. Please note that this part of the visualization is not interactive. This part of the visualization can also not be sorted.

#### Defining Uniqueness of Nodes

To create a error free visualization while also trying to capture the requirements of the data, the Reporter takes a few steps to define unique nodes. The algorithm uses a combination of,
1. name of the structure
2. ontology link of the structure
3. rdfs label of the structure
4. a custom comparator value that keeps tract of the current node's parent(s).

The comparator is needed because there are many instances where the node has the same name, ontology link and rdfs label, but have different parents. So if the comparator was not present, such nodes would get merged and would be show linked to the parent node that appears first in the visualization creating process. Below is what the object of a `TreeNode` looks like,
<details>
<summary>TreeNode Object</summary>
<code>
{
  children: 8
  color: "#E41A1C"
  comparator: "BodyBodyundefinedheartheartUBERON:0000948left atriumleft cardiac atriumUBERON:0002079"
  depth: 2
  groupName: "Multi-parent Nodes"
  id: 18
  isNew: false
  label: "left cardiac atrium"
  name: "left atrium"
  ontologyId: "UBERON:0002079"
  parent: 3
  parents: []
  pathColor: "#ccc"
  problem: false
  type: "AS"
  x: 400.00000000000006
  y: 811.4035087719299
  Symbol(vega_id): 17
}
</code>
</details>

#### Peculiar Behavior

Sometimes, the anatomical structures count can be lesser than the **absolute** count. This is due to the fact that this algorithm is a tree, and having multiple parent nodes is not allowed. So such nodes are clubbed together, if they occur. For example, consider,

AS1 | AS2 | AS3 | CT1 | B1 |
-----| ------| ------|------|-----| 
A1   | A2   |         | C1   | B   |          row1
A1   | A2   | A3   | C2   | B  |

The visualization would be

`A1 ->  A2 -> A3 ->  C2-> B`
 
Here, A3’s parent is A2 (in row2), so even though there’s no structure after A2 in row 1, the A3 in row 2 will be added to A2. Which is why the number of connections are lesser as a lot of the nodes are getting matched together, giving a lower number. The reason it is this way is because the visualization is a “tree” and a node cannot have multiple parents. Therefore, the A2 in row 1 and A2 in row 2 cannot appear as 2 different nodes (unless they’re different with diff uberon or label) because then A3 would have 2 parents – which is not allowed by the visualization (Vega).  If the two A2s were different, then the visualization would look like,
 
```
A1 -------------->  A2 -> C1
 \
  \ ------------->  A2 -> A3 -> C2
```

(when then would probably make up for those lost connections)      

#### Last Layer of the Partonomy Tree

The nodes in the last layer of the partonomy tree are technically not a part of the tree. These nodes behave differently than all the other AS nodes (red nodes). This is due to the fact that the bimodal network is overlapped with the last layer of the tree, so that this behavior can be moved forward to create the other layers of the bimodal network. The `x` and `y` coordinates are used to build the first level of the bimodal network, that is then placed on top of the layer layer of the partonomy tree. This is a perfect overlap because the coordinates for all the nodes are the same. By being placed in a custom built visualization, it follows the algorithm that makes it interactive. Hovering and clicking on these nodes will highlight the respective CT and B nodes that the node is connected to.



### Bimodal Network

The bimodal network links the anatomical structures to the cell types, and then the cell types to the biomarkers. This section will be describing how that is done.

#### Cell Type Layer (CT nodes)

These nodes are colored in blue. They are built by using 2 configuration variables `bimodal_distance_x`(which is the horizontal distance between the last layer of the AS nodes and the CT nodes) and `bimodal_distance_y` (which is the vertical distance between each CT node). These both can be configured on the fly (please see [Graph Controls](https://github.com/hubmapconsortium/ccf-asct-reporter/wiki/Visualization/_edit#graph-controls)). Hovering and clicking on these nodes will highlight the respective AS and B nodes that the node is connected to. These connections are made by using the last layer of the anatomical structures from the main data. These nodes are case sensitive. Uniqueness of these nodes are defines by the combination of the name, ontology link and the rdfs label.

#### Biomarker Layer (B nodes)

These nodes are colored in green. They are built by using 2 configuration variables `bimodal_distance_x`(which is the horizontal distance between the CT nodes and the B nodes) and `bimodal_distance_y` (which is the vertical distance between each B node). These both can be configured on the fly (please see [Graph Controls](https://github.com/hubmapconsortium/ccf-asct-reporter/wiki/Visualization/_edit#graph-controls)). Hovering and clicking on these nodes will highlight the respective CT and B nodes that the node is connected to. These nodes are case sensitive. Uniqueness of these nodes are defines by the combination of the name, ontology link and the rdfs label.

### Interactions & Tooltips

Each node in the network can be hovered over to highlight its path links. Additionally, for better visual purposes, a node can be clicked to bold its name and persist the color of the path connecting the nodes. Clicking on an AS node (last layer), colors the AS to CT paths, as well as CT to B paths. Clicking on a B node highlights the B to CT paths and CT to AS paths. Any clicked node can be clicked again to unbold and dehighlight. Hovering or clicking will cause the nodes that are not a part of the connections will be "dimmed" to reduce visualization clutter.

Hovering over a node also reveals a floating tooltip, that has the following information,
- Name
- Degree
- Indegree
- Outdegree
- Uberon/Link

### Graph Functions

There are different functions that can be used to visualize/arrange the CT and B nodes.

#### Sorting

The CT and B nodes can be sorted **alphabetically** (default) or by their **degree**. A degree is defined as the sum of the number of incoming and outgoing connections. 

#### Sizing

The CT and B nodes can be sized according to,
- **Indegree**: number of incoming connections to the node
- **Outdegree**: number of outgoing connections from the node
- **Degree**: sum of the indegree and outdegree

#### Type of Biomarker

B nodes have an additional function where the user can choose between which biomarkers to show based on their type. Currently there are 2 types,

- gene
- protein


### Graph Controls 

The visualization can be changes via a few parameters defined in the graph controls. These values can be exported to a JSON.

##### Show all AS

This option will only be visible on the `All Organs` visualization. This will show all the anatomical structures for each organ in the visualization. This is switched off by default. 

##### Ontology IDs

The visibility of the ontology IDs can be toggled. On hiding, the IDs below the structure names will disappear. This is switched on by default. 

##### Tree Width

Change the partonomy tree width. This is set to a value mentioned in the [config file](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/develop/projects/v2/src/app/static/config.ts).

##### Tree Height

Change the partonomy tree height. This is set to a value mentioned in the [config file](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/develop/projects/v2/src/app/static/config.ts).


##### Bimodal Distance X

Horizontal distance between AS - CT and CT - B nodes. This is set to a value mentioned in the [config file](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/develop/projects/v2/src/app/static/config.ts).

##### Bimodal Distance Y

Vertical distance between AS - CT and CT - B nodes. This is set to a value mentioned in the [config file](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/develop/projects/v2/src/app/static/config.ts).

---
