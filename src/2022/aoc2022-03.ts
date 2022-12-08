export {};
const charToPoints = (x: string): number => {
  const c = x.codePointAt(0) as number;
  if (c >= 97) return c - 96;
  return c - 64 + 26;
};

const sum = (x: number, y: number): number => x + y;

const part1 = (input: string[]) =>
  input
    .map((x) => {
      const l = x.length,
        h = l / 2,
        p: [Record<string, boolean>, Record<string, boolean>] = [{}, {}];
      for (let i = 0; i < l; i++) {
        p[Math.floor(i / h)][x[i]] = true;
      }
      return Object.keys(p[0]).find((x) => p[1][x]) as string;
    })
    .map(charToPoints)
    .reduce(sum, 0);

const part2 = (input: string[]) =>
  input
    .reduce<string[][]>(
      (agg, x) => {
        const last = agg[agg.length - 1];
        if (last.length >= 3) agg.push([x]);
        else last.push(x);
        return agg;
      },
      [[]]
    )
    .map((lines) =>
      lines.map((line) => {
        const r: Record<string, boolean> = {};
        Array.from(line).forEach((c) => (r[c] = true));
        return r;
      })
    )
    .map((arraySets) => {
      const first = Object.keys(arraySets.pop());
      return arraySets.reduce<string[]>((agg, set) => agg.filter((x) => set[x]), first)[0];
    })
    .map(charToPoints)
    .reduce(sum, 0);

const _inputSample = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`.split('\n');

const inputReal = `WjmsdnddnmQPZPPJPL
bQllTtpBlgwtrbbCwfZcfSFPSfLCSF
GgVgQrlpphBGrlVGgTtsRHRWVRMzRdVsqdnDnV
MMTcbpnfNGQbMjgsRwSzRptRzz
lPqCCqQdQqQmCPRzRVSwtzgqqwqR
lrDdllPdBWdDFQFnMbDNDn
FldWTldlpBSLzvpnpSTpWbDhbHNDPHhJcNHNDwbH
qVCGQRGrrgMQrJhPNchgvgJhNc
frjGfMrGQMjsRrRQjvQGmrQQszTTpSLBznlzBlLLSBLLSZTn
TPZZZMTTbNTZNtTlTbjPVRVGzpGQLLzdGgmslhzSzgLzQh
wrfwDDvcnFvCfrrSQsmzGGQQdndsGg
qfHwHCqCqCrFJrcBHCCJRmWTRTmVMttjRjRHZMNV
vpbqnzbPmWLFjFLBnjZg
NltQcCClQlcGQGtMTCRdGTGBFZRLZjFFZZhBPLrFHZFjHf
lMtlGMwMsCCNlTwtsCPzzmPmmVpmpWqVWsWz
VmWVSchSrScGtwlVtBnwBVFF
RZZPRNpPCLZvZPZNCLbQPZNBFtttmwBMTMTtttCwtgwBgl
RNNmPvbQQjPRQQNNHpNbhsfzWJqqSJcsGHhHcfhq
dtJvcpccWvLDztRCRRCrCC
qHVslPzPqHqzmPhTzmDFggjrHrSCNFFFSjgR
qPVPMhszZPVhwBZcdpvZJncbcJ
HBNLlBDtvLDHhHLvfwlFjqfQTFqqWfST
ddsGcggJncZVRdGCdZdcWWzSFrjzQFrfTzqfCjFw
VdgscZmbZNBvbDHTbL
GtSZQqpHpHfGHzzqHzHfSbPbnJCrRCnJChmjnJnbSh
DvcTNTDWlNDWdlbnnbjmRhRrCCRd
cclNlwBRvvTNccRlBNRspVLLZzVzVZQqfqqLpzpw
dBSfHdZvMQMdNVpWRmWmLCmmtB
rbTTrrjDcqcrrqrjjJGGclltPCWDmvtpmpPpvRDsCspsLC
vlhjThlqcjrnTvThndddHZngMnfwNQFNFM
tHqfszrgLsvgqtHrHtwVCGBRRjGSCwsCsmmV
MdFMclPmcDQFDlDdlZPmbVpCbFpCbBSCCRGCFpbV
mcDJdDQMcDTZQhhNNPldhhDtvHLgqtzgLvzTzWHWnWfvvz
sVdGlTMMVTGCdsTMHHWWnNBzNWpNWCpW
mPmjFhlwmwmWrpSrSWHB
jhPhjwgthtFFjRwjZgjGdJcdflfqMsZLLsdZdc
CBRsTsBBzLCfLqtqBRPNDQglSttlcgDlgGGt
rJdbrJjrdbVJZdVZCGrNNcgDQlcQrggl
FpFbbppjFCdwmTvsvfzmTnTBfq
cqhcWqqCNjGWqcqhGGZzngftmptLZLGZTn
brJHBbPVHPvSsdHrzQLzZgpfVzpfQtnL
dHFPBPrBJFRzcWNFhWwN
QTBTfQTZsjWDJBJd
FgFWNqWGDPqlPllp
CCvHzSWFrrtvNvNNHLGQQfbVRRfHZcZcVTTTnZ
ZCCHHCVRZzBZQThM
nljDtcqnhcfbwjwltfLQMLLQQppJBMLQJL
qDsqschsqblDqjcqtRmNVVdNsddNNPmFgV
QQRnqGBSpQnMmSGmRQQFtdcbbtHHccjpTFcTfF
wCNPNwNNWNgZHJHJFffqCjbj
ZNPzNWgNrsmzMVqsqs
pVWlMBWjlWWqspWDjdjMpMDCPtmmdbhtQtQtbGPCzChchz
HZNgrHSvHwnFZnvgNvnwLPBGQHmCmtPmtBCGGCmQhG
FrNfvSNSZLZJrJsVlRWWWqRBVTff
PQctSHQDPSQcbShpFzbmFddpmdmR
wqWVwvwNCJRhmdhwJw
nMnWggVqRVZqHBSBsQsQGDSZ
qppwrgZSLsVbbfvZ
hhBHPQQChCDcPcsvvhbGbsllJTfv
MDWmWFCPFWtgpRWjws
bmRjdmrJRjhJdJLZBjTFfHGTtQFTSQBS
wCNVnsspwsnvNDwnsDwSBHtDHHQGTFQFtMrQMS
nWsNvqVgVcqdJrchrz
MZlfqlmblmMRWhWNsjSQfh
CznczgtDFnVtFBNSRNttvhQsNh
SGDFzVrzVPrGHVnzCPVnlZlPwTbpTqlbqLMpbLlq
lbbbGDlwLDLjvDvm
FQfQnLTWVcPChtjmjWSj
cfgzzgfgfVdzTdfNwBpbLbwdRbpZGrdw
mwnWtbmdWdccwtgTmwnQfPqsqLQQJQQLsfQQ
SjrZbhvBZzPHQqfGJfjG
FlrMBSvMZZFBZhShMMdctWDtmFNDbDTmtmpt
ndHWprpqFTnnpdNFlhljzlGTwDGzlhGz
fvZmmVVfJctMZsgMgmcBmsZhwQlGDCzPPZWDGDjCllhC
WsmvmsmRNnpRHdbS
LgZSvhvcsWtcWnjrFrWjjjnPWW
DJDfNlDNRFlpMlFLFP
TmqTqDHdmfwJRwfdQJLHzzSggHZZcGzhtZvcZhzG
lbTpqhhgSlgtlTqSDzzLPPPrLGTTGnLm
VwGfQGBGZWNnmDLPznLB
vQdfZFWvFMMFwWGGhpGqJbpFtgbS
hSvCvFRDwmzCCHrszb
jdMgfTblgjJTLLLzqqGscmPmlqPzHc
bjQLTTbZMfJffZBBWdjBBQwVDntFpRvvDVvSnhppFv
FFnFQndPqzmjHscmJFwc
ZrZrRgDphGGDZgRRBSBNMHHvmwJJSNJHcv
DGrbbthfWWWDgtfffttfpGPVqnmblqPqCdQTlTPCzTll
sHTsGrHpsftmddRRZfRv
MqFcqcMQbMcVPCdFZCzZsRsFzL
qnVlBbcJJbbMcbgQJMMbQlDWWwHWSWwpTsGHGrpDWG
qpmvVVcGvVVcVmDsCfqTHLLJzTjfZzLZ
rSSgwwnSRRBrQrZzZHCQrZ
BFgFRgdNnSBbbnhSMBSNFdsWVtpWmzsGtvpVPvGWVDDN
fBBRfJBzzMRGRzCBgWtbCWtbgHHHWdqt
mvNcDcsDLLnnqfbv
hpTsTsTrDrfpMSFFZjPFMrSP
CNQGGDMFWGnWWvvNMQFPvrgzBLVBLszwgggLgw
mppZVZtZRTbTTpRccVbgrSLzSPSzBrfbPBbSPw
VtZJhRJcTpJTHlhtHZCFFWFjNjGGnFhCqDqG
cppcZGcGgGpdTgSSnmpFMFrFzmwqwmrHwz
RStQJNCNvfBQNjrqmrjFrBMzFB
LJDNNJCDLcdLnSVd
gNrBNSrNNtSjBndzmzlVnm
MbfqfpCLpCsLqsLFSbQLfnMdcdRRcdzldlnljzncnJ
QPQLqZqhSqhvtvTTWrNg
DtrrcGvtLnrrvLrfctfHztrfQpbwwphpdSbbPPPwFSFFRPwH
gggBqTNdTNjqWBlNmCqCmNggQPhpPPPbhhQpSBpJwbSJSQFR
ZglTmgWNgVZMZdsGMcvDcMdMnz
bjtTFsPmmtpvVlQHlQJQnJjn
WzDzwLCSLrrDNLdrSZRCwNzrlQlJMnJQJJVhbcMhgllwnJQh
fRCZzrWRzzGbGvTmBPTf
lVlfJVblPQbllflfLdJdvGpjnFRFqJFnDqpJjnpF
HcwZMgmwWCHHCSwcWCcgSCtCqqpFppGDqvDnRhgnnqFDpjFT
cwCHtGrCssWHCCWZZMbPPNBVbNfVbPllVszf
DSpSnRwrZDPWsJdZ
zjjlQVjlNZmCVCfhCfgFFfFFFqWJbgbFWHJH
lNQMlGjQBZjCmhNMCChGzlVNrpTnccLLwcRwTSppSpprLRcB
vLfvcgglbfLfgqdgNpPtzqDmPzmJTTztPCHT
ZWSQVGwQcWjSshGwVcnSzDJZtPPTzmzzJHCTzDtJ
SjVSrWVhQVQhwrLMcrFbfplcflvv
NgtfSRPnnRrSlgsPhnShDWQlMWpVBMMMpCWVBpCQBB
LLJnvwJvZHZbHTbVCQBppCFJCWWQBz
wHTGZmZvdvLvjLwZdqngNgsGtrDPSDhtNfDf
DwrDRlrwmbSbRgwsSbRwGJvQGqjJqGNTJTNGTSGn
PZdMZzCQFBZWWFQvJZvcNcjqNjjZJG
WHWCFHBBdzzMWhPFtFdMzlRsVbVmDrRVVrtQplwVwD
bpWbJMWpJbprfNMrBfJfprWhPnGtnHnLHjPPjLvsWnHGvGvj
qZdgVVgDQhQZlwcqgDcchldjjmLtntmntPQsmLnLPjssnL
RVRlgcSSdglZczdqbTCrhBrBpNBSBSbF
SgbGvfbnGgmnNnnzqMqqHHRzbZBzZR
TWlssdFwWdtswWPtTtWltwdVHlZZzRHZBZRzrprqHMpqgZrq
dssdCWTFwSvgmDjDCG
pqsDnNzzZsdZSnDSpwjBCBWvgjvWjNFWQgWC
lVGtRtLMGGfbTGTtTbQCQnBQBnBFgFQcgjfc
GPbTbPtnPttmLTGRRbtmdwSDwpwwhZqmdpzDhDJd
MdccRQMJvHdgZggvhjjMgHcHlWWqFFWmGqFbJWzzFLWlLmPm
TDpSsTrtblSzQlGQ
tfVNrwTwtswTssMRjMMQQddNMRCd
GqGqGpFqqgDGFRqDwwqqmzpGTLPvVWMPVCPLJLRJJMLTlCWV
rHrSbrsbQcbtdNHHHfdPlvWBLLWlvMTVlVLCJf
rccbtthHSHsNHrrcttwqpnDFnMmpnzFnFhnF
vQQQbRvlLjNNLLBzNllNHNBqGqhMWhGGhTqmPmqhWTFhRm
tnsZwgSnCDrZSCDsfTMSGpPWmPSWmGmbFq
CrVnfnCCtrCgfrffcrstDnJNlvJdNvzdBcHdLBJHvbBv
nmQsMqTnLlmmpQZmTZcdHwCFSpHJSSWHSJVSWSHH
vRgRRtfPvDjzDgDbsjzRvjfNNWWCSJFwrHCFbrCJWJHCSC
GhsRBztDBgzRPstgzBLZcqmlcLMMlmdLQBZT
CWfvvhfWrlllSSRrdQrQDQGQdTRr
jsNctMZLmMZLMmmmbbNZswZNqBTHPHzBMHHTMGqBRMRPDQqP
jcwjntLngngplgFhgRvJVp
vchzqzwlhzRqzVZQwqtVPZLnLLbDnDFnbGLnDbPLDGWD
pBTHpdpHsrNBBsgdrdCpCpCgRFCMFDLFWWnFWLRRGWbDFGSF
prsBHfggjpjjcRQlqvtw
VDwzLQrDDWrrwWbJrVJwVrVQfMfSCNPMfSlMlPcMmThChf
tsjFdsRsgtRmGZHpHRgBClSlGSClcPhGCfPlllll
qBBFBZZpmgdFHdstjFJbzVwJVqJWWbrvWJDL
mgjZmrqmdsmGtDplglJgRVVc
nPhnLvnHLtLnWzzcNwwcchVJRflhpc
SnnLntLWZsMqZrSZ
jcrNfnrNLNNqFgbDfCSgSQbS
zPPHtMrGGptvTWPVvzvHRgQsbDsSRRCCQbtJsJDS
wHzrWVzPwThGGwMHzTGGPGwhdlZnBndZLljNjBcLdZdNBN
qNPhNqddBNhqvPhFvllNgNBHCrrCQnjpCfPVJnnJQJCjJj
ZZbZTZcmGWWMDWRSDnBVQCjVDffJjnnVCJ
SGBRTTZGGcLSSWTScsmcMbGlhgwFqslhzqggghwhNvwwvw
GCCPwpsBqNSsBPpSCrSshzQzLhTvQhqTnhtTVQcT
JDjFJfMJgWbWWlDJcnvvhvtdLnjnzhjz
FlDflbZfZgJgMgbmgZJfSpGCvvrGrRCpCBrZRprw
HwqhgFGSMgPPCGQQQnvvcpjn
BllbdfRBsBmsmZlBTmQCjTnNWNCmNmvc
lJDlBflDdbbRlLbfsbZBJtbRqrVFPnwwwhVMHwVrgJwwrSwH
LTvLtTFLCddFTTthsbVVmHHcqVHmWRcmHL
lBgwwNggwMwNVbjBCQcCqCRB
nCMCwZGGNGJnGhtrzsdDDndtsF
ZlZdJJplLZBDpJjNJlGjQCLmCQmTwVVCbQQbqWCT
SfgFzftrnRzMnVbPPPQmPq
FfmrRvgShchvFfghzRvgtvFBpJDpcGNGdBHJlpDDDJlDJZ
LdNrLzjdWQnrDHsD
tBZmBZtVZpldVMPRnsRQsnnsHVbRHs
MlfldwMBBFMZTSFTSqLqcvSJ
nJqBlvvBjHhBcqqRrGPrTrGpBCGzTG
MfVCVMLZVZtQCdtLMtQtQSSSTSzFRSRPFpFRGpdTFd
CCQQtQVgfbbQNggsNfQZZbHbcWmnhlhnvlnlHjJWvnhv
SGmmGwVwnmhbhnhwhhwbdMgNNgjmvMDrJTCgmBTBBj
ztFWcWQQfcRzzRFllvjDjggjDDfBgJMBgC
QtzcJtFtqcFQRRWRRQWFzFGpVnVSGLLGZVGVqddbLqGL
tBmdmQtjMMqDLqBtttQMjDdwwgwccMMbffllgzncwfFflF
TPVHTVsRsJVHVrVvHvrRhVJbfCgFbzwbCGgFlwgcCwbn
hssVWnRrTVZSSZZqjLddWtLBddqtQL
WhhtGZtZGQZmvCfCwtvhqgbfdDJdfjlSDlSlBBJDSg
rHnpFHnDrdBggJngnL
HVcTzFPNzTpPPVrzmtwtvvvmNQwDQvWw
dStBwStGGBrNnBdrSSMzvjhgFcvvDcnnvPDn
RLZbCWWJbHRsTHspZWLcDWcPPhzczfjgPjjvjz
ZmLHJqJsLJJHLRsmmmGSztQdQzmNBrBN
JrmRVdvcmvvmvvRTdBVVfjFQLwjqLFLWFMqwcFjz
DDhhttDHHHbHSnsDbHqMqzwQLLFwLsjjLLQf
bSbPthtgGQPNPHnSDChCRJZZJRCZdCrCBZZZZvJd
rqvVqNJpVVNwnqqTwthMMq
jsFRFDQRLQDQmsPRmQsmcQFMzGhwBGBhTzTTzHnRhnhBhRwz
dCccQcQsFCmCQfbJbvZMNZfJrJll
TGjrrTRLHvrQrFDCrmzzVm
NwWqqhndWtzDQhCzVCsh
CSSwNNwqgBBBBbGGvLTTvb
fRBRBHCVRRzcCdZHvRvZVCZLNjtwtNwNTtLjNtTpTNttfS
DZshMssZmTMjwjSLtw
QPrJDDJsPDFmFrFDscHHRzrcvccCZRVzrR
zgqzLLvlvdgpgrWpWW
RnJmNRncnScFmZSScrJQQdbpGdHbWHtPHpBHsdFdsW
JDfRcrSnmDSJcNfrNZNjvlwjhllhMzlDqMqMvh
fDLzSMLhhtDWMvtjCRRZjCHHJjChHN
pmTNpVwPNbPwPBFRqRJqjCnFjZFV
dTwpddsTbgbQBssprsgtvgcNLzWMctfSgcfWLt
fbBsBTsNDhGBGZcLLLJJQffQLQ
MpsCCMHClsHQqZcQWLqR
FtjdCFzVljFlslVCpFrFjPhggBGDgNSTTgbGNmbGTr
HqTfmsCFmPlGHddNVGpLhz
JjjcQQJgjZvZZzzwgpNVGwLGgV
nQnSbDDRbSQJQQpRZtZcZZsPPrFfWCPFWlrFsFPqmqFt
TgTDDrCmqJDGLrhqLmLGqDQRFtttjMbQZJjtdtjFdsdF
WHffcHWnlvvcSSWzPVvHpWWVRbFdQQtQnjwZFMwZtwddsZbd
cBpPplVVPfvVGBDLGCBqmmLM
dlMMmnmjvCCjJrrvMdgHcbcFbqFbzQrFbGzb
tPhRBRZPtZRshTzRsNShRZNGDfGgFFbFQqbGHDHbqfGD
TSPhBVsTwRBTpVtRZpVhZLJjWzLjJlJlJvmwWWzwWn
WcvLLgLcczLTDtccbLcgzMMfPsGwRPjwfMwHMfMvMp
QVmlPQCdJlJJJlFJJJnPQQhlwwMMMnMwNMpwMGwwfswwGMsR
lrSCZZVFhPSZgzgWttWBcc
bwbbZLlbwlJhBzFCgtTGRGQldQRmQW
SSnpHnPHqpmggCWgdT
PPscHHTfcsPSDVfVssjvwFJLBJFjFJJZFJLNLwrL
nLgDSHgwRgGnHjjNfTRhjPVpWV
BstQsvhQZQQbMvCvMPVNWpPcTjfmPmmW
brtCrtvtzrhdSDJDwh
dTQTwgmZQbDzzMQCCl
WLLtntFnfnRHbttnSRRzSMVGDDMGzVlV
JsPhFtfbLWnsLPLqgdJcjmcwTwjcdw
wMwMbMRRBBMLPBlhLRQlhPcWzgJNvJtzWNtJptpgjJgpBj
TnmGGmVnFFNSZsnZqFsWzWjrTJzvzWvWgWtTWz
qnHGnVSsqZCddnGCGCSNdDbLQPcLLQlDhPRMhb
NGsBTBlqsvfQBQqsTLTFltRMmRwmmHmFtPSRhM
gjZWJWCZdDpjggDdgnpWdZZJtFwFRFFRMwbbmRPtShnwRbtt
zZpSDDgpzcDddjVWggJsQGrfQvrQcTGTGrTrqr
hpJchhFWMpRDWHWcDGnCGrnGnwPTwpQnCt
bmgddgmlmjjbfddgmmmNvGQLrtfTwrTtLtGTLQVQQP
qqbmdZgzZbvgPDccHcZPhWWH
VVrdQZZrZSZFgQTTTzggrVZVMlfBBfvcMBCBslMhBvsMBSff
bQwnHwbNpwcsCwjMBw
pHqqPnJHqpPNJFzqTzQWWDQQZq
HgwTDfgBwBgcRHqRRjHqHTzQQClSzvlzPVSQLvbbPC
MnhtNZNnJpWpGhMQbCCPVSPLNmSPQQ
rrhJMFJJZFJpHcjRLFRfHjgj
vGvGMBlttBltvjdgbPsrsDWdjPPP
HnJQHVqNmQHmZsDZPPrDWpgFps
JSqJQVVDqqVfJNfRffGSGMBwGTCCCTlBMSBl
PsFZPfGbDNbtQmCCmCBBbmmL
dcRdhSrCqjThTRcTpLzHQzTmpmlgBz
hhhcqCvwhhVhfPNvsMstZtsZ
VvGwBBwvZtGgfZCqShnFFjSstCMC
NlTRdvpDdTRNzdTHHnMssCnCnCqjSz
LvWvPcWLpGwBwVVgVc
bVVmSrLmLSJzTZMSFTBdMj
QnvqRGGDvWpQWGDpvsRZLBzTRjBTtjRTPtBF
QWGvDpqcvpGWQpGngqGQGwpLhJVNJcrbfrVbfbhHrmlVJHVV
NGRGPZWZpblGcJtfssSSsbffCs
gwRhjvrgjmwgnzvJJJtVCtHJqs
rrmLrhwFFmmTMgFRjNZWNpZlZLppQNcDWP
qsHZsHZrTBtZrHBNFCJGWrMcpcddWGJWLG
mRDDzbPVDVlVDgbgRRvmwCcWdGvJwGddpvLm
PnfDbPbVzDbVfjnnlbzhVFsspBSfFsssHQNTBpFqNQ
gCmtbDqPVVVqggCGqTJjHMpMQfgMpMHQQpcM
zNZnsSLzZzrlRhTTJMHppjfHSpvp
nhdrBsLlRRrdTlsTVmCmGqDVFdtDPGwV
FnqNfdGfgzmPLGmj
blvVvbsRwgnzjCPcbT
RWWvtvphnZQZwMBNdHfNDBZZdq
DMRhDhdvnjhnPnvPMfdZSGTccGJFjGFFpFpFTbTpTW
NVgVmtzVlLBmgztsBNmtgCmqFpJJFGGpGbrcGGsrcpbWPr
zwBztLBzllQPDZvfQZfRfHSR
mFCgPzmqgtPPqMmFWzbMttcRGvRclvHhWGGcZvclRfHh
psSNnhnLGnwZHZGv
hBpNLTNLBhsPmbCgBtPDbM
JsbLLWLJRfQFnccmQhtvvPCP
dwgrVwGpgVhCrrhPDHtC
gpGSjpVdVpVppjjVZBwdCbFRWLzLMSRMbNzfzbWR
DmMQMJmnmGwzGwwG
ZcLcgLgcRsZSctHFWLGfjjBwvbvBsvjpfhGb
GgFPqFtLRHLFSHLRRFRHHtMnJVNCQCrJCJCnMJDdnqDV
tqdqFqdsRdVdtHMNdRZHTZLrHJgrlZQPJLgr
GGwVcpGznmhbWhwcVVgzTrDrDDLZlTLLZQrJ
nhbnbfjcnfMfFNVtBq
QHmPNZvfCLsSwJSm
pDhjpVDFcRBpFFjjMnRcVhpFCzbzsZbSSCtwtLMSLZLLtLbs
FRjrnRchnfHPrrZlHl
bjjMbdChgRDZthpQpRQnwRTprRwS
mGzJsGsHzHGPvvvqvzGzSnglSJrrwQgnlQQSrlQl
qvzHqHLHmHgPsNBdCdZtVBtVVMBFbh
CctrCwrdpTwcpVrdpTpcrcnSJQttvQPHJQNQnQNjvvHQ
zsqRlslRLqfgRmWsRgRzqzQnHjSBSQWJHPhHnSvHnJJJ
GRgllbgfRgbzfRmwwcGdFMcTVPrFCF`.split('\n');

console.log(part1(inputReal));
console.log(part2(inputReal));
