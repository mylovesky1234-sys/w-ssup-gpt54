export const config = { runtime: 'edge' };

const REST_KEY = process.env.KAKAO_REST_API_KEY;

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!REST_KEY) {
    return new Response(JSON.stringify({ error: 'KAKAO_REST_API_KEY가 설정되지 않았습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  if (!query) {
    return new Response(JSON.stringify({ error: 'query 파라미터가 필요합니다.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const upstream = await fetch(
    `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&x=126.797612392208&y=37.3190925664941&radius=20000&size=10`,
    { headers: { Authorization: `KakaoAK ${REST_KEY}` } }
  );

  if (!upstream.ok) {
    const errText = await upstream.text();
    return new Response(JSON.stringify({ error: '카카오 로컬 API 오류', detail: errText }), {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const data = await upstream.json();
  const places = (data.documents || []).map((d) => ({
    name: d.place_name,
    address: d.road_address_name || d.address_name,
    phone: d.phone,
    category: d.category_name,
    lat: d.y,
    lng: d.x,
    url: d.place_url
  }));

  return new Response(JSON.stringify({ places }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
