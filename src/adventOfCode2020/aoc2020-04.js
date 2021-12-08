const fs = require('fs');

const lines = fs.readFileSync('aoc2020-04.txt', 'utf-8').split(/\r?\n/);

const fields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'/*, 'cid'*/];

const passes = lines.reduce((all, line) => {
    if (line.length < 2) {
        all.push({});
        return all;
    }
    const current = all[all.length - 1];
    line.split(' ').forEach(token => {
        const [key, value]  = token.split(':');
        current[key] = value;
    });
    return all;
}, [{}]);

function part1() {
    console.log(passes.reduce((r, pass) => r + fields.every(f => !!pass[f]), 0));
}

function part2() {
    const between = (a, b, c) => a <= b && b <= c;
    const validFct = {
        'byr': x => between(1920, +x, 2002),
        'iyr': x => between(2010, +x, 2020),
        'eyr': x => between(2020, +x, 2030),
        'hgt': x => (x && x.endsWith('cm') && between(150, +x.slice(0, -2), 193)) || (x && x.endsWith('in') && between(59, +x.slice(0, -2), 76)),
        'hcl': x => x && x.match(/^#[0-9,a-f]{6}$/),
        'ecl': x => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(x),
        'pid': x => x && x.match(/^[0-9]{9}$/),
        'cid': _ => true
    }
    console.log(passes.reduce((r, pass) => r + fields.every(f => !!validFct[f](pass[f])), 0));
}

part1();
part2();
