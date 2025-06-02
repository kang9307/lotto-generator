<!-- title: PHP 언어 완벽 가이드 - 연산자와 제어 구조 (PHP Operators and Control Structures) -->
<!-- category: 프로그래밍 -->
<!-- date: 2025-06-02 -->
<!-- keywords: PHP, 웹 개발, PHP 연산자, PHP 조건문, PHP 반복문, PHP 제어 구조, PHP 문법, PHP switch, PHP if else -->

# PHP 연산자와 제어 구조

## 연산자

PHP는 다양한 연산자를 제공하여 변수와 값을 조작할 수 있습니다.

### 산술 연산자

```php
<?php
$a = 10;
$b = 3;

echo $a + $b;  // 덧셈: 13
echo $a - $b;  // 뺄셈: 7
echo $a * $b;  // 곱셈: 30
echo $a / $b;  // 나눗셈: 3.3333...
echo $a % $b;  // 나머지: 1
echo $a ** $b; // 거듭제곱: 1000 (PHP 5.6+)
?>
```

### 할당 연산자

```php
<?php
$a = 10;      // 기본 할당
$a += 5;      // $a = $a + 5와 동일 (결과: 15)
$a -= 3;      // $a = $a - 3와 동일 (결과: 12)
$a *= 2;      // $a = $a * 2와 동일 (결과: 24)
$a /= 4;      // $a = $a / 4와 동일 (결과: 6)
$a %= 4;      // $a = $a % 4와 동일 (결과: 2)
$a **= 3;     // $a = $a ** 3와 동일 (결과: 8)
?>
```

### 문자열 연산자

```php
<?php
$a = "안녕";
$b = "하세요";

$c = $a . $b;        // 문자열 연결: "안녕하세요"
$a .= $b;            // $a = $a . $b와 동일: "안녕하세요"
?>
```

### 비교 연산자

```php
<?php
$a = 10;
$b = 5;
$c = "10";

var_dump($a == $c);   // 느슨한 비교 (값만 비교): bool(true)
var_dump($a === $c);  // 엄격한 비교 (값과 타입 모두 비교): bool(false)
var_dump($a != $b);   // 느슨한 비교 (값이 다름): bool(true)
var_dump($a !== $c);  // 엄격한 비교 (값이나 타입이 다름): bool(true)
var_dump($a < $b);    // less than: bool(false)
var_dump($a > $b);    // greater than: bool(true)
var_dump($a <= $b);   // less than or equal to: bool(false)
var_dump($a >= $b);   // greater than or equal to: bool(true)
var_dump($a <=> $b);  // 우주선 연산자 (PHP 7+): int(1)
                      // $a가 $b보다 크면 1, 같으면 0, 작으면 -1 반환
?>
```

### 증감 연산자

```php
<?php
$a = 5;

echo $a++;  // 후위 증가: 출력 5, 그 후 $a는 6
echo ++$a;  // 전위 증가: $a를 7로 증가 후 출력 7
echo $a--;  // 후위 감소: 출력 7, 그 후 $a는 6
echo --$a;  // 전위 감소: $a를 5로 감소 후 출력 5
?>
```

### 논리 연산자

```php
<?php
$a = true;
$b = false;

var_dump($a && $b);  // AND: bool(false)
var_dump($a || $b);  // OR: bool(true)
var_dump($a and $b); // AND(낮은 우선순위): bool(false)
var_dump($a or $b);  // OR(낮은 우선순위): bool(true)
var_dump(!$a);       // NOT: bool(false)
var_dump($a xor $b); // XOR(배타적 OR): bool(true)
?>
```

### 비트 연산자

```php
<?php
$a = 5;     // 2진수: 101
$b = 3;     // 2진수: 011

echo $a & $b;   // 비트 AND: 1 (2진수: 001)
echo $a | $b;   // 비트 OR: 7 (2진수: 111)
echo $a ^ $b;   // 비트 XOR: 6 (2진수: 110)
echo ~$a;       // 비트 NOT: -6 (2진수: ...11010)
echo $a << 1;   // 왼쪽 시프트: 10 (2진수: 1010)
echo $a >> 1;   // 오른쪽 시프트: 2 (2진수: 10)
?>
```

### 배열 연산자

```php
<?php
$a = ["name" => "홍길동", "age" => 25];
$b = ["name" => "김철수", "city" => "서울"];

$c = $a + $b;  // 합집합: ["name" => "홍길동", "age" => 25, "city" => "서울"]
                // 키가 같은 경우 첫 번째 배열의 값을 유지

var_dump($a == $b);   // 같은 키/값 쌍이 있는지 확인: bool(false)
var_dump($a === $b);  // 키/값 쌍과 순서, 타입이 같은지 확인: bool(false)
var_dump($a != $b);   // 다른 키/값 쌍이 있는지 확인: bool(true)
var_dump($a <> $b);   // $a != $b와 동일: bool(true)
var_dump($a !== $b);  // 키/값 쌍, 순서, 타입 중 하나라도 다른지 확인: bool(true)
?>
```

### 삼항 연산자

```php
<?php
$age = 20;
$status = ($age >= 18) ? "성인" : "미성년자";  // 성인

// 중첩 삼항 연산자
$age = 65;
$category = ($age < 18) ? "미성년자" : (($age < 65) ? "성인" : "노인");  // 노인

// Null 병합 연산자 (PHP 7+)
$username = $_GET["user"] ?? "게스트";  // $_GET["user"]가 null이면 "게스트" 할당
?>
```

### 형변환 연산자

```php
<?php
$str = "42";
$num = (int)$str;    // 문자열을 정수로 변환: 42
$float = (float)$str;  // 문자열을 실수로 변환: 42.0
$bool = (bool)$str;    // 문자열을 불리언으로 변환: true
$array = (array)$str;  // 문자열을 배열로 변환: ["42"]
$obj = (object)["name" => "홍길동"];  // 배열을 객체로 변환
?>
```

### 연산자 우선순위

PHP 연산자는 우선순위가 있으며, 괄호를 사용하여 우선순위를 명시적으로 지정할 수 있습니다.

```php
<?php
$result = 5 + 3 * 2;        // 11 (곱셈이 먼저 수행됨)
$result = (5 + 3) * 2;      // 16 (괄호 안의 연산이 먼저 수행됨)
$result = 5 + 3 * 2 - 4 / 2; // 9 (5 + 6 - 2 = 9)
?>
```

## 조건문

### if 문

```php
<?php
$age = 18;

if ($age >= 18) {
    echo "성인입니다.";
}

// 중괄호는 명령문이 한 줄일 경우 생략 가능
if ($age >= 18)
    echo "성인입니다.";
?>
```

### if-else 문

```php
<?php
$age = 16;

if ($age >= 18) {
    echo "성인입니다.";
} else {
    echo "미성년자입니다.";
}
?>
```

### if-elseif-else 문

```php
<?php
$score = 85;

if ($score >= 90) {
    echo "A 학점";
} elseif ($score >= 80) {
    echo "B 학점";
} elseif ($score >= 70) {
    echo "C 학점";
} elseif ($score >= 60) {
    echo "D 학점";
} else {
    echo "F 학점";
}
?>
```

### switch 문

```php
<?php
$day = 3;

switch ($day) {
    case 1:
        echo "월요일";
        break;
    case 2:
        echo "화요일";
        break;
    case 3:
        echo "수요일";
        break;
    case 4:
        echo "목요일";
        break;
    case 5:
        echo "금요일";
        break;
    case 6:
    case 7:
        echo "주말";
        break;
    default:
        echo "잘못된 날짜";
}
?>
```

### match 표현식 (PHP 8.0+)

```php
<?php
$day = 3;

$dayName = match($day) {
    1 => "월요일",
    2 => "화요일",
    3 => "수요일",
    4 => "목요일",
    5 => "금요일",
    6, 7 => "주말",
    default => "잘못된 날짜"
};

echo $dayName;  // 수요일
?>
```

### 삼항 연산자를 이용한 조건 표현

```php
<?php
$age = 20;
$status = ($age >= 18) ? "성인" : "미성년자";
echo $status;  // 성인
?>
```

### Null 병합 연산자 (PHP 7+)

```php
<?php
// isset($_GET["user"]) ? $_GET["user"] : "게스트"와 동일
$username = $_GET["user"] ?? "게스트";

// 여러 변수 체크
$name = $firstName ?? $lastName ?? "이름 없음";
?>
```

### Null 안전 연산자 (PHP 8+)

```php
<?php
$user = null;
$name = $user?->name;  // $user가 null이면 $name도 null, 오류 발생하지 않음

$users = null;
$firstUserName = $users[0]?->name;  // null, 오류 발생하지 않음

$callback = null;
$result = $callback?->call();  // null, 오류 발생하지 않음
?>
```

## 반복문

### for 문

```php
<?php
for ($i = 0; $i < 5; $i++) {
    echo "번호: $i<br>";
}
?>
```

### while 문

```php
<?php
$i = 0;
while ($i < 5) {
    echo "번호: $i<br>";
    $i++;
}
?>
```

### do-while 문

```php
<?php
$i = 0;
do {
    echo "번호: $i<br>";
    $i++;
} while ($i < 5);
?>
```

### foreach 문

```php
<?php
$colors = ["빨강", "녹색", "파랑"];

// 값만 사용
foreach ($colors as $color) {
    echo "$color<br>";
}

// 키와 값 모두 사용
$person = [
    "name" => "홍길동",
    "age" => 25,
    "city" => "서울"
];

foreach ($person as $key => $value) {
    echo "$key: $value<br>";
}
?>
```

### break와 continue

```php
<?php
// break 예제
for ($i = 0; $i < 10; $i++) {
    if ($i == 5) {
        break;  // 반복문 종료
    }
    echo $i;  // 0, 1, 2, 3, 4만 출력
}

// continue 예제
for ($i = 0; $i < 10; $i++) {
    if ($i % 2 == 0) {
        continue;  // 현재 반복 건너뛰기
    }
    echo $i;  // 1, 3, 5, 7, 9만 출력
}
?>
```

### 다중 반복문

```php
<?php
// 구구단 출력
for ($i = 2; $i <= 9; $i++) {
    echo "$i단<br>";
    for ($j = 1; $j <= 9; $j++) {
        echo "$i × $j = " . ($i * $j) . "<br>";
    }
    echo "<br>";
}
?>
```

### 반복문 레이블과 중첩 제어

```php
<?php
outer: for ($i = 0; $i < 5; $i++) {
    for ($j = 0; $j < 5; $j++) {
        if ($i * $j > 10) {
            break outer;  // 바깥쪽 반복문까지 종료
        }
        echo "($i, $j) = " . ($i * $j) . "<br>";
    }
}
?>
```

## 기타 제어 구조

### require와 include

```php
<?php
// 파일이 없으면 치명적 오류 발생 (스크립트 중단)
require 'header.php';

// 파일이 없으면 경고만 발생 (스크립트 계속 실행)
include 'sidebar.php';

// 파일이 이미 포함되었더라도 다시 포함
require 'config.php';
require 'config.php';  // 두 번 실행

// 파일이 이미 포함되었으면 다시 포함하지 않음
require_once 'functions.php';
require_once 'functions.php';  // 한 번만 실행

include_once 'footer.php';
include_once 'footer.php';  // 한 번만 실행
?>
```

### goto (PHP 5.3+)

```php
<?php
goto a;
echo "이 줄은 실행되지 않습니다.";

a:
echo "goto 문을 사용해 여기로 건너뛰었습니다.";

// 반복문에서 사용 예제
for ($i = 0; $i < 10; $i++) {
    if ($i == 5) {
        goto end;
    }
}

end:
echo "반복문을 건너뛰었습니다.";
?>
```

### 클로저와 익명 함수

```php
<?php
// 익명 함수를 변수에 할당
$greet = function($name) {
    return "안녕하세요, $name님!";
};

echo $greet("홍길동");  // 안녕하세요, 홍길동님!

// 클로저(외부 변수를 사용하는 익명 함수)
$message = "반갑습니다";
$greet = function($name) use ($message) {
    return "$message, $name님!";
};

echo $greet("홍길동");  // 반갑습니다, 홍길동님!

// 배열 함수에서 사용
$numbers = [1, 2, 3, 4, 5];
$doubled = array_map(function($n) {
    return $n * 2;
}, $numbers);  // [2, 4, 6, 8, 10]
?>
```

### 화살표 함수 (PHP 7.4+)

```php
<?php
// 기존의 익명 함수
$double = function($n) {
    return $n * 2;
};

// 화살표 함수
$double = fn($n) => $n * 2;

// 화살표 함수는 자동으로 외부 변수를 캡처
$factor = 3;
$triple = fn($n) => $n * $factor;

// 배열 함수에서 사용
$numbers = [1, 2, 3, 4, 5];
$squared = array_map(fn($n) => $n ** 2, $numbers);  // [1, 4, 9, 16, 25]
?>
``` 