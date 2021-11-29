
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/hubmapconsortium/ccf-asct-reporter)
[![license](https://img.shields.io/github/license/hrishikeshpaul/portfolio-template?style=flat&logo=appveyor)](https://github.com/hubmapconsortium/ccf-asct-reporter/blob/master/LICENSE) 


<br>


## Introduction
---

Anatomical structures, cell types, plus biomarkers (ASCT+B) tables aim to capture the nested part_of structure of human organ systems from gross anatomical structure scale to subcellular biomarker scale. Functional tissue units (FTUs) for an organ system are identified as well as the typology of cells and biomarkers used to uniquely identify cell types within that organ system (e.g., gene, protein, proteoforms, lipid or metabolic markers). Ontology terms and unique identifiers are matched to AS, CT, and B wherever possible for semantic search capability within MC-IU products: Registration User Interface (RUI), Exploration User Interface (EUI), and ASCT+B Reporter. The tables, which are used to develop a common coordinate framework (CCF) of the healthy human body (see HuBMAP Consortium website), are authored and reviewed by an international team of anatomists, pathologists, physicians, and other experts.


The CCF ASCT+B Reporter is a visualization tool for inspecting and exploring the tables. It includes a partonomy tree that presents relationships between various anatomical structures and substructures, that are linked to their respective cell types and biomarkers via bimodal networks. The Reporter also presents an indented list view of the partonomy tree. An addition to the network visualizations, the Reporter lists statistics for various metadata (e.g., counts of ASCT table entity types and relationship types) which are downloadable. The debug logger lists any issues related to the data provided in the table. The Reporter has a backend server, the ASCT+B API, to retrieve the data from Google Sheets and convert it to a machine-readable format.

<br>

#### Snapshots

<br>

|  |  |
|-------|-------|
| <img src="assets/docs/intro/one.png" class="md-img p-2" /> | <img src="assets/docs/intro/two.png" class="md-img p-2" /> |
| <img src="assets/docs/intro/three.png" class="md-img p-2" /> |  |


<br>

##### Production and Development

This is the production or the main version of the Reporter. It can be found [here](https://hubmapconsortium.github.io/ccf-asct-reporter/). This latest official release will be updated regularly as needs evolve.

The staging version of the Reporter can be found [here](https://ccf-asct-reporter.netlify.app/). It is built off the development branch and is mainly used for staging and testing by power users and developers before code is deployed on the production environment.

<br>


##### Contributing

If you'd like to contribute, follow the steps below

```shell
$ git clone https://github.com/hubmapconsortium/ccf-asct-reporter
$ cd ccf-asct-reporter
$ git checkout -b <new_branch_name>
```

Then, Commit the changes to the new feature branch and make a pull request.

<br>

##### License
[MIT](https://choosealicense.com/licenses/mit/)