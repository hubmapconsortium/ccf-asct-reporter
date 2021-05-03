import { Component, Input, ViewChild, ElementRef, HostListener } from '@angular/core';

import { Observable } from 'rxjs';
import { BimodalService } from '../../modules/tree/bimodal.service';
import { Store, Select } from '@ngxs/store';
import { TreeState, TreeStateModel } from '../../store/tree.state';
import { SearchStructure, TNode } from '../../models/tree.model';
import { DoSearch } from '../../actions/tree.actions';
import { BMNode } from '../../models/bimodal.model';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { GaAction, GaCategory } from '../../models/ga.model';
import { UIState, UIStateModel } from '../../store/ui.state';
import { CloseSearch, OpenSearch } from '../../actions/ui.actions';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {

  @Input() disabled = false;

  // Structures contains the full list of structures to render for the search
  public structures: SearchStructure[] = [];
  // FilteredStructures contains the filtered subset, to hide filtered out
  // elements without removing them from the DOM completely
  public filteredStructures: SearchStructure[] = [];

  @ViewChild('searchField', { static: false }) searchFieldContent: ElementRef;

  @Select(TreeState) tree$: Observable<TreeStateModel>;
  @Select(UIState) ui$: Observable<UIStateModel>;
  @Select(UIState.getSearchState) searchState$: Observable<boolean>;

  treeData: TNode[];
  nodes: BMNode[];
  searchValue = '';
  selectedValues = '';
  selectedOptions: SearchStructure[];
  selectionMemory: SearchStructure[] = [];
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
  }

  selectOption() {
    this.store.dispatch(new DoSearch(this.selectedOptions));
    this.selectionMemory = this.selectedOptions.slice();
    this.selectedValues = this.selectedOptions.map(obj => obj.name).join(', ');
    this.ga.eventEmitter('nav_search_filter_select', GaCategory.NAVBAR, 'Select/Deselect Search Filters', GaAction.CLICK);
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
      this.filteredStructures = this.structures.slice();
    }

    // Show search dropdown
    this.store.dispatch(new OpenSearch());
    this.searchFieldContent.nativeElement.focus();
    this.selectedOptions = this.selectionMemory.slice();
  }

  closeSearchList() {
    this.store.dispatch(new CloseSearch());
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
      this.filteredStructures = this.structures.slice();
      return;
    }
    // filter the structures
    this.filteredStructures = this.structures.filter(structures => structures.name.toLowerCase().includes(this.searchValue.toLowerCase()));
    // This event fires for every letter typed
    this.ga.eventEmitter('nav_search_term', GaCategory.NAVBAR, 'Search term typed in', GaAction.INPUT, this.searchValue);
  }

  hideStructure(structure: SearchStructure) {
    return this.filteredStructures.indexOf(structure) <= -1;
  }

}
