export {};

const parse = (input: string[]) => {
  const expr = /\[(\d+)-(\d+)-(\d+) (\d+):(\d+)] ((Guard #(\d+) begins shift)|(falls asleep)|(wakes up))/;
  const r = input
    .map((l) => l.match(expr).slice(1))
    .map(([y, m, d, h, mn, _, __, id, sleep, _wake]) => ({
      year: +y,
      month: +m,
      day: +d,
      hour: +h,
      minute: +mn,
      id: id ? +id : null,
      sleep: Boolean(sleep),
    }));
  let currentId = undefined;
  for (const l of r) {
    if (l.id) currentId = l.id;
    else l.id = currentId;
  }
  return r.sort((a, b) => {
    for (const key of [/*'id',*/ 'year', 'month', 'day', 'hour', 'minute']) {
      const c = (a as any)[key] - (b as any)[key];
      if (c) return c;
    }
    return 0;
  });
};

const part1 = (input: string[]) => {
  const lines = parse(input);
  return lines.map((l) => JSON.stringify(l));
};

const part2 = (input: string[]) => {
  const lines = parse(input);
  lines.toString();
  return 0;
};

const runs = [0, 1, 0, 0, 0];

const inputSample = `
[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up
`
  .trim()
  .split('\n');

const inputReal = `
[1518-11-13 00:04] Guard #2411 begins shift
[1518-09-18 00:43] wakes up
[1518-08-29 23:57] Guard #1871 begins shift
[1518-03-13 00:56] wakes up
[1518-11-13 23:56] Guard #947 begins shift
[1518-05-31 00:54] falls asleep
[1518-11-10 00:40] falls asleep
[1518-05-16 00:39] falls asleep
[1518-03-05 00:01] Guard #967 begins shift
[1518-09-14 00:04] Guard #631 begins shift
[1518-03-24 00:42] falls asleep
[1518-04-15 00:27] wakes up
[1518-04-26 00:47] wakes up
[1518-10-04 00:51] wakes up
[1518-05-17 00:40] wakes up
[1518-04-28 00:50] falls asleep
[1518-04-17 23:52] Guard #1297 begins shift
[1518-09-23 00:01] Guard #3347 begins shift
[1518-11-15 00:48] falls asleep
[1518-02-07 23:59] Guard #1871 begins shift
[1518-05-22 00:59] wakes up
[1518-05-28 23:47] Guard #2411 begins shift
[1518-09-15 00:57] wakes up
[1518-10-27 00:50] falls asleep
[1518-06-17 00:01] Guard #631 begins shift
[1518-05-20 00:42] wakes up
[1518-04-06 00:47] wakes up
[1518-10-29 00:20] wakes up
[1518-11-19 00:17] wakes up
[1518-10-23 00:53] wakes up
[1518-04-16 00:00] Guard #3347 begins shift
[1518-07-23 00:58] wakes up
[1518-04-06 00:51] wakes up
[1518-03-25 00:03] falls asleep
[1518-09-01 00:20] falls asleep
[1518-02-07 00:01] Guard #967 begins shift
[1518-09-08 00:03] Guard #3251 begins shift
[1518-07-01 00:44] wakes up
[1518-03-27 00:40] wakes up
[1518-03-15 23:56] Guard #2411 begins shift
[1518-10-07 00:53] falls asleep
[1518-04-12 00:07] falls asleep
[1518-06-07 00:03] Guard #1999 begins shift
[1518-09-06 00:03] Guard #947 begins shift
[1518-07-17 00:14] falls asleep
[1518-07-21 00:32] wakes up
[1518-08-18 00:04] falls asleep
[1518-03-19 00:49] falls asleep
[1518-06-07 23:59] Guard #947 begins shift
[1518-09-28 00:26] wakes up
[1518-09-03 00:40] wakes up
[1518-07-14 00:00] Guard #3347 begins shift
[1518-04-18 23:56] Guard #83 begins shift
[1518-05-14 00:42] wakes up
[1518-04-17 00:01] Guard #137 begins shift
[1518-11-21 23:59] Guard #811 begins shift
[1518-06-06 00:47] falls asleep
[1518-03-12 00:00] Guard #811 begins shift
[1518-04-19 00:11] falls asleep
[1518-07-01 23:57] Guard #1151 begins shift
[1518-11-05 00:43] falls asleep
[1518-09-19 23:57] Guard #1213 begins shift
[1518-03-08 00:42] wakes up
[1518-03-14 00:18] falls asleep
[1518-09-12 00:44] falls asleep
[1518-03-09 23:59] Guard #241 begins shift
[1518-09-20 00:49] wakes up
[1518-11-07 23:54] Guard #1999 begins shift
[1518-02-20 00:00] Guard #3221 begins shift
[1518-06-11 00:00] Guard #137 begins shift
[1518-05-09 00:28] falls asleep
[1518-07-30 23:59] Guard #2351 begins shift
[1518-11-04 00:01] Guard #137 begins shift
[1518-05-29 00:03] falls asleep
[1518-06-26 00:00] Guard #811 begins shift
[1518-08-29 00:05] falls asleep
[1518-03-01 00:56] wakes up
[1518-06-04 00:30] falls asleep
[1518-05-07 00:52] wakes up
[1518-08-08 00:23] wakes up
[1518-03-22 00:08] falls asleep
[1518-07-04 23:59] Guard #1297 begins shift
[1518-04-05 00:21] falls asleep
[1518-05-31 00:56] wakes up
[1518-07-30 00:13] falls asleep
[1518-09-13 00:50] falls asleep
[1518-02-19 00:51] falls asleep
[1518-07-04 00:11] falls asleep
[1518-10-31 00:50] falls asleep
[1518-02-19 00:20] falls asleep
[1518-10-02 00:02] Guard #479 begins shift
[1518-10-24 00:34] falls asleep
[1518-02-18 00:00] Guard #2351 begins shift
[1518-02-04 00:27] wakes up
[1518-10-22 00:04] falls asleep
[1518-11-22 00:37] falls asleep
[1518-04-18 00:40] falls asleep
[1518-08-18 00:40] wakes up
[1518-08-22 00:49] falls asleep
[1518-03-25 00:36] falls asleep
[1518-03-14 00:28] falls asleep
[1518-10-22 00:18] wakes up
[1518-09-28 00:12] falls asleep
[1518-09-15 23:58] Guard #3221 begins shift
[1518-09-14 00:45] wakes up
[1518-07-12 23:56] Guard #2741 begins shift
[1518-06-23 23:46] Guard #3221 begins shift
[1518-06-07 00:50] wakes up
[1518-05-02 00:27] falls asleep
[1518-03-24 00:53] wakes up
[1518-09-08 00:36] falls asleep
[1518-10-04 00:50] falls asleep
[1518-07-26 23:56] Guard #617 begins shift
[1518-04-10 00:51] wakes up
[1518-09-16 00:21] falls asleep
[1518-04-21 00:38] falls asleep
[1518-08-24 00:01] Guard #1999 begins shift
[1518-06-10 00:46] falls asleep
[1518-04-15 00:04] Guard #1871 begins shift
[1518-02-26 00:47] wakes up
[1518-03-11 00:00] Guard #2411 begins shift
[1518-11-21 00:56] falls asleep
[1518-08-28 00:45] falls asleep
[1518-11-08 00:34] falls asleep
[1518-03-29 00:56] wakes up
[1518-06-25 00:38] falls asleep
[1518-07-27 23:50] Guard #503 begins shift
[1518-08-01 00:27] wakes up
[1518-04-04 00:04] Guard #479 begins shift
[1518-04-07 00:51] wakes up
[1518-07-15 00:20] wakes up
[1518-02-03 00:34] wakes up
[1518-04-25 00:01] falls asleep
[1518-04-26 00:04] Guard #503 begins shift
[1518-10-27 00:52] wakes up
[1518-06-22 00:58] wakes up
[1518-08-19 00:59] wakes up
[1518-06-26 00:23] falls asleep
[1518-09-22 00:24] falls asleep
[1518-06-11 23:56] Guard #947 begins shift
[1518-06-16 00:52] wakes up
[1518-04-13 00:42] falls asleep
[1518-06-27 00:23] falls asleep
[1518-06-14 00:51] wakes up
[1518-03-15 00:14] wakes up
[1518-02-12 00:59] wakes up
[1518-04-23 00:53] falls asleep
[1518-11-05 23:57] Guard #479 begins shift
[1518-08-22 00:07] falls asleep
[1518-02-14 00:00] falls asleep
[1518-03-19 00:54] wakes up
[1518-06-02 00:33] wakes up
[1518-02-17 00:31] falls asleep
[1518-10-24 00:57] wakes up
[1518-10-07 00:48] wakes up
[1518-05-25 00:57] wakes up
[1518-10-08 00:18] wakes up
[1518-11-18 23:57] Guard #479 begins shift
[1518-04-09 00:51] wakes up
[1518-07-28 00:01] falls asleep
[1518-06-21 00:00] Guard #617 begins shift
[1518-07-23 23:58] Guard #503 begins shift
[1518-02-04 00:42] falls asleep
[1518-07-21 23:46] Guard #967 begins shift
[1518-02-08 00:54] wakes up
[1518-07-04 00:54] wakes up
[1518-05-02 23:58] Guard #3433 begins shift
[1518-04-25 00:58] wakes up
[1518-06-12 00:58] wakes up
[1518-11-17 23:58] Guard #947 begins shift
[1518-05-06 23:56] Guard #947 begins shift
[1518-04-06 00:00] Guard #3347 begins shift
[1518-09-03 00:24] wakes up
[1518-02-23 00:31] falls asleep
[1518-03-02 00:51] wakes up
[1518-03-06 00:00] Guard #1151 begins shift
[1518-07-14 00:24] wakes up
[1518-10-12 00:45] falls asleep
[1518-08-02 00:51] wakes up
[1518-04-20 23:58] Guard #1213 begins shift
[1518-10-31 00:53] wakes up
[1518-06-25 00:15] falls asleep
[1518-06-22 23:49] Guard #1297 begins shift
[1518-03-09 00:55] wakes up
[1518-03-14 00:13] falls asleep
[1518-04-27 00:55] wakes up
[1518-03-02 00:02] Guard #811 begins shift
[1518-08-19 00:53] falls asleep
[1518-02-08 00:32] wakes up
[1518-11-07 00:47] falls asleep
[1518-04-08 23:56] Guard #947 begins shift
[1518-02-26 00:31] falls asleep
[1518-08-09 00:03] Guard #1213 begins shift
[1518-07-31 00:48] wakes up
[1518-04-08 00:49] wakes up
[1518-08-31 00:18] falls asleep
[1518-08-15 00:55] wakes up
[1518-10-20 23:57] Guard #1871 begins shift
[1518-03-14 00:02] Guard #2351 begins shift
[1518-02-03 00:05] falls asleep
[1518-03-28 00:04] Guard #2351 begins shift
[1518-04-19 23:51] Guard #3251 begins shift
[1518-05-16 00:36] wakes up
[1518-02-10 00:02] Guard #3347 begins shift
[1518-09-05 00:51] wakes up
[1518-06-14 23:59] Guard #2351 begins shift
[1518-11-21 00:00] Guard #3221 begins shift
[1518-11-21 00:59] wakes up
[1518-04-28 23:57] Guard #967 begins shift
[1518-10-12 00:24] wakes up
[1518-06-22 00:02] Guard #811 begins shift
[1518-02-19 00:01] Guard #967 begins shift
[1518-02-11 00:01] Guard #2741 begins shift
[1518-08-30 00:43] wakes up
[1518-10-14 00:57] wakes up
[1518-10-23 00:04] Guard #1151 begins shift
[1518-07-15 00:03] Guard #1151 begins shift
[1518-07-06 00:51] falls asleep
[1518-03-30 00:47] wakes up
[1518-07-27 00:56] wakes up
[1518-03-06 00:08] falls asleep
[1518-03-11 00:35] falls asleep
[1518-05-13 00:14] falls asleep
[1518-06-23 00:34] wakes up
[1518-10-15 00:43] wakes up
[1518-10-14 23:56] Guard #83 begins shift
[1518-04-15 00:22] falls asleep
[1518-11-08 00:00] falls asleep
[1518-06-14 00:15] wakes up
[1518-10-18 00:24] falls asleep
[1518-04-27 00:50] falls asleep
[1518-05-06 00:45] falls asleep
[1518-05-26 00:04] Guard #503 begins shift
[1518-03-08 23:57] Guard #967 begins shift
[1518-05-29 00:37] wakes up
[1518-05-07 00:21] falls asleep
[1518-11-01 00:11] falls asleep
[1518-02-09 00:20] falls asleep
[1518-09-15 00:02] Guard #2351 begins shift
[1518-10-26 00:42] wakes up
[1518-06-09 00:03] Guard #479 begins shift
[1518-10-03 00:02] Guard #3347 begins shift
[1518-04-26 00:33] falls asleep
[1518-04-01 00:48] wakes up
[1518-08-13 23:48] Guard #1213 begins shift
[1518-05-16 00:21] falls asleep
[1518-09-21 23:53] Guard #3347 begins shift
[1518-09-04 00:39] wakes up
[1518-02-11 00:55] wakes up
[1518-10-17 00:21] falls asleep
[1518-10-22 00:59] wakes up
[1518-08-07 23:48] Guard #967 begins shift
[1518-05-12 00:59] wakes up
[1518-10-31 00:00] Guard #811 begins shift
[1518-11-20 00:58] wakes up
[1518-06-09 00:57] wakes up
[1518-10-20 00:53] wakes up
[1518-06-27 00:01] Guard #503 begins shift
[1518-03-18 00:07] wakes up
[1518-04-04 00:10] falls asleep
[1518-08-12 00:04] falls asleep
[1518-02-08 23:59] Guard #3221 begins shift
[1518-10-05 00:15] falls asleep
[1518-05-09 00:38] wakes up
[1518-08-20 23:53] Guard #947 begins shift
[1518-03-18 00:48] falls asleep
[1518-11-23 00:40] wakes up
[1518-02-13 00:53] wakes up
[1518-08-26 00:15] wakes up
[1518-11-17 00:32] wakes up
[1518-09-24 00:53] wakes up
[1518-09-23 23:59] Guard #617 begins shift
[1518-04-28 00:02] Guard #3221 begins shift
[1518-02-22 00:58] wakes up
[1518-09-01 00:01] Guard #947 begins shift
[1518-09-07 00:33] falls asleep
[1518-10-10 00:24] falls asleep
[1518-09-17 00:03] Guard #1871 begins shift
[1518-03-31 00:56] wakes up
[1518-10-13 00:54] falls asleep
[1518-11-03 00:10] falls asleep
[1518-10-25 00:02] Guard #2351 begins shift
[1518-02-20 00:55] wakes up
[1518-10-09 00:49] wakes up
[1518-03-14 00:14] wakes up
[1518-09-29 00:57] wakes up
[1518-10-11 00:02] Guard #2741 begins shift
[1518-09-07 00:35] wakes up
[1518-07-16 23:56] Guard #2351 begins shift
[1518-07-26 00:00] Guard #3251 begins shift
[1518-08-22 00:46] wakes up
[1518-10-15 00:58] wakes up
[1518-02-20 00:28] falls asleep
[1518-05-11 23:59] Guard #83 begins shift
[1518-11-12 00:30] wakes up
[1518-04-10 23:56] Guard #1297 begins shift
[1518-08-11 00:49] falls asleep
[1518-08-16 00:30] wakes up
[1518-03-12 00:34] falls asleep
[1518-06-09 00:56] falls asleep
[1518-04-11 00:32] falls asleep
[1518-04-18 00:50] wakes up
[1518-07-18 00:30] falls asleep
[1518-04-09 00:18] falls asleep
[1518-07-04 00:29] falls asleep
[1518-09-16 00:48] wakes up
[1518-06-28 00:19] falls asleep
[1518-02-24 00:33] falls asleep
[1518-09-12 00:00] Guard #3251 begins shift
[1518-02-19 00:59] wakes up
[1518-09-07 00:45] falls asleep
[1518-11-02 00:44] wakes up
[1518-09-18 00:29] wakes up
[1518-07-12 00:56] wakes up
[1518-02-25 00:02] falls asleep
[1518-05-06 00:54] wakes up
[1518-09-28 00:01] Guard #83 begins shift
[1518-05-08 00:44] falls asleep
[1518-06-28 23:54] Guard #137 begins shift
[1518-08-01 00:03] Guard #479 begins shift
[1518-07-08 00:54] wakes up
[1518-08-28 00:50] wakes up
[1518-11-21 00:53] wakes up
[1518-06-11 00:19] falls asleep
[1518-09-07 00:41] wakes up
[1518-06-01 00:38] falls asleep
[1518-06-03 23:58] Guard #2351 begins shift
[1518-07-28 23:58] Guard #2411 begins shift
[1518-08-23 00:40] wakes up
[1518-03-26 00:00] Guard #137 begins shift
[1518-03-18 00:06] falls asleep
[1518-08-22 00:42] falls asleep
[1518-07-05 00:30] falls asleep
[1518-03-16 00:36] wakes up
[1518-04-15 00:30] falls asleep
[1518-04-07 00:00] Guard #479 begins shift
[1518-10-05 00:54] wakes up
[1518-03-18 00:03] Guard #503 begins shift
[1518-08-09 00:56] wakes up
[1518-03-14 00:59] wakes up
[1518-09-09 00:00] Guard #811 begins shift
[1518-08-25 23:56] Guard #83 begins shift
[1518-05-25 00:06] falls asleep
[1518-10-13 00:59] wakes up
[1518-04-06 00:44] falls asleep
[1518-06-23 00:01] falls asleep
[1518-03-31 23:57] Guard #2411 begins shift
[1518-11-13 00:38] wakes up
[1518-04-24 23:54] Guard #617 begins shift
[1518-06-30 23:57] Guard #3221 begins shift
[1518-05-23 00:03] Guard #3433 begins shift
[1518-07-01 00:33] falls asleep
[1518-03-26 00:46] wakes up
[1518-08-17 23:53] Guard #1151 begins shift
[1518-11-10 00:00] Guard #1151 begins shift
[1518-08-30 00:41] falls asleep
[1518-10-02 00:57] falls asleep
[1518-07-19 23:57] Guard #617 begins shift
[1518-03-26 00:38] falls asleep
[1518-08-14 00:09] wakes up
[1518-06-18 00:02] Guard #3221 begins shift
[1518-06-11 00:51] wakes up
[1518-10-01 00:39] wakes up
[1518-03-16 23:59] Guard #3221 begins shift
[1518-07-30 00:54] wakes up
[1518-04-06 00:50] falls asleep
[1518-04-13 23:59] Guard #631 begins shift
[1518-05-28 00:02] Guard #83 begins shift
[1518-03-29 00:01] Guard #967 begins shift
[1518-03-11 00:31] wakes up
[1518-03-14 00:21] wakes up
[1518-06-03 00:59] wakes up
[1518-04-05 00:01] Guard #3221 begins shift
[1518-03-03 00:04] Guard #2741 begins shift
[1518-04-23 00:59] wakes up
[1518-02-27 00:55] wakes up
[1518-02-03 23:59] Guard #479 begins shift
[1518-04-13 00:31] falls asleep
[1518-04-24 00:25] wakes up
[1518-04-07 00:32] falls asleep
[1518-09-03 00:11] falls asleep
[1518-03-13 00:00] Guard #137 begins shift
[1518-07-04 00:04] Guard #3251 begins shift
[1518-10-12 00:46] wakes up
[1518-09-10 00:41] falls asleep
[1518-08-08 00:00] falls asleep
[1518-04-11 00:49] wakes up
[1518-10-30 00:50] wakes up
[1518-04-27 00:36] falls asleep
[1518-06-22 00:12] falls asleep
[1518-04-03 00:31] falls asleep
[1518-03-16 00:25] wakes up
[1518-06-18 00:52] wakes up
[1518-09-09 00:06] falls asleep
[1518-10-23 23:59] Guard #83 begins shift
[1518-08-30 00:47] falls asleep
[1518-03-24 00:39] wakes up
[1518-08-08 00:32] falls asleep
[1518-10-04 00:41] wakes up
[1518-06-01 00:02] Guard #3221 begins shift
[1518-05-13 00:21] wakes up
[1518-09-15 00:36] falls asleep
[1518-07-17 00:48] falls asleep
[1518-10-19 00:00] falls asleep
[1518-09-06 00:45] wakes up
[1518-07-28 00:48] wakes up
[1518-04-04 00:29] falls asleep
[1518-08-17 00:37] falls asleep
[1518-06-08 00:56] falls asleep
[1518-02-19 00:57] falls asleep
[1518-07-12 00:01] Guard #2411 begins shift
[1518-10-08 23:57] Guard #3347 begins shift
[1518-03-02 00:59] wakes up
[1518-11-09 00:28] falls asleep
[1518-08-02 00:34] falls asleep
[1518-05-10 00:04] Guard #1297 begins shift
[1518-02-18 00:55] wakes up
[1518-10-29 00:16] falls asleep
[1518-02-12 00:00] Guard #1213 begins shift
[1518-06-08 00:51] wakes up
[1518-08-14 00:57] falls asleep
[1518-03-28 00:06] falls asleep
[1518-03-16 00:07] falls asleep
[1518-09-22 00:12] wakes up
[1518-10-15 00:30] falls asleep
[1518-03-05 00:19] wakes up
[1518-10-03 00:11] falls asleep
[1518-11-11 00:33] wakes up
[1518-10-02 00:54] wakes up
[1518-03-01 00:01] Guard #811 begins shift
[1518-10-17 00:02] Guard #479 begins shift
[1518-11-05 00:02] Guard #3251 begins shift
[1518-03-04 00:38] falls asleep
[1518-09-29 00:37] wakes up
[1518-05-15 00:58] wakes up
[1518-11-20 00:00] Guard #1999 begins shift
[1518-09-04 00:00] falls asleep
[1518-06-29 23:59] Guard #631 begins shift
[1518-09-10 00:20] wakes up
[1518-11-12 00:26] falls asleep
[1518-08-17 00:43] wakes up
[1518-08-19 00:37] wakes up
[1518-11-07 00:40] wakes up
[1518-08-22 00:27] wakes up
[1518-10-31 00:14] falls asleep
[1518-04-06 00:30] wakes up
[1518-11-02 00:21] falls asleep
[1518-02-05 00:01] Guard #1871 begins shift
[1518-02-07 00:28] wakes up
[1518-05-05 00:14] falls asleep
[1518-02-23 00:45] falls asleep
[1518-04-06 00:57] wakes up
[1518-10-14 00:04] Guard #2411 begins shift
[1518-05-07 00:49] falls asleep
[1518-04-28 00:16] falls asleep
[1518-10-11 23:56] Guard #1871 begins shift
[1518-03-14 00:36] falls asleep
[1518-05-08 00:04] Guard #1871 begins shift
[1518-04-17 00:13] falls asleep
[1518-08-05 00:19] falls asleep
[1518-08-14 00:02] falls asleep
[1518-09-02 00:42] falls asleep
[1518-07-20 00:36] falls asleep
[1518-11-09 00:04] Guard #2351 begins shift
[1518-09-25 00:58] wakes up
[1518-07-08 00:04] Guard #631 begins shift
[1518-04-24 00:14] falls asleep
[1518-11-10 00:57] wakes up
[1518-07-23 00:04] Guard #479 begins shift
[1518-07-09 00:57] falls asleep
[1518-02-07 00:09] falls asleep
[1518-10-25 00:34] falls asleep
[1518-08-25 00:39] wakes up
[1518-06-21 00:12] falls asleep
[1518-11-21 00:51] falls asleep
[1518-04-16 00:06] falls asleep
[1518-03-02 00:23] wakes up
[1518-05-02 00:02] Guard #617 begins shift
[1518-10-27 23:57] Guard #1213 begins shift
[1518-07-18 00:58] wakes up
[1518-10-21 00:31] falls asleep
[1518-09-26 00:35] falls asleep
[1518-08-04 00:48] wakes up
[1518-07-16 00:41] wakes up
[1518-02-11 00:41] falls asleep
[1518-03-14 00:31] wakes up
[1518-10-12 00:19] falls asleep
[1518-06-24 00:54] wakes up
[1518-08-16 00:10] falls asleep
[1518-10-31 00:37] wakes up
[1518-05-22 00:50] falls asleep
[1518-08-10 00:44] falls asleep
[1518-03-12 00:54] wakes up
[1518-05-01 00:20] falls asleep
[1518-02-23 00:04] Guard #631 begins shift
[1518-09-23 00:38] falls asleep
[1518-03-02 00:45] falls asleep
[1518-10-07 00:58] wakes up
[1518-08-01 00:41] falls asleep
[1518-03-12 00:43] wakes up
[1518-05-30 00:16] wakes up
[1518-10-16 00:26] wakes up
[1518-10-22 00:28] falls asleep
[1518-08-10 00:01] Guard #1297 begins shift
[1518-07-12 00:23] wakes up
[1518-07-13 00:54] falls asleep
[1518-07-13 00:55] wakes up
[1518-02-25 23:51] Guard #2741 begins shift
[1518-05-09 00:42] falls asleep
[1518-09-06 00:11] falls asleep
[1518-07-14 00:11] falls asleep
[1518-09-23 00:58] wakes up
[1518-06-30 00:43] wakes up
[1518-11-16 23:57] Guard #3347 begins shift
[1518-04-21 00:53] wakes up
[1518-07-17 00:50] wakes up
[1518-03-02 00:16] falls asleep
[1518-04-23 00:38] wakes up
[1518-03-06 00:45] wakes up
[1518-05-25 00:03] Guard #947 begins shift
[1518-02-26 00:01] falls asleep
[1518-05-04 00:02] Guard #137 begins shift
[1518-03-23 00:49] wakes up
[1518-03-23 00:41] falls asleep
[1518-07-03 00:25] falls asleep
[1518-07-07 00:47] falls asleep
[1518-07-07 00:03] Guard #1871 begins shift
[1518-07-25 00:00] falls asleep
[1518-04-24 00:04] Guard #1213 begins shift
[1518-04-18 00:04] falls asleep
[1518-06-19 00:59] wakes up
[1518-08-11 23:53] Guard #137 begins shift
[1518-07-06 00:01] Guard #2411 begins shift
[1518-05-31 00:51] wakes up
[1518-05-16 00:04] Guard #947 begins shift
[1518-04-20 00:41] falls asleep
[1518-08-13 00:47] wakes up
[1518-09-26 00:00] Guard #811 begins shift
[1518-04-04 00:13] wakes up
[1518-02-19 00:39] wakes up
[1518-08-11 00:57] wakes up
[1518-11-06 00:48] wakes up
[1518-09-21 00:02] Guard #1871 begins shift
[1518-03-28 00:42] wakes up
[1518-09-27 00:53] wakes up
[1518-03-31 00:13] falls asleep
[1518-07-21 00:39] falls asleep
[1518-05-26 23:56] Guard #3251 begins shift
[1518-07-24 00:51] wakes up
[1518-07-09 00:58] wakes up
[1518-08-12 23:53] Guard #3347 begins shift
[1518-08-15 00:05] falls asleep
[1518-04-24 00:39] wakes up
[1518-09-22 00:05] falls asleep
[1518-09-02 00:18] falls asleep
[1518-08-28 23:50] Guard #2351 begins shift
[1518-08-03 00:02] falls asleep
[1518-03-06 00:57] wakes up
[1518-07-06 00:55] wakes up
[1518-04-24 00:35] falls asleep
[1518-07-13 00:08] falls asleep
[1518-11-11 00:13] falls asleep
[1518-09-30 00:49] wakes up
[1518-08-04 23:59] Guard #3221 begins shift
[1518-03-30 00:18] falls asleep
[1518-05-16 00:50] wakes up
[1518-04-19 00:46] wakes up
[1518-11-23 00:07] wakes up
[1518-02-01 00:02] Guard #137 begins shift
[1518-04-08 00:30] falls asleep
[1518-07-19 00:56] wakes up
[1518-05-01 00:26] wakes up
[1518-08-21 00:04] falls asleep
[1518-06-25 00:33] wakes up
[1518-02-14 23:59] Guard #2351 begins shift
[1518-07-31 00:41] falls asleep
[1518-09-27 00:04] Guard #1871 begins shift
[1518-09-29 00:51] falls asleep
[1518-11-08 00:56] wakes up
[1518-05-18 00:06] falls asleep
[1518-09-01 00:40] wakes up
[1518-05-30 00:12] falls asleep
[1518-04-17 00:48] wakes up
[1518-03-12 00:52] falls asleep
[1518-07-25 00:48] wakes up
[1518-11-07 00:33] falls asleep
[1518-10-26 23:56] Guard #1999 begins shift
[1518-09-24 00:32] falls asleep
[1518-02-05 00:26] falls asleep
[1518-05-13 00:30] falls asleep
[1518-08-08 00:44] wakes up
[1518-11-05 00:06] falls asleep
[1518-10-09 00:44] wakes up
[1518-08-19 00:47] wakes up
[1518-04-12 00:19] falls asleep
[1518-11-06 00:29] falls asleep
[1518-09-15 00:43] falls asleep
[1518-07-21 00:19] wakes up
[1518-02-26 00:02] wakes up
[1518-05-24 00:30] wakes up
[1518-10-02 00:49] falls asleep
[1518-03-13 00:09] falls asleep
[1518-10-21 00:55] wakes up
[1518-07-26 00:18] falls asleep
[1518-05-11 00:24] falls asleep
[1518-10-05 00:00] Guard #1297 begins shift
[1518-06-18 00:39] falls asleep
[1518-02-01 00:39] falls asleep
[1518-05-09 00:48] wakes up
[1518-06-08 00:28] falls asleep
[1518-03-29 23:58] Guard #137 begins shift
[1518-03-11 00:39] wakes up
[1518-04-13 00:45] wakes up
[1518-04-27 00:01] Guard #947 begins shift
[1518-10-19 00:55] wakes up
[1518-11-22 00:56] falls asleep
[1518-09-23 00:39] wakes up
[1518-05-14 00:23] falls asleep
[1518-03-22 00:13] wakes up
[1518-04-06 00:10] falls asleep
[1518-02-24 00:23] falls asleep
[1518-03-31 00:01] Guard #631 begins shift
[1518-04-17 00:42] falls asleep
[1518-04-14 00:39] wakes up
[1518-09-02 23:57] Guard #967 begins shift
[1518-08-09 00:06] falls asleep
[1518-11-07 00:57] wakes up
[1518-06-16 00:51] falls asleep
[1518-07-30 00:02] Guard #137 begins shift
[1518-06-05 00:14] falls asleep
[1518-08-14 23:51] Guard #1999 begins shift
[1518-07-06 00:10] falls asleep
[1518-08-27 00:05] falls asleep
[1518-05-20 00:59] wakes up
[1518-07-21 00:27] falls asleep
[1518-07-29 00:19] falls asleep
[1518-05-25 00:52] falls asleep
[1518-04-12 00:50] wakes up
[1518-10-27 00:56] falls asleep
[1518-11-19 00:59] wakes up
[1518-02-22 00:03] falls asleep
[1518-03-04 00:56] wakes up
[1518-04-03 00:04] Guard #2741 begins shift
[1518-02-21 00:18] falls asleep
[1518-04-22 00:44] falls asleep
[1518-11-18 00:21] wakes up
[1518-10-04 00:35] falls asleep
[1518-10-02 00:58] wakes up
[1518-11-15 00:42] wakes up
[1518-09-18 00:32] falls asleep
[1518-05-31 00:46] falls asleep
[1518-06-20 00:03] Guard #3251 begins shift
[1518-08-21 00:42] wakes up
[1518-08-21 00:48] falls asleep
[1518-06-27 00:42] wakes up
[1518-02-14 00:55] wakes up
[1518-08-02 23:52] Guard #2411 begins shift
[1518-09-30 00:00] Guard #137 begins shift
[1518-10-19 00:35] wakes up
[1518-04-12 00:01] Guard #811 begins shift
[1518-09-13 00:03] Guard #1213 begins shift
[1518-02-10 00:57] wakes up
[1518-08-10 23:58] Guard #2741 begins shift
[1518-08-29 00:56] wakes up
[1518-10-20 00:14] falls asleep
[1518-10-30 00:31] falls asleep
[1518-08-07 00:52] wakes up
[1518-08-30 00:52] wakes up
[1518-07-02 00:45] wakes up
[1518-07-03 00:00] Guard #503 begins shift
[1518-10-15 00:56] falls asleep
[1518-11-07 00:04] Guard #1999 begins shift
[1518-08-22 00:58] wakes up
[1518-03-11 00:19] falls asleep
[1518-02-21 23:52] Guard #83 begins shift
[1518-02-18 00:11] falls asleep
[1518-06-18 23:56] Guard #1999 begins shift
[1518-09-07 00:55] wakes up
[1518-03-07 23:58] Guard #2351 begins shift
[1518-09-01 00:44] falls asleep
[1518-06-01 23:57] Guard #631 begins shift
[1518-10-23 00:07] falls asleep
[1518-05-13 23:56] Guard #83 begins shift
[1518-09-19 00:24] falls asleep
[1518-02-06 00:32] falls asleep
[1518-11-12 00:51] falls asleep
[1518-11-09 00:55] wakes up
[1518-02-05 00:45] wakes up
[1518-05-15 00:23] falls asleep
[1518-10-11 00:29] falls asleep
[1518-03-09 00:16] wakes up
[1518-07-09 00:01] Guard #3347 begins shift
[1518-09-05 00:00] Guard #811 begins shift
[1518-09-29 00:10] falls asleep
[1518-09-10 00:10] falls asleep
[1518-04-20 00:01] falls asleep
[1518-09-07 00:40] falls asleep
[1518-02-13 23:54] Guard #479 begins shift
[1518-07-13 00:47] wakes up
[1518-09-03 00:38] falls asleep
[1518-07-09 00:48] wakes up
[1518-03-06 00:41] falls asleep
[1518-06-23 00:51] wakes up
[1518-06-06 00:04] Guard #1297 begins shift
[1518-05-28 00:33] wakes up
[1518-07-28 00:40] falls asleep
[1518-05-28 00:19] falls asleep
[1518-08-20 00:30] falls asleep
[1518-10-08 00:02] falls asleep
[1518-10-16 00:18] falls asleep
[1518-06-19 00:07] falls asleep
[1518-04-13 00:03] Guard #503 begins shift
[1518-06-13 00:55] wakes up
[1518-06-06 00:29] falls asleep
[1518-05-12 23:59] Guard #2351 begins shift
[1518-10-01 00:23] falls asleep
[1518-10-12 23:57] Guard #2411 begins shift
[1518-10-10 00:33] wakes up
[1518-02-10 00:54] falls asleep
[1518-04-14 00:29] falls asleep
[1518-04-01 00:54] falls asleep
[1518-08-19 00:44] falls asleep
[1518-09-09 23:56] Guard #1871 begins shift
[1518-08-15 00:42] wakes up
[1518-05-25 00:19] wakes up
[1518-10-04 00:01] Guard #1297 begins shift
[1518-03-20 23:56] Guard #2441 begins shift
[1518-07-07 00:52] wakes up
[1518-11-05 00:57] falls asleep
[1518-09-30 00:22] falls asleep
[1518-04-03 00:48] falls asleep
[1518-09-05 00:49] falls asleep
[1518-05-10 00:43] falls asleep
[1518-11-14 00:38] falls asleep
[1518-06-29 00:01] falls asleep
[1518-06-20 00:58] wakes up
[1518-11-18 00:15] falls asleep
[1518-10-09 23:56] Guard #137 begins shift
[1518-07-15 00:44] falls asleep
[1518-05-20 00:48] falls asleep
[1518-09-02 00:51] wakes up
[1518-03-17 00:40] wakes up
[1518-05-04 00:43] falls asleep
[1518-11-03 00:48] wakes up
[1518-11-15 23:58] Guard #3347 begins shift
[1518-03-09 00:12] falls asleep
[1518-06-10 00:51] wakes up
[1518-02-28 00:20] falls asleep
[1518-02-21 00:03] Guard #3221 begins shift
[1518-04-01 00:56] wakes up
[1518-04-29 00:59] wakes up
[1518-05-24 00:19] falls asleep
[1518-10-25 00:49] falls asleep
[1518-04-17 00:24] wakes up
[1518-02-04 00:14] falls asleep
[1518-03-03 00:18] falls asleep
[1518-05-04 00:58] wakes up
[1518-04-11 00:59] wakes up
[1518-08-20 00:02] Guard #1297 begins shift
[1518-02-12 23:59] Guard #811 begins shift
[1518-11-14 00:48] wakes up
[1518-07-02 00:10] wakes up
[1518-08-10 00:55] wakes up
[1518-05-05 00:54] falls asleep
[1518-04-16 00:39] wakes up
[1518-05-12 00:30] wakes up
[1518-08-04 00:35] falls asleep
[1518-04-15 00:52] wakes up
[1518-05-09 00:56] wakes up
[1518-04-22 00:57] wakes up
[1518-07-27 00:21] falls asleep
[1518-05-20 00:00] Guard #617 begins shift
[1518-02-01 23:56] Guard #2441 begins shift
[1518-04-28 00:34] wakes up
[1518-06-03 00:10] falls asleep
[1518-05-15 00:02] Guard #479 begins shift
[1518-03-22 00:01] Guard #631 begins shift
[1518-03-16 00:51] wakes up
[1518-10-16 00:01] Guard #631 begins shift
[1518-09-02 00:02] Guard #1871 begins shift
[1518-06-30 00:06] falls asleep
[1518-07-20 00:45] wakes up
[1518-11-14 00:57] falls asleep
[1518-08-15 00:52] falls asleep
[1518-09-23 00:50] falls asleep
[1518-06-24 00:05] falls asleep
[1518-09-19 00:37] wakes up
[1518-08-21 23:56] Guard #1871 begins shift
[1518-07-05 00:51] wakes up
[1518-10-26 00:02] Guard #1999 begins shift
[1518-09-18 00:47] falls asleep
[1518-05-26 00:51] wakes up
[1518-06-23 00:45] falls asleep
[1518-10-26 00:17] falls asleep
[1518-11-17 00:25] falls asleep
[1518-07-22 00:59] wakes up
[1518-06-13 23:58] Guard #811 begins shift
[1518-04-23 00:00] Guard #1213 begins shift
[1518-03-20 00:00] Guard #967 begins shift
[1518-08-07 00:00] Guard #617 begins shift
[1518-05-27 00:47] wakes up
[1518-04-03 00:40] wakes up
[1518-04-09 23:57] Guard #1151 begins shift
[1518-04-12 00:15] wakes up
[1518-07-11 00:02] Guard #1871 begins shift
[1518-09-06 23:58] Guard #947 begins shift
[1518-10-25 00:45] wakes up
[1518-11-01 00:58] wakes up
[1518-06-14 00:07] falls asleep
[1518-07-19 00:32] falls asleep
[1518-04-01 00:20] falls asleep
[1518-09-12 00:54] wakes up
[1518-06-28 00:53] wakes up
[1518-08-20 00:39] wakes up
[1518-07-03 00:36] wakes up
[1518-09-12 00:37] falls asleep
[1518-06-15 23:57] Guard #479 begins shift
[1518-06-20 00:39] falls asleep
[1518-06-29 00:46] wakes up
[1518-03-17 00:29] falls asleep
[1518-09-01 00:50] wakes up
[1518-09-18 00:58] wakes up
[1518-09-22 00:26] wakes up
[1518-03-25 00:55] wakes up
[1518-08-18 23:58] Guard #811 begins shift
[1518-02-27 00:15] falls asleep
[1518-09-02 00:33] wakes up
[1518-05-04 23:59] Guard #137 begins shift
[1518-03-24 00:23] falls asleep
[1518-09-10 00:56] wakes up
[1518-09-08 00:49] wakes up
[1518-07-26 00:54] wakes up
[1518-08-31 00:02] Guard #1871 begins shift
[1518-05-12 00:11] falls asleep
[1518-08-12 00:51] wakes up
[1518-10-07 00:43] falls asleep
[1518-08-24 00:15] falls asleep
[1518-11-04 00:33] falls asleep
[1518-11-15 00:55] wakes up
[1518-08-15 00:35] falls asleep
[1518-08-25 00:10] falls asleep
[1518-06-01 00:46] wakes up
[1518-02-23 00:48] wakes up
[1518-11-20 00:16] falls asleep
[1518-08-30 00:10] falls asleep
[1518-05-27 00:23] falls asleep
[1518-10-14 00:17] falls asleep
[1518-03-25 00:10] wakes up
[1518-03-16 00:33] falls asleep
[1518-04-20 00:50] wakes up
[1518-08-19 00:22] falls asleep
[1518-09-14 00:37] falls asleep
[1518-03-02 00:55] falls asleep
[1518-06-16 00:06] falls asleep
[1518-04-23 00:49] wakes up
[1518-06-08 00:57] wakes up
[1518-10-06 23:58] Guard #617 begins shift
[1518-02-24 00:28] wakes up
[1518-10-28 00:26] falls asleep
[1518-02-23 00:35] wakes up
[1518-11-19 00:54] falls asleep
[1518-07-11 00:50] wakes up
[1518-03-20 00:35] wakes up
[1518-03-15 00:24] falls asleep
[1518-04-29 23:48] Guard #2351 begins shift
[1518-07-10 00:52] wakes up
[1518-05-12 00:34] falls asleep
[1518-07-02 00:09] falls asleep
[1518-09-21 00:21] falls asleep
[1518-05-02 00:53] wakes up
[1518-10-19 00:50] falls asleep
[1518-07-21 00:17] falls asleep
[1518-10-22 00:37] wakes up
[1518-09-17 23:58] Guard #1297 begins shift
[1518-08-15 23:58] Guard #3347 begins shift
[1518-03-22 00:57] wakes up
[1518-03-08 00:18] falls asleep
[1518-08-28 00:02] Guard #1871 begins shift
[1518-05-17 23:59] Guard #3221 begins shift
[1518-09-13 00:56] wakes up
[1518-02-15 00:16] wakes up
[1518-06-06 00:43] wakes up
[1518-10-22 00:48] falls asleep
[1518-03-07 00:01] Guard #2411 begins shift
[1518-02-26 23:58] Guard #967 begins shift
[1518-02-25 00:59] wakes up
[1518-04-20 00:24] wakes up
[1518-10-17 00:32] wakes up
[1518-09-15 00:40] wakes up
[1518-09-10 23:59] Guard #241 begins shift
[1518-11-13 00:28] falls asleep
[1518-08-30 00:27] wakes up
[1518-03-01 00:43] falls asleep
[1518-09-17 00:14] falls asleep
[1518-07-23 00:53] falls asleep
[1518-10-27 00:58] wakes up
[1518-04-18 00:27] wakes up
[1518-09-29 00:01] Guard #3347 begins shift
[1518-09-18 23:56] Guard #2351 begins shift
[1518-02-02 23:49] Guard #3251 begins shift
[1518-11-05 00:31] wakes up
[1518-07-17 00:40] wakes up
[1518-03-05 00:18] falls asleep
[1518-07-10 00:00] Guard #1871 begins shift
[1518-03-15 00:12] falls asleep
[1518-06-24 23:57] Guard #503 begins shift
[1518-04-27 00:25] wakes up
[1518-04-03 00:59] wakes up
[1518-09-25 00:28] falls asleep
[1518-10-21 23:48] Guard #2411 begins shift
[1518-10-06 00:59] wakes up
[1518-05-05 23:58] Guard #3221 begins shift
[1518-10-03 00:23] wakes up
[1518-04-29 00:51] falls asleep
[1518-07-21 00:00] Guard #479 begins shift
[1518-04-23 00:47] falls asleep
[1518-11-12 00:01] Guard #479 begins shift
[1518-08-18 00:44] falls asleep
[1518-06-17 00:07] falls asleep
[1518-06-10 00:42] wakes up
[1518-02-19 00:54] wakes up
[1518-03-05 00:32] falls asleep
[1518-10-09 00:26] falls asleep
[1518-02-20 00:29] wakes up
[1518-04-02 00:49] wakes up
[1518-02-27 00:52] falls asleep
[1518-07-11 00:40] falls asleep
[1518-06-04 23:59] Guard #1871 begins shift
[1518-02-27 23:56] Guard #1151 begins shift
[1518-05-17 00:10] falls asleep
[1518-07-04 00:36] wakes up
[1518-02-16 23:57] Guard #137 begins shift
[1518-06-07 00:15] falls asleep
[1518-05-20 00:30] falls asleep
[1518-05-22 00:00] Guard #3347 begins shift
[1518-04-13 00:38] wakes up
[1518-07-15 00:59] wakes up
[1518-04-02 00:03] falls asleep
[1518-10-11 00:58] wakes up
[1518-07-12 00:13] falls asleep
[1518-08-25 00:04] Guard #503 begins shift
[1518-07-02 00:23] falls asleep
[1518-08-15 00:31] wakes up
[1518-07-04 00:21] wakes up
[1518-05-26 00:48] falls asleep
[1518-08-24 00:28] wakes up
[1518-08-05 00:59] wakes up
[1518-09-09 00:58] wakes up
[1518-11-12 00:53] wakes up
[1518-08-14 00:54] wakes up
[1518-07-04 00:42] falls asleep
[1518-03-07 00:26] falls asleep
[1518-08-04 00:00] Guard #503 begins shift
[1518-02-28 00:49] wakes up
[1518-09-17 00:47] falls asleep
[1518-09-21 00:59] wakes up
[1518-06-21 00:57] wakes up
[1518-02-21 00:37] wakes up
[1518-04-28 00:51] wakes up
[1518-08-14 00:51] falls asleep
[1518-11-22 00:52] wakes up
[1518-04-27 00:14] falls asleep
[1518-06-15 00:14] falls asleep
[1518-05-27 00:29] falls asleep
[1518-08-26 00:08] falls asleep
[1518-06-02 00:28] falls asleep
[1518-11-15 00:18] falls asleep
[1518-02-09 00:51] wakes up
[1518-06-09 23:56] Guard #137 begins shift
[1518-04-07 23:58] Guard #2741 begins shift
[1518-03-06 00:28] wakes up
[1518-07-06 00:25] wakes up
[1518-02-05 23:59] Guard #811 begins shift
[1518-03-26 23:50] Guard #1151 begins shift
[1518-08-13 00:02] falls asleep
[1518-04-27 00:37] wakes up
[1518-11-01 23:58] Guard #479 begins shift
[1518-07-18 00:45] falls asleep
[1518-08-02 00:00] Guard #137 begins shift
[1518-06-22 00:36] wakes up
[1518-07-29 00:43] wakes up
[1518-10-05 23:59] Guard #3251 begins shift
[1518-10-09 00:47] falls asleep
[1518-07-15 00:19] falls asleep
[1518-11-01 00:00] Guard #3347 begins shift
[1518-11-08 00:01] wakes up
[1518-05-24 00:00] Guard #617 begins shift
[1518-02-06 00:59] wakes up
[1518-11-22 00:58] wakes up
[1518-07-08 00:24] falls asleep
[1518-08-27 00:55] wakes up
[1518-03-16 00:47] falls asleep
[1518-07-24 23:50] Guard #1999 begins shift
[1518-07-12 00:54] falls asleep
[1518-10-25 00:57] falls asleep
[1518-02-23 00:55] falls asleep
[1518-05-05 00:58] wakes up
[1518-05-17 00:04] Guard #617 begins shift
[1518-02-15 23:58] Guard #2441 begins shift
[1518-10-18 00:03] Guard #2741 begins shift
[1518-02-01 00:55] wakes up
[1518-09-17 00:15] wakes up
[1518-06-14 00:33] falls asleep
[1518-04-04 00:45] wakes up
[1518-06-16 00:48] wakes up
[1518-03-29 00:23] wakes up
[1518-02-04 00:58] wakes up
[1518-03-22 23:57] Guard #83 begins shift
[1518-03-24 00:04] Guard #967 begins shift
[1518-09-20 00:21] falls asleep
[1518-07-18 00:01] Guard #2351 begins shift
[1518-11-05 00:48] wakes up
[1518-05-08 00:52] wakes up
[1518-08-01 00:26] falls asleep
[1518-05-01 00:02] Guard #3221 begins shift
[1518-07-18 00:35] wakes up
[1518-05-09 00:51] falls asleep
[1518-03-06 00:50] falls asleep
[1518-07-16 00:32] falls asleep
[1518-06-10 00:36] falls asleep
[1518-05-19 00:00] Guard #137 begins shift
[1518-05-18 00:46] wakes up
[1518-06-04 00:56] wakes up
[1518-04-05 00:22] wakes up
[1518-10-26 00:56] falls asleep
[1518-11-16 00:58] wakes up
[1518-06-02 23:57] Guard #3347 begins shift
[1518-11-14 00:59] wakes up
[1518-08-03 00:58] wakes up
[1518-06-12 00:57] falls asleep
[1518-11-14 23:58] Guard #3251 begins shift
[1518-02-08 00:23] falls asleep
[1518-10-07 23:47] Guard #83 begins shift
[1518-05-30 00:00] Guard #1999 begins shift
[1518-04-11 00:52] falls asleep
[1518-08-31 00:35] wakes up
[1518-04-23 00:33] falls asleep
[1518-08-21 00:50] wakes up
[1518-02-24 23:50] Guard #1999 begins shift
[1518-03-18 00:49] wakes up
[1518-03-29 00:37] falls asleep
[1518-10-28 00:55] wakes up
[1518-09-26 00:52] wakes up
[1518-02-08 00:37] falls asleep
[1518-02-24 00:50] wakes up
[1518-04-06 00:56] falls asleep
[1518-05-27 00:25] wakes up
[1518-11-23 00:02] falls asleep
[1518-06-13 00:20] falls asleep
[1518-10-28 23:58] Guard #947 begins shift
[1518-07-16 00:00] Guard #3221 begins shift
[1518-06-25 00:49] wakes up
[1518-05-11 00:02] Guard #947 begins shift
[1518-04-21 23:58] Guard #2351 begins shift
[1518-08-16 00:50] falls asleep
[1518-03-18 23:57] Guard #1871 begins shift
[1518-04-10 00:14] falls asleep
[1518-05-05 00:47] wakes up
[1518-06-22 00:42] falls asleep
[1518-05-20 23:59] Guard #3433 begins shift
[1518-05-19 00:25] falls asleep
[1518-08-01 00:43] wakes up
[1518-02-24 00:00] Guard #2741 begins shift
[1518-03-07 00:57] wakes up
[1518-02-17 00:54] wakes up
[1518-10-01 00:00] Guard #503 begins shift
[1518-07-18 23:58] Guard #617 begins shift
[1518-06-15 00:45] wakes up
[1518-10-30 00:00] Guard #3251 begins shift
[1518-06-28 00:01] Guard #3251 begins shift
[1518-10-26 00:57] wakes up
[1518-03-27 00:00] falls asleep
[1518-08-16 00:55] wakes up
[1518-07-09 00:13] falls asleep
[1518-09-27 00:48] falls asleep
[1518-11-22 23:46] Guard #137 begins shift
[1518-03-03 00:42] wakes up
[1518-09-12 00:40] wakes up
[1518-08-05 23:57] Guard #3433 begins shift
[1518-11-04 00:49] wakes up
[1518-05-08 23:58] Guard #3251 begins shift
[1518-05-13 00:37] wakes up
[1518-10-25 00:50] wakes up
[1518-03-15 00:50] wakes up
[1518-06-06 00:56] wakes up
[1518-08-23 00:25] falls asleep
[1518-10-19 23:56] Guard #947 begins shift
[1518-09-18 00:26] falls asleep
[1518-03-09 00:47] falls asleep
[1518-11-11 00:02] Guard #2411 begins shift
[1518-04-01 23:50] Guard #1297 begins shift
[1518-03-22 00:47] falls asleep
[1518-03-24 23:50] Guard #3221 begins shift
[1518-05-30 23:58] Guard #1871 begins shift
[1518-08-07 00:44] falls asleep
[1518-10-18 23:54] Guard #811 begins shift
[1518-06-17 00:42] wakes up
[1518-05-19 00:52] wakes up
[1518-10-25 00:59] wakes up
[1518-08-26 23:50] Guard #3251 begins shift
[1518-02-27 00:34] wakes up
[1518-08-17 00:01] Guard #503 begins shift
[1518-02-20 00:32] falls asleep
[1518-10-02 00:10] falls asleep
[1518-10-18 00:58] wakes up
[1518-11-16 00:55] falls asleep
[1518-09-17 00:49] wakes up
[1518-06-26 00:55] wakes up
[1518-05-11 00:55] wakes up
[1518-07-24 00:22] falls asleep
[1518-06-13 00:01] Guard #1871 begins shift
[1518-07-21 00:45] wakes up
[1518-03-04 00:00] Guard #811 begins shift
[1518-10-02 00:32] wakes up
[1518-02-23 00:59] wakes up
[1518-11-02 23:57] Guard #2351 begins shift
[1518-08-14 00:58] wakes up
[1518-03-20 00:07] falls asleep
[1518-02-13 00:16] falls asleep
[1518-08-18 00:48] wakes up
[1518-09-25 00:00] Guard #2351 begins shift
[1518-07-22 00:05] falls asleep
[1518-06-05 00:57] wakes up
[1518-03-05 00:56] wakes up
[1518-11-05 00:59] wakes up
[1518-11-19 00:11] falls asleep
[1518-08-23 00:00] Guard #3251 begins shift
[1518-07-10 00:44] falls asleep
[1518-04-30 00:57] wakes up
[1518-04-30 00:05] falls asleep
[1518-02-12 00:40] falls asleep
[1518-09-03 23:50] Guard #479 begins shift
[1518-10-06 00:27] falls asleep
[1518-03-14 23:57] Guard #3347 begins shift
[1518-03-29 00:10] falls asleep
[1518-11-23 00:27] falls asleep
[1518-05-07 00:46] wakes up
[1518-05-10 00:56] wakes up
[1518-02-15 00:10] falls asleep
[1518-07-28 00:23] wakes up
`
  .trim()
  .split('\n');

if (runs[0]) console.log(part1(inputSample));
if (runs[1]) console.log(part1(inputReal));
if (runs[2]) console.log(part2(inputSample));
if (runs[3]) console.log(part2(inputReal));
