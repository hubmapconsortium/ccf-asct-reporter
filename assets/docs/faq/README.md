## Frequently Asked Questions
---

#### Question 1: Why do I get an error when I try to compare my own experimental ASCT+B table to an existing Master ASCT+B table?

Answer 1: The reasons this can occur are as follows:

1) You did not include the 11 rows of the header from the Google sheet template https://docs.google.com/spreadsheets/d/1qLnwCdtU6H4pqHAfA1JtyVvvTw2Lewd_BgXYuQ0QAk4/edit#gid=559906129 in your google sheet you wish to compare to a Master table. You must include the top 11 rows of the template file in your table that you wish to compare to the Master table.  Row 11 column headers  of the template are read by the ASCT+B Reporter to know what data exists. 
2) You did not set the Google sheet share permissions of your google sheet to “anyone can view”.
3) You did not copy the browser url for your google sheet, but instead used the google sheet share "copy link".

#### Question 2: When I use the compare feature, is it possible to download a spreadsheet that indicates which of the experimental AS, CT, B are NEW vs identical to the Master ASCT+B table?

Answer 2: YES! Go to the the Reports icon <img width="29" alt="Screen Shot 2021-12-14 at 6 12 23 PM" src="https://user-images.githubusercontent.com/47257000/146094324-51c9bd4b-92b7-412d-bf1c-af6fd7802fd1.png"> to open the Reports panel, then click on the Compare tab , and the down arrow to download the spreadsheet that provides identical vs. new AS, CT and B.

<img width="347" alt="Screen Shot 2021-12-14 at 6 12 03 PM" src="https://user-images.githubusercontent.com/47257000/146094564-71a6ab46-43ec-4f93-8b78-265aba4aaf91.png"> 
<img width="945" alt="Screen Shot 2021-12-14 at 6 19 08 PM" src="https://user-images.githubusercontent.com/47257000/146094868-ff24fb6f-05da-4270-804b-588a6870c6ca.png">

#### Question 3: Can I visualize my own ASCT+B table without sharing it online publicly?

Answer 3: Yes, our google sheet template https://docs.google.com/spreadsheets/d/1qLnwCdtU6H4pqHAfA1JtyVvvTw2Lewd_BgXYuQ0QAk4/edit#gid=559906129 can be downloaded as an Excel spreadsheet and filled in and uploaded using the Playground feature to create your own ASCT+B visualization of your table, produce a downloadable report of features and metrics on AS, CT and B. Your table is not retained. 

#### Question 4: Can I determine the number and identity of unique AS, CT, and B comparing all or some of the ASCT+B Master organ tables of interest?

Answer 4: Yes, on the ASCT+B organ table selection page https://hubmapconsortium.github.io/ccf-asct-reporter/vis, click the All organs, or select the organs of interest, the choose the Report button and the down arrow icon to download the spreadsheet of unique ASCT+B for the organs of interest.

#### Question 5: Can I simultaneously compare more than one new experimental table of AS, CT, B to a master ASCT+B table? 


Answer 5: Yes, select an organ Master table, the select the **Compare icon**, at the bottom right there is an **+ Add** button, you can compare several experimental data sets at the same time to the Master organ table.

<img width="344" alt="Screen Shot 2021-12-14 at 8 55 46 PM" src="https://user-images.githubusercontent.com/47257000/146108748-5120e270-334d-4832-b5cf-80a54887e2ce.png">

#### Question 6: Can I export the ASCT+B Reporter visualization? If so, what formats can I export them in?

Answer 6: The ASCT+B Reporter visualization can be exported in PNG (Portable Network Graphics) and SVG (Scalable Vector Graphics File) formats from the **Export icon** drop down menu.

<img width="77" alt="Screen Shot 2021-12-14 at 10 02 58 PM" src="https://user-images.githubusercontent.com/47257000/146115537-9ac6dbf9-568a-4414-8958-ab87adbaabcb.png">


#### Question 7: What available formats can I export the ASCT+B table data in?

Answer 7: 1) Vega specification (Vega spec) defines an interactive visualization in JavaScript Object Notation (JSON), 2) Graph Data, 3) JSON-LD, and 4) Web Ontology Language (OWL)/Resource Description Framework (RDF) 

#### Question 8: Can I upload an Excel spreadsheet version of my ASCT+B to Compare it to a Master ASCT+B table or to visualize it with the Playground features?

Answer 8: Yes, this feature was added in version 2.4

#### Question 9: Can I visualize a subset of the ASCT+B table for a manuscript figure?

Answer 9: Yes, copy and paste the portion of an existing or your own experimental table into the **Google sheet template** https://docs.google.com/spreadsheets/d/1qLnwCdtU6H4pqHAfA1JtyVvvTw2Lewd_BgXYuQ0QAk4/edit#gid=559906129 and use the **Playground** feature.

#### Question 10: How can I contribute my subject domain expertise to building a Human Reference Atlas (HRA)?

Answer 10: 1) [Register as an expert](https://iu.co1.qualtrics.com/jfe/form/SV_bpaBhIr8XfdiNRH), 2)[learn more about HuBMAP, its technologies, tools, infrastructure, mapping resources through our Visible Human Massively Open Online Course](https://expand.iu.edu/browse/sice/cns/courses/hubmap-visible-human-mooc), 3) [Visit our CCF Portal to explore our resources](https://hubmapconsortium.github.io/ccf/), 4) [explore HuBMAP datasets](https://portal.hubmapconsortium.org/ccf-eui), 5) [register tissue blocks from datasets within our 3D reference organ models](https://hubmapconsortium.github.io/ccf-ui/rui/)

<img width="751" alt="Screen Shot 2021-12-14 at 8 28 10 PM" src="https://user-images.githubusercontent.com/47257000/146106001-da970e02-9480-4ff8-b7e9-d2aba48b365f.png">


#### Question 11: Where can I read about new features added to each version of the ASCT+B Reporter?

Answer 11: You can read the release notes here: https://github.com/hubmapconsortium/ccf-asct-reporter/blob/main/CHANGELOG.md 

#### Question 12: How do I report a problem or request a new feature?

Answer 12: There are several ways you may contact us to report problems: 1) Create a **New Issue** on our GitHub repository: https://github.com/hubmapconsortium/ccf-asct-reporter/issues 2) send an email to infoccf@indiana.edu 3) Click the **Contact us** button in the lower left panel of the ASCT+B Reporter
