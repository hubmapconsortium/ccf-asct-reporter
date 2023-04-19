import { Component, OnInit, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ToggleControlPane } from '../../actions/ui.actions';
import { Error } from '../../models/response.model';
import { SheetState } from '../../store/sheet.state';
import { Sheet, SheetConfig, CompareData } from '../../models/sheet.model';
import { TreeState, TreeStateModel } from '../../store/tree.state';
import { DiscrepencyStructure, TNode } from '../../models/tree.model';
import { VegaService } from '../tree/vega.service';
import { DiscrepencyId, DiscrepencyLabel, DuplicateId, UpdateOmapConfig } from '../../actions/tree.actions';
import { UpdateConfig, ToggleShowAllAS, FetchSelectedOrganData } from '../../actions/sheet.actions';
import { BimodalService } from '../tree/bimodal.service';
import { BMNode } from '../../models/bimodal.model';
import { OmapConfig } from '../../models/omap.model';

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

  nodes: BMNode[];
  treeData: TNode[];
  view: any;
  groupName = 'Anatomical Structures';

  constructor(public store: Store, public bm: BimodalService, public vs: VegaService) {

    this.tree$.subscribe(tree => {
      this.treeData = tree.treeData;
      this.nodes = tree.bimodal.nodes;
    });
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
          this.bm.makeBimodalData(data, treeData, bimodalConfig, config);
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
    this.store.dispatch(new UpdateOmapConfig(event));
  }
}
