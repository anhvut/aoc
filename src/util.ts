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

export function consoleTimeit<T>(prefix: string, f: () => T): T {
  const start = performance.now();
  const result = f();
  const end = performance.now();
  console.log(prefix, `${(end - start).toFixed(3)}ms`, result);
  return result;
}

export async function consoleTimeitAsync<T>(prefix: string, f: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const result = await f();
  const end = performance.now();
  console.log(prefix, `${(end - start).toFixed(3)}ms`, result);
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

export function groupBy(array: any[], key: string | number | symbol): Record<string | number | symbol, any[]> {
  const result: Record<string | number | symbol, any[]> = {};
  for (const item of array) {
    const k = item[key];
    if (!result[k]) result[k] = [];
    result[k].push(item);
  }
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

// region Point 3D

export type POINT3D = [number, number, number];

export type SERIALIZED_POINT3D = `${number},${number},${number}`;

export const point3DEquals = ([x1, y1, z1]: POINT3D, [x2, y2, z2]: POINT3D) => x1 === x2 && y1 === y2 && z1 === z2;

export const scalarProduct3D = ([x1, y1, z1]: POINT3D, [x2, y2, z2]: POINT3D) => x1 * x2 + y1 * y2 + z1 * z2;

export const serializePoint3D = ([x, y, z]: POINT3D): SERIALIZED_POINT3D => `${x},${y},${z}`;

export const deserializePoint3D = (s: SERIALIZED_POINT3D): POINT3D => s.split(',').map((x) => +x) as POINT3D;

export const manhattanDistance3D = ([x1, y1, z1]: POINT3D, [x2, y2, z2]: POINT3D) => Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2);

export const point3DAdd = ([x1, y1, z1]: POINT3D, [x2, y2, z2]: POINT3D): POINT3D => [x1 + x2, y1 + y2, z1 + z2];

export const point3DDiff = ([x1, y1, z1]: POINT3D, [x2, y2, z2]: POINT3D): POINT3D => [x1 - x2, y1 - y2, z1 - z2];

// endregion

// region Matrix

export type VECTOR = number[];
export type MATRIX = number[][];

export const matrixMultiply = (m1: MATRIX, m2: MATRIX): MATRIX => {
  // m1 size (y1, x1) x m2 size (y2, x2) => size (y3=y1, x3=x2) - x1 must be equal y2
  const result: MATRIX = [];
  for (let yTarget = 0; yTarget < m1.length; yTarget++) {
    const line: VECTOR = [];
    result.push(line);
    for (let xTarget = 0; xTarget < m2[0].length; xTarget++) {
      let cell = 0;
      for (let i = 0; i < m2.length; i++) {
        cell += m1[yTarget][i] * m2[i][xTarget];
      }
      line.push(cell);
    }
  }
  return result;
};

export const matrixVectorMultiply = (m: MATRIX, p: VECTOR): VECTOR => matrixMultiply(m, p.map(x => [x])).flat();

export const inverseMatrix2 = (m: MATRIX): MATRIX => {
  const [[a, b], [c, d]] = m;
  const det = a * d - b * c;
  if (!det) return null;
  return [
    [d / det, -b / det],
    [-c / det, a / det],
  ];
}

export const scaleVector = (v: VECTOR, s: number): VECTOR => v.map(x => x * s);

export const addVector = (u: VECTOR, v: VECTOR): VECTOR => u.map((x, i) => x + v[i]);

export const subtractVector = (u: VECTOR, v: VECTOR): VECTOR => u.map((x, i) => x - v[i]);

export const dotProduct = (u: VECTOR, v: VECTOR): number => u.reduce((a, b, i) => a + b * v[i], 0);

export const crossProduct = ([x1, y1, z1]: VECTOR, [x2, y2, z2]: VECTOR): VECTOR => [
  y1 * z2 - z1 * y2,
  z1 * x2 - x1 * z2,
  x1 * y2 - y1 * x2,
];

export const inverseMatrix3 = (m: MATRIX): MATRIX => {
  const [[a, b, c], [d, e, f], [g, h, i]] = m;
  const det = a * e * i + b * f * g + c * d * h - c * e * g - b * d * i - a * f * h;
  if (!det) return null;
  return [
    [(e * i - f * h) / det, (c * h - b * i) / det, (b * f - c * e) / det],
    [(f * g - d * i) / det, (a * i - c * g) / det, (c * d - a * f) / det],
    [(d * h - e * g) / det, (b * g - a * h) / det, (a * e - b * d) / det],
  ];
}


// endregion

export const sum = (x: number[]) => x.reduce((a, b) => a + b, 0);

export const sum2 = (x: Array<POINT>) => x.reduce(([x1, y1], [x2, y2]) => [x1 + x2, y1 + y2], [0, 0]);

export const product = (x: number[]) => x.reduce((a, b) => a * b, 1);

export const isApproximatelyEqual = (x: number, y: number, epsilon?: number) => {
  if (!epsilon) epsilon = Math.max(Math.abs(x), Math.abs(y)) * 1e-10;
  return Math.abs(x - y) < epsilon;
}


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
