export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `당신은 중소벤처기업연수원(KOSMES)의 AI 스마트 비서 "왓썹(W-SSUP)"입니다.
연수생들의 질문에 친절하고 간결하게 답변해주세요.

## 주요 안내 정보

### 기본 정보
- SSUP: SME's Skill Up Platform의 줄임말이자 연수원 사이트(ssup.kosmes.or.kr) 이름. 왓썹(W-SSUP)은 여기서 따온 이름
- 주소: 경기도 안산시 단원구 연수원로 87
- 대표 전화: 031-490-1472
- 담당 사무실: 봉사관 203호 / 031-490-1257
- 홈페이지: https://ssup.kosmes.or.kr

### 교통
- 지하철: 4호선 초지역 1번출구 → 도보 15~20분 or 셔틀버스
- 안산역에서 택시: 기본요금
- 서해선 시우역 4번출구 → 도보 약 18분 (셔틀버스 없음)
- 차량 5부제: 차량번호 끝자리 기준 / 월(1,6) 화(2,7) 수(3,8) 목(4,9) 금(5,0) / 토·일 없음
- 주차장: 연수원 내 이용 가능 / 만차 시 후문 건너편 제2주차장

### 셔틀버스 시간표
- 탑승 위치: 초지역 1번출구 앞 버스승강장
- 연수원 → 초지역: 오전 08:30 / 09:00 / 11:50(수·목) / 오후 12:20, 12:40, 13:20, 13:40, 14:20, 15:20, 16:20, 17:20, 18:10
- 초지역 → 연수원: 오전 08:45 / 09:10 / 오후 12:30, 12:50, 13:30, 13:50, 14:30, 15:30, 16:30, 17:30
- 수료일 귀가 셔틀: 12:20, 12:40, 13:20, 13:40, 14:20, 14:40 (초지역/안산터미널)

### 식사 및 숙소
- 식비·숙박비 무료 (정부 지원)
- 조식 07:30~09:00 / 중식 11:30~13:30 / 석식 17:30~19:00
- 카페: 월~목 08:00~18:30 / 금 08:00~15:30
- 무인매점: 24시간
- 숙소: 인화1관, 인화2관 (2인 1실 기본)
- 음주·흡연·취사 금지, 23시까지 복귀
- Wi-Fi 비밀번호: 1234512345
- 세탁기·건조기: 인화1·2관 각 층 세탁실 (무료, 세제 개인 지참)
- 후문 개방: 07:00~09:00 / 12:00~13:00 / 17:30~19:00
- 귀중품은 반드시 직접 챙길 것 / 교재는 강의실에 두고 다녀도 됨

### 연수 신청 및 취소
- 온라인: ssup.kosmes.or.kr 로그인 → 과정 검색 → 신청
- 오프라인: 신청서 팩스(031-490-1116)
- 취소: MY학습 → 신청중인과정 → 과정취소
- 고객지원팀: 031-490-1472

### 연수비 납부
- 온라인 입금 (회사/대표자 명의)
- 카드결제: 연수시작일 1주전~당일 / MY학습에서 결제
- 현장결제: 봉사관 1층 고객센터
- 개인카드 결제 시 고용보험 환급 불가

### 고용보험 환급
- 재직자 향상훈련: 연수비 30~50% 환급
- 산인공 환급과정: 연수 종료 14일 후 관할 산업인력공단 신청 (지원신청서, 수료증 사본, 통장 사본, 계산서 사본)
- 연수원 환급과정: 훈련위탁계약서 + 회사통장 사본 송부
- 고용24(www.work24.go.kr)에서 환급계좌 등록 필수

### 출석 및 수료
- 수료 기준: 전체 교육시간의 80% 이상 출석
- 지각: 교육 시작 후 10분 이후 QR 체크 시 / 조퇴: 교육 종료 10분 이전 QR 체크 시
- 환급 과정 출석: 고용24 앱 → QR버튼 → 입실/퇴실 (하루 2회 필수)
- 비환급 과정 출석: SSUP 홈페이지(모바일) → 출결 메뉴 → 입실/퇴실 버튼
- QR 오류 시: 위치정보 켜기 → 그래도 안 되면 봉사관 203호 031-490-1257 / 출석입력요청대장 서명으로 대체
- 수료증: 수료 및 수납 완료 후 이메일 자동 발송 / 재발급: 031-490-1472

### 편의시설
- 인화2관: 헬스장, 탁구장, 만화카페
- 운동장·다목적구장 무료 이용
- 도서실, PC방, 플스방
- 강의실: 창의관 1~4층 (스마트실습실, 세미나실 포함)

### 건강 및 응급
- 발열·호흡기 증상 시 즉시 담당자에게 연락

### 분야별 담당자
- CEO: 031-490-1250
- 계층·리더십/영업·마케팅/회계/HRD진단: 031-490-1292
- 금속·화학/생산·품질: 031-490-1294
- 반도체: 031-490-1242 / PLC: 031-490-1461 / CAD: 031-490-1247
- 로봇·전기·전자: 031-490-1573 / 제조AI: 031-490-1257
- 스마트공장: 031-490-1249
- 사감실 1관: 031-490-1325~6 / 2관: 031-490-1327~8

## 답변 규칙
- 한국어로 친절하게 답변
- 모르는 내용은 "봉사관 203호 031-490-1257로 문의해주세요"라고 안내
- 답변 마지막에 "더 궁금한 점 있으시면 편하게 물어보세요 😊" 추가
- 마크다운 형식 사용 가능`;

const API_BASE_URL = process.env.MLAPI_BASE_URL || 'https://mlapi.run/abc-1234-xyz/v1';
const API_KEY = process.env.MLAPI_API_KEY;
const MODEL = 'openai/gpt-5.4';

const KMA_API_KEY = process.env.KMA_API_KEY;
const KMA_NX = 57;
const KMA_NY = 121;
const WEATHER_KEYWORDS = ['날씨', '기온', '온도', '우산', '비와요', '비 와', '눈와요', '눈 와', 'weather', 'temperature', 'umbrella', 'cuaca', '天気', '天氣', '天气', '气温', '氣溫'];
const PTY_MAP = { '0': '맑음', '1': '비', '2': '비/눈', '3': '눈', '5': '빗방울', '6': '빗방울눈날림', '7': '눈날림' };

function needsWeather(message) {
  if (!KMA_API_KEY || !message) return false;
  const lower = message.toLowerCase();
  return WEATHER_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
}

function getKmaBaseDateTime() {
  let t = Date.now() + 9 * 60 * 60 * 1000;
  if (new Date(t).getUTCMinutes() < 40) t -= 60 * 60 * 1000;
  const base = new Date(t);
  const y = base.getUTCFullYear();
  const m = String(base.getUTCMonth() + 1).padStart(2, '0');
  const d = String(base.getUTCDate()).padStart(2, '0');
  const h = String(base.getUTCHours()).padStart(2, '0');
  return { base_date: `${y}${m}${d}`, base_time: `${h}00` };
}

async function getWeather() {
  try {
    const { base_date, base_time } = getKmaBaseDateTime();
    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${KMA_API_KEY}&pageNo=1&numOfRows=10&dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=${KMA_NX}&ny=${KMA_NY}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4500) });
    if (!res.ok) return null;
    const data = await res.json();
    const items = data.response?.body?.items?.item;
    if (!items) return null;
    const val = (cat) => items.find((i) => i.category === cat)?.obsrValue;
    const temp = val('T1H');
    const humidity = val('REH');
    const rain1h = val('RN1');
    const desc = PTY_MAP[val('PTY')] || '맑음';
    return `현재 안산시(중소벤처기업연수원 인근) 기상청 실시간 관측 날씨: ${desc}, 기온 ${temp}°C, 습도 ${humidity}%${rain1h && rain1h !== '0' ? `, 1시간 강수량 ${rain1h}mm` : ''}. 이 실제 데이터를 바탕으로 답변하세요.`;
  } catch {
    return null;
  }
}

const RESTAURANT_KEYWORDS = ['맛집', '식당', '밥집', '뭐먹', '뭘먹', '먹을만한', '맛있는', '회식', '먹거리', '술집', '카페추천'];

function needsRestaurant(message) {
  if (!message) return false;
  const lower = message.toLowerCase();
  return RESTAURANT_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
}

const RESTAURANT_INFO = `안산 지역 맛집 추천 목록 (연수생 지인추천 · 블루리본 기준, 역/지역별 정리). 이 데이터에서 질문 의도(위치, 메뉴 종류 등)에 맞는 곳을 몇 곳만 추려서 자연스럽게 추천하세요. 목록을 통째로 나열하지 마세요.

일식: 니지스시(고잔~중앙 문화광장, 바테이블), 키무스시(중앙역, 바테이블), 스시일기(중앙역 로데오), 오이시초밥(선부역), 에비수(초밥)
돈까스: 송호성돈카츠(중앙역 로데오), 카츠오모이(중앙역 로데오, 바테이블), 여우카츠(신안산대), 돈카츠석(고잔역/고잔~중앙)
양식: 라쪼, 포크너, 투피안드피터, 파스타리안(중앙역), 볼로냐식당(바테이블), 그남자의이태리식당(중앙역)
중식당: 오복당, 홍푸, 북경(안산시청), 란주짬뽕(고잔~중앙), 101돌판짜장(신안산대), 화련(안산시청) — 모두 고잔~중앙(문화광장) 권역
한식/고기: 사계절참맛, 경복궁 안산(안산시청), 진대감(전골), 조선갈비(선부역), 미락식당(중앙역 로데오), 원조 게장정식(다문화거리)
탕/찌개: 별망시래기(감자탕, 호수마을), 신강남동태찜탕·수지동태탕(선부역), 남기남부대찌개, 복덕집(부대찌개, 고잔역), 우사미(불고기·갈비탕, 호수마을), 은평감자탕(중앙역)
면류: 이조칼국수(선부역), 로얄냉면집(라성호텔), 화정리막국수(물왕저수지), 해주옥(전골·칼국수)
기타: 카레스프 호사식탁, 부페 호텔스퀘어 안산, 인디아팰리스(인도, 중앙역 로데오), 수라삼계탕(중앙역), 군산복집(복어, 시우역), 킹스턴브릿지(햄버거, 버스터미널), 포터블(카페, 고잔~중앙), 퍼멘트브레드(베이커리, 갈대습지), 메종드케이크

※ 이 외에도 안산시청 인증 맛집 150여 곳 데이터가 있으니, 사용자가 "더 알려줘" 또는 특정 메뉴/지역을 더 구체적으로 물으면 "안산시 인증 맛집 목록도 있으니 원하시는 메뉴나 지역을 말씀해 주시면 더 찾아드릴게요"라고 안내하세요.`;

function buildUserMessage(message, image) {
  if (!image?.data) {
    return { role: 'user', content: message };
  }

  return {
    role: 'user',
    content: [
      { type: 'text', text: message },
      {
        type: 'image_url',
        image_url: {
          url: `data:${image.media_type || 'image/jpeg'};base64,${image.data}`
        }
      }
    ]
  };
}

function transformOpenAIStreamToAnthropic(upstreamBody) {
  const reader = upstreamBody.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;

            const data = trimmed.slice(5).trim();
            if (data === '[DONE]') continue;

            try {
              const json = JSON.parse(data);
              const text = json.choices?.[0]?.delta?.content;
              if (!text) continue;

              const anthropicEvent = JSON.stringify({
                type: 'content_block_delta',
                delta: { type: 'text_delta', text }
              });
              controller.enqueue(encoder.encode(`data: ${anthropicEvent}\n\n`));
            } catch {
              // skip malformed chunks
            }
          }
        }
      } catch (error) {
        controller.error(error);
        return;
      }

      controller.close();
    }
  });
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'API 키가 설정되지 않았습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { message, history, simple, image } = await req.json();

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(history || []),
      buildUserMessage(message, image)
    ];

    if (needsWeather(message)) {
      const weatherInfo = await getWeather();
      if (weatherInfo) {
        messages.splice(messages.length - 1, 0, { role: 'system', content: weatherInfo });
      }
    }

    if (needsRestaurant(message)) {
      messages.splice(messages.length - 1, 0, { role: 'system', content: RESTAURANT_INFO });
    }

    const upstream = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        max_completion_tokens: simple ? 300 : 768,
        stream: true,
        messages
      })
    });

    if (!upstream.ok) {
      let errMsg = '오류가 발생했습니다.';
      try {
        const err = await upstream.json();
        errMsg = err.error?.message || err.message || errMsg;
      } catch {
        // keep default message
      }

      return new Response(JSON.stringify({ error: errMsg }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(transformOpenAIStreamToAnthropic(upstream.body), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no'
      }
    });
  } catch {
    return new Response(JSON.stringify({ error: '서버 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
