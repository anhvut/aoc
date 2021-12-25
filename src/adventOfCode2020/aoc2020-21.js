const fs = require('fs')
const lines = fs.readFileSync(__dirname + '/aoc2020-21.txt', 'utf-8').split(/\r?\n/g);

const foods = lines.map(line => line.replace(/,/g, '').slice(0, -1).split(' (contains ').map(x => x.split(' ')));

const intersection = (a, b) => {
  const inA = Object.fromEntries(a.map(x => [x, true]));
  return b.filter(x => inA[x]);
}

function getPotentialIngredientsByAllergen() {
  const potentialIngredientsByAllergen = {};
  for (const [ingredients, allergens] of foods) {
    for (const allergen of allergens) {
      let knownIngredients = potentialIngredientsByAllergen[allergen];
      if (!knownIngredients) potentialIngredientsByAllergen[allergen] = ingredients;
      else potentialIngredientsByAllergen[allergen] = intersection(ingredients, knownIngredients);
    }
  }
  return potentialIngredientsByAllergen;
}

const part1 = () => {
  const potentialIngredientsByAllergen = getPotentialIngredientsByAllergen();
  const potentialAllergenIngredients = Object.fromEntries(Object.values(potentialIngredientsByAllergen).flatMap(x => x.map(y => [y, true])));
  const safeIngredients = foods.flatMap(x => x[0]).filter(x => !potentialAllergenIngredients[x]);
  return safeIngredients.length;
};

const part2 = () => {
  const potentialIngredientsByAllergen = getPotentialIngredientsByAllergen();
  const nbAllergen = Object.keys(potentialIngredientsByAllergen).length;
  const identifiedAllergen = {};
  do {
    for (const allergen of Object.keys(potentialIngredientsByAllergen)) {
      const ingredients = potentialIngredientsByAllergen[allergen];
      if (ingredients.length === 1) {
        const ingredient = ingredients[0];
        identifiedAllergen[allergen] = ingredient;
        delete potentialIngredientsByAllergen[allergen];
        for (const otherAllergen of Object.keys(potentialIngredientsByAllergen)) {
          potentialIngredientsByAllergen[otherAllergen] = potentialIngredientsByAllergen[otherAllergen].filter(x => x !== ingredient);
        }
      }
    }
  } while (Object.keys(identifiedAllergen).length < nbAllergen);
  return Object.entries(identifiedAllergen).sort(([al1], [al2]) => al1.localeCompare(al2)).map(x => x[1]).join(',');
};

console.log(part1());
console.log(part2());
