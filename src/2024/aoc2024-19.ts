import {consoleTimeit} from '../util';

const part1 = (input: string[]) => {
  const tokens = input[0].split(', ');
  let result = 0;
  for (const word of input.slice(2)) {
    const cache: Record<number, boolean> = {};

    const recurse = (offset: number): boolean => {
      if (offset >= word.length) return true;
      const cached = cache[offset];
      if (cached !== undefined) return cached;
      for (const token of tokens) {
        if (word.startsWith(token, offset) && recurse(offset + token.length)) {
          cache[offset] = true;
          return true;
        }
      }
      cache[offset] = false;
      return false;
    };
    result += Number(recurse(0));
  }
  return result;
};

const part2 = (input: string[]) => {
  const tokens = input[0].split(', ');
  let result = 0;
  const cache: Record<string, number> = {};

  for (const word of input.slice(2)) {
    const recurse = (offset: number): number => {
      if (offset >= word.length) return 1;
      const subWord = word.slice(offset);
      const cached = cache[subWord];
      if (cached !== undefined) return cached;
      let result = 0;
      for (const token of tokens) {
        if (subWord.startsWith(token)) {
          result += recurse(offset + token.length);
        }
      }
      cache[subWord] = result;
      return result;
    };
    result += recurse(0);
  }
  return result;
};

// noinspection SpellCheckingInspection
const inputSample = `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`
  .trim()
  .split('\n');

// noinspection SpellCheckingInspection
const inputReal = `
rug, uugbb, bubbbr, bbubw, wwb, wbw, gwbbuw, ubg, ruwug, bbwuww, wubwrw, ug, ugu, ggrbg, ruw, rbur, uuubbuu, wb, wurrbgr, rwruwwuu, rwg, rwbb, bwugugg, bur, ggwub, brgbr, guuu, wgg, bbw, ugrbrb, ggrw, wbgu, rwgbg, ggwu, wurwuw, gruub, gugw, bgu, wrr, rbrg, bww, uggwrr, rgg, uugb, bbrwuru, rw, urbu, ggggg, ru, wrrgwrrb, uurrgur, bgrw, ubuwr, gwwgug, bggb, uwub, gwu, wrwbgw, rrbb, uuwrggb, uuugw, bbbubg, bg, ggr, rgw, ugburuw, ggbbww, rrgbru, wurg, wugu, rbuu, wgrg, ubugu, uuwuur, ur, wgbbg, wubu, gbrrwgu, bwbu, wbgguwg, rrwbwru, buggggg, bwu, uw, grubg, bggbw, ugwwgwu, rbubgwg, wgwuu, rrr, uubwwgrr, bbwguw, uuru, wgww, grbwu, gbgww, uuu, gruwwg, urgw, ubu, ggbgb, buwur, bbgb, bub, wbru, gbug, wgrruub, wrwwru, wuwgg, uwg, uuwgw, rrruwb, rbr, grrrugwb, rbgb, wwbr, ggbugg, ggg, buu, uwr, guug, wg, wbwu, wgb, rbbb, rub, wru, bubr, rgruwrgr, gwr, urru, wuw, uuwg, bbr, ruwg, urwgu, bwbugbb, wgbgrwgg, grwb, rwgg, uugg, uww, w, urwgrgb, gw, ubrb, grbrrbrw, wgwgrr, rggurb, buuww, bgrrb, wbrg, ggburu, rgwgb, wrw, bw, wubbb, bbwww, ubbg, bbg, ruururru, rbg, wgug, gur, rrugw, gwurbg, gr, bwwgrr, gub, wrgwrw, gbrrb, rr, rgbu, bbrur, ubgbu, wuwrw, guub, guu, uwbww, gguuww, ubuw, uuggu, wgwg, grwrr, bwg, uwgrb, grwu, gwbw, rwu, buubrb, ggbubw, wrgw, wwu, uuubwrgb, urwgbwu, rwggwrg, uuuw, gbrwb, bbuu, urgbgb, www, guw, uuw, wbubg, brw, gubruu, uwrg, bbbggg, bwr, wgbg, wguw, rbbgruru, uubgggr, ugw, grgugr, uugrrbb, rwgwg, ubgu, burgwgbw, gwrubbu, bwuug, bburur, burwu, wbb, ub, wr, ggubww, grw, ww, buw, urbru, gbgr, burwgur, ugr, gwwbgb, urr, wuwg, bbubrrgu, wuuwb, brrwg, g, gbgurrw, rgu, ubb, urggug, wub, gwubu, bgrr, wrbwwb, guuuuug, rrb, brugwu, wgrgwu, bru, wrbgugur, ubww, uur, uuub, wubwrb, uubggur, bbu, urb, rrggwuw, brgw, urbrrg, uwuur, bubw, bbwuu, gbu, rrg, rrgbw, gbr, wbu, ubrw, rww, ubw, wugr, rrur, bggu, uurrbwr, br, ggu, bgww, gwbbubgu, grwbw, uu, wguwg, urwubg, rruwg, wur, rgbwg, wbrgbg, ugrr, wbbggu, gww, bugb, wrbr, grurrg, gbrgwb, rur, gubbr, gbb, gggubwgu, gwbbbwru, rbbbu, rg, gwg, bgg, rgbg, uubbrwb, uwur, rwr, uwu, wbg, wwwbgurr, grb, gbg, rugg, wgub, bb, bgb, ubwbrww, gugbr, wwgwwwug, brb, rbb, uwgg, ubbbw, rwwr, urrw, ubuuub, wbub, ugbrr, ubrr, bgwr, gwb, wuuw, ggbuwb, wug, wgugr, urgrb, uwbbwr, gwgb, uug, gbur, wwr, gug, rgbubw, ruu, gbbw, grg, ggruwgb, urwggu, rrw, rgguuu, bgwg, uub, rbu, bu, grrr, r, ugb, bbrb, gwwbr, bwwur, wwg, grurrgb, wrguuu, rgggw, ugbwg, rwb, wubgw, grrww, uwb, bgw, bggrw, rgr, rbwg, buugbbb, bgr, gbgrgr, wbr, wgr, wbbr, gg, gru, urg, bguu, bbwbgur, bburgw, ubr, wrg, gu, rbw, rwbrur, bwgru, ubwrugb, uggubw, rgbr, bbgg, wrb, wwuug, bwbuw, rb, gwugbr, uuwrw, u, rburg, wguwgwu, bwrru, uguwgb, wuu, ugg, bgrg, wrrw, brg, rwwru, buuwg, ubuuwwr, ruwr, bbb, guwuwuug, rrbgg, ugwub, rrwwugb, bug, wgw, urw, brr, bwuwrw, bbug, rru, brbubb, bwb, ggbr, rgb, gwrwb, grbgw, rrwuruw, wruuwgrb, brruubu, bgwbu, grr, ubru, rbrr, wubwuub, grbr

uggbggwuurbrgbwbwbgbwbwbbgrgbbwwuwbubguurbwbgrbbwwgrbuuw
uwgrbrwwbuubuwwwrrbbgwwgurwwrbwwbrubgwubgwbuub
gwrggbrugrrgbubrugwgwrbbwrggrgwwbbbrguubrbwbwwww
gurwuuwgwwgubbbuuubbgwggrubbububwwurrwgbrbwwrgwgr
bwrrburgbgwwbwrwwbrgguwuwuburrwurbruwrgbuuwu
bwrwbubrwgwbrgrbwrbbgwwuwbgwwggbbrgwgwwbrurrgruuubrrurg
bwubwuwgwrggwrrburgugbguwwwgbbuwwguwrrwbbugrbwwbwu
bwbbrrgrrbrggubuggwgguguburbbgbgrruggugbggggb
bwbwrrugrurrubugwggwugugwggbbwrwbgugwwbgrububrbuuwrrur
rwggubrbububggwwwrgwrgbrrrwgrwwrwwubuwuwrrbbr
ruwbrgguwubbwwrbruwwwgwrbwburrggwwgbrgwrwubur
wwugrrwrwwruwwgrgbwwrbbrbrwrwbbrburgwgrggugr
bbbbgrubuuwgrwuwubuwgrwgugwruuwwbruwrbbrwurgwurugrugrbbb
uuuwuuwurrwrggruwgwwuggwgruguwgwbgubwrgrwwguuburr
wwgwuurwwrbrwbruugbrbubwrwgbbrruwurrbbugwbr
wrrbggwwwgwwwugrgwuurbrurwrwbgubwrbgruwbwgrwrrwuuwrwggb
gbwbbrbwwurwrubgwrgbrwgrbgubgbubggbgbuuguggwbgg
wwuwrugrurubrugugbugrugbwgubbubuwbwurwwrggb
bwuugrrrubruwuwwgurwruguwuwwubwgwbburuwuruw
urbwguuwguruururrubbrbuwrrurrruuwubgruggb
guguuugubrurbggwbwgbbbwbuurgrgbwgguwwwgrbrwbr
ugbbrurbrrwbubbrbgwubbwwggbggrgwbwwguuggrubbuugg
ugwbuuuwgrwggwwuwguubrgubuugugbbrbruwuwrubwrbugggb
rgrgbgggwuuugwbwruwgurwbgbugbgbrwrrgurguugubrbrwug
ugwguurrbbbuuwuwuurwrwwwggruururruugubbbgbruwrbbbrubww
bwburbbbbwubwrbrrbuwuuwbrrrgwbrrbbwbwgrwggb
wbrbrurwubwbwwgbbwwwugrgruwugbrbwuubrbbrrgrwbwgbwrwggb
rbgwuuubugrbrwuugrrgubbbguwbwubrwbrrggrgwurgggrbrbwubwrggb
gbuwgbbwbbgbwggurggbuugbbgburbwruuwrguuuuugbr
ruggwbguwugrrbgrbwwwrububbrurwwrubwbrbbuguubgbwgwgbrrg
bggwbwbbbwwwbrrrbuubbruuuwugwwgbugwrugugruw
ruuuugubuggwuurbbbugbbrbubbuwwbrgbuuuubbwbwwrburbrur
bbugwguubwwrwuuuwwwrwgwuubwwgrrgurugrggb
rgrrgwwgbgwubguwuwrburuwgrrwrwrggwurgggb
rurggrwubrrggwgwgbubbuguuwrwwgburrrwrurbwwgrbwrbrrbugbwrgggb
bgwrgugguubbwggwbbubbgbgbuggrggwrgrbrgwrggrwbwrgggb
gurgruuwbbubugwwbrwuugbwrbrrgrwbrwrgwbuwbwggugugrg
bbgrgbgwbrwruuwgrbbrrrbuugubguggwbrbrwggggrggb
buwuuwggrgwrbuurgubbbbbuuwuuwbwbguwurugurwgbrww
gbrrbrrgrgrwbggrbwubggwwwrrbrrgrwugwubrwgrrwbg
uwgugwbwburgwbrwrggguuuwgruwrugbuguuurbrubgwrbwgwbwruug
ugwbrrwgwbrwbwuwwuruwgrgugbbwbwgurwbruubwr
wuuuubbbwwrurwbburbuguggrguwbbwrrrwubuugrrbgguw
rrubgugggugurwrbuwgrwugrwbbburgbbbbrgbuwubgr
uuuugbuwwrwwwububwuwrbgbwbwuwrrggbbggwbwwbw
rrbwuubwurggbururrgguwrururbgbguuuuwwrrrurrbrrrgwgrrrwwrggb
uubrubwwwwuwbubrwgggugrgwwuuuurwgububuuwrgrwrrurbwgrrggb
ugbuugrbrwruubwrbrbrburgbgwrgggubbwbbwuubbbuburwg
gwuruggwgwugwwbwgwwgwbrwubrwbrgbwurbwwwgbgwruwbwugbr
grbwubbwgwurggbbgrubgwbrwwuwgbgrwwbbwrwrwrw
wugubrbrwbrruwugrbrrubuggguuwbwrwbrwwguwbuwgurguwruuwbwbr
rrbrwrwwburuugrgrbbwwugwwrrwbwbwubgbggbbrggb
uuwwrbubgbbwwbwbrrruwubrubggwgbwggbuubbbru
grrgwgbbubwwgguugbgguwgburbrbwrgbwwbbruwwggb
gubgbwuuwrrubgrbubugbgguwggrrugbbwwuwrrggbgrgguurwub
ubrbwbgggwbbgbbgwrbgugugrurgrbubburrrubbrwgggbrggbr
wwbbgugrrrrbbugwwwgwuugrgwgbugwgwbrrubguugwwwbrburwggb
rbgbrbuurburgwgbwbrubwgurubwrubugwburwwugbguruu
wuubgrgbrbgwwgwbuuwwwwgguubbrububgbbruwwubwbubggrurggrwgggb
wrbuubrbwgwubbgrwrwuggggugbbwwurwurwgubwgwb
grrbrruggurrwrggrgwurbbubgwgguubbrbbuwgubuwwwrwbgugbuggb
gbbwguwuggwbuuurwbgrubrwbwbrrwbrgruwbbgwwbu
uuburgrggwguugurbbgwruwwubbgbuwuuwwubrgubbwubuwgwbbrrwgug
bugrbwrbbrbwwbbbrwgrurubrububwwrwrrrwwburggururbgbrwrgbb
rgbwbrgrgrrbggwbrwwwrrubbbrbrwbrbwrrgubbburugubrbb
guruggubburwwwrgrbubrrrrwrwbrggbgbuwuggwburgugbgwur
gwbwuuguwrgwrwrbugwbwuwurubwwgggbbwbwubgubuguurgrgbgb
uwgbrgbbbrubuwrwuwubwbwuwuguggrbguwbgrugbwgbgrwggb
buurrururubwbbrbbrgggbbgrrbbwwuwbwrgguwrgrrggrbrrbrwruggb
bwuwruwwbrgwrrgrrwrwuggrwgrwwrubggubwguwbwbrrbgwbgrg
bbubuwrwwrbgwggwuugurggrrrugwbwrwwruwrrbuwgbubwbruguuggubu
wguwwrggrruggbrgrrbugbugwwubuugubrggrwuugbbrrgwbgwwurbwbw
uwuububwwrbwuwrwrubbrrwgbbbbwrgwubuurubwgru
gwruuburwubwrrruwrwwubbbbugburbwubwrwgwrubrbuuwggb
bgrwgbugbguuwwrubrgwububwwuwbuggrbbgrggb
brrrrugruwguggrrburwrrbubbrruuwbrgggwuugrrgubgrbgrr
ggwbbbwrubwgubguwrrwrurrbgubrrburbgbrgwgbrrrgruggb
gggurubgwrurwbwwwwbuwwbbugwwgwgwwrrwwuwguuwbrru
bugrbwuguuugwrbubwgbggrwrgwwurbwuwwugbwggbguwgubgbrrg
rrwrrbgrwbrwwguurgburbgubggrbubwbbrwwuwgwbbrwurrrbwu
uuwrrgbuwwbbwrurrbbugubwbrbwrwwuwrwurbbwrwwgwwbbuuug
wrrbwwwgggwbbuguwurrwgurbbggugubguuwwwgwgggubwgurggb
rrwugrrguububugurbgubrbbgugubgrruwbguuggrrruwuu
wgbbbbrbrgrbbrggggrgrbrrbrwrburwbuwrruggubruggbb
rrwwwbgwrbbuwrbubwbbgubwbuwwbbbgrwbbrwbuwuwrrbuw
gbwbbugbrrrurwbbrbwwbwwuurgurwggrrbbrbwbbbbwubruwgrwuwr
ugwwgbrrwbuubuubgruurrwwugbrurbbrubwruwgwru
uuruwburuwrwbuwgrugwrgwrgrugrgwwrwbrubbgubguwr
wubbggubggwuggbbbbrrruubbbuggbuurgggbugbuwr
uubwruugwuwrgbrgrrubwrwurrguuggrbrrgwgrwwuwbruwbrb
bgbwgwrgbgrbuuuwugwwrbubrbwwgrrrguururguur
gbrwrwuwguwurbwgrubwbrububwggbbwbrrurubrbgwbubrwu
wbrrgbbbggrrbguwguuwwrwrrgbbggbrggbbwuubub
wrrgbgwwrrbrrgugurrurgwrwwrruguubguurwwgrgwubrgwgrwuurggb
guurwwgwubrugbbggrubwbrggrrrrwwwggbrugwbuwuuurwurgggb
guubgbbwwrruggwwwrrwbggwrugwgwrrwurwuubguuwurguggb
rbbwrgrbuwrbbwgbrrwbguuwgruwbgbwgruwugrwbuwwwgrbwgrr
bbuburrgwwrgrwwbrgwuuwguwrwgrbwuwuuwgwrgburww
rbuwgbburrwgbuwwruuwbgugurubbwrbbbbwuggb
rguugrgbbbuggwwuwgugwrbuwbggrbgrbbbgbwbubwbgruuuuubwrgbgbb
bbrgwwwubgggwwbuguuwgwgwbwrrrrrwruuuggurbwguwbgrwwrgbb
bgwrwbwbuuwbwgbgrrgugbwrgwbgbgwgwrguubuuuuuwgu
ggbwbrwgbrrwrurwbgbwbbuwrwgwwurrwwrrbgbbwgrbrurwb
bbbwwwwrrggbruurwwwrwwbwbwwgrruwrbguwrrggb
rgugugrwrubwuurgwwbwbrrrwuwrrgwruubwwgubbwrgwugwg
gwbbrbwugbburwruwgwurwugbuuubuugwruwrrrwgrwgrubbgugwur
wbgbbgwgrwrrrugwrbrbwbgrwugrbuurbwrwbguggbbwrbbruuuur
wbwrwbubwrwuwrgurrrrrrrurbrrggwbbwgurbugrgrrbwguruug
gruuwbwguurbwgrwrbugbugugbbuugwbbwwbbgbwgrbwgwrrurbwbuuu
rbwrbwrbbubwgbwbbguubwugwwburwwuwubbwruggb
ubwrrbwbbubwuruubwwgrrbbwwburwuubbwuwbwurubgwruubwubwrb
gwwbggugugwwuuuwbuwgrwbbgwrbgbbbwruuwggwggb
wbrwubwwuwugruurugwwuwubwgbrbbgurwwbuwwbrugurrwguwrububrg
urrrgbuwbwbrruruuwrugrugbgrbggubururbbgbgggbww
wugrguwwrugwugbugwggrrrrrwuubgrwrgbuggrwruugurbbggwww
uubbbwwbbuwwbggwurwggbubbubbbgwuwbruwwbubuuugrruwbubww
grgwguruugbuuwgugwgwrrwbgurrbgbuwbrgwgbwuubwuubwggb
wubrwwwwwubgwwuwbgwgwwbgwgurbrrgbwgguurggbbub
wurbbrubrbrrbubgbrbuwuggrwwbrrrrwwbbwgrwgwbrbwgwrgbbwbbw
uuwgrgwrgrubgggwwbbrbwwrgrwgrwwwgwgbuggb
bgrbgwgrgburbubbrgbbwugwwwurrguwurwrwgrrbrgg
ugbrubgrbuuggrrwbbrgbwwrubwrgrgbbwgbuwgbggwbuurruuuggwww
uggrbbrgrggubrruuwwuwbbgugbwurrrugbrurgrugbburwwb
burgwwbuubggrrggbrugbggwgwrgrwgwgwgruurbrurwgrwwwwbr
gwrburbrgwuugugggbwgbruruwbwwggbgbgggbbggwwuuuggb
gguggurrrbbrwbwurbwbrgwbbubgugbggbugrgrrwuwububwubug
rwwwurwuuguubgruwwugrbrugwwgrguururbbrbwwbwrbbrwggb
rwbgubrruwbugrubuggwuburuuwwugbbrrbruwrbbbgwrgbuuugrgwb
wwrbwgrbwbbwwbuwuwubwbwgrrbbgwubrurrrwgrugguuuugwu
gwbbwbgwgubbbbrbwbuuwwbugrbbubbwgruwuubuwgbrurburwuu
uwuuuburgggwrrgwbwbuuwbgrwwruwrurbggwbwwbgwwgrgg
bruguggbgrubgubrrbruwbuwuuwgrgwgbrgrrgbubww
uwrwrrrwwrwrgwbrrurwubuwrwbrbwugbrrgwwbwrwrbuurggwb
gbwrbuurgbruuburwgwwggrwwwgurbuwurruuruwruwubwu
rrgrrggubgruuwbwuwuwgugrwbbuwuruwguwbuwwbbrbbgugwug
brugbgbgwrrwwbgwwuubububrwrwgwgbrruwwgbubgbbbbggrrgrgur
rbuugrbrubbgwurrbrurbbwwwruuggruugbgggwrbbgbww
uggrgwgrurwuguuurbwbbbwwguwwbrurgbuwgwbwuwbrbbb
ubbrbbbbbugbbruugugguurwgggbuwbggguburbbubwurubbuwbuuwrw
gwbwgwrguguugwrrrguwgwbwuwwugurwwubgbuubrubbuuuuwwgwu
guwugbgbrbgrruuwwuubrgrrbbwbgrrugrgwurgrbgwgrbrwggurrgw
uubwbugrwwguwuuurggbgguwbwwurggwwbbwruwurwbrrggb
rggrwgwrrwgwbrwuugwrgggrwwwrbwrbggbwwugrbrw
gugubwwgggrwgrwbgwrgugugbrgurgugubrwrwguruwgggb
rbggbgrgwuwubbwrbwbwbbuuurgrbruugwubguuurbrggwgggurrbug
ubwbrgrurbggurwrwgrbbgbbgggrwugrgrgwwbwwbwrgg
uurgbrbubrubwbwurwurggurbwgugwuuubrbrwurggb
bbgbbwwbgruwugurgugurrruugwgbbrggguguwuwuugggrurrb
wrruwrgrrgburbgbrrbgwwbbwgwrrbrurwrgbugurwuwwugrubwggb
rbbgwugbuubbbwgbgrwuwwrbbbwwgugbbguwwguururgwwgwwb
rgggwbwwgwurugurrwrbgrgwuuwbguubbwrugbuuubwgruugggrb
bbrbrugrbguwgwwgrgurggwggguggwrrbguurgrwggubr
brbwwrwwgburbbguwgwbrggrbrwugwuwgwggrrbwubguurrur
uwgbggguubbruggugruggbbggwrbbugbwbbubrggb
bwgbrbrurrburrbwwurgwgbrwbrbwbrrrgugrbggru
wrbuwwgbgubrrubuwugruggrrgrurrwwgrbubgugrrgruug
rbbwrrwuubrrubuwrugwgbgurbguwrbrrugrrbbbguwugbgwbwgrrbwb
bbwuuuuwwbwuburrbwbrubuuwbuubrbbguwwugruwbrwwrrguwg
wwguwgguwubwwwrrwbwggbrwruuruwwwrrwrrbrrguwurwgb
rbbbrugwurruubbwgwwwuwwbrggrrwwwrrbggburuggubgwgwwuu
gbwbuwggugggubbbuguwbrrbgububbrrrbbubrwwubrubw
uuwugwugubwwuwuugrwgurwurgruuuwguggwrwggb
rrrrgbuuubuuuwruwbbwrgubwrrgrbgwbwurbgrwburgwggrg
bgbgrbrrrguurbrgwuuugubrwbbrbgbrbwgugwbbbuggubgbgggbwbrrg
ubgwwbggruwuugbbrrwbbbwrrbugrrgrbugburrwrurrwrr
uuwbuuugrguurgbwgwruugrwubwrbgugurwrbubwurbwuwggurubuggb
gwuubuuwbbrrgurgbgugbwggwgurbwwwuwwuggwwwuw
uwwugbuurguruuubugwubbwubrwurgurruwwbwubbgwurgg
uwbuuwbgrwwuwrguwggwbrggbwgbburgbwggwrbwrbbgb
wrwrgguggrwrwwwrgwgwwuwrggbgbuggrbggruwgbbwbuwuuwbbrggb
wwwwubbbwbbrugwrwugrrgwugbbugwggurbgrbrwrggb
buwuugwbbwgbwwwwbuuwbggwuwbbbwgrbubwggwubrrrb
uwugguuggbugwbbbugbuurwgrrbubuwbrgggubrrguuggb
gwgwbruwwbbuuuugbwwbruuwgwrwwbgwgurrwgwwugg
rugrugugrwurrwbgrubggbbbwubbwuwwuwruwbbwbr
uggggruuwwwubbugwbuwgwuwuwbbwggbugrubggbgbbgugbugbbggw
bbrrubugwbbubguwbruuruuugbggurubbbrrwbugbbrgwrubbugggb
rgrwggrggbrurwugurbggwrguurrubwruugwrruubg
rgggggruuwrugwuwwugubrruuuwwwburgugwbrbrwgwrggubbgwbwbgggb
uuuwgwwgwrgbbgrrrbrwwgwrwwruruuuwbrugrwwgrbbubrgbuwgrbugggb
gwgrburubbuwgbbugwugwbbbgbbwugggwbrbwrrwwwwwuwubbwuwgbrggb
wggurwgwwwwrbrbwwbgruwrrwubbgbggrrwwwrugwbuggrubbr
burgrwgwrgwubggbuguguurbbwbrurbwwguwwruuwrguuuubwbuggrbbwr
wbggwgrrwbwwurgrrrrurrubwubwurbwrrurbrwbgrub
bgwbwrrgwrrbuurruwugrububbwwrbwgrbugguwgurgbburrwub
grruwgggbwrwwuwrurbwgbguwgggrbwgurugbbguruugbg
wrbgugrwbwrurgwburwrgbwbrrubguwgruwgguwuuwubwgruuwbubuuru
uwbbrbuubggrbrggrbgwrrbubwwwwbubbgwgrggb
gwbbrugwgugwuuggbrubwugbwbuuwbguruugrbwguwwubbrgbgu
rwgrrgrwwwwbrwugrubbbrwgwwurwbubguwwwrgwrbwrru
urbuwrwrubbgbuwrrguuguwuwbwurrggrbgrrwurwggb
bubbbubbggwwuruurrugrgwwwgbbuubwuuwurwgwrugwwwrbbrbwbw
wbgugugugurrggrwggubwwuwbbggwbgrrwruwwuuuubwbbrbrbgggbgggb
wggwwwrugruuguurruwbwgwwbruubrgwrubbbwgrubuuwbwbbwwgrwwg
uubgbwguwgrburubrbwgrrgrbwwubrwgurwrwrwgwbruwwgg
grwbguuburrubgwrgbuwwbugbubrbggrwruubwguwww
bgguggrwwggwwbwgrggguururugubbrgbwrrggwguwwwbuubgruur
gbrrbuwwggrgruwrbrugwrgbwgbbrbbrrrgwrwwgrwbggrwuuwgurrgggb
wwwbgurrubgwurbwbwgbgbubrurwuruuugwwwrggb
brugrwugugbrgbbbrgwwbwgrwgwuwrrugubrugwbguurwrgguuggw
rwrwbbubrbbwwwgrbugbwbwggbbwruruwurbugbrbbbbrwgurbugubuu
rbguurwgrbruugwgguwruuguwubwwwubwwrgugrwggu
uuuuubbrbuuuuwbuguurbrrbggrbrbwgwggruurgugubwggb
wgrgubwuuuwwuwbbbrwwrugguurgugbbwbrbguurwbbbbbgrbuwggb
ubugggbbrrrgurrwuwbwbwrwrwbwrgwgrbgruggggbbwgubrrrwru
bwbwbggwuwrrbgbgbrrggurbgwbgrwrurbrgruggbuwwuwurwggb
rgubgwuugrgwwrgrbguggwgwwwbubgruruuwgbbgrgwubguuggrgr
wuuwwrgugbgugbrwgbuwbgrrbbrbruugbuggurwbbrugwuwgggb
gbrrgwgbbgrbubwrggwrrubwubbwuwrrugwbbwwuugubburwgbwr
bwgrwwrwguwgugwurbubbbwrbwgbrgwgrwurrwrruggb
wugrwwrrgrguggububgrburrbbwbrbbbbwwrwruurgbbgubuw
uuwbbuwrgbrwgbwgggrbgrbbrurbgwugbbugugugwgwgwbr
gbrwuwrrbgwrgwubuuwrgwuwbwwguubwrrwrrruwrwuuurgbrbwbu
ugrurugrwugbgrgwbwwguurgrrguubbuuwrrrgwwwubrwrgwuwrg
bguugwuurbbrwwbrwuwuuugrgurbwbgwbbuwwwbuuwrbwubbwwbb
wbburuwbgburgwurrwwurgwrrrurgubrwgbbbubggwwuwuubbrwgrggru
brbbbwbwbgbwugbbrgwwgbrwgwguwrwbbbbgurgbbgbguguwrubuw
rbgbrbrbwgburrgwurrgrwrbggbuwurbrguguugbgwrbwuug
grruuugubgrrgbrwgruwbrburrggruguwgrrrrwggbbruw
wggbbrwbrggwggrbwwubwgbbwrrugwbgrwbgwubrwgbu
guuubwrguwbwuwbbwbrwbrgbrbggugrgwwgrrguburwwwuuruwwr
uuwrbbuwgwbwggwwrgwbwbgbrggwrwguwrgwgwrugubwurbrrb
wrbuuwbbgguubbgbwbgrrbuwugbuwubbuwbrbwuugbrbrbggwwrgurubgggb
bwgwbgbugbgwgbwuwwwurguwrbbuugwwbrwurrbwgbgwgggb
grwgwuurwrugwbubgrbwruuwgrbgubrbbrrwwugwbrrurbw
rburggrrgwrwuwgbrwurrbwuuuwrgwbrwurbgrbuugwgrburwwwguub
ggbgrggbguuuruwwrrgugrbuurbwbgwbwgwwwrggugru
rwbwbruggrwguwrgrwbgugurwgwbggggbuugwwrrrurruwwurbrgug
bwwwwuuwbubrubrbuggrgbbrgurbrggwugrgwuugbrwgugbbbg
wguwguggrrbgbugurbugbgububgbgwwrrrbubbuwwrgwwubbrrwrbuuwru
urugruwbwggwwwwuwgbbuuuwbgwurgugwbwbbuuubuuurwbbg
wuuggwrgbubwugbbrgbwruuwrgugwgwwggggrwuwbuuwuwrgbggubru
wubwrwgggrrwgbguugbwrwgwwbrugbwurrrgugrrgur
gbbrwrgwbuwwgwbrrrubwrwrwburwwgruwbbwgggrbrr
wgbbgbrubrbubuwugguugwwggurggrwwgbrgwwwwrugggwrrrgrrrgb
gbbwugugubruurgwbrbwugbrubrurwggbgbrwuwgbbgurw
ubggrggguurgbwbbwwubwbbruburuuwurrgurgrrug
rbrubuuggwbwgbwbgugwrrrwgbgugrwuubwgwwgurgbwrbuuurbwguuwggb
ubrgrgrurubrbwguwbrurguuwgbguurbbwbggggurrubwgurrugbgwbbuggb
grbwuwrwwgbbruuwwgbrubrgbbrbbgbururgrbbgwgrgwubbggb
uwrwrwbgwbgbugggwrruggbggwbbbbrbubwruwubrbrrbguuubb
bubuwugwrubbgubbrrrubggwurgwgrugbubrbguggb
wgururbbgbuwrwrgwurwbbrurrrrurrurububguwbbrwwuwbbgbwwwug
ggwurbrbgbuugwugggrburwbrubuwgrruugrruwbuwwgurbgb
urgrbgbwbwruuwurgruwrgrubrwgwbbubwrrrggb
wugburbgggbuurbgbugrrugrurgrbbbrbgrwbbrbbbwggb
bggburbrbwurugwbwbwwrguwrubrbwuuwwrubugwgwgwbubrrguggb
buugwrguugwuurrwwguwwbrguurgwubrgbgubbgwrwuuuruuub
wuubuwurgururwrrwwgwugwrbugwurbbbgbbwwbbrgwr
ugwbggwwwugbrrrrruuubrggguwgwbrbwwgwwuubgbubbrrgbgwwwuugggb
gbrgwugwurubgurgubrugwbbuuuwrbbrwgbrwuggubuubrbrgrrwbrr
guubrbrgrgwugbrwrwwguuubbgguuggrrrbwrgwbrbgubwbbgwubwbgrwggb
ubgwubuuugwbbwgguugrwrwurbubbrgrwggbbrgbuggb
rguuwggrruuggubwggruuubrbbgrurugwgrgwuuwguugrwrruggrwrruggb
grbbgubuuwbgwwgurwwrruuuggggbggbugbgwuggb
rrurbgrbrrwwrguruurwurrruwbbbuurbwrrbburbwbbrgugr
rbgbgrggwrwwruuuuwwgbwgruuuubburbwwguwuwwgrgbguuuurwwr
wuubgbrguuggrbgwbbrrgwuuuwwrwuguuuuuguggubgbbbwg
gbrgrrubbgbubbbbbrrwrgbbrwwrrbwrbbguwuwugbrurgugugwrwugguw
ruwwwwururguwgrrrbrugrbgwgbbwgrwugwgrwwwrbrg
rrbwbbggwugubgrgurrwrrrwwrbbwgbrubrgugbgubwwguguggb
ubgwrbguwrrrwrbrruuuwwbguuwgwgbgubbbubrrgu
bguguwbgrrggrgurbbubwrwuuuurwwbuugrwurgwrurbu
uwrrwbrrrurrwrrrgwbubwbgwgrbwrrbuwbbuubbrbgw
wuuubgbbrugwggbwburgbrbwgubggrgrwgwuwgrwuwwuwbrbrwrrrb
ggugruguurwrubbbrurwrugbwbgwwrgbuuurubbugwguruugbrgw
grwrbruwwgrwurbrbuwrrrwrrgwrrbubggwggrbwbwrwubuggb
rurgguwwgrgwwguubrugrwbwrwrbrwggrrrrwgwuwuuguwr
ggbbruguubuuuuguguwrwuubrubwwrbbwubbgbuwwbrwwwwurubruw
ggwbwugurwbrbguwubrggrguwguuruwubgbrbgrwgggub
bgrgubruubuurbrgurrbggbwgrbwggburgwrwgrgggrwu
uubugbrbwggwwwggbgrurgugubwrrbrbrrrugrrugwgbgbbrgggb
wbwruugggwuugwbgwburgggbwbbrrgbwburbgrgbwggguubgwrggbwgb
guuruurwbrubggwububgugwbbgwwgwbwwugrbbrbuuguuruurgbwu
ugbbuwuwrbuurbbgurubwrbgwbrrrgbbbwubwruruguuwrbgrgbrbbggggb
rugubugurgggwuurrrrbguwuruuurbbrgrrurruwwrbggwub
gwbwgrgbbwwrwbgwrrwrrrbwbbrrbwwbrwwrbgugurbwwwrbuguwur
wburruwrguwwwwugwbbbrrrgburbgwwurruruwbuuggb
wgugwgugrrbbbggggrrgubuubgwbbbrrugubuwrgwuurbuuggwuwbruur
gwubrrrbrgurubugrubgbbuururwwbrggwuruuwrwwwbbbubgwwuuubgu
rugbburbwgugrbbruwuururruruuuwbrbuwwggwggwruggbgrwwrr
gbgrbgwurwwrugbruwgbbugbrbguurwuuurbrgggwuugbwwbbgrurrrggb
rgwbgbgbruburrgugwggurgbubwurggbwgwbbwrwgwrr
wrrggwbgbgwuuuuuwwuuuurwgrbugbgwuwwrwwguwbubbubrgwwgwggbb
bwwguwuwbwuugbwbruwbuwgrwrbugbbbggurgbwrbwgw
uuwrburggbwuuuwbwrbwrbbgbwgguuruwwurwwgubuubrwgwubwwuubgu
uugbrwwwggwbwuugrggbuwububrwrgruububbgrrgrrrugwbwggb
rwbwgrwbbgbbubuguubuwurwrwgwuubgbgwbbbwbrbuuubwrgbubbwggb
ugrbwrwuubwgubwrbwugrbrbbgugrrrwubbbrwurwbrubggbrwwg
bgugggbrgbuuwgbgrwggrrruruwwwbbbwwurguuurwwruugrgruwguguuu
rbugbruwwbuwubggugurgrburbggwgbbrwguuggb
gwbwbgwwwgrguwwwgurbubwrrgurbgruwuwgguwwbw
brrbgbrbbbwbwwbubrrbbubuwgrbgbrgurrbwggbugbuw
gbggguuuwguugruwrgbuggrguugrgbrbgwrbrubwwrgrrrbubgrwbggg
bbbwubuguwuurrubuwwwgrwwgbbbbrrgrgrrgurrgwrburbwgrwgrbrgggb
wrrrbbwgwbrrbrrgrbrbwbubgwrrugbrgbbwrurbbggbrrgrwgggbgwu
rwbbgggugubrwugguwrubbguwgwwururwrbrwwgbbrgbbgbwgbrgwbwrrggb
rgrwbwgbgbbgwbbwbbwrrwruwgrurwurrwubgbbgbwgwguuwuuwwurgr
bwgbwbuuggwgguubbbwbgbgrwrbubwrrrrbwuwgrubu
urgrubrburruwwrgwgurwrgugrwrrrrgbgwrrubwbrur
gwuurwguwgrbbwrwgbrrurugrurruuwwbbbwwgwwwugwuggrwr
uurwbbugbbwrrwrgwgurwwrwrgbwuubwbwrwrugugwbrgururuwrwgbg
uwwrgwugwguwrurrburuugwwwrwwgurbrggrbrrbgguwggrrgg
uwrurrbuuubwbuubwuguggwuuwrrrwwwuwwuuuwwbbb
bbbgbugwgbuuugrwgrbwwurrbwrgrbrwbgwwrbrgrbbwrwgr
bruurbgruwgbubbubrbrububggubrgbggguurrrggb
ruwuuwwrgbwrwuwugrugggbwrugbrrbuuwbgwwwrggrwbrgbrbgb
rwwwuugrwbbgrbwbburrwubrrubugbbuwbuurwbwgrgggb
grugrwwrrwwgrbgwugubggwbrgbwwrgwuggwrwuruwwbrur
uguwuwwrrubuuwbggwbbwurgwgwrbwrrggbbubrrgurbuuwggb
gwwwbrwgrwgwrwbubgwuguguugwbruubbrubuuburrrgggrwrggb
rwburguwggugrwwuuwruugrgbgwuubrwwguwrwbuwwbrururbwbbugbwwggb
rbubgbrrwubggubrbgwgggwrbrwuuwgrruwgrbuubrwubuuubrwrbgr
grgguwwrugrbgwrrgbrbbuuwwwgguuwrbbuuurbgguwrggb
rggruguwbgrbgwgwbwwuguurgwbrgrwbrbbwwwuubuwwwuggb
gbrubrrbgrugrubrurbrrbrwbrgguuwguuuuuburugwgrbu
gwwwgrwuuuguubrguubwgrwuubgbbguurbwrgggb
buugurrbrubrbwurwuwbgwbuuuwuwwrwgururuurggbbbbw
uwuwgwwrwruuwbwgwbrgurrgbgbbuuwgguwwbggggubwgugrru
wgbgrwuwgwuugbggwugugbbuugurgrugrugwwguuurwwuwgbuggbuggb
bgwurrrurgggwuwgrruwbgrwbrurwwugbrggbrgwrbuu
urbbbwrgurgwwwuuugbugubbruwwrrwrwgwuggrgggrww
rwrgugurruuwuwgugbrgbbbwwbruwurugrbwwrwgrrbgruruwubwuuwbuu
bwrbugbuuggggbwugrbwbuwrurwbuurruwgwwgrwbbruwgruubuubrr
bwrwbgwwrgugbuwwwwrbbgrbwwgbrrgbrurrwgguwbbbggb
gbrggwgrwwguggurbbrbggugruuuwurgrbguwwuggwwuuwrwg
ggubuguurwwuubrwrggrwgurggrwrruurbwrgbuwbwrbuuwwwgggguurgu
wgbwrgbrrwrwrbrbrbuwuuuwbgbwurgwwbburgbrwrgrbrwubgbubrgbgggb
bwrwgbgbrrwuwbrwgrugbruubrggbubuubbgubbwgbggggur
uruwwbgbrwwgurbbggrgbubugrwurgwbrrwuwbuwggrurgbu
wbgbwbgwrgurgrwwuburggwubrgubuwrwubrgrubwuuuwbugrbrgu
gggwurbggbbbuuggguwwgwbuuubbbguubuuwbrbggbwbuuu
ugrubbwbrbrrrwuwrwggwgggggguugrgwugbrgwrwbguubuww
gubrwrbgbrwrbwbbwwwwbgrugwwrbwrbwwruwwbwwggb
wurwrwwbbrubwbwubbbrubgrwwbbgrwbwbggburbwgrbru
urbgruwgrrbuubuwbuuwrubgubgbrbwwgwbwgrrrrbwgwrugg
burugrbggurugrrgbbgrgbbwguwwwbwrbubbrbwgwgubwgggbgg
buuuwugwwwugwwuruwrbbwuurbuguwrwubggwwwrbgrwurw
wrwbrruwwguburwrgggbwbrgruwrbwrugwgggrwrwuwwurwggu
wgwwurgbwbuguugburgwgbwwbuugwgbbwrrrbugwrggb
ruwruggggguguurrwbrrwuguubrubrbggurwggwgrbrgwgggrbbbr
brbwubrwurbbrgrubgurrubugwwurrwbwuwguuwgwbwubgrwrgr
wrwrugrrbwwbbwbgrwgggrrbuwurwbuubrgruurrbwuwgrrubg
buuuuuruurruguruwgbuwurwggbwwwrubbubwrbubbuuwggwb
guurwurbgugbwbrguwuwrbwwbgbbbrrgrbbruggwgbguuwugbggrgbb
gruwgwrugbbrwbbrbrgruwrgrbguggbwrwrbuwruubw
gggbwgugwrubgwrbugbrgbwuugbwgbggrbbbgggb
grguwbugubgwrguwggbbwwwgwwbwubwrwrguugwbubrubwbbwrrrgruubb
uubuwurubrgbwgbwugurwwbwbrbbrrwrugurrwruug
rwgwbrwggugrggwwrbwwwwwwbuuubgurrurrwggrwbgbugg
wbrgbbbuwruguuwrwuwwbrrwbubburrgwbbgbubwuuwrbrwuwgbbrguggb
wgwuubbuuwugurgrbrwggbrguugbwrbgurbbgbrbburbwbuwwwuuw
urbruruwgrubgubrwwuuggwgrwrgubgwrguwbrrrwugrruwggu
uwgbrgugruggbrbbgrbuwwrgwgrurugwwbwbggwuwwrugwr
rbgggrrgrruubgubuwggwgugwwgguwgbrrubgrrugrwbwwubwubrrgggb
rrwggwgguuwgwrwrruuggwgrrbbrwwwwggggwuururrurrwugrgrrwwggb
wrbrwgbrbwbgwbwwrrwubgbrbwwuggrbguwbrrurubwrburrgggb
bbwuwrbbgrurugrubguguwggrgwugggggwrrwwrggbbwwwwwwr
rugbuubguwbgwwrbgwurbgburwbuwrruwuubrrrrgrbbruubwrbgwwubg
bbgwwuuuubbrwbbugbugbrugwwrrrgbwgbbwburgububuwbuguuwbwgg
rbbuburruggbrrgwguwwggwrurrgbubwruwubgbrrrwrwwuuwgrrurugu
brguuwgrwwurgrruwwgrbwwgwrbubgrwwrgwbwbwugguguwbrgbwwrwrrb
brbbwgrurwrbrbrurrbuuruwubrgbwrgbwrrgrgwwbuugggb
gwuuurugubbrwwrgwwugbbrwrbburbguuwwgurgwwbugwwubwwbrrbubb
wgbuubbugwgrrwgwwgbbwgrggwuubburuwgggburruggb
rgguururgbbuwurwwgugruguwbugwbuurrgbugbbugwgbwggugwbr
bwugubgwuwrwbwugurrrubrbwrgwruugwwgubrgbrguwrg
uuuuwrwbgwbwgbggwwubwuwugwbbwrububgugwrbbgwrbwrruwugwrgggb
wuwbbrrbrbwgwwbwgbwbwugwwgubwrgbgrwbgguuug
wuggrubbgubwbrbgbrurbwwrgbrrubgbubbugrrgugugbgbgurbggbgw
gguburrrrgrrwgwgwgbwrgbwgubruwubgbwgburugbwwgbrrggbwwru
rwubwburbburubwbbruwwguuuruguwwgbrbwggwbwggwbugrwbbgrrgg
rgruugbruwgwguggubruuurubwgbwbgwrgrugrwgwwwbbw
grrgwrwurwwurrrbuubwrbuguruurwgggwgbwbwbgwgg
bwrurgrwbrrrrgbrrburubbgbrbbrggwbbbwrugbwrrwr
brbuuruuwgbwwwbgwguurgbwguuburrwwwrggwrwbur
rwuuwrrbwguwuwuuggbwbuwubrwbrbgubugbbwubrrggb
wwwugbuwbbbuwbgwubgurburggbuwggruuwurbrwgrbbrubrwbgg
uwuwwbugwbgrurgrgwwbrbgubbrrwrgrrbwruurrgrgrubbbbb
uwgurgggrurbguubrwubwbbrrguuggwbbgbbubgubuuuwwwrguwwrr
guwburruurbuugrrbwwbbwbgwwwbgurrwubuurubbwgrwru
rwrggwuwggrrurrwbgrwggwwwurgwggrwuwuwwbugbbgwgugrgbu
bggwguguggwuwwrwwbrwwbrururbbwbbguubburugugwgrurggrur
ubbbbgbubrggbgguwgwwgurwbggwwbuubbbrrgbrrgwgbruggb
bgwurbwruugbggrrrurwurbwrwwrgwurbgbbubrurbugggb
rrbubbwbrbrurwwwrrgwuwwrgwrruwbbbgwbbrubbbwwruwgru
ggwurwuwgwgwbbbuuwrbuguuurwuuugruwbwgrbbggbwubgrguuug
rgwuwburwuuwrwwwbwgrggbburrwrrgbwwurrggwurb
grggrggbggurgubrrrurwgggugrgrwbgrrrggggrburgrrurbwgwrrrgrg
rrgbbwrwggbwbgwrgbrrwuwggrrbrwurwrgbuwwrurwruwwuuwrg
rggbgwbbrubbwuwwwwguurrrrwrgrubwuggbruguggwwwuggb
bgrbrugrwrrrgwgguggwgguurwurrwugburrrgrbgbbuw
bwbrbbggwrwbuubgwuuubbugwgwwbgrbuubgrgrwrguwrrbubbwrb
bwggwuggrbuwrgbrruuwuwrrgubguwrbuuwbbwwrbburur
uwwrubbwgwbrruguubwggwruubwgbbwrburubbwggbuwrbbgwrrugrr
brurbbwwrwwgrrgurubwwgurbuuwbwrrguuurgrwrrbrbuwrugbbwruu
bguggggwuruuwuwggbruuwruggguwbwurwggrwurgubrbuubr
ggurrbruwrrbwgwgbwbuubrugggrrrrgwbwwbgbggwrrwgrgrburrb
bubbbbbrwwwgwbugwggubgbubugubgwbugubuuugwbr
ugrbwbgruurububwrgrrgwggwbgrbwgrbgwwruuurb
`
  .trim()
  .split('\n');

const runs = [1, 1, 1, 1];
if (runs[0]) consoleTimeit('part1 sample', () => part1(inputSample));
if (runs[1]) consoleTimeit('part1 real', () => part1(inputReal));
if (runs[2]) consoleTimeit('part2 sample', () => part2(inputSample));
if (runs[3]) consoleTimeit('part2 real', () => part2(inputReal));
