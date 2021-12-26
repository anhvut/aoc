const [cardPublicKey,doorPublicKey] = [19241437, 17346587];

const transform = (sn, endFct) => {
  let value = 1, loopSize;
  for (loopSize = 0; !endFct(loopSize, value); loopSize++) value = (value * sn) % 20201227;
  return {loopSize, value};
}

const findLoopSize = (key) => transform(7, (i, value) => value === key).loopSize;
const computeEncryptionKey = (loopSize, sn) => transform(sn, i => i === loopSize).value;

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