# 생활계산소 정적 사이트

할인율, 만나이, D-day, 해외직구 예상 관부가세 계산기와 간이 영수증 OCR을 포함한 애드센스용 정적 사이트 초안입니다.

## 포함 파일

- `index.html`: 홈 및 계산기
- `guide.html`: 계산 기준과 사용 안내
- `customs.html`: 해외직구 관세 간이 계산기
- `receipt-ocr.html`: 영수증 OCR 및 엑셀 내보내기
- `about.html`: 사이트 소개
- `privacy.html`: 개인정보처리방침
- `contact.html`: 문의 안내
- `assets/styles.css`, `assets/app.js`: 공통 스타일 및 계산 로직

## 공개 전 교체 항목

1. 사이트명과 실제 도메인을 확정하고 각 페이지의 메타 정보와 `robots.txt`에 실제 사이트맵 URL을 추가합니다.
2. `contact.html`에 실제로 받을 수 있는 운영자 이메일 주소를 기재합니다.
3. 광고 승인 후 `ads.txt.example`의 게시자 ID를 교체하여 사이트 루트에 `ads.txt`로 배포합니다.
4. 사용하는 광고, 분석, 호스팅 서비스에 맞춰 `privacy.html`을 최종 갱신합니다.
5. 필요하면 실제 광고 코드를 `index.html`의 광고 영역에 삽입합니다.
