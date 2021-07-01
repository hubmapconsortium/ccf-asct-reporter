import { Component, Input, ViewChild, ElementRef, HostListener } from '@angular/core';

import { Observable } from 'rxjs';
import { BimodalService } from '../../modules/tree/bimodal.service';
import { Store, Select } from '@ngxs/store';
import { TreeState, TreeStateModel } from '../../store/tree.state';
import { SearchStructure, TNode } from '../../models/tree.model';
import { DiscrepencyId, DiscrepencyLabel, DoSearch, DuplicateId } from '../../actions/tree.actions';
import { BMNode } from '../../models/bimodal.model';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { GaAction, GaCategory } from '../../models/ga.model';
import { UIState, UIStateModel } from '../../store/ui.state';
import { CloseSearch, OpenSearch } from '../../actions/ui.actions';
import { Router, NavigationEnd } from '@angular/router';
import { UpdateConfig } from '../../actions/sheet.actions';
import { SheetState } from '../../store/sheet.state';
import { SheetConfig } from '../../models/sheet.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {

  @Input() disabled = false;

  // Structures contains the full list of structures to render for the search
  public structures: SearchStructure[] = [];
  // Contains the subset matching the search term, to hide filtered out
  // elements without removing them from the DOM completely
  public searchFilteredStructures: SearchStructure[] = [];
  // Contains the subset of structures matching the group name button toggle
  public groupFilteredStructures: SearchStructure[] = [];

  @ViewChild('searchField', { static: false }) searchFieldContent: ElementRef;

  @Select(TreeState) tree$: Observable<TreeStateModel>;
  @Select(UIState) ui$: Observable<UIStateModel>;
  @Select(UIState.getSearchState) searchState$: Observable<boolean>;
  @Select(SheetState.getSheetConfig) sheetConfig$: Observable<SheetConfig>;

  treeData: TNode[];
  nodes: BMNode[];
  searchValue = '';
  selectedValues = '';
  selectedOptions: SearchStructure[];
  selectionMemory: SearchStructure[] = [];
  sheetConfig: SheetConfig;
  searchOpen = false;
  selectionCompareFunction = (o1: any, o2: any) => o1.id === o2.id;

  constructor(
    public bms: BimodalService,
    public store: Store,
    public ga: GoogleAnalyticsService,
    public router: Router,
    private readonly elementRef: ElementRef
  ) {

    this.tree$.subscribe(tree => {
      this.selectedOptions = tree.search;
      this.treeData = tree.treeData;
      this.nodes = tree.bimodal.nodes;
    });

    // On tree selection, reset the selected options and structures array
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.structures = [];
        this.selectedValues = '';
        this.selectedOptions = [];
        this.selectionMemory = [];
      }
    });

    this.sheetConfig$.subscribe((config => {
      this.sheetConfig = config;
    }));
  }

  selectOption() {
    // Find the latest option clicked
    const newSelections = this.selectedOptions.filter(item => this.selectionMemory.indexOf(item) < 0);
    let lastClickedOption = null;
    if (newSelections.length > 0) {
      lastClickedOption = newSelections[0];
    }

    console.log(lastClickedOption);
    // Toggling the Discrepency fields to off
    this.sheetConfig.discrepencyId = false;
    this.sheetConfig.discrepencyLabel = false;
    this.sheetConfig.duplicateId = false;
    this.store.dispatch(new UpdateConfig(this.sheetConfig));
    // Dispace the search data to the tree store
    this.store.dispatch(new DoSearch(this.selectedOptions, lastClickedOption));

    // Clearing Discrepency fields so that searched options can appear
    this.store.dispatch(new DiscrepencyLabel([]));
    this.store.dispatch(new DiscrepencyId([]));
    this.store.dispatch(new DuplicateId([]));
    // Update the memory
    this.selectionMemory = this.selectedOptions.slice();
    // Build values for search bar UI text
    this.selectedValues = this.selectedOptions.map(obj => obj.name).join(', ');

    this.ga.eventEmitter('nav_search_filter_select', GaCategory.NAVBAR, 'Select/Deselect Search Filters', GaAction.CLICK);
  }

  selectFirstOption() {
    this.selectedOptions.push(this.searchFilteredStructures[0]);
    this.selectOption();
  }

  isSelected(structure: SearchStructure) {
    return this.selectedOptions.includes(structure);
  }

  deselectAllOptions() {
    this.selectedOptions = [];
    this.selectionMemory = [];
    this.selectedValues = '';
    this.store.dispatch(new DoSearch(this.selectedOptions, null));
    this.ga.eventEmitter('nav_search_deselect_all', GaCategory.NAVBAR, 'Deselect All Search Filters', GaAction.CLICK);
  }

  openSearchList() {
    if (this.structures.length === 0) {
      const searchSet = new Set<SearchStructure>();

      for (const node of this.treeData) {
        if (node.children !== 0) {
          searchSet.add({
            id: node.id,
            name: node.name,
            groupName: 'Anatomical Structures',
            x: node.x,
            y: node.y
          });
        }
      }

      for (const node of this.nodes) {
        searchSet.add({
          id: node.id,
          name: node.name,
          groupName: node.groupName,
          x: node.x,
          y: node.y
        });
      }

      this.structures = [...searchSet];
      this.searchFilteredStructures = this.structures.slice();
      this.groupFilteredStructures = this.structures.slice();
    }

    // Show search dropdown
    this.store.dispatch(new OpenSearch());
    this.searchOpen = true;
    this.searchFieldContent.nativeElement.focus();
    this.selectedOptions = this.selectionMemory.slice();
  }

  closeSearchList() {
    if (this.searchOpen) {
      this.store.dispatch(new CloseSearch());
      this.searchOpen = false;
    }
  }

  clearSearchField() {
    this.searchValue = '';
    this.filterStructuresOnSearch();
  }

  @HostListener('document:click', ['$event'])
  clickOutsideSearchList(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    // Check if the click was outside the element
    if (targetElement && !this.elementRef.nativeElement.contains(targetElement)) {
      this.closeSearchList();
    }
  }

  // This method filters the structures on every letter typed
  public filterStructuresOnSearch() {
    if (!this.structures) {
      return;
    }
    if (!this.searchValue) {
      this.searchFilteredStructures = this.structures.slice();
      return;
    }
    // filter the structures
    this.searchFilteredStructures = this.structures.filter(structures =>
      structures.name.toLowerCase().includes(this.searchValue.toLowerCase()));
    // This event fires for every letter typed
    this.ga.eventEmitter('nav_search_term', GaCategory.NAVBAR, 'Search term typed in', GaAction.INPUT, this.searchValue);
  }

  filterToggleChange(value: string[]) {
    this.ga.eventEmitter('nav_search_group_toggle', GaCategory.NAVBAR, 'Structure Group Name Toggle', GaAction.TOGGLE, this.searchValue);

    if (value.length === 0) {
      this.groupFilteredStructures = this.structures.slice();
      return;
    }

    this.groupFilteredStructures = this.structures.filter(structure => value.includes(structure.groupName));
  }

  // Hide a structure if it is absent from the filtered group list, otherwise hide when absent from the
  // filtered search list
  hideStructure(structure: SearchStructure) {
    return this.groupFilteredStructures.indexOf(structure) <= -1 || this.searchFilteredStructures.indexOf(structure) <= -1;
  }

}
