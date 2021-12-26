export {};
const fs = require('fs');
const lines: string[] = fs.readFileSync(__filename.replace(/\.js/, '.txt'), 'utf-8').split(/\n/g);

const relations: string[][] = lines.map(x => x.split(')'));

type Tree<T> = {
  value: T;
  children: Tree<T>[];
  parent: Tree<T>;
};

const [root, registry]: [Tree<string>, Record<string, Tree<string>>] = (() => {
  const potentialRoot: Record<string, boolean> = {};
  const registry: Record<string, Tree<string>> = {};
  for (let i = 0; i < relations.length; i++) {
    const [parent, child] = relations[i];
    let childNode = registry[child];
    if (!childNode) {
      childNode = {value: child, children: [], parent: null};
      registry[child] = childNode;
    } else delete potentialRoot[child];
    let parentNode = registry[parent];
    if (!parentNode) {
      parentNode = {value: parent, children: [], parent: null};
      registry[parent] = parentNode;
      potentialRoot[parent] = true;
    }
    parentNode.children.push(childNode);
    childNode.parent = parentNode;
  }
  const roots = Object.keys(potentialRoot);
  if (roots.length !== 1) throw new Error(`No unique root found ${roots}`);
  return [registry[roots[0]], registry] as any;
})();

const part1 = (): number => {
  const count = (tree: Tree<string>, level: number = 1): number =>
    tree.children.reduce((a, n) => a + count(n, level + 1), 0) + tree.children.length * level;
  return count(root);
};

const part2 = (): number => {
  const from = registry['YOU'].parent;
  const to = registry['SAN'].parent;
  const getParents = (node: Tree<string>): Tree<string>[] => node.parent ? getParents(node.parent).concat(node.parent) : [];
  const parentsFrom = getParents(from);
  const parentsTo = getParents(to);
  const distanceFrom: Record<string, number> = Object.fromEntries(parentsFrom.map((n, i, a) => [n.value, a.length - i]))
  const distanceTo: Record<string, number> = Object.fromEntries(parentsTo.map((n, i, a) => [n.value, a.length - i]))
  const common = parentsFrom.slice().reverse().find(n => distanceTo[n.value]).value;
  return distanceFrom[common] + distanceTo[common];
};

console.log(part1());
console.log(part2());