export {};

const [cardPublicKey, doorPublicKey] = [19241437, 17346587];

const transform = (sn: number, endFct: (i: number, value: number) => boolean) => {
  let value = 1,
    loopSize;
  for (loopSize = 0; !endFct(loopSize, value); loopSize++) value = (value * sn) % 20201227;
  return { loopSize, value };
};

const findLoopSize = (key: number) => transform(7, (_i: number, value: number) => value === key).loopSize;
const computeEncryptionKey = (loopSize: number, sn: number) => transform(sn, (i: number) => i === loopSize).value;

const part = () => {
  const cardLoopSize = findLoopSize(cardPublicKey);
  const doorLoopSize = findLoopSize(doorPublicKey);
  console.log('card loop size', cardLoopSize, 'door loop size', doorLoopSize);
  const cardCompute = computeEncryptionKey(cardLoopSize, doorPublicKey);
  const doorCompute = computeEncryptionKey(doorLoopSize, cardPublicKey);
  if (cardCompute !== doorCompute) throw Error(`Not same encryption key ${cardCompute} vs ${doorCompute}`);
  return cardCompute;
};

console.log(part());
