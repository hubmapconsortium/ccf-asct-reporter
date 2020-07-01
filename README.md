# HuBMAP CCF ASCT Reporter

The [CCF ASCT Reporter](https://hubmapconsortium.github.io/ccf-asct-reporter/) is a basic visualization tool for displaying the [flattened ASCT tables](https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1218756021) built using Angular 9.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/hubmapconsortium/ccf-asct-reporter)
[![license](https://img.shields.io/github/license/hrishikeshpaul/portfolio-template?style=flat&logo=appveyor)](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/master/LICENSE) 
[![angular version](https://img.shields.io/badge/angular%20version-9.1.9-red?style=flat&logo=appveyor)](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/master/LICENSE) 
[![npm version](https://img.shields.io/badge/npm-6.14-orange?style=flat&logo=appveyor)](https://github.com/npm/cli)

![HuBMAP CCF Reporter](src/assets/github_logo.png)


## Overview
The [CCF ASCT Reporter](https://hubmapconsortium.github.io/ccf-asct-reporter/) includes a partonomy tree that presents relationships between various anatomical structures and substructures, that is combined with their respective cell types and biomarkers via a bimodal network. The reporter also presents a indented list tree for a more traditional look. Along with vislualizing, the reporter has a report generator that enlists various meta data for the visualized ASCT table, which is downloadable. There is also an in-house debug logger that lists any issues related to the data provided in the table.

## Installation
For development,
```shell
$ git clone https://github.com/hubmapconsortium/ccf-asct-reporter
$ cd ccf-asct-reporter
$ npm install
$ ng serve
```

For deployment,
```shell
$ git clone https://github.com/hubmapconsortium/ccf-asct-reporter
$ cd ccf-asct-reporter
$ npm run build -- --base-href=/ccf-asct-reporter --configuration=production
$ npm run deploy
```

## Details

### Currently supported ASCT Tables
1. [Spleen](https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1283919854)
2. [Liver](https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1218756021)
3. [Kidney](https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1074409228)
4. [Small Intestile](https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=766906089)
5. [Large Intestine](https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=82644608)
6. [Lymph Nodes](https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=272157091)
7. [Heart](https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1799670106)
8. [Skin](https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1268820100)

### How it works
This section describes the constuctution of the various visualizations that the reporter displays. 

#### Partonomy Tree
The partonomy tree visualizes anatomical structures and substructures. They are color coded in red. It makes use of [Vega's Tree Layout](https://vega.github.io/vega/examples/tree-layout/) to visualize relationships between anatomical structures and substructures. This is housed in the [Tree Component](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/master/src/app/tree/tree.component.ts). 

The data is fetched through the [`getSheetData()`](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/3e7837c5af98945c61b9de6b7edb7e408ed77297/src/app/sheet.service.ts#L168) function that returns a JSON of the ASCT table data parsed by [PapaParse](https://www.papaparse.com/). The function [`makeTreeData()`](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/3e7837c5af98945c61b9de6b7edb7e408ed77297/src/app/sheet.service.ts#L451) builds the tree shown in the partonomy. Using the classes [`TNode`](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/3e7837c5af98945c61b9de6b7edb7e408ed77297/src/app/sheet.service.ts#L13) and [`Tree`](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/3e7837c5af98945c61b9de6b7edb7e408ed77297/src/app/sheet.service.ts#L32), systematically builds a tree where each node has a parent, id and name. Multiple occurances of nodes in the ASCT tables are automatically skipped by the function. The width of the tree is set to a precomputed value present in the [config service](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/master/src/app/sconfig.service.ts). On having the constructed data, the [tree spec](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/3e7837c5af98945c61b9de6b7edb7e408ed77297/src/app/tree/tree.component.ts#L73) is formed that builds the tree using `embed()`.

#### Bimodal Network
The bimodal network links the anatomical structures to the cell types, and then the cell types to the biomarkers. The cell types are color coded in blue and the biomarkers in green. This is housed in [this](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/master/src/app/forced/forced.component.ts) component.

After the partonomy tree is rendered onto the DOM, the function [`makeASCTData()`](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/3e7837c5af98945c61b9de6b7edb7e408ed77297/src/app/sheet.service.ts#L185) is called that accepts the ASCT table data and the partonomy tree data. The `treeData` is an array of objects that contains information of the all the nodes in the tree (positions, names, colors, etc). Using this data, paths between the anatomical structures and cell types a formed. The `x` and `y` coordinates of the leaf nodes of the tree is used to start the paths. Each of the structures are divided into multiple groups,
- Group 1: Anatomical Structures
- Group 2: Cell Types
- Group 3: Biomarkers

After all the nodes have been pushed using the [`BMNode`](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/3e7837c5af98945c61b9de6b7edb7e408ed77297/src/app/sheet.service.ts#L100) class, the links are constucted. This is done by using the position of the nodes in the `nodes` array, specifying the source (`s`) and the target(`t`). A sample of how the `ASCTGraphData` looks like is shown below,
```js
nodes:[
    ...,
    {
        color: "#808080",
        first: "Penincillar Arterioles",
        fontSize: 14,
        group: 1,
        id: 1,
        name: "Penincillar Arterioles",
        nodeSize: 300,
        x: 0,
        y: 104.875,
    },
    ...
],
links: [
    ...,
    {
        path: "M0,52.4375L350,50"
        s: 0 // source node
        t: 24 // target node
    }
]
```

The bimodal network contans a few functions that is used to sort the nodes,
1. [Sort Alphabetically](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/3e7837c5af98945c61b9de6b7edb7e408ed77297/src/app/sheet.service.ts#L246): Alphabetically sorts the nodes.
2. [Sort by degree](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/3e7837c5af98945c61b9de6b7edb7e408ed77297/src/app/sheet.service.ts#L379): Sorts the nodes based on the number of connections to a particulat node. Makes use of the `makeMarkerDegree()` function.
3. [Sort by size](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/3e7837c5af98945c61b9de6b7edb7e408ed77297/src/app/sheet.service.ts#L257): Nodes can be sorted by their relative sizes that depends on their degree. 

#### Indent List
This visualization is a tradition, hierarchical structure. This displays anatomical structures, sub-structures and cell types. This is housed in the [Indent component](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/master/src/app/indent/indent.component.ts). This makes use the of Angular Material Tree.

The function [`makeIndentData()`](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/3e7837c5af98945c61b9de6b7edb7e408ed77297/src/app/sheet.service.ts#L503) builds the data for the indented list. 

#### Report Generator
The report generator lists different meda data of the data which are downloadable. This can be accessed by clicking on the report icon in the navbar, which opens a navigation drawer. There are 2 main sections,
1. **Overview**: This section contains the following numbers,
   - Unique anatomical structures
   - Unique cell types
   - Unique bio markers
   - Anatomical Structures with no uberon links
   - Cell types with no CL links
   - Biomarkers with no Go/UniPot link (as the moment none of the markers have this link)
2. **Details**: This section has expandable panels that list the above mentioned node names in alphabetical order.

#### Debug Logs
The debug logger is a tool that lists various problems (if at all) with the data that is to be visualized. These include nodes that have multiple parents, data not being fetched properly, changing of sheets etc. These logs are session specific. 

## Snippets
![Partonomy Tree](src/assets/snippets/tree.png)
![Indent List](src/assets/snippets/indent.png)
![Report](src/assets/snippets/report.png)
![Debug Logs](src/assets/snippets/logs.png)

## Builds
| Date | Version | Changelog |
| :-: | :-: | :- |
| 6/20/2020 |0.1.8 | • Added sort by degree to biomarkers.<br>• Improved sort by degree function for biomarkers.<br>• Separated logs from reports. <br>• Added support to download reports. <br>• Made graph titles to expansion panels for housing sorting functionalities.<br>• Documented the working of various functions on the readme. <br>• Report Problem button in the report can now open mail to send an email.<br>• Added fixed width to visualization to prevent stretching on bigger screens.<br>• Refactored the name of the report component.<br>• Added Skin ASCT data to the visualization.|
| 6/21/2020 |0.2.0 | • Sorting cells by degree, size and alphabetically.<br>• Color changes to the graph toolbar. <br> • Refactored `sheet.service.ts` to create services for individual components.<br> • Added `bimodal.service.ts` to the bimodal network. <br>• Added `indent.service.ts` to the indented list.<br>• Added `report.service.ts` to the report component.<br>• Added `tree.service.ts` to the tree component. <br>• Shifted all services to `app/src/services/`<br>|

## License
[MIT](https://choosealicense.com/licenses/mit/)