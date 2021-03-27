
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/hubmapconsortium/ccf-asct-reporter)
[![license](https://img.shields.io/github/license/hrishikeshpaul/portfolio-template?style=flat&logo=appveyor)](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/master/LICENSE) 


<br>


## Introduction
---

Anatomical Structures, Cell Types, plus Biomarkers (ASCT+B) Master tables aim to capture the nested part_of structure of anatomical human body organ systems from gross anatomical structure scale to subcellular biomarker scale.  Functional tissue units (FTUs) for an organ system should be identified as well as the typology of cells and biomarkers used to uniquely identify cell types within that organ system and FTUs (e.g., gene, protein, proteoforms,  lipid or metabolic markers). Ontology terms and unique identifiers are matched to AS, CT, and B wherever possible for semantic search capability within MC-IU products: Registration User Interface (RUI), Exploration User Interface (EUI), ASCT+B Reporter. The tables are authored and reviewed by an international team of anatomists, pathologists, physicians, and other experts.


The [CCF ASCT+B Reporter](https://hubmapconsortium.github.io/ccf-asct-reporter/) is a visualization tool for displaying anatomical structures, cell types, and biomarker (ASCT+B) authored by domain experts for different human organs. The tables are used to develop a common coordinate framework (CCF) of the healthy human body, see also Hubmap Consortium website. The Reporter includes a partonomy tree that presents relationships between various anatomical structures and substructures, that is combined with their respective cell types and biomarkers via a bimodal network. The reporter also presents an indented list tree for a more traditional look. Along with visualizing, the reporter has a report generator that enlists various meta data for the visualized ASCT table, which is downloadable. There is also an in-house debug logger that lists any issues related to the data provided in the table. The Reporter is also accompanied by a backend server, ASCT+B Data Miner, to retrieve the data from Google Sheets and convert it to a machine readble format.

<br>

#### Technologies

- [Angular 11](https://angular.io/) - Main frontend component library
- [NGXS](https://www.ngxs.io/) - State management system
- [Angular Material](https://material.angular.io/) - UI component library
- [Bootstrap](https://getbootstrap.com/) - Open source styling toolkit
- [NodeJs](https://nodejs.org/) - Backend scripting tool
- [Jexcel](https://bossanova.uk/jspreadsheet/v4/) - Table viewing library
- Google Analytics

<br>

#### Snapshots

<br>

|  |  |
|-------|-------|
| <img src="assets/docs/intro/one.png" class="intro-img p-2" /> | <img src="assets/docs/intro/two.png" class="intro-img p-2" /> |
| <img src="assets/docs/intro/three.png" class="intro-img p-2" /> |  |


<br>

##### Production and Development

This is the production or the main version of the Reporter. It can be found [here](https://hubmapconsortium.github.io/ccf-asct-reporter/). This will contain the latest official releases and will be updated twice a month with minor patch updates.

The staging version of the Reporter can be found [here](https://ccf-asct-reporter.netlify.app/) which is built off the develop branch. This application is mainly for staging, where power users and developers can see the results on a production environment.

<br>


##### Contributing

If you'd like to contribute, follow the steps below,
```shell
$ git clone https://github.com/hubmapconsortium/ccf-asct-reporter
$ cd ccf-asct-reporter
$ git checkout -b <new_branch_name>
```

Commit the changes to the new feature branch and make a pull request!

<br>

##### License
[MIT](https://choosealicense.com/licenses/mit/)