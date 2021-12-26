const fs = require('fs');

const lines = fs.readFileSync('aoc2020-19.txt', 'utf-8').split(/\r?\n/);

const data = lines.reduce(({state, candidates, rules}, line) => {
    if (line === '') {
        return {state: 1, candidates, rules};
    }
    switch (state) {
        case 0:
            const [_, nb, rule] = line.match(/^(\d*): (.*)$/);
            const letterMatch = rule.match(/"(.)"/);
            if (letterMatch) {
                rules[+nb] = letterMatch[1];
            } else {
                rules[+nb] = rule.split('|').map(y => y.split(' ').filter(x => x !== '').map(x => +x));
            }
            break;
        case 1:
            candidates.push(line);
            break;
    }
    return {state, candidates, rules};
}, {state: 0, candidates: [], rules: []});

const cache = [];
const mix = (arr, n, prefix, acc) => {
    if  (n === arr.length - 1) {
        for (const p of arr[n]) {
            acc.push(prefix + p);
        }
    } else {
        for (const p of arr[n]) {
            const newPrefix = prefix + p;
            mix(arr, n + 1, newPrefix, acc);
        }
    }
    return acc;
};
const fill = (n) => {
    if (cache[n]) {
        return cache[n];
    }
    const rule = data.rules[n];
    let result;
    if (Array.isArray(rule)) {
        result = rule.flatMap(r => {
            const tokens = r.map(rr => fill(rr));
            const acc = [];
            return mix(tokens, 0, '', acc);
        });
    } else {
        result = [rule];
    }
    cache[n] = result;
    return cache[n];
};
fill(0);

const part1 = () => {
    const valid = cache[0].reduce((agg, a) => {agg[a] = 1; return agg}, {});
    return data.candidates.reduce((n, c) => n + (valid[c] || 0), 0);
};

const part2 = () => {
    const valid42 = cache[42].reduce((agg, a) => {agg[a] = 1; return agg}, {});
    const valid31 = cache[31].reduce((agg, a) => {agg[a] = 1; return agg}, {});

    const isValid = (c) => {
        if (c.length % 8 !== 0) return 0;
        const nbParts = c.length / 8;
        const parts = Array(nbParts).fill(0).map((_, i) => c.slice(i*8, (i+1)*8));
        let nb42 = 0, nb31 = 0;
        for (let i = 0; i < nbParts; i++) {
            if (valid42[parts[i]]) nb42++;
            else break;
        }
        for (let i = nbParts - 1; i >= 0; i--) {
            if (valid31[parts[i]]) nb31++;
            else break;
        }
        if (nb42 === nbParts) nb42--;
        if (nb42 + nb31 > nbParts) nb31 = nbParts - nb42;
        return (nb42 + nb31 === nbParts) && nb42 > nb31;
    };

    return data.candidates.reduce((n, c) => n + (isValid(c) ? 1 : 0), 0);
}

console.log(part1());
console.log(part2());

/*
0: 8 11
8: 42 | 42 8
11: 42 31 | 42 11 31

=> 0: (42)n (42)m (31)m

=> 0: (42)n+m (31)m where n >= 1, n >= 1
=> 0: (42)a (31)b where a > b >= 1
*/