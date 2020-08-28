import { Signals } from './spec/signals';
import { Data } from './spec/data';
import { Scales } from './spec/scales';
import { Legends } from './spec/legends';
import { Marks } from './spec/marks';

export class VegaConfig {

  async makeVegaConfig(currentSheet, bimodalDistance, height, width, treeData, multiParentLinksData) {
    const config: any = {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      autosize: 'pad',
      padding: {
        right: 0,
        top: 20,
        bottom: 20,
        left: 30,
      },
      signals: new Signals(),
      data: new Data(currentSheet, bimodalDistance, height, width, treeData, multiParentLinksData),
      scales: new Scales(),
      legends: new Legends(),
      marks: new Marks(),
    };

    return config;
  }
}
