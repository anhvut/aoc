import * as console from 'console';
import {keyBy, product} from '../util';

enum KIND {
  BROADCAST,
  FLIP_FLOP, // %
  CONJONCTION // &
}

type ENTRY = {
  name: string;
  kind: KIND;
  destinations: Array<string>;
};

const parse = (input: Array<string>): Array<ENTRY> => {
  return input.map((line) => {
    const [a, b] = line.split(' -> ');
    const kind: KIND = a.startsWith('%') ? KIND.FLIP_FLOP : a.startsWith('&') ? KIND.CONJONCTION : KIND.BROADCAST;
    const name = a.replace(/[%&]/g, '');
    const destinations = b.split(', ');
    return {name, kind, destinations};
  });
};

enum FlipFlopState {
  OFF,
  ON
}

enum Pulse {
  LOW,
  HIGH
}

class Controller {
  button: Button;
  broadcaster: Broadcaster;
  flipFlops: Array<FlipFlop>;
  conjonctions: Array<Conjonction>;
  moduleByName: Record<string, Module>;
  queue: Array<[string, string, Pulse]>;
  counter: Record<Pulse, number>;

  constructor(entries: Array<ENTRY>) {
    this.queue = [];
    this.resetCounter();
    this.flipFlops = entries.filter(({kind}) => kind === KIND.FLIP_FLOP).map(({name, destinations}) => new FlipFlop(name, this, destinations));
    this.conjonctions = entries
      .filter(({kind}) => kind === KIND.CONJONCTION)
      .map(
        ({name, destinations}) =>
          new Conjonction(
            name,
            this,
            destinations,
            entries.filter(({destinations}) => destinations.includes(name)).map((x) => x.name)
          )
      );
    this.broadcaster = new Broadcaster('broadcaster', this, entries.find((x) => x.name === 'broadcaster').destinations);
    this.button = new Button('button', this);

    this.moduleByName = {
      button: this.button,
      broadcaster: this.broadcaster,
      ...keyBy(this.flipFlops, 'name'),
      ...keyBy(this.conjonctions, 'name')
    };
    for (const name of entries.flatMap(x => x.destinations))
      if (!this.moduleByName[name]) this.moduleByName[name] = new UntypedModule(name, this);
  }

  resetCounter() {
    this.counter = {[Pulse.LOW]: 0, [Pulse.HIGH]: 0};
  }

  pushButton() {
    this.button.receivePulse(Pulse.LOW);
    while (this.queue.length > 0) {
      const [source, destination, pulse] = this.queue.shift()!;
      // console.log(`${source} sends ${Pulse[pulse]} to ${destination}`);
      this.counter[pulse]++;
      this.moduleByName[source].lastPulse = pulse;
      this.moduleByName[destination].receivePulse(pulse);
    }
  }

  sendPulse(source: string, destination: string, pulse: Pulse) {
    this.queue.push([source, destination, pulse]);
  }

  getLastPulse(moduleName: string): Pulse {
    return this.moduleByName[moduleName].lastPulse;
  }
}

abstract class Module {
  lastPulse: Pulse;
  protected constructor(readonly name: string, readonly controller: Controller) {
    this.lastPulse = Pulse.LOW;
  }

  abstract receivePulse(pulse: Pulse): void;
}

class UntypedModule extends Module {
  constructor(readonly name: string, readonly controller: Controller) {
    super(name, controller);
    this.lastPulse = Pulse.LOW;
  }

  receivePulse(pulse: Pulse) {
    this.lastPulse = pulse;
  }
}

class FlipFlop extends Module {
  constructor(readonly name: string, readonly controller: Controller, readonly destinations: Array<string>, public state = FlipFlopState.OFF) {
    super(name, controller);
  }

  receivePulse(pulse: Pulse) {
    if (pulse === Pulse.LOW) {
      this.state = 1 - this.state;
      let pulseToSend = this.state ? Pulse.HIGH : Pulse.LOW;
      for (const destination of this.destinations) this.controller.sendPulse(this.name, destination, pulseToSend);
    }
  }
}

class Conjonction extends Module {
  constructor(readonly name: string, readonly controller: Controller, readonly destinations: Array<string>, readonly inputs: Array<string>) {
    super(name, controller);
  }

  receivePulse(_pulse: Pulse) {
    const inputValues = this.inputs.map((input) => this.controller.getLastPulse(input));
    const pulseToSend = inputValues.every((x) => x === Pulse.HIGH) ? Pulse.LOW : Pulse.HIGH;
    for (const destination of this.destinations) this.controller.sendPulse(this.name, destination, pulseToSend);
  }
}

class Broadcaster extends Module {
  constructor(readonly name: string, readonly controller: Controller, readonly destinations: Array<string>) {
    super(name, controller);
  }

  receivePulse(pulse: Pulse) {
    for (const destination of this.destinations) this.controller.sendPulse(this.name, destination, pulse);
  }
}

class Button extends Module {
  constructor(readonly name: string, readonly controller: Controller) {
    super(name, controller);
  }

  receivePulse(pulse: Pulse) {
    this.controller.sendPulse(this.name, 'broadcaster', pulse);
  }
}

const part1 = (input: Array<string>, count = 1000) => {
  const controller = new Controller(parse(input));
  for (let i = 0; i < count; i++) controller.pushButton();
  return controller.counter[Pulse.LOW] * controller.counter[Pulse.HIGH];
};

const findPeriod = (ts: Array<number>) => {
  for (let period = 2; period < ts.length; period++) {
    let isPeriod = true;
    for (let i = 0; i < period; i++) {
      for (let j = i + period; j < ts.length; j += period) {
        if (ts[i] !== ts[j]) {
          isPeriod = false;
          break;
        }
      }
      if (!isPeriod) break;
    }
    if (isPeriod) return period;
  }
  return 0;
}

const part2 = (input: Array<string>) => {
  /*
  rx receives low from hf
  => hf inputs ['nd', 'pc', 'vd', 'tx'] must be all high
  => ['nd', 'pc', 'vd', 'tx'] inputs ['bd', 'bp', 'pm', 'xn'] must be all low
  => ['bd', 'bp', 'pm', 'xn'] inputs Array(33) [cp, cn, dn, ...] must be all high
  => they are all periodical and their period is a prime number => LCM is multiplication of periods
  */
  const entries = parse(input);
  const controller = new Controller(entries);
  const rxInput = entries.filter(x => x.destinations.includes('rx'));
  const conjunctions = rxInput.map(x => controller.moduleByName[x.name] as Conjonction);
  const parentConjunctions = conjunctions.flatMap(x => x.inputs).map(x => controller.moduleByName[x] as Conjonction);
  const parent2Conjunctions = parentConjunctions.flatMap(x => x.inputs).map(x => controller.moduleByName[x] as Conjonction);
  const flipFlopNames = parent2Conjunctions.flatMap(x => x.inputs);
  const flipFlops = flipFlopNames.map(x => controller.moduleByName[x]);

  const timeSeries = Object.fromEntries(flipFlopNames.map(x => [x, []]))
  for (let i = 0; i < 10000; i++) {
    controller.pushButton();
    for (const c of flipFlops) timeSeries[c.name].push(c.lastPulse);
  }
  const periods: Record<number, boolean> = {};
  for (const key of flipFlopNames) periods[findPeriod(timeSeries[key])] = true;

  return product(Object.keys(periods).map(x => +x));
};

const runs = [1, 1, 1, 1];

const inputSample = `
broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a
`
  .trim()
  .split('\n');

const inputSample2 = `
broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output
`
  .trim()
  .split('\n');

const inputReal = `
%cf -> tz
%kr -> xn, gq
%cp -> sq, bd
broadcaster -> vn, sj, tg, kn
%hc -> pm
%fd -> xn, mj
%qz -> xf
%vf -> mc, pm
%zm -> rz, pm
%cn -> bd, qz
%jj -> bp
%ks -> ff
%nb -> xn, ks
%bm -> pm, vf
&xn -> kc, jb, cb, tg, ks, tx
%lm -> rk
%dn -> bd, cn
%ft -> dn
%pn -> pm, ll
%rk -> bp, fs
%tz -> bp, gp
%mc -> jx
%fs -> kx
%jf -> bd, fm
%rz -> hc, pm
%tg -> cb, xn
&hf -> rx
%vp -> pn
&pm -> ll, mc, sj, vd, vp
%rn -> kc, xn
%vn -> bd, cp
&nd -> hf
%fm -> bd, gc
%ff -> xn, fd
&bp -> cf, fh, pc, kn, fs, gn, lm
&pc -> hf
%mj -> xn
%qg -> bd
%fh -> lm
%kc -> nb
%xf -> bd, jf
%gc -> qg, bd
&bd -> vn, sq, qz, ft, nd
%jb -> kr
%gp -> bp, rp
%gq -> xn, rn
%sj -> pm, bm
%rp -> bp, jj
%sq -> ft
%cb -> jb
&vd -> hf
%gn -> cf
%kx -> gn, bp
%ll -> zm
&tx -> hf
%jx -> md, pm
%md -> pm, vp
%kn -> fh, bp
`
  .trim()
  .split('\n');

let runIndex = 0;
if (runs[runIndex++]) console.log('part1 sample', part1(inputSample, 1));
if (runs[runIndex++]) console.log('part1 sample2', part1(inputSample2, 1000));
if (runs[runIndex++]) console.log('part1 real', part1(inputReal, 1000));
if (runs[runIndex++]) console.log('part2 real', part2(inputReal));
