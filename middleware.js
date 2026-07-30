import { next } from '@vercel/functions';

// 평가 기간 임시 조치: 공단 인터넷망 IP만 허용. 평가 종료 후 이 파일을 삭제하면 원상복구됨.
const ALLOWED_IPS = new Set(['117.52.164.250']);

export const config = {
  matcher: '/:path*',
};

export default function middleware(request) {
  const forwardedFor = request.headers.get('x-forwarded-for') || '';
  const clientIp = forwardedFor.split(',')[0].trim();

  if (ALLOWED_IPS.has(clientIp)) {
    return next();
  }

  return new Response('Access Denied', { status: 403 });
}
