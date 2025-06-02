<!-- category: 리눅스 -->
<!-- date: 2025-07-20 -->
<!-- featured: true -->
<!-- keywords: 리눅스, grep, awk, 텍스트 처리, 명령어, 정규표현식, Linux, command line, text processing, regular expression -->
<!-- title: 리눅스 Grep과 AWK 사용 가이드 (Linux Grep and AWK Usage Guide) -->

리눅스에서 텍스트 처리는 시스템 관리와 데이터 분석에 필수적인 기술입니다. 이 글에서는 가장 강력한 텍스트 처리 도구인 Grep과 AWK의 사용법을 상세히 알아봅니다.

**English**: Text processing in Linux is an essential skill for system administration and data analysis. This article explores the usage of two powerful text processing tools: Grep and AWK.

## Grep 명령어 기초

Grep(Global Regular Expression Print)은 파일이나 입력 스트림에서 특정 패턴을 검색하는 강력한 도구입니다.

### 기본 사용법

```bash
grep [옵션] 패턴 [파일...]
```

### 자주 사용하는 옵션

```bash
# 대소문자 구분 없이 검색
grep -i "error" log.txt

# 일치하는 라인 번호 표시
grep -n "warning" log.txt

# 일치하지 않는 라인 검색
grep -v "success" log.txt

# 재귀적으로 디렉토리 검색
grep -r "config" /etc/

# 정규식 사용
grep -E "error|warning" log.txt

# 단어 단위로 일치
grep -w "main" program.c
```

### 실제 활용 예시

```bash
# 로그 파일에서 에러 메시지만 추출
grep "ERROR" /var/log/syslog

# 특정 프로세스 찾기
ps aux | grep "nginx"

# 설정 파일에서 주석이 아닌 라인만 보기
grep -v "^#" /etc/ssh/sshd_config
```

## AWK 명령어 기초

AWK는 텍스트 스트림을 처리하는 강력한 프로그래밍 언어입니다. 데이터 추출 및 보고서 생성에 탁월합니다.

### 기본 사용법

```bash
awk '패턴 {액션}' [파일...]
```

### 필드 처리

AWK는 기본적으로 공백을 구분자로 사용하여 텍스트를 필드로 나눕니다.

```bash
# 두 번째 필드 출력
awk '{print $2}' file.txt

# 첫 번째와 세 번째 필드 출력
awk '{print $1, $3}' file.txt

# 필드 구분자 지정 (CSV 파일)
awk -F, '{print $1, $3}' data.csv
```

### 조건문과 패턴

```bash
# 세 번째 필드가 100보다 큰 라인만 출력
awk '$3 > 100 {print $0}' data.txt

# 특정 패턴이 포함된 라인만 처리
awk '/error/ {print $0}' log.txt

# 첫 번째 필드가 "user"인 라인만 처리
awk '$1 == "user" {print $2}' users.txt
```

### 내장 변수

```bash
# 라인 번호와 함께 출력
awk '{print NR, $0}' file.txt

# 필드 수 출력
awk '{print NF, $0}' file.txt

# 모든 필드의 합계 계산
awk '{sum = 0; for (i=1; i<=NF; i++) sum += $i; print sum}' numbers.txt
```

## 실무 활용 예시

### 시스템 모니터링

```bash
# 메모리 사용량이 높은 프로세스 찾기
ps aux | awk '$4 > 5.0 {print $2, $4, $11}'

# 디스크 사용량이 90% 이상인 파티션 찾기
df -h | awk '$5 > 90 {print $1, $5, $6}'
```

### 로그 분석

```bash
# 특정 시간대의 로그 항목 추출
grep "2025-07-20" server.log | awk '/ERROR/ {print $1, $2, $NF}'

# IP 주소별 접속 횟수 계산
awk '{print $1}' access.log | sort | uniq -c | sort -nr
```

### 데이터 처리

```bash
# CSV 파일의 특정 열 합계 계산
awk -F, '{sum += $3} END {print "Total:", sum}' sales.csv

# 텍스트 파일에서 이메일 주소 추출
grep -E -o "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b" file.txt
```

## 결론

Grep과 AWK는 리눅스 환경에서 텍스트 처리의 핵심 도구입니다. 이 두 도구를 마스터하면 복잡한 데이터 처리 작업을 간단한 명령어로 해결할 수 있습니다. 정규표현식과 함께 사용하면 더욱 강력한 기능을 발휘하니, 꾸준한 연습을 통해 실력을 키우시기 바랍니다. 