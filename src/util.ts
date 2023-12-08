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