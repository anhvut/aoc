import {timeit} from '../util';

const parse = (input: Array<string>): Array<[string, Array<string>]> =>
  input.map((line) => {
    const [source, destinations] = line.split(': ');
    return [source, destinations.split(' ')];
  });

function collectEdgeUsage(edgesDict: Record<string, Record<string, boolean>>, vertices: string[]) {
  const edges: Record<string, Array<string>> = Object.fromEntries(
    Object.entries(edgesDict).map(([source, destinations]) => [source, Object.keys(destinations)])
  );
  const edgeUsage: Record<string, number> = {};
  const firstReachable: Array<string> = [vertices[0]];
  let isFirst = true;
  for (const source of vertices) {
    const reachedVertex: Record<string, boolean> = {};
    const visitedEdge: Record<string, boolean> = {};
    let toExplore = [{current: source, nextVertices: edges[source]}];
    let currentDistance = 0;
    while (toExplore.length > 0) {
      currentDistance++;
      const nextToExplore = [];
      for (const {current, nextVertices} of toExplore) {
        for (const next of nextVertices) {
          const edge = current.localeCompare(next) < 0 ? `${current}-${next}` : `${next}-${current}`;
          if (visitedEdge[edge]) continue;
          visitedEdge[edge] = true;
          if (!reachedVertex[next]) {
            reachedVertex[next] = true;
            edgeUsage[edge] = (edgeUsage[edge] || 0) + 1;
            if (isFirst) firstReachable.push(next);
          }
          nextToExplore.push({current: next, nextVertices: edges[next]});
        }
      }
      toExplore = nextToExplore;
    }
    isFirst = false;
  }
  return {edgeUsage, firstReachable};
}

const part1 = (input: Array<string>) => {
  const edgesDict: Record<string, Record<string, boolean>> = {};
  for (const [source, destinations] of parse(input)) {
    edgesDict[source] = edgesDict[source] || {};
    for (const destination of destinations) {
      edgesDict[source][destination] = true;
      edgesDict[destination] = edgesDict[destination] || {};
      edgesDict[destination][source] = true;
    }
  }
  const vertices = Object.keys(edgesDict);

  while (true) {
    // collect edge usage count between all pairs of vertices and remove most used edge
    const {edgeUsage, firstReachable} = collectEdgeUsage(edgesDict, vertices);
    if (firstReachable.length !== vertices.length) return firstReachable.length * (vertices.length - firstReachable.length);
    let topEdgeUsage = Object.entries(edgeUsage).sort((a, b) => b[1] - a[1])[0];
    console.log('removing top edge', topEdgeUsage);
    const [from, to] = topEdgeUsage[0].split('-');
    delete edgesDict[from][to];
    delete edgesDict[to][from];
  }
};

const runs = [1, 1];

const inputSample = `
jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr
`
  .trim()
  .split('\n');

const inputReal = `
pxp: gxj tdh cmx
fls: dhz mdf ngs rkp xhh
vnh: rvt
tqv: cbs vnf
qtj: sjr zjm bpd
rjm: xtq hxk
pqp: kbl blz
ljj: bsm zqb jsj lqv jzk
mlm: hsj
zzn: btl fgk ccd nxl
qnt: ljl ksd
tlg: fqf
rcr: mkx qsf
pln: pjl
vbk: nkv ndx
kmr: xxg mqk
lcb: vrx
sgz: npg
zkj: rhs psv
qfb: lrt hxl dbh
gbh: jbq
zvh: pdz bsm psc tlx
tjl: vst crf nkl qld
pst: cqk vss mfj
fvt: xrq xkt xds
xqb: hvn zkt xbn
jjs: bdv jcl
trs: hdx sbp bsl
mmh: tfs hvn mgb nqh
jxf: zjj khk
xdl: qvm rvg cgn
fqp: jhl qlq
fmz: zpr
rcl: ggx
gcn: dgr rpd khk
smk: dzv clc
xfv: flf
fkf: stc qdj
zxl: ggx tcp mpg jfx
bld: hdx dhq
ltv: clg ssx pvc gkf
pbd: dlm svk jgq
sql: qpp cxd xqj cdk pqg kbf
mcm: tzb cvc pvz ntf
xlv: nfj bpd bmr
nsd: rrj
cxn: ncx
qpn: ngz nkn
rqv: pcc grk
bbl: lzl
lxx: vrl
kxc: cqs hxr mqn
xhf: cqk zvk nzs qdj
cjc: ntk
dpt: qgz
hss: jdg mgg gtl fmz
bjx: rql bmr xfj
vkx: nfb kcs qdj
sqn: zkj
ctj: xlp fqj
tsf: bpm qhp bsm
sqv: rgn zkj
dmq: bcd hxl blt
hhc: rxm ghn lzg
snf: mkv xkt jjg
zfz: gnk
cqz: sqv tsc hpz
xjs: lmg
dpx: rnd qjx nzg
hxr: tpn
rvk: gkr kcl gkf ccg txh
hdh: rmb bkv thf
xhj: jmj
pxn: sjq brs jzk mkx
bkr: ltq pzx scg sjg
sls: nkc xpc kvp njt
fhn: blm slv hqv cgz dmb
njt: zjr rcj qxf fst
mtm: jpq
bbm: bkv slr
tzh: dnt lxf mcg
gdv: vsh zvr
dtv: ndr qpb mlj
qbm: rgr cfl djv jfr
bgs: cvg
qct: glj jzk cgk xlj
vff: rxm jgc
djd: rzc jbv slj kmd
qxm: zbt jhq cfl hpl grh
dxb: jfr cvd dds
nnl: rrf
vqz: rzp ngs zhf
mlh: npg
snt: srz zgs
qxf: vhc sqd kjp
tdt: krf xdx nzz xqs
qvb: jxb
tfx: fvk ldv khc
shv: htq hxr mlb rtv
sxj: xvq zlb sqs nqt
kns: xfj djd
pmf: cgt tkz nnl hkl
rqf: tcr glj sgz
jfx: lkf ftm jmf cch
hmf: cxd
phl: jcp
lvg: tss blz
hbp: qtr
kfj: jvn nbs ppx
bnb: jtr cht mqn jpp
rmb: jbn gjj pxl
ttk: sfs khc
bjr: bxz jgq
hfp: gpl
xfj: jsj
nbh: nsx
cns: dtx jhs kxj sdp
pzx: fcb khn hbp
dhh: qgb
rhg: phl nsp
nhb: npm szm
zxx: rqh bkk lcc
xkm: zqb rcn nlm tms vqz
fmd: rqf nfb nsr pts pdg
qhn: fmm qzj vzv bqg
ncb: kxj gfd lsg
zjr: ltq
tdl: dbx
hhk: vbj dnt fgh ksn bhm
gpl: ggz
ddp: rfc crm tfs fcr xxl hsc
sfz: hbs hmf xch hlt
fkm: cgd mlm
rvt: vdl
lbl: rqd pxc
rqt: tkg
ntk: mft nhg
kmt: pjl xmv
llb: bdv dxv kgz
rtv: zgs
bng: zjq cvg qxj
hkl: flc
hlt: mqk
vrl: nkc zhh
glr: rpb kmd fbj csz
kcc: qzj nxc scg hnh cqz xhr
pdm: vqk rpb htz zjq mlc nbk
ljg: pdg qhc fth cjk zlv
bzc: bkr jrg lbl
rjt: nfj lpt
tbf: mbv plc
vzz: sxv mdf
krf: klt ksf bht lpp
sqx: hxc khj
plv: csj lrt qjs pmg
fsr: gzx kbz rbv
pgm: tcb
lzg: vtl xpg zpv
qvs: shc
lzf: hvf slr
jxk: kmd rqz bjr psh
vhl: qdc tpl pmg
tzq: lpx lnv ghn hcd
mpb: vhl dlr
ndr: lfk dds
mbs: hpx bhm hdp lsh
rjg: rvt tgh tqq lrt
hkh: nzv cfr qfg jtr
nkb: nhg pxc skr khf
kvp: qdx ghb zqs
clr: jzv gcp pcc ctj blt
cjx: nvx jvn zmp
jbn: jln
rzc: fvn lxz
bmm: xkv pcf lsd skr bbm
hbg: phf hrb xhk fqp
qxd: dtx cgp cch
prz: rtk qvb sjg lsg
fsx: nfn vrg sjr
nbs: zxh
jhq: nbs kbz
rfk: jxb chg jpr cmb
nkl: fhx rqv nhl vnh
jpr: fds vvh cxg
qxl: vrq kjp xpg
mfk: mkh fhv
lcc: mvv cpj
nkt: vnn hdx mqq
sxb: dbd cdd bzs xqd
fml: gcn mrq zss
hgf: rlx zqh
rxt: rgn
thf: jhl gkp
jgc: sfs
rzg: tpl
dfr: lhg
nzv: btt brg
dqp: shc rgb scs
gll: ztf zhz cfc vrl
ptq: vdl gbz
jlb: cgn nsp nzs
tcr: svk zjq
csj: mxr mlh sxv
fnf: zrv rgb fqj
jpz: rhs dzs hnl
vph: dqg
qld: zhf rqf lsx
ckg: fgg zbt zzf
bvr: slh cfr xfj hzg rcr
vkp: fkp tcv ktk rhf
mcs: gfl tgh tfs
ckn: vsr nfk nsx zkq
brt: pls llb npm lgx
dnl: jlk lxf
jmd: zzf pzx bsl tjr
bgx: kjp fvk
ckv: mpb sml
tlx: qdj
hgm: zhl dgl hrs nsd xtk ggz
klt: mpp
ccx: rql jxv sgg kpd
krz: zff mxn fvv ckg
mtt: qdj xlp sxv cts
lsc: jdk mqq nsd pnj
cgk: ldm mnq
xdx: hrt
vjx: prp
mvd: tts vfs
hgk: jhs mft mqr
qnc: hdd stc
pxd: lcb txq jkz ldv
qxj: msh sxs
lfj: fbv xfv scg mtg
ggb: zxd nzs llh cnn pgm
hff: lrp
dmp: cbs
dnb: ppx zfz bpp
krl: gss nzg
mmt: nsd hlt vpk
zfh: tlz smk pzr xjp lcc gng
lpp: ghs
sqg: gbz
rtc: cdk nvx hgf cgp jxf
hnh: hhc
gmk: gxj mqh jhl
bsh: ccl jxb fjr gfr
bvd: phf qlq mqf
pts: mlm xxt btj
dcq: mkm btd fdh rbv
rlp: knz vcc
nqd: qpm zkm cxn
zgh: hnl zsl
dgl: jvn lcb xrq jfl kgz
dsd: mbg
cfr: nkq mkp ddr zpn
tnt: cgj tdl cng jfl
ldr: xdx qvm fmz
bqq: gfr zsl lnv dhh
dkk: fxc xjv cdk tcx
rhs: lxp
xcf: jjs djk khc
zqv: kfj bhl pqp gtp
bjb: zss kgm zrf ppx
rnf: lbk bpb qcs zhs
bbg: dzh nvf ckg tsc
fbp: bdk qtr
vlg: xvp kdm
qsf: kpx qpv llh
cvd: thp jvn rnd
ztv: kdm
grk: rkt nbh
tjf: hlm dlr vst
fnx: qrl
hzf: zjr
pmr: jcm fnx ztf jzj zps ncf
sdp: xjp mlj
cks: thd cpj qzh nkc
bsm: zjm bmv fqf
vrg: gdv gpk sqx
pbf: mqf hbs sfx
gbj: qrl
zhc: ddn zcb jgm vbz qhz
nvf: xdm msn lmz hvf
blm: fgk pln vss
pqj: lbv tqb zps bdv
fnj: nxt
kqs: rts gdq
cts: xkj qcs bpd
jkz: qpz ltq
ljt: dxj
ghj: svk kmf nfj nsr
jnx: mrm mqf qnj
rhz: kgk dvq mtm htz
bcj: hbj gfs zft
std: hdh pqp qvg
cjl: fpz spf
fkp: msh vbd kqs
tdm: cxx kxc
fvv: xqj jfs jpn
zjx: gnk
ftj: zbd mvg
jpn: bdk hcg
fgz: pcf lgx
tkl: tjr tdh
tsb: scr hbh pgk
pfn: pdg lkp ptg hbj
qhz: hzp
lmd: sqs nrr sxv
zlb: tkz nrk
dvq: ldk nbk
rcn: bcd xkf
csz: zkt mlm nnt
jbq: dqp pjl
bkk: lgx jkf npm
xpc: dzv bsl
ngk: jlk
qjg: tlg tts jrl
czl: qjs xfj
qbz: psk xfj tpj ftf
qxx: mqh hmf zqs gkk jqb
vth: tbl xtx lrp
fbj: jth czp
jvs: xvb jcp snt
ppx: jpz lsg fpz lfk
vrs: vqc jdg kbn dlr
bmr: mkx
zsr: ghv zqs kzc lrp
sfs: hvz xkt
zxd: vph
rph: ptl hhl tdl fzn qxl nfm
ncg: rsk tcb mtt
kkp: zsc dpx dhs khn
lbv: gth rgn zvc
npk: cdk jhq fnx qcp zmp
rhf: psf qpv mcs
kbf: qrl
dds: cmb
fhs: xhr xds gqd
vtl: kgm
czp: npg vfs crm
tdx: qgb jqj njj vbk jct
hhb: xlc kts gqp ckg qtr
kmv: nsr ktk fkf
cgf: pfj gfd bsj stz grt
vnn: lng
thc: djn mcg
gnc: tmm khn hcd ccl
cqs: qpv dhz
thd: zxh cmt
xrv: gbh tcr sgf
gxk: srz ljl gdq
ppv: jsj xqq
vng: qhp cff bhm
grp: kmv mdt bhd gcm snt
jfb: khp tdn fpl nfn vsh
lmg: hcg psv
zmf: scg fkk hzf gss trl
xqq: vrn
rsm: xbn qct ljv
lrx: qnk xkh nbp
hhx: sms
shl: xxg hff mvv kbl
pvz: hlm lpt xhh
fxl: bld rxt qmt
gqf: bbl xdx mnq nhl
cgz: sgq svk
lrm: bdk hqp tmm
rnv: qmt
tjr: fhv
lhs: gfs mpp
xgq: srm mlh
slr: kts
kgx: zcg bnj
lgc: sjr zfm qjv djn
hkn: tsf ckl
drb: ddg bhk zsl
cnn: rhc ngk
ngm: nbp
pbp: qpm ltg
bhk: tgp
jcm: bjk ddf
cqc: jgc hpz fvk mfk
znb: jbn nkn bzs hbg
lng: bjn xjs
bpn: ddn zkb mnb mlc
hmt: cfl
rmf: gnk qhv krz jtn
vfs: xph
fqj: hsj
jrl: rrd nbz kmf
qhp: jpv tkz tfs
thk: ggx kdm
tcp: jcl vfl
pvg: ngk vbv bcj
kbr: xvh nvh tfd hnl
rtf: vvh ndx gtp xzm
hnx: kmt mcl mtm nbz
xxg: tdh
pls: vnn nvd xqr
znv: zxg ltv ttk qpn
brs: bzl rtv fkf
crn: jdg kns
zrv: khj lxz plc
zmg: jrk hbh vhp hdf
pcc: nqt czz
vqk: vss tpj
rrl: gmk ccl ttk vvd
cgt: bxz dvq tvn
pcr: hcd zhh nth gjk
kgk: tdc
fhr: jgc tnc
bpb: lmh rgm bsr
tsc: bgx lbm
lnc: dqg
kbl: jcl nkv
hpk: pmf xbn lpt
mpr: nlh cdp dtx vlg xps
rsg: cmh hbp rxt hgk dbd ddg
nlm: ztz glj mnj
dbx: slp zqs
ftr: gcl xrq thp cks
mpk: hxl
gjh: hcf gzx kgx ztv gkl
gkc: grk sxs tdc cgd fth
sdg: gqp hdx szl
hfv: sbs jpz ftd jdk xrq
mkh: tjr
tnm: qnc bhc sgq rhn
pgn: zjx vrh
ghs: vdl
zbd: bdx mtm
vlv: ljj mkp ljl
vzj: fbp khq qxd fxl
flf: mbg
qtt: dqt tfd sqn pbp
dmv: jkv fgg dzs bbb
hcf: gbj zrs lmz mjh lbv nkt qjx
ccs: slv xzv rvt
nvd: tcp mpx ldx lvg
bbb: lcl hfp zld cqc fbp
qjn: mjt ghb ztk xkf
lhc: pzx xhk gqd lgx
mlj: skr
xjn: pcf ngh ngz gbj qgb
btd: qpz lsj xpg svs rlp fld
cdd: xkt
nns: xkv psq mkm bkv fhh xvp
pth: tpj dlr
bcq: fgz dzv rnv
lnb: xhh
djt: zmr vph nvn tms srz
kcs: mfj zvk nsp
lsx: qnc
cdz: tvq kpd ksn tqv
djq: jjz flt mrb
shb: jrl pbd jkr xfn qch
fsq: rjm xkv rtk tzl
qnk: jcm rnv vvz
lbh: xqb vnr lgh pgk scz
zkb: kdc ldk czl rql xlv
dkb: tdq qvs hpk fct zmg
jdq: lnb mbv thc
thb: dpt cmt hfp trs
jxv: flc
ttv: sqs ngk cqk
djh: ldr bdr mcp slj
tlp: hkq
mtg: hhx
tcm: dmb tkg mcp vph phl
vdj: flc ldm lqv lsx xfn
nnf: kxj kcq fhv cml
cst: cgj ztk szm khq
bqm: mqr ltg nhb cgp
ntf: gtn
rfp: vnh lkp gxk kmd
jxz: mpg xch txj
rkp: btt
lzl: khp dfr kpx
tdq: flc nqb rzc qcr
djv: jjg xqd
lkf: cng
rvg: nvn nsr trp
sgl: dlm cgz fnj cts
bkx: rrf
vfl: dsd gpl zsc gth
cnc: qhp bxm sml
cfc: mvv dbd
bzs: pxl
scl: hqz fqj ggk
rmc: hlm tdn qch fhd
pzl: jvs mlb zng mpp crm
gkp: qrl jzj
ngs: rqv nnl
vnf: rhc vdj
zgs: rql
bdr: nfj bjx
vbj: rzp
bsz: xfh rhn sgg kbn
qjv: xrd jlq psx qvs bxz
llq: hcg mqr xtx mmt
qvg: xqd dzv psv
fkk: xbb rnd hpl
kgm: xtx
fpq: ccx ntc xlj scn
zqb: qvn hkq fgh
ptl: cmt xqd
tgl: phf zff sqv smk
lcz: lnc hhr mph sxv
mps: hsg sjm ggz zhh
bqg: cmx xfv bbr
mvv: trl
ccf: lnb bgs jsj vcr
bhm: zhk mdf
nhl: nnt sgh
gxq: hff ljm zrf
hzg: lkp hbh
fsv: zsc pbb rxm qjx
nqh: jxv gfs nsx
sjm: tdl ncf lbm pqp
hpx: rvt rzp fvj brg
ngj: vbd bhd dpc tzv bjf hkn srz ncg
kcl: hnz
kmf: zmr
mfj: rzg nqt
lsh: ldk rvs vft
ljc: mpk zgs kqs lnc
qtp: bzs
brm: nfk fhx mpp sgh
fhx: xqq mpb hxq
vpg: zjm zng plj
ddn: lkr lgr
cdp: ftd gtq khn fhr
gtq: qjn qcp ndr
lfn: tgp vsz
lcl: kdm
mqh: vjx qnj hhx
qqq: skf nhb cpx gjh
bfq: vmk lmz qcp
ksf: ccs tpn fkc
zvv: qdc mjx sgq mnb
gjj: dqt xfv zfz dsd
rhd: rvs vbz pth
prp: xkt
fks: jcp rhn ntf tqq
tzb: tdc bmn nnt psx
qhv: bdk vhc ldx
gqm: jtn rqd ssx gng hzh lcl pbp
vbz: bmv psc
rrf: lxf
ktk: gdv qnt
tfs: zmr
vlm: drb dtv
ncf: ghv
txh: ljt grh vbq
cht: rgb pmf
tjn: gpv qvs crn mnq
vpt: clc jjs kjp rpt
gtn: kpx kmf
nnz: sxs fsx rzg xph
lbm: rjm lqr
khf: hcd ffg dhs vmk dhh
fvn: rrf
vts: llh xmv mlb
ccd: jxv xxt
fdd: cnc bsr gbm rqt
ndd: kkp chr hhl zjj
jmf: vbq
fxc: fds
fld: bvd
vrq: cqr qnj
qvv: tsb srb ppv fcx
tbh: ggx jmj cmx
ckx: rvt fpl
zjj: mlj jdk gzx tbh bkk sqn
gvm: pls qgz mrb lqb
fpn: bfq gss lsd jgs nbp
fgg: zbt fld
qlq: cjc
bfs: xjp sfs nqd
xtv: ppx ggr
szm: jln rxt
tjk: gng dnb zxg rcl
qzh: dgj
xzj: jln tmm
mbv: xph
pps: vsz xhj zqh pxc rlp
jth: slj
nkp: rcl dzg ljm
vsg: scr ckl glj tcc dlm
ptz: rqt sgl tlp xxt jxk
zbx: fvn vdl rvs tcc
bjk: jrg jkf
dbp: mpx nzg
rgn: gxj
bfh: nkq
xvb: gtl
pmj: kns ksk zfc dnl
dht: xmv pzx nvh fdh djv
hnz: hcg jhl
mdf: btj tpn
sgn: dfc hcg vlg tfd
fcr: jrk
kpn: cdd ldx lqb
bmf: ckv xzv xmv
rhb: tbl knz dbp qvb
pld: qzp vft ccr tlx
tjm: grs fml hnh bzc
nlb: xsm skc pqg nxc cxn
sch: ghn
dtj: plj lgh ldm cgd
pfb: gkr zjx grh
gtp: jmj xxg
lrp: fhv
psc: trp
mqv: fpz fbv vsz fgz
snl: mvg pth
rzq: cqr cpj cjc ltg
gzx: rnd
rnj: sjq hck bht slh
nds: qdx qrs jdk jpr
tzk: zjm ljv zvr
zrf: rdq
ljz: pxp pgn cjl qtp gjj mgf
rrz: zpr mlb qcs
zpv: zhh vhc grh
fpz: hcg
pxj: mrb xlc zmp kks
dgr: ghb lnv
ltt: bbr rtk nkv
ksh: bgs xvb lrb
bsr: gpk cqk
pfj: nkn rpd kts
bxp: xdb tdx nqd hmt
hsg: dpt fvt qpb
tnp: plc lhg psn pvg mmj zxd
ccr: gfs
sgh: plj
cvq: lqr gxq vcc sdp
kbv: gbz mfj dqp hqz
zvr: hdf tcc
bbh: lqr txj sdp rcj
zgv: bdx
fxs: dqp mdt
gqp: kts vdp hhl
lqv: dvq sxs
rsz: cqr cjl gqd khq
kxv: bdr qch kxc mph
khm: qrd xzj bjn
mxn: zqj hrs
zhs: mks cpz
qch: bkx
dxv: xhn
vct: jpq fvj ccr
xqj: pqg
ldv: gss
rhh: bzl czz ggk vdj bmr gbh
xkj: srm gtn mlb
xpd: vsz nkc xkf
jbv: brg
xfg: qch sgq fhd ckl
ddg: dds cxd
sfx: lnv gkf thd
nvx: lpx
rgm: lrb gxf snl
njj: mjt lqr cdd
jtr: cbs ljv fmz vft
mqf: tnc
cjk: fpl kpd qrq
lsv: tpj
pzn: rqd xhk cch
rrq: nzs bxm ttv bfh lgh jdg srb scn
khz: vbv khj clr dnt
vst: vpg dbh
ksn: snx gxf
tqb: gzx kjq
hpl: qpz dgr
jqf: vtl mfk
mzs: tgh mnb tdm kgk pdg
mkv: ncb sbp zzf
gtl: khj
xfh: hgg qxj gcp
htt: cdp tdx bfs tcz
nqb: fks sxs zgv mcg
zxh: gfr
zhm: jfl shn tgp sfs sqv
khp: ldm
qrq: pgm qfg ckx
kqj: jbv zhf
bjf: jlg slv lbk vnh
mlc: btl msc
lrb: rhg gdq
sgg: nbz bkx
snm: vng tzh zjq rcr tbf htq
psx: nnl tcb
tdc: mph
zqk: tbl sdp xtx ljt trl
jpp: mks ptg lsv
fdh: prz gkp
ldx: qdx
crj: rzc llh bhm
slp: mjh ngh xhn
ckl: ctj
qrs: dzk lsd vth
lsz: jmj jnx ftm kgm
zcx: cgf kgd qpm djv
ttn: dzg dzs nkn rrl
chf: mqk
dqj: pls jcj hlt slr
bjn: mpx prp
ncn: hsg fcb dxj
mzp: djq sjs rqc ghn fxg
cvx: lxx ghv lsj
npm: ddf
zft: mdt
rpd: xkt jkf
ppn: fth ksf nzz mcp bgs
gfl: mxr lsx bhd
mpg: dqt
zrs: grs zjx pxd
bpp: hxk fmm xbb kmh
vvr: nrk rkt pln rfc vqc
sjq: scr tzk nbh ghs
qfg: gcp
mch: dpt sch rnv ngm
lbz: lqb vvd dxv zfl qtp
klv: nfn
rpb: fkc
skc: lbl qtp thk
tcs: bxz fnf rhd xqs
svs: zsr xth gbj
nln: sgh rts qfb rrd
dhz: btl
hjz: xhh mpk tdm hsj
mzh: zvc xkh vvd thp
mkm: rgr vbk
khk: fbb mqf
tkg: vbj hxc zcb jgm
nbp: jcl
fgk: jpq lnc klt
gml: bhk cmx gkk
xfc: scs mkp bhd nfj
tlz: pgn lsd cst qjn rpt
mbt: clx lpp psc nsx
rcf: ptl ngh jmf gnk ldx
xsm: gkg bnz bhr
hrq: zkm cvx rnv
bbr: thp
ndx: qzj
qpb: vbq
dzg: qpp vdp
dnt: plc
jjd: zhl kjp vrq bcq psq
plj: jbv
kct: hhr hxc nrr hkn mdt
tcx: xqr hcd
kzc: cmt
gcm: hgg xgq jzk dnl
dzh: xzj zqh
stz: qtr zsr
kdc: xbn
stt: qlq khn cgj xth
zfm: cgz hqz tlp
fbb: rcj dbx
ftf: fkc
jhl: tdh
ptg: zqb klt rrz
bdg: hff ngm
nfb: snt mkx
lmh: mgg vlt qtj snx
dmb: qvn ztz
xjp: mkh
rqh: fvk vtl tdh xpg
phf: bhk
vmb: ccr qnc snl kgk
kps: ztk knz pvc
lqq: bcd zlb jsj psf sjr dlr
rgr: mkh qpn kcl zsl
nzs: tpj
skv: cdd hlt qjn hmt
crm: fqf
fpl: fqf
fcg: tts crm cff hkl
fkv: hlm ckx mqn
mjs: hsg hzf ljt bhl
slh: zxn tgh lpt
vvz: rfh ltg
bhc: rgb mjx gpk
sqq: spf lxp dbd qmt
gpk: srm
rqc: fhv qnj
fjr: xhn nbp ncx
kkk: skf jkf phf tfx
hpz: kbf mjh
jdv: cch hsg tbh lzf
msc: stc vrn tzv dfr
xjv: hmf cmh
ntc: vxf cvg zpn
hzh: vgf tss pzr
kmh: qdx ntk nps
lbq: kks qmt hfp cdb
hxq: sjr cqk
xfn: hdp npg
rsk: lxf slj bdx
sgf: hdf slj zft pln
kpd: gxk
zhd: sps vqk rcc rpb
ltg: dgj
bxv: tbl ppx nvh bbr
jtn: vzv gjk
qhc: bmn svp tpn
qpz: sms
pmg: hdp htq
mxr: scl lgr
dpg: lxx ldv ltt zqj
zmp: xdm
pzr: jqj hqp
mnf: sbp lzf pfb lxp
vmk: nkc
qvm: vqc ksd
xzv: hxl
hhl: fzn lrm bhg
sbs: vlm vrx fqp hmf
mlp: zmr svk hzp tdn
zkq: nsx jrk
jvp: kdc czl rzp cgk tjf
cbs: mgb
xhk: ltq
qds: snl xfj slj gch
xps: xtq vff
vxm: kgm kcq rrj snf qcp
gkg: lvg thf khm
xvp: jct flf
zzf: ghn
mks: ppv
htz: jlg
vft: slj
qrx: ftj jlb zxn
vbq: nmt
chr: zxh vrx
fbv: nmt
dtx: kbz rrj
hxk: vjx
mft: rhs
tcv: snt zkt
smv: jdk qhn dds zmp
lsj: vgf cjc srd
jvm: fcr jrk hxc vrn
rcj: gss
xtq: jjg
bnj: cdk gkp kbz cgp bhl zkm
gdq: jkc
xbb: jcl ngz
cff: qrq tzv
tdk: clx tts bpb rqt
pxl: qrl qzh
vnr: mgb tqq
pdl: qjs
zld: vrx jcl skr
hfk: hvn khj fxs qvn djn
tss: nmt nvh qpn
tvq: vzz hxr cvg tdn
lqb: cks gfr
psn: gbz hqz snx vct
vrh: rqc xtv tcx cks
qgd: vph jcp rkt mvd
zxg: lsg gfd
hqv: jkc
fdc: sqd khq fnx nvh
gng: fmm
nqt: trp
qzp: hhr mnb ksd gxf
srd: fhs
qmf: hgg bmv dqg jxk
tqq: qdc
pnj: mjh krl
tcz: cjt qzh pnj ntk qjn
nfn: sgz hxq
vvd: gnk
hcd: hrs
nth: cjt dsd pqg kbf
qcs: nbk tgm
gkf: lfn
tdd: xdl snx gpr slh gzt
zbt: pzx mjt
kcq: nbs jct flf
zfs: txq jfs zhl dzh
rpt: lng zqj kcl
fhh: qpb zss dbp
khq: ztv ftd sms
vkv: blz kps vvz mbg
bhg: ddf xhn
hmq: skr ftd bkv pzn
xvq: vbd mgb fgh gpv
psh: ksd bfh qjs
mrq: kgd
mcl: zgv jgq ljl
kdd: bsz tzv kmv hbh
nsr: qhz shc
kkf: bbl ftf qbl gpk
mjx: rfc
zfl: vzv ztk txj
pjj: ddf jjg
dnn: bmn ljv bsg fhd
gzt: xlp ccd jth bbl lnb
qvn: gpv
zht: dmq rhc pgm vbv
znk: zxh ltt mxn hmt hrs
ddr: nfb gtn lbk
cgd: bmr
gvr: qzc qjg xrv dmp ljv
nfk: nfn htz
bxm: rvs nvn
rtn: kdc sps cgn fnj tvn btl
gbm: hdf khp
zsc: bhk
ltx: cpx rlx dxb phf tqb
bnz: psv dxj kdm
rdq: sms knz
cng: pjj ztf lcb
jlq: lgr scn nkq
bzz: dbp jqf dcf sfx xdb
xgt: lnv hqp kgd chr
ffg: lsg bhl ghb flt fgz xhr
kbj: lrb hzg fnj
mdn: msh hkq tcc tdt kmt
grt: nvx ntk jbn
ghv: cjt
zss: rrj dxv
dhs: drx sqn
msn: pqg hnz bqq
fct: sxs ppv msh
jcj: vpf ghv
ggr: jjz dfc bdv
cgx: nnl pcc crj vsh
vvh: nhg
qbl: fkv tlp
zlj: zvk jcp fhd qhc
nfx: bmn qbl bmf csj
hbs: msn hrb
zlv: vfs vft zpn
pvc: tgp lng gml
mgh: zkq vss dbh psf rhn
tgq: vlv xgq lpp pdl
xdb: mbg
lqr: gjk
zcg: xhr lpx ljm
rqd: nmt
hbj: sqx dqg dbh
pgk: qxj ftj
cfp: nbh ksk nbk hkq
gxj: vzv cfl
cvz: gxq brt blz pbf
zhk: ztz sjr djn
mnq: slv
clx: vqc scs
nlh: zgh ftm rhs
xlc: hdx ztv
vpl: mks hkl csz ztz
stc: vrn
pxc: hbp
vlt: lsv qsf bmv ftf
zzc: mjt nkv xcf sdg
sqs: gdv btt kpx
kbn: pbd bkx hhr bhm
zmr: dfr
pzz: vjx mpg jxf xqr vbq
xqs: sgz mcg jgq
fst: xpc xtq mch
hrt: gxk qpv
vsh: srm
nfm: qgb chr
nxl: jgm rtv klv rkp
xmn: hxk
plz: chf cxn xkh hqp cjt
zff: xds dzs
rvs: thc
scz: tvn tcv kqs
stn: dnb zmf kzc bnz hbg
fzn: ndr lcl
kks: gjk jhs
blt: rts tlg jdq
jjz: srd hrb
mvg: rrd tts
nkq: btj
gch: jrk cqs
lgr: brg
zng: ntf gbm
tmc: hqv fkm ldk
cxg: kmr sqd
vpk: tmm fxg bhg
tzl: vjx fcb
qdc: jpq
xbh: bfq lxp ljm rxm
clc: txq kmr
xxl: vnh fhd
rcc: hzp hdd fkc
rqz: khj ckv vbd
crt: bvd gtp cfc bbm
zqh: jqf qzj rgn
jfs: xmn vmk
mgf: rfh xkv bld xtv zps
ssx: xpc vgf
fxm: lhs crf drk rvg mcg lmd
jfr: nfm hvz lkf
vkh: sch xhn bdg zss rdq
rrd: bdx
nvn: phl
zcb: qrx zvv qnt
rvr: vff prp kpn xth
kjp: dfc lpx
zxn: bkx
ftm: ncx
vcc: cmx mvv
xkf: zqj rnd
zfp: dhz mcg lmq fbj
ssn: jpn jrg zxg zjx
dhq: ghv rtk
mgg: lzl rhd
jfl: qvb
grv: lfj kgx gpl qdx
tvn: hzp
gjk: ggz
drx: mtg xjs mrq
nxt: jgm mlm
mqd: gxf rhf jkc tcb
svp: tms
scr: kqj drk
jgs: njj zvc jzj hnh vnn
ccg: qxd mrq fdh
nxc: bnj hmf
mjt: qrl
lfq: qhz nzv vkx fvn
jpv: rfc hdd zbd
vhp: jlk jlg
tts: zxn
hhr: lhg
gpd: dpt thp
mqq: stz
jrg: tfd
sjg: gqd kzc
lhg: jrk
dcf: jfr nzg kvp
dpc: tlg nzv lhg
xhn: qgz
qzc: sjq zpr fxs
srb: ptq cnn
psf: vfs
sps: xph rts rcn
gkr: xds xkv skf
crf: zpr dlm
tlr: lsh tms fkm xxl
dtd: tzh svp sqg bjr hdf
zpn: gpv
hvf: vrq grh
gkk: lnv vsz
fgh: nzz mkx zgv
vdp: ncx fhv
pdz: zkt lbk bpd
gth: nkn mpx
dzk: nhg xqr fxc
nmd: lqb skr chf xch
sml: mlh shc
mkr: jpv rqv khp fcx
vsr: vph jrk pjl
spr: jxv hpk tdm hck
djk: fbb jcl gpd
bdv: lfk
ksk: scl tgm tzv
sjk: qpm lkf jmj nzg
vbv: qxj
qrd: rnd ffg zjr
tkz: tpj
clg: ttk lfj tcp
qcr: xqq
gfs: rjt
bpm: sqg fbj zpn hgg
cmq: jzj zfz hhb zhl
fpd: brs vnf tpl mjx
czb: tzb vxf vrn mtm
qqk: cjx jxz hzf lfn
bht: ggk vhp pdl zvk
jhs: cxd
gkl: nsd xds knz
rfh: nkc
sjs: kmh xqj mqq xjp
zhj: mmj tqv mks klv
fcx: mvd nxt nfj kmd
rdt: cxg xpd lrx rfh
tmm: hnl
mrm: ncf thf ncn
trj: tdx vlm xth xvh
fkc: mnb
xrd: fkc mgb xvb
zdn: kcl nkp flt bgx srd
vxf: hdp gcp
czt: hlm mcp lsv vzz svp
mgb: btt
txj: khc
xzm: trl tkl szm zhl
lxz: hsj
psk: ggk psc
psq: mjt
kxj: xhj
bsl: kjq cmb ngh
mkp: mbv
rmv: tmc czz zhs vnr qcr cht
grs: vlg lrm psq
htq: xzv
mqr: qpz
nrk: bpd rjt gtl
gfd: vhc
nps: skf mgf zkj
qzj: hvz
gqv: jcl kcl gcl mtg
xch: fds
chg: ggx cgj
bqv: tzl hgf dzv zxx
xft: gbh mph hrt
rsj: qcr kqj ghs nqh cgz
szl: ztf xdb ndx dhh
lkr: lrb xst rvt
cpx: qzj xkh
qdj: btj
gcl: fxc
cpz: nbz xph
lcp: zrv jvp ptq bcd dmp
kxt: pcf cvx zgh xmn txj jhs
hsc: psx tlx pgm
jkr: nbz bgs sps
zkt: jkc
cml: ptl pbb lfk
drk: fvj vqc
mqk: dfc
xdm: qpz zvc
cdb: lrp rpd dqt
qbk: rkt qcs bsg lhs mcs
jkv: xjs lvg gcl
xst: vrg tgm bzl
skn: ddf vgf xmn bhl hvz fcb
bnm: psk rhc zhf klv tpl
npb: qfg rsm pdl pjl
knv: hrb sch dgj qpp bxv
fth: rzg
vcr: tdq xft zxd xxt
zhz: xvp bhl vvh
fxg: kjq khq jrg
qjx: nfm
lfm: kjp gvm xps ngz
bzp: jkz hrq jmf rbv lxx
kgd: bkv
jqj: bsj mrq
mmj: rvg tpn bng
gpr: hdd fcr vbj rkp
bsg: mfj mqn
zkm: mft
pbb: cmh nkc dhq
jqb: dxj bjk jxb
xlp: tgm
nhd: rmv rvs cgn nsp
cpj: dpt
cmb: mrb
lkp: jth bsm
kfn: fds xqd xtx jbn mqr mxn khq
zfc: vst scs pst vqz
nrr: rhg xfc
hck: rzg bzl
shn: ngm ncx qgz xjv
rbv: jbn
bhr: jcj zps mkv
tqh: jlk nzs mpk btt
jzv: czz zft djn
qhb: tzb qzc cpz crn
rlx: cvd gtp sqd fbv nkv
hdp: tdc jbq
cvc: ddr vts xft bhm
qpp: jct kgz
lrt: trp xph
nzp: ccl rcl fxc xps
nzz: rhg
vpf: cdd jln kjq
dmr: llb bdg fsr ltg
sbp: tkl fmm txq fhr
sbc: vhc gpd dgj chf kmr llb
scn: svp
mnj: fvj hqv htq
tnc: bsj mrq
spf: krl pjj
skf: kgz
xvh: cfl skf xzj lmg
lhz: sqg tbf cfp nnt
xtk: mnf xhj fcb
cms: thk bcj bfh ksh tlg
hvn: bdx
skt: hhx chg vvh vsz
flt: cmh rdq
lmz: hqp
cvg: lxz
xlj: gch hqv
cxx: dmp dfr jlg
cqr: bsj
lmq: trp kbj rcn
lgh: fcr
qbc: fld zrf std gqp
`
  .trim()
  .split('\n');

if (runs[0]) console.log('part1 sample', timeit(() => part1(inputSample)));
if (runs[1]) console.log('part1 real', timeit(() => part1(inputReal)));
