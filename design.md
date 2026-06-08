# 생활계산소 디자인 가이드

## 브랜드 톤

생활계산소는 일상에 필요한 계산과 간단한 유틸리티를 빠르게 확인하는 무료 도구 사이트다. 전체 인상은 깨끗하고 신뢰감 있게, 너무 금융 사이트처럼 무겁지 않게 유지한다.

- 키워드: 생활형, 무료, 간단함, 브라우저 처리, 참고용
- 시각 톤: 딥그린, 민트, 흰 카드, 넓은 여백, 부드러운 라운드
- 피할 것: 과한 3D, 강한 그림자, 복잡한 장식, 확률/세금/관세 단정 표현

## 색상

CSS 변수 기준:

```css
:root {
  --ink: #102535;
  --muted: #536878;
  --line: #dce6e5;
  --surface: #ffffff;
  --surface-soft: #f5faf8;
  --green: #087d64;
  --green-dark: #07654f;
  --mint: #daf4eb;
  --mint-deep: #b9ead9;
  --blue: #edf6fb;
  --orange: #fff3e7;
  --shadow: 0 16px 40px rgba(16, 37, 53, 0.07);
  --radius: 28px;
}
```

사용 기준:

- 본문/제목: `--ink`
- 설명/보조 문구: `--muted`
- 주요 CTA, 강조 숫자, 활성 메뉴: `--green`
- CTA hover: `--green-dark`
- 카드 라인: `--line`
- 섹션 배경: `--surface-soft`
- 보조 배지/패널: `--mint`, `--blue`, `--orange`

## 폰트

기본 폰트 스택:

```css
font-family: "Pretendard Variable", Pretendard, "Noto Sans KR", "Apple SD Gothic Neo", Arial, sans-serif;
```

타이포그래피 기준:

- 큰 제목은 굵고 자간을 좁게 사용한다.
- 본문은 줄간격 `1.65` 이상으로 읽기 편하게 둔다.
- 한글 워드마크는 이미지에 박지 않고 실제 텍스트로 유지한다.
- 숫자 결과는 굵고 큼직하게 보여주되 과장된 효과는 피한다.

대표 스타일:

```css
h1 {
  font-size: clamp(2.55rem, 4.7vw, 3.45rem);
  letter-spacing: -0.085em;
  line-height: 1.2;
}

.lead {
  color: var(--muted);
  font-size: 1.06rem;
  letter-spacing: -0.035em;
}
```

## 로고

헤더 로고는 계산기 심볼과 실제 텍스트 워드마크 조합을 사용한다.

- 심볼 크기: 28~32px
- 워드마크: `생활계산소` 실제 텍스트
- 컬러: 딥그린/민트 계열
- 파비콘: 심볼 단독
- 피할 것: 기존 `L+` 로고, 3D 효과, 과한 그림자

## 레이아웃

기본 컨테이너:

```css
.container {
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
}
```

모바일 기준:

```css
@media (max-width: 820px) {
  .container {
    width: min(100% - 32px, 560px);
  }
}
```

섹션은 넓은 여백을 유지하고, 기능 조작 영역은 사용자가 너무 오래 스크롤하지 않도록 상단에 가깝게 배치한다.

## 헤더와 메뉴

헤더는 sticky로 유지한다.

- 배경: 반투명 흰색
- 하단 라인: `--line`
- 모바일에서도 메뉴를 숨기지 않는다.
- 모바일 메뉴는 가로 스크롤 가능한 한 줄 메뉴로 유지한다.

모바일 메뉴 기준:

```css
@media (max-width: 820px) {
  .header-row {
    min-height: 0;
    padding: 12px 0 10px;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .nav {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    overflow-x: auto;
    white-space: nowrap;
    font-size: 0.88rem;
    scrollbar-width: none;
  }
}
```

## 버튼

기본 버튼은 라운드 사각형으로 통일한다.

```css
.button {
  min-height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface);
  color: var(--green-dark);
  font-weight: 700;
}
```

주요 버튼은 딥그린 배경과 흰 글자를 사용한다. hover는 살짝 어두워지는 정도로만 처리한다.

## 카드

기능 카드, 결과 카드, 안내 카드는 같은 규칙을 쓴다.

- 배경: 흰색
- 라인: `1px solid var(--line)`
- 라운드: 23~28px
- 그림자: `--shadow`, 필요 없으면 제거 가능
- 패딩: 24~34px

카드는 기능 이동을 방해하지 않아야 한다. 모바일에서 앵커 이동 위치가 어색하면 내부 카드 링크를 줄이고, 실제 기능 영역을 더 위로 올린다.

## 홈 히어로

홈 히어로는 좌측 문구 + 우측 미리보기 carousel 구조다.

- 좌측: eyebrow, H1, lead, CTA, trust pills
- 우측: 기능 미리보기 3개
- 이미지형 슬라이드는 카드 안에 꽉 차게 보이도록 조정한다.
- 텍스트형 슬라이드는 `lotto-showcase`처럼 기존 색상과 공 형태 요소만 사용한다.

주의:

- 히어로 미리보기 이미지는 클릭 시 실제 기능으로 이동해야 한다.
- 슬라이드 dot에는 접근 가능한 `aria-label`을 넣는다.
- `prefers-reduced-motion`에서 transition을 끈다.

## 도구 페이지

도구 페이지는 보통 다음 순서로 구성한다.

1. 페이지 히어로
2. 실제 입력/계산 도구
3. 사용 방법
4. 주의사항 또는 기준 설명
5. 관련 안내 콘텐츠
6. 푸터

광고 영역은 승인 전 화면에 박스로 보여주지 않는다. 코드 안에는 위치를 주석으로 남긴다.

```html
<!-- AdSense placement: 도구 하단 광고 코드 삽입 위치 -->
```

## 콘텐츠 문체

사용자에게는 쉽고 직접적으로 설명한다.

- "입력값은 브라우저에서 계산되며 별도로 저장하지 않습니다."
- "참고용 도구이며 실제 신고, 납부, 증빙 전 공식 기준을 확인하세요."
- "생성 번호는 당첨을 예측하거나 보장하지 않습니다."

피할 표현:

- "당첨 확률이 높습니다."
- "무조건 면세입니다."
- "정확한 세금입니다."
- "자동으로 완벽히 추출합니다."

## 현재 대표 기능

- 홈 생활 계산: 할인율, 만나이, D-day
- 해외직구 관세 계산기
- 로또 번호 생성기
- 영수증 OCR: 보존 중이며 공개 기능으로 강하게 밀지 않음

## 검수 기준

배포 전 확인할 것:

- PC와 모바일에서 헤더 메뉴가 보인다.
- 홈 히어로 미리보기 클릭이 실제 기능으로 이동한다.
- 도구 버튼이 정상 작동한다.
- 콘솔 오류가 없다.
- SEO 메타와 푸터 브랜드명이 맞다.
- 승인 전 광고 영역이 화면에 보이지 않는다.
- 최종 publish 폴더 복사 후 해시가 일치한다.
