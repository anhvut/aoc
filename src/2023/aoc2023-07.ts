import {getCounts} from "../util";

enum HAND_TYPE {
  HIGH_CARD,
  ONE_PAIR,
  TWO_PAIR,
  THREE_OF_A_KIND,
  FULL_HOUSE,
  FOUR_OF_A_KIND,
  FIVE_OF_A_KIND
}

type HAND_ENTRY = {card: string; repeat: number};
type HAND = Array<HAND_ENTRY>;

// noinspection SpellCheckingInspection
const cardsRankNoJoker = '23456789TJQKA';

// noinspection SpellCheckingInspection
const cardsRankJoker = 'J23456789TQKA';

const parse = (input: string[], useJoker = false) => {
  const cardsRank = useJoker ? cardsRankJoker : cardsRankNoJoker;

  const getHand = (counter: Record<string, number>): HAND =>
    Object.entries(counter)
      .map(([card, repeat]) => ({card, repeat}))
      .sort((a, b) => b.repeat - a.repeat);

  return input
    .map((line) => {
      const splits = line.split(' ');
      const cards = Array.from(splits[0]);
      const bid = +splits[1];
      const ranks = cards.map((c) => cardsRank.indexOf(c));
      const counter: Record<string, number> = getCounts(cards);
      const handBeforeJoker = getHand(counter);
      let hand: HAND;
      if (useJoker) {
        if (counter['J'] && handBeforeJoker.length > 1) {
          counter[handBeforeJoker.find((c) => c.card !== 'J').card] += counter['J'];
          delete counter['J'];
        }
        hand = getHand(counter);
      } else hand = handBeforeJoker;
      let handType: HAND_TYPE;
      if (hand[0].repeat === 5) handType = HAND_TYPE.FIVE_OF_A_KIND;
      else if (hand[0].repeat === 4) handType = HAND_TYPE.FOUR_OF_A_KIND;
      else if (hand[0].repeat === 3 && hand[1]?.repeat === 2) handType = HAND_TYPE.FULL_HOUSE;
      else if (hand[0].repeat === 3) handType = HAND_TYPE.THREE_OF_A_KIND;
      else if (hand[0].repeat === 2 && hand[1]?.repeat === 2) handType = HAND_TYPE.TWO_PAIR;
      else if (hand[0].repeat === 2) handType = HAND_TYPE.ONE_PAIR;
      else handType = HAND_TYPE.HIGH_CARD;
      return {
        bid,
        ranks,
        handType
      };
    })
    .sort((a, b) => {
      if (a.handType !== b.handType) return a.handType - b.handType;
      for (let i = 0; i < a.ranks.length; i++) {
        const c = a.ranks[i];
        const d = b.ranks[i];
        if (c !== d) return c - d;
      }
      return a.bid - b.bid;
    });
};

const run = (input: string[], useJoker = false) =>
  parse(input, useJoker)
    .map((l, i) => l.bid * (i + 1))
    .reduce((a, b) => a + b);

const part1 = (input: string[]) => run(input);

const part2 = (input: string[]) => run(input, true);

const runs = [1, 1, 1, 1];

// noinspection SpellCheckingInspection
const inputSample = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`
  .trim()
  .split('\n');

// noinspection SpellCheckingInspection
const inputReal = `
32T3J 893
A9942 54
J57Q8 571
779TK 931
69696 457
Q55Q5 478
99399 735
TA756 782
QQQKQ 838
QTJJA 995
J7T7T 8
22792 790
588K8 376
J77KT 191
72T29 575
58585 196
58535 394
263K5 566
ATAAA 352
7K7AK 477
A3829 14
22349 954
KT647 244
84848 208
82A8A 77
3A383 698
97788 820
QQ4Q7 991
67Q66 837
73QQ7 879
Q4Q5Q 69
Q5Q33 767
585TT 52
5K859 943
238A3 170
48887 668
QAQQQ 591
A8755 666
4AK62 157
4A9J4 350
TJAAA 280
AT9T9 592
7Q497 390
56748 681
9425A 414
5357J 737
5QQQQ 597
383QT 583
TQTJT 81
T36AQ 441
899A9 485
AKA22 667
73K73 676
782AJ 361
TKKTK 608
8J8JJ 317
2J222 579
TJ224 259
6AK5Q 484
Q5T9K 618
JAKJ7 687
KT9J2 348
7775J 653
9297A 798
A72AA 642
49749 794
22282 733
22Q8Q 810
QK456 308
853K9 568
99A88 573
88A8Q 20
8Q47T 855
39548 184
7J478 92
75755 710
986T5 407
8837K 999
64J7A 345
444K4 364
39475 775
J332A 413
77JTJ 921
47272 154
K2T3A 318
222A2 211
7J695 935
344QQ 683
36Q26 728
7QJ56 543
25QTJ 555
8Q88Q 928
T5KTT 559
A8T96 365
44446 319
A6A3J 880
43KK3 948
9J244 882
6A66A 804
88868 117
J86T7 140
969J9 18
J2387 742
79Q9Q 766
83888 194
43556 16
8AA88 233
Q2895 65
QQ879 90
TTT99 729
64633 548
A8K7A 884
68A9A 429
85A33 635
J2A22 876
49AAA 906
25222 625
TA33K 454
99499 759
78T4K 753
76QQJ 89
34TTT 445
6K4J5 100
4TQ82 114
T7T75 28
TJJTT 490
4KKK6 716
KKK5J 119
642TJ 781
227AJ 189
89388 590
865J3 553
29962 997
43Q7Q 736
AJ792 351
4Q4J6 572
A6JA6 652
74477 799
KA889 593
JJ56K 556
AA787 867
JAAJJ 35
J4625 640
52829 295
97772 192
Q79Q7 474
8A2AJ 748
525TJ 278
69639 360
T222T 58
777J7 832
QQJQQ 245
66A63 725
T7222 594
955TT 430
3373Q 703
33KJ3 173
9Q8TQ 122
9KKK7 27
88828 632
AQTAT 524
955J3 420
77472 76
T535K 585
6K677 107
TAJAT 85
J64T5 646
83QJ8 609
88KKK 195
TT8J8 897
QTQTA 243
78267 202
3AKJK 32
T8664 246
84KK8 821
JQQQT 178
85Q88 288
A93K8 23
J2J24 582
62622 498
97A34 953
6JK2J 149
53322 788
79A83 898
73429 491
33QTQ 201
A9999 160
2T26K 866
JTJ39 770
Q422T 881
35333 833
J4262 795
6QJ8Q 289
J69J9 908
3433K 565
226Q2 606
JAKKK 786
6Q22Q 258
4454Q 421
QAQ33 287
KK68K 648
3T4K2 3
78526 489
K66KK 980
J99J9 56
AA3JA 705
A486T 33
K4999 144
6QA29 950
69999 892
KAKAK 480
A5A23 675
T5T6T 458
TT5A5 774
T7857 465
A79QQ 532
6T66T 388
5556T 717
4949A 695
27227 650
QA8J5 545
44949 341
76JA2 104
J568K 511
TK7A2 239
63AK2 432
67876 419
J2J99 519
JAAJA 680
8TA7T 281
85249 162
89Q99 367
6K664 526
66J96 273
QJ995 422
K2KK2 521
KJKKJ 322
22A8A 584
96A47 925
9QJ52 50
29J52 515
4Q6J6 124
2522Q 993
7J922 596
TT9T2 875
49484 677
A5KKA 500
J9Q9Q 701
TK228 577
42224 911
66K96 126
4T7K2 241
3Q267 706
8J22K 111
TTT55 481
6555K 901
55557 152
859JJ 933
Q44AA 408
27J88 974
44J44 947
A42K8 777
QQQ6Q 49
AJ529 418
TATTT 93
A5AAA 562
TTTT6 504
AAA78 496
T549J 7
Q332Q 276
T4434 382
JTJTA 123
A7A9A 678
44JJ4 406
T934K 130
444TQ 358
J64J4 917
9Q9QA 981
J33J3 549
TK68J 29
Q7956 186
A5TAT 400
KTKT3 529
J7887 707
6KA6K 383
Q4Q6A 976
76565 870
8T9J8 578
KAJKA 333
AK4J9 926
KQQJQ 190
88588 914
45T4J 621
7Q777 796
Q8Q3Q 803
J7755 449
65K74 626
8787Q 847
QJJ9J 904
Q8Q8Q 227
Q9J5K 567
K2K9K 369
T7T7T 145
K3366 731
AK3T7 79
TQ328 397
JQJJQ 297
77799 886
35J6J 745
K6T78 890
88AA5 638
J3Q38 301
36T74 392
666QA 814
43JQ8 613
J7J79 570
KQK55 768
TT5TT 61
49TA5 109
2QQ2Q 336
9J9AQ 561
J8866 512
A2JAQ 309
KKTTT 518
6J692 826
8Q2A2 403
9J899 990
9966A 887
55J25 620
4TT66 125
62JK8 68
44766 342
2A475 513
KJKK4 385
324J8 569
66636 785
438KQ 143
54855 749
93929 337
58886 853
9AT99 266
59535 547
99599 451
7367Q 335
534A9 409
AAJQQ 758
68K54 909
JK259 859
A3535 938
J6446 969
97999 659
446A6 851
48T9T 848
K5T7A 412
8J696 517
JT664 306
TQ6Q2 416
66667 60
T89AQ 235
54J34 824
64969 141
73JKJ 427
AAT3K 249
T7T77 891
8JA88 861
74T57 514
69A9K 937
JJK7K 651
AAQQQ 827
622TJ 142
72882 822
44595 71
KKKJ8 257
6656T 151
64725 78
J65AA 193
68744 920
63943 399
9KQQ9 685
4K2A9 240
A236A 282
77575 442
648JJ 463
55655 520
99K99 973
9J9AA 699
72K22 460
JK47A 817
3Q3Q3 713
J4628 44
Q88AQ 986
J6668 375
T85T8 988
4T44T 506
K9989 311
48888 368
7753K 952
88666 761
J8AJA 136
74494 175
KK373 657
4KT4T 712
9339J 99
K52T7 47
JJ8QQ 42
32222 210
62626 212
65552 213
47A82 260
T4J6A 41
345J3 82
4799J 924
JT5K9 181
8JJ88 791
T4672 476
A675K 204
7A499 354
848JK 377
3863K 787
4929Q 183
KKK78 872
65KK9 958
94355 434
37T7Q 523
338T6 447
52JA5 39
JAAKA 326
8KKQ8 715
5T333 533
44T2J 131
233K3 831
935T6 689
A64K8 929
T7699 630
2QJ66 669
A2KJJ 922
AT992 588
93QTQ 251
66668 440
7KJTT 393
8T674 269
8AA32 324
97AJ9 692
3J335 563
2A3K7 229
QK7KQ 772
QQAA9 834
73232 916
296Q7 464
65J65 272
KKK55 721
66333 223
QQQTA 663
9AKAA 604
888J8 261
64646 605
636J6 452
6J665 873
94TTT 507
KT9K9 616
K2K53 426
4T944 751
43423 809
889T8 509
3AKQJ 655
QQQ98 146
9Q444 359
993J4 59
22K26 75
T58K2 118
5T55Q 808
6A4Q4 492
T4JT9 516
TJ8A5 552
3AQ59 4
297K3 915
7Q288 815
44KJK 726
8J496 531
88A3A 979
2AQ76 21
K5K8K 248
2373Q 603
Q5666 660
Q2424 472
J2422 828
TT7TT 304
KJKQ7 960
2AT68 24
T66Q6 899
A9852 225
TT2TT 852
75975 720
73AT3 671
J7773 155
52225 15
ATJKT 299
6KKKJ 168
667J4 732
44J47 188
77Q78 43
Q63K8 741
4T4A4 939
Q7Q77 905
KKK9K 294
KAJ4K 330
977TJ 842
56JKQ 300
67K5T 26
J944K 468
Q3Q3Q 187
777AQ 975
42Q7J 264
J5KQ5 994
9J42A 670
8A4QA 525
7TTT6 877
K8KKK 497
67T62 483
6222A 197
Q4584 381
5595J 714
3T6T6 987
QQTQT 64
KKTKK 495
QKAA9 863
KKKKQ 200
3QAJ8 989
222T5 797
T9Q73 595
TKK7T 945
76767 871
3837K 674
99Q96 40
JJ296 762
KJ3KQ 98
Q73A7 747
5Q757 105
447JT 373
28298 356
KK3KT 755
266TT 992
Q5JQ5 840
KK59Q 538
4A94Q 113
T4TTT 268
AAAJA 158
T3T88 252
JKKKK 690
2339T 153
QQ9Q9 718
AA2AA 586
666AK 602
8Q55Q 743
J4J4K 740
9AK2J 600
TTTT9 256
94989 128
K3KKK 387
6K6TK 540
3Q333 72
QKQKQ 346
Q7A8K 1
2T222 679
6AJJJ 378
45A55 316
TTT44 622
A42K3 315
49QTK 711
4562Q 462
58K27 818
6Q8A8 539
KJQQK 293
Q28TK 946
K8J49 220
3333T 17
T774K 48
883J2 94
5QQQ5 433
T9325 971
55855 998
55K5K 96
3T32K 167
92229 226
33KJ7 972
Q7A3T 868
6JQ6Q 177
Q2Q55 756
68K6A 581
5555A 286
85QQ6 185
TTTTJ 934
2JJ64 91
46QQ6 254
626J8 30
43444 471
TKQAK 550
8KK5J 277
A46K4 371
48A8A 587
88842 541
JK9J9 405
T225T 944
TTTAJ 349
J7629 320
2K44K 843
59857 754
KKJ54 849
T85QJ 36
8T888 574
99333 968
44258 907
9A37J 355
QAAA2 53
TT3TT 805
6T696 878
74A23 482
6KJTT 784
42QAT 488
J874J 792
2Q8JK 654
89K87 967
QQQQT 615
A4A49 475
QQJJK 885
JAAA8 508
AKA4K 384
82T88 12
99A55 658
33338 614
A93JA 214
K386T 978
4443J 428
3KTT3 910
22T62 888
82637 487
3T344 850
J4424 874
J734Q 302
KJ4Q8 395
JA9J5 636
2AT5J 263
9AK4Q 9
KTTTT 174
336J6 896
JJJ8J 836
Q7K25 530
52AQT 672
A6886 179
6JJ66 148
QJJQQ 165
85685 291
7QQJ7 31
7KK87 171
45534 112
K55K2 106
6A666 764
38AA3 956
KKAJT 940
55578 846
333J3 984
3Q3J5 313
8946K 13
93J43 236
8T9A3 869
4K48K 823
J222J 325
TTJ99 279
664Q6 628
6QQQ6 87
QJQQ8 2
2TT2T 132
65Q5K 607
3K3KK 637
777JJ 224
9T84J 912
99JA9 461
5K332 923
A57Q4 839
46J59 844
3768T 793
JQ966 389
KKK7A 723
J4QKJ 645
TQJ7A 110
QJ2Q6 647
22894 665
22363 502
KAKKK 682
5KKKA 265
K35K5 734
Q6666 470
T24TT 996
8JQQT 163
A6934 232
98AA4 343
KJJ77 332
5TQ5J 697
38Q89 627
QQJ56 247
T28T2 486
55JQ5 551
836Q9 629
A88Q7 6
52555 62
84548 230
9KKK9 37
AA2AJ 789
Q2222 854
77K7K 900
T8QT6 505
95393 292
783JQ 902
8888A 97
99779 86
KKJJJ 961
87558 951
58T32 238
QJ29J 528
A7KJ3 323
5T38K 860
AKKK8 121
J5589 366
J99JJ 580
J7QJK 829
K7847 180
44TQQ 825
76266 760
23Q6T 895
73Q87 234
A6282 328
QQ9Q2 417
J5224 599
T66TT 215
35555 862
77787 536
7TQ2J 228
T5JTQ 431
K24Q9 816
53KKK 410
Q666Q 402
6K67K 334
T8TTT 962
66664 147
AKAKA 446
J844A 773
2JQQ2 510
92Q99 73
44Q4Q 129
42K9K 479
66Q34 290
33322 783
A6AAA 401
2JQJ4 927
J5558 218
3Q343 303
995J5 779
TJJTJ 70
557K5 466
86656 134
3AQQK 275
65J3A 339
A584T 558
A9A99 644
J5J74 641
3A9JK 127
67KQJ 469
Q3QKK 631
88A7J 830
JJK67 115
47AKQ 231
77677 456
2T3T6 25
K24TQ 19
AQ3AA 46
92289 57
66565 95
345JQ 894
T7JA8 250
QQJ88 274
2QJ2A 253
77737 913
KK22J 271
J66JJ 270
K9QJ9 380
75KK7 172
QQAJQ 769
33J88 22
AJ88A 780
T98Q8 473
88KK8 363
36T97 216
777KA 771
QT77K 883
K5KT5 738
73QJ9 396
7A59J 296
J7876 493
J977A 467
999J9 903
6KA95 802
QA3KK 298
88558 448
JA8KT 88
3A73J 307
288QA 966
9Q563 845
JTAA8 576
8AJ37 746
5AQ28 435
8473Q 964
JAA5T 423
QTQTT 918
44547 284
66QJ5 776
65556 340
3AA33 221
7975J 398
54Q94 858
5666K 83
2A3J6 169
5J554 763
AQ9A4 865
5468J 812
QQ7QQ 598
Q9999 807
Q2QQQ 459
46AAA 34
A788A 702
JTTK8 453
5AJ7T 164
A38K6 159
QJ5QQ 750
J54KT 116
JTKKK 688
499KK 63
A5538 404
6TAA3 242
Q9J43 379
6A2JQ 535
Q8882 643
535J3 686
666J6 813
93963 857
5TA42 353
99J53 205
JQ7K3 222
92A66 1000
K5QT5 634
5AA6A 806
KKTAK 206
5242T 708
26K26 344
JK8T8 841
39A92 357
726J7 719
33QT7 5
Q3J6T 554
9K69T 66
JJJJJ 503
866AA 601
K96A4 267
T222J 45
AJQAA 744
7K7J7 370
JJJ34 499
77TTK 161
98T35 347
3J8J3 949
92J2T 941
2JJJ2 957
87QQ2 557
67646 649
T5T99 166
6Q26Q 765
4J538 437
TAQ67 103
8TT8T 662
7A77A 120
5555J 176
449J9 709
JK98Q 811
K8JKJ 930
25AA2 752
222QQ 321
22K22 386
76J55 362
93577 656
555JJ 589
42Q54 684
Q4QQQ 305
3993A 391
3JQ2K 544
844J4 285
AA222 314
38467 970
4Q6T8 331
J4Q76 101
33J64 450
7A326 137
9977K 10
9JJK2 564
2JKA8 739
9QA72 694
3K6KJ 527
J6Q7J 444
67AJQ 135
99898 411
79823 936
5K643 237
J62J6 696
26T26 522
K8AK3 415
35553 864
J23T2 374
5555K 800
JT266 977
77772 639
8822K 610
KJQ9Q 835
A9A9A 338
J36T6 424
2586Q 494
73337 74
A8AAA 438
K66J6 199
87J58 310
5T4KT 133
28768 329
AA3A3 11
77J27 80
44442 691
525KA 198
86T5A 436
5K55J 84
33343 624
3A733 965
83523 67
66896 982
63JQ4 963
QQT88 38
27J42 150
828T5 439
3444A 955
QTQQ8 55
K839J 217
64697 156
43393 546
K7777 51
2QKJ2 704
2A2AA 312
AA5T3 534
55544 139
6572K 255
6KJK6 425
T987K 778
3TA5Q 611
QTT55 219
86TTK 664
TT344 207
77577 327
KJK3K 262
J68J5 730
43555 727
TTK2A 537
K58QA 919
KAQ97 102
A444J 443
4J969 889
9TTT3 283
AT399 983
KKJ98 661
K22J2 501
467J7 673
QJTQJ 985
787TK 932
556A5 617
6JT4T 372
97343 724
Q693Q 942
999TJ 182
TT9JQ 856
88Q42 757
633J3 560
Q6295 722
KK6J8 959
QTTA8 693
A8688 542
82434 819
6T6A9 623
78J88 138
83Q34 209
J8847 619
6QJ22 633
59995 203
99K7K 801
A3343 455
84982 108
T42JT 700
38383 612
`
  .trim()
  .split('\n');

if (runs[0]) console.log('part1 sample', part1(inputSample)); // 6440
if (runs[1]) console.log('part1 real', part1(inputReal)); // 251545216
if (runs[2]) console.log('part2 sample', part2(inputSample)); // 5905
if (runs[3]) console.log('part2 real', part2(inputReal)); // 250384185
