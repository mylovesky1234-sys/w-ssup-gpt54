"""연간일정 엑셀 -> courses-2026.js (+ 태그 검수용 엑셀) 변환.

사용법: python3 scripts/build_courses.py <연간일정.xlsx>
태그는 과정명 규칙으로 자동 부여한 초안이므로 data/course-tags-review.xlsx 로 검수한다.
"""
import json
import re
import sys

import openpyxl

JOB_TAGS = [
    '경영·전략', '영업·마케팅', 'HR·교육', '회계·재무', '연구·개발(R&D)', '생산·품질',
    'IT·소프트웨어', '계층·리더십', '설비·자동화', '스마트공장·제조AI', '안전·환경',
    '구매·물류', '전기·전자', '기계·금형',
]

JOB_RULES = {
    '경영·전략': r'경영|전략|기획|로드맵|비전수립|CEO|창업|ESG|탄소중립|포럼|프로젝트 관리|딥테크|SME WEEK',
    '영업·마케팅': r'영업|마케팅|광고|고객|디지털콘텐츠',
    'HR·교육': r'인사|신입사원|온보딩|일반사원|사원 |핵심인재|능력 ?향상|영업사원',
    '회계·재무': r'재무|회계|법인세|부가가치세|원가|재무제표',
    '연구·개발(R&D)': r'설계|해석|시뮬레이션|CATIA|Creo|NX |Inventor|SolidWorks|ANSYS|AutoCAD|제품개발|역설계|신제품|Verilog|ASIC|RTL|전원회로|SMPS|피로수명|재료선정',
    '생산·품질': r'품질|생산|공정|FMEA|APQP|PPAP|ISO|SPC|Cpk|검사|3정5S|낭비|측정|정밀|QC|불량|현장 ?관리|제조현장|즉실천',
    'IT·소프트웨어': r'AI|인공지능|ChatGPT|생성형|파이썬|Power BI|Copilot|Power platform|엑셀|VBA|데이터|코딩|프롬프트|AICE|정보시스템|ERP',
    '계층·리더십': r'리더|관리자|팀장|과장급|팀워크|갈등|셀프리더십',
    '설비·자동화': r'PLC|서보|인버터|HMI|SCADA|로봇|공압|유압|공유압|설비|예지보전|자동화|제어|MELSEC|센서\+모터|드론',
    '스마트공장·제조AI': r'스마트공장|스마트제조|스마트팩토리|제조AI|MES|POP|OPC|Physical AI|Vision AI|이상탐지|예지보전|AI팩토리|불량 예측',
    '안전·환경': r'안전|ISO 45001|탄소중립|ESG|수소|친환경|환경',
    '구매·물류': r'구매|외주|자재|재고|물류',
    '전기·전자': r'(?<!안)전기|전자|회로|전원|센서|PCB|반도체|ASIC|Verilog|RTL|SMPS|전장|노이즈|이차전지|리튬|외부기기',
    '기계·금형': r'금형|사출|프레스|단조|용접|금속|재료|열처리|철강|윤활|기계|치공구|유공압|공압|유압|3차원설계|구조해석|도면|공차|피로수명|3차원 측정|역설계',
}

# 업종 적합성: 제조 전용인지 공통(모든 업종)인지
COMMON_FIRST = (r'엑셀|ChatGPT|생성형|프롬프트|리더십|리더|관리자|팀장|신입사원|일반사원|사원 ?능력|영업|마케팅|재무|회계|법인세|부가가치세|'
                r'기획력|인사총무|비전수립|CEO|창업|AutoCAD|산업안전기사|ISO 45001|안전보건|탄소중립|수소|ESG|전기설비|현장 전기배선|'
                r'퇴근을 앞당기는|AI 자격증|AI로 시작하는|AI 활용 .*시뮬레이션|코딩 Zero|핵심인재|스마트제조 포럼|SME WEEK|원가계산|원가관리를 통한|'
                r'제품개발 프로젝트 관리|파이썬|AI의 핵심|이미지 생성|디지털콘텐츠|팀 역량|갈등관리|고급관리자|초급관리자|중간관리자|과장급')
MFG_OVERRIDE = r'스마트공장|제조원가|스마트제조|뿌리산업|금형|PLC|품질|공정'
MFG = (r'PLC|MES|POP|OPC|스마트공장|스마트제조|스마트팩토리|제조|공정|금형|사출|프레스|단조|용접|공압|유압|공유압|CATIA|Creo|NX |Inventor|SolidWorks|ANSYS|'
       r'도면|공차|치수|측정|검사|품질|FMEA|APQP|PPAP|ISO 9001|ISO 통합|SPC|Cpk|설비|예지보전|서보|인버터|HMI|센서|로봇|드론|모빌리티|반도체|ASIC|Verilog|RTL|'
       r'회로|전원|전장|이차전지|리튬|금속|재료|열처리|철강|윤활|피로|생산|3정5S|구매 및 외주|자재|재고|치공구|역설계|노이즈|현장|PC를 이용한|Physical AI|AI')

SESSION = re.compile(r'^\s*(\d{1,2})\s*-\s*(\d{1,2})\s*$')


def tag_course(title):
    tags = [t for t in JOB_TAGS if re.search(JOB_RULES[t], title)]
    common = re.search(COMMON_FIRST, title) and not re.search(MFG_OVERRIDE, title)
    industry = '공통' if common else ('제조' if re.search(MFG, title) else '공통')
    return tags, industry


def main(xlsx):
    wb = openpyxl.load_workbook(xlsx, data_only=True)
    ws = wb.active
    courses = {}
    for row in ws.iter_rows(min_row=5, values_only=True):
        title = re.sub(r'\s+', ' ', (row[0] or '').strip())
        if not title:
            continue
        dur, hours = (row[1] or '').strip(), (row[2] or '').strip()
        c = courses.setdefault(title, {'title': title, 'duration': dur, 'hours': hours, 'sessions': []})
        for m in range(12):
            cell = row[3 + m]
            if not cell:
                continue
            g = SESSION.match(str(cell))
            if not g:
                raise ValueError(f'알 수 없는 일정 형식: {title} {m + 1}월 {cell!r}')
            sd, ed = int(g.group(1)), int(g.group(2))
            em = m + 1 if ed >= sd else m + 2
            c['sessions'].append([m + 1, sd, em, ed])
    for c in courses.values():
        d = re.match(r'(\d+)박(\d+)일', c['duration'])
        days = int(d.group(2)) if d else (1 if c['duration'] == '1일' else None)
        # 연수기간보다 일정이 훨씬 긴 칸(예: 3박4일인데 12/1~12/31)은 날짜 미정으로 보고 월만 남긴다.
        if days:
            c['sessions'] = [[s[0], 0, s[0], 0] if (s[2] - s[0]) * 31 + s[3] - s[1] + 1 > days + 4 else s for s in c['sessions']]
    out = []
    for i, c in enumerate(courses.values(), 1):
        d = re.match(r'(\d+)박(\d+)일', c['duration'])
        c['days'] = int(d.group(2)) if d else (1 if c['duration'] == '1일' else None)
        c['hoursNum'] = int(re.sub(r'\D', '', c['hours']) or 0)
        c['tags'], c['ind'] = tag_course(c['title'])
        c['code'] = f'SSUP-{i:03d}'
        c['sessions'].sort()
        out.append(c)
    keys = ['code', 'title', 'duration', 'days', 'hoursNum', 'ind', 'tags', 'sessions']
    slim = [{k: c[k] for k in keys} for c in out]
    with open('courses-2026.js', 'w', encoding='utf-8') as f:
        f.write('/* 2026 중소벤처기업연수원 연간일정 (scripts/build_courses.py 로 생성). 태그는 자동 부여 초안. */\n')
        f.write('var SSUP_ANNUAL = ' + json.dumps(slim, ensure_ascii=False, separators=(',', ':')) + ';\n')
        f.write('var SSUP_JOB_TAGS = ' + json.dumps(JOB_TAGS, ensure_ascii=False) + ';\n')
    review = openpyxl.Workbook()
    ws1 = review.active
    ws1.title = '태그 검수'
    ws1.append(['코드', '과정명', '연수기간', '시간', '업종 적합성(자동)', '직무 태그(자동)', '업종 적합성(수정)', '직무 태그(수정, 쉼표로 구분)'])
    for c in out:
        ws1.append([c['code'], c['title'], c['duration'], c['hours'], c['ind'], ', '.join(c['tags']), None, None])
    for col, w in zip('ABCDEFGH', (11, 58, 10, 8, 16, 46, 18, 40)):
        ws1.column_dimensions[col].width = w
    ws2 = review.create_sheet('태그 목록')
    ws2.append(['직무 태그 14종'])
    for t in JOB_TAGS:
        ws2.append([t])
    ws2.append([])
    ws2.append(['업종 적합성: 제조(제조업 전용) / 공통(모든 업종)'])
    review.save('data/course-tags-review.xlsx')
    no_tag = [c['title'] for c in out if not c['tags']]
    print(f'과정 {len(out)}개, 태그 없음 {len(no_tag)}개, 제조 {sum(c["ind"] == "제조" for c in out)} / 공통 {sum(c["ind"] == "공통" for c in out)}')
    for t in JOB_TAGS:
        print(f'  {t}: {sum(t in c["tags"] for c in out)}')
    for t in no_tag:
        print('  [태그없음]', t)


if __name__ == '__main__':
    main(sys.argv[1])
