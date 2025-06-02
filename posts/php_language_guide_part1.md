<!-- title: PHP 언어 완벽 가이드 - 기초부터 고급까지 (PHP Language Complete Guide) -->
<!-- category: 프로그래밍 -->
<!-- date: 2025-06-05 -->
<!-- keywords: PHP, 웹 개발, 서버 사이드 스크립팅, 백엔드, 프로그래밍 언어, 웹 애플리케이션, PHP 기초, PHP 문법, PHP 함수, PHP 객체지향 -->

# PHP 언어 완벽 가이드 - 기초부터 고급까지

PHP(PHP: Hypertext Preprocessor)는 웹 개발에 널리 사용되는 서버 사이드 스크립팅 언어입니다. 1994년 Rasmus Lerdorf가 개발한 이래로 웹 개발의 중요한 도구로 자리 잡았으며, 전 세계 웹사이트의 약 79%가 PHP를 사용하고 있습니다.

## 목차

1. [PHP 소개](#php-소개)
2. [PHP 설치 및 환경 설정](#php-설치-및-환경-설정)
3. [PHP 기본 문법](#php-기본-문법)
4. [변수와 데이터 타입](#변수와-데이터-타입)
5. [연산자](#연산자)
6. [조건문과 반복문](#조건문과-반복문)
7. [함수](#함수)
8. [배열](#배열)
9. [문자열 처리](#문자열-처리)
10. [폼 처리와 사용자 입력](#폼-처리와-사용자-입력)
11. [세션과 쿠키](#세션과-쿠키)
12. [파일 처리](#파일-처리)
13. [데이터베이스 연동](#데이터베이스-연동)
14. [객체지향 PHP](#객체지향-php)
15. [예외 처리](#예외-처리)
16. [날짜와 시간](#날짜와-시간)
17. [정규 표현식](#정규-표현식)
18. [네임스페이스](#네임스페이스)
19. [PHP 라이브러리와 프레임워크](#php-라이브러리와-프레임워크)
20. [보안 최적화](#보안-최적화)
21. [성능 최적화](#성능-최적화)
22. [REST API 개발](#rest-api-개발)
23. [PHP 8.x의 새로운 기능](#php-8x의-새로운-기능)
24. [실전 응용 예제](#실전-응용-예제)

## PHP 소개

PHP는 "PHP: Hypertext Preprocessor"의 약자로, 웹 서버에서 실행되는 스크립트 언어입니다. 주로 HTML 내에 삽입되어 동적 웹 페이지를 생성하는 데 사용됩니다.

### PHP의 주요 특징

- **서버 사이드 스크립팅**: 코드가 서버에서 실행되고 결과만 클라이언트에게 전달됩니다.
- **크로스 플랫폼**: Windows, Linux, macOS 등 다양한 운영체제에서 실행 가능합니다.
- **데이터베이스 통합**: MySQL, PostgreSQL, SQLite 등 다양한 데이터베이스와 쉽게 연동됩니다.
- **오픈 소스**: 무료로 사용 가능하며 대규모 개발자 커뮤니티가 있습니다.
- **풍부한 기능**: 파일 업로드, 이메일 전송, PDF 생성 등 다양한 기능을 제공합니다.

### PHP가 사용되는 분야

- 웹 애플리케이션 개발
- 콘텐츠 관리 시스템(WordPress, Joomla, Drupal)
- 전자상거래 플랫폼(Magento, WooCommerce)
- 포럼 및 소셜 네트워킹 사이트
- REST API 및 웹 서비스

### PHP vs 다른 백엔드 언어

| 언어 | 장점 | 단점 |
|------|------|------|
| PHP | 쉬운 학습 곡선, 풍부한 문서, 많은 호스팅 지원 | 일관성 부족, 타입 안정성 문제(PHP 7 이전) |
| Node.js | 비동기 처리, JavaScript 생태계 | 콜백 지옥, 상대적으로 새로운 기술 |
| Python | 가독성, 다양한 라이브러리 | 속도 문제, 멀티스레딩 제한 |
| Ruby | 우아한 문법, 생산성 | 느린 실행 속도, 호스팅 제약 |

## PHP 설치 및 환경 설정

### Windows에 PHP 설치하기

1. **PHP 다운로드**
   - [PHP 공식 사이트](https://www.php.net/downloads.php)에서 최신 버전 다운로드
   - Thread Safe 버전 권장

2. **설치 및 설정**
   ```
   C:\> mkdir C:\PHP
   C:\> 다운로드한 ZIP 파일을 C:\PHP에 압축 해제
   C:\> cd C:\PHP
   C:\PHP> copy php.ini-development php.ini
   ```

3. **환경 변수 설정**
   - 시스템 속성 → 고급 → 환경 변수 → Path에 C:\PHP 추가

4. **웹 서버 연동**
   - Apache, IIS, 또는 내장 웹 서버 사용 가능

### Linux(Ubuntu)에 PHP 설치하기

```bash
sudo apt update
sudo apt install php php-cli php-fpm php-mysql php-json php-common
```

### macOS에 PHP 설치하기

```bash
brew install php
```

### 개발 환경 설정

1. **통합 개발 환경(IDE) 설치**
   - PHPStorm: 강력한 상용 IDE
   - Visual Studio Code + PHP 확장: 무료 대안
   - Sublime Text: 가볍고 빠른 편집기

2. **로컬 웹 서버 설치**
   - XAMPP: Windows, Linux, macOS 모두 지원
   - WAMP: Windows 전용
   - MAMP: macOS 전용

3. **Composer 설치 (PHP 패키지 관리자)**
   ```bash
   curl -sS https://getcomposer.org/installer | php
   sudo mv composer.phar /usr/local/bin/composer
   ```

### PHP 설정 파일(php.ini) 주요 설정

```ini
; 메모리 제한
memory_limit = 128M

; 최대 실행 시간(초)
max_execution_time = 30

; 파일 업로드 설정
upload_max_filesize = 2M
post_max_size = 8M

; 오류 표시 설정(개발 환경)
display_errors = On
error_reporting = E_ALL

; 오류 표시 설정(운영 환경)
; display_errors = Off
; error_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT
``` 