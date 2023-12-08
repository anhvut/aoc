import {keyBy, lcm} from '../util';

type NODE_ID = string;
type NODE = [NODE_ID, NODE_ID, NODE_ID];

const parse = (input: string[]): [string, NODE[], Record<NODE_ID, NODE>] => {
  const instructions = input[0];
  const nodes = input.slice(2).map((l) => l && (l.match(/^(...) = .(...), (...).$/).slice(1) as NODE));
  const nodeById = keyBy(nodes, 0);
  return [instructions, nodes, nodeById];
};

function getNumberOfSteps(nodeId: string, nodeById: {}, instructions: string, endFct: (nodeId: string) => boolean): number {
  let steps = 0;
  let node: NODE;
  while (!endFct(nodeId)) {
    node = nodeById[nodeId];
    nodeId = node[instructions[steps % instructions.length] === 'L' ? 1 : 2];
    steps++;
  }
  return steps;
}

const part1 = (input: string[]) => {
  const [instructions, , nodeById] = parse(input);
  return getNumberOfSteps('AAA', nodeById, instructions, (n) => n === 'ZZZ');
};

const part2 = (input: string[]) => {
  const [instructions, nodes, nodeById] = parse(input);
  const nodeIds = nodes.filter((x) => x[0][2] === 'A').map((x) => x[0]);
  const steps = nodeIds.map((nodeId) => getNumberOfSteps(nodeId, nodeById, instructions, (n) => n[2] === 'Z'));
  return lcm(...steps);
};

const runs = [1, 1, 1, 1];

const inputSample = `
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
`
  .trim()
  .split('\n');

const inputSample2 = `
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`
  .trim()
  .split('\n');

const inputReal = `
LRLRLRLLRRLRRLRRRLRRLRLLRRRLRRRLRRLLLLRRRLRLLRRLRRLRRLLLRRRLRRRLRRLRLRRLRLRLRLLRRRLRRRLLRRRLRRRLRRRLRLLLRRLRLRRRLRLRRRLLRRRLRLLRLRRRLRLRRRLRRLLRLRLRRLRLRLRRLRLRLRRRLRRLRLLRRLRRRLRRRLRRLRRRLRRLRLRRRLLRRRLLRRLRLRRRLRRRLLRRRLRLRRLRLRLRRLRLLRRLRLRLRRLRRRLRRRLRLRRLRRLLLRRRLLRLRRRLLRRRR

NBN = (BKF, NNH)
NSM = (RFT, QQM)
BDR = (HRB, KQB)
LGM = (CQJ, XJQ)
CQL = (BDX, FBN)
SNH = (HXS, HCC)
BBL = (FMD, LVM)
GDF = (QQJ, VBM)
NVN = (QQR, XFD)
MMQ = (PHP, PHP)
TPH = (BNM, MXC)
NDR = (MSQ, RGL)
KRL = (RGM, RSP)
KJR = (MRD, TJC)
NBB = (JLM, JQQ)
AAA = (FHJ, QHN)
KFB = (BXG, RSN)
XFS = (QMB, KKF)
CDK = (HDD, JVJ)
GDB = (GQT, DSN)
RXL = (MJL, XFS)
FGM = (MBR, GFS)
DCM = (HDD, JVJ)
HLJ = (XPK, CTT)
PMS = (GHH, VQH)
KVP = (QDD, QDD)
HMS = (FJG, NKX)
LNF = (HSN, PVN)
HNN = (FVC, FMN)
NHK = (PQX, XXX)
GSL = (CVK, TCT)
MSV = (DFT, FVR)
RGF = (NVH, RJG)
XQT = (PVM, LDD)
QNX = (NTM, DXG)
MVX = (RBK, VSL)
QTF = (QKN, LQK)
NFV = (MVG, KCT)
MHL = (SVN, RHM)
VSL = (BLJ, XMX)
MJL = (KKF, QMB)
FMB = (RHM, SVN)
DTT = (JRG, HBQ)
RSV = (JLP, QKR)
QMV = (HNN, TND)
GXF = (JQQ, JLM)
KSQ = (VKQ, STJ)
MDL = (LNQ, DQF)
DQF = (HLJ, VVN)
FDD = (DDM, GMM)
RDD = (GHR, TDJ)
LKK = (VRD, SGJ)
BRF = (VFV, LNH)
MRM = (GSQ, JNJ)
JFQ = (BDC, KSN)
THT = (PHL, DCX)
FGL = (RSV, TRX)
RMT = (HHR, BKV)
SHL = (LHT, FBK)
RVN = (MPF, TGD)
PMD = (MFL, DMP)
JVN = (CMC, BJC)
FVC = (LNP, LPX)
BDC = (PRS, PRS)
BCT = (LDD, PVM)
PBQ = (QDX, BVT)
XLB = (FBF, THP)
HQG = (RXL, GKK)
QXK = (BNJ, GSM)
BRG = (PVQ, NKP)
TCC = (BFV, GHQ)
TTC = (VLV, CBB)
QJV = (QGG, FTF)
BJC = (GCQ, LJV)
BNS = (SCX, LGL)
LQK = (XRL, MSB)
FBK = (CSQ, RKK)
TND = (FMN, FVC)
DHX = (TKX, DGS)
GKC = (JKS, CPT)
VHQ = (DQF, LNQ)
VKN = (BDC, BDC)
KQG = (FHJ, QHN)
KBG = (HVS, HFS)
DVA = (XXG, PRR)
RTP = (RCJ, MVV)
KMJ = (BFV, GHQ)
FJG = (FSJ, MRM)
KGH = (NVN, JJD)
TRC = (KLM, DCJ)
PNT = (XHX, KGH)
PVM = (VVB, KFL)
JQQ = (JFX, VBP)
QTL = (MBK, DSL)
NPC = (NBN, BVS)
XDZ = (PRR, XXG)
JTR = (LTL, BBT)
LPX = (NXJ, BPT)
BGT = (FHK, TBC)
FFK = (NML, DPL)
GRR = (RLM, GJD)
QBR = (BNM, MXC)
QFF = (HMS, DHJ)
GTT = (MSV, LQD)
STH = (GLX, RXQ)
DCX = (BCT, XQT)
KNT = (QQH, FNT)
FPF = (LSJ, QNX)
VDB = (TTM, GNJ)
GDQ = (VJJ, BTV)
XPK = (PFB, SRN)
CXC = (LMM, JXT)
MDJ = (MDL, VHQ)
NFL = (HSN, PVN)
KMT = (LFT, SNP)
KCT = (HKF, LKK)
TJC = (THT, FPJ)
FKC = (PLJ, FDS)
HGJ = (BKV, HHR)
QMN = (QQN, HVG)
HBT = (CSV, JCB)
QHN = (TGV, VFR)
QGG = (TCB, FQH)
NMT = (RFS, MDB)
BGF = (NFL, LNF)
TXJ = (NPC, FGC)
RQB = (XNP, PQV)
FHG = (TND, HNN)
DRL = (DCL, JRT)
CSN = (CVH, BRL)
MRK = (CRS, HPQ)
XPM = (GGS, GGS)
CTT = (PFB, SRN)
SMX = (PQB, CRF)
NVH = (BGF, CPK)
CGB = (GLX, RXQ)
HJV = (RVN, FLF)
TSM = (CRF, PQB)
HPQ = (STB, MCK)
JMD = (RMT, HGJ)
KPC = (JHF, JNV)
VLV = (MJX, MCQ)
RRK = (XGP, LHL)
MGH = (BVG, GTT)
XFD = (RKT, TCN)
JVB = (FQJ, MGH)
VNX = (KGH, XHX)
FNT = (NQJ, XFP)
XGP = (DCM, CDK)
GSR = (GRR, FPH)
NQJ = (QJG, VCS)
RJC = (CVH, BRL)
CLG = (DSB, JLJ)
FHK = (HJV, TNX)
XDD = (DPL, NML)
LKQ = (PQN, VTS)
VBM = (LVN, FHF)
RFT = (KFC, BJN)
JFT = (BNS, HNX)
JKS = (GCT, XJV)
LHL = (DCM, CDK)
RMG = (QDS, QMR)
VXA = (BRF, XKN)
SCT = (BJF, TDL)
HFG = (QTF, HMG)
JQL = (JVN, HXT)
FTB = (PJS, VVS)
DVG = (SSD, PCL)
JRT = (LDG, JFT)
RXK = (NNX, FFX)
DDM = (LQV, MRK)
DPG = (XDD, FFK)
GCQ = (CQL, PSV)
GQT = (NKS, VDX)
LMM = (BFQ, VSM)
PQF = (VDB, GXH)
GFD = (GCM, LSF)
KGC = (STH, CGB)
KDT = (SBV, LDX)
JHS = (BLN, QTL)
VBP = (CVT, PBQ)
PDL = (JPV, PRF)
HRV = (BXG, RSN)
XKN = (LNH, VFV)
FLT = (SVV, RBM)
TCN = (RBD, BTB)
BVG = (LQD, MSV)
LGL = (SGS, CDR)
DVX = (PFH, VNJ)
TRD = (SLB, NBR)
VFR = (KJR, PVS)
RFG = (BQF, BTK)
GGS = (FGD, FGD)
XPF = (KDD, RLC)
TGD = (XPM, XXC)
LKC = (FJH, CHT)
JMT = (LSL, PTH)
QQM = (KFC, BJN)
HBQ = (SRK, XBQ)
XVH = (VKN, JFQ)
BNH = (MLT, HNC)
DPL = (TJR, LRH)
KQB = (VNN, SCT)
LJV = (PSV, CQL)
JPV = (HQN, FKC)
HNC = (SHM, KNT)
FNJ = (XBJ, GDF)
NXG = (JNV, JHF)
PFK = (GTF, VLD)
FRP = (LSJ, QNX)
SDH = (STJ, VKQ)
RBK = (BLJ, XMX)
VJJ = (JMT, CSK)
FDX = (CXL, QTB)
FLF = (MPF, TGD)
FPH = (RLM, GJD)
TNX = (RVN, FLF)
PCL = (KVV, KGT)
TDX = (FBG, BJT)
HFD = (PHP, FRZ)
SVN = (TLT, BCC)
PFS = (XBV, BRG)
CSK = (LSL, PTH)
MQX = (LFJ, MNX)
PHP = (BXQ, RTP)
FVM = (FTF, QGG)
MNX = (HRV, KFB)
LNN = (BNJ, GSM)
XMX = (BLT, HPL)
XFP = (VCS, QJG)
KKF = (SMQ, NTS)
MRD = (FPJ, THT)
QDD = (KBG, KQF)
RTC = (CVK, TCT)
XXC = (GGS, CDH)
GJF = (BDR, FCM)
HRM = (NPQ, HQM)
LGC = (VLD, GTF)
FHJ = (VFR, TGV)
FXN = (RTK, RTK)
PSL = (MNX, LFJ)
SXR = (GLG, NPT)
BVS = (BKF, NNH)
JHA = (BXQ, RTP)
VFV = (SHB, KVC)
LQG = (SNH, JPD)
XQL = (SNP, LFT)
TDP = (LGM, TQV)
LTL = (KGC, DMT)
HML = (RBM, SVV)
TKX = (NKV, GFD)
BCM = (QHH, CNP)
RFD = (KQS, CMN)
MKS = (RJC, CSN)
LHZ = (KQF, KBG)
VSH = (HQG, TJF)
DPP = (VNH, FDX)
HRB = (SCT, VNN)
MRF = (QQM, RFT)
TGV = (PVS, KJR)
PFB = (DKS, DPP)
TCB = (QPG, PQF)
SXH = (DHB, DHM)
GHJ = (RSV, TRX)
LSF = (HDR, DJJ)
VVB = (GHJ, FGL)
JFX = (CVT, PBQ)
PXJ = (NXG, KPC)
SVT = (MMQ, MMQ)
VNH = (CXL, QTB)
MHN = (KDD, RLC)
FTF = (TCB, FQH)
DSL = (QMN, JTP)
FLL = (RTH, PVT)
QQJ = (FHF, LVN)
HSN = (QMV, FHG)
BXP = (DHN, FMJ)
KDD = (CNS, MLM)
JVJ = (HVB, PKT)
HQN = (FDS, PLJ)
KQS = (NQB, JQL)
MVG = (HKF, LKK)
KCK = (CSJ, FNJ)
CVK = (NFV, VMQ)
NKX = (FSJ, MRM)
HSJ = (RFG, FML)
RBD = (BMH, KRL)
MFL = (JNP, HBT)
SDJ = (PQN, VTS)
CDR = (QJV, FVM)
GPG = (KGL, BGT)
VNN = (BJF, TDL)
VLB = (JCQ, TKJ)
DXG = (BCM, GMS)
FKB = (PLS, RGF)
SVV = (GDQ, QVS)
VSV = (VKN, JFQ)
PRR = (MVX, FHN)
PTH = (PXN, GJF)
KFC = (LGC, PFK)
DMP = (HBT, JNP)
KGT = (GSJ, NHK)
HXX = (GKC, LXQ)
BDL = (NRQ, DHX)
SLB = (SCC, SHL)
NBR = (SCC, SHL)
GHR = (NBB, GXF)
PHT = (HDK, KRF)
GMM = (LQV, MRK)
MVV = (FPF, FRP)
QCJ = (FMJ, DHN)
LSL = (GJF, PXN)
GCT = (PLG, TVL)
FGD = (XXG, PRR)
DLD = (FKH, NDR)
VRD = (MQX, PSL)
NDJ = (TRC, BSB)
LCD = (JHN, MGP)
SRN = (DPP, DKS)
FRZ = (RTP, BXQ)
GSM = (FJD, KCK)
DCL = (LDG, JFT)
LVM = (CLV, FDD)
BTD = (PFS, HDG)
HVB = (SVT, SVT)
LDR = (HJK, PDJ)
TQV = (CQJ, XJQ)
JFZ = (SXH, KGM)
PLJ = (HXX, JCR)
JRX = (JMD, GHF)
DJJ = (LQG, KFD)
RPS = (RQB, GSH)
QPG = (GXH, VDB)
GJD = (FKB, STD)
SNK = (LGM, TQV)
LRR = (VGQ, HKJ)
MXH = (GNB, FLL)
MBR = (DTN, XLB)
XJX = (RTK, FSV)
BFV = (FXN, FXN)
XRL = (LCP, HSJ)
FDS = (HXX, JCR)
HHR = (TCC, KMJ)
GHF = (RMT, HGJ)
XLJ = (HMG, QTF)
JLM = (JFX, VBP)
GNJ = (DMQ, BTD)
KLM = (LJS, DPG)
JNV = (NVM, GCL)
QQN = (BMN, DSK)
FJS = (NNX, FFX)
GLG = (CLG, GTX)
ZZZ = (QHN, FHJ)
TRX = (QKR, JLP)
QPP = (DTQ, JKV)
XXX = (XPQ, SKF)
DHB = (HXD, RPP)
XXS = (QMR, QDS)
PLS = (NVH, RJG)
CRS = (STB, STB)
SKK = (VLV, CBB)
FHF = (FJS, RXK)
NFK = (SNM, RDD)
GXX = (LKC, XPS)
GLX = (HCT, DFL)
LNP = (BPT, NXJ)
RLX = (JRG, HBQ)
MSQ = (TRD, MTP)
KXN = (RPS, KVD)
JCB = (TPH, QBR)
JLJ = (MMG, JRX)
FHN = (RBK, VSL)
DSB = (MMG, JRX)
BTK = (RKQ, LFK)
VCS = (JDB, BRX)
SKF = (GRG, DPR)
PQN = (DFX, NXN)
MPF = (XPM, XPM)
CDH = (FGD, XDZ)
KRF = (SJJ, SXR)
HNX = (LGL, SCX)
TGH = (DTT, RLX)
FPJ = (PHL, DCX)
KFD = (JPD, SNH)
FJH = (GLQ, RFD)
LQV = (CRS, HPQ)
RXQ = (HCT, DFL)
TKJ = (NHV, FGM)
SCX = (CDR, SGS)
JLP = (KXN, CMX)
TJV = (VHQ, MDL)
DSK = (PDL, GVC)
QHH = (HLP, NBV)
NVM = (JDM, NFK)
NNH = (QPP, XSG)
VGQ = (PQT, PMS)
CNS = (XMQ, PMD)
LFJ = (KFB, HRV)
FMJ = (QFM, PXJ)
NRQ = (TKX, DGS)
HDD = (HVB, PKT)
JFN = (TKJ, JCQ)
XPS = (CHT, FJH)
SMQ = (KDT, BDD)
JQK = (HQM, NPQ)
RKQ = (GDB, GMN)
FCM = (KQB, HRB)
RLL = (BLN, QTL)
BLN = (MBK, DSL)
LJS = (XDD, FFK)
BVT = (XKT, JTM)
GNB = (RTH, PVT)
RFX = (BSB, TRC)
FVR = (MDJ, TJV)
SJJ = (NPT, GLG)
RKT = (RBD, BTB)
LVN = (RXK, FJS)
QDX = (XKT, JTM)
HVS = (HML, FLT)
QTB = (MRF, NSM)
XXG = (FHN, MVX)
BKF = (QPP, XSG)
CSQ = (KCP, TGH)
JVC = (DLD, BHF)
SCS = (MSL, FTB)
LDX = (PHT, KKM)
TTM = (BTD, DMQ)
VTS = (NXN, DFX)
PHL = (BCT, XQT)
RGM = (MQS, DCD)
FJT = (FGC, NPC)
DCD = (SCS, FKS)
BHF = (NDR, FKH)
FGC = (BVS, NBN)
HMG = (LQK, QKN)
KFV = (RLF, TKN)
RPP = (GSR, VVM)
LFK = (GDB, GMN)
QKR = (CMX, KXN)
NNX = (DGH, DCB)
KVC = (LKQ, SDJ)
MSB = (LCP, HSJ)
XGN = (HQG, TJF)
CMX = (KVD, RPS)
DFL = (FJT, TXJ)
QQH = (NQJ, XFP)
HCT = (TXJ, FJT)
HKJ = (PMS, PQT)
LDG = (HNX, BNS)
RTH = (HKG, LCD)
NXJ = (RFX, NDJ)
RBM = (GDQ, QVS)
RKK = (TGH, KCP)
MQS = (FKS, SCS)
VVN = (XPK, CTT)
XSG = (DTQ, JKV)
TKN = (CKJ, CKH)
CHT = (GLQ, RFD)
PXN = (BDR, FCM)
LCP = (FML, RFG)
PFH = (JTR, HBN)
TLT = (STM, JVB)
GSP = (XGN, VSH)
MMG = (GHF, JMD)
CVT = (BVT, QDX)
HXS = (CXC, MDR)
PVN = (FHG, QMV)
PVS = (MRD, TJC)
XKT = (KFV, PPN)
RFS = (LDR, KJK)
NKV = (GCM, LSF)
XQX = (BHF, DLD)
VDX = (HCQ, MXH)
DGS = (NKV, GFD)
KGM = (DHB, DHM)
GFC = (PCL, SSD)
PDJ = (FMB, MHL)
GSJ = (XXX, PQX)
STM = (MGH, FQJ)
MCK = (KVP, JGG)
KGF = (BGT, KGL)
PRF = (HQN, FKC)
GKK = (MJL, XFS)
HDG = (XBV, BRG)
XJQ = (BXP, QCJ)
JTP = (QQN, HVG)
DFX = (JFN, VLB)
FBN = (XVH, VSV)
CMC = (GCQ, LJV)
BQF = (LFK, RKQ)
CKH = (DRB, XLQ)
XJV = (PLG, TVL)
VQH = (HSX, BBL)
JJD = (XFD, QQR)
GVC = (JPV, PRF)
KFL = (GHJ, FGL)
SHB = (LKQ, SDJ)
NPT = (CLG, GTX)
XNP = (VNX, PNT)
LDD = (VVB, KFL)
GFS = (DTN, XLB)
MDR = (LMM, JXT)
SSD = (KVV, KGT)
THP = (MHN, XPF)
BTB = (BMH, KRL)
PJS = (DVG, GFC)
LHT = (RKK, CSQ)
QVH = (KGM, SXH)
SRK = (DKF, JRP)
GTX = (JLJ, DSB)
BRL = (SDH, KSQ)
CXL = (MRF, NSM)
CSJ = (GDF, XBJ)
TBC = (HJV, TNX)
TVL = (MPQ, TDX)
STD = (PLS, RGF)
CSV = (QBR, TPH)
GCL = (NFK, JDM)
FMD = (FDD, CLV)
TDL = (SNK, TDP)
FQM = (QVH, JFZ)
RNK = (JVC, XQX)
KSN = (PRS, FQM)
MPQ = (FBG, FBG)
HVG = (BMN, DSK)
RJG = (BGF, CPK)
GTF = (RLL, JHS)
SKM = (MMQ, HFD)
DFT = (TJV, MDJ)
CBB = (MCQ, MJX)
FKH = (RGL, MSQ)
HKF = (SGJ, VRD)
QJG = (BRX, JDB)
LNQ = (VVN, HLJ)
LRH = (XXS, RMG)
DGH = (KGF, GPG)
GMS = (CNP, QHH)
GMN = (DSN, GQT)
DHJ = (NKX, FJG)
DTN = (FBF, THP)
KCP = (RLX, DTT)
SLN = (XGP, LHL)
PSV = (FBN, BDX)
XBJ = (VBM, QQJ)
XMQ = (MFL, DMP)
KVV = (GSJ, NHK)
BNJ = (FJD, KCK)
HDK = (SJJ, SXR)
VMQ = (MVG, KCT)
MGP = (FHV, DVX)
BLT = (NMM, BNH)
DCB = (GPG, KGF)
BMN = (PDL, GVC)
DKS = (FDX, VNH)
CRF = (XLJ, HFG)
BDD = (LDX, SBV)
XBQ = (DKF, JRP)
CNP = (HLP, NBV)
DCJ = (DPG, LJS)
QMR = (SKK, TTC)
LFT = (NVV, SSH)
RVQ = (MDB, RFS)
HVN = (CSN, RJC)
CTQ = (GSL, RTC)
MJX = (QFF, JVS)
KKM = (KRF, HDK)
RGL = (MTP, TRD)
HSX = (LVM, FMD)
FMN = (LNP, LPX)
TJR = (RMG, XXS)
JCQ = (NHV, FGM)
QKN = (MSB, XRL)
MDB = (KJK, LDR)
JNP = (JCB, CSV)
BJT = (KQG, ZZZ)
RLF = (CKJ, CKH)
JVS = (DHJ, HMS)
NTM = (GMS, BCM)
BMH = (RGM, RSP)
HDR = (LQG, KFD)
GSQ = (TLQ, CTQ)
NKS = (HCQ, MXH)
FBG = (KQG, KQG)
QMB = (SMQ, NTS)
KJK = (PDJ, HJK)
FHV = (VNJ, PFH)
JDM = (SNM, RDD)
SSH = (RRK, SLN)
NVV = (SLN, RRK)
SGJ = (PSL, MQX)
SHM = (QQH, FNT)
JTM = (KFV, PPN)
DKF = (MRC, HTG)
MSL = (PJS, VVS)
BSB = (DCJ, KLM)
PLG = (MPQ, MPQ)
FKS = (FTB, MSL)
GXH = (GNJ, TTM)
NML = (TJR, LRH)
SBV = (PHT, KKM)
BRX = (XQJ, RNK)
FML = (BTK, BQF)
GCM = (DJJ, HDR)
XBV = (NKP, PVQ)
JHF = (GCL, NVM)
BFQ = (JQK, HRM)
NPQ = (TDR, GSP)
RSP = (DCD, MQS)
DPR = (RVQ, NMT)
DMT = (CGB, STH)
SNM = (TDJ, GHR)
XLQ = (MKS, HVN)
GRG = (RVQ, NMT)
JHN = (FHV, DVX)
PKT = (SVT, SKM)
KVD = (RQB, GSH)
TCT = (NFV, VMQ)
RTK = (QGP, QGP)
FQH = (PQF, QPG)
HXD = (VVM, GSR)
PPN = (RLF, TKN)
MTP = (NBR, SLB)
JXT = (BFQ, VSM)
PQV = (VNX, PNT)
TJF = (RXL, GKK)
NMM = (MLT, HNC)
TDJ = (GXF, NBB)
QFM = (NXG, KPC)
MXC = (BNK, BDL)
XPQ = (GRG, DPR)
VVM = (GRR, FPH)
BXG = (GXX, HHG)
PVT = (LCD, HKG)
LSJ = (NTM, DXG)
BJF = (SNK, TDP)
VNJ = (HBN, JTR)
TDR = (XGN, VSH)
NXN = (VLB, JFN)
NKP = (XQL, KMT)
MCQ = (QFF, JVS)
HJK = (MHL, FMB)
BLJ = (HPL, BLT)
SNP = (NVV, SSH)
RCJ = (FPF, FRP)
XQJ = (JVC, XQX)
CPT = (GCT, XJV)
BCC = (JVB, STM)
FSV = (QGP, TNZ)
CMN = (JQL, NQB)
RLM = (STD, FKB)
STB = (KVP, KVP)
JDB = (RNK, XQJ)
VSM = (JQK, HRM)
JPD = (HXS, HCC)
BTV = (JMT, CSK)
DHN = (PXJ, QFM)
CQJ = (BXP, QCJ)
MLT = (KNT, SHM)
DMQ = (PFS, HDG)
MBK = (QMN, JTP)
NTS = (KDT, BDD)
SCC = (FBK, LHT)
HHG = (LKC, XPS)
PRS = (QVH, QVH)
TLQ = (RTC, GSL)
BJN = (LGC, PFK)
FBF = (MHN, XPF)
VKQ = (LRR, LXJ)
PQX = (XPQ, SKF)
TNZ = (XKN, BRF)
FJD = (FNJ, CSJ)
JNJ = (CTQ, TLQ)
HTG = (LNN, QXK)
GHH = (HSX, BBL)
BDX = (XVH, VSV)
NBV = (TSM, SMX)
LNH = (SHB, KVC)
GLQ = (CMN, KQS)
CKJ = (XLQ, DRB)
HFS = (HML, FLT)
STJ = (LXJ, LRR)
QVS = (VJJ, BTV)
HCQ = (GNB, FLL)
RHM = (TLT, BCC)
MRC = (LNN, QXK)
DSN = (VDX, NKS)
HCC = (CXC, MDR)
FFX = (DCB, DGH)
HPL = (NMM, BNH)
DHM = (RPP, HXD)
LXQ = (CPT, JKS)
RLC = (MLM, CNS)
BBT = (DMT, KGC)
PQT = (VQH, GHH)
BKV = (TCC, KMJ)
KGL = (FHK, TBC)
VLD = (JHS, RLL)
DTQ = (MMK, DRL)
HKG = (MGP, JHN)
JKV = (DRL, MMK)
CVH = (KSQ, SDH)
QQR = (RKT, TCN)
JGG = (QDD, LHZ)
FSJ = (GSQ, JNJ)
LXJ = (VGQ, HKJ)
BPT = (NDJ, RFX)
QGP = (BRF, XKN)
JCR = (LXQ, GKC)
DRB = (MKS, HVN)
LQD = (DFT, FVR)
VVS = (GFC, DVG)
FQJ = (BVG, GTT)
XHX = (JJD, NVN)
MLM = (XMQ, PMD)
QDS = (TTC, SKK)
NMA = (KGM, SXH)
HBN = (BBT, LTL)
KQF = (HFS, HVS)
PVQ = (XQL, KMT)
CLV = (DDM, GMM)
BXQ = (RCJ, MVV)
GHQ = (FXN, XJX)
RSN = (HHG, GXX)
SGS = (QJV, FVM)
PQB = (XLJ, HFG)
MMK = (DCL, JRT)
JRG = (SRK, XBQ)
HXT = (BJC, CMC)
GSH = (XNP, PQV)
BNK = (DHX, NRQ)
HQM = (GSP, TDR)
BNM = (BNK, BDL)
CPK = (LNF, NFL)
JRP = (HTG, MRC)
NHV = (GFS, MBR)
NQB = (HXT, JVN)
HLP = (SMX, TSM)
PXA = (KBG, KQF)
`
  .trim()
  .split('\n');

if (runs[0]) console.log('part1 sample', part1(inputSample)); // 6
if (runs[1]) console.log('part1 real', part1(inputReal)); // 22199
if (runs[2]) console.log('part2 sample', part2(inputSample2)); // 6
if (runs[3]) console.log('part2 real', part2(inputReal)); // 13334102464297
