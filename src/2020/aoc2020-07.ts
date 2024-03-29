export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

const split2 = (str: string, sep: string) => {
  const index = str.indexOf(sep);
  if (index < 0) {
    return [str];
  }
  return [str.slice(0, index), str.slice(index + 1)];
};

type Item = {
  bag: string;
  nb?: number;
  children?: Array<Item>;
};

const models: Item[] = lines.map((l) => {
  const parts = l.split(' contain ');
  console.assert(parts.length === 2);
  const left = parts[0].replace(/bags$/, 'bag');
  const right = parts[1].replace(/\.$/, '').split(', ');
  let children: Array<Item>;
  if (right.length === 1 && right[0] === 'no other bags') {
    children = [];
  } else {
    children = right.map((r) => {
      const content = split2(r, ' ');
      return {
        nb: +content[0],
        bag: content[1].replace(/bags$/, 'bag'),
      };
    });
  }
  return { bag: left, children };
});

const part1 = () => {
  const visited: Record<string, boolean> = {};
  const visit = (search: string) => {
    models
      .filter((m) => m.children.some((c) => c.bag === search))
      .forEach((container) => {
        if (!visited[container.bag]) {
          visited[container.bag] = true;
          visit(container.bag);
        }
      });
  };
  visit('shiny gold bag');
  return Object.keys(visited).length;
};

const part2 = () => {
  const sumContents = (search: string): number => {
    return models.find((m) => m.bag === search).children.reduce((agg, c) => agg + c.nb * (1 + sumContents(c.bag)), 0);
  };
  return sumContents('shiny gold bag');
};

console.log(part1());
console.log(part2());
