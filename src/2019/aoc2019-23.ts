export {};

import fs from 'fs';

const nbs: number[] = fs
  .readFileSync(__filename.replace(/\.[jt]s/, '.txt'), 'utf-8')
  .split(',')
  .filter(Boolean)
  .map((x) => +x);

function* run(input: number[], program: number[]): Generator<number, number, number> {
  let pos = 0;
  let result = 0;
  let relativeBase = 0;
  const mem: number[] = program.slice();
  const getValue = (mode: number, param: number) =>
    (mode === 1 ? param : mode === 2 ? mem[relativeBase + param] : mem[param]) ?? 0;
  const getDestinationAddress = (mode: number, param: number) => {
    if (mode === 0) return param;
    if (mode === 2) return relativeBase + param;
    throw new Error(`Invalid destination mode ${mode}`);
  };
  while (pos < mem.length) {
    const instruction = mem[pos];
    const opcode = instruction % 100;
    const param1Mode = Math.floor(instruction / 100) % 10;
    const param2Mode = Math.floor(instruction / 1000) % 10;
    const param3Mode = Math.floor(instruction / 10000) % 10;
    switch (opcode) {
      case 1:
      case 2: {
        const [src1, src2, dst] = mem.slice(pos + 1, pos + 4);
        const value1 = getValue(param1Mode, src1);
        const value2 = getValue(param2Mode, src2);
        const value3 = getDestinationAddress(param3Mode, dst);
        mem[value3] = opcode === 1 ? value1 + value2 : value1 * value2;
        pos += 4;
        break;
      }
      case 3: {
        const dst = getDestinationAddress(param1Mode, mem[pos + 1]);
        if (input.length > 0) {
          mem[dst] = input.shift();
        } else {
          const n = yield undefined;
          if (n != null) mem[dst] = n;
        }
        pos += 2;
        break;
      }
      case 4: {
        const src = mem[pos + 1];
        result = getValue(param1Mode, src);
        pos += 2;
        const n = yield result;
        if (n != null) input.push(n);
        break;
      }
      case 5:
      case 6: {
        const [src1, src2] = mem.slice(pos + 1, pos + 3);
        const value1 = getValue(param1Mode, src1);
        const value2 = getValue(param2Mode, src2);
        if ((opcode === 5 && value1) || (opcode === 6 && !value1)) pos = value2;
        else pos += 3;
        break;
      }
      case 7:
      case 8: {
        const [src1, src2, dst] = mem.slice(pos + 1, pos + 4);
        const value1 = getValue(param1Mode, src1);
        const value2 = getValue(param2Mode, src2);
        const value3 = getDestinationAddress(param3Mode, dst);
        mem[value3] = (opcode === 7 && value1 < value2) || (opcode === 8 && value1 === value2) ? 1 : 0;
        pos += 4;
        break;
      }
      case 9: {
        const src = mem[pos + 1];
        const adjust = getValue(param1Mode, src);
        relativeBase += adjust;
        pos += 2;
        break;
      }
      case 99:
        return result;
      default:
        throw Error(`Unknown opcode ${opcode} at position ${pos}`);
    }
  }
  return 0;
}

const part = (forwardNat = false) => {
  const nbNodes = 50;
  const addresses = Array(nbNodes)
    .fill(0)
    .map((_, i) => i);
  const generators = addresses.map((x) => run([x, -1], nbs));
  const recv: number[][] = addresses.map(() => []);
  const send: number[][] = addresses.map(() => []);
  let nat: number[] = [];
  let lastNatY: number = undefined;
  for (let i = 0; i < 100000; i++) {
    let idle = true;
    for (let nodeIndex = 0; nodeIndex < nbNodes; nodeIndex++) {
      if (send[nodeIndex].length > 0) idle = false;
      const next = generators[nodeIndex].next(send[nodeIndex].shift() ?? -1);
      const recvBuf = recv[nodeIndex];
      if (next.value !== undefined) recvBuf.push(next.value);
      if (recvBuf.length > 0) idle = false;
      if (recvBuf.length >= 3) {
        const [target, x, y] = recvBuf;
        recvBuf.length = 0;
        // console.log(`Node ${nodeIndex} sends ${x}, ${y} to ${target}`);
        if (target === 255) {
          if (!forwardNat) return y;
          nat = [x, y];
        } else if (target >= 0 && target < nbNodes) {
          send[target].push(x, y);
        }
      }
    }
    if (idle && nat.length > 0) {
      console.log(`NAT Send ${nat}`);
      const [x, y] = nat;
      if (y === lastNatY) return y;
      lastNatY = y;
      send[0].push(x, y);
      nat = [];
    }
  }
  return 0;
};

// console.log(part());
console.log(part(true));
