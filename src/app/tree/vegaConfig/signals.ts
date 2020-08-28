import { Signal } from 'vega';

interface VegaSignals {
  signals: Array<Signal>;
}

export class Signals implements VegaSignals {
  signals: any;

  constructor() {
    this.signals = [
      this.makeBimodalNodeClickStateSignal(),
      this.makeBimodalNodeHoverStateSignal(),
      this.makeBimodalNodeSourcesHoverStateSignal(),
      this.makeBimodalNodeTargetsHoverStateSignal(),
      this.makeBimodalTargetsClickStateSignal(),
      this.makeBimodalTargetsHoverStateSignal(),
      this.makeBimodalSourcesClickStateSignal(),
      this.makeBimodalSourcesHoverStateSignal()
    ];

    return this.signals;
  }

  makeBimodalNodeHoverStateSignal() {
    return {
      name: 'node__hover',
      value: null,
      on: [
        { events: '@bimodal-symbol:mouseover', update: 'datum.id' },
        { events: 'mouseover[!event.item]', update: 'null' },
      ],
    };
  }

  makeBimodalNodeTargetsHoverStateSignal() {
    return {
      name: 'node_targets__hover',
      value: [],
      on: [
        { events: '@bimodal-symbol:mouseover', update: 'datum.targets' },
        { events: 'mouseover[!event.item]', update: '[]' },
      ],
    };
  }

  makeBimodalNodeSourcesHoverStateSignal() {
    return {
      name: 'node_sources__hover',
      value: [],
      on: [
        { events: '@bimodal-symbol:mouseover', update: 'datum.sources' },
        { events: 'mouseover[!event.item]', update: '[]' },
      ],
    };
  }

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

  makeBimodalTargetsClickStateSignal() {
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

  makeBimodalTargetsHoverStateSignal() {
    return {
      name: 'targets__hover',
      value: [],
      on: [
        {
          events: '@bimodal-symbol:mouseover',
          update: 'datum.targets === targets__hover ? [] : datum.targets',
        },
        { events: 'mouseover[!event.item]', update: '[]' },
      ],
    };
  }

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

  makeBimodalSourcesHoverStateSignal() {
    return {
      name: 'sources__hover',
      value: [],
      on: [
        {
          events: '@bimodal-symbol:mouseover',
          update: 'datum.sources === sources__hover ? [] : datum.sources',
        },
        { events: 'mouseover[!event.item]', update: '[]' },
      ],
    };
  }
}
