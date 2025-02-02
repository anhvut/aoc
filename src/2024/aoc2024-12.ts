import {consoleTimeit, deserializePoint, POINT, serializePoint} from '../util';
import {groupBy, sum} from 'es-toolkit';

type Group = {
  label: string;
  area: number;
  perimeter: number;
  sides?: number;
};

const compute =
  (computeSides = false) =>
  (input: string[]) => {
    const width = input[0].length;
    const height = input.length;
    const grid = input.map((r) => Array.from(r));

    const globalVisited = grid.map((r) => Array(r.length).fill(false));
    const groups: Group[] = [];

    for (let sy = 0; sy < height; sy++) {
      for (let sx = 0; sx < width; sx++) {
        if (!globalVisited[sy][sx]) {
          const label = grid[sy][sx];
          const visitedCells = {[serializePoint([sx, sy])]: true};
          const visitedEdges = {};
          let toVisit = [[sx, sy]];
          do {
            const nextVisit = [];
            for (const [x, y] of toVisit) {
              const xy = serializePoint([x, y]);
              globalVisited[y][x] = true;
              const down = serializePoint([x, y + 1]);
              const right = serializePoint([x + 1, y]);

              // count edges for perimeter - if 2 connected cells have common cell, edge is not counted
              for (const key of [`${xy}U`, `${xy}L`, `${down}U`, `${right}L`]) {
                if (!visitedEdges[key]) visitedEdges[key] = true;
                else delete visitedEdges[key];
              }

              for (const [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
                const nx = x + dx;
                const ny = y + dy;
                const nxy = serializePoint([nx, ny]);
                if (!visitedCells[nxy] && grid[ny]?.[nx] === label) {
                  visitedCells[nxy] = true;
                  nextVisit.push([nx, ny]);
                }
              }
            }
            toVisit = nextVisit;
          } while (toVisit.length > 0);
          // console.log(`Added `, groups.at(-1))
          let sides = 0;
          if (computeSides) {
            const horizVert = groupBy(Object.keys(visitedEdges), x => x.at(-1));
            const horizByY: Record<any, POINT[]> = groupBy(horizVert['U'].map((x) => x.slice(0, -1)).map(deserializePoint as any) as POINT[], (p) => p[1]);
            const vertByX: Record<any,POINT[]> = groupBy(horizVert['L'].map((x) => x.slice(0, -1)).map(deserializePoint as any) as POINT[], (p) => p[0]);
            for (const cells of Object.values(horizByY)) {
              sides += cells.sort((a, b) => a[0] - b[0]).filter(([cx, cy], i) => {
                if (i === 0) return true; // first cell
                const [px, py] = cells[i - 1];
                if (px !== cx - 1) return true; // not continuous
                const prevIsAbove = grid[py - 1]?.[px] === label;
                const currIsAbove = grid[cy - 1]?.[cx] === label;
                return prevIsAbove !== currIsAbove;
              }).length;
            }
            for (const cells of Object.values(vertByX)) {
              sides += cells.sort((a, b) => a[1] - b[1]).filter(([cx, cy], i) => {
                if (i === 0) return true; // first cell
                const [px, py] = cells[i - 1];
                if (py !== cy - 1) return true; // not continuous
                const prevIsLeft = grid[py]?.[px - 1] === label;
                const currIsLeft = grid[cy]?.[cx - 1] === label;
                return prevIsLeft !== currIsLeft;
              }).length;
            }
          }
          groups.push({label, area: Object.values(visitedCells).length, perimeter: Object.values(visitedEdges).length, sides});
        }
      }
    }
    if (computeSides) return sum(groups.map((g) => g.area * g.sides));
    else return sum(groups.map((g) => g.area * g.perimeter));
  };

const part1 = compute();
const part2 = compute(true);

// noinspection SpellCheckingInspection
const inputSample = `
AAAA
BBCD
BBCC
EEEC
`
  .trim()
  .split('\n');

// noinspection SpellCheckingInspection
const inputSample2 = `
OOOOO
OXOXO
OOOOO
OXOXO
OOOOO
`
  .trim()
  .split('\n');

// noinspection SpellCheckingInspection
const inputSample3 = `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`
  .trim()
  .split('\n');

// noinspection SpellCheckingInspection
const inputSample4 = `
EEEEE
EXXXX
EEEEE
EXXXX
EEEEE
`
  .trim()
  .split('\n');

// noinspection SpellCheckingInspection
const inputSample5 = `
AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA
`
  .trim()
  .split('\n');

// noinspection SpellCheckingInspection
const inputReal = `
XXXYYIYYYYRRRRRRRRRRRRJJJJJJJJBBBBBBBYYYYYYYYYYYYYEEEEERRRRRRCCCCCCCCCCCCCCCCCAAAAAAAAAAAAGGGGGGGGGGGGGGDDDHHHHHHHHHGRGFFGGVGGMMMMBBBBBBBBBB
XYXYYYYYYYRRRRRRRRRRRRRRJJJJJJBBBBBBBBYYBYYYYYYYYYYEEEEEERRRRRCCCCCCCCCCCCCCAAAAAAAAAAAAAAGGGGGGGGGGGGGGDDDDHHHHHHGGGRGFGGGGGMGMBMBBBBBBBBBB
XYYYYYYYYYYRRRRRRRRRRRRJJJJJJBBBBBBBBBYYBBYYYYYYYYYYEEAAARRRRCCCCCCCCCCCCCCCAAAAAAAAAAAAAGGGGGGGGGGGGGGGIDDDHHHHGGGGGGGGGGGGGGGGBBBBBBBBBBBB
IKKYYIYYYYRRRRRRRRRRRRRJJJJJJBBBBBBBBBBBBBBYYYYYYYYEEEEAARRRRRCCCCCCCCCCCCCCCCAAAAAAAAAAAGGGGGGGGGGGIIIIIDDIHHHGGGGGGGGGGGGGGGGGBBBBBBBBBBBB
IIKKIIYYYYYRRRRRRRQRRRJJJJJJJBBBBBBBBBBBBBBBYYYYYYYEEEERRRRRRCCCCCCCCVCCCVVICCAAAAAAAAAAAGGGGGGGGGGIIIIIIIIIIIHHGGGGGGGGGGGGGGGGBBBBBBBBBBBB
IIKKIIYYYYYYRRRRRRRRJJJFFJJJJJJBBBBBBBBBVVBBYYYYYYYEEERRRRRRCCCCCCCCCVVCCVVVVAAAAAAAAAAAAAGGGNGGGGGGIIIIIIIIIIHGGGGGGGGGGGGGGGGBBBBBBBBBBBBB
IIIIIIYYYYYYYRRRRRJJJJJFFFFJLJJJJBBBBBBBBVBBYYYYYYYYEERRRRRRRCCCCCCCPPVVNVVVWAAAAAAAAAAAAAGGGGGGGNGGGIIIIIIIIHHGGGGGGGGGGGGGGGBBBBBBWBBBBBBB
IIIIIIIYYYYYYYRRRRJJFFFFFFLLLJJJJJBBBBBBBBGGGYYYYYYYGGRRRRRRRRCICCVVPVVVVVVVVAAAAAAAAAAAAAAGGGGGGNNNNNIIIIIIIIHHHGGGFEEEGGGGGGJJBBBWWBBBBJBB
IIIIIYIYYYYYYYRRGRJFFFFFFFLSLLLLJJBBBBBGBBBGGGYYYYYYGGRRRRRRRRRICCFVVVVVVVVVAAAAAAAAAAAAAYAYYYYNUNNNNNIMIIIIIIIIHHHGFFFEEGGGGGJJJJJSSBBBBBIB
IIIIIYYYYYYYYYGRGRJFFFFFFLLLLLLLLJSSSFBGBBBGGGYYYYYGGGFRRRRBRRRRRVVVVVVVVVVVAAAAAAAAAAAAYYYYYYNNNNNNNNIIIBIIIIIHHHHFFEEEGGGEJJJJJSSSMMSBBMSS
IIIIIIYYYYYYYYYRGRFFFFFFLLLLLLLLSSSSSSGGGGGGGGYYGYGGGGGGRWRRRRRRRVVVVVVVVVVVVVAAMAAAAAAAAYYYYYNNNNNNNNNIIIIIIIIHHHHFFFEEEEGEJJJJJSSSSSSSSSSS
IIIIIIYYYYYYYTYRFFFFFFFFFFFLLLLRRRSSSSGGGGGGYYYYGGGGGGGGGRRRRRRRVVVVVVVVVVVVGGAAAAYAAAAAAYYYYYNNNNNNNNNNNIIIIIOHHHHFFEEEEEEEJJJJJJSUSSSSSSSS
IIIIIIIYYYYYYTTTFFFFFFFFFFFLLRLRRRJSSSGGGGGGGYGGGGGGGGGGAAARRRRRRVVVVVVVVVVIYYYYYYYAYYYAAYYYYNNNNNNNNNNNNIIIIIHHFHFFFEEEEEEEETJJJJSUTSSSSSSS
IIIIIIIYYYYYYYTTFFFFFFFFFFFLFRRRRJJSGGGGGGGGXGGGGGGGGGGGAAAAARRVVVVVVVVVVVVIYYYYYYYYYYYYYYYYYNNNNNNNNNNNNIIIFFFFFFFFEEEEEEEETTTTTTTUTSSSSSSS
IIIIIIIIYYYYYTTTFFFFFFFFFFFFFFRRRRJGGGGGGGGXXXXGGGGGGGGGAAAAQQQQQQQGGEEVVVVVYYOYYYYYYYYYYYYYYYNNNNNNNNNNNNNIFNNNFFFVVGGEEEEETTTTTTTTTTTSSSSS
IIIIIIIIYYYYYTTTFFFFFFFFFFFFFJJJJJJJGGGGGXXXXXXXGGGGGGGGGAAQQQQQQQQGGEEAVVVVVOOOYYYYYYYYYYYYEYEEANNNNNNNNNNNNNNNFFFVVVGEEEEEEETTTTTTPTSSSSSS
IIIIIIIIYYYTTTFFFFFQQFFFFFFFJJJJJJGGGGGXXXXXXXXGGGGGGGGDQQQQQQQQQQQQQEEEEOOOOOOYYYYYYYYYYYYYEEEEESNNNNNNNNNNNNNNFFFVVVVVVEEEEKTVTTTTTTSSSSSS
IIIIIIIYYYYYYYQQIFSQQFFFFFFJJJJJJJJGGGGGXXXXXXXGGGGGGGGDMQQQQQQQQQQQEEEEEOOOOOOOOYYYYYYYEEEEEEEEEENNNNNNNNNNNNNNFFFVVVVVVVDEEVQVTTTTSSSSSSSS
IIIIIIYYYYKYQZQQQQQQQQQFFJJJJJJJJJJJJGGGXXXXXXXGGGSSSSGDDQQQQQQQQQQEEEEEEOOOOOOYYYMMMEEEEEEEEEEEEEFFFNNNNNNNNNNFFFVVVVVVVVVRRVVVTTTTTXSXXXXS
IIIIUUUYUQQQQQQQQQQQQQFFJJJJJJJJJJJJJGGJXXXXXXXGGGGGDDDDDQQQQQQQQQLVEEEEEOOOOJJJYYYMMEEEEEEEEEEEEEFFFFFFFNNNNFFFFVVVVVVVVVVVVVVVTTDTXXXXXXXX
IIUUUUUYUUQQQQQQQQQQQFFFJFJYYJYJJJJJJJJJJXXXXXXGGGGGDDDDDDQQQQQQQLLEEEEEEEOOOJJJZZZMMEEEEEEEEEEEEEEEEFFFFFNNFFFFFVFVVVVVVVVVVVVVTTDXXXXXXXXX
IIUUUUUUUFIIIQQQQQQQQQFFFFPYYYYJJJJJJJJJJVXNNNNNGGGCDDDDDDLDDWWWQLLEEEEEEEOOOOJZZZZMMMEEEEEEEEEEEEEEIZZZZFNFFFFFFFFFVVVVVVVVVVVVQXXXXXXXXXXX
IUUUUUUUUFFIIIQQQQQQQQQFFYYYYYYJJJJJJJJJJVDDNNNNGGTCDDDDDDDDDDWQQLLLLEEEEEOOOOOKKZZZMMEEEEEEEEEEEEEWZZZZZFFFFFFFGFFFFVVVVVVVVVVVXXXXXXXXXXXX
UUUUUUUUFFIIIIIQQQQQQQIFFFYYYYZJJJJJJJJJZDDDDNDNNCCCDDDDDDDWWWWWWLLLLLFEEEZZZOZZZZMMMMMEMEEEEEEEIIEWZZZZZZFFFFFGGFFFVVVVVVVVVVVVXXXXXXXXXXXX
UUUUUUUUUFIIIQQQQQQQIIIIIIIYYYZZJZJJJJJJZDDDDDDCCCCCCDDDDDWWWXXXWLLLLLFFEEZZZZZZZZZMMMMMMELEEEEIIIZZZZZZZZFFFFFFGGGGVVVVVVVVVVVVXXXXXXXXXXXX
UUUUUUUUBBBIIQQQQTTTIIIIIIIYYYZZJZJJJJJZZZDDDDDDDCCCCCDDDDDWXXXXLLLLLLLFXXZZZZZZZZZMMMMMMEEEEEEIIIZZZZZZZZZZZZGGGGGGVVVVVVVVVVVVXXXXXXXXXXXX
UUUUUUUUBBBBBLQQQTTTTIIIIIYYYYYZZZZZJJJZZZDDDDDDDCCCCCDCDDDDXXXXLLLLLLLFXXXZZZZZZZZMMMMMMEEEEEEIIZZZZZZZZZZZZZJJGGGGGVVVVVVVVVVMMXXXXXXXXXXX
UUUUUUUUUUBBBBQQWTTWTIJIIYYYYYYZZLZZJJZZZZDDDDDDDDCCCCCCCDDDXXXXXLLLLLLFXZZZZZZZZZZMMMMMMMMEEEIIIZZZZZZZZZZZZZJJJJGGJVVHUVVVVVVMMXXXXXXXXXXX
UUUUUUUUUHBBBBJWWWTWWIJJIYYYYYYZZZZZZZZZZZDDDDDDDDCCCCCCCCDDXXXXXXXLLLXXXXXZZZZPPPPPPPPPPPPPPIIIIIIZZZZZZZZZZJJJJJJJJVJUUVVVVMMMMXXXXXXXXXXX
UUUUUUUUUHHHOWWWWWWWJJJJJJYYYYYZZZZZZZZZZZDDDDDCCCCCCCCCCCDDXXXXXXXLXXXXXXXXZZZPPPPPPPPPPPPPPMIIIEEAZZZZZZZZZZZZJJJJJJJUUMMMMMMMXXXMMXXXXXXX
UUUUUUUUUHHHWWWWWWWWWWJJJJJYYYZZZZZZZZZZDDDDDDDCCKCCCCCCCCDDXXXXXXXXXXXXXXXXZZZPPPPPPPPPPPPPPPPPPPPPPZZZZZZZZZZZJJJJUUUUUMMMMMMMMMMMMMMMXMME
UUUUUUUUHHHHWWWWWWWWWEEEEEEEEYPZZZZZZZZZDDDDDDDDDDCCCCCCCCDDXXXXXXXXXXXXXXXXXZZPPPPPPPPPPPPPPPPPPPPPPZZZZZZZZZZZJJJJUUUUUUMMMMMMMMMMMMMMMMMM
BUUUUUUUUHHHWWWWWWWWEEEEEEEEPPPZZZZZZZZZZDDDDDDDDDDCMMMCJMMDMXXXXXXXXXXXXXXXEZZPPPPPPPPPPPPPPPPPPPPPPEEEZZZZZZZZJJJUUUUUUUMMMMMMMMMMMMMMMMMF
BBBUUUUUUHHHWWHWWDWWEEEEEEEEPPPZZZZZZZZZDDDDDDDDDDDMMMMMMMMDMMXXXXXXXCXXXXXXEZZPPPPPPPPPPPPPPPPPPPPPPEEEZZZZZZZZZZJJUUUUUWMMMMMMMMMMMEEMMMMF
BBBGTBBBBBBBBHHWDDEWEEEEEEEEPPPZZZZZZZVVDDDDDDDDDDMMMMMMMMMMMMXXXXXCXCCCCXXXEZZPPPPPPPPPPPPPPEEEEEEEEEEEEESZZZZZZZJJJUUUUWMMMMMMMMMMMEEEMMMF
GGGGGBBBBBBBBHLWDDEWEEEEEEEEPZZZZZZZZIDDDDDDDDDDDMMMMMMMMMMEMYYYXXXCCCCCCXCZZZZPPPPPPPPPPPPPPPEEEEEEEEEEESSSZZZZZJJJJUUUUWWWMMMMMXXXEEEEEEEF
GGGGGBBBBBBBBHHDDEEEEEEEEEEEEZZZZZZZZZCCDDDDDDDDMMMMMMMMMMMEYYXXXXXCCCCCCCCCZZWPPPPPPPPPPPPPPPEEEEEEEEEESSOOOZZJJJJJJJUUUUMMMMMMXXXXEEEEAAAA
GGGGGBBBBBBBBHEEEEEEEEEEEEEEDDDDZZZZZZCCCCDDDDDDDMMLLMDMMMJYYYYJJXXCCCCCCCWWWWWWWZZPPPPPPPPPPPEEEEEEEEEEESOOIIJJJJJJJJUUJUMMMMMMXXXXXEEEEEEA
GGGGGBBBBBBBBEEEEEEEEEEEEEDDDDDDZZZZZICCCCCFDDDFDMLLLLMMMJJJJJJJJXXCCCCCWWWWWWWWZZZPPPPPPPPPPPMMEEEEEEESSSOOIIIJJJRJJJJJJJMMVMMXXXXXEEEEEEAA
GGGGGBBBBBBBBREEEEEEEEEEEEDDDDDDZZCCCCCCCCCFFSSFMMLLLLLMMMMMJJJJJXXCCCCCCWWWWQQQQQZPPPPPPPPPPPZZZEEESSSSOOOOOOOJJJRJJJJJJJVVVVMXXXXEEEEEEEAA
GGGGGGGGBBBBCRREEEEEEEDDEEDDDDDDDZZOCCCCCCCFFFFFMMLLLFMMMMKKJJJJJCCCCCCCCWWWQQQQQQZPPPPPPPPPPPZZZZSSSSSOOOOOOOOOJJRRJJJJJVVVVVVVVXEEEEEEEEEA
GGGGGGAABBBBRRRRRRRRDDDDDDDDDDDDDCCCCCCCCCCFFFFFFFFFFFJMMMKKKKJJJJCCCCCCWWQQQQQQQQQPPPPPPPPPPPZZVVVVSSOOOOOOOORRRRRRRRJJJVVVVVVVVBEEEEEEEEAA
GGGAAAAABBBBRRRRRRDDDDDDDDDDDDDDDCCCCCCCCCCCCFFFFFFFFQQQMKKKJJJJJJJJCCCCWQQQQQQQQQQZZZZZZZZPPPZZTVVSSOOOOOOOOORRRRRRRRJJJVAAVVVVVBEEEEEEEEEA
GGAAAAAAAAAARRRRRDDDDDDDDDZZZZDZZZCCCCCCCCCCCFFFFFFQQQQQQKKKJJJJJJJJCWCWWQQQQQQQQQQQZQVVZZZPPPVVVVVOOOOOOOOOOORRRRRRRRRRJVVVVVVVVVMEEEEEEAAA
GGAAAAAAAARRRRRRRRDDDDDDDZZZZZZZZCCCZCCCCCCCCFFFFFFFQQQQQKKKJJJJJJJJWWWWHHQQQQQQQQQQQQQQZHQPPPZVVVVVKOOOOOOOOOORRRRRRRRRVVVVVVVVVVVVEEEEEAAA
GAAAAAAAAARRRRRRRRDDDDDDDZZZZZZZZZZZZCCCCCCCFFFFFFFFFQQQQQKKJWJJJJJJJWWHHHQQQQQQQQQQQQCQQQQQZGZQQVVVVOOOOOOOOOORRRRRRRRRVVVVVVVVVVVVVEEEAAAA
GAAAAAAAAARRRRRRRRDDDDDDZZZZZZZZZZZEZCCCCCCFFFFFFFFFFQQTTTWWZWJWJWJWWWWHHHQQQQQQQQQQQQCQQQQQZZZQVVVVVVOOOOOORRRRRRRRRRRVVVVVVVVVVVVAAAAEAAAA
GGAGAAAAAARRVVRRRRDDDDDDZZZZZZZZZZZECCBCCCCCFFFFFFFFJQQQWWWWWWWWWWWWWWWHHHHHQQQQQQQQQCCQQQQQQQQQQQVVVVVOOOORRRRRRRRRRRRRVVVVVVVVVVVAAAAAAAAA
GGGGAAAAAAAAAVRIDDDDDDDDZZZZZZZZZZZBQBBBCCFFFTFFSFFFJQKKKWWWWWWWWWWWWWHHHHBQQQQQQQQQQQQQQQQQQQQQQQQVVVVOOOOOOOORRRRRRRXRRRVVVVVVVVAAAAAAAAAA
GGWWAAAAAAAAAAIILDDDDDDDJZZZZZZZZZZBBBBBCCFFFFFFSEEEEEKKKKWWWWWWWWWWWHHHHHHQQQQQQQQQQQQQQQQQQQQQQQQQSVVOOIOIOOOWRRRRRRXRRVVVVVVVVVVAAAAAAAAA
WWWWAAAAAAAAAIIILLDDDDDAAXZZZZZZZZBBBBBBBCCCCFCCEEEEEKKKKKWWWWWWWWWWWHHHHHHHQQQQQQBQQQQQQQQQQQQQQQQQQVOOOIIIIOWWRUXXXRXRRVVVVVVVVVVVVAAAAAAA
WWWAAAAAAHAAAFFFFFFFFAAAAAZZZZZZZBBBBBCCCCCCCCCCEEEEEEKKKKWWKKRWWRRRHHHHHHHHQQQQQQBQQQQQQQQQQQQQQQQAQOOOOIIIOOWWWUXXXXXXXVVVVVVVVVVAAAAAAAAA
WWNNFAAAAHHHHFFFFFFFFAAAAAZZZZZZZBBBBBBCCCCCCCCCEEEEEEKEKKWKKKRRRRRRRPPCCHHCCCCCQBBBHHQQQQQQQQQQQQOODOOOOIIIWWWWWXXXXXXXXVVVVVVAAAAAAAAAAAAA
NNNNNAAAAXHHHFFFFFFFFAAAAAAZZZZZZZZZBBBCCCCCCCECZEEEEEEEKKKKKKRRRRRRRPPCCCCCCCCCCBBBHHHQQQQQQKQQQMOOOOOOOOWWWWWWWXXXXXXXXVVAAVVAAAAAALAAALLA
NNQNNAAAASSSSFFFFFFFFFFFFFAAAAZZZZBBBBBCCCCECEEEEEEEEEEEEKRRRRRRRRRRRPPCCCCCCCCCCBBBBHHHHHQQQQQMMMMMMOOOOWWWWWWWWXXXXXXXXXVAAAAAAAUALLAAALLL
NNNNNQNNNSSSIFFFFFFFFFFFFFAAAAZZZZZBBBBCCCCEEEEEEEEEEEEEEKRRRRRRRRRRRPPPCCCCCCCCCHBBHHJHJJJMQMMMMMMMMOOYOYWWWWWXXXXXXXXXXXAAAAAAAAALLLLLLLLL
NNNNNNNNNYFFFFFFFFFFFFFFFFAAAAZZZZBBLBBCCEEEEEEEEEEEEEEKKKRRRRRRRRRRQQQQQCCCCCCCHHBBHHJJJJMMMMMMMYYMMMYYYYYYWWWWXXXXXXXXXXAAAAAAAAALLLLLLLLL
NNNNNNNNNNFFFFFFFFFFFFFFFFAAAAAAAZZMLLMCCCEEEEEEEEEEEEEEKKRRRRRRRROOQQQQQCGCCCHHHHHHHHHJJJMMMMMMMYYYYYYYYYYYWWWWXXXXXXXXXLLLLLLLLLLLLLLLLLLL
NNNNNNNNNYFFFFFFFFFFFFFFFFAAAAAAAAAMMMMEEEEEEEEEEEEEEKKKKRRRRRRRRRQOQQQQQQGCCCCHHHHHHJHJJJMMMMMMMYYYYYYYYLLYJNWWWXXXXXXXXLLLLLLLLLLLLLLLLLLL
NNNNNNNNNNFFFFFFFFFFFFFFFFAAAAAAAIMMMMMMBEEPEEEEEEEEEEKKKKRRRRRRRXQQQQQQQGGCCCSSHHHHJJJJJJJMMMMMMMYYYYYYYYYNNNNWXXXXWXWWWLLLLLLLLLLLLLLLLLLL
OOONNNNNYYFFFFFFFFFFFFFFFFAAAAAMMMMMMMMMMBBBEEEEEEEEEEKKKKRRRRRQQQQQQQQQQCCCCCSSHHHHHJJJJJJJMMMMMMYYYYYYYYNNNNNWWWWXWWWWWLLLLLLLLLLLLLLLLLLL
OOONNNNYYYFFFFFFFFFFFFFFFFAMMMMMMMMMMMMMBBBBBEEBEEBEEEKKKKRRRRRRRRQOQQQQQQCCPCPSHHHHHJUJJJJJJMMMMMYYYYYYYYNNNNWWWWWWWWWWWLLLLLLLLLLLLLLLLRRL
OOOONNJJYYFFFFFFFFFFFFFFFFAMMMMMMMMMMMMMBBBBBBBBEBBBEEKKKKKRWWWRRRROOOSSSSCCPPPSSHHHHJJJJJJJJJMMMMMYFYYYYNNNNNNWWWWWWWWWWLLLLLLLLLLLLLLLRRRL
OOOONNNJJJDDDDDDFFFFFFFFFFFFFDDMMMMMMMMMMMBBBBBBEBEBEEKKKKWWWWWWOORROOSVSSPPPPSSSSSSSJVJJJSRRMMMMMMYYYYYNNNNNNNNNWWWWWWWWLLLLLLLLLLLLLLLRRHH
NNNNNNNDDDDDDDDDDDDDLLLLFFFFFDDMMMMMMMMMMMBBBBBBBBEEEEEKKWWWWWWWOOOOOOSSSSSPSSSSSYSSSVVJJJSRRRMRMRRNNNYNNNNNNNNNWWWWWWWNNLLLLLLLLLLLLLLHHHHH
NNNNNNNDDDDDDDDDDDDDDDDDFFFFFDDMMMMMMMMMMMMMMMMBBBBBBBEEKWWWWWWWOOOSSSSSSSSSSSSSSSKSSVVVJSSRRRRRRRRNNNNNNNNNNNNNWWWWWNWNNLLLLLLLLLLLLLHHHHJH
NNNNNNNDDDDDDDDDDDDDDDDDFFFFFDDRRMMMMMMMMMMMMMMBBBBBBBBEWWWWWWWWXXSSSSSSSSSSASSSSSSSSRRVVRRRRRRRRRRXNNNNNNNNNNNNWWWNNNNNNNNLLLLLLLLLLLHHHHJH
NNNNNJJJJJJJJJJJJDDDDDDDFFFFFDDRRMMMMMMXXXXXXMMMXXXBBBBBWWWWWCCWXXSSSSSSSSSSSSSSSSSSSRRVVRRRRRRRRRRRNNNNNNNNNNNNWWWWNNNNNNNLLLLLLNNNNNHHHHHN
NNNNJJJJJJJJJJJJJDDDDDDDFFFFFDDYRRMSMMMXXXXXXBMMCXXBXXBBWYWWWCCXXXCSSSSSSSSSUUUUUSSSSRRRRRRRRRRRRRRNNNNNNNNNNNNNWWWWNNNNNNNLLLLLLNNNNNNHHHHH
JJJJJJJJJJJJJJRJJDDDDFFFFFFFFDDYRRMMMMMXXXXXXXXXXXXBXXBXYYWWCCCXXXCCSSSSSSSSUUUUUSSSSRRRRRRRRRRRRRRNNNNNNNNNNNNWWWNNNNNNNNNLLLLLLPPPPPNNHHFH
JWWWWWWWWJJJJRRRJDDDDFFFFFFFFDDYRRRMMMMXXXXXXXXXXXXXXXXXXXCCCCCCXXXCSSSSSSSSUUUUUSSSSSRRRRRRRRRRRRNNNNNNNNNNNNNNNWWNONNNNNNLLLLLLPPQQHHHHHFF
JWWWWWWWWJJJRRRRRLYYYFFFFDDDDDDYRRRRRRXXXXXXXXXXXXXXXXXDXXCCCCCXXXCCCSSSSSSSUUUUUSSSSDKKKRRRRRRQRRRDNNNNNNNNNNNNWWWWNNNNNNNLLLLLLPPPQQFHHHHF
JJWWWWWWWWWJRRRRRRYYYFFFFFDDDDDRROOOOOOOOOXXXXXXXXXXXXXXXXCCCCXXXXCCCCSRRRSSUUUUUSSSSDKRRRRRRRRDDDDDDNNNNNNNNNNSWWSWNRNRNNNLLLLLLPPSFFFHFFFF
JWWWWWWWWWRRRRRRRRRRYFFFFFDDDDDYYOOOOOOOOOXXXXXXXXXXXXXXXXCCCCCCCCCCCCCFFRSKUUUUUDDDDDDDDRRRRRRDDDDDDDDDDDNNSSSSSSSSSRRRNNNNPPPPPPPSFFFHFFFF
JWWWWWWWWWRRRRRRRRRRYFFFFFDDDDDYROOOOOOOOOXXXXXXXXXXXXXCCCCCCCCCCCCFFFFFFRRSUUUUUDDDDDDDDDDDDRRDDDDDDDDDDDDDDDSSRRRRRRNNNNNWWPPPPPPPFFFFFFFF
WWWWWWWWRRRRRRRRRRRYYFFFFFDDDDDRROOOOOOOOOXXXXXXXXXXXXXXCCCCCCXCCCCFFFFFFRSSUUUUUMDDOIDDDDDDDDDDDDDDDDDDDDDDDDSSRRRRRRRNNNNWWWPTPPPPPFFFFFFF
WWWWWWWWWRRRRRRRRRRRYFFFFFDDDDDOROOOOOOOOOXEEVEXXXXXXXXXXCXXXXXXCCCFFFFFFFOSUUUUUMMDIIDDDDDDDDDDDDDDDDDDDDDDDDDPPPRRRRRRRRRTTTTTPPPPPFFFFFFF
XXWWWWWWWRRRRRRRRRRRYYFFFFDDDDDRROOOOOOOOOXEEVEEEXXXXXXXXCXXXXXCCCCCCFFFFFFGGGSSMMMDIIDDDDDDDDDDDDXDYYDDDDDDPPPPPPRRRRRRRRRTTTTTTPPPPFFFFEFF
XXWWWWWWWRIIRRRRRRRKJJFFFFFFFFORROOOOOOOOOXEEEEEEXXXXXXXXXXXXXXXXFCFFFFFFFFFGGGMMMMMIIIDIIDDIDDDDDDDYYDDDDYDPPPPPPRRRRRRRRRTTTTTTTPPEFFFEEEE
XWWWWWWWWIIRRRRRRRRROJFFFFFFFFOORRRRRRRREEEEEEEEEXXXXXXXXXXXXXXFFFFFFFFFFFFFFGMMMMMIIIIIIIDIIDDDDDDFYYYDDDYPPJPPPPRPPPRRRRRRRTTTTPPPEEFEEEEE
XXDDWWWWWWIRRRRRRRJJJJFFFFFFFFOOOOORRRRREEEEEEEEEEXXXXXXXXXXXXXXXFFFFFFFFFIGGGMMIIIIIIIIIIIIIIDDFFFFYYYYYYYYYJYPPPPPPPPRRRRTTTTTTTTEEEEEEEEE
DXDDDDWWWWIRRRRRSRJJJJFFFFFFFFOOOOOORRREEEEEEEEEEEHXHXXXXXXXXXXFFFFFFFFFFGGGGGMMIIIIIIIIIIIIIIKKFYYYYYYYYYYYYYYPPPPPPPRRRRTTTTTTTTTEEEEEEEEE
DDDDDDDWWWRRRRRRRRJJOOFFFFFFFFOOOOMMRKREEEEEEEEEEEEVVVXXXXXXXXXXFFFFFRRRRGGGGGMMMIIIIIIIIIIIIIIKKYYYYYYYYYYYYYPPPPPPPRRRRRRTTTTTTTTEEEEFEEFE
DDDDDDDWWWRRRRRRRRJJOOOOOOOOOOOOOOMMMEEEEEEEEEEEEVVVVIVXXXXXXXXXXXFFRRRRRRRRRXIIIIIIIIIIIIIIIKKKUYYYYYYYYYYYYYPPPIIORRRRRRRTTTTTTTEEGFFFFFFE
DDDDDDWWWWWRRRRRRJJJJJOOOOOOOOOOOOONNLLLWWEEEEEEEVVVVVVFXXXXXXXXXXRFRRRRRRRRRXIIIIIIIIIIIIIIIKKKKKYYYYYYYYYYYYYYOOOOORRRDRRDDTTTTTTGGPFFFFFF
DDDDDDDDWWWWWZZJJJJJJJJJOOOOOOOOOSONNWWWWWWEWEEVVVVVVFVFFFFXXXXXXXRRRRRRRRRRCRRIWIIIIIIIIIIIKKKKKKYYYYYYYYYYYYYYYGGORRRRDDDDDGGTGTTAGGFFFFFF
DDDDDDDDDWWZZZZZZJJJJJJJOOOOOOOONNNNNNNWNWWWWEVVVVVVVFFFFFFXXXXXXXRRRRRRRRRRRRREIIIEIIIIIIIIKKKKKBBYYYYYYYYYYYYRYSGSSSRDDDDDDGGGGGGGGGFFFFFF
DDDDDDDDDWZZZZZZZJJJJJJJJIOOOOOOOONNNNNNWWWWWWVVVVVVVFFFFFFFXXFXXXRRRRRRRRRRRREEEEEEIIIIIIKKKKKKKKYYHYYYYYYYYYHSSSSSSSSSDDDDDDGGGGGGGGFFFFFF
DDDDDDWWWWWWZZZZZZZJJJJJJIOOODOOOOOFNNNNWWWWWWVVVVVVVFFFFFFFFFFXOOOOOOOORRRRRRRREEEIIIIIIIIIKKKKKKYYHYYYYYYYYHHSHSSSSSSSFDDDDDDGGGGGFGFFFFFF
DDDDDDWWWZZZZZZZZZZZZJJJJIOOOOOFFOOFFNNNWWWWVWVVVVVVVFFFFFFFFFFXOOOOOOOORRRRRREEEEEEEIIIIIIKKKKKKKKKKYYYYYYYYHHHHSSSSSSSDDGDDSSGGGGGFFFFFFFF
DDDDDDDDWWZZZZZZZZZZZZZIIIOFFFFFFFFFFOOOWWWVVVVVVVVVVFFFFFFFOOOOOOOOOOOOROOORROOOOEEEEIIIIIKKKKKKKKKKYYYYYYYYYHYSSSSSSSSGGGDDNSGGGGGUUFFFFFF
DDDDDDDWWWZZZZZZZZZZZZBIIIOFFFFFFFOOOOOOZZVVVVVVVVVVVFFFFFFFOOOOOOOOOOOOROOOOOOOOOOEKEIKIIKKKKKKKKKKKYYKYYYYXYYYYSSSSSSGGGGGNNSGJJLLLLLFFFFF
DDDDDDDWWZZZZZZZZZBBBBBBBBBFFOOOOOOOOOOOVVVVVVVVVVVVFFFFFFFFOOOOOOOOOOOORQQQAOOOOOOOKKKKKKKKKKKKKKNKKKYNYYYXXYYYSSSSSSSGGGGGNNLLLLLLLLLFFFFN
DDDDDDWWWWWZGGGZZZBBBBBBBOBOOOOOOOOOOOOOOOVVVVVVVVVVFFFFFFFFOOOOOOOQQQQQQQQQAOOOOOOOKKKKKKKKKKKKNNNKKKKNNNNNXXYYXSSSSSSHGGGGNNNNLLLHLLLLGGFF
DDDDDDDWWWWWGGGZZZBBBBBBBOBOOOOOOOOOOOOOOVVVVVVVVVFFFTTFFFFFOOOOOOOQQQQQQQQQQOZOOOOOOKFKKKKKKKKKKKNNNNNNNNNNXXYEXXXXXSXHHHHGHNLLLLLLLLLLLLFF
DDDDDDDWWWWWWWGZBBBBBBBBBBBBBOOOOOOOOOOOOVVVVVVVVVVVVTTFFFFFOOOOOOOQQQQQQQQQQZZZOOOZOOKKKKKKKKKKKKNNNNNNNNXXNXXEEXXXXXXHHHHGHNNLLLLLLLLLBBBB
DDDDDDDDWWWWWWGGBBBBBBBBBBBBBBOOOOOOOOOOOVVVVVVVVVVKFFFFFFFFOOOOOOOQQQQQQQQQQZZZZZZZZOBKKYKKKKKKSKNNNNNNNNNNNXXXEEXXXXHHHHHHHHNNLLLLLLLRRBRB
DDUUDDDDWWWWWWGGNBBBBBBBBBBBBOOOOOOOOOOOKVVVVVVVVVKKKKALLLLLLAAAQQQQQQQQQQQQQZZZZZZZZUUYYYYKMMMKKKNNNNNNNNNNNXXXXXXXHHHHHHHHHNNNNLLLLLRRRRRR
NDDDDDDDWWWWWWWWBBBBBBBBBBBBBBBOOOOOOOOOKKVVVVVVVVKKKZFLLLLLLFHHQQQQQQQQQQQQQZZZZZUUUUYYYYYLMMLLNNNNNNNNNNNNXXXXXXXHHHHHHHHHNNNNNLNLRRRRRRRD
NDFFDDDDDWWWWWWMMBBBBBBBBRBBBBUOOOOOOOOOKKKKVVVVVKKKKKKLLLLLLFHHHQQQQQQQQQQQQZFFZZUUUULLLLYLLLLLLNNNNNNNNNNAXUXXXXXXXXHHHHHNNNNNNNNLRRRRRRDD
NDMFFDWWWWWMMMMMMMBBBMMBBBBGOOOOOOOOOOOOOKKKKKKVVVKKKKKLLLLLLLLHQQQQQQQQQQQQQQYFUUUUUUFLLLLLLLLLNNNNNNNNNUUUUUUUXXXXXXHHHHHHNNNNNNRLRRRRRRRD
MMMMFDWWWWWMMMMMMMXXMMMMBKMOOOOOOOOOOOOOOKKKKKKKKKLLLLLLLLLLLLLHQQQQQQQQQQQQUFFFFUUUUQQQLLLLLLLNNNNNNNNNNUUUUUUUUXXXXHHHWWWNNNNNNNRRRRRRRCDD
MMMMMWWWWWWWMMMMMMMMMMMMMMMEOOOOOOOKKKKKKKKKKKKKSSLLLLLLLLLLLLLHHHHQQQQQQQQQFFFFFFFFLQQBQQLLLLLLLLNNUNNUSUUUUUUUUUXXXHWWWWWNNNNNNNNRRRRRRCCD
MMMMMMWWWWMMMMMMMMMMMMMMMMMOOOOOXXOOOKKKKKKKKKKKSSLLLLLLLLLLLLLHHHHHQVQCFFQQQQFFFFFFFQQQQQLLLLLLLLNSSSSSSSUUUUPUUUXXXXWWWWWWWNNNNNNNRRRRRRCC
MMMMMMMMWWWWWMMMMMMMMMMMMMMMOOFOOVVOKKKKKYYYYYYYYYLLLLLLLLLLLLLHHHLLVVLLFFFFQFFFFFFUQQQQQQLLLLLLLLNSSSSSSSUUUUUUUUXXXWWWWWWWNNNNNNNNNNCRRCCC
MMMMMMMWWWWWWMMMMMMMMMMMMMMMMPPPPVVVKKKKKYYYYYYYYYLLLLLLLLLLLLLHLLLLLLLFFFFFFFFFFFFFQQQQQQQLLLPPLLGSSSSSSSUUUUUUUUVXXXXWWWWWNCNCNNNNCCCCCCCC
MMMMMMMMWWMMMMMMMMMMMMMMMMMMMMPPPVIUKKKKUYYYYYYYYYLLLLLLLLLLLLLLLLLLLLLFFFFFFFFFFFJJQQQQQQLPPPPPLLUSSSSSSSUUUUUUUUXXXXXZWWWNNCCCNCNCCCCCCCCC
MMMMMMMMMMSSSMMMMIIIIMMMMMMMMPPPPPUUUUUUUYYYYYYYYYLLLLLLLLLLLLLLLLLLLLLFFFFFFFFFFFQQQQQQQPPPPPPPUUUSSSSSSSUUUUUUGGXXGXZZZZZCCCCCCCNCCCCCCCCC
MMMMMMMMMMSSMMIIMIIIIMMMMPPMPPPPPUUUUUUUUYYYYYYYYYLLLLLLLLLLLLLLLLLLLLLLLFLFFFFFFQQQQQQQQPPPPPPPUUUSSSSSSSUUUUUGGGXTGGGGZZZZCCCCCCNCCCCCCCCC
MMMMMMMMMMSSMMIIIIIIIMSSSSSPPPPPPUUUUUUUKYYYYYYYYYLLLLLLLLLLLLLLLLLLLLLLLFLSSFFFQQQQQQBPQPPPPPPPPPPSSSSSSSUUVUGGGGGGGGGGGGZZCCCCCCCCCCCCCCCC
MMMMMMMMMMIIIIIIIIIIIMSSSSSSSSSSSSHUUUUUUYYYYYYYYYYYYYSSSSSLLLLLLLLLLLLLLLLSFFVFYYQQYYPPPPPPPPPPPPTUUUUUUUUUVUGGGGGGGGGGGGGZZCCCCCCCICCCCCCF
MMMMMMMMMTTIIIIIIIIIIISSSSSSSSSSSSUUUUUUUYYYYYYYYYYSSCSSSSSLLLLLLLLLLLLXLSSSDDFFYYQYYPPPPPPPPPPTTTTTVVUUUUUUVVGGGGGGGGGGSSGZCCCCCCCCCLCCCCCC
QMMMMMMMMMIIIIIIIIIIIISSSSSSSSSSSSUUUUUUUYYYYYYYYYYCCCCSSSSLLLLLLLLLLLLLSSSSSSFYYYYYPPPPPPPPPPTTTTTVVVUVVVVVVGGGGGGGGGGGGGGZCCCCCCCCCCCMYYYM
QMMMMMMMMMMIIIIIIIIIIISSSSSSSSSSSSUUUUUUUYYYYYYYYYYCCCCCSSSZSSSLLLNNNLLLNSSNSHHFFFFFFFFFPPPPPPTTTTTVVVVVQVVVVVGGRRGGGGGGGGCCCCCCCCCCCCMMMYMM
QMMMMMMMMMMMIIIIIIIIIISSSSSSSSSSSSWUUUUUUUUUUCCCSCCCCCCCSSZZSSSLLLNNLLNNNNNNYYYFFFFFFFFFPPPPPBTTTTTTTVQQQQQQVVVGRRRGGGGGGGGRCCCCCCCRCCJMMMMM
QQQMMQQQMMQQIIIGIIIIIISSSSSPPPPPPPWUUUUUUUUUUCXCCCCCCCCCCSSSSSSLLNNNLLNNNNNNNFFFFFFFFFFFPPPPTTTTTTTTTTIQQQQQQRGGRRRRRBBBBBBRRCCCCCCRRMMMMMMM
QQQQQQQQMQQRIIRGIIIIIISSSSSPPPPPPPPPUUUUUUWUCCXXXCCACCCCCCSSSSSLNNNNNNNNNNNNYFFFFFFFFFFFPTTTTTTTTTTTQQQQQQQQQRGGGGRRRBBBBBBRRCCCRMMRRRMMMMMM
QQQQQQQQQQQRRRRGIGGIIISSSSSPPPPPPPPPPLUUUUXXXXXXCCCACCSCSSSSSIIIIIIIIINNNNNYYFFFFFFFFFFFPTTTTTTTTTTTTTTQQQQQRRPPRRRRRBBBBBBRRCRRRMMRMRRRMMMM
QQQQQQQQQGGGGRRGGGGKKKKZJJPPPPPPPPCCPUUUUUXXXXXXXXCASSSSSSSSSIIIIIIIIINNEEEYYFFFFFFFFFFFTTTTTTTTTTTTTTPPQQQQRRPPNRRRRBBBBBBRRRRRRRMMMRRRRMMR
QQQQQQQQQGGGGGGGGGGKKKKZZZMMMPPPPDCCCUUUUUXXXXXXXXAAFFSSSKSSSIIIIIIIIINNNEEECFFFFFFFYNNNTTTTTTTTTTTTTTTPPPPPPPPPPPPRRBBBBBBRRRRRMMMMMMMRRRRR
PQQQQQQQQQQGGGGGGGGKKKZZZZZMMMPPRDCCCCCCUUMMXXXXXXAAAASSKKSSSIIIIIIIIINNEEEECFFFFFFFYNNNNNTTTTTTTTTXTTTTTPPPPPPPPPGRBBBBBBBBRRRRMMMMMMMRRRRR
QQQQQQQQQQQQQGGGGGGGKZZZZZZZMMMMDDDDDCDCDMMMMXXXRAAAAAKKKSSVVIIIIIIIIINEEEEEEFFFFFFFYSSSSBTTTTTTTTTXTTTPPPPPPPPPPPRRBBBBBBBBRRRMMMMMMMMMREER
DQQQQQQQQQQQGGGGGGGGGGZZZZZZMMMMDDDDDDDDDDMMMXXXXAAAAIIIIIIIIIIIIIIIIIEEEEEEEFFFFFFFYSSSTTTTTTTTXXTXPPTPPPPPPPPPPPPPBBBBBBBBRRMMMMMMMMMMRMEE
DQQQQQQQQQQGGGGGGGGGZZZZZZZZZMMMDDDDDDDDDDMMMMMXXAAAAIIIIIIIIIIIIIIIIIVVEEEEEFFFFFFFSSSSSTTTTTTTXXXXXPPPPPPPPPPPPPPPBBBBBBBBRRMMMMMMMMMMMMEE
DDDQQQQQQQQGGGGGGGGGZZZZZZZZPUMMDDDDDDDDDDDDMMMMXMMAAIIIIIIIIIIIIIIIIIVVEEEEIFFFFFFFSSSSSSTTTTXXXXXXPPWPPPPPPPPPXPYUBBBBBBBBMMMMMMMMMMMMMMEE
DDDQQQQQQGGGGGGGGGGGZZZZZZZPPUDDDDDDDDDDDDDDMMMMMMMAAIIIIIIIIIIIIIIIIIVVEEUESSSSSSSSSSSSSSTTKTXXXXXXXPWPPPPPPPPXXUUUUEEEEMMZMMMMMMMMMMMMEEEH
DDDQQQQQQQGGGGGGGGGGGGGZZZZUUUDDDDDDDDDDDDDDMMMMMMAAAIIIIIIIIIIIIIIIIIVVUEUUUSSSSSSSSSSSSSXXXXXXXXXXXXXXXEEPPXXXXUUUUEMMEMMZMMMMMMMMMMMEEEEH
DDDDCQCQQGGGGGGGGGGGLMZZZZZUUUUDUDDDDDDDDDDIIIIIIIIIAIIIIIIIIIIOVVVVVVVVUUUUUSSSSSSSSSSSSXXXXXXXXXXXXXLXEEEXXXXXXXUUMMMMMMMMMMMMMMMMMMMMEEHH
DDDCCCCCCBBBGGGLGGMSMMZZZZZUUUUUUUDDDDDDDHHIIIIIIIIIAIIIIIIIIIIOOOVVVVVVUUUUUSSSSSSSSSSSSXXXXXXXXXXXXXLCEEXXXXXXXXUUUMMMMMMMMMMMUMMMMMMMHHHH
CDDCCCCCCCBBGGGLGGMMMMMMMMUUUUUUWUUDDDDDDHHIIIIIIIIIAIIIIIIIIIIOOOVVVVVVVUUSSSSSSSSSSKKXXXXXXXXXXXXXXXCCCEEEXXXXXXXXUUMMMMMMMMUUUMMMMMMMHHHH
CCCCCCCCCCCGGGOMMGMMMMMMYYYYYYWWWDDDDDDHHHHIIIIIIIIIIIIIIIIIIIIOOOOVVVVVVUNSSSSSSSSKKKKXXXXXXXXXXXXXXCCCXXXXXXXXXXXXXUMMMMMMUUUUUMMMMMMMHTHH
CCCCCCCCCCCFGMMMMMMMMMMYYYYYYYYNWDDDDDDHHHHIIIIIIIIIIIIIIIIIIIIOOOOOVVQQNNNMMSSKKKKKKKKXXXXXXXXXXXXXXXSZZZXXXXXXXXXXXUUUMMMMUUUUUUUUMMMHHTTH
CKKCCCCCCCCFFFMMMMMMMMMMYYYYYYYYWWDDDDDHHHHIIIIIIIIIIIIIILOOOOOOOOOOONNNNNNNNTSSKFKKKKXXXXGGGGXXXXXXXXSSZZXXXXXXXXXXUUUUUUUMUUUUUNUUQQMHLTTH
KKKKCCCCCCKRRRRMMMMMMMMMMMYYYOYYYWWWWDHHHHHIIIIIIIIIIIIIILOOOOOOOOOOONNNNNNNNNNNNFKFFKKXXXGGGGXXXXXXXSSSSXXXXXXXXXUUUUUUUUUUUUUUUUUUUQMMLLTH
KKKKKKKKKCKKRKKMMMMMMMMMMYYYYYYYYWWWWWHHHHHIIIIIIIIIIIIIILOOOOOOOOOOOYNNNNNNNNNNNFFFFFKKFXGGGGGGGXXXSSSSSXXXXXXXXXUUUUUUUUUUUUUUUUUUUULLLLHH
KKKKKKKKKLLKKKKMMMMMMMMMMYYYYYYYYYYWWWWWHWHWWHHAAAAAAAAALOOOOOOOOOOVVNNNNNNNNNNNFFFFFFFFFFGGGGGGGXOXSSSSSSXXXXXXXUUUUUUUUUUUUUUUUUUUUULLLHHH
KKKKKKKKLLLKKMMMMMMMMMMMYYYYYYYYYYWWWWWWWWHHWWAAAAAAAAOOOOOOOOOONNNVVVNNNNNNNNNNFFFFFFFFFFFGGGGGGXSSSSSSSSXXXXXXUUUUUUUUUUUUUUUUUUUUUULKLKKK
KKKKKKKKKKLKKMMMMMMMMMMMYMMYYYYYYYYWWWWWWWWWWWAAAAAAAAOOOOOOOOOONNNNNNNNNNNNNNFFFFFFFFFFFFFGGGGGGSSSSSSSSSSXXXXXUUUUUUUUUUUUUUUUUUUUUUUKKKKK
KKKKKKKKKKKKKMXXMMMMMMMMMMMMHHYYYWYYWWWWWWWWWWWAAAAAAAOOOOOOOOOOONNNNNNNNNNNNNFFFFFFFFHHHFGGGGGGSSSSSSSSSSSSXXXUUUUUUUUUUUUUUUUUUUUUUWUUKKKK
KKKKKKKKKKKKKMXMMMMMMMMMMMMMMHYYYWWWWWWWWWWWWWAAAAAAAAAAOOOOOOOOOOONNNNANNNNNNFFFFFHHHHHHFGGGGGGSSSSSSSSSSSSXUUUUUUUUUUUUUUUUUUUUUUUUWWKKKKK
`
  .trim()
  .split('\n');

const runs = [7, 1, 31, 1];
if (runs[0] & 1) consoleTimeit('part1 sample', () => part1(inputSample));
if (runs[0] & 2) consoleTimeit('part1 sample2', () => part1(inputSample2));
if (runs[0] & 4) consoleTimeit('part1 sample3', () => part1(inputSample3));
if (runs[1]) consoleTimeit('part1 real', () => part1(inputReal));
if (runs[2] & 1) consoleTimeit('part2 sample', () => part2(inputSample));
if (runs[2] & 2) consoleTimeit('part2 sample2', () => part2(inputSample2));
if (runs[2] & 4) consoleTimeit('part2 sample3', () => part2(inputSample3));
if (runs[2] & 8) consoleTimeit('part2 sample4', () => part2(inputSample4));
if (runs[2] & 16) consoleTimeit('part2 sample5', () => part2(inputSample5));
if (runs[3]) consoleTimeit('part2 real', () => part2(inputReal));
