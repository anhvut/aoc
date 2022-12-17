export {};

type VALVE_ID = string;

type VALVE = {
  valve: VALVE_ID;
  flow: number;
  next: VALVE_ID[];
};

const parse = (input: string[]): [VALVE[], Record<VALVE_ID, VALVE>] => {
  const valves: VALVE[] = input
    .map((l) =>
      l
        .replace('Valve ', '')
        .replace(' has flow rate=', ';')
        .replace(/ tunnels? leads? to valves? /, '')
        .split(';')
    )
    .map((s) => ({
      valve: s[0],
      flow: +s[1],
      next: s[2].split(', '),
    }));
  return [valves, Object.fromEntries(valves.map((a) => [a.valve, a]))];
};

const buildDist = (valveId: VALVE_ID, valveById: Record<VALVE_ID, VALVE>): Record<VALVE_ID, number> => {
  const result: Record<VALVE_ID, number> = {
    [valveId]: 0,
  };
  let toVisit = [valveId];
  do {
    const nextToVisit = [];
    for (const fromId of toVisit) {
      const from = valveById[fromId];
      const entry = result[from.valve];
      for (const nextId of from.next) {
        if (result[nextId]) continue;
        result[nextId] = entry + 1;
        nextToVisit.push(nextId);
      }
    }
    toVisit = nextToVisit;
  } while (toVisit.length > 0);
  result[valveId] = Infinity;
  return result;
};

function* explorePaths(
  from: VALVE_ID,
  valveOpen: VALVE_ID[],
  availableValves: VALVE_ID[],
  totalPressure: number,
  pressureByMn: number,
  remainingMn: number,
  dist: Record<VALVE_ID, Record<VALVE_ID, number>>,
  valveById: Record<VALVE_ID, VALVE>
): Generator<number> {
  let canExploreFurther = false;
  for (const nextValve of availableValves) {
    const neededMn = dist[from][nextValve] + 1;
    const nextRemainingMn = remainingMn - neededMn;
    if (nextRemainingMn < 0) continue;
    canExploreFurther = true;
    yield* explorePaths(
      nextValve,
      [...valveOpen, nextValve],
      availableValves.filter((x) => x !== nextValve),
      totalPressure + pressureByMn * neededMn,
      pressureByMn + valveById[nextValve].flow,
      nextRemainingMn,
      dist,
      valveById
    );
  }
  if (!canExploreFurther) {
    const pressure = remainingMn * pressureByMn + totalPressure;
    yield pressure;
  }
}

const part1 = (input: string[]) => {
  console.time('total part 1');
  const [valves, valveById] = parse(input);
  const dist = Object.fromEntries(valves.map((x) => [x.valve, buildDist(x.valve, valveById)]));
  const valveIdWithFlow = valves.filter((x) => x.flow > 0).map((x) => x.valve);

  let result = 0;
  for (const c of explorePaths('AA', [], valveIdWithFlow, 0, 0, 30, dist, valveById)) result = Math.max(result, c);
  console.timeEnd('total part 1');
  return result;
};

function* generateSubsetsWithComplementary<T>(set: T[]): Generator<[T[], T[]]> {
  const length = set.length;
  const max_nb = Math.pow(2, length);
  let c, j, k;

  for (c = 0; c < max_nb; c++) {
    const a: T[] = [];
    const b: T[] = [];
    for (j = 0, k = 1; j < length; j++, k <<= 1) {
      if ((c & k) > 0) a.push(set[j]);
      else b.push(set[j]);
    }
    yield [a, b];
  }
}

const part2 = (input: string[]) => {
  console.time('total part 2');
  const [valves, valveById] = parse(input);
  const dist = Object.fromEntries(valves.map((x) => [x.valve, buildDist(x.valve, valveById)]));
  const valveFlow = valves.filter((x) => x.flow > 0).map((x) => x.valve);

  let result = 0;
  for (const [valves1, valves2] of generateSubsetsWithComplementary(valveFlow.slice(1))) {
    let r1 = 0;
    for (const r of explorePaths('AA', [], [valveFlow[0], ...valves1], 0, 0, 26, dist, valveById)) r1 = Math.max(r, r1);
    let r2 = 0;
    for (const r of explorePaths('AA', [], valves2, 0, 0, 26, dist, valveById)) r2 = Math.max(r, r2);
    result = Math.max(result, r1 + r2);
  }
  console.timeEnd('total part 2');
  return result;
};

const inputSample = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`.split('\n');

const inputReal = `Valve EF has flow rate=22; tunnels lead to valves FK, HT, DE
Valve WT has flow rate=0; tunnels lead to valves XJ, XR
Valve RQ has flow rate=0; tunnels lead to valves VG, AV
Valve HF has flow rate=17; tunnels lead to valves EO, PQ, GX
Valve ZH has flow rate=0; tunnels lead to valves VG, RU
Valve AV has flow rate=0; tunnels lead to valves RQ, VQ
Valve AH has flow rate=12; tunnels lead to valves DF, FC, DE, MV, YC
Valve PQ has flow rate=0; tunnels lead to valves CF, HF
Valve DP has flow rate=18; tunnels lead to valves RD, OP, DR
Valve RU has flow rate=16; tunnels lead to valves ZH, VJ, AQ, SG
Valve AQ has flow rate=0; tunnels lead to valves RU, WE
Valve KO has flow rate=0; tunnels lead to valves VQ, HQ
Valve EY has flow rate=0; tunnels lead to valves WE, VQ
Valve RC has flow rate=14; tunnels lead to valves QK, BL, EO
Valve AA has flow rate=0; tunnels lead to valves XV, MS, BG, RT, HQ
Valve IH has flow rate=0; tunnels lead to valves VQ, VJ
Valve CK has flow rate=0; tunnels lead to valves SG, KG
Valve BG has flow rate=0; tunnels lead to valves DY, AA
Valve UJ has flow rate=0; tunnels lead to valves AF, OY
Valve HQ has flow rate=0; tunnels lead to valves AA, KO
Valve XV has flow rate=0; tunnels lead to valves AA, YL
Valve BL has flow rate=0; tunnels lead to valves DY, RC
Valve YL has flow rate=0; tunnels lead to valves WE, XV
Valve RT has flow rate=0; tunnels lead to valves VG, AA
Valve MV has flow rate=0; tunnels lead to valves AH, OM
Valve WE has flow rate=5; tunnels lead to valves AQ, YL, OM, ZU, EY
Valve HN has flow rate=0; tunnels lead to valves OP, XJ
Valve UR has flow rate=0; tunnels lead to valves NZ, OY
Valve FK has flow rate=0; tunnels lead to valves OY, EF
Valve GE has flow rate=0; tunnels lead to valves DF, XE
Valve GX has flow rate=0; tunnels lead to valves HF, DY
Valve YC has flow rate=0; tunnels lead to valves QC, AH
Valve XR has flow rate=0; tunnels lead to valves DY, WT
Valve MS has flow rate=0; tunnels lead to valves AA, DR
Valve EO has flow rate=0; tunnels lead to valves HF, RC
Valve VQ has flow rate=9; tunnels lead to valves NZ, KO, EY, AV, IH
Valve DY has flow rate=23; tunnels lead to valves XR, GX, BL, BG
Valve XJ has flow rate=24; tunnels lead to valves QK, HN, WT
Valve RD has flow rate=0; tunnels lead to valves VG, DP
Valve ZU has flow rate=0; tunnels lead to valves VG, WE
Valve AF has flow rate=0; tunnels lead to valves KG, UJ
Valve DR has flow rate=0; tunnels lead to valves MS, DP
Valve NZ has flow rate=0; tunnels lead to valves VQ, UR
Valve DE has flow rate=0; tunnels lead to valves EF, AH
Valve OP has flow rate=0; tunnels lead to valves DP, HN
Valve QK has flow rate=0; tunnels lead to valves XJ, RC
Valve CF has flow rate=20; tunnel leads to valve PQ
Valve FC has flow rate=0; tunnels lead to valves KH, AH
Valve KG has flow rate=25; tunnels lead to valves HT, AF, KH, CK
Valve XE has flow rate=11; tunnel leads to valve GE
Valve OY has flow rate=7; tunnels lead to valves FK, UJ, UR, QC
Valve OM has flow rate=0; tunnels lead to valves MV, WE
Valve QC has flow rate=0; tunnels lead to valves YC, OY
Valve DF has flow rate=0; tunnels lead to valves AH, GE
Valve KH has flow rate=0; tunnels lead to valves KG, FC
Valve SG has flow rate=0; tunnels lead to valves CK, RU
Valve VG has flow rate=3; tunnels lead to valves ZH, ZU, RQ, RD, RT
Valve HT has flow rate=0; tunnels lead to valves KG, EF
Valve VJ has flow rate=0; tunnels lead to valves IH, RU`.split('\n');

console.log(part1(inputSample));
console.log(part1(inputReal));
console.log(part2(inputSample));
console.log(part2(inputReal));
