export {};
import fs from 'fs';

const instructions: string[] = fs
  .readFileSync(__filename.replace(/\.[jt]s/, '.txt'), 'utf-8')
  .split('\n')
  .filter(Boolean);

type DECK = number[];

const dealNewStack = (deck: DECK): DECK => deck.slice().reverse();

const cut = (deck: DECK, n: number): DECK => {
  if (n === 0) return deck;
  n %= deck.length;
  return deck.slice(n).concat(deck.slice(0, n));
};

// NB: work only if deck.length and n are coprime
const dealIncr = (deck: DECK, n: number): DECK => {
  const result = Array(deck.length);
  let i = 0;
  for (let j = 0; i < deck.length; j = (j + n) % deck.length) result[j] = deck[i++];
  return result;
};

const part1 = (nbCards = 10007) => {
  const startDeck: DECK = Array(nbCards)
    .fill(0)
    .map((_, i) => i);

  const deck = instructions.reduce((deck, instruction) => {
    if (instruction === 'deal into new stack') return dealNewStack(deck);
    if (instruction.startsWith('deal with increment ')) return dealIncr(deck, +instruction.slice(20));
    if (instruction.startsWith('cut ')) return cut(deck, +instruction.slice(4));
    throw Error(`Instruction not understood: ${instruction}`);
  }, startDeck);

  if (nbCards <= 20) console.log(`Deck ${deck}`);

  return deck.indexOf(2019);
};

const bigPowMod = (x: bigint, n: number, mod: bigint): bigint => {
  let result = 1n;
  let base = x;
  while (n > 0) {
    if (n & 1) result = result * base;
    base = (base * base) % mod;
    n = Math.floor(n / 2);
  }
  return result % mod;
};

/*
Little Fermat theorem: for n prime, for any integer x, x**n = x mod n
If x is not divisible by n, x**(n-1) = 1 mod n <=> x * x**(n-2) = 1 mod n
  => invMod(x,n) == powMod(x,n-2,n)
*/
const bigInvMod = (x: bigint, n: number): bigint => {
  return bigPowMod(x, n - 2, BigInt(n));
};

function getMultiplierOffset(nbCards: bigint, instructions: string[]) {
  let mul = 1n;
  let offset = 0n;

  for (const instruction of instructions) {
    if (instruction === 'deal into new stack') {
      // y => -y - 1
      // x => -(multiplier*x + offset) - 1 = -multiplier*x -offset-1
      mul *= -1n;
      offset = -offset - 1n;
    }
    if (instruction.startsWith('deal with increment ')) {
      // y => incr*y
      // x => incr*(multiplier*x + offset) = incr*multiplier*x + incr*offset
      const incr = BigInt(instruction.slice(20));
      mul *= incr;
      offset *= incr;
    }
    if (instruction.startsWith('cut ')) {
      // y => y - cut
      // x => multiplier*x + offset-cut
      const cut = BigInt(instruction.slice(4));
      offset -= cut;
    }
    // normalize
    mul = ((mul % nbCards) + nbCards) % nbCards;
    offset = ((offset % nbCards) + nbCards) % nbCards;
  }
  return [mul, offset];
}

const part1Arith = (nbCards = 10007) => {
  const [mul, offset] = getMultiplierOffset(BigInt(nbCards), instructions).map((x) => Number(x));
  return (2019 * mul + offset) % nbCards;
};

const part2Arith = (nbCardsInt = 119_315_717_514_047, nbShuffles = 101_741_582_076_661) => {
  const nbCards = BigInt(nbCardsInt);
  const [mul, offset] = getMultiplierOffset(nbCards, instructions);
  /*
  apply n times formula: x*m**n + c*(m**(n-1) + m**(n-2) + ... + m + 1)
  y = x*m**n + c*(m**n - 1)/(m - 1) = x*m**n + c*(m**n - 1)*invMod(m - 1)
  */
  const mulN = bigPowMod(mul, nbShuffles, nbCards);
  const offsetN = (offset * (bigPowMod(mul, nbShuffles, nbCards) - 1n) * bigInvMod(mul - 1n, nbCardsInt)) % nbCards;
  return ((2020n - offsetN + nbCards) * bigInvMod(mulN, nbCardsInt)) % nbCards;
};

console.log(part1());
console.log(part1Arith());
console.log(part2Arith());
