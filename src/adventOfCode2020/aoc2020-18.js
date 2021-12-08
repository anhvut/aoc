const fs = require('fs');

const lines = fs.readFileSync('aoc2020-18.txt', 'utf-8').split(/\r?\n/);

let ADDITION_PRECEDENCE = false;

function evaluate(expression) {    // NB eval is evil !!! let's be smarter
    let tokens = getTokens(expression);
    let tree = buildTree(tokens);
    return calculateTree(tree);
}

function getTokens(expression) {
    let regex = new RegExp('[+-]?\\d+|[()+/*-]', 'g');
    let tokens = [];
    let match;

    while ((match = regex.exec(expression)) !== null) {
        tokens.push(match[0].match(/[+-]?\d+/) ? +match[0] : match[0]);
    }
    return tokens;
}

function getOperand(tokens, startOperandPos) {
    let endOperationPos = startOperandPos + 1;
    let subtree;
    if (tokens[startOperandPos] === '(') {
        let closingParensPos = findMatchingClosingParens(tokens, startOperandPos);
        subtree = buildTree(tokens.slice(startOperandPos + 1, closingParensPos));
        endOperationPos = closingParensPos + 1;
    } else {
        console.assert(typeof tokens[startOperandPos] === 'number', `Token ${tokens[startOperandPos]} should be a number`);
        subtree = tokens[startOperandPos];
    }
    return [endOperationPos, subtree];
}

function findMatchingClosingParens(tokens, start) {
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

function buildTree(tokens) {
    let tree = {left: null, right: null, operation: null};
    let previousTree = null;
    let operationPos;
    let operandPos = 0;
    [operationPos, tree.left] = getOperand(tokens, operandPos);
    if (operationPos >= tokens.length) return tree.left;   // already end, return left subtree
    while (true) {
        if ('+*/-'.indexOf(tokens[operationPos]) >= 0) {
            tree.operation = tokens[operationPos];
            operandPos = operationPos + 1;
        } else {      // missing operation => defaulting to multiplication
            tree.operation = '*';
            operandPos = operationPos;
        }
        [operationPos , tree.right] = getOperand(tokens, operandPos);

        if (ADDITION_PRECEDENCE) {
            if ((tree.operation === '+' || tree.operation === '-') && previousTree && (previousTree.operation === '*' || previousTree.operation === '/')) {
                previousTree.right = {left: previousTree.right, right: tree.right, operation: tree.operation};
                tree = previousTree;
            }
        }
        if (operationPos >= tokens.length) break;
        previousTree = tree;
        tree = {left: tree, right: null, operation: null};
    }
    return tree;
}

function calculateTree(tree) {
    if (typeof tree === 'number') return tree;
    let left = calculateTree(tree.left);
    let operation = tree.operation;
    let right = calculateTree(tree.right);
    switch (operation) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': return left / right;
    }
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
