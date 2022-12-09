export {};

const input =
  '620D7B005DF2549DF6D51466E599E2BF1F60016A3F980293FFC16E802B325332544017CC951E3801A19A3C98A7FF5141004A48627F21A400C0C9344EBA4D9345D987A8393D43D000172329802F3F5DE753D56AB76009080350CE3B44810076274468946009E002AD2D9936CF8C4E2C472400732699E531EDDE0A4401F9CB9D7802F339DE253B00CCE77894EC084027D4EFFD006C00D50001098B708A340803118E0CC5C200A1E691E691E78EA719A642D400A913120098216D80292B08104DE598803A3B00465E7B8738812F3DC39C46965F82E60087802335CF4BFE219BA34CEC56C002EB9695BDAE573C1C87F2B49A3380273709D5327A1498C4F6968004EC3007E1844289240086C4D8D5174C01B8271CA2A880473F19F5024A5F1892EF4AA279007332980CA0090252919DEFA52978ED80804CA100622D463860200FC608FB0BC401888B09E2A1005B725FA25580213C392D69F9A1401891CD617EAF4A65F27BC5E6008580233405340D2BBD7B66A60094A2FE004D93F99B0CF5A52FF3994630086609A75B271DA457080307B005A68A6665F3F92E7A17010011966A350C92AA1CBD52A4E996293BEF5CBFC3480085994095007009A6A76DF136194E27CE34980212B0E6B3940B004C0010A8631E20D0803F0F21AC2020085B401694DA4491840D201237C0130004222BC3F8C2200DC7686B14A67432E0063801AC05C3080146005101362E0071010EC403E19801000340A801A002A118012C0200B006AC4015088018000B398019399C2FC432013E3003551006E304108AA000844718B51165F35FA89802F22D3801374CE3C3B2B8B5B7DDC11CC011C0090A6E92BF5226E92BF5327F3FD48750036898CC7DD9A14238DD373C6E70FBCA0096536673DC9C7770D98EE19A67308154B7BB799FC8CE61EE017CFDE2933FBE954C69864D1E5A1BCEC38C0179E5E98280';

function toBinary(s: string) {
  return Array.from(s)
    .map((x) => ('000' + parseInt(x, 16).toString(2)).slice(-4))
    .join('');
}

type PACKET = {
  v: number;
  t: number;
  literal?: number;
  L?: number;
  L2?: number;
  subPacket?: string;
  subs?: PACKET[];
  totalLength: number;
};

function decodePacket(input: string): PACKET {
  const v = parseInt(input.slice(0, 3), 2);
  const t = parseInt(input.slice(3, 6), 2);
  if (t === 4) {
    // literal
    let pos = 6;
    let first;
    let literal = 0;
    do {
      first = parseInt(input.slice(pos, pos + 1), 2);
      literal = literal * 16 + parseInt(input.slice(pos + 1, pos + 5), 2);
      pos += 5;
    } while (first === 1);
    return { v, t, literal, totalLength: pos };
  } else {
    const i = parseInt(input.slice(6, 7), 2);
    if (i === 0) {
      // next 15 bits = length of subPacket
      const L = parseInt(input.slice(7, 22), 2);
      const totalLength = 22 + L;
      const subPacket = input.slice(22, totalLength);
      const subs = [];
      let pos = 0;
      do {
        const sub = decodePacket(subPacket.slice(pos));
        subs.push(sub);
        pos += sub.totalLength;
      } while (pos < subPacket.length);
      return { v, t, L, subPacket, subs, totalLength };
    } else {
      const L2 = parseInt(input.slice(7, 18), 2);
      const subPacket = input.slice(18);
      let pos = 0;
      const subs = [];
      for (let subPacketNumber = 0; subPacketNumber < L2; subPacketNumber++) {
        const sub = decodePacket(subPacket.slice(pos));
        subs.push(sub);
        pos += sub.totalLength;
      }
      return { v, t, L2, subPacket, subs, totalLength: pos + 18 };
    }
  }
}

function decodeHex(input: string) {
  const bin = toBinary(input);
  return decodePacket(bin);
}

function countVersion(packet: PACKET): number {
  return (packet.subs ?? []).reduce((a, p) => a + countVersion(p), packet.v);
}

const part1 = (input: string) => {
  const packet = decodeHex(input);
  return countVersion(packet);
};

function applyOperator(packet: PACKET): number {
  switch (packet.t) {
    case 0:
      return packet.subs.reduce((a, p) => a + applyOperator(p), 0);
    case 1:
      return packet.subs.reduce((a, p) => a * applyOperator(p), 1);
    case 2:
      return packet.subs.reduce((a, p) => Math.min(a, applyOperator(p)), Infinity);
    case 3:
      return packet.subs.reduce((a, p) => Math.max(a, applyOperator(p)), -Infinity);
    case 4:
      return packet.literal;
    case 5:
      return Number(applyOperator(packet.subs[0]) > applyOperator(packet.subs[1]));
    case 6:
      return Number(applyOperator(packet.subs[0]) < applyOperator(packet.subs[1]));
    case 7:
      return Number(applyOperator(packet.subs[0]) === applyOperator(packet.subs[1]));
  }
  return 0;
}

const part2 = (input: string) => {
  const packet = decodeHex(input);
  return applyOperator(packet);
};

console.log(part1(input));
console.log(part2(input));
