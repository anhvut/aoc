export function toChunks<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  let pos = 0;
  do {
    const nextPos = pos + size;
    result.push(array.slice(pos, nextPos));
    pos = nextPos;
  } while (pos < array.length);
  return result;
}

export function arrayIndices<T>(array: T[], item: T): number[] {
  const result: number[] = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i] === item) result.push(i);
  }
  return result;
}

export function timeit<T>(f: () => T): T {
  console.time('time');
  const result = f();
  console.timeEnd('time');
  return result;
}

export async function timeitAsync<T>(f: () => Promise<T>): Promise<T> {
  console.time('time');
  const result = await f();
  console.timeEnd('time');
  return result;
}

export function getCounts<T extends string | number | symbol>(array: T[]): Record<T, number> {
  const result: Record<T, number> = {} as Record<T, number>;
  for (const item of array) result[item] = (result[item] || 0) + 1;
  return result;
}

export function gcd2(a: number, b: number) {
  if (b === 0) return a;
  return gcd2(b, a % b);
}

export function gcd(...n: number[]) {
  if (n.length === 0) return 0;
  if (n.length === 1) return n[0];
  return n.reduce((a, b) => gcd2(a, b));
}

export function lcm2(a: number, b: number) {
  return (a * b) / gcd2(a, b);
}

export function lcm(...n: number[]) {
  if (n.length === 0) return 0;
  if (n.length === 1) return n[0];
  return n.reduce((a, b) => lcm2(a, b));
}

export function keyBy<VALUE>(array: VALUE[], key: string | number | symbol): Record<string | number | symbol, VALUE> {
  const result: Record<string | number | symbol, VALUE> = {};
  for (const item of array) result[item[key]] = item;
  return result;
}

// region Point

export type POINT = [number, number];

export type SERIALIZED_POINT = `${number},${number}`;

export const pointEquals = ([x1, y1]: POINT, [x2, y2]: POINT) => x1 === x2 && y1 === y2;

export const scalarProduct = ([x1, y1]: POINT, [x2, y2]: POINT) => x1 * x2 + y1 * y2;

export const serializePoint = ([x, y]: POINT): SERIALIZED_POINT => `${x},${y}`;

export const deserializePoint = (s: SERIALIZED_POINT): POINT => s.split(',').map((x) => +x) as POINT;

export const manhattanDistance = ([x1, y1]: POINT, [x2, y2]: POINT) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

export const pointAdd = ([x1, y1]: POINT, [x2, y2]: POINT): POINT => [x1 + x2, y1 + y2];

export const pointDiff = ([x1, y1]: POINT, [x2, y2]: POINT): POINT => [x1 - x2, y1 - y2];

export const UP: POINT = [0, -1];
export const DOWN: POINT = [0, 1];
export const LEFT: POINT = [-1, 0];
export const RIGHT: POINT = [1, 0];

export const ALL_DIRECTIONS = [LEFT, RIGHT, UP, DOWN];

// endregion

export const sum = (x: number[]) => x.reduce((a, b) => a + b, 0);

export const sum2 = (x: Array<POINT>) => x.reduce(([x1, y1], [x2, y2]) => [x1 + x2, y1 + y2], [0, 0]);

export const transpose = <T>(x: T[][]) => x[0].map((_, i) => x.map((y) => y[i]));

export function constantArray<V>(length: number, value: V): Array<V> {
  return Array.from({length}, () => value);
}

export const sequence = (length: number, start = 0, step = 1): Array<number> => Array.from({length}, (_, i) => start + i * step);

// BEWARE: screen coordinates: y-axis is inverted, +1 = down, -1 = up
export const isClockwise = ([x1, y1]: POINT, [x2, y2]: POINT) => {
  return x1 * y2 - x2 * y1 > 0;
};

export const assert = (value: boolean, message = 'Assertion failed') => {
  if (!value) throw new Error(message);
};

export function testClockwise() {
  assert(isClockwise([0, -1], [1, 0]));
  assert(isClockwise([1, 0], [0, 1]));
  assert(isClockwise([0, 1], [-1, 0]));
  assert(isClockwise([-1, 0], [0, -1]));
  assert(!isClockwise([1, 0], [0, -1]));
  assert(!isClockwise([0, -1], [-1, 0]));
  assert(!isClockwise([-1, 0], [0, 1]));
  assert(!isClockwise([0, 1], [1, 0]));
}
