export {};
const input = 784235916;

const cups0 = Array.from(input.toString(10)).map((x) => +x);

const decrement = (current: number, max: number) => {
  let next = current - 1;
  if (next === 0) next = max;
  return next;
};

const run = (startCups: number[], steps = 100, max = 9) => {
  const cups = startCups.slice();
  for (let i = 0; i < steps; i++) {
    const current = cups.shift();
    const forbidden = cups.splice(0, 3);
    let next = current;
    do next = decrement(next, max);
    while (forbidden.includes(next));
    const nextPosition = cups.findIndex((s) => s === next);
    cups.splice(nextPosition + 1, 0, ...forbidden);
    cups.push(current);
  }
  return cups;
};

const part1 = () => {
  const cups = run(cups0, 100);
  const onePosition = cups.findIndex((x) => x === 1);
  const moved = cups.splice(0, onePosition + 1);
  moved.pop();
  cups.push(...moved);
  return cups.join('');
};

type ENTRY<T> = {
  value: T;
  next: ENTRY<T>;
  prev: ENTRY<T>;
};

class LinkedHashedList<T extends string | number> {
  _dictionary: Record<T, ENTRY<T>>;
  _head: ENTRY<T>;
  _tail: ENTRY<T>;

  constructor(input: T[]) {
    this._dictionary = {} as Record<T, ENTRY<T>>;
    this._head = null;
    this._tail = null;
    this.pushList(input ?? []);
  }

  pushList(array: T[]) {
    const length = array.length;
    if (length === 0) return;
    let prev = this._tail;
    let startIndex = 0;
    if (!this._head) {
      startIndex++;
      this._head = { value: array[0], next: null, prev: null };
      this._dictionary[this._head.value] = this._head;
      prev = this._head;
    }
    let current;
    for (let i = startIndex; i < length; i++) {
      const value = array[i];
      current = { value, next: null, prev };
      this._dictionary[value] = current;
      prev.next = current;
      prev = current;
    }
    this._tail = current;
  }

  pushElement(item: T) {
    this.pushList([item]);
  }

  reindex() {
    this._dictionary = {} as Record<T, ENTRY<T>>;
    let current = this._head;
    while (current) {
      this._dictionary[current.value] = current;
      current = current.next;
    }
  }

  shift() {
    const result = this._head?.value;
    this._head = this._head?.next;
    if (result != null) delete this._dictionary[result];
    return result;
  }

  removeFirst(n: number) {
    const result = [];
    for (let i = 0; i < n; i++) {
      result.push(this.shift());
    }
    return result;
  }

  insertAfter(existingValue: T, array: T[]) {
    if (!array?.length) return;
    const node = this._dictionary[existingValue];
    if (!node) throw new Error(`Element ${existingValue} not found`);
    const endLinks = node.next;
    let prev = node;
    let current;
    for (const value of array) {
      current = { value, next: null, prev };
      this._dictionary[value] = current;
      prev.next = current;
      prev = current;
    }
    current.next = endLinks;
    if (!endLinks) this._tail = current;
  }

  toArray() {
    const result = [];
    let current = this._head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }

  nextCircularNode(node: ENTRY<T>) {
    const next = node.next;
    return next ? next : this._head;
  }
}

// /!\ mute cups
const runLinked = (cups: LinkedHashedList<number>, steps = 100, max = 9) => {
  for (let i = 0; i < steps; i++) {
    const current = cups.shift();
    const forbidden = cups.removeFirst(3);
    let next = current;
    do next = decrement(next, max);
    while (forbidden.includes(next));
    cups.insertAfter(next, forbidden);
    cups.pushElement(current);
  }
  return cups;
};

const part1Linked = () => {
  const cups = new LinkedHashedList(cups0);
  runLinked(cups, 100);
  let node = cups.nextCircularNode(cups._dictionary[1]);
  const result = [];
  while (node.value !== 1) {
    result.push(node.value);
    node = cups.nextCircularNode(node);
  }
  return result.join('');
};

const part2 = () => {
  const cups = new LinkedHashedList(cups0);
  for (let i = 10; i <= 1_000_000; i++) cups.pushElement(i);
  runLinked(cups, 10_000_000, 1_000_000);
  const nextNode = cups.nextCircularNode(cups._dictionary[1]);
  const nextNextNode = cups.nextCircularNode(nextNode);
  return nextNode.value * nextNextNode.value;
};

console.time('Part 1 naive');
console.log(part1());
console.timeEnd('Part 1 naive');
console.time('Part 1 with linked list');
console.log(part1Linked());
console.timeEnd('Part 1 with linked list');
console.time('Part 2');
console.log(part2());
console.timeEnd('Part 2');
