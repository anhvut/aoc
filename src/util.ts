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
