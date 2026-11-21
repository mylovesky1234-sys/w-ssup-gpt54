export const config = { runtime: 'edge' };

const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-haiku-4-5-20251001';

const INDUSTRIES = ['제조업', 'IT·소프트웨어', '유통·물류', '서비스업', '건설·부동산', '바이오·헬스케어', '식품·외식', '금융·핀테크', '기타'];
const JOB_TAGS = [
  '경영·전략', '영업·마케팅', 'HR·교육', '회계·재무', '연구·개발(R&D)', '생산·품질', 'IT·소프트웨어',
  '계층·리더십', '설비·자동화', '스마트공장·제조AI', '안전·환경', '구매·물류', '전기·전자', '기계·금형'
];

const SYSTEM_PROMPT = `당신은 교육과정 추천을 위해 학습자의 요청에서 업종과 직무를 추출하는 도구입니다.
JSON 한 줄만 출력하세요. 다른 말은 쓰지 마세요.
형식: {"industry": 업종 또는 null, "jobs": [직무, ...]}
업종 후보: ${INDUSTRIES.join(', ')}
직무 후보: ${JOB_TAGS.join(', ')}
규칙: 후보에 있는 값만 쓰고, 요청에 근거가 없으면 industry 는 null, jobs 는 []로 두세요. jobs 는 가장 관련 있는 순서로 최대 3개까지 쓰세요.`;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  if (!API_KEY) return json({ error: 'API 키가 설정되지 않았습니다.' }, 500);

  try {
    const { message } = await req.json();
    if (!message || !String(message).trim()) return json({ error: 'message가 비어 있습니다.' }, 400);

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 120,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: String(message).slice(0, 800) }]
      }),
      signal: AbortSignal.timeout(6000)
    });
    if (!upstream.ok) return json({ error: '추출에 실패했습니다.' }, 502);

    const data = await upstream.json();
    const text = data.content?.[0]?.text || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return json({ industry: null, jobs: [] });
    const parsed = JSON.parse(match[0]);
    const industry = INDUSTRIES.includes(parsed.industry) ? parsed.industry : null;
    const jobs = (Array.isArray(parsed.jobs) ? parsed.jobs : []).filter((j) => JOB_TAGS.includes(j)).slice(0, 3);
    return json({ industry, jobs });
  } catch {
    return json({ error: '서버 오류가 발생했습니다.' }, 500);
  }
}
