const fs = require('fs');

const lines = fs.readFileSync(__dirname + '/aoc2021-03.txt', 'utf-8').split(/\r?\n/);

const getCounts = (lines) => {
    const counts = Array(lines[0].length).fill(0);
    lines.forEach(l => Array.from(l).forEach((c, i) => counts[i] += c === '1'));
    return counts;
}

const part1 = (lines) => {
    const counts = getCounts(lines);
    const b1 = parseInt(counts.map(x => x * 2 >= lines.length ? '1' : '0').join(''), 2);
    const b0 = parseInt(counts.map(x => x * 2 < lines.length ? '1' : '0').join(''), 2);
    return b0 * b1;
}

const getRemaining = (lines, fct, i = 0) => {
    if (lines.length < 2 || i >= lines[0].length) {
        return lines[0];
    }
    const counts = getCounts(lines);
    const toKeep = fct(counts[i] * 2, lines.length) ? '1' : '0';
    return getRemaining(lines.filter(x => x[i] === toKeep), fct, i + 1);
}

const part2 = (lines) => {
    const b1 = getRemaining(lines, (a, b) => a >= b);
    const b0 = getRemaining(lines, (a, b) => a < b);
    return parseInt(b1, 2) * parseInt(b0, 2);
}

console.log(part1(lines));
console.log(part2(lines));
