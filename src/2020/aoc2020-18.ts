export {};
import fs from 'fs';

const lines: string[] = fs.readFileSync(__filename.replace(/\.[jt]s$/, '.txt'), 'utf-8').split(/\r?\n/g);

let ADDITION_PRECEDENCE = false;

function evaluate(expression: string): number {
  // NB eval is evil !!! let's be smarter
  const tokens = getTokens(expression);
  const tree = buildTree(tokens);
  return calculateTree(tree);
}

type TOKEN = number | string;

type TREE =
  | number
  | {
      left: TREE;
      right: TREE;
      operation: string;
    };

function getTokens(expression: string): TOKEN[] {
  const regex = new RegExp('[+-]?\\d+|[()+/*-]', 'g');
  const tokens = [];
  let match;

  while ((match = regex.exec(expression)) !== null) {
    tokens.push(match[0].match(/[+-]?\d+/) ? +match[0] : match[0]);
  }
  return tokens;
}

function getOperand(tokens: TOKEN[], startOperandPos: number): [number, TREE] {
  let endOperationPos = startOperandPos + 1;
  let subtree: TREE;
  if (tokens[startOperandPos] === '(') {
    const closingParensPos = findMatchingClosingParens(tokens, startOperandPos);
    subtree = buildTree(tokens.slice(startOperandPos + 1, closingParensPos));
    endOperationPos = closingParensPos + 1;
  } else {
    console.assert(typeof tokens[startOperandPos] === 'number', `Token ${tokens[startOperandPos]} should be a number`);
    subtree = tokens[startOperandPos] as number;
  }
  return [endOperationPos, subtree];
}

function findMatchingClosingParens(tokens: TOKEN[], start: number) {
  let nestLevel = 1;
  let endPos = start;
  while (nestLevel > 0 && endPos < tokens.length) {
    endPos++;
    if (tokens[endPos] === '(') nestLevel++;
    else if (tokens[endPos] === ')') nestLevel--;
  }
  if (endPos >= tokens.length) throw 'Invalid expression: unmatched parenthesis';
  return endPos;
}

function buildTree(tokens: TOKEN[]): TREE {
  let tree: TREE = { left: null, right: null, operation: null };
  let previousTree = null;
  let operationPos;
  let operandPos = 0;
  [operationPos, tree.left] = getOperand(tokens, operandPos);
  if (operationPos >= tokens.length) return tree.left; // already end, return left subtree
  while (true) {
    if ('+*/-'.indexOf(tokens[operationPos] as string) >= 0) {
      tree.operation = tokens[operationPos] as string;
      operandPos = operationPos + 1;
    } else {
      // missing operation => defaulting to multiplication
      tree.operation = '*';
      operandPos = operationPos;
    }
    [operationPos, tree.right] = getOperand(tokens, operandPos);

    if (ADDITION_PRECEDENCE) {
      if (
        (tree.operation === '+' || tree.operation === '-') &&
        previousTree &&
        (previousTree.operation === '*' || previousTree.operation === '/')
      ) {
        previousTree.right = { left: previousTree.right, right: tree.right, operation: tree.operation };
        tree = previousTree;
      }
    }
    if (operationPos >= tokens.length) break;
    previousTree = tree;
    tree = { left: tree, right: null, operation: null };
  }
  return tree;
}

function calculateTree(tree: TREE): number {
  if (typeof tree === 'number') return tree;
  const left = calculateTree(tree.left);
  const operation = tree.operation;
  const right = calculateTree(tree.right);
  switch (operation) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      return left / right;
  }
  return 0;
}

function part1() {
  ADDITION_PRECEDENCE = false;
  return lines.reduce((s, l) => s + evaluate(l), 0);
}

function part2() {
  ADDITION_PRECEDENCE = true;
  return lines.reduce((s, l) => s + evaluate(l), 0);
}

console.log(part1());
console.log(part2());
