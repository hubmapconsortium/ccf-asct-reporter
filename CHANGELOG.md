# Changelog

Changelog for the HuBMAP CCF ASCT+B Reporter

## 2.3.0 - Pre-release

### Added in 2.3.0

- Added linting to the ASCTB API
- Migrated from tslint to eslint

## 2.2.0 - 2021-07-02

### Added in 2.2.0

- Multiple levels of cell types (`CT`) are now supported in the Table Format and User Interface. **Note:** The Cell Type hierarchy is currently flattened in the visualization; future work includes visualizing the hierarchical structure.
- Five biomarker types are now supported in the Table format and User Interface: Genes (`BGene`), Proteins (`BProtein`), Lipids (`BLipid`), Metabolites (`BMetabolites`) and Proteoforms (`BProteoform`)
- CSV URLs can now be used in the organ dropdown, compare, and playground features
- Clicking on a term label now fetches a description and IRI link for terms across UBERON, FMA, CL, and HGNC ontologies.

## 2.1.0 - 2021-06-23

### Added in 2.1.0

- Added FMA ontology term support
- Added more biomarker types (proteins and lipids)
- Added shapes to biomarkers in the visualization
- Improved parsing of the ASCT+B data tables
- Minor UI improvements / bug fixes
- Counts by organ are shown in the report tab when all organs are selected
- Added discrepency labels
- New Demo Video
- Alert users when they add a Google Sheets Share URL instead of the Browser URL
- Fixed a regression in the ASCT+B API homepage
- Duplicate ID's can be highlighed when ID duplicates toggle is on

## 2.0.0 - 2021-04-06

### Added in 2.0.0

- Redesign of the UI
- Usability refactoring through user testing
- Updated architecture with state manager
- Brand new playground feature
- Increased interactivity of the graph with into sheets and DOI
- Filtering biomarkers based on their protein type
- Improved google analytics
- Updated legend to show the values of the uploaded compare sheets
- Revamped report generator
- Documentation added in the Reporter
