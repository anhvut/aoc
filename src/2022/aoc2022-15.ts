export {};

const parse = (input: string[]): Array<[number, number, number, number]> => {
  return input.map(
    (x) =>
      x
        .replace('Sensor at x=', '')
        .replace(' y=', '')
        .replace(': closest beacon is at x=', ',')
        .replace(' y=', '')
        .split(',')
        .map((y) => +y) as [number, number, number, number]
  );
};

function* getSegments(x1: number, y1: number, x2: number, y2: number): Generator<[number, [number, number]]> {
  const d = Math.abs(x1 - x2) + Math.abs(y1 - y2);
  for (let i = -d; i <= d; i++) {
    const y = y1 + i;
    const j = d - Math.abs(i);
    yield [y, [x1 - j, x1 + j]];
  }
}

const getSegment = (x1: number, y1: number, x2: number, y2: number, y: number): [number, number] => {
  const d = Math.abs(x1 - x2) + Math.abs(y1 - y2);
  const j = d - Math.abs(y - y1);
  if (j < 0) return null;
  return [x1 - j, x1 + j];
};

const nextNotInSegments = (min: number, max: number, segments: Array<[number, number]>): number => {
  for (let x = min; x < max; ) {
    let nextX = x;
    for (const [x1, x2] of segments) {
      if (x1 <= x && x <= x2) nextX = Math.max(nextX, x2);
    }
    if (nextX === x) return x;
    x = nextX + 1;
  }
  return max + 1;
};

const part1 = (input: string[]) => {
  const lines = parse(input);
  const targetY = lines[0][0] > 100_000 ? 2_000_000 : 10;
  console.time('calc');
  const segments = lines.map((x) => getSegment(...x, targetY)).filter(Boolean);
  const [x1, x2] = segments.reduce(([x1, x2], [x3, x4]) => [Math.min(x1, x3), Math.max(x2, x4)]);
  let c = 0;
  for (let x = x1; x <= x2; x++) {
    const nextX = nextNotInSegments(x, x2, segments);
    c += nextX - x;
    x = nextX + 1;
  }
  const beaconAtTargetY: Record<number, boolean> = {};
  for (const [, , x, y] of lines) if (y === targetY) beaconAtTargetY[x] = true;
  console.timeEnd('calc');
  return c - Object.values(beaconAtTargetY).length;
};

const part2 = (input: string[]) => {
  console.time('parse');
  const lines = parse(input);
  console.timeEnd('parse');
  console.time('init segments');
  const bound = lines[0][0] > 100_000 ? 4_000_000 : 20;
  const segmentsByY: Array<[number, number][]> = Array(bound)
    .fill(0)
    .map(() => []);
  console.timeEnd('init segments');
  console.time('get segments');
  for (const line of lines) {
    for (const [y, segment] of getSegments(...line)) {
      if (y >= 0 && y < bound) segmentsByY[y].push(segment);
    }
  }
  console.timeEnd('get segments');
  console.time('find point');
  for (let y = 0; y < bound; y++) {
    const segments = segmentsByY[y];
    const x = nextNotInSegments(0, bound, segments);
    if (x <= bound) {
      console.timeEnd('find point');
      return x * 4_000_000 + y;
    }
  }
  console.timeEnd('find point');
  return 0;
};

const inputSample = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`.split('\n');

const inputReal = `Sensor at x=3988693, y=3986119: closest beacon is at x=3979063, y=3856315
Sensor at x=1129181, y=241785: closest beacon is at x=1973630, y=-98830
Sensor at x=2761889, y=2453622: closest beacon is at x=2803715, y=2643139
Sensor at x=3805407, y=3099635: closest beacon is at x=3744251, y=2600851
Sensor at x=3835655, y=3999745: closest beacon is at x=3979063, y=3856315
Sensor at x=3468377, y=3661078: closest beacon is at x=3979063, y=3856315
Sensor at x=1807102, y=3829998: closest beacon is at x=2445544, y=3467698
Sensor at x=2774374, y=551040: closest beacon is at x=1973630, y=-98830
Sensor at x=2004588, y=2577348: closest beacon is at x=2803715, y=2643139
Sensor at x=2949255, y=3611925: closest beacon is at x=2445544, y=3467698
Sensor at x=2645982, y=3991988: closest beacon is at x=2445544, y=3467698
Sensor at x=3444780, y=2880445: closest beacon is at x=3744251, y=2600851
Sensor at x=3926452, y=2231046: closest beacon is at x=3744251, y=2600851
Sensor at x=3052632, y=2882560: closest beacon is at x=2803715, y=2643139
Sensor at x=3994992, y=2720288: closest beacon is at x=3744251, y=2600851
Sensor at x=3368581, y=1443706: closest beacon is at x=3744251, y=2600851
Sensor at x=2161363, y=1856161: closest beacon is at x=1163688, y=2000000
Sensor at x=3994153, y=3414445: closest beacon is at x=3979063, y=3856315
Sensor at x=2541906, y=2965730: closest beacon is at x=2803715, y=2643139
Sensor at x=600169, y=3131140: closest beacon is at x=1163688, y=2000000
Sensor at x=163617, y=1082438: closest beacon is at x=1163688, y=2000000
Sensor at x=3728368, y=140105: closest beacon is at x=3732654, y=-724773
Sensor at x=1187681, y=2105247: closest beacon is at x=1163688, y=2000000
Sensor at x=2327144, y=3342616: closest beacon is at x=2445544, y=3467698`.split('\n');

console.log(part1(inputSample));
console.log(part1(inputReal));
console.log(part2(inputSample));
console.log(part2(inputReal));
