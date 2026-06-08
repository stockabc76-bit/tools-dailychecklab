# 생활계산소 작업 기억 백업

최종 업데이트: 2026-05-28

이 문서는 대화 내용이 유실되거나 다른 Codex가 이어받을 때 빠르게 현재 상태를 복구하기 위한 작업 기억이다.

## 프로젝트 위치

- 작업 원본: `C:\Users\aso\Documents\Codex\2026-05-27\new-chat\utility-calculator-hub`
- 최종 반영 폴더: `D:\기능사잇\애드센스용\생활계산랩`
- 로컬 미리보기: `http://127.0.0.1:4197/index.html`
- 현재 브랜드명: `생활계산소`

`D:\기능사잇\애드센스용\생활계산랩`는 외부 폴더라 파일 복사 시 권한 승인이 필요할 수 있다.

## 현재 사이트 방향

생활계산소는 금융 전문 사이트가 아니라 넓은 의미의 생활 유틸리티 사이트다.

대표 기능:

- 홈 생활 계산: 할인율, 만나이, D-day
- 해외직구 관세 계산기
- 로또 번호 생성기
- 영수증 OCR은 보존 중이지만 공개 주력 기능에서는 제외

운영 정보:

- 문의 이메일: `tools@dailychecklab.com`
- 파일계산소 문의 이메일: `filetools@dailychecklab.com`
- 공개 URL: `https://tools.dailychecklab.com/`
- 파일계산소 URL: `https://tools.dailychecklab.com/file-tools/`
- Cloudflare Pages 프로젝트: `tools-dailychecklab`
- GitHub 저장소: `stockabc76-bit/tools-dailychecklab`
- 관련 사이트:
  - 파일계산소: `https://tools.dailychecklab.com/file-tools/`
  - BodyIndexLab: `https://bodyindexlab.com/`
  - 생활금융 계산소: `https://money.dailychecklab.com/`
  - 생활계산소: `https://tools.dailychecklab.com/`

기본 메시지:

- 무료 이용
- 입력값 저장 없음
- 브라우저에서 계산
- 결과는 참고용이며 공식 기준 확인 필요

## 주요 결정 사항

1. 사이트명은 `생활계산소`로 통일했다.
   - 헤더 로고 텍스트, 푸터, 메타 title/description, OG 문구에 반영했다.

2. 로고는 계산기 심볼 + 실제 텍스트 워드마크 방식이다.
   - 심볼: 둥근 사각형 계산기, +, -, x, 체크 요소
   - 색상: 딥그린/민트
   - 기존 `L+` 로고는 교체했다.

3. 홈 히어로 우측 미리보기는 3개 순환 구조다.
   - 할인율/만나이/D-day 이미지
   - 해외직구 관세 이미지
   - 로또 번호 생성기 텍스트형 미리보기
   - 각 미리보기는 실제 기능으로 링크된다.

4. 모바일 헤더 메뉴는 숨기지 않는다.
   - 좁은 화면에서도 상단 메뉴가 가로 스크롤 형태로 계속 보이게 했다.

5. 홈 중간 카드 구조를 정리했다.
   - 모바일에서 이동 위치가 어색했던 할인율/만나이/D-day 카드 3개는 삭제했다.
   - 관세 계산기와 로또 번호 생성기 카드는 실제 기능 접근용으로 유지했다.

6. 영수증 OCR은 기능 품질 보완 전까지 공개 주력에서 제외했다.
   - `receipt-ocr.html`은 삭제하지 않고 보존했다.
   - OCR 결과 정리 로직은 1차 필터를 적용했지만, 추출 품질은 추가 개발 필요.

7. OCR 대신 로또 번호 생성기를 추가했다.
   - 새 페이지: `lotto.html`
   - 로직: `assets/lotto.js`
   - 포함할 번호, 제외할 번호 선택 가능
   - 중복 없는 1~45 번호 6개 생성
   - 복사, 다시 생성 가능

8. 로또 페이지 콘텐츠는 1~3번만 반영했다.
   - 로또번호 생성기 사용 방법
   - 로또번호 패턴 분석 방법
   - 복권 당첨금 세금 계산법 (2026년 기준)
   - 로또 번호 당첨 확인기는 제외했다.

9. 로또 패턴 안내는 오해 없게 썼다.
   - 특정 패턴이 당첨 확률을 높인다는 표현은 사용하지 않는다.
   - 홀짝, 고저, 연속 번호, 합계는 참고용 분류 정보로만 설명한다.

10. 로또 세금 안내는 구간별 원천징수 방식으로 정리했다.
    - 200만원 이하: 비과세
    - 200만원 초과 ~ 3억원 이하: 22%
    - 3억원 초과분: 33%
    - 10억원 예시는 3억원까지 22%, 초과 7억원은 33%로 계산했다.
    - 실제 지급액은 수령 시점 법령과 동행복권 공식 안내 확인 문구를 넣었다.

11. 광고 영역은 화면에 보이지 않게 했다.
    - 승인 전에는 `광고 영역` 박스를 노출하지 않는다.
    - HTML에는 광고 코드 삽입 위치를 주석으로만 남긴다.

12. 문의 및 관련 사이트 구조를 보강했다.
    - 문의 페이지에 운영 이메일 `tools@dailychecklab.com`을 반영했다.
    - 문의 페이지에 `바디인덱스랩` 관련 사이트 카드를 추가했다.
    - 전체 푸터 브랜드 설명 아래에 `관련 사이트 바로가기` 셀렉트를 추가했다.
    - 셀렉트 기본값은 `사이트 선택`이다.
    - 관련 사이트 셀렉트 옵션은 `파일계산소`, `BodyIndexLab`, `생활금융 계산소`, `생활계산소` 순서다.
    - 푸터 정책 묶음은 `사이트 소개`, `개인정보처리방침`, `문의`를 기본으로 맞춘다.

13. 파일계산소 정책 페이지를 보강했다.
    - `/file-tools/about.html`
    - `/file-tools/privacy.html`
    - `/file-tools/disclaimer.html`
    - `/file-tools/contact.html`
    - 파일계산소 문의 이메일은 `filetools@dailychecklab.com`이다.
    - PDF 압축 기능은 제외 유지, GIF→MP4는 서버 기능이 필요해 현재 버전에는 넣지 않는다.
    - 파일계산소 주요 기능은 브라우저 안에서 처리되며 파일과 텍스트를 서버로 업로드하거나 저장하지 않는다는 문구를 유지한다.

## 새로 만든 문서

- `design.md`
  - 생활계산소 디자인 가이드
  - 색상, 폰트, 로고, 카드, 버튼, 히어로, 모바일 기준 정리

- `skills/living-calculator-site/SKILL.md`
  - 생활계산소 사이트 작업 스킬
  - 새 도구 추가, SEO 수정, 모바일 검수, 최종 폴더 반영 절차 정리

- `skills/living-calculator-site/agents/openai.yaml`
  - 스킬 UI 메타데이터

## 디자인 기준 요약

자세한 내용은 `design.md`를 본다.

핵심 컬러:

- `--ink: #102535`
- `--muted: #536878`
- `--line: #dce6e5`
- `--surface-soft: #f5faf8`
- `--green: #087d64`
- `--green-dark: #07654f`
- `--mint: #daf4eb`
- `--mint-deep: #b9ead9`

폰트:

```css
"Pretendard Variable", Pretendard, "Noto Sans KR", "Apple SD Gothic Neo", Arial, sans-serif
```

스타일 원칙:

- 흰 카드
- 얇은 라인
- 큰 라운드
- 부드러운 그림자
- 딥그린 CTA
- 실제 텍스트 워드마크
- 모바일 메뉴 유지

## 주요 파일

- `index.html`: 홈, 히어로, 생활 계산, 공개 기능 카드
- `customs.html`: 해외직구 관세 계산기
- `lotto.html`: 로또 번호 생성기
- `receipt-ocr.html`: OCR 보존 페이지
- `guide.html`: 계산 기준
- `about.html`: 사이트 소개
- `privacy.html`: 개인정보처리방침
- `contact.html`: 문의
- `assets/styles.css`: 전체 스타일
- `assets/app.js`: 홈 계산기/히어로 동작
- `assets/customs.js`: 관세 계산
- `assets/receipt.js`: OCR 처리
- `assets/lotto.js`: 로또 번호 생성

## 검증했던 내용

브라우저에서 확인한 것:

- 로또 번호 생성기에서 포함 7, 제외 8 조건으로 생성 시 7 포함, 8 제외, 중복 없음 확인
- 홈 카드에서 로또 페이지 이동 확인
- 홈 히어로 3번째 로또 미리보기 클릭 이동 확인
- 로또 사용 방법, 패턴 안내, 세금 안내 표시 확인
- 화면에 광고 영역 문구가 보이지 않음 확인
- 콘솔 오류 없음 확인
- 문의 이메일과 바디인덱스랩 관련 사이트 링크가 HTML에 반영됨 확인
- `/file-tools/` 하위 정책 페이지가 추가되고 sitemap.xml에 반영됨 확인

최종 폴더 복사 후 해시 확인한 파일:

- `lotto.html`
- `index.html`
- `customs.html`
- `guide.html`
- `about.html`
- `privacy.html`
- `contact.html`
- `receipt-ocr.html`
- `assets/styles.css`
- `assets/lotto.js`
- `design.md`
- `skills/living-calculator-site/SKILL.md`
- `skills/living-calculator-site/agents/openai.yaml`

## 남은 후보 작업

1. 영수증 OCR 품질 개선
   - 상품 행 추출 정확도 개선
   - 금액/수량/상품명 구분 보완
   - OCR 전처리 또는 결과 후처리 필요

2. 로또 페이지 추가 개선
   - 세금 계산기를 실제 입력형으로 만들지 여부 결정
   - 당첨 확인기는 현재 제외 상태
   - 공식 회차 데이터 연동이 없다면 당첨 확인 기능은 신중히 접근

3. 실제 AdSense 승인 후 광고 코드 삽입
   - 현재는 주석 위치만 있음
   - 화면에 임시 광고 박스는 보이지 않는 상태

4. 배포 전 전체 재검수
   - 모바일 헤더
   - 홈 히어로 링크
   - 각 계산기 동작
   - `sitemap.xml`, `robots.txt`
   - 메타 문구

## 다음 Codex에게 주의할 점

- 사용자 변경분을 임의로 되돌리지 말 것.
- 외부 최종 폴더 `D:\기능사잇\애드센스용\생활계산랩`에 쓸 때는 권한 승인을 받을 것.
- 관세, 세금, 법령, 복권 안내는 최신 공식 기준을 확인할 것.
- 로또 패턴을 당첨 확률 상승처럼 표현하지 말 것.
- OCR은 아직 약한 기능이므로 공개 주력 문구로 밀지 말 것.
- 광고 영역은 승인 전 화면에 보이는 박스로 만들지 말 것.
- 새 도구를 추가할 때는 `design.md`와 `skills/living-calculator-site/SKILL.md`를 먼저 읽을 것.
