# HuBMAP CCF ASCT+B Reporter

The [CCF ASCT Reporter](https://hubmapconsortium.github.io/ccf-asct-reporter/) is a basic visualization tool for displaying the [flattened ASCT tables](https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1218756021) built using Angular 10.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/hubmapconsortium/ccf-asct-reporter)
[![license](https://img.shields.io/github/license/hrishikeshpaul/portfolio-template?style=flat&logo=appveyor)](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/master/LICENSE) 

![HuBMAP CCF Reporter](src/assets/github_logo.png)


## Overview

The [CCF ASCT+B Reporter](https://hubmapconsortium.github.io/ccf-asct-reporter/) iincludes a partonomy tree that presents relationships between various anatomical structures and substructures, that is combined with their respective cell types and biomarkers via a bimodal network. The reporter also presents an indented list tree for a more traditional look. Along with visualizing, the reporter has a report generator that enlists various meta data for the visualized ASCT table, which is downloadable. There is also an in-house debug logger that lists any issues related to the data provided in the table. The reporter is also accompanied by a backend server, [ASCT+B Data Miner](https://asctb-data-miner.herokuapp.com/).

## Installation
For development,
```shell
$ git clone https://github.com/hubmapconsortium/ccf-asct-reporter
$ cd ccf-asct-reporter

# Reporter
$ npm install
$ ng serve

# Miner
$ cd data-miner
$ npm install
$ npm start
```

For deployment,
```shell
$ git clone https://github.com/hubmapconsortium/ccf-asct-reporter
$ cd ccf-asct-reporter

# Reporter
$ npm run build
$ npm run deploy

# Miner
$ git subtree push --prefix data-miner miner master
```

For updating table data,
```shell
$ npm run data # for updating all sheets
$ npm run data <sheet> # for updating a specific sheet
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
9. [Brain](https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=478407375)
10. [Lung](https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1167730392)

### How it works
This section describes the constuctution of the various visualizations and features that the reporter houses. After recieving the data, the first 11 rows are stipped out which contains the headers and the credits which are not required for the visualization.

#### Workflow Diagram

![ASCT+B Reporter Workflow](src/assets/workflow.png)

#### Data Retrieval

The data to build the visualizations is fetched from Google Sheets via a constructued URL that exports the sheet. But due to increased number of exports Google Sheet rate limits (or possibly blocks) certain domains and prevents any additional exports. Therefore, if the data retrieval from Google Sheets fails, the Reproter fetches the ASCT+B Data Miner. In an event the miner too fails to extract the data, the Reporter falls back on CSVs that have been stored in the assets. This is termed as 'System Cache', and is updated on every deployment. 

#### Partonomy Tree
The partonomy tree visualizes anatomical structures and substructures. They are color coded in red. It makes use of [Vega's Tree Layout](https://vega.github.io/vega/examples/tree-layout/) to visualize relationships between anatomical structures and substructures. This is housed in the [Tree Component](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/master/src/app/tree/tree.component.ts). 

The data is fetched through the [`getSheetData()`](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/d6b98bff6fc8d88c14ee8c38809a063db39d31bc/src/app/services/sheet.service.ts#L80) function that returns a JSON of the ASCT+B table data parsed by [PapaParse](https://www.papaparse.com/). The function [`makeTreeData()`](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/d6b98bff6fc8d88c14ee8c38809a063db39d31bc/src/app/tree/tree.service.ts#L66) builds the tree shown in the partonomy. Using the classes [`TNode`](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/3e7837c5af98945c61b9de6b7edb7e408ed77297/src/app/sheet.service.ts#L13) and [`Tree`](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/3e7837c5af98945c61b9de6b7edb7e408ed77297/src/app/sheet.service.ts#L32), systematically builds a tree where each node has a parent, id and name. Multiple occurances of nodes in the ASCT+B tables are automatically skipped by the function. The width of the tree is set to a precomputed value present in the [config service](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/master/src/app/services/sconfig.service.ts). On having the constructed data, the [tree spec](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/d6b98bff6fc8d88c14ee8c38809a063db39d31bc/src/app/tree/tree.component.ts#L106) is formed that builds the tree using `embed()`.

Some nodes in the partnomy tree may have a black stoke around them. This indicates that the node does not follow a "tree" structure as it has multiple parent nodes. 

#### Bimodal Network
The bimodal network links the anatomical structures to the cell types, and then the cell types to the biomarkers. The cell types are color coded in blue and the biomarkers in green. This is housed in the [bimodal component](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/master/src/app/bimodal/bimodal.component.ts).

After the partonomy tree is rendered onto the DOM, the function [`makeASCTData()`](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/d6b98bff6fc8d88c14ee8c38809a063db39d31bc/src/app/bimodal/bimodal.service.ts#L44) is called that accepts the ASCT+B table data and the partonomy tree data. The `treeData` is an array of objects that contains information of the all the nodes in the tree (positions, names, colors, etc). Using this data, paths between the anatomical structures and cell types a formed. The `x` and `y` coordinates of the leaf nodes of the tree is used to start the paths. Each of the structures are divided into multiple groups,
- Group 1: Anatomical Structures (red)
- Group 2: Cell Types (blue)
- Group 3: Biomarkers (green)

After all the nodes have been pushed using the [`BMNode`](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/d6b98bff6fc8d88c14ee8c38809a063db39d31bc/src/app/bimodal/bimodal.service.ts#L9) class, the links are constucted. This is done by using the position of the nodes in the `nodes` array, specifying the source (`s`) and the target(`t`)

The bimodal network contans a few functions that is used to sort the nodes,
1. Sort Alphabetically: Alphabetically sorts the nodes.
2. Sort by degree: Sorts the nodes based on the number of connections to a particular node. Makes use of the [`makeMarkerDegree()`](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/master/src/app/services/sheet.service.ts#L94) and [`makeCellDegree()`](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/master/src/app/services/sheet.service.ts#L127) functions for calculating the degree of markers and cells respectively.
3. Sort by size: Nodes can be sorted by their relative sizes that depends on their degree. 

Each node in the network can be hovered over to highlight its path links. Additionally, for better visual purposes, a node can be clicked to bold its name and persist the color of the path connecting the nodes. Clicking on an AS node colors the AS to CT paths, as well as CT to B paths. Clicking on a B node highlights the B to CT paths and CT to AS paths. Any clicked node can be clicked again to unbold and dehighlight.

Hovering over a node also reveals a floating tooltip, that has the following information,
- Name
- Degree
- Indegree
- Outdegree
- Uberon/Link

#### Indent List
This visualization is a traditional, hierarchical structure. This displays anatomical structures, sub-structures and cell types. This is housed in the [Indent component](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/master/src/app/indent/indent.component.ts). This makes use the of [Angular Material Tree](https://material.angular.io/components/tree/overview).

The function [`makeIndentData()`](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/3e7837c5af98945c61b9de6b7edb7e408ed77297/src/app/sheet.service.ts#L503) builds the data for the indented list. 

#### Report Generator
The report generator lists different meda data of the data which are downloadable. This can be accessed by clicking on the report icon in the navbar, which opens a navigation drawer. There are 2 main sections,
1. **Overview**: This section contains the following statistics,
   - Unique anatomical structures
   - Unique cell types
   - Unique bio markers
   - Anatomical Structures with no uberon links
   - Cell types with no CL links
   - Biomarkers with no Go/UniPot link (as the moment none of the markers have this link)
2. **Details**: This section has expandable panels that list the above mentioned node names in alphabetical order.

#### Debug Log
The Debug Log lists warnings and errors that occurred during data parsing and visualization creation—for individual organs and for all organs. It is separated into two tabs,
- **Organ Tab**: This tab shows all the debug messages for the selected organ sheet.
- **All Tab**: This tab displays messages for the entire user session.

Similar messages are clubbed together, and displayed via an expansion panel that can be clicked to reveal the messages. The logs that are currently supported are given below,
- Nodes with multiple in-links (can be clicked on to expand/collapse)
- Nodes with no out-links (can be clicked on to expand/collapse)
- Sheet changes
- Tree successfully/unsuccessfully rendering

#### Export
The ASCT+B Reporter visualization can be saved out in PNG (Portable Network Graphics) and SVG (Scalable Vector Graphics File) format. The Vega Specification can also be exported in JSON format. The data that is currently being supplied to the visualization gets saved in this JSON too. This can be done by clicking on the download button on the navigation toolbar on the top (beside the refresh icon) and selecting the suitable image format.

### Scripts

#### `getData.sh`
This shell script is used to fetch data from the flattened tables. The sheetId and GID for the sheets are stored in `scriptdata.csv`. 

The script encorporates 2 options,
1. No parameters: Updates the data of all the sheets from google sheets.
   ```shell
   $ npm run data
   ```
2. <sheet_name> parameter: Updates the data of a specific sheet.
   ```shell
   $ npm run data <sheet_name>
   ```

For additional help,
```shell
$ npm run data help
```

### Data Miner

The reporter is also accompanied by a backend server - [ASCT+B Data Miner](https://asctb-data-miner.herokuapp.com/). In the event of Google Sheets blocking requests by the Reporter or any error, the Reporter fetches the data from the Data Miner which runs a simple Node script to fetch the data from Google Sheets. By supplying the SheetId and GID to the Data Miner, the data from the flattened tables can be retrieved. If for some reason the Data Miner also fails to retrieve the data, the Reporter falls to its system cache, which contains a snapshot of the flattened tables. 

The Miner can also be used as a stand-alone tool to retrieve the data from the flattened google sheets. Below is the API that you'll have to use,

```
https://asctb-data-miner.herokuapp.com/<sheetID>/<gid>
```

This will either return the CSV data as a string, or will return a `500` HTTP code.

#### Deploying 

Since the ASCT+B Data Miner is a dynamic script, Heroku has been used to deploy the server. Heroky is free to use for this usage. Deploying on Heroku requires the `data-miner` folder to have an additional git remote. To deploy the latest changes to the Heroku cloud,

```shell
$ git add data-miner
$ git commit -m <commit_message>
$ git subtree push --prefix data-miner miner master
```

## Snippets
![Partonomy Tree](src/assets/snippets/tree.png)
![Hover/Click](src/assets/snippets/hover.png)
![Sorting and Sizing](src/assets/snippets/sort.png)
![Indent List](src/assets/snippets/indent.png)
![Report](src/assets/snippets/report.png)
![Debug Logs](src/assets/snippets/log.png)

## Contributing

If you'd like to contribute, follow the steps below,
```shell
$ git clone https://github.com/hubmapconsortium/ccf-asct-reporter
$ cd ccf-asct-reporter
$ git checkout -b <new_branch_name>
```

Commit the changes to the new feature branch and make a pull request!

## License
[MIT](https://choosealicense.com/licenses/mit/)