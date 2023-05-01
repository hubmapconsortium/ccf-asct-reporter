import { Component, OnInit, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ToggleControlPane } from '../../actions/ui.actions';
import { Error } from '../../models/response.model';
import { SheetState, SheetStateModel } from '../../store/sheet.state';
import { Sheet, SheetConfig, CompareData, SheetDetails } from '../../models/sheet.model';
import { TreeState, TreeStateModel } from '../../store/tree.state';
import { DiscrepencyStructure, TNode } from '../../models/tree.model';
import { VegaService } from '../tree/vega.service';
import { DiscrepencyId, DiscrepencyLabel, DuplicateId, UpdateOmapConfig } from '../../actions/tree.actions';
import { UpdateConfig, ToggleShowAllAS, FetchSelectedOrganData, UpdateSelectedOrgansBeforeFilter } from '../../actions/sheet.actions';
import { BimodalService } from '../tree/bimodal.service';
import { BMNode } from '../../models/bimodal.model';
import { OmapConfig } from '../../models/omap.model';
import { ConfigService } from '../../app-config.service';

@Component({
  selector: 'app-control-pane',
  templateUrl: './control-pane.component.html',
  styleUrls: ['./control-pane.component.scss']
})
export class ControlPaneComponent implements OnInit {
  @Input() error: Error;

  @Select(SheetState.getSheetConfig) config$: Observable<SheetConfig>;
  @Select(SheetState.getSheet) sheet$: Observable<Sheet>;
  @Select(TreeState.getVegaView) view$: Observable<any>;
  @Select(SheetState.getSelectedOrgans) selectedOrgans$: Observable<string[]>;

  @Select(TreeState.getTreeData) td$: Observable<TNode[]>;
  @Select(TreeState.getBimodal) bm$: Observable<any>;
  @Select(SheetState.getCompareSheets) cs$: Observable<CompareData[]>;

  @Select(TreeState) tree$: Observable<TreeStateModel>;

  @Select(TreeState.getOmapConfig) omapConfig$: Observable<OmapConfig>;
  @Select(SheetState.getfilteredProtiens) filteredProteins$ : Observable<string[]>;

  nodes: BMNode[];
  treeData: TNode[];
  view: any;
  groupName = 'Anatomical Structures';

  sheetConfig: SheetDetails[];
  omapSheetConfig: SheetDetails[];

  sheetOptions;
  /**
   * Sheet configs
   */
  omapSheetOptions;

  constructor(public store: Store, public bm: BimodalService, public vs: VegaService, public configService: ConfigService) {

    this.tree$.subscribe(tree => {
      this.treeData = tree.treeData;
      this.nodes = tree.bimodal.nodes;
    });

    this.configService.sheetConfiguration$.subscribe((sheetOptions) => {
      this.sheetConfig = sheetOptions;
      this.sheetOptions = sheetOptions;
    });
    this.configService.omapsheetConfiguration$.subscribe((sheetOptions) => {
      this.omapSheetConfig = sheetOptions;
      this.omapSheetOptions = sheetOptions;
    });

    this.selectedOrgans$.subscribe(organs => {
      const omapConfig = this.store.selectSnapshot(TreeState.getOmapConfig);
      const sheetState = this.store.selectSnapshot(SheetState);
      const treeState = this.store.selectSnapshot(TreeState);
      if (omapConfig.organsOnly) {
        this.omapOrgansOnly(sheetState);
      }
      if (omapConfig.proteinsOnly) {
        this.omapProteinsOnly(sheetState, treeState);
      }
    });

    // this.filteredProteins$.subscribe(proteins => {
    //   let omapConfig;
    //   this.omapConfig$.subscribe((config) => {
    //     console.log(config.organsOnly, config.proteinsOnly);
    //   });
    //   // this.updateOmapConfig(omapConfig);
    // });
  }

  ngOnInit(): void {
    this.view$.subscribe(data => {
      this.view = data;
    });
  }

  updateConfigInSheet(prop) {
    switch (prop.property) {
    case 'width': this.vs.makeBimodal(this.view.signal('as_width', prop.config.width)); break;
    case 'height': this.vs.makeBimodal(this.view.signal('as_height', prop.config.height)); break;
    case 'show-ontology': this.view.signal('show_ontology', prop.config.show_ontology).runAsync(); break;
    case 'bm-x': this.updateBimodal(prop.config); break;
    case 'bm-y': this.updateBimodal(prop.config); break;
    case 'show-as': this.showAllAS(); break;
    case 'show-discrepency-label':
      this.makeBimodalWithDiscrepencyLabel(prop.config);
      break;
    case 'show-discrepency-id':
      this.makeBimodalWithDiscrepencyId(prop.config);
      break;
    case 'show-duplicate-id':
      this.makeDuplicateId(prop.config);
      break;
    }
  }

  showAllAS() {
    this.store.dispatch(new ToggleShowAllAS()).subscribe(states => {
      const sheet = states.sheetState.sheet;
      const selectedOrgans = states.sheetState.selectedOrgans;
      const omapSelectedOrgans = states.sheetState.omapSelectedOrgans;
      this.store.dispatch(new FetchSelectedOrganData(sheet, selectedOrgans,omapSelectedOrgans));
    });
  }

  makeBimodalWithDiscrepencyLabel(config: SheetConfig) {
    this.store.dispatch(new UpdateConfig(config));
    let discrepencyLabels = [];
    if (config.discrepencyLabel) {
      const discrepencySet = new Set<DiscrepencyStructure>();
      for (const node of this.treeData) {
        if (node.children !== 0 && (node.label !== node.name)) {
          discrepencySet.add({
            id: node.id,
            name: node.name,
            groupName: this.groupName,
            ontologyId: node.ontologyId,
            x: node.x,
            y: node.y
          });
        }
      }
      for (const node of this.nodes) {
        if ((node.group === 1 || node.group === 2) && (node.label !== node.name)) {
          discrepencySet.add({
            id: node.id,
            name: node.name,
            groupName: node.groupName,
            ontologyId: node.ontologyId,
            x: node.x,
            y: node.y
          });
        }
      }
      discrepencyLabels = [...discrepencySet];
      this.store.dispatch(new DiscrepencyId([]));
      this.store.dispatch(new DuplicateId([]));
    }
    else {
      discrepencyLabels = [];
    }
    this.store.dispatch(new DiscrepencyLabel(discrepencyLabels));
  }

  makeBimodalWithDiscrepencyId(config: SheetConfig) {
    this.store.dispatch(new UpdateConfig(config));
    let discrepencyIds = [];
    if (config.discrepencyId) {
      const discrepencySet = new Set<DiscrepencyStructure>();
      for (const node of this.treeData) {
        if (node.children !== 0 && (!node.ontologyId)) {
          discrepencySet.add({
            id: node.id,
            name: node.name,
            groupName: this.groupName,
            ontologyId: node.ontologyId,
            x: node.x,
            y: node.y
          });
        }
      }
      for (const node of this.nodes) {
        if ((node.group === 1 || node.group === 2) && (!node.ontologyId)) {
          discrepencySet.add({
            id: node.id,
            name: node.name,
            groupName: node.groupName,
            ontologyId: node.ontologyId,
            x: node.x,
            y: node.y
          });
        }
      }
      discrepencyIds = [...discrepencySet];
      this.store.dispatch(new DiscrepencyLabel([]));
      this.store.dispatch(new DuplicateId([]));
    }
    else {
      discrepencyIds = [];
    }
    this.store.dispatch(new DiscrepencyId(discrepencyIds));
  }

  makeDuplicateId(config: SheetConfig) {
    this.store.dispatch(new UpdateConfig(config));
    let duplicateId = [];
    if (config.duplicateId) {
      const duplicateIdSet = new Set<DiscrepencyStructure>();
      for (const node of this.treeData) {
        if (node.children !== 0 && (node.ontologyId) && node.ontologyId !== 'no good match') {
          duplicateIdSet.add({
            id: node.id,
            name: node.name,
            groupName: this.groupName,
            ontologyId: node.ontologyId,
            x: node.x,
            y: node.y
          });
        }
      }
      for (const node of this.nodes) {
        if (node.ontologyId && node.ontologyId !== 'no good match') {
          duplicateIdSet.add({
            id: node.id,
            name: node.name,
            groupName: node.groupName,
            ontologyId: node.ontologyId,
            x: node.x,
            y: node.y
          });
        }
      }
      duplicateId = [...duplicateIdSet];
      const dataLookup = duplicateId.reduce((acc, e) => {
        acc[e.ontologyId]++;
        acc[e.ontologyId] = acc[e.ontologyId] || 0;
        return acc;
      }, {});
      const duplicateIdsTree = duplicateId.filter(e => dataLookup[e.ontologyId]);
      duplicateId = [...duplicateIdsTree];
      this.store.dispatch(new DiscrepencyLabel([]));
      this.store.dispatch(new DiscrepencyId([]));
    }
    else {
      duplicateId = [];
    }
    this.store.dispatch(new DuplicateId([...duplicateId]));
  }

  updateBimodal(config: SheetConfig) {
    this.store.dispatch(new UpdateConfig(config)).subscribe(states => {
      const data = states.sheetState.data;
      const treeData = states.treeState.treeData;
      const bimodalConfig = states.treeState.bimodal.config;

      if (data.length) {
        try {
          console.log('BM Call here');
          this.bm.makeBimodalData(data, treeData, bimodalConfig, false,config);
        } catch (err) {
          console.log(err);
        }
      }
    });
  }

  togglePane() {
    this.store.dispatch(new ToggleControlPane());
  }

  sendMail() {
    const subject = 'About the ASCT+B Reporter!';
    const body = `Hi, thank you for wanting to contact us! This is an auto-generated body template.
      Below are a list of possible subjects, %0D%0A%0D%0A1. Issue/bug wit the Reporter%0D%0A%0D%0A2.
      Feature request for the reporter.%0D%0A%0D%0A3. General discussion about the Reporter.`;
    const mailText = `mailto:infoccf@indiana.edu?subject=${subject}&body=${body}`;
    window.location.href = mailText;
  }

  updateOmapConfig(event: OmapConfig) {
    this.store.dispatch(new UpdateOmapConfig(event)).subscribe(states => {
      const data = states.sheetState.data;
      // const treeData = states.treeState.treeData;
      // const bimodalConfig = states.treeState.bimodal.config;
      // const omapConfig = states.treeState.omapConfig;
      // const sheetConfig = states.sheetState.sheetConfig;
      // const filteredProtiens = states.sheetState.filteredProtiens;
      const selectedOrgansBeforeFilter = states.sheetState.selectedOrgansBeforeFilter;

      if (event.organsOnly) {
        this.omapOrgansOnly(states.sheetState);
      }
      if (!event.organsOnly && selectedOrgansBeforeFilter.length > 0) {
        // Save a list of organs before updating
        this.store.dispatch(new UpdateSelectedOrgansBeforeFilter([]));
        // TODO: Need logic to see if organs were removed after filtering ~ then remove them from selectedOrgansBeforeFilter...
        this.store.dispatch(new FetchSelectedOrganData(states.sheetState.sheet, selectedOrgansBeforeFilter, states.sheetState.omapSelectedOrgans, states.sheetState.compareSheets));
        sessionStorage.setItem('selectedOrgans', selectedOrgansBeforeFilter.join(','));
      }
      if (data.length) {
        console.log('BM Call here');
        this.omapProteinsOnly(states.sheetState, states.treeState);
      }
    });
  }

  private omapProteinsOnly(sheetState: SheetStateModel, treeState: TreeStateModel) {
    if (sheetState.data.length) {
      this.bm.makeBimodalData(sheetState.data, treeState.treeData, treeState.bimodal.config, false, sheetState.sheetConfig, treeState.omapConfig, sheetState.filteredProtiens);
    }
  }

  private omapOrgansOnly(sheetState: SheetStateModel) {
    
    //Call FetchSelectedOrganData with sheetState - compareSheets, sheet, selectedOrgans, omapSelected...
    
    const newlySelectedOrgans = this.organFiltering(sheetState.selectedOrgans, sheetState.omapSelectedOrgans);
    if (!this.arraysEqual(newlySelectedOrgans, sheetState.selectedOrgans)) {
      // Save a list of organs before updating
      
      this.store.dispatch(new UpdateSelectedOrgansBeforeFilter(sheetState.selectedOrgans));
      this.store.dispatch(new FetchSelectedOrganData(sheetState.sheet, newlySelectedOrgans, sheetState.omapSelectedOrgans, sheetState.compareSheets));
      sessionStorage.setItem('selectedOrgans', newlySelectedOrgans.join(','));
    }
    
  }

  private organFiltering(selectedOrgans, omapSelectedOrgans) : string[] {
    if (omapSelectedOrgans.length > 0 && omapSelectedOrgans[0] != '') {
      const selectedOmapOrgans = omapSelectedOrgans.map(organ => organ.split('-')[0].split('_').join(' ').toLowerCase());
      const filteredOmapOrgans= this.omapSheetConfig.filter(organ => selectedOmapOrgans.includes(organ.name.toLowerCase())).map(organ => organ.uberon_id);
      const newSelectedOrgans = [];
      for(const selectedOrgan of selectedOrgans) {
        const sheetOrgan = this.sheetConfig.find(organ => organ.name === selectedOrgan.split('-')[0]);
        if (sheetOrgan.representation_of.some(rep => filteredOmapOrgans.includes(rep))) {
          newSelectedOrgans.push(selectedOrgan);
        }
      }
      return newSelectedOrgans;
    }
    else {
      const omapUberonIds = this.omapSheetConfig.map(organ => organ.uberon_id);
      const newSelectedOrgans = [];
      selectedOrgans.forEach(selectedOrgan => {
        const sheetOrgan = this.sheetConfig.find(organ => organ.name === selectedOrgan.split('-')[0]);
        if (sheetOrgan.representation_of.some(rep => omapUberonIds.includes(rep))) {
          newSelectedOrgans.push(selectedOrgan);
        }
      });
      return newSelectedOrgans;
    }

  }

  private arraysEqual<T>(a: T[], b: T[]): boolean {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
}
