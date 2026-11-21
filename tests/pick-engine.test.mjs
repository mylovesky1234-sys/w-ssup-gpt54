import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
(0, eval)(readFileSync(path.join(root, 'courses-2026.js'), 'utf8').replace(/^var /gm, 'globalThis.'));
(0, eval)(readFileSync(path.join(root, 'pick-engine.js'), 'utf8'));
const P = globalThis.SSUPPick;
const C = globalThis.SSUP_ANNUAL;
const early = new Date(2026, 0, 5);

test('데이터: 모든 과정에 태그가 있고 업종 적합성이 제조/공통 중 하나다', () => {
  assert.ok(C.length > 200);
  for (const c of C) {
    assert.ok(c.tags.length > 0, c.title);
    assert.ok(['제조', '공통'].includes(c.ind), c.title);
  }
});

test('태그 매칭: 일치 태그 수가 많은 과정이 앞에 온다', () => {
  const r = P.recommendByTags(C, { industry: '제조업', jobs: ['생산·품질', 'IT·소프트웨어'] }, { n: 5, today: early });
  assert.equal(r.length, 5);
  for (let i = 1; i < r.length; i++) {
    assert.ok(r[i - 1].score > r[i].score || (r[i - 1].score === r[i].score && r[i - 1].ratio >= r[i].ratio));
  }
  assert.equal(r[0].score, 2);
});

test('업종 조건: 제조업이 아니면 제조 전용 과정은 추천되지 않는다', () => {
  const r = P.recommendByTags(C, { industry: '서비스업', jobs: ['생산·품질', '영업·마케팅', '계층·리더십'] }, { n: 20, today: early });
  assert.ok(r.length > 0);
  assert.ok(r.every((x) => x.course.ind === '공통'));
});

test('직무가 없으면 추천하지 않는다', () => {
  assert.deepEqual(P.recommendByTags(C, { industry: '제조업', jobs: [] }), []);
});

test('수강 이력: 들은 과정과 같은 제목의 과정은 제외하고 유사한 분야를 추천한다', () => {
  const taken = C.filter((c) => c.tags.includes('설비·자동화')).slice(0, 2).map((c) => c.code);
  const r = P.recommendByHistory(C, taken, { n: 5, upcomingOnly: false });
  assert.equal(r.length, 5);
  const titles = taken.map((c) => C.find((x) => x.code === c).title);
  assert.ok(r.every((x) => !taken.includes(x.course.code) && !titles.includes(x.course.title)));
  assert.ok(r[0].fit > 0 && r[0].fit <= 100);
});

test('가상 수강이력: 18명이며 같은 시드면 항상 같고 숨김 과정은 이력과 겹치지 않는다', () => {
  const a = P.makeVirtualLearners(C, globalThis.SSUP_JOB_TAGS, 18, 2026);
  const b = P.makeVirtualLearners(C, globalThis.SSUP_JOB_TAGS, 18, 2026);
  assert.equal(a.length, 18);
  assert.deepEqual(a, b);
  for (const l of a) {
    assert.equal(l.history.length, 2);
    assert.ok(!l.history.includes(l.hidden));
    assert.ok(C.find((c) => c.code === l.hidden).tags.includes(l.job));
  }
});

test('HitRate@5: 두 방식 모두 무작위 추천보다 훨씬 높다', () => {
  const L = P.makeVirtualLearners(C, globalThis.SSUP_JOB_TAGS, 18, 2026);
  const r = P.evaluateVirtual(C, L, 5);
  console.log(`HitRate@5  R1(태그 매칭)=${(r.r1 * 100).toFixed(1)}% (${r.hitsR1}/${r.n})  R2(수강이력)=${(r.r2 * 100).toFixed(1)}% (${r.hitsR2}/${r.n})  무작위=${(r.r0 * 100).toFixed(1)}%`);
  assert.ok(r.r1 > r.r0 * 5);
  assert.ok(r.r2 > r.r0 * 5);
});

test('개강일: 오늘 이후 첫 일정을 고르고 없으면 null', () => {
  const c = { sessions: [[3, 16, 3, 18], [6, 29, 7, 2]] };
  assert.equal(P.nextSession(c, new Date(2026, 3, 1)).label, '6월 29일~7월 2일');
  assert.equal(P.nextSession(c, new Date(2026, 6, 1)), null);
});

test('날짜 미정(월만 있는 일정)은 월로만 표시된다', () => {
  const c = { sessions: [[12, 0, 12, 0]] };
  assert.equal(P.nextSession(c, new Date(2026, 10, 21)).label, '12월 (일정 미정)');
  const tbd = C.filter((x) => x.sessions.some((s) => s[1] === 0));
  assert.equal(tbd.length, 4);
});
