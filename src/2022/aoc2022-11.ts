export {};

type Monkey = {
  items: number[];
  operation: string;
  operand: number;
  div: number;
  trueTo: number;
  falseTo: number;
  count: number;
};

const parse = (input: string[]) => {
  const monkeys = [];
  const getNew = (): Monkey => ({
    ...{
      items: [],
      operation: '+',
      operand: null,
      div: Number(1),
      trueTo: 0,
      falseTo: 0,
      count: 0,
    },
  });
  let cur: Monkey;
  for (const l of input) {
    if (l.startsWith('Monkey')) {
      cur = getNew();
      monkeys.push(cur);
    } else if (l.startsWith('  Starting items: '))
      cur.items = l
        .replace(/ /g, '')
        .split(':')[1]
        .split(',')
        .map((x) => Number(x));
    else if (l.startsWith('  Operation: new =')) {
      const s = l.replace(/.*([*+])/, '$1');
      cur.operation = s[0];
      const o = s.slice(1).replace(/ /g, '');
      cur.operand = o === 'old' ? null : Number(o);
    } else if (l.startsWith('  Test: divisible by')) cur.div = Number(l.replace(/[^0-9]/g, ''));
    else if (l.startsWith('    If true: throw to monkey')) cur.trueTo = +l.replace(/[^0-9]/g, '');
    else if (l.startsWith('    If false: throw to monkey')) cur.falseTo = +l.replace(/[^0-9]/g, '');
  }
  return monkeys;
};

const part = (mm: Monkey[], turns: number, reduce: (a: number) => number) => {
  for (let turn = 0; turn < turns; turn++) {
    for (const m of mm) {
      for (const i of m.items) {
        const operand: number = m.operand === null ? i : m.operand;
        const j = m.operation === '+' ? i + operand : i * operand;
        const k = reduce(j);
        const n = k % m.div === 0 ? m.trueTo : m.falseTo;
        mm[n].items.push(k);
        m.count++;
      }
      m.items = [];
    }
  }
  mm.sort((a, b) => b.count - a.count);
  return mm[0].count * mm[1].count;
};

const part1 = (input: string[]) => {
  const mm = parse(input);
  return part(mm, 20, (a) => Math.floor(a / 3));
};

const part2 = (input: string[]) => {
  const mm = parse(input);
  const multiple = mm.reduce((a, m) => a * m.div, 1); // lcm would be better, but this is enough
  return part(mm, 10000, (a) => a % multiple);
};

const inputSample = `
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`.split('\n');

const inputReal = `
Monkey 0:
  Starting items: 78, 53, 89, 51, 52, 59, 58, 85
  Operation: new = old * 3
  Test: divisible by 5
    If true: throw to monkey 2
    If false: throw to monkey 7

Monkey 1:
  Starting items: 64
  Operation: new = old + 7
  Test: divisible by 2
    If true: throw to monkey 3
    If false: throw to monkey 6

Monkey 2:
  Starting items: 71, 93, 65, 82
  Operation: new = old + 5
  Test: divisible by 13
    If true: throw to monkey 5
    If false: throw to monkey 4

Monkey 3:
  Starting items: 67, 73, 95, 75, 56, 74
  Operation: new = old + 8
  Test: divisible by 19
    If true: throw to monkey 6
    If false: throw to monkey 0

Monkey 4:
  Starting items: 85, 91, 90
  Operation: new = old + 4
  Test: divisible by 11
    If true: throw to monkey 3
    If false: throw to monkey 1

Monkey 5:
  Starting items: 67, 96, 69, 55, 70, 83, 62
  Operation: new = old * 2
  Test: divisible by 3
    If true: throw to monkey 4
    If false: throw to monkey 1

Monkey 6:
  Starting items: 53, 86, 98, 70, 64
  Operation: new = old + 6
  Test: divisible by 7
    If true: throw to monkey 7
    If false: throw to monkey 0

Monkey 7:
  Starting items: 88, 64
  Operation: new = old * old
  Test: divisible by 17
    If true: throw to monkey 2
    If false: throw to monkey 5

`.split('\n');

console.log(part1(inputSample));
console.log(part1(inputReal));
console.log(part2(inputSample));
console.log(part2(inputReal));
