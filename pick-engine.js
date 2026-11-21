/* 과정추천 엔진: 태그 매칭(R1) + 수강 이력 기반 예측(R2). 학습 데이터 없이 규칙과 점수만으로 추천한다. */
(function (g) {
  var YEAR = 2026;

  function sessionStart(s) { return new Date(YEAR, s[0] - 1, Math.max(s[1], 1)); }

  function sessionLabel(s) {
    if (!s[1]) return s[0] + '월 (일정 미정)';
    return s[0] + '월 ' + s[1] + '일~' + (s[2] === s[0] ? '' : s[2] + '월 ') + s[3] + '일';
  }

  // today 이후 시작하는 가장 이른 개강 일정. 없으면 null.
  function nextSession(course, today) {
    var t = today || new Date();
    var t0 = new Date(t.getFullYear(), t.getMonth(), t.getDate());
    for (var i = 0; i < course.sessions.length; i++) {
      if (sessionStart(course.sessions[i]) >= t0) return { start: sessionStart(course.sessions[i]), label: sessionLabel(course.sessions[i]), session: course.sessions[i] };
    }
    return null;
  }

  function monthsLabel(course) {
    var seen = [];
    course.sessions.forEach(function (s) { if (seen.indexOf(s[0]) < 0) seen.push(s[0]); });
    return seen.map(function (m) { return m + '월'; }).join(', ');
  }

  function intersect(a, b) { return a.filter(function (t) { return b.indexOf(t) >= 0; }); }

  function byCodeThenSession(x, y) { return x.course.code < y.course.code ? -1 : 1; }

  // 업종 조건: 제조업이 아니면 제조업 전용 과정은 후보에서 제외하고 공통 과정만 남긴다.
  function filterIndustry(courses, industry) {
    if (industry && industry !== '제조업') return courses.filter(function (c) { return c.ind === '공통'; });
    return courses;
  }

  // 개강 예정 과정이 충분하면 그것만, 아니면 전체를 대상으로 한다.
  function preferUpcoming(scored, n, today) {
    var up = scored.filter(function (x) { return nextSession(x.course, today); });
    return up.length >= n ? up : scored;
  }

  // R1. 점수 = |U ∩ Tc|, 동점이면 |U ∩ Tc| / |Tc| 가 높은 과정을 앞에 둔다.
  function recommendByTags(courses, user, opts) {
    opts = opts || {};
    var n = opts.n || 3, U = user.jobs || [], exclude = opts.exclude || [];
    if (!U.length) return [];
    var scored = filterIndustry(courses, user.industry)
      .filter(function (c) { return exclude.indexOf(c.code) < 0 && c.tags.length; })
      .map(function (c) {
        var m = intersect(U, c.tags);
        return { course: c, score: m.length, ratio: m.length / c.tags.length, matched: m, fit: Math.round(100 * m.length / U.length) };
      })
      .filter(function (x) { return x.score > 0; })
      .sort(function (a, b) { return (b.score - a.score) || (b.ratio - a.ratio) || byCodeThenSession(a, b); });
    return (opts.upcomingOnly === false ? scored : preferUpcoming(scored, n, opts.today)).slice(0, n);
  }

  // R2. 들은 과정의 태그로 관심 벡터를 만들고, 아직 안 들은 과정과 코사인 유사도가 높은 순으로 추천한다.
  function recommendByHistory(courses, takenCodes, opts) {
    opts = opts || {};
    var n = opts.n || 3;
    var taken = courses.filter(function (c) { return takenCodes.indexOf(c.code) >= 0; });
    var takenTitles = taken.map(function (c) { return c.title; });
    var vec = {}, norm = 0;
    taken.forEach(function (c) { c.tags.forEach(function (t) { vec[t] = (vec[t] || 0) + 1; }); });
    Object.keys(vec).forEach(function (t) { norm += vec[t] * vec[t]; });
    norm = Math.sqrt(norm);
    if (!norm) return [];
    var scored = filterIndustry(courses, opts.industry)
      .filter(function (c) { return takenCodes.indexOf(c.code) < 0 && takenTitles.indexOf(c.title) < 0 && c.tags.length; })
      .map(function (c) {
        var dot = 0;
        c.tags.forEach(function (t) { dot += vec[t] || 0; });
        var cos = dot / (norm * Math.sqrt(c.tags.length));
        return { course: c, score: cos, ratio: cos, matched: c.tags.filter(function (t) { return vec[t]; }), fit: Math.round(100 * cos) };
      })
      .filter(function (x) { return x.score > 0; })
      .sort(function (a, b) { return (b.score - a.score) || byCodeThenSession(a, b); });
    return (opts.upcomingOnly === false ? scored : preferUpcoming(scored, n, opts.today)).slice(0, n);
  }

  function mulberry32(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // 가상 수강 이력: 제조업 학습자를 가정하고 직무 태그를 차례로 배정한 뒤,
  // 그 직무와 관련된 과정 중 3개를 고정 시드로 무작위 추출해 2개는 수강 이력, 1개는 숨김 과정으로 쓴다.
  function makeVirtualLearners(courses, jobTags, count, seed) {
    var rand = mulberry32(seed == null ? 2026 : seed), out = [];
    for (var i = 0; i < (count || 18); i++) {
      var job = jobTags[i % jobTags.length];
      var pool = courses.filter(function (c) { return c.tags.indexOf(job) >= 0; });
      var seen = {}, uniq = [];
      pool.forEach(function (c) { if (!seen[c.title]) { seen[c.title] = 1; uniq.push(c); } });
      for (var k = uniq.length - 1; k > 0; k--) {
        var j = Math.floor(rand() * (k + 1)), tmp = uniq[k]; uniq[k] = uniq[j]; uniq[j] = tmp;
      }
      if (uniq.length < 3) continue;
      out.push({ id: i + 1, job: job, industry: '제조업', history: [uniq[0].code, uniq[1].code], hidden: uniq[2].code });
    }
    return out;
  }

  // 숨긴 과정이 상위 K개 추천에 들어가는 비율(HitRate@K). R0 는 무작위 K개를 뽑을 때의 기댓값.
  function evaluateVirtual(courses, learners, k) {
    var hitsR1 = 0, hitsR2 = 0, r0 = 0;
    learners.forEach(function (l) {
      var r1 = recommendByTags(courses, { industry: l.industry, jobs: [l.job] }, { n: k, exclude: l.history, upcomingOnly: false });
      var r2 = recommendByHistory(courses, l.history, { n: k, industry: l.industry, upcomingOnly: false });
      if (r1.some(function (x) { return x.course.code === l.hidden; })) hitsR1++;
      if (r2.some(function (x) { return x.course.code === l.hidden; })) hitsR2++;
      r0 += k / (filterIndustry(courses, l.industry).length - l.history.length);
    });
    var N = learners.length;
    return { n: N, k: k, r1: hitsR1 / N, r2: hitsR2 / N, r0: r0 / N, hitsR1: hitsR1, hitsR2: hitsR2 };
  }

  g.SSUPPick = {
    nextSession: nextSession, monthsLabel: monthsLabel, sessionLabel: sessionLabel,
    recommendByTags: recommendByTags, recommendByHistory: recommendByHistory,
    makeVirtualLearners: makeVirtualLearners, evaluateVirtual: evaluateVirtual
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
