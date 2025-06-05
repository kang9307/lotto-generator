# BrainDetox Utility Box

BrainDetox Utility Box는 일상생활과 업무에 유용한 다양한 웹 기반 유틸리티 도구를 제공하는 서비스입니다. 로또 번호 생성, IP 서브넷 계산, 비밀번호 생성, QR 코드 생성, 기술 블로그 등 여러 도구를 한 곳에서 편리하게 이용할 수 있습니다.

**English**: BrainDetox Utility Box is a comprehensive web-based service offering various utility tools for daily life and work. It provides easy access to multiple tools including lottery number generator, IP subnet calculator, password generator, QR code generator, and a technical blog.

## 제공 서비스 (Services Provided)

- **로또 번호 생성기 (Lottery Number Generator)**: 무작위 로또 번호 생성, 연속번호 제한 알고리즘 적용, 최대 10개 게임 동시 생성, 실제 로또용지와 유사한 마킹 기능
- **서브넷 계산기 (Subnet Calculator)**: IP 서브넷 마스크 계산, CIDR 표기법 변환, IP 범위 계산, 서브넷 분할 지원
- **비밀번호 생성기 (Password Generator)**: 보안 강도 설정, 특수문자/숫자/대문자 포함 옵션, 사용자 정의 길이 조절, 강도 측정기 제공
- **QR 코드 생성기 (QR Code Generator)**: URL, 텍스트, 연락처, WiFi 접속 정보 변환, Base64 인코딩 지원, 한글 텍스트 처리 최적화
- **기술 블로그 (Technical Blog)**: 프로그래밍, 네트워크, 클라우드, 보안 등 IT 관련 정보와 시사/경제 소식 제공

## 주요 기능 (Key Features)

- **사용자 친화적 인터페이스 (User-Friendly Interface)**: 직관적인 디자인과 모바일 최적화로 어디서나 편리하게 이용 가능
- **모바일 반응형 설계 (Mobile Responsive Design)**: 다양한 화면 크기에 최적화된 반응형 레이아웃
- **다국어 지원 (Multilingual Support)**: 한글 및 다양한 특수문자 처리 최적화
- **소셜 미디어 공유 (Social Media Sharing)**: 카카오톡, 페이스북, X(트위터), 쓰레드 등 다양한 플랫폼으로 결과 공유 가능
- **오프라인 사용 (Offline Usage)**: 로컬 스토리지 활용으로 일부 기능 오프라인 사용 가능

## 사이트 업데이트 내역 (Update History)

최근 업데이트 (Recent Updates):
- **2025-06-10**: 기술 블로그 기능 추가 - 마크다운 지원, 코드 하이라이팅, 카테고리 필터링
- **2025-06-05**: QR 코드 생성기 추가 - URL, 텍스트, 연락처, WiFi 정보 지원 및 한글 인코딩 기능 개선
- **2025-06-01**: 프로젝트명 변경 - "행운의 로또 번호 생성기"에서 "BrainDetox Utility Box"로 변경
- **2025-06-01**: 비밀번호 생성기 기능 추가
- **2025-06-01**: 서브넷 계산기 기능 구현 완료
- **2025-06-01**: 사이트 전체 디자인 개선 및 반응형 레이아웃 적용
- **2025-06-01**: 동적 헤더/푸터 로딩 방식 도입 (메뉴 관리 용이성 개선)
- **2023-06-01**: 로또 번호 생성기 모바일 최적화 및 기능 개선

## 향후 추가 예정 기능 (Upcoming Features)

- **색상 팔레트 생성기 (Color Palette Generator)**: 디자인 작업용 색상 조합 추천 및 색상 코드 변환기
- **텍스트 도구 모음 (Text Tools Collection)**: Base64, URL 인코딩/디코딩, 문자 수 계산기 등을 한 곳에서 제공
- **단위 변환 계산기 (Unit Converter)**: 길이, 무게, 온도, 화폐 등 다양한 단위 간 변환 도구
- **JSON/CSV/XML 포맷터 (Data Format Tools)**: 개발자용 데이터 포맷 정리 및 검증 도구
- **메모장/노트 앱 (Note Taking App)**: 로컬 스토리지 기반의 간단한 메모 저장 도구 (검색 기능 포함)
- **시간/날짜 계산기 (Date/Time Calculator)**: 날짜 간 차이, D-day, 업무일 계산 등 다양한 시간 계산 기능
- **랜덤 추첨 도구 (Random Picker)**: 다양한 범위의 랜덤 숫자/항목 추첨 기능
- **마크다운 에디터 (Markdown Editor)**: 간단한 텍스트 포맷팅을 위한 마크다운 편집 및 미리보기 도구

## 기술 구현 사항 (Technical Implementation)

### 동적 헤더/푸터 로딩 (Dynamic Header/Footer Loading)

사이트는 동적 헤더/푸터 로딩 방식을 사용하여 메뉴 관리를 용이하게 합니다:
- 로컬 환경: 인라인 HTML 방식으로 헤더/푸터 로드
- 웹 서버 환경: fetch API를 사용하여 외부 HTML 파일 로드
- 메뉴 변경 시 `components/header.html` 파일만 수정하면 모든 페이지에 자동 반영

메뉴 구조 변경 방법:
1. 웹 서버 환경: `components/header.html` 파일 수정
2. 로컬 환경 테스트 시: `common.js` 파일 내 `headerHTML` 변수도 함께 수정

### 로또 번호 생성기 구현 (Lottery Number Generator Implementation)

로또 번호 생성기는 Fisher-Yates 알고리즘을 기반으로 한 무작위 번호 생성 시스템을 사용하며, 연속 번호 제한 및 다양한 게임 수 설정 기능을 제공합니다:
- 1~45 범위의 번호 중 무작위 6개 선택
- 최대 10개 게임 동시 생성 지원
- 로또 용지 마킹 기능으로 실제 로또 구매 용이

### QR 코드 생성기 구현 (QR Code Generator Implementation)

QR 코드 생성기는 다음 주요 기능을 포함합니다:
- 다양한 데이터 유형 지원: URL, 텍스트, 연락처, WiFi 정보, 이메일, SMS, 위치 정보
- 한글 텍스트 지원: Base64 인코딩 방식을 통한 한글 및 특수문자 안정적 처리
- 사용자 정의 설정: QR 코드 크기, 색상, 오류 수정 레벨 조정 가능
- 이미지 다운로드: 생성된 QR 코드를 PNG 이미지로 저장 기능

### 서브넷 계산기 구현 (Subnet Calculator Implementation)

서브넷 계산기는 네트워크 관리자를 위한 다양한 기능을 제공합니다:
- IP 주소 및 서브넷 마스크 변환
- CIDR 표기법 지원
- 네트워크 주소, 브로드캐스트 주소, 사용 가능한 호스트 수 계산
- 서브네팅 계산 및 시각화

### 기술 블로그 구현 (Technical Blog Implementation)

기술 블로그는 다음 기능을 포함합니다:
- 마크다운 형식 지원: 마크다운 파일에서 콘텐츠 로드 및 렌더링
- 코드 하이라이팅: 프로그래밍 코드 구문 강조
- 카테고리 필터링: 주제별 글 필터링 기능
- 반응형 디자인: 모바일 및 데스크톱 환경 모두 지원

#### 마크다운 파일 추가 방법 (Adding Markdown Files)

새로운 블로그 포스트를 추가하는 방법은 다음과 같습니다:

1. `posts` 디렉토리에 새 마크다운(.md) 파일 생성 (파일명은 영문 소문자와 언더스코어 사용 권장)
2. 마크다운 파일 상단에 다음 메타데이터 포함:
   ```markdown
   <!-- category: 카테고리명 -->
   <!-- date: YYYY-MM-DD -->
   <!-- featured: true 또는 false -->
   <!-- keywords: 키워드1, 키워드2, ... -->
   <!-- title: 게시물 제목 -->
   ```
3. `posts/index.json` 파일에 새 마크다운 파일명 추가:
   ```json
   {
     "files": [
       "기존_파일.md",
       "새로운_파일.md"
     ],
     "lastUpdated": "업데이트_날짜"
   }
   ```

파일을 추가한 후에는 브라우저 새로고침을 통해 즉시 변경사항을 확인할 수 있습니다.

## SEO 최적화 설정 (SEO Optimization)

### Google Search Console 설정 (Google Search Console Setup)

현재 Google Search Console에 사이트가 등록되어 있습니다. 추가 설정이 필요한 경우:

1. [Google Search Console](https://search.google.com/search-console/about)에 접속
2. '속성 추가' 버튼을 클릭
3. URL 접두어 옵션 선택 후 웹사이트 URL 입력
4. 'HTML 파일 업로드' 방식 선택
5. Google에서 제공하는 HTML 확인 파일 다운로드
6. 해당 파일을 웹 서버 루트 디렉토리에 업로드

### 소셜 미디어 공유 기능 (Social Media Sharing)

현재 다음과 같은 소셜 미디어 공유 기능을 제공합니다:
- 카카오톡 (KakaoTalk)
- 페이스북 (Facebook)
- X(트위터) (Twitter)
- 쓰레드 (Threads)
- 링크 복사 (Copy Link)

### 구조화된 데이터 (Structured Data)

모든 페이지에 JSON-LD 형식의 구조화된 데이터를 포함하여 검색 엔진 최적화를 강화했습니다:
- WebSite 스키마
- WebApplication 스키마
- BreadcrumbList 스키마
- FAQPage 스키마 (적용 가능한 페이지)

## 국제화 (Internationalization)

현재 한국어가 기본 언어이지만, 추후 다음과 같은 국제화 기능을 구현할 예정입니다:
- 영어 인터페이스 지원
- 다국어 콘텐츠 제공
- 국가별 특화 기능 (예: 다양한 국가의 로또 시스템 지원)

## 웹사이트 정보 (Website Information)

- **URL**: [https://braindetox.kr](https://braindetox.kr)
- **GitHub 저장소**: [https://github.com/braindetox/utility-box](https://github.com/braindetox/utility-box)
- **기술 스택**: HTML, CSS, JavaScript (Pure/Vanilla)
- **업데이트 주기**: 월 1-2회 기능 업데이트 및 콘텐츠 추가

## 라이센스 (License)

Copyright (c) 2025 braindetox.kr. All rights reserved.

## 배포 정보
- 마지막 배포: 2025년 최신 버전
- 배포 트리거 타임스탬프: 2025-06-30 12:00:00 