const fs = require('fs');

const lines = fs.readFileSync('aoc2020-16.txt', 'utf-8').split(/\r?\n/);

const data = lines.reduce(({state, zones, ticket, nearby}, line) => {
    if (line === '') {
        return {state, zones, ticket, nearby};
    }
    if (line.startsWith('your ticket:')) {
        state = 1;
        return {state, zones, ticket, nearby};
    }
    if (line.startsWith('nearby tickets:')) {
        state = 2;
        return {state, zones, ticket, nearby};
    }
    switch (state) {
        case 0:
            const [_, zone, r1, r2, r3, r4] = line.match(/([^:]*): (\d*)-(\d*) or (\d*)-(\d*)/);
            zones[zone] = [+r1, +r2, +r3, +r4];
            break;
        case 1:
            ticket.push(...line.split(',').map(x => +x));
            break;
        case 2:
            nearby.push(line.split(',').map(x => +x));
            break;
    }
    return {state, zones, ticket, nearby};
}, {state: 0, zones: {}, ticket: [], nearby: []})

const part1 = () => {
    const zones = Object.values(data.zones);
    return data.nearby.reduce((ss, nn) => ss+ nn.reduce((s, n) => s + (zones.some(([a,b,c,d]) => (a <= n && n <= b) || (c <= n && n <= d)) ? 0 : n), 0), 0);
};

function fromEntries(x) {
    const result = {};
    for (const [k, v] of x) {
        result[k] = v;
    }
    return result;
}

const part2 = () => {
    const zonesValues = Object.values(data.zones);
    const zoneEntries = Object.entries(data.zones);
    const nearby = data.nearby.filter(nn => nn.every(n => zonesValues.some(([a,b,c,d]) => (a <= n && n <= b) || (c <= n && n <= d))));
    const possibilities = nearby[0].map(_ => fromEntries(zoneEntries.map(([k, _v]) => ([k, true]))));
    nearby.forEach(nn => nn.forEach((n, i) => zoneEntries.forEach(([zone, [a, b, c, d]]) => {
        if (!((a <= n && n <= b) || (c <= n && n <= d))) {
            delete possibilities[i][zone];
        }
    })));
    const found = {};
    for (;;) {
        const posEntries = possibilities.map(x => Object.keys(x));
        if (posEntries.every(p => p.length === 1)) break;

        posEntries.forEach((p,i) => {
            if (p.length === 1 && !found[p[0]]) {
                const key = p[0];
                found[key] = true;
                possibilities.forEach((q, j) => {
                    if (i !== j) delete q[key];
                })
            }
        })

    }
    const posEntry = possibilities.map(x => Object.keys(x)[0]);
    return posEntry.reduce((r, k, i) => r * (k.startsWith('departure') ? data.ticket[i] : 1), 1);
}

console.log(part1());
console.log(part2());
