import * as console from 'console';
import {keyBy, product, sum} from '../util';

type WORKFLOW = {
  name: string;
  conditions: CONDITION[];
};

type CONDITION = {
  variable?: string;
  operator?: string;
  value?: number;
  name: string;
};

type RATING = {
  [key in 'x' | 'm' | 'a' | 's']: number;
};

const parse = (input: string) => {
  const [workflowRaw, ratingsRaw] = input.split('\n\n').map((x) => x.split('\n'));
  const workflows: Array<WORKFLOW> = workflowRaw.map((line) => {
    const [name, c] = line.replace(/}$/, '').split('{');
    const conditions: Array<CONDITION> = c
      .split(',')
      .map((x) => x.split(':'))
      .map(([a, b]) => (b ? {variable: a[0], operator: a[1], value: +a.slice(2), name: b} : {name: a}));
    return {name, conditions};
  });

  const ratings: Array<RATING> = ratingsRaw.map(
    (line) =>
      Object.fromEntries(
        line
          .replace(/[{}]/g, '')
          .split(',')
          .map((x) => x.split('='))
          .map(([a, b]) => [a, +b])
      ) as RATING
  );
  const workflowByName = keyBy(workflows, 'name');

  return {workflowByName, ratings};
};

const ACCEPTED = 'A';
const REJECTED = 'R';

const part1 = (input: string) => {
  const {workflowByName, ratings} = parse(input);
  const acceptedRatings = ratings.filter((rating) => {
    let currentWorkflow = workflowByName['in'];
    let nextWorkflowName = null;
    while (currentWorkflow) {
      for (const condition of currentWorkflow.conditions) {
        const {variable, operator, value, name} = condition;
        const ratingValue = rating?.[variable];
        if (!variable || (operator === '<' && ratingValue < value) || (operator === '>' && ratingValue > value)) {
          nextWorkflowName = name;
          break;
        }
      }
      if ([ACCEPTED, REJECTED].includes(nextWorkflowName)) break;
      currentWorkflow = workflowByName[nextWorkflowName];
    }
    if (![ACCEPTED, REJECTED].includes(nextWorkflowName)) throw new Error(`Cannot evaluate workflow ${nextWorkflowName}`);
    return nextWorkflowName === ACCEPTED;
  });
  return sum(acceptedRatings.map((rating) => sum(Object.values(rating))));
};

const part2 = (input: string) => {
  const {workflowByName} = parse(input);

  const evaluate = (workflowName: string, range: Record<keyof RATING, {min: number; max: number}>): number => {
    if (workflowName === ACCEPTED) return product(Object.values(range).map(({min, max}) => (max >= min ? max - min + 1 : 0)));
    if (workflowName === REJECTED) return 0;
    const workflow = workflowByName[workflowName];
    let subRange = {...range};
    let result = 0;
    for (const condition of workflow.conditions) {
      const {variable, operator, value, name} = condition;
      if (!variable) {
        result += evaluate(name, subRange);
        break;
      }
      const rangeIfTrue = {...subRange};
      const rangeIfFalse = {...subRange};
      const {min, max} = subRange[variable];
      if (operator === '<') {
        rangeIfTrue[variable] = {min, max: Math.min(max, value - 1)};
        rangeIfFalse[variable] = {min: Math.max(min, value), max};
      }
      if (operator === '>') {
        rangeIfTrue[variable] = {min: Math.max(min, value + 1), max};
        rangeIfFalse[variable] = {min, max: Math.min(max, value)};
      }
      result += evaluate(name, rangeIfTrue);
      subRange = rangeIfFalse;
    }
    return result;
  };

  return evaluate('in', {
    x: {min: 1, max: 4000},
    m: {min: 1, max: 4000},
    a: {min: 1, max: 4000},
    s: {min: 1, max: 4000}
  });
};

const runs = [1, 1, 1, 1];
const inputSample = `
px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`.trim();

const inputReal = `
qrl{a<3707:R,s<1335:gl,x<3173:vh,A}
xv{x>3104:A,A}
cc{s>2833:R,s>2427:vct,s>2339:R,R}
hvz{m<2374:lfx,m<3387:xc,a<1085:qg,tsr}
rrj{a<3364:R,x<260:lx,A}
vbg{m>662:A,s<1158:R,R}
rdx{x>1903:R,R}
pl{x<131:hm,m<1494:nd,x>238:A,xp}
ckb{m<2209:R,a<3037:A,x>3883:A,R}
rdz{a>2663:A,R}
jx{m>1855:R,s>2178:A,jvp}
hjh{x>475:cm,rqc}
rqc{x<260:R,m<1542:A,A}
cqx{x>1597:nhq,pz}
gp{a<3338:kn,hcd}
fd{a>1557:fmk,m>953:A,A}
ks{a<3176:A,s>1370:R,A}
pm{m<901:nlt,a<271:ptx,jbb}
cdb{m<2049:nsb,a<3163:brd,s>2158:lnn,lmg}
bx{s<779:R,x<88:R,A}
qjh{m<3049:A,s>638:np,pbv}
ch{a>3043:ks,R}
brd{m<2186:R,x<662:nxk,dcp}
pmz{m<894:R,x<3724:R,a<2775:A,R}
rfg{m>1244:A,A}
cn{s<3571:R,A}
qxr{x>716:lxj,s>1843:qsm,nxj}
xq{s<2808:R,s>2861:R,A}
vr{a<3755:A,A}
nz{m>1189:lvp,A}
hxb{s<3605:A,x>949:A,A}
xn{a<3578:R,m>398:R,R}
rj{a>443:A,s>2497:R,a<425:A,R}
rtp{a>557:mbd,a<506:R,x<2419:A,rjk}
qd{x<1236:mk,s<2937:R,R}
sbt{a>3851:A,A}
bdn{s>1458:lpk,rn}
qh{a<3043:A,s>2651:R,m<1257:R,R}
hzn{s>3026:jp,x>1647:A,m>2318:vk,ml}
sdp{x>2756:A,m<928:R,m<1352:A,R}
zk{m>925:zz,a>2605:pxc,x<1285:xkj,gmg}
cpg{s<1090:A,R}
qp{a>3590:hf,x<1156:jtj,x>1335:cr,rkv}
gbz{s>2041:A,A}
hg{s<422:A,x<3026:R,a<3799:A,R}
pd{s<1336:R,A}
rf{m>3225:A,A}
mdk{x<3206:A,s>3594:R,a>3395:R,R}
klh{s<502:A,a>1328:R,A}
tx{m<3309:R,A}
gk{m<852:qgn,x<2335:A,a>3264:R,hx}
svq{x<2873:A,x>2914:hp,kc}
kvl{m<1246:R,R}
ng{m>1993:jr,s<3279:R,s<3560:vn,A}
nsh{m<2669:A,m<3118:R,x<1437:R,A}
frl{m>3364:pvn,A}
xfx{a<3773:rkc,m>586:kf,m>304:gn,htl}
mkt{m<644:R,a<651:R,R}
clp{s<825:A,R}
xtl{s>2395:A,A}
jtj{s<2124:A,R}
hcd{s>1083:nvk,a>3564:hg,m>2848:R,dp}
zcl{s<2171:tt,m>2094:A,s>2792:R,A}
jt{s<1619:A,x>2916:A,m<1099:R,A}
qkp{s<1278:px,a>3497:A,s>1882:ffj,A}
mml{m<3363:tlq,a>3196:lp,hzz}
bt{x>3651:A,A}
skl{x<1029:sh,m>408:gxq,vds}
ft{a<3037:tc,jvs}
kt{s<1697:A,x<3076:A,x>3161:A,A}
hd{a>971:A,s<2676:R,x<2406:A,R}
knr{m<3346:lt,m>3670:jbk,zxz}
pz{x>1381:cqz,R}
tpp{s<1171:R,a>3547:jg,A}
vbt{s<1623:bkh,x<1101:kg,a>3062:mml,xjq}
lnn{x<827:qmt,s>3206:A,x>1069:vkx,nqc}
cb{s>3327:R,A}
mgd{m>1674:ksr,R}
jpv{m<2575:kq,x<1532:qp,a<3638:gfb,hr}
nd{x<230:A,a<3686:A,a>3755:A,A}
hgh{a>538:R,s<1996:R,A}
jvs{x>443:A,A}
hgn{s>1774:A,A}
svr{m<1194:R,a>187:A,R}
mfz{s>3615:vms,a<2088:R,R}
ghd{a>298:A,a>114:A,R}
bc{m>1419:R,x>2001:spg,s<3329:qh,R}
rgl{s<316:A,a<1096:ff,m>3580:klh,qnx}
hdq{x<604:R,A}
gjl{a>1680:R,R}
dsb{s>1233:mz,s>809:jfn,m>3233:rgl,hz}
rzm{a<2334:R,s<1634:kmr,R}
mj{m<849:jk,s<3403:dmj,gzt}
vtt{x>1636:R,a>2858:R,s>2590:R,R}
cz{m<576:R,a<3747:A,x<1407:R,R}
zrv{m<1465:xpj,a>3380:mh,a>3125:cc,rsc}
pqc{m<1490:qxq,R}
jg{x>2647:A,s>1676:R,R}
rs{a<3029:A,x>483:A,a<3164:A,A}
tl{m<476:A,R}
nf{m<1461:R,x>53:R,A}
zn{x>3077:qrl,gc}
vg{a<535:A,x<3580:A,R}
lj{s>3153:xr,x<2411:dxp,knr}
vfb{m>891:pqc,s>1713:cgv,x<3121:xxl,vx}
nhh{x<330:R,x>601:R,m<1952:R,R}
gl{x<3137:R,a>3834:R,A}
hs{x<291:A,x>311:A,s>1579:A,R}
fn{x>495:qb,A}
hn{a>1922:A,R}
ntr{s<1871:A,R}
xgx{s<3832:R,R}
bs{s>2189:xdt,x<2812:rh,m<1931:qdj,gpc}
fmk{a<1708:A,s>858:A,R}
rkc{m>547:A,R}
nsb{a>3154:A,rr}
nxj{a<3128:tmz,tqm}
pxs{m<2213:gk,qkp}
sp{m>2380:dbb,m<975:xfx,a<3848:kd,gfr}
lnj{m<2229:A,m>2256:R,s>814:A,R}
cr{m<3109:R,xlz}
hdv{m<2642:ckb,s>421:fj,A}
dbn{a>3150:R,m<1624:gd,gbz}
zc{x<880:R,R}
dcp{a>3100:A,s<2376:R,R}
mdn{a>1602:bgb,m<2635:A,s>3125:rf,A}
pnm{x<978:ncl,s>3207:ck,ct}
nsz{x>2518:vz,m<2176:lmn,a>2336:A,xh}
sb{x<352:A,x>757:A,s>2955:R,A}
sg{s>493:A,a>279:A,m>839:R,R}
kn{x<3052:qfd,x<3152:R,A}
zdc{x<3793:R,m<3058:R,R}
pkm{m>1037:ckz,s>999:bpj,mc}
dtz{a<2459:tx,fc}
tb{a<3095:dfx,m<1459:lnv,R}
gn{s<2425:A,s<3424:A,x<333:R,A}
gt{x>3230:R,x<2800:A,A}
xjq{m<2905:mxj,dvn}
qxq{a<335:A,x>3234:A,R}
qgn{x<2265:R,R}
mxj{a>2963:R,vtt}
vds{x<1149:A,s<1145:R,A}
hh{x>2385:A,s<3011:R,x<2155:R,R}
nhq{s>1362:A,a>2891:A,R}
tsr{x<783:A,a<1194:R,A}
mq{m>3001:hgn,x>3935:mlm,s>1545:jvq,kj}
mp{m<710:A,m>743:vv,gs}
nt{m<1877:bpd,m>3212:gh,bj}
zd{m<988:R,a>2969:R,xf}
pvn{s>2621:R,x<1735:R,m>3689:A,A}
kf{a<3866:jdc,m<718:R,A}
pbb{m<1657:R,x>499:R,R}
jrl{m>983:A,s<458:R,a>668:A,mkt}
dfb{m>1245:ghd,grb}
njd{s<2992:R,nl}
gbv{a>902:R,R}
ckz{x>3062:A,a>195:A,A}
ncl{x<397:A,nxm}
px{x>2218:R,x>2144:A,m>2839:R,R}
nl{s<3516:A,s>3801:A,x>403:A,R}
ghg{s>1301:A,x<2691:R,A}
qmt{m<2180:R,R}
hmf{s>381:R,s>139:A,R}
qm{s>3551:R,m<540:R,R}
ff{s<497:A,m>3617:R,x<2266:R,R}
gd{m<1362:R,R}
ffp{x<1971:A,m<3079:A,A}
ct{a<2039:A,s>2903:htt,A}
fb{s<1864:tg,sgc}
kkh{a<1562:R,s<904:R,a>1725:R,A}
hjk{a<3776:A,R}
dvn{x<1692:gr,s<2897:R,R}
jdc{x<377:R,R}
bsv{s<3634:A,A}
fxx{s>2143:R,a>3887:A,A}
htt{s>3092:R,a>2263:R,R}
zz{s<3092:A,gqr}
gr{m>3456:R,m<3125:R,x<1479:A,R}
xdt{x<2900:zrv,pf}
cd{s>1295:A,R}
zgc{x>3871:R,R}
grb{s>264:R,s>97:R,x<2915:A,R}
mdc{x>1553:nq,dbn}
qgl{x<3219:R,x<3361:A,s>2508:A,A}
xxn{s>752:A,A}
kc{x<2900:R,R}
lz{a<1652:ng,x>774:qlv,ncb}
tsl{x<1850:cb,R}
mkq{m>990:kk,ltg}
gtb{x<1799:stg,a>1726:fq,m>3208:gvl,rls}
qrx{x<2528:A,m>706:R,a>464:A,A}
zqv{s<339:A,s>546:A,A}
jd{a>2609:pq,s>3012:R,a<2510:A,R}
vl{a>3592:R,s>2729:A,A}
qlr{m<1435:R,m<1697:A,x>704:A,A}
hqk{x>758:jpv,a>3561:sp,bdn}
hz{x>1667:R,m>2821:A,A}
jpd{s<608:A,a>2896:A,R}
rls{m<2855:khr,s<1026:A,x>2595:R,A}
dhm{s>1937:R,R}
pdf{x>2266:R,R}
mbj{x>1727:A,a<3673:A,m<3488:A,A}
qsm{m<656:ft,m<776:mp,ffq}
kbj{s<509:R,s<969:R,m>1256:A,A}
qxv{a>2978:R,m>1584:A,A}
dk{x>3754:A,A}
rt{a>1155:A,m>3689:R,a>970:R,A}
vpb{x>3851:A,s>2760:R,R}
gxq{x>1137:A,R}
qs{a<3656:xx,s>1787:kxf,a<3659:R,mln}
xhv{x>1293:kkh,gnp}
vpm{s<1403:R,x>1729:vl,R}
vms{s>3773:A,x>3680:R,R}
ltn{m<3113:A,x<2711:R,R}
xlz{x>1466:A,R}
hdj{m>2827:brx,djd}
nrx{x<3369:ltn,x<3655:A,x>3827:R,ghc}
bvx{m<788:R,R}
vc{s<1445:qxv,a<3123:dv,A}
dsr{x>1448:kbh,R}
zpq{x>1704:R,a>3077:A,a<2899:A,A}
crx{m<3470:A,A}
gvv{s<2992:R,a>469:R,kkb}
vh{x<3120:A,s<1621:A,x<3139:R,R}
tc{m<414:R,A}
gpc{x<3246:gp,a>3518:krs,x<3562:rl,bbn}
nx{a<3856:R,m<1304:R,R}
brx{a<296:ctt,a<477:vhl,a<610:rtp,dsr}
pf{x>3493:td,s<3312:knq,mdk}
rxl{m<1166:tl,a<1995:sbj,x<3577:A,vpb}
kd{x<295:pl,m<1541:df,x<559:zcl,jx}
bvq{a>2011:ppg,m<3551:R,A}
vdc{s>1207:vfb,a<459:lm,a<637:dgs,pb}
vct{x>2389:A,a<3269:A,a>3330:A,A}
ztb{s<388:kh,x>2951:zd,svq}
xkj{s<3112:R,qm}
lm{s>736:pkm,s<430:dfb,pk}
vjb{a>2149:R,s>3499:hc,s<3316:A,R}
kxd{a>750:A,A}
ksr{x<401:A,s<2419:R,x<583:A,A}
xh{s>997:A,s<391:A,s<731:A,R}
pbh{s>469:ls,m>1551:R,s<259:zt,cz}
rr{x>775:R,a<3112:R,R}
xxl{x<2787:A,R}
db{a<3119:tb,s>1589:vq,a<3139:pgp,zm}
sk{a<3242:bq,a<3352:A,m>2715:pd,cpg}
czc{a>2658:R,m<485:R,A}
rjr{s>3792:A,m>399:R,R}
ltg{a>2547:czc,s<3090:xg,s>3584:rjr,A}
drj{m>1093:vg,x>3516:A,R}
vqz{s<2290:vc,m>1734:rdx,x>1893:bc,tsl}
dp{x>3085:A,R}
kj{a<3277:R,R}
ns{x>2988:R,s<1179:A,R}
gdv{x<1772:R,s<1528:A,s>2015:A,R}
ntx{m>347:A,m>142:A,m<77:A,A}
zf{a>2972:kfv,cfb}
rn{s<813:spz,x>259:scp,ht}
ls{a<3629:R,s>897:R,x<1326:A,A}
jp{x>2020:R,m<2314:A,a<494:R,R}
szl{s>643:A,a>654:A,R}
rpm{s<1448:szl,R}
bq{s>985:A,a>2994:A,x>3695:R,A}
ml{x>591:A,R}
hzz{x<1669:A,R}
ptx{x<389:A,a>141:fgf,x<589:pbb,A}
kgb{x<1587:R,s>1129:R,m<2314:A,A}
tt{m>2007:R,s<931:R,R}
fl{s>2420:fvs,a<3678:mbj,s>1613:R,lpv}
cq{x>3325:A,s<1331:A,A}
dfx{x<706:R,x<903:R,A}
vn{x<1141:A,a>1523:A,x>1779:R,A}
spg{x<2039:A,s<3405:A,A}
jcz{s>487:R,R}
ck{x<1294:pmq,a>2188:gzv,cn}
bk{x<163:A,s>2092:A,A}
zs{x>917:R,tzk}
vv{s>3186:R,R}
jvq{a<3186:A,R}
spl{s<2561:nt,m>2388:lj,x<1769:bb,msm}
mn{x<3084:R,s>1566:A,m>646:A,A}
ds{s>2681:hbx,s<2150:ntr,x>355:rs,ld}
cxn{s>3070:mfz,rxl}
rsc{a>2911:R,A}
bjd{a>703:R,s>635:A,A}
jn{s>806:A,m<1271:A,A}
htl{a<3904:dbl,R}
rxr{s<1126:R,s>1698:A,A}
gfb{a<3516:frl,vpm}
rkv{x<1231:R,s>2006:dks,x>1300:zr,fp}
gtc{x<2566:A,m<1673:R,s>471:R,R}
kvs{m<1321:R,x>3726:A,R}
xf{s<708:A,s>813:A,x<3096:R,A}
xd{x<3816:A,R}
vt{s>3175:xfg,R}
bd{a<622:A,R}
mlm{a>3153:R,x<3970:R,a>3032:R,A}
xg{s<2859:A,a<2342:R,R}
jnq{s>1057:R,x>541:A,R}
jk{a>2327:A,a>2003:zpj,m>348:cj,pg}
dv{x>1976:R,s>1952:A,A}
xrb{m>1027:R,m>637:R,m<390:A,R}
qg{a<985:lc,R}
mb{s>1399:R,x>1301:dq,s<899:zqv,jtx}
tlx{m>1015:tq,m<429:bjd,stc}
ncb{m>2367:cdc,x>426:R,x<157:R,R}
cgz{s<677:R,R}
zps{m>1776:R,A}
rc{s>2621:xrb,m<1142:R,A}
jzv{m<2326:R,A}
gzv{s>3726:R,m>1107:R,R}
vq{a<3145:A,m<1346:bh,R}
mx{m>2007:A,R}
djd{m>2506:lcb,s<1900:jbg,hzn}
zh{x<3695:A,m<1169:R,pbg}
tq{m<1629:A,m<1814:R,s<494:R,R}
ctt{s<1941:kr,a<132:A,x<2363:lnc,A}
dxj{m>1817:tzz,jpd}
nkz{m<1289:R,A}
btp{x<2374:qjh,nrx}
kg{m>2889:crx,x<604:ds,a>2975:djl,zs}
sn{x<1512:A,A}
dm{m>529:R,m<328:R,A}
mc{s<882:R,R}
ghc{a<1544:R,s>1053:R,x>3765:R,A}
xl{m<2995:A,m<3217:R,a>1075:R,R}
cqp{x>1382:A,s<3137:R,m<1467:R,A}
mdx{m<458:A,s<869:R,x>901:A,A}
xfj{x>1656:A,m>3750:A,m<3517:A,A}
szh{x<591:R,R}
vkf{x>3696:A,A}
pqk{m<2006:ghg,tpp}
vhq{a>1187:mdn,hb}
djl{s>2819:R,zc}
jbb{s>1835:szm,x>463:R,A}
tg{m<2495:lks,a<1468:dsb,a>1631:gtb,btp}
lk{a<3709:R,x>2929:R,A}
zts{x>3096:tp,qx}
nr{m>1802:A,s>1078:A,m>995:R,R}
zld{a<390:mb,m<851:dqt,rpm}
jbg{s<896:jzv,s<1299:kgb,klv}
pmb{m<1417:R,s<442:A,m<1638:A,A}
lrg{s>3100:A,R}
gh{a>2368:dg,s<944:nk,s>1961:bvq,mft}
mr{a<2796:spl,x>2080:bs,a>3309:hqk,tr}
zl{m>1278:R,x>3283:jnv,x>3194:hqp,A}
fc{a<2611:A,A}
xr{x>2538:tph,a>2356:hxb,x<1619:cbk,vjb}
kkb{s<3362:A,m>1467:A,R}
gmt{m>3392:R,m>2936:A,s>3486:A,A}
nxk{s>1595:R,s>975:A,A}
jsx{m>3663:R,R}
zm{s<708:pmb,qlr}
hc{m>3256:R,m>2740:R,A}
dq{x<1809:R,A}
qvv{s<1183:kzp,s>1807:dhm,zh}
cqz{x>1511:A,m>1524:A,s<2131:R,R}
tzz{m<1978:R,A}
lmn{m>2040:R,A}
vkx{a<3224:A,m>2150:R,A}
fqz{x>2548:svr,ntp}
nxm{x<757:R,m>1111:R,s>3449:R,A}
xx{x<1834:A,s>1879:R,R}
mzp{s>2211:dt,m>986:dk,mnt}
dgs{a<576:qrz,x<3233:kbj,a<598:xcz,nnx}
mk{s<2993:A,A}
xc{s>3026:xl,x>761:R,x>440:A,xtl}
zxz{m<3536:A,s>2932:R,xq}
zlz{s>286:A,a<2864:R,A}
nb{x<286:bk,m>3457:A,m<3354:R,R}
qct{m<1814:R,A}
ppg{m>3529:A,m>3359:A,s>2212:A,R}
kfv{x<2971:jt,a>3073:gf,a<3035:mn,kt}
nqc{a>3259:A,s>2625:A,s>2324:A,A}
rfk{s>1484:A,x<1650:R,s>1143:R,A}
vk{a<415:R,R}
bg{x<1088:R,a>2982:R,a<2893:R,A}
rjk{a<539:A,m<3505:A,R}
scc{m<3626:A,A}
cll{s>880:rph,a<2324:A,A}
qcs{x>841:zld,pm}
gf{x<3119:R,R}
nvk{m<3199:A,a>3592:A,s>1529:R,A}
fq{m<3440:R,m>3803:sz,A}
sv{a>3687:R,s>2035:A,s<1816:A,R}
in{a>1826:mr,ddg}
cp{x>345:A,x>210:hs,m<3772:A,hjk}
pbv{s>235:R,R}
zpj{x>2265:R,s<3244:A,A}
mln{m<3479:R,m<3687:A,a<3662:A,A}
xpj{a<3571:rd,x>2382:A,s<3097:A,R}
sbj{s>2872:A,a>1892:R,x>3380:A,A}
rx{a<2706:A,m>367:R,A}
dbb{m<3265:qrv,m<3589:nb,cp}
kzp{x<3650:xb,A}
ht{a>3452:kv,x>125:jmg,m<1365:dm,R}
qx{a>539:js,a<344:fqz,m>1027:gvv,lgm}
scp{x>522:dfc,a>3472:nr,tj}
khr{m<2622:R,s>773:A,A}
klv{m<2327:A,A}
mbd{s<2440:A,R}
qb{s<2401:A,A}
ps{m>1593:nhh,s>1570:sbt,a>3854:nx,kvl}
hqp{x<3253:R,A}
fst{s>1197:A,m<650:R,R}
dvf{a>763:A,A}
dqk{m>2141:hdj,x<2194:qcs,s<2084:vdc,zts}
xfg{s<3291:A,x<840:R,s>3387:A,R}
pgp{m>1354:A,m>1220:R,m<1112:R,R}
jnv{m<798:R,A}
kmr{x<2272:A,a>2513:R,m>2758:A,R}
vhl{a<410:R,s<1735:pdf,rj}
lnc{x>1528:R,s<2800:R,R}
mf{x>1019:nv,mdx}
qrv{x>476:R,m>2800:A,A}
dxp{s<2790:dtz,qd}
sq{x>960:R,R}
bh{s<2551:R,m<1205:R,s>3121:R,R}
jbk{x<3317:A,x>3747:zgc,fgj}
gc{a<3555:R,m>842:R,s<843:A,lk}
ntp{s<3243:R,R}
rd{a<3282:R,m<546:R,s>3209:R,R}
xcz{x<3731:R,s<532:A,s<846:cgz,R}
pp{m>383:R,R}
mtm{x>2210:gt,a>2632:R,x<952:R,R}
gzt{x<2342:R,s<3797:A,hq}
vz{s<1128:R,x<3482:R,A}
zt{m>1023:R,a>3688:A,A}
hx{m<1312:A,a>2992:A,A}
kk{a<2501:A,a<2693:R,x>3353:A,A}
xs{m<1672:R,R}
nq{x<1697:zp,s<1941:qct,gld}
qlv{s>3278:A,A}
pbg{a<3401:A,R}
dfc{s>1103:A,x<656:A,a<3414:R,A}
pq{a<2710:R,a<2765:R,A}
cfb{s>1703:R,m>1121:R,ns}
gqr{x>1315:R,x>1189:R,A}
dbl{a>3839:A,m>154:R,a<3802:A,R}
fgj{m<3815:A,m<3908:R,R}
hm{m<1831:A,s<1547:A,x>49:R,R}
pxr{s<424:A,R}
knq{s<2710:qgl,R}
fp{x<1276:R,A}
vx{m<331:R,R}
bdv{m>3683:R,x>1850:R,A}
mft{m<3580:R,a>2109:R,m>3777:hn,rfk}
thm{m<2255:R,s<372:A,A}
hp{m<874:A,A}
hf{x>1239:zcq,hzf}
nct{s>1436:zdr,a<2108:A,A}
pb{x<2924:tlx,a>713:gkn,jrl}
pmq{x>1183:A,m<1043:A,A}
szm{s>2844:R,A}
gfr{a>3906:mgd,a>3878:rqg,a<3858:ps,qjg}
xb{a<3398:R,a<3658:R,x>3474:A,R}
lxj{s>1962:sn,x>1210:pp,a>2972:mf,skl}
tqm{x<243:bx,jnq}
nnx{x<3631:xxn,s<463:bd,x<3777:clp,jn}
xz{m>925:R,xn}
nlt{m<571:R,a<350:bvx,s>2458:A,cpc}
kr{a>159:R,m<3346:R,R}
rl{x>3366:fz,fv}
ld{a>3005:R,m>2646:R,A}
cpc{a<574:R,a>672:A,A}
dqt{m>361:R,hgh}
lfx{x<910:A,a>1007:cqp,gbv}
rph{m>689:A,m<440:R,R}
sz{a>1790:R,a<1756:A,A}
ppd{s>1383:zps,dxj}
nmc{s>3142:kvs,a<2635:A,R}
kbh{m>3513:A,x<2804:R,A}
fj{m<3546:A,m<3704:R,R}
djs{s<927:R,a>1245:R,x>1352:A,A}
pk{s<555:sg,x>2823:bxt,R}
lcb{a>318:A,m<2657:A,R}
lvp{s<1549:R,a<3234:A,A}
dt{x>3786:R,A}
jvp{a<3693:R,s>1303:A,R}
xp{m>1936:R,m<1784:A,R}
jv{x<3532:A,R}
qrz{x>3194:A,m>1109:gtc,m>523:A,ntx}
rqg{x>311:A,x>114:xs,nf}
qjg{x>467:A,R}
bgb{x>2990:A,s>3202:R,m>1998:R,R}
kvb{x>658:R,s<1431:A,s>1780:A,R}
cxg{x>1276:A,R}
tzk{x<720:A,x>848:A,R}
cgv{a>343:R,R}
zsd{a<2554:xd,a>2678:sl,nmc}
spz{x>308:A,mx}
krs{s>736:tm,rxf}
bkh{s>992:ch,jfc}
rxf{m>2865:A,a<3730:thm,R}
hcg{s>2352:R,gdv}
lmg{m>2174:lnj,m>2091:kvb,m>2073:R,R}
fv{a<3100:R,m<2999:rxr,x>3297:cq,zb}
fvs{x<1792:A,x<1941:R,x>2022:R,R}
cx{a<3069:ppd,m>1830:cdb,a<3179:db,xlc}
kq{s<1395:pbh,s>2575:xz,x<1600:vr,sv}
gkn{m>1244:kxd,s>754:dvf,jcz}
xlc{m<1399:nz,m<1647:hjh,s<1756:szh,stj}
gvl{m<3550:gjl,s>939:A,x<3101:R,pxr}
mz{m<3126:A,s>1525:rt,s>1337:R,bdv}
bbn{x<3821:sk,s>1182:mq,hdv}
sgc{x>2135:vhq,a>1340:lz,hvz}
ffj{s<2040:A,m<3137:A,a>3126:A,A}
zb{s>788:R,R}
tr{m>2296:vbt,m<998:qxr,x>1248:km,cx}
qdj{x>3221:qvv,a>3251:zn,s>910:zf,ztb}
xjr{m<1144:fh,s>3488:th,x<648:jd,vt}
cdc{x<430:R,m<3008:R,R}
rh{x>2462:pqk,pxs}
df{s>2233:A,x>532:rfg,nkz}
tph{a<2207:ll,m<3325:bsv,x<3403:R,bt}
js{s<2911:sdp,a>709:R,A}
fgf{m>1613:A,A}
hq{a>2467:A,s>3931:R,A}
bhd{m<2692:A,x>2373:A,R}
zdr{x>2174:R,A}
rz{m<965:A,R}
jfc{m<3394:bg,x<1172:A,zpq}
sh{a<2896:R,m<385:A,x>826:A,R}
gnp{a<1557:R,m>1142:R,x<744:R,A}
nk{a<2015:hmf,jq}
dks{s<3214:R,R}
th{s>3663:R,A}
gs{m>721:A,A}
lgm{m<661:R,m>791:R,x>2722:R,qrx}
zcq{m>3246:A,a<3729:R,R}
jmg{a>3358:R,A}
cj{s>3308:R,m>560:R,x>2318:A,R}
bb{a<2433:pnm,x<1019:xjr,zk}
bxt{a<258:A,m<770:A,a<364:R,R}
pg{m>209:A,x>2514:A,a>1916:A,R}
lx{s<2395:A,R}
fh{s<3429:sb,s>3774:A,A}
fz{m<2975:R,scc}
pxc{s>3198:cxg,s>2946:rx,R}
km{x>1788:vqz,a<3040:cqx,mdc}
ddg{a>808:fb,dqk}
hzf{s<2546:R,a<3800:R,A}
sl{a<2751:A,a<2766:R,a>2785:R,pmz}
ll{s<3646:R,A}
tp{s>2867:drj,s>2449:rc,x<3430:zl,mzp}
np{m>3443:A,s<1288:A,A}
tlq{s>2450:R,nsh}
bpd{a>2410:mtm,a>2175:cll,a<2046:cd,nct}
qnx{s>642:A,R}
tj{m<2578:R,R}
mh{a>3677:bhd,x>2614:A,R}
dmj{a<2170:A,m>1428:hh,m<1094:A,R}
jtx{a<254:R,x>1116:R,x<940:R,R}
bl{m>3510:A,x>1826:ffp,fxx}
hbx{a>2995:A,R}
msm{x<3065:mj,a<2221:cxn,x>3515:zsd,mkq}
zp{a<3141:A,A}
stc{a>708:R,x>2591:A,R}
tm{m>3125:jv,m<2451:R,vkf}
gld{a>3219:R,R}
vp{x>440:A,m<1157:A,A}
lpv{s>793:A,A}
qfd{a>3049:R,s>954:A,A}
zr{m>3468:R,m<3166:A,s<1178:A,A}
stj{s<2879:hdq,x>653:sq,s<3584:A,xgx}
hr{a>3762:bl,a>3690:hcg,a<3666:qs,fl}
mnt{x>3744:A,s>2153:A,a>456:R,R}
ffq{a<3051:lrg,s<2946:A,A}
lc{m<3648:R,x>864:A,A}
jr{a<1511:A,m>3207:A,A}
kv{x<119:R,m>1521:R,s<1077:R,R}
dg{a<2607:A,A}
tvs{m<1456:vbg,A}
lp{a>3250:xfj,jsx}
jfn{x>1688:A,x<1051:R,s>1033:A,djs}
bj{m<2329:nsz,rzm}
bpj{m>448:R,s<1134:R,A}
lnv{m>1182:A,A}
lks{a<1320:tvs,x<2236:xhv,fd}
gmg{x<1490:R,R}
jq{x>1909:A,s<611:R,A}
lpk{m>2259:njd,a>3441:vp,m<1079:fn,rrj}
kh{s<152:rz,a<2962:zlz,a<3110:R,A}
cm{a<3226:A,m<1506:R,R}
stg{x<1038:R,R}
cbk{x>1003:gmt,A}
kxf{s>3170:A,A}
lt{x<2946:R,a<2192:R,a<2411:R,rdz}
nv{s<926:R,m>373:A,a>3156:A,A}
td{m>2018:zdc,R}
hb{x<2787:hd,x<3294:xv,s<3246:R,R}
tmz{s<789:A,fst}

{x=2621,m=748,a=3275,s=2837}
{x=1088,m=549,a=142,s=2751}
{x=1306,m=420,a=1195,s=3}
{x=475,m=985,a=1456,s=359}
{x=3118,m=3737,a=426,s=180}
{x=2629,m=135,a=1119,s=280}
{x=1162,m=511,a=1598,s=1763}
{x=335,m=231,a=1940,s=669}
{x=386,m=678,a=280,s=974}
{x=998,m=400,a=146,s=1416}
{x=652,m=2610,a=951,s=3}
{x=1735,m=1361,a=592,s=2058}
{x=125,m=449,a=940,s=2999}
{x=3033,m=108,a=345,s=888}
{x=3099,m=929,a=320,s=465}
{x=580,m=38,a=959,s=1102}
{x=877,m=1638,a=2084,s=1213}
{x=1787,m=285,a=2397,s=965}
{x=1049,m=213,a=267,s=2642}
{x=21,m=27,a=2138,s=669}
{x=45,m=173,a=1716,s=2232}
{x=108,m=995,a=792,s=2712}
{x=1487,m=226,a=2204,s=984}
{x=918,m=471,a=85,s=2089}
{x=212,m=807,a=312,s=3264}
{x=1428,m=2409,a=742,s=1102}
{x=617,m=89,a=607,s=448}
{x=112,m=468,a=141,s=1799}
{x=821,m=1642,a=1733,s=314}
{x=1100,m=35,a=753,s=1455}
{x=1429,m=374,a=191,s=745}
{x=148,m=981,a=785,s=431}
{x=2143,m=333,a=638,s=428}
{x=3298,m=80,a=1149,s=92}
{x=500,m=103,a=1396,s=518}
{x=2066,m=725,a=249,s=1074}
{x=457,m=221,a=541,s=184}
{x=653,m=1762,a=1048,s=197}
{x=885,m=2586,a=673,s=171}
{x=721,m=1604,a=2023,s=100}
{x=327,m=1105,a=2837,s=27}
{x=937,m=948,a=58,s=1830}
{x=830,m=765,a=494,s=2536}
{x=44,m=861,a=420,s=391}
{x=845,m=356,a=2518,s=1018}
{x=238,m=1611,a=1216,s=2089}
{x=785,m=108,a=822,s=852}
{x=1780,m=718,a=2276,s=1000}
{x=334,m=1056,a=2009,s=239}
{x=469,m=490,a=1449,s=2905}
{x=3681,m=1288,a=942,s=1369}
{x=601,m=217,a=343,s=2660}
{x=169,m=2510,a=149,s=1150}
{x=358,m=2243,a=471,s=193}
{x=396,m=968,a=901,s=1878}
{x=1447,m=2368,a=1064,s=199}
{x=1574,m=336,a=1349,s=1770}
{x=1183,m=304,a=1019,s=441}
{x=387,m=1959,a=240,s=1067}
{x=314,m=507,a=1344,s=2112}
{x=644,m=205,a=127,s=339}
{x=1197,m=479,a=1559,s=1261}
{x=2182,m=656,a=1174,s=780}
{x=411,m=1425,a=312,s=148}
{x=858,m=123,a=502,s=388}
{x=54,m=82,a=162,s=3555}
{x=255,m=3087,a=282,s=106}
{x=146,m=1535,a=162,s=992}
{x=314,m=65,a=554,s=243}
{x=2333,m=368,a=195,s=464}
{x=3094,m=360,a=2674,s=137}
{x=2249,m=789,a=217,s=391}
{x=2458,m=1632,a=169,s=222}
{x=1126,m=299,a=2031,s=3265}
{x=756,m=2000,a=1762,s=1503}
{x=43,m=1905,a=442,s=969}
{x=1822,m=92,a=239,s=1815}
{x=428,m=613,a=584,s=659}
{x=966,m=82,a=9,s=132}
{x=1483,m=583,a=552,s=352}
{x=27,m=151,a=3528,s=3674}
{x=2651,m=1753,a=11,s=2070}
{x=1837,m=910,a=178,s=2018}
{x=1092,m=1390,a=1419,s=2375}
{x=687,m=1023,a=421,s=940}
{x=2184,m=52,a=164,s=2717}
{x=2836,m=586,a=669,s=1351}
{x=410,m=295,a=61,s=34}
{x=134,m=640,a=1092,s=1231}
{x=1154,m=2666,a=147,s=2033}
{x=2153,m=52,a=2865,s=2549}
{x=2261,m=5,a=630,s=1894}
{x=890,m=370,a=14,s=1333}
{x=246,m=3492,a=560,s=2558}
{x=1275,m=2566,a=624,s=2644}
{x=1353,m=1826,a=208,s=2045}
{x=987,m=2171,a=518,s=2096}
{x=2275,m=1106,a=264,s=3166}
{x=941,m=2470,a=283,s=629}
{x=2106,m=1615,a=329,s=3077}
{x=819,m=119,a=6,s=487}
{x=2854,m=28,a=1025,s=1484}
{x=357,m=1482,a=128,s=1438}
{x=315,m=48,a=2182,s=457}
{x=523,m=1565,a=360,s=2673}
{x=547,m=906,a=319,s=795}
{x=1132,m=2115,a=2356,s=1821}
{x=432,m=375,a=2699,s=331}
{x=652,m=1264,a=624,s=3095}
{x=984,m=1957,a=2879,s=1228}
{x=76,m=316,a=2360,s=2945}
{x=144,m=112,a=1943,s=1574}
{x=57,m=540,a=228,s=360}
{x=938,m=102,a=616,s=470}
{x=15,m=38,a=743,s=348}
{x=43,m=1479,a=2057,s=100}
{x=1266,m=671,a=329,s=74}
{x=1907,m=367,a=365,s=316}
{x=3405,m=281,a=39,s=76}
{x=5,m=763,a=451,s=1022}
{x=818,m=1960,a=1160,s=116}
{x=1591,m=86,a=60,s=1100}
{x=859,m=673,a=371,s=255}
{x=1977,m=126,a=3036,s=747}
{x=2088,m=523,a=430,s=2385}
{x=278,m=1788,a=2913,s=1607}
{x=818,m=1038,a=1039,s=646}
{x=664,m=231,a=132,s=3540}
{x=282,m=692,a=1350,s=501}
{x=785,m=1826,a=138,s=1021}
{x=1212,m=87,a=1171,s=311}
{x=1926,m=1880,a=237,s=1081}
{x=1749,m=254,a=978,s=1261}
{x=374,m=797,a=1464,s=3267}
{x=839,m=3048,a=3096,s=799}
{x=2242,m=532,a=866,s=940}
{x=825,m=174,a=1647,s=1327}
{x=1,m=117,a=1925,s=351}
{x=1453,m=753,a=782,s=3056}
{x=1907,m=2289,a=478,s=3855}
{x=1731,m=1062,a=413,s=147}
{x=3224,m=114,a=764,s=254}
{x=1360,m=215,a=572,s=52}
{x=559,m=1236,a=1522,s=798}
{x=46,m=1292,a=240,s=13}
{x=1048,m=653,a=3555,s=3453}
{x=871,m=2088,a=1443,s=1687}
{x=790,m=322,a=2354,s=778}
{x=1557,m=669,a=2836,s=1361}
{x=412,m=24,a=2144,s=733}
{x=40,m=1832,a=2372,s=605}
{x=125,m=714,a=1265,s=328}
{x=106,m=856,a=367,s=1246}
{x=837,m=255,a=511,s=218}
{x=248,m=1648,a=296,s=1873}
{x=209,m=133,a=1828,s=87}
{x=201,m=1736,a=233,s=1320}
{x=510,m=531,a=1703,s=198}
{x=1307,m=462,a=24,s=717}
{x=1354,m=1757,a=557,s=311}
{x=2561,m=2564,a=513,s=1801}
{x=825,m=403,a=810,s=3178}
{x=1079,m=2317,a=796,s=9}
{x=272,m=83,a=1399,s=1604}
{x=617,m=740,a=2087,s=1633}
{x=2814,m=46,a=1245,s=327}
{x=521,m=1306,a=2467,s=1860}
{x=1791,m=1224,a=1079,s=847}
{x=533,m=27,a=734,s=2337}
{x=201,m=2727,a=208,s=1998}
{x=143,m=625,a=1945,s=1468}
{x=1394,m=1469,a=2576,s=45}
{x=280,m=131,a=2559,s=5}
{x=596,m=54,a=3237,s=378}
{x=2769,m=804,a=491,s=35}
{x=31,m=1355,a=1255,s=61}
{x=317,m=447,a=218,s=101}
{x=3447,m=760,a=1211,s=2073}
{x=484,m=45,a=660,s=46}
{x=2338,m=284,a=3353,s=1207}
{x=1242,m=169,a=3,s=187}
{x=2928,m=1528,a=412,s=976}
{x=445,m=1910,a=810,s=950}
{x=2341,m=272,a=2052,s=754}
{x=1404,m=692,a=843,s=1382}
{x=729,m=1114,a=36,s=1687}
{x=1585,m=26,a=1340,s=87}
{x=2188,m=651,a=1534,s=31}
{x=1565,m=1779,a=840,s=810}
{x=801,m=161,a=236,s=252}
{x=3228,m=690,a=260,s=2421}
{x=395,m=2258,a=2114,s=130}
{x=1260,m=2483,a=87,s=684}
{x=1584,m=1856,a=686,s=937}
{x=1857,m=803,a=488,s=115}
{x=781,m=23,a=412,s=8}
{x=16,m=411,a=323,s=24}
{x=4,m=2202,a=75,s=620}
{x=1532,m=979,a=2602,s=812}
{x=8,m=103,a=231,s=1810}`.trim();

if (runs[0]) console.log('part1 sample', part1(inputSample));
if (runs[1]) console.log('part1 real', part1(inputReal));
if (runs[2]) console.log('part2 sample', part2(inputSample));
if (runs[3]) console.log('part2 real', part2(inputReal));
