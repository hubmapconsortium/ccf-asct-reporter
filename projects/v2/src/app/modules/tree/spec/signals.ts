import { Signal } from 'vega';
import { Sheet, SheetConfig } from '../../../models/sheet.model';

interface VegaSignals {
  /**
   * A list of vega signals
   */
  signals: Array<Signal>;
}

export class Signals implements VegaSignals {
  /**
   * List of signals
   */
  signals: any;

  constructor(config: SheetConfig) {
    this.signals = [
      this.makeBimodalNodeClickStateSignal(),
      this.makeBimodalNodeHoverStateSignal(),
      this.makeBimodalNodeSourcesHoverStateSignal(),
      this.makeBimodalNodeTargetsHoverStateSignal(),
      this.makeBimodalTargetsClickStateSignal(),
      this.makeBimodalSourcesClickStateSignal(),
      this.makeSearchSignal(),
      this.makeBimodalTextClickSignal(),
      this.makeBimodalTextHoverSignal(),
      this.makeASTreeWidthSignal(config.width),
      this.makeASTreeHeightSignal(config.height),
      this.makeShowOntologyIDSignal(config.show_ontology),
      this.makeBiomodalPathDOISignal(),
      this.makeDiscrepencySignal()
    ];

    return this.signals;
  }

  /**
   * Signal to trigger an action when a path in the bimodal network
   * is clicked.
   * Updtes the signal data with the references of the source or target
   */
  makeBiomodalPathDOISignal() {
    return {
      name: 'path__click',
      value: null,
      on: [
        {
          events: '@bimodal-path:click',
          update: 'datum.target.group === 2 ? datum.target.references : datum.source.references',
        },
        { events: 'click[!event.item]', update: 'null' },
      ],
    };
  }

  /**
   * Signal to denote of the ontology names in the visualization
   * should be visible
   *
   * @param value show or hide boolean
   */
  makeShowOntologyIDSignal(value: boolean) {
    return {
      name: 'show_ontology',
      value
    };
  }

  /**
   * Set the width of the AS tree
   * @param width width of tree
   */
  makeASTreeWidthSignal(width: number) {
    return {
      name: 'as_width',
      value: width,
    };
  }

  /**
   * Set the height of the AS tree
   * @param height height of tree
   */
  makeASTreeHeightSignal(height: number) {
    return {
      name: 'as_height',
      value: height,
    };
  }

  /**
   * Signal to trigger an event when the name of a bimodal node
   * is clicked
   * Updates the signal data with the data of the node
   */
  makeBimodalTextClickSignal() {
    return {
      name: 'bimodal_text__click',
      value: null,
      on: [
        {
          events: '@textmark:click, @astextmark:click',
          update: 'datum.type === \'AS\' && datum.children ? datum : datum.type === \'BM\' ? datum : null'
        },
        { events: 'click[!event.item]', update: 'null' }
      ]
    };
  }

  /**
   * Signal that is triggered when the name of a node
   * is hovered upon
   */
  makeBimodalTextHoverSignal() {
    return {
      name: 'bimodal_text__hover',
      value: null,
      on: [
        {
          events: '@textmark:mouseover, @astextmark:mouseover',
          update: 'datum'
        },
        { events: 'mouseover[!event.item]', update: 'null' }
      ]
    };
  }

  /**
   * Signal to trigger clicking action on a bimodal network signal. It updates the field (node__click)
   * with the id of the node being clicked on.
   *
   * On clicking elsewhere, the field is updated with null.
   *
   */
  makeBimodalNodeClickStateSignal() {
    return {
      name: 'node__click',
      value: null,
      on: [
        {
          events: '@bimodal-symbol:click',
          update: 'datum.id === node__click ? null : datum.id',
        },
        { events: 'click[!event.item]', update: 'null' },
      ],
    };
  }

  /**
   * Signal to trigger hovering action on a bimodal network signal. It updates the field (node__hover)
   * with the id of the node being hovered on.
   *
   * On removing the mouse from the node, the field is updated with null.
   */

  makeBimodalNodeHoverStateSignal(): Signal {
    return {
      name: 'node__hover',
      value: null,
      on: [
        { events: '@bimodal-symbol:mouseover', update: 'datum.id' },
        { events: 'mouseover[!event.item]', update: 'null' },
      ],
    };
  }

  /**
   * Signal to trigger hovering action on a bimodal network signal. It updates the field (node_targets__hover)
   * with the targets array of the current node.
   *
   * On removing the mouse from the node, the field is updated with null.
   */

  makeBimodalNodeTargetsHoverStateSignal(): Signal {
    return {
      name: 'node_targets__hover',
      value: [],
      on: [
        { events: '@bimodal-symbol:mouseover', update: 'datum.targets' },
        { events: 'mouseover[!event.item]', update: '[]' },
      ],
    };
  }

  /**
   * Signal to trigger hovering action on a bimodal network signal. It updates the field (node_sources__hover)
   * with the sources array of the current node.
   *
   * On removing the mouse from the node, the field is updated with null.
   */

  makeBimodalNodeSourcesHoverStateSignal(): Signal {
    return {
      name: 'node_sources__hover',
      value: [],
      on: [
        { events: '@bimodal-symbol:mouseover', update: 'datum.sources' },
        { events: 'mouseover[!event.item]', update: '[]' },
      ],
    };
  }

  /**
   * Signal to trigger clicking action on a bimodal network signal. It updates the field (targets__click)
   * with the targets array of the current node.
   *
   * On clicking elsewhere, the field is updated with null.
   */

  makeBimodalTargetsClickStateSignal(): Signal {
    return {
      name: 'targets__click',
      value: [],
      on: [
        {
          events: '@bimodal-symbol:click',
          update: 'datum.targets === targets__click ? [] : datum.targets',
        },
        { events: 'click[!event.item]', update: '[]' },
      ],
    };
  }

  /**
   * Signal to trigger clicking action on a bimodal network signal. It updates the field (sources__click)
   * with the sources array of the current node.
   *
   * On clicking elsewhere, the field is updated with null.
   */

  makeBimodalSourcesClickStateSignal() {
    return {
      name: 'sources__click',
      value: [],
      on: [
        {
          events: '@bimodal-symbol:click',
          update: 'datum.sources === sources__click ? [] : datum.sources',
        },
        { events: 'click[!event.item]', update: '[]' },
      ],
    };
  }

  /**
   * Signal to update the search field
   */
  makeSearchSignal() {
    return {
      name: 'search_signal',
      value: [],
    };
  }

  /**
   * Signal to update the discrepency field
   */
   makeDiscrepencySignal() {
    return {
      name: 'discrepency_signal',
      value: [],
    };
  }

}
