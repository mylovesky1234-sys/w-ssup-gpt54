export const config = { runtime: 'edge' };

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const REPORT_TO_EMAIL = 'mylovesky3@naver.com';

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: '이메일 발송 설정이 완료되지 않았습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { category, message } = await req.json();

    if (!message || !message.trim()) {
      return new Response(JSON.stringify({ error: '신고 내용이 비어 있습니다.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const timestamp = kst.toISOString().replace('T', ' ').slice(0, 19) + ' (KST)';
    const subject = `[W-SSUP 불편신고]${category ? ' ' + category : ''}`;
    const text = `분류: ${category || '미지정'}\n접수 시각: ${timestamp}\n\n신고 내용:\n${message}`;

    const upstream = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'W-SSUP 불편신고 <onboarding@resend.dev>',
        to: [REPORT_TO_EMAIL],
        subject,
        text
      })
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      return new Response(JSON.stringify({ error: '이메일 발송에 실패했습니다.', detail: errText }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response(JSON.stringify({ error: '서버 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
