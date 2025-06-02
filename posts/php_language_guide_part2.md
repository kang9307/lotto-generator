<!-- title: PHP 언어 완벽 가이드 - 기초 문법과 데이터 타입 (PHP Basic Syntax and Data Types) -->
<!-- category: 프로그래밍 -->
<!-- date: 2025-06-02 -->
<!-- keywords: PHP, 웹 개발, PHP 기본 문법, PHP 변수, PHP 데이터 타입, PHP 연산자, PHP 조건문, PHP 반복문, PHP 함수 -->

# PHP 기본 문법과 데이터 타입

## PHP 기본 문법

### PHP 태그

PHP 코드는 특별한 시작 및 종료 태그로 둘러싸여 있어 PHP 엔진이 코드를 인식할 수 있습니다.

```php
<?php
  // PHP 코드 작성
?>
```

또는 짧은 에코 태그(PHP 7.0+ 기본 활성화):

```php
<?= $변수 ?>  // 이것은 <?php echo $변수; ?>와 동일
```

### 주석

PHP에서는 한 줄 주석과 여러 줄 주석을 모두 지원합니다.

```php
<?php
// 한 줄 주석

# 또 다른 한 줄 주석 스타일

/*
 여러 줄 주석
 이렇게 작성합니다
*/
?>
```

### 문장 구분자

PHP에서 각 명령문은 세미콜론(;)으로 끝나야 합니다.

```php
<?php
echo "안녕하세요";
$x = 5;
$y = 10;
$z = $x + $y;
?>
```

### PHP와 HTML 혼합 사용

PHP는 HTML 내에 쉽게 삽입할 수 있습니다.

```php
<!DOCTYPE html>
<html>
<head>
    <title>PHP 예제</title>
</head>
<body>
    <h1>안녕하세요!</h1>
    <?php
        echo "<p>오늘 날짜는: " . date("Y-m-d") . "</p>";
    ?>
    <p>이것은 HTML 내용입니다.</p>
    <p>현재 시간: <?= date("H:i:s") ?></p>
</body>
</html>
```

## 변수와 데이터 타입

### 변수 선언

PHP에서 변수는 달러 기호($)로 시작하며, 타입을 명시적으로 선언할 필요가 없습니다.

```php
<?php
$name = "홍길동";       // 문자열
$age = 25;             // 정수
$height = 175.5;       // 실수
$isStudent = true;     // 불리언
?>
```

### 변수 명명 규칙

- 변수명은 달러 기호($)로 시작해야 합니다.
- 변수명은 문자나 밑줄(_)로 시작해야 합니다.
- 변수명에는 문자, 숫자, 밑줄만 포함할 수 있습니다.
- 변수명은 대소문자를 구분합니다 ($name과 $Name은 다른 변수).

```php
<?php
$name = "유효한 변수명";
$_name = "유효한 변수명";
$name1 = "유효한 변수명";
$name_1 = "유효한 변수명";

// $1name = "잘못된 변수명";  // 숫자로 시작할 수 없음
// $name-1 = "잘못된 변수명"; // 하이픈 사용 불가
?>
```

### 변수 범위

PHP에서 변수는 세 가지 범위를 가질 수 있습니다:

1. **지역 변수**: 함수 내에서 선언된 변수로, 함수 내에서만 접근 가능합니다.
2. **전역 변수**: 함수 외부에서 선언된 변수로, 함수 내에서 `global` 키워드를 사용해 접근 가능합니다.
3. **정적 변수**: 함수 내에서 `static` 키워드로 선언된 변수로, 함수 실행이 끝나도 값이 유지됩니다.

```php
<?php
$globalVar = 10;  // 전역 변수

function testScope() {
    $localVar = 5;  // 지역 변수
    global $globalVar;  // 전역 변수 접근
    
    echo "지역 변수: $localVar<br>";
    echo "전역 변수: $globalVar<br>";
    
    static $staticVar = 0;  // 정적 변수
    $staticVar++;
    echo "정적 변수: $staticVar<br>";
}

testScope();  // 출력: 지역 변수: 5, 전역 변수: 10, 정적 변수: 1
testScope();  // 출력: 지역 변수: 5, 전역 변수: 10, 정적 변수: 2

// echo $localVar;  // 오류: 지역 변수는 함수 외부에서 접근 불가
?>
```

### 슈퍼글로벌 변수

PHP는 전역적으로 접근 가능한 내장 변수들을 제공합니다:

```php
<?php
// 슈퍼글로벌 변수 예시
echo $_SERVER['HTTP_USER_AGENT'];  // 브라우저 정보
echo $_GET['name'];                // URL 파라미터
echo $_POST['email'];              // POST 데이터
echo $_REQUEST['id'];              // GET, POST, COOKIE 데이터
echo $_SESSION['user_id'];         // 세션 데이터
echo $_COOKIE['preference'];       // 쿠키 데이터
echo $_FILES['upload'];            // 업로드된 파일 정보
echo $_ENV['HOME'];                // 환경 변수
?>
```

### 데이터 타입

PHP는 다음과 같은 기본 데이터 타입을 지원합니다:

1. **문자열(String)**
   ```php
   $name = "홍길동";
   $address = '서울시 강남구';  // 작은따옴표도 사용 가능
   ```

2. **정수(Integer)**
   ```php
   $age = 25;
   $negativeNum = -10;
   $hex = 0x1A;  // 16진수 (값: 26)
   $oct = 057;   // 8진수 (값: 47)
   $bin = 0b11;  // 2진수 (값: 3)
   ```

3. **실수(Float 또는 Double)**
   ```php
   $height = 175.5;
   $scientificNotation = 1.5e3;  // 1500
   ```

4. **불리언(Boolean)**
   ```php
   $isActive = true;
   $hasPermission = false;
   ```

5. **배열(Array)**
   ```php
   $colors = array("빨강", "녹색", "파랑");
   $colors = ["빨강", "녹색", "파랑"];  // PHP 5.4+ 단축 문법
   
   // 연관 배열
   $person = [
       "name" => "홍길동",
       "age" => 25,
       "city" => "서울"
   ];
   ```

6. **객체(Object)**
   ```php
   class Person {
       public $name;
       public $age;
       
       function __construct($name, $age) {
           $this->name = $name;
           $this->age = $age;
       }
       
       function introduce() {
           return "안녕하세요, 저는 {$this->name}이고 {$this->age}살입니다.";
       }
   }
   
   $person = new Person("홍길동", 25);
   echo $person->introduce();
   ```

7. **NULL**
   ```php
   $var = NULL;  // 값이 없음을 나타냄
   ```

8. **리소스(Resource)**
   ```php
   $file = fopen("test.txt", "r");  // 파일 리소스
   ```

### 타입 확인 및 변환

PHP에서는 변수의 타입을 확인하고 변환할 수 있는 다양한 함수를 제공합니다.

```php
<?php
$var = "42";

// 타입 확인
var_dump($var);                // string(2) "42"
echo gettype($var);            // string
echo is_string($var);          // 1 (true)
echo is_int($var);             // (빈 출력, false)

// 타입 변환
$varInt = (int)$var;           // 정수로 변환
$varFloat = (float)$var;       // 실수로 변환
$varBool = (bool)$var;         // 불리언으로 변환
$varString = (string)$varInt;  // 문자열로 변환

// 타입 확인 함수
echo is_int($varInt);          // 1 (true)
echo is_float($varFloat);      // 1 (true)
echo is_bool($varBool);        // 1 (true)
echo is_string($varString);    // 1 (true)
?>
```

### 상수

상수는 한 번 정의되면 변경할 수 없는 값입니다. 상수는 `define()` 함수나 `const` 키워드를 사용하여 정의합니다.

```php
<?php
// define() 함수 사용
define("PI", 3.14159);
define("SITE_NAME", "PHP 튜토리얼");

// const 키워드 사용 (PHP 5.3+)
const MAX_USERS = 100;
const DB_HOST = "localhost";

echo PI;           // 3.14159
echo SITE_NAME;    // PHP 튜토리얼
echo MAX_USERS;    // 100

// PI = 3.15;      // 오류: 상수는 변경할 수 없음
?>
```

### 매직 상수

PHP는 특별한 내장 상수(매직 상수)를 제공합니다:

```php
<?php
echo __LINE__;     // 현재 라인 번호
echo __FILE__;     // 현재 파일의 전체 경로와 파일명
echo __DIR__;      // 현재 파일의 디렉토리
echo __FUNCTION__; // 현재 함수 이름
echo __CLASS__;    // 현재 클래스 이름
echo __METHOD__;   // 현재 클래스의 메소드 이름
echo __NAMESPACE__; // 현재 네임스페이스 이름
?>
``` 