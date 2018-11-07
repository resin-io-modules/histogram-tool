import { Percentile, PercentileSpec } from '.';

export interface Bin {
	// (eg. the right-cutoff of the bin)
	x: number
}

export class BinSpec {
	id: string
	list: Bin[]
	constructor(id: string, list: Bin[]) {
		this.id = id;
		this.list = list;
	}
	// used to allow code needing a BinSpec to take either an existing BinSpec, a 
	// PercentileSpec, or simply a list of bucket endpoints (number[])
	static fromUnion(arg: BinSpec | PercentileSpec | number[]): BinSpec {
		if (arg instanceof BinSpec) {
			return arg;
		}
		if (arg instanceof PercentileSpec) {
			return new BinSpec(arg.id,
				arg.list.map((p: Percentile) => ({ x: p.x }))
			);
		}
		if (arg instanceof Array) {
			// NB: typescript sort defaults to lexicographic, so we have to be 
			// specific about how to sort a number[]
			arg.sort((a, b) => a - b);
			return new BinSpec(`fromBuckets-${arg}`, arg.map(x => ({ x })));
		}
	}
}
