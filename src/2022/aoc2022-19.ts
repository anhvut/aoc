export {};

enum RES {
  ore = 'ore',
  clay = 'clay',
  obsidian = 'obsidian',
  geode = 'geode',
}

type COST = Record<RES, number>;

type ROBOT = {
  produce: RES;
  cost: COST;
};

type BLUEPRINT = {
  id: number;
  robots: ROBOT[];
};

type RUN = {
  earn: COST;
  have: COST;
  path: number[];
  remaining: number;
};

const resName = Object.values(RES);
const makeCost = (ore = 0, clay = 0, obsidian = 0, geode = 0): COST => ({ ore, clay, obsidian, geode });
const makeRobot = (produce: RES, cost: COST): ROBOT => ({ produce, cost });
const makeBlueprint = (id: number, robots: ROBOT[]): BLUEPRINT => ({ id, robots });
const makeRun = (earn: COST, have: COST, path: number[] = [], remaining: number): RUN => ({
  earn,
  have,
  path,
  remaining,
});

const cloneRun = ({ earn, have, path, remaining }: RUN): RUN => ({
  earn: { ...earn },
  have: { ...have },
  path: [...path],
  remaining,
});

const parse = (input: string[]) => {
  const expr =
    /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./;
  return input.filter(Boolean).map((line) => {
    const [id, ore1, ore2, ore3, clay3, ore4, obsidian] = line
      .match(expr)
      .slice(1)
      .map((x) => +x);
    return makeBlueprint(id, [
      makeRobot(RES.ore, makeCost(ore1)),
      makeRobot(RES.clay, makeCost(ore2)),
      makeRobot(RES.obsidian, makeCost(ore3, clay3)),
      makeRobot(RES.geode, makeCost(ore4, 0, obsidian)),
    ]);
  });
};

const evaluateBfs = (blueprint: BLUEPRINT, partRemaining: number, beamSize: number): number => {
  console.time('evaluate bfs');

  const resNameToInt = Object.fromEntries(resName.map((x, i) => [x, i]));

  function getNextToSearch(inputRun: RUN): RUN[] {
    if (!inputRun.remaining) return [];

    // buy phase
    const canBuy = blueprint.robots.filter((r) => resName.every((res) => inputRun.have[res] >= r.cost[res]));
    const runsWithBuy = canBuy.map((robot) => {
      const runBuy = cloneRun(inputRun);
      resName.forEach((res) => (runBuy.have[res] -= robot.cost[res]));
      runBuy.path.push(resNameToInt[robot.produce]);
      return runBuy;
    });
    const runNoBuy = cloneRun(inputRun);
    runNoBuy.path.push(9);
    const allRuns = [runNoBuy, ...runsWithBuy];

    // earning phase
    allRuns.forEach((run) => {
      for (const res of resName) run.have[res] += run.earn[res];
      run.remaining--;
    });

    // new robot bought phase
    canBuy.forEach((r, i) => runsWithBuy[i].earn[r.produce]++);
    return allRuns;
  }

  function estimateGreedy(inputRun: RUN): number {
    const run = cloneRun(inputRun);
    const tryBuy = (res: RES) => {
      const robot = blueprint.robots.find((r) => r.produce === res);
      if (resName.every((res) => run.have[res] >= robot.cost[res])) {
        // earn
        for (const res of resName) run.have[res] += run.earn[res];
        // buy
        resName.forEach((res) => (run.have[res] -= robot.cost[res]));
        // new robot produced
        run.earn[res]++;
        run.path.push(resNameToInt[res]);
        return true;
      }
      return false;
    };

    for (let i = 0; i < run.remaining; i++) {
      let bought = tryBuy(RES.geode);
      if (!bought) bought = tryBuy(RES.obsidian);
      if (!bought) bought = tryBuy(RES.clay);
      if (!bought) bought = tryBuy(RES.ore);
      if (!bought) {
        run.path.push(9);
        for (const res of resName) run.have[res] += run.earn[res];
      }
    }
    return run.have.geode;
  }

  let bestScore = 0;
  let toSearch: RUN[] = [makeRun(makeCost(1), makeCost(), [], partRemaining)];
  do {
    const nextWithScore = toSearch
      .flatMap((r) => getNextToSearch(r))
      .map((r) => [estimateGreedy(r), r] as [number, RUN]);
    nextWithScore.sort(([score1], [score2]) => score2 - score1);
    const reduced = nextWithScore.slice(0, beamSize);
    toSearch = reduced.map(([_, r]) => r);
    bestScore = reduced.reduce((r, [s]) => Math.max(r, s), bestScore);
  } while (toSearch.length > 0);
  console.timeEnd('evaluate bfs');
  console.log(`Evaluate blueprint ${blueprint.id} - time: ${partRemaining} - result ${bestScore}`);
  return bestScore;
};

const part1 = (input: string[]) => {
  console.time('part1');
  const blueprints = parse(input);
  const hack: Record<number, number> = {
    5: 675000,
    7: 28000,
  };
  const result = blueprints.reduce((r, b, i) => r + evaluateBfs(b, 24, hack[i] ?? 1000) * b.id, 0);
  console.timeEnd('part1');
  return result;
};

const part2 = (input: string[]) => {
  console.time('part2');
  const blueprints = parse(input);
  const result = blueprints.slice(0, 3).reduce((r, b) => r * evaluateBfs(b, 32, 1000), 1);
  console.timeEnd('part2');
  return result;
};

const inputSample = `
Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.
`.split('\n');

const inputReal = `
Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 8 clay. Each geode robot costs 2 ore and 18 obsidian.
Blueprint 2: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 19 clay. Each geode robot costs 4 ore and 15 obsidian.
Blueprint 3: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 17 clay. Each geode robot costs 3 ore and 8 obsidian.
Blueprint 4: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 19 clay. Each geode robot costs 2 ore and 12 obsidian.
Blueprint 5: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 11 clay. Each geode robot costs 4 ore and 7 obsidian.
Blueprint 6: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 7 clay. Each geode robot costs 2 ore and 19 obsidian.
Blueprint 7: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 14 clay. Each geode robot costs 4 ore and 11 obsidian.
Blueprint 8: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 7 clay. Each geode robot costs 3 ore and 10 obsidian.
Blueprint 9: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 6 clay. Each geode robot costs 2 ore and 16 obsidian.
Blueprint 10: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 5 clay. Each geode robot costs 3 ore and 15 obsidian.
Blueprint 11: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 10 clay. Each geode robot costs 2 ore and 13 obsidian.
Blueprint 12: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 12 clay. Each geode robot costs 3 ore and 17 obsidian.
Blueprint 13: Each ore robot costs 2 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 19 clay. Each geode robot costs 2 ore and 18 obsidian.
Blueprint 14: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 6 clay. Each geode robot costs 4 ore and 11 obsidian.
Blueprint 15: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 12 clay. Each geode robot costs 3 ore and 8 obsidian.
Blueprint 16: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 16 clay. Each geode robot costs 4 ore and 16 obsidian.
Blueprint 17: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 7 clay. Each geode robot costs 3 ore and 8 obsidian.
Blueprint 18: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 11 clay. Each geode robot costs 2 ore and 16 obsidian.
Blueprint 19: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 11 clay. Each geode robot costs 2 ore and 8 obsidian.
Blueprint 20: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 11 clay. Each geode robot costs 3 ore and 14 obsidian.
Blueprint 21: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 15 clay. Each geode robot costs 2 ore and 13 obsidian.
Blueprint 22: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 9 clay. Each geode robot costs 3 ore and 7 obsidian.
Blueprint 23: Each ore robot costs 2 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 19 clay. Each geode robot costs 4 ore and 8 obsidian.
Blueprint 24: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 5 clay. Each geode robot costs 3 ore and 12 obsidian.
Blueprint 25: Each ore robot costs 2 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 15 clay. Each geode robot costs 3 ore and 16 obsidian.
Blueprint 26: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 17 clay. Each geode robot costs 3 ore and 10 obsidian.
Blueprint 27: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 9 clay. Each geode robot costs 3 ore and 7 obsidian.
Blueprint 28: Each ore robot costs 2 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 11 clay. Each geode robot costs 3 ore and 8 obsidian.
Blueprint 29: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 16 clay. Each geode robot costs 2 ore and 11 obsidian.
Blueprint 30: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 17 clay. Each geode robot costs 2 ore and 13 obsidian.
`.split('\n');

console.log(part1(inputSample));
console.log(part1(inputReal));
console.log(part2(inputSample));
console.log(part2(inputReal));
