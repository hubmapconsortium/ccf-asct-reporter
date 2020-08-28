import { GroupMark } from 'vega';

export interface VegaMultiParentMarkGroup {
	group: GroupMark;
}

export class MultiParentMarkGroup implements VegaMultiParentMarkGroup {
	group: any;

	constructor() {
		this.group = this.makeMultiParentMarkGroup();
		return this.group;
	}

	makeMultiParentMarkGroup() {
		return {
			type: 'group',
			name: 'multiParent',
			marks: [
				this.makeMultiParentPathMarks()
			],
		}
	}

	makeMultiParentPathMarks() {
		return {
			type: 'path',
			from: { data: 'multi_parent_edges' },
			encode: {
				update: {
					path: { field: 'path' },
					stroke: { signal: 'datum.source.pathColor' },
					strokeDash: { value: [5, 8] },
					opacity: [
						{
							test: 'node__click !== null',
							value: 0.1
						},
						{
							test: 'node__hover !== null && datum.source.id !== node__hover && node__click === null',
							value: 0.25
						},
						{
							value: 0.4
						}
					],
					zIndex: { value: -1 },
					strokeWidth: { value: 2 },
				},
			},
		}
	}

}
