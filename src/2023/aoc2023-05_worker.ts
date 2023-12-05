import {parentPort, workerData} from 'worker_threads';

const mapValues = (maps: number[][][]) => (x: number) => {
  for (const map of maps) {
    for (const entry of map) {
      const [dst, src, len] = entry;
      if (x >= src && x < src + len) {
        x += dst - src;
        break;
      }
    }
  }
  return x;
};

const compute = (seeds: number[], maps: number[][][]) => {
  let result = +Infinity;
  const mm = mapValues(maps);
  for (let i = 0; i < seeds.length; i += 2) {
    for (let j = seeds[i], k = 0, l = seeds[i + 1]; k < l; j++, k++) {
      result = Math.min(result, mm(j));
    }
  }
  return result;
};

parentPort.postMessage(compute(workerData.seeds, workerData.maps));
