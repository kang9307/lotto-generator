# 행운의 로또 번호 생성기

행운의 로또 번호 생성기는 사용자에게 무작위로 로또 번호를 생성해주는 웹 애플리케이션입니다.

## 주요 기능

- 최대 5개 게임 동시 생성
- 연속번호 제한 알고리즘 적용
- 실제 로또용지와 유사한 마킹 기능
- 최근 당첨번호 정보 제공
- 소셜 미디어 공유 기능

## SEO 최적화 설정

### Google Search Console 설정

현재 `google4a31e65fcdd7de7d.html` 파일은 임시 예시 파일입니다. 
실제 Google Search Console에 사이트를 등록하기 위해서는 다음 단계를 따라야 합니다:

1. [Google Search Console](https://search.google.com/search-console/about)에 접속
2. '속성 추가' 버튼을 클릭
3. URL 접두어 옵션 선택 후 웹사이트 URL 입력
4. 'HTML 파일 업로드' 방식 선택
5. Google에서 제공하는 HTML 확인 파일 다운로드
6. 해당 파일을 웹 서버 루트 디렉토리에 업로드 (기존 임시 파일 대체)

> **주의**: 현재 `google4a31e65fcdd7de7d.html` 파일은 실제 확인 코드가 아니므로 반드시 Google Search Console에서 직접 발급받은 파일로 교체해야 합니다.

### 로또 당첨번호 자동 업데이트

현재 로또 당첨번호는 CORS 정책으로 인해 클라이언트에서 직접 동행복권 API를 호출할 수 없습니다.
실제 서비스 구현 시 다음 방법 중 하나를 사용하는 것이 좋습니다:

1. 서버 측 API 구현 - 서버에서 동행복권 데이터를 가져와 제공
2. 정기적인 수동 업데이트 - 관리자가 최신 당첨번호 데이터 업데이트
3. 서버리스 함수 - AWS Lambda 또는 Google Cloud Functions를 활용한 API 프록시 구현

## 라이센스

Copyright (c) 2023-2025 braindetox.kr. All rights reserved. 