export {};
const fs = require('fs');
const lines: string[] = fs.readFileSync(__filename.replace(/\.js$/, '.txt'), 'utf-8').split(/\n/g);

type QuantityChemical = { quantity: number, chemical: string };
type Reaction = { input: QuantityChemical[], output: QuantityChemical };

const reactions: Reaction[] = lines.map(line => {
  const [input, output] = line.split(' => ');
  const [quantity, chemical] = output.split(' ');
  return {
    input: input.split(', ').map(input => {
      const [quantity, chemical] = input.split(' ');
      return {quantity: Number(quantity), chemical};
    }),
    output: {quantity: Number(quantity), chemical}
  };
});

const FUEL = 'FUEL';

function getChemicalProducersLevels(reactionsByChemical: Record<string, Reaction>): {
  chemicalToProducers: Record<string, string[]>;
  chemicalLevels: Record<string, number>;
  maxLevel: number;
} {
  const chemicalToOutput: Record<string, string> = {};
  const chemicalToProducers: Record<string, string[]> = {};
  const chemicalLevels: Record<string, number> = {};
  let maxLevel = 0;

  const buildTree = (chemical: string, level = 0) => {
    chemicalLevels[chemical] = level;
    maxLevel = Math.max(maxLevel, level);
    chemicalToProducers[chemical] = [];
    const nextLevel = level + 1;
    for (const {chemical: subChemical} of reactionsByChemical[chemical]?.input ?? []) {
      if (chemicalLevels[subChemical] >= nextLevel) continue;
      const oldParent = chemicalToOutput[subChemical];
      if (oldParent) {
        chemicalToProducers[oldParent] = chemicalToProducers[oldParent].filter(p => p !== subChemical);
      }
      chemicalToOutput[subChemical] = chemical;
      chemicalToProducers[chemical].push(subChemical);
      buildTree(subChemical, nextLevel);
    }
  };
  buildTree(FUEL);
  return {chemicalToProducers,chemicalLevels , maxLevel};
}

function getOres(reactionsByChemical: Record<string, Reaction>, maxLevel: number, chemicalLevels: Record<string, number>) {
  let recipe: QuantityChemical[] = reactionsByChemical[FUEL].input;
  for (let level = 1; level < maxLevel; level++) {
    let quantityByProducer: Record<string, number> = {};
    for (const {quantity, chemical} of recipe) {
      if (chemicalLevels[chemical] > level) { // do not replace now, it will be re-output by sibling chemicals
        quantityByProducer[chemical] = (quantityByProducer[chemical] ?? 0) + quantity;
        continue;
      }
      const subReaction = reactionsByChemical[chemical];
      if (subReaction) {
        const multiplier = Math.ceil(quantity / subReaction.output.quantity);
        for (const {chemical: subChemical, quantity: subQuantity} of subReaction.input) {
          quantityByProducer[subChemical] = (quantityByProducer[subChemical] ?? 0) + subQuantity * multiplier;
        }
      }
    }
    recipe = Object.entries(quantityByProducer).map(([chemical, quantity]) => ({quantity, chemical}));
  }
  return recipe[0].quantity;
}

const part1 = (): number => {
  const reactionsByChemical: Record<string, Reaction> = Object.fromEntries(reactions.map(r => [r.output.chemical, r]));
  const {chemicalLevels, maxLevel} = getChemicalProducersLevels(reactionsByChemical);
  return getOres(reactionsByChemical, maxLevel, chemicalLevels);
};

const part2 = (): number => {
  const reactionsByChemical: Record<string, Reaction> = Object.fromEntries(reactions.map(r => [r.output.chemical, r]));
  const {chemicalLevels, maxLevel} = getChemicalProducersLevels(reactionsByChemical);
  const baseReaction: Reaction = reactionsByChemical[FUEL];
  const evaluate = (nbFuel: number): number => {
    reactionsByChemical[FUEL] = {
      input: baseReaction.input.map(({chemical, quantity}) => ({quantity: quantity * nbFuel, chemical})),
      output: {quantity: baseReaction.output.quantity, chemical: baseReaction.output.chemical}
    };
    return getOres(reactionsByChemical, maxLevel, chemicalLevels);
  }
  let min = 2, max = 1_000_000_000_000, ores;
  while (min < max - 1) {
    const mid = Math.floor((min + max) / 2);
    ores = evaluate(mid);
    if (ores <= 1_000_000_000_000) min = mid;
    else max = mid;
  }
  return min;
};

console.log(part1());
console.log(part2());