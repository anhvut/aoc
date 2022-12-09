export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

type TREE = {
  left?: TREE | number;
  right?: TREE | number;
  parent: TREE;
  level: number;
};

type TREE_SCALAR = {
  left: number;
  right: number;
  [p: string]: unknown;
};

const trees: TREE[] = lines.map((line) => {
  type ARRAY = [number | ARRAY, number | ARRAY];
  const arrays = JSON.parse(line) as ARRAY;
  const toTree = (a: ARRAY, level: number, parent: TREE): TREE => {
    const [left, right] = a;
    const r: TREE = { parent, level };
    r.left = typeof left === 'number' ? left : toTree(left, level + 1, r);
    r.right = typeof right === 'number' ? right : toTree(right, level + 1, r);
    return r;
  };
  return toTree(arrays, 1, null);
});

function* findNodes(tree: TREE, fct: (t: TREE) => boolean): Generator<TREE> {
  if (typeof tree.left === 'object') yield* findNodes(tree.left, fct);
  if (fct(tree)) yield tree;
  if (typeof tree.right === 'object') yield* findNodes(tree.right, fct);
}

function muteTree(tree: TREE, fct: (t: TREE) => void) {
  if (typeof tree.left === 'object') muteTree(tree.left, fct);
  fct(tree);
  if (typeof tree.right === 'object') muteTree(tree.right, fct);
}

function appendTree(a: TREE, b: TREE) {
  const r: TREE = {
    left: a,
    right: b,
    parent: null,
    level: 1,
  };
  a.parent = r;
  b.parent = r;
  muteTree(a, (r) => r.level++);
  muteTree(b, (r) => r.level++);
  return r;
}

type SIDE = 'left' | 'right';

function getPrevNode(n: TREE): [TREE, SIDE] {
  let last;
  do {
    last = n;
    n = n.parent;
  } while (n?.left === last);
  if (!n) return [null, null];
  if (typeof n.left === 'number') return [n, 'left'];
  n = n.left;
  while (typeof n.right === 'object') n = n.right;
  return [n, 'right'];
}

function getNextNode(n: TREE): [TREE, SIDE] {
  let last;
  do {
    last = n;
    n = n.parent;
  } while (n?.right === last);
  if (!n) return [null, null];
  if (typeof n.right === 'number') return [n, 'right'];
  n = n.right;
  while (typeof n.left === 'object') n = n.left;
  return [n, 'left'];
}

function explode(r: TREE) {
  for (const explodeNode of findNodes(
    r,
    (x) => x.level > 4 && typeof x.left === 'number' && typeof x.right === 'number'
  )) {
    const [prevNode, prevNodeSide] = getPrevNode(explodeNode);
    const [nextNode, nextNodeSide] = getNextNode(explodeNode);
    const { parent } = explodeNode;
    if (explodeNode === parent?.left) {
      parent.left = 0;
    } else if (explodeNode === parent?.right) {
      parent.right = 0;
    }
    if (prevNode) {
      (prevNode as TREE_SCALAR)[prevNodeSide] += explodeNode.left as number;
    }
    if (nextNode) {
      (nextNode as TREE_SCALAR)[nextNodeSide] += explodeNode.right as number;
    }
  }
}

function split(r: TREE) {
  let muted = false;
  const splitNode = (n: TREE, nb: number) => {
    muted = true;
    return {
      parent: n,
      level: n.level + 1,
      left: Math.floor(nb / 2),
      right: Math.ceil(nb / 2),
    };
  };
  muteTree(r, (n) => {
    if (!muted && n.left >= 10) n.left = splitNode(n, n.left as number);
    if (!muted && n.right >= 10) n.right = splitNode(n, n.right as number);
  });
  return muted;
}

function reduceTree(tree: TREE, fct: (a: number, b: number) => number): number {
  const left = typeof tree.left === 'number' ? tree.left : reduceTree(tree.left, fct);
  const right = typeof tree.right === 'number' ? tree.right : reduceTree(tree.right, fct);
  return fct(left, right);
}

function cloneTree(tree: TREE) {
  const result = { ...tree };
  if (typeof tree.left === 'object') {
    result.left = cloneTree(tree.left);
    result.left.parent = result;
  }
  if (typeof tree.right === 'object') {
    result.right = cloneTree(tree.right);
    result.right.parent = result;
  }
  return result;
}

const part1 = (trees: TREE[]) => {
  const resultTree = trees.reduce((a, b) => {
    const aa = cloneTree(a);
    const bb = cloneTree(b);
    const r = appendTree(aa, bb);
    let muted;
    do {
      explode(r);
      muted = split(r);
    } while (muted);
    return r;
  });
  // console.log(JSON.stringify(resultTree, ['left', 'right'], 2));console.log('');
  return reduceTree(resultTree, (left, right) => left * 3 + right * 2);
};

const part2 = () => {
  let result = 0;
  for (let i = 0; i < trees.length; i++) {
    const a = cloneTree(trees[i]);
    for (let j = 0; j < trees.length; j++) {
      if (i === j) continue;
      const b = cloneTree(trees[j]);
      result = Math.max(result, part1([a, b]), part1([b, a]));
    }
  }
  return result;
};

console.log(part1(trees));
console.log(part2());
