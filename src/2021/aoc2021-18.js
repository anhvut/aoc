const fs = require('fs')

const lines = fs.readFileSync(__dirname + '/aoc2021-18.txt', 'utf-8').split(/\r?\n/);

const trees = lines.map(line => {
  const arrays = JSON.parse(line);
  const toTree = (a, level, parent) => {
    const [left, right] = a;
    const r = {parent, level};
    r.left = isFinite(left) ? left : toTree(left, level + 1, r);
    r.right = isFinite(right) ? right : toTree(right, level + 1, r);
    return r;
  }
  return toTree(arrays, 1, null);
});

function *findNodes(tree, fct) {
  if (!isFinite(tree.left)) yield *findNodes(tree.left, fct);
  if (fct(tree)) yield tree;
  if (!isFinite(tree.right)) yield *findNodes(tree.right, fct);
}

function muteTree(tree, fct) {
  if (!isFinite(tree.left)) muteTree(tree.left, fct);
  fct(tree);
  if (!isFinite(tree.right)) muteTree(tree.right, fct);
}

function appendTree(a, b) {
  const r = {
    left: a,
    right: b,
    parent: null,
    level: 1
  };
  a.parent = r;
  b.parent = r;
  muteTree(a, r => r.level++);
  muteTree(b, r => r.level++);
  return r;
}

function getPrevNode(n) {
  let last;
  do {
    last = n;
    n = n.parent;
  } while (n?.left === last);
  if (!n) return [null, null];
  if (isFinite(n.left)) return [n, 'left'];
  n = n.left;
  while (!isFinite(n.right)) n = n.right;
  return [n, 'right'];
}

function getNextNode(n) {
  let last;
  do {
    last = n;
    n = n.parent;
  } while (n?.right === last);
  if (!n) return [null, null];
  if (isFinite(n.right)) return [n, 'right'];
  n = n.right;
  while (!isFinite(n.left)) n = n.left;
  return [n, 'left'];
}

function explode(r) {
  for (const explodeNode of findNodes(r, x => x.level > 4 && isFinite(x.left) && isFinite(x.right))) {
    const [prevNode, prevNodeSide] = getPrevNode(explodeNode);
    const [nextNode, nextNodeSide] = getNextNode(explodeNode);
    const {parent} = explodeNode;
    if (explodeNode === parent?.left) {
      parent.left = 0;
    } else if (explodeNode === parent?.right) {
      parent.right = 0;
    }
    if (prevNode) {
      prevNode[prevNodeSide] += explodeNode.left;
    }
    if (nextNode) {
      nextNode[nextNodeSide] += explodeNode.right;
    }
  }
}

function split(r) {
  let muted = false;
  const splitNode = (n, nb) => {
    muted = true;
    return {
      parent: n,
      level: n.level + 1,
      left: Math.floor(nb / 2),
      right: Math.ceil(nb / 2)
    };
  };
  muteTree(r, n => {
    if (!muted && n.left >= 10) n.left = splitNode(n, n.left);
    if (!muted && n.right >= 10) n.right = splitNode(n, n.right);
  });
  return muted;
}

function reduceTree(tree, fct) {
  const left = isFinite(tree.left) ? tree.left : reduceTree(tree.left, fct);
  const right = isFinite(tree.right) ? tree.right : reduceTree(tree.right, fct);
  return fct(left, right);
}

function cloneTree(tree) {
  const result = {...tree};
  if (!isFinite(tree.left)) {
    result.left = cloneTree(tree.left);
    result.left.parent = result;
  }
  if (!isFinite(tree.right)) {
    result.right = cloneTree(tree.right);
    result.right.parent = result;
  }
  return result;
}

const part1 = (trees) => {
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
  return reduceTree(resultTree, (left, right) => left*3 + right*2);
}

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
}

console.log(part1(trees));
console.log(part2());