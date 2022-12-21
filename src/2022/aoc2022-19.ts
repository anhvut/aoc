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

const evaluate = (blueprint: BLUEPRINT, totalTime: number): number => {
  console.time('evaluate');

  let bestResult = 0;
  const thresholdBuy: Record<RES, number> = {
    ore: Math.max(...blueprint.robots.map(x => x.cost.ore)) * 1.5,
    clay: Math.max(...blueprint.robots.map(x => x.cost.clay)),
    obsidian: Math.max(...blueprint.robots.map(x => x.cost.obsidian)),
    geode: Infinity
  }

  const resNameToInt = Object.fromEntries(resName.map((x, i) => [x, i]));
  const search = (run: RUN) => {
    // end of compute
    if (run.remaining <= 0) {
      bestResult = Math.max(bestResult, run.have.geode);
      return;
    }
    bestResult = Math.max(bestResult, run.have.geode + run.remaining*run.earn.geode);

    // try next robot
    const neededTypes = resName.filter(res => run.have[res] < thresholdBuy[res]);
    for (const nextType of neededTypes) {
      const {cost} = blueprint.robots.find(r => r.produce === nextType);
      // time to have resource + time to build (= 1)
      const time = Math.max(...resName.map(res => run.have[res] >= cost[res] ? 0 :
        Math.ceil((cost[res] - run.have[res]) / run.earn[res]))) + 1;
      if (!isFinite(time) || time > run.remaining) continue;
      const newRun = cloneRun(run);
      resName.forEach(res => {
        newRun.have[res] += time * newRun.earn[res] - cost[res];
      });
      newRun.remaining -= time;
      newRun.earn[nextType]++;
      newRun.path.push(resNameToInt[nextType]);
      search(newRun);
    }
  }

  search(makeRun(makeCost(1), makeCost(0), [], totalTime));
  console.timeEnd('evaluate');
  console.log(`Evaluate blueprint ${blueprint.id} - time: ${totalTime} - result ${bestResult}`);
  return bestResult;
}

const part1 = (input: string[]) => {
  console.time('part1');
  const blueprints = parse(input);
  const result = blueprints.reduce((r, b) => r + evaluate(b, 24) * b.id, 0);
  console.timeEnd('part1');
  return result;
};

const part2 = (input: string[]) => {
  console.time('part2');
  const blueprints = parse(input);
  const result = blueprints.slice(0, 3).reduce((r, b) => r * evaluate(b, 32), 1);
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
