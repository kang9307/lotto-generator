<!-- category: 리눅스 -->
<!-- date: 2025-06-02 -->
<!-- featured: true -->
<!-- keywords: 리눅스, grep, awk, 텍스트 처리, 명령어, 정규표현식, Linux, command line, text processing, regular expression -->
<!-- title: 리눅스 Grep과 AWK 사용 가이드 (Linux Grep and AWK Usage Guide) -->

# 리눅스 텍스트 처리 심층 분석: Grep과 AWK 마스터하기

리눅스 및 유닉스 계열 시스템에서 텍스트 데이터는 운영의 핵심입니다. 로그 파일, 설정 파일, 명령어 출력 등 모든 것이 텍스트 형태로 존재하며, 이를 효과적으로 다루는 능력은 시스템 관리자, 개발자, 데이터 분석가 모두에게 필수적입니다. 이 글에서는 리눅스에서 가장 강력하고 널리 사용되는 텍스트 처리 도구인 grep과 awk의 기본 사용법부터 고급 활용법까지 상세하게 알아봅니다. 이 두 도구를 능숙하게 사용하면 복잡한 텍스트 처리 작업을 자동화하고, 방대한 데이터에서 원하는 정보를 신속하게 추출하며, 시스템 모니터링 및 분석 작업을 효율적으로 수행할 수 있습니다.

## Grep (Global Regular Expression Print) 명령어 심층 분석

`grep`은 파일이나 표준 입력으로부터 특정 패턴(주로 정규표현식)과 일치하는 라인을 찾아 출력하는 강력한 명령줄 유틸리티입니다. 단순한 문자열 검색부터 복잡한 패턴 매칭까지 다양한 기능을 제공합니다.

### 기본 사용법

```bash
grep [옵션] 패턴 [파일...]
````

  * `[옵션]`: 검색 방식을 제어하는 다양한 옵션들입니다.
  * `패턴`: 검색할 문자열 또는 정규표현식입니다.
  * `[파일...]`: 검색 대상 파일입니다. 생략 시 표준 입력(stdin)을 사용합니다.

### 자주 사용하고 유용한 옵션 상세

| 옵션                          | 설명                                                                 | 예시                                                                           |
| :---------------------------- | :------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| `-i` (`--ignore-case`)        | 대소문자를 구분하지 않고 검색합니다.                                       | `grep -i "error" log.txt`                                                      |
| `-n` (`--line-number`)        | 일치하는 라인의 번호를 함께 출력합니다.                                     | `grep -n "warning" log.txt`                                                    |
| `-v` (`--invert-match`)       | 패턴과 일치하지 *않는* 라인만 검색합니다.                                   | `grep -v "success" log.txt`                                                    |
| `-c` (`--count`)              | 패턴과 일치하는 라인의 총 개수만 출력합니다.                                 | `grep -c "debug" app.log`                                                      |
| `-l` (`--files-with-matches`) | 패턴과 일치하는 라인이 포함된 파일의 이름만 출력합니다. (내용은 출력 안 함)          | `grep -l "TODO" *.java`                                                        |
| `-L` (`--files-without-match`) | 패턴과 일치하는 라인이 없는 파일의 이름만 출력합니다.                             | `grep -L "FINAL_VERSION" *.txt`                                                |
| `-r` 또는 `-R` (`--recursive`)  | 지정된 디렉토리와 그 하위 디렉토리까지 재귀적으로 검색합니다.                        | `grep -r "config_value" /etc/project/`                                         |
| `-w` (`--word-regexp`)        | 패턴이 독립된 단어(word)로 일치하는 경우만 검색합니다. (공백이나 특수문자로 구분) | `grep -w "main" program.c` (main\_function은 매칭, print\_main은 불일치)      |
| `-x` (`--line-regexp`)        | 패턴이 라인 전체와 정확히 일치하는 경우만 검색합니다.                             | `grep -x "localhost:8080" access.log`                                          |
| `-E` (`--extended-regexp`)    | 확장 정규표현식(ERE)을 사용합니다. `egrep` 명령어와 동일합니다.                 | `grep -E "error|warning" log.txt`                                              |
| `-F` (`--fixed-strings`)      | 패턴을 정규표현식이 아닌 고정된 문자열로 취급합니다. (특수문자도 일반문자로)        | `grep -F "*ERROR*" log.txt` (\*를 문자 그대로 검색)                               |
| `-A NUM` (`--after-context=NUM`) | 일치하는 라인과 그 이후 `NUM`개의 라인을 함께 출력합니다.                       | `grep -A 2 "Exception" error.log`                                              |
| `-B NUM` (`--before-context=NUM`) | 일치하는 라인과 그 이전 `NUM`개의 라인을 함께 출력합니다.                       | `grep -B 3 "SEGFAULT" core_dump.txt`                                           |
| `-C NUM` (`--context=NUM`)    | 일치하는 라인과 그 이전/이후 `NUM`개의 라인을 함께 출력합니다. (`-A NUM -B NUM`과 유사) | `grep -C 1 "critical error" system.log`                                        |
| `--color=auto`                | 검색된 패턴을 다른 색으로 강조하여 보여줍니다. (대부분 시스템에서 기본값)            | `grep --color=auto "pattern" file.txt`                                         |
| `-o` (`--only-matching`)      | 일치하는 라인 전체가 아닌, 패턴과 일치하는 부분만 출력합니다. 각 매칭은 새 줄에 표시. | `grep -o -E "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" access.log`      |

### Grep과 정규표현식 (Regular Expressions)

`grep`의 진정한 강력함은 정규표현식과 함께 사용할 때 발휘됩니다. 정규표현식은 텍스트의 특정 패턴을 기술하는 형식 언어입니다.

  * **기본 정규표현식 (BRE - Basic Regular Expressions)**: `grep`의 기본 모드입니다. `*`, `.`, `^`, `$`, `[]`, `\` 등의 메타문자를 사용합니다. `+`, `?`, `|`, `()` 같은 일부 메타문자는 앞에 `\`를 붙여야 특별한 의미로 사용됩니다 (예: `\+`, `\?`, `\|`, `\(\)`).
  * **확장 정규표현식 (ERE - Extended Regular Expressions)**: `grep -E` 또는 `egrep`을 사용합니다. BRE의 모든 기능에 더해 `+`, `?`, `|`, `()` 등을 `\` 없이 사용할 수 있어 표현이 간결해집니다.

**주요 정규표현식 메타문자 및 구성 요소:**

| 메타문자/구성요소             | 설명                                                                 | BRE 예시 (필요시 `\`) | ERE 예시 (`grep -E`)           |
| :-------------------------- | :------------------------------------------------------------------- | :------------------- | :----------------------------- |
| `.`                         | 임의의 한 문자와 일치 (줄바꿈 문자 제외)                                   | `a.c`                | `a.c`                          |
| `*`                         | 바로 앞의 문자가 0번 이상 반복될 때 일치                                   | `ab*c` (ac, abc, abbc...) | `ab*c`                         |
| `+`                         | 바로 앞의 문자가 1번 이상 반복될 때 일치 (ERE)                             | `ab\+c`              | `ab+c` (abc, abbc...)          |
| `?`                         | 바로 앞의 문자가 0번 또는 1번 나타날 때 일치 (ERE)                         | `ab\?c`              | `ab?c` (ac, abc)               |
| `^`                         | 라인의 시작 부분과 일치                                                    | `^start`             | `^start`                       |
| `$`                         | 라인의 끝 부분과 일치                                                      | `end$`               | `end$`                         |
| `[abc]`                     | 대괄호 안의 문자 중 하나와 일치 (a 또는 b 또는 c)                            | `[aeiou]`            | `[aeiou]`                      |
| `[^abc]`                    | 대괄호 안의 문자를 제외한 나머지 문자 중 하나와 일치                             | `[^0-9]` (숫자 제외) | `[^0-9]`                       |
| `[a-z]`                     | a부터 z까지의 문자 중 하나와 일치 (범위 지정)                                | `[A-Za-z0-9]`        | `[A-Za-z0-9]`                  |
| `\|` (BRE) `\|` (ERE)       | OR 조건. 앞 또는 뒤의 패턴 중 하나와 일치                                | `apple\|orange`      | `apple|orange`                 |
| `\(...\)` (BRE) `(...)` (ERE) | 그룹화. 패턴의 일부를 묶어 적용 범위를 지정하거나, 역참조를 위해 사용           | `\(ab\)\+`           | `(ab)+`                        |
| `{n}`                       | 바로 앞의 문자가 정확히 n번 반복 (ERE)                                     | `a\{3\}`             | `a{3}` (aaa)                   |
| `{n,}`                      | 바로 앞의 문자가 n번 이상 반복 (ERE)                                       | `a\{2,\}`            | `a{2,}` (aa, aaa...)           |
| `{n,m}`                     | 바로 앞의 문자가 n번 이상 m번 이하 반복 (ERE)                                | `a\{2,4\}`           | `a{2,4}` (aa, aaa, aaaa)      |
| `\b`                        | 단어 경계 (word boundary). 단어의 시작이나 끝을 의미 (GNU grep)             | `\bword\b`           | `\bword\b`                     |
| `\w`                        | 단어 문자 (알파벳, 숫자, 밑줄). `[A-Za-z0-9_]`와 유사 (GNU grep)           | `\w+`                | `\w+`                          |
| `\s`                        | 공백 문자 (스페이스, 탭 등) (GNU grep)                                   | `\s*`                | `\s*`                          |

### 실제 활용 예시 확장

1.  **로그 파일에서 특정 날짜의 에러 메시지만 추출:**

    ```bash
    # 2025년 7월 20일에 발생한 ERROR 메시지 검색
    grep "2025-07-20" /var/log/syslog | grep "ERROR"
    # 또는 정규표현식을 사용하여 한 번에 검색 (ERE 사용)
    grep -E "^2025-07-20.*ERROR" /var/log/syslog
    ```

2.  **특정 사용자(예: 'nginx')의 프로세스 찾고 CPU/메모리 사용량 확인:**

    ```bash
    ps aux | grep "^nginx" # nginx로 시작하는 사용자명의 프로세스
    # ps aux의 출력에서 첫 번째 필드가 'nginx'인 라인만 grep
    ps aux | grep -E "^nginx\s+"
    ```

3.  **설정 파일에서 주석(\#으로 시작) 및 빈 라인을 제외한 실제 설정값만 보기:**

    ```bash
    grep -v -E "^\s*#|^\s*$" /etc/ssh/sshd_config
    # ^\s*# : 공백으로 시작할 수도 있는 주석 라인
    # ^\s*$ : 공백만 있거나 아무것도 없는 빈 라인
    # | : OR 조건
    # -v : 위 패턴들을 제외
    ```

4.  **소스 코드에서 함수 정의 찾기 (예: 'function\_name(' 패턴):**

    ```bash
    grep -E -n -r "my_function\s*\(" ./src_directory/
    # -n: 라인 번호 표시, -r: 하위 디렉토리 검색
    # \s*\( : 함수 이름 뒤에 공백이 있거나 없을 수 있고, 여는 괄호가 오는 패턴
    ```

5.  **IP 주소만 추출하기:**

    ```bash
    grep -E -o "([0-9]{1,3}\.){3}[0-9]{1,3}" access.log
    # -o: 일치하는 부분만 출력
    # ([0-9]{1,3}\.){3} : 1~3자리 숫자와 점(.)이 3번 반복 (예: 192.168.1.)
    # [0-9]{1,3} : 마지막 1~3자리 숫자 (예: 100)
    ```

6.  **특정 확장자를 가진 파일에서만 검색:**

    ```bash
    grep "search_term" --include=\*.{c,h} -r ./project_dir/
    # --include를 사용하여 .c 또는 .h 파일만 검색
    grep "api_key" --exclude-dir=node_modules -r .
    # --exclude-dir을 사용하여 특정 디렉토리(node_modules)를 검색에서 제외
    ```

## AWK 명령어 심층 분석

`awk`는 패턴 검색과 텍스트/데이터 조작을 위한 강력한 프로그래밍 언어입니다. 주로 열(column) 기반의 데이터를 처리하고 보고서를 생성하는 데 탁월한 능력을 보입니다. C언어와 유사한 문법 구조를 가지며, 복잡한 조건 처리, 연산, 문자열 함수 등을 지원합니다.

### AWK 프로그램의 기본 구조

```awk
pattern { action }
```

  * **pattern**: 어떤 라인에 대해 `action`을 수행할지 결정하는 조건입니다. 생략되면 모든 라인에 대해 `action`이 수행됩니다.
      * 정규표현식: `/regex/`
      * 비교 표현식: `$1 == "ERROR"`, `$3 > 100`
      * 문자열 매칭: `$2 ~ "pattern"` (매칭), `$2 !~ "pattern"` (비매칭)
      * 특별한 패턴: `BEGIN`, `END`
  * **action**: 중괄호 `{}` 안에 기술되며, 세미콜론(;)으로 구분된 하나 이상의 `awk` 명령어들로 구성됩니다. 생략되면 기본 동작은 `print $0` (현재 라인 전체 출력)입니다.

**특별 패턴:**

  * `BEGIN { actions }`: 입력 파일을 읽기 전에 한 번 실행됩니다. 변수 초기화, 헤더 출력 등에 사용됩니다.
  * `END { actions }`: 모든 입력 파일 처리가 끝난 후 한 번 실행됩니다. 총계 계산, 요약 보고서 출력 등에 사용됩니다.

### 필드 처리와 구분자

`awk`는 입력 라인을 \*\*필드(field)\*\*로 자동 분리합니다.

  * `$0`: 현재 처리 중인 라인 전체를 나타냅니다.
  * `$1`, `$2`, `$3`, ...: 첫 번째, 두 번째, 세 번째 필드를 나타냅니다.
  * **필드 구분자 (Field Separator)**:
      * `FS` (Input Field Separator): 입력 필드 구분자입니다. 기본값은 공백(스페이스, 탭)입니다.
          * 명령줄에서 `-F` 옵션으로 지정: `awk -F, '{print $1}' data.csv` (쉼표로 구분된 CSV 파일)
          * `BEGIN` 블록에서 설정: `awk 'BEGIN { FS = ":" } {print $1, $7}' /etc/passwd` (콜론으로 구분된 파일)
      * `OFS` (Output Field Separator): 출력 필드 구분자입니다. 기본값은 공백입니다.
          * `BEGIN` 블록에서 설정: `awk 'BEGIN { OFS = "\t" } {print $1, $2}' file.txt` (탭으로 구분하여 출력)

<!-- end list -->

```bash
# /etc/passwd 파일에서 사용자 이름(첫 번째 필드)과 셸(일곱 번째 필드) 출력, 콜론으로 구분
awk -F: '{print "User:", $1, "Shell:", $7}' /etc/passwd

# CSV 파일에서 첫 번째와 세 번째 필드를 탭으로 구분하여 출력
awk -F, 'BEGIN{OFS="\t"} {print $1, $3}' data.csv
```

### 조건문과 패턴 상세

`awk`는 다양한 조건과 패턴을 사용하여 특정 라인에 대해서만 액션을 수행할 수 있습니다.

  * **정규표현식 패턴**:

    ```awk
    # 'error' 또는 'fail' (대소문자 무시) 문자열이 포함된 라인의 전체 내용 출력
    /[Ee]rror|[Ff]ail/ {print $0}
    ```

    *(쉘에서 실행 시)*

    ```bash
    awk '/[Ee]rror|[Ff]ail/ {print $0}' log.txt
    ```

  * **비교 표현식 패턴**:

    ```awk
    # 세 번째 필드의 값이 100보다 큰 라인만 출력
    $3 > 100 {print "Large Value Found:", $0}
    ```

    *(쉘에서 실행 시)*

    ```bash
    awk '$3 > 100 {print "Large Value Found:", $0}' data.txt
    ```

    ```awk
    # 첫 번째 필드가 정확히 "user_admin"인 라인의 두 번째와 네 번째 필드 출력
    $1 == "user_admin" {print $2, $4}
    ```

    *(쉘에서 실행 시)*

    ```bash
    awk '$1 == "user_admin" {print $2, $4}' users.txt
    ```

  * **범위 패턴**: 특정 시작 패턴부터 특정 끝 패턴까지의 모든 라인에 대해 액션을 수행합니다.

    ```awk
    # "START_SECTION" 라인부터 "END_SECTION" 라인까지 출력
    /START_SECTION/,/END_SECTION/ {print}
    ```

    *(쉘에서 실행 시)*

    ```bash
    awk '/START_SECTION/,/END_SECTION/ {print}' config.file
    ```

  * **논리 연산자**: `&&` (AND), `||` (OR), `!` (NOT)을 사용하여 복합적인 조건을 만들 수 있습니다.

    ```awk
    # 첫 번째 필드가 "admin"이고, 네 번째 필드가 0보다 큰 라인 출력
    $1 == "admin" && $4 > 0 {print $0}
    ```

    *(쉘에서 실행 시)*

    ```bash
    awk '$1 == "admin" && $4 > 0 {print $0}' access_records.txt
    ```

  * **액션 내의 조건문 (`if-else`)**:

    ```awk
    {
        if ($3 > 1000) {
            status = "High"
        } else if ($3 > 500) {
            status = "Medium"
        } else {
            status = "Low"
        }
        print $1, $2, $3, status
    }
    ```

    *(쉘에서 실행 시)*

    ```bash
    awk '{
        if ($3 > 1000) {
            status = "High"
        } else if ($3 > 500) {
            status = "Medium"
        } else {
            status = "Low"
        }
        print $1, $2, $3, status
    }' resource_usage.txt
    ```

### 주요 내장 변수

`awk`는 다양한 내장 변수를 제공하여 프로그래밍을 용이하게 합니다.

| 변수명    | 설명                                                                    | 예시 (쉘에서 실행 시)                                                                 |
| :-------- | :---------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| `NR`      | Number of Records. 현재까지 처리한 총 레코드(라인)의 수.                       | `awk '{print NR, $0}' file.txt` (라인 번호와 함께 출력)                               |
| `FNR`     | File Number of Record. 현재 처리 중인 파일 내에서의 레코드(라인) 수. 다중 파일 처리 시 유용. | `awk '{print FILENAME, FNR, $0}' file1.txt file2.txt`                               |
| `NF`      | Number of Fields. 현재 레코드(라인)의 필드 개수.                             | `awk '{print "Line", NR, "has", NF, "fields:", $0}' file.txt`                        |
| `FILENAME`| 현재 처리 중인 입력 파일의 이름.                                                | `awk '/error/ {print FILENAME, ":", $0}' *.log`                                      |
| `FS`      | Input Field Separator. 입력 필드 구분자 (기본값: 공백).                       | `awk -F';' '{print $1}' data.csv` \<br\> `awk 'BEGIN{FS=";"} {print $1}' data.csv`      |
| `OFS`     | Output Field Separator. 출력 필드 구분자 (기본값: 공백).                      | `awk 'BEGIN{OFS=","} {print $1, $2}' file.txt` (쉼표로 구분하여 출력)                  |
| `RS`      | Record Separator. 입력 레코드 구분자 (기본값: 개행 문자 `\n`).                 | `awk 'BEGIN{RS="\n\n"} {print $1}' paragraphs.txt` (빈 줄로 구분된 단락 처리)        |
| `ORS`     | Output Record Separator. 출력 레코드 구분자 (기본값: 개행 문자 `\n`).            | `awk 'BEGIN{ORS=";"} {print $1}' items.txt` (세미콜론으로 레코드 구분 출력)           |
| `ARGC`    | Argument Count. 명령줄 인수의 개수.                                         | `awk 'BEGIN{print "ARGC:", ARGC}' file.txt`                                          |
| `ARGV`    | Argument Vector. 명령줄 인수를 담고 있는 배열. `ARGV[0]`은 `awk` 자체.          | `awk 'BEGIN{for(i=0;i<ARGC;i++) print ARGV[i]}' file.txt`                           |
| `ENVIRON` | 환경 변수에 접근할 수 있는 연관 배열.                                          | `awk 'BEGIN{print "User:", ENVIRON["USER"]}'`                                        |

### AWK 스크립팅: 변수, 배열, 루프

`awk`는 단순한 필터링을 넘어 스크립팅 언어로서의 기능도 제공합니다.

  * **변수 사용**:

    ```awk
    # 세 번째 필드의 합계 계산
    { sum += $3 } END { print "Total Sum:", sum }
    ```

    *(쉘에서 실행 시)*

    ```bash
    awk '{ sum += $3 } END { print "Total Sum:", sum }' numbers.txt
    ```

  * **연관 배열 (Associative Arrays)**: `awk`의 배열은 숫자 인덱스뿐만 아니라 문자열 인덱스도 사용할 수 있습니다.

    ```awk
    # 첫 번째 필드(예: IP 주소)의 등장 횟수 계산
    { counts[$1]++ } END { for (ip in counts) print ip, "occurred", counts[ip], "times" }
    ```

    *(쉘에서 실행 시)*

    ```bash
    awk '{ counts[$1]++ } END { for (ip in counts) print ip, "occurred", counts[ip], "times" }' access.log
    ```

  * **루프 (Loops)**: `for` 루프와 `while` 루프를 사용할 수 있습니다.

    ```awk
    # 각 라인의 모든 필드를 역순으로 출력
    {
        for (i = NF; i >= 1; i--) {
            printf "%s ", $i
        }
        printf "\n" # 또는 print ""
    }
    ```

    *(쉘에서 실행 시)*

    ```bash
    awk '{
        for (i = NF; i >= 1; i--) {
            printf "%s ", $i
        }
        printf "\n" # 또는 print ""
    }' data.txt
    ```

    ```awk
    # 1부터 5까지 숫자 출력 (BEGIN 블록에서)
    BEGIN { i=1; while(i<=5) { print i; i++ } }
    ```

    *(쉘에서 실행 시)*

    ```bash
    awk 'BEGIN { i=1; while(i<=5) { print i; i++ } }'
    ```

  * **사용자 정의 함수 (User-Defined Functions)**:

    ```awk
    function format_size(bytes,    suffix_idx, suffixes) { # 로컬 변수는 추가 파라미터로 선언
        suffixes = "Bytes KB MB GB TB PB"
        split(suffixes, suffix_array, " ")
        suffix_idx = 1
        while (bytes >= 1024 && suffix_idx < length(suffix_array)) {
            bytes /= 1024
            suffix_idx++
        }
        return sprintf("%.2f %s", bytes, suffix_array[suffix_idx])
    }

    # 파일 크기(ls -l의 5번째 필드)를 읽기 쉽게 포맷팅 (NR > 1은 헤더 제외)
    # 쉘에서 실행하는 예시
    # ls -l | awk '
    # function format_size(bytes, suffix_idx, suffixes) {
    #     suffixes = "Bytes KB MB GB TB PB"; split(suffixes, suffix_array, " "); suffix_idx = 1
    #     while (bytes >= 1024 && suffix_idx < length(suffix_array)) { bytes /= 1024; suffix_idx++ }
    #     return sprintf("%.2f %s", bytes, suffix_array[suffix_idx])
    # }
    # NR > 1 {print $9, format_size($5)}'
    ```

    *(위 `ls -l` 예시를 쉘에서 바로 실행할 수 있는 형태로 아래에 제공)*

    ```bash
    ls -l | awk '
    function format_size(bytes,    suffix_idx, suffixes) {
        # 로컬 변수는 추가 파라미터로 선언하는 것이 좋은 습관입니다.
        # suffixes와 suffix_idx를 파라미터로 선언하여 로컬 변수처럼 사용합니다.
        # 실제 값은 함수 호출 시 전달하지 않아도 됩니다.
        suffixes = "Bytes KB MB GB TB PB"
        split(suffixes, suffix_array, " ")
        suffix_idx = 1
        while (bytes >= 1024 && suffix_idx < length(suffix_array)) {
            bytes /= 1024
            suffix_idx++
        }
        return sprintf("%.2f %s", bytes, suffix_array[suffix_idx])
    }
    NR > 1 {print $9, format_size($5)}'
    ```

## 실무 활용 예시 심층 분석

### 시스템 모니터링

1.  **메모리 사용량이 특정 임계값(예: 5.0%)을 초과하는 프로세스 찾기 (프로세스 ID, 메모리 사용률, 명령어 출력):**

    ```bash
    ps aux | awk 'NR > 1 && $4 > 5.0 {printf "PID: %s, %%MEM: %s, CMD: %s\n", $2, $4, $11}'
    # NR > 1 : 헤더 라인 제외
    # $4 > 5.0 : 4번째 필드(메모리 사용률)가 5.0보다 큰 경우
    # printf : 형식화된 출력
    ```

2.  **디스크 사용량이 90% 이상인 파티션 찾기 (파일 시스템, 사용률, 마운트 지점 출력):**

    ```bash
    df -h | awk 'NR > 1 && int($5) > 90 {print "FS:", $1, "| Usage:", $5, "| Mounted on:", $6}'
    # int($5) : % 기호를 제거하고 정수형으로 변환 (GNU awk에서는 $5+0 으로도 가능)
    # df -P | awk 'NR > 1 && $5+0 > 90 {print $1, $5, $6}' # POSIX 호환, % 자동 제거
    ```

3.  **특정 포트(예: 80)를 사용하는 네트워크 연결 상태 보기:**

    ```bash
    netstat -tulnp | grep ":80\s" | awk '{print $4, $5, $7}'
    # $4: Local Address, $5: Foreign Address, $7: PID/Program name
    ```

### 로그 분석

1.  **웹 서버 로그(common log format)에서 특정 시간대(예: 10시부터 11시 사이)의 404 에러 로그 추출 및 요청 경로 출력:**

    ```bash
    # 예: 20/Jul/2025:10:00:00 부터 20/Jul/2025:10:59:59 까지
    grep "20/Jul/2025:10:" access.log | awk '$9 == "404" {print $1, $4, $7, $9}'
    # $1: IP, $4: Timestamp, $7: Requested Path, $9: Status Code
    ```

2.  **IP 주소별 접속 횟수 계산 및 상위 10개 IP 출력:**

    ```bash
    awk '{print $1}' access.log | sort | uniq -c | sort -nr | head -n 10
    # awk '{print $1}' : 첫 번째 필드(IP 주소)만 추출
    # sort : IP 주소 정렬
    # uniq -c : 중복 제거 및 횟수 카운트
    # sort -nr : 숫자 기준 내림차순 정렬 (가장 많은 접속부터)
    # head -n 10 : 상위 10개만 출력
    ```

    *AWK 만으로도 가능:*

    ```bash
    awk '{ip_counts[$1]++} END {for (ip in ip_counts) print ip_counts[ip], ip}' access.log | sort -nr | head -n 10
    ```

3.  **SSH 로그인 실패 로그에서 시도된 사용자 이름과 IP 주소 추출:**

    ```bash
    grep "Failed password" /var/log/auth.log | awk '{print "User:", $(NF-5), "IP:", $(NF-3)}'
    # "Failed password for invalid user admin from 1.2.3.4 port 12345 ssh2" 같은 로그 형식 가정
    # $(NF-5) : 뒤에서 6번째 필드 (사용자 이름)
    # $(NF-3) : 뒤에서 4번째 필드 (IP 주소)
    # 로그 형식에 따라 필드 번호는 달라질 수 있음.
    # 예시: "Failed password for root from 116.37.102.13 port 40940 ssh2"
    # 이 경우 awk '{print "User:", $9, "IP:", $11}'
    ```

### 데이터 처리 및 변환

1.  **CSV 파일에서 특정 조건(예: 3번째 열의 값이 "Completed")을 만족하는 행의 1번째와 5번째 열을 새로운 CSV 파일로 저장:**

    ```bash
    awk -F, '$3 == "Completed" {print $1 "," $5}' input.csv > output.csv
    ```

    *또는 OFS 사용:*

    ```bash
    awk -F, 'BEGIN{OFS=","} $3 == "Completed" {print $1, $5}' input.csv > output.csv
    ```

2.  **텍스트 파일에서 모든 이메일 주소를 추출하여 한 줄에 하나씩 정렬 및 중복 제거:**

    ```bash
    grep -E -o "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b" file.txt | sort | uniq
    # grep -o : 일치하는 부분만 출력
    # \b : 단어 경계
    # [A-Za-z0-9._%+-]+ : 사용자 이름 부분
    # @ : 구분자
    # [A-Za-z0-9.-]+ : 도메인 이름 부분
    # \.[A-Za-z]{2,6} : 최상위 도메인 부분 (예: .com, .co.kr)
    ```

3.  **숫자 리스트 파일에서 각 숫자를 제곱하여 출력:**

    ```
    # numbers.txt 내용 예시:
    # 1
    # 5
    # 10
    ```

    ```bash
    awk '{print $1, "squared is", $1*$1}' numbers.txt
    ```

    *출력:*

    ```
    # 1 squared is 1
    # 5 squared is 25
    # 10 squared is 100
    ```

4.  **여러 파일의 특정 열 합계 계산 (예: 각 파일의 2번째 열 합계 및 총합):**

    ```
    # data1.txt:
    # itemA 10
    # itemB 20
    # data2.txt:
    # itemC 30
    # itemD 40
    ```

    *GNU Awk 확장 사용 시:*

    ```bash
    awk '
        { current_sum += $2 }
        ENDFILE { # GNU Awk 확장. 각 파일 처리 후 실행
            print "Sum for", FILENAME, ":", current_sum
            total_sum += current_sum
            current_sum = 0 # 다음 파일을 위해 초기화
        }
        END {
            print "Grand Total:", total_sum
        }
    ' data*.txt
    ```

    *POSIX 호환 (FNR 사용):*

    ```bash
    awk '
        FNR == 1 && NR != 1 { # 새 파일 시작 (첫 파일 제외)
            print "Sum for", prev_filename, ":", current_sum
            total_sum += current_sum
            current_sum = 0
        }
        { current_sum += $2; prev_filename = FILENAME }
        END {
            print "Sum for", prev_filename, ":", current_sum # 마지막 파일 합계
            total_sum += current_sum
            print "Grand Total:", total_sum
        }
    ' data*.txt
    ```

## Grep과 AWK의 조합

`grep`으로 1차 필터링을 하고, 그 결과를 파이프(`|`)를 통해 `awk`로 넘겨 2차 가공하는 방식은 매우 효과적입니다.

```bash
# /var/log/secure 에서 "Accepted publickey" 로그 중 사용자명과 IP 주소만 추출
grep "Accepted publickey" /var/log/secure | awk '{print "User:", $9, "IP:", $11, "Port:", $13}'

# 현재 디렉토리의 C 소스 파일(*.c)들 중에서 "include" 라는 단어를 포함하는 라인을 찾고,
# 그 라인들에서 파일명과 라인번호, 그리고 #include 뒤의 헤더 파일 이름만 추출
grep -Hn "include" *.c | awk -F'[:<>]' '{print "File: " $1 ", Line: " $2 ", Header: " $4}'
# grep -H: 파일명 출력, -n: 라인번호 출력
# awk -F'[:<>]': 콜론(:), 여는 꺽쇠(<), 닫는 꺽쇠(>)를 구분자로 사용
# 예: main.c:10:#include <stdio.h> -> $1=main.c, $2=10, $3=#include , $4=stdio.h
```

## 결론

`grep`과 `awk`는 리눅스/유닉스 환경에서 텍스트를 다루는 데 있어 스위스 군용 칼과 같은 존재입니다. `grep`은 강력한 패턴 검색 능력으로 원하는 정보를 빠르게 찾아내고, `awk`는 구조화된 데이터 처리와 리포팅에 특화되어 있습니다. 이 두 도구의 다양한 옵션과 정규표현식, 그리고 `awk`의 프로그래밍 기능을 깊이 이해하고 조합하여 사용한다면, 복잡하고 방대한 텍스트 데이터도 손쉽게 원하는 형태로 가공하고 분석할 수 있습니다.

물론 매우 복잡한 로직이나 대규모 데이터 처리에는 Python, Perl과 같은 범용 스크립팅 언어가 더 적합할 수 있지만, 대부분의 일상적인 시스템 관리, 로그 분석, 간단한 데이터 변환 작업은 `grep`과 `awk`만으로도 충분히 효율적으로 처리할 수 있습니다. 꾸준한 연습과 다양한 실제 문제에 적용해보는 것이 이 도구들을 마스터하는 가장 좋은 방법입니다.