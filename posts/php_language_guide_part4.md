<!-- title: PHP 언어 완벽 가이드 - 함수와 배열 (PHP Functions and Arrays) -->
<!-- category: 프로그래밍 -->
<!-- date: 2025-06-05 -->
<!-- keywords: PHP, 웹 개발, PHP 함수, PHP 배열, PHP 문자열, PHP 매개변수, PHP 반환값, PHP 함수 참조 -->

# PHP 함수와 배열

## 함수

함수는 특정 작업을 수행하는 코드 블록으로, 재사용성과 모듈화를 위해 사용됩니다.

### 함수 정의와 호출

```php
<?php
// 기본 함수 정의
function sayHello() {
    echo "안녕하세요!";
}

// 함수 호출
sayHello();  // 출력: 안녕하세요!

// 매개변수가 있는 함수
function greet($name) {
    echo "안녕하세요, $name님!";
}

greet("홍길동");  // 출력: 안녕하세요, 홍길동님!

// 기본값이 있는 매개변수
function greetWithTitle($name, $title = "님") {
    echo "안녕하세요, $name$title!";
}

greetWithTitle("홍길동");  // 출력: 안녕하세요, 홍길동님!
greetWithTitle("김교수", "교수님");  // 출력: 안녕하세요, 김교수교수님!

// 반환값이 있는 함수
function add($a, $b) {
    return $a + $b;
}

$result = add(5, 3);  // $result = 8
echo $result;
?>
```

### 함수 매개변수

```php
<?php
// 기본 매개변수
function showProfile($name, $age, $city) {
    echo "$name은(는) $age세이고 $city에 살고 있습니다.";
}

showProfile("홍길동", 25, "서울");

// 기본값이 있는 매개변수
function setConfig($host, $user = "admin", $port = 3306) {
    echo "호스트: $host, 사용자: $user, 포트: $port";
}

setConfig("localhost");  // 호스트: localhost, 사용자: admin, 포트: 3306
setConfig("example.com", "user1");  // 호스트: example.com, 사용자: user1, 포트: 3306
setConfig("example.org", "user2", 8080);  // 호스트: example.org, 사용자: user2, 포트: 8080

// 가변 길이 인수 (PHP 5.6+)
function sum(...$numbers) {
    $total = 0;
    foreach ($numbers as $number) {
        $total += $number;
    }
    return $total;
}

echo sum(1, 2, 3, 4, 5);  // 15

// 배열 전개 연산자 (PHP 5.6+)
$values = [1, 2, 3];
echo sum(...$values);  // 6
?>
```

### 참조에 의한 전달

```php
<?php
// 값에 의한 전달 (기본)
function incrementValue($value) {
    $value++;
    echo "함수 내부: $value<br>";
}

$a = 5;
incrementValue($a);  // 함수 내부: 6
echo "함수 외부: $a<br>";  // 함수 외부: 5 (값이 변경되지 않음)

// 참조에 의한 전달
function incrementReference(&$value) {
    $value++;
    echo "함수 내부: $value<br>";
}

$b = 5;
incrementReference($b);  // 함수 내부: 6
echo "함수 외부: $b<br>";  // 함수 외부: 6 (값이 변경됨)
?>
```

### 타입 선언 (PHP 7+)

```php
<?php
// 매개변수 타입 선언
function multiply(int $a, int $b) {
    return $a * $b;
}

echo multiply(5, 3);  // 15
// echo multiply("5", "3");  // PHP 7 이전: 15, PHP 7 이후: 15 (자동 형변환) 
// PHP 7의 strict 모드에서는 TypeError 발생

// 반환 타입 선언 (PHP 7+)
function divide(float $a, float $b): float {
    return $a / $b;
}

echo divide(10, 3);  // 3.3333333333333

// 유니온 타입 (PHP 8+)
function processId(int|string $id): void {
    echo "처리 중인 ID: $id";
}

processId(123);  // 처리 중인 ID: 123
processId("ABC123");  // 처리 중인 ID: ABC123

// 널러블 타입 (PHP 7.1+)
function findUser(?string $username): ?array {
    if ($username === null) {
        return null;
    }
    // 사용자 검색 로직...
    return ["name" => $username, "active" => true];
}

var_dump(findUser(null));  // NULL
var_dump(findUser("admin"));  // ["name" => "admin", "active" => true]
?>
```

### 가변 함수

```php
<?php
function sayHello() {
    echo "안녕하세요!";
}

function sayGoodbye() {
    echo "안녕히 가세요!";
}

$functionName = "sayHello";
$functionName();  // 안녕하세요!

$functionName = "sayGoodbye";
$functionName();  // 안녕히 가세요!

// 내장 함수에도 적용 가능
$arrayFunction = "array_sum";
echo $arrayFunction([1, 2, 3, 4, 5]);  // 15
?>
```

### 익명 함수와 클로저

```php
<?php
// 익명 함수
$greet = function($name) {
    return "안녕하세요, $name님!";
};

echo $greet("홍길동");  // 안녕하세요, 홍길동님!

// 클로저 (외부 변수 사용)
$greeting = "안녕하세요";
$greet = function($name) use ($greeting) {
    return "$greeting, $name님!";
};

echo $greet("홍길동");  // 안녕하세요, 홍길동님!

// 참조로 외부 변수 사용
$counter = 0;
$increment = function() use (&$counter) {
    $counter++;
    return $counter;
};

echo $increment();  // 1
echo $increment();  // 2
echo $counter;      // 2

// 콜백 함수
$numbers = [1, 2, 3, 4, 5];
$doubled = array_map(function($n) {
    return $n * 2;
}, $numbers);
print_r($doubled);  // [2, 4, 6, 8, 10]
?>
```

### 화살표 함수 (PHP 7.4+)

```php
<?php
// 기존 익명 함수
$add = function($a, $b) {
    return $a + $b;
};

// 화살표 함수
$add = fn($a, $b) => $a + $b;

echo $add(5, 3);  // 8

// 외부 변수 자동 캡처
$multiplier = 2;
$multiply = fn($n) => $n * $multiplier;

echo $multiply(5);  // 10

// 중첩 화살표 함수
$addAndMultiply = fn($a, $b) => fn($c) => ($a + $b) * $c;

$step1 = $addAndMultiply(2, 3);  // fn($c) => (2 + 3) * $c
echo $step1(4);  // 20 ((2 + 3) * 4)
?>
```

### 재귀 함수

```php
<?php
// 팩토리얼 계산
function factorial($n) {
    if ($n <= 1) {
        return 1;
    } else {
        return $n * factorial($n - 1);
    }
}

echo factorial(5);  // 120 (5 * 4 * 3 * 2 * 1)

// 피보나치 수열
function fibonacci($n) {
    if ($n <= 1) {
        return $n;
    } else {
        return fibonacci($n - 1) + fibonacci($n - 2);
    }
}

echo fibonacci(10);  // 55

// 디렉토리 순회
function listFiles($dir) {
    $files = [];
    
    if (is_dir($dir)) {
        $items = scandir($dir);
        
        foreach ($items as $item) {
            if ($item != "." && $item != "..") {
                $path = $dir . "/" . $item;
                
                if (is_dir($path)) {
                    $files = array_merge($files, listFiles($path));
                } else {
                    $files[] = $path;
                }
            }
        }
    }
    
    return $files;
}

// 주의: 깊은 재귀는 스택 오버플로우를 일으킬 수 있음
?>
```

### 가변 스코프와 정적 변수

```php
<?php
$globalVar = "전역 변수";

function testScope() {
    $localVar = "지역 변수";
    
    echo $localVar;  // 지역 변수
    // echo $globalVar;  // 오류: 정의되지 않은 변수
    
    global $globalVar;  // 전역 변수 접근
    echo $globalVar;    // 전역 변수
    
    // 정적 변수
    static $counter = 0;
    $counter++;
    echo "카운터: $counter";
}

testScope();  // 지역 변수, 전역 변수, 카운터: 1
testScope();  // 지역 변수, 전역 변수, 카운터: 2

// 슈퍼글로벌 변수는 함수 내에서 항상 접근 가능
function showGlobals() {
    echo $_SERVER['PHP_SELF'];  // 슈퍼글로벌 변수는 global 키워드 없이 접근 가능
}
?>
```

## 배열

배열은 PHP에서 가장 유용한 복합 데이터 타입 중 하나로, 여러 값을 하나의 변수에 저장할 수 있습니다.

### 배열 생성 및 접근

```php
<?php
// 인덱스 배열 생성
$fruits = array("사과", "바나나", "오렌지");
$colors = ["빨강", "녹색", "파랑"];  // PHP 5.4+ 단축 문법

// 배열 요소 접근
echo $fruits[0];  // 사과
echo $colors[1];  // 녹색

// 배열 요소 수정
$fruits[1] = "키위";
echo $fruits[1];  // 키위

// 배열 요소 추가
$fruits[] = "망고";  // 배열 끝에 추가
print_r($fruits);  // Array ([0] => 사과 [1] => 키위 [2] => 오렌지 [3] => 망고)

// 연관 배열 생성
$person = array(
    "name" => "홍길동",
    "age" => 25,
    "city" => "서울"
);

$car = [
    "brand" => "현대",
    "model" => "소나타",
    "year" => 2023
];

// 연관 배열 접근
echo $person["name"];  // 홍길동
echo $car["model"];    // 소나타

// 연관 배열 요소 수정
$person["age"] = 26;

// 연관 배열 요소 추가
$person["email"] = "hong@example.com";
?>
```

### 다차원 배열

```php
<?php
// 2차원 배열
$matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

echo $matrix[1][2];  // 6

// 연관 다차원 배열
$users = [
    "user1" => [
        "name" => "홍길동",
        "age" => 25,
        "roles" => ["admin", "editor"]
    ],
    "user2" => [
        "name" => "김철수",
        "age" => 30,
        "roles" => ["user"]
    ]
];

echo $users["user1"]["name"];         // 홍길동
echo $users["user2"]["roles"][0];     // user

// 더 복잡한 중첩 배열
$company = [
    "name" => "ABC 주식회사",
    "departments" => [
        "개발" => [
            "employees" => [
                ["name" => "홍길동", "position" => "팀장"],
                ["name" => "김철수", "position" => "개발자"]
            ],
            "projects" => ["웹사이트", "모바일 앱"]
        ],
        "마케팅" => [
            "employees" => [
                ["name" => "이영희", "position" => "팀장"],
                ["name" => "박민수", "position" => "디자이너"]
            ],
            "campaigns" => ["여름 세일", "신제품 출시"]
        ]
    ]
];

echo $company["departments"]["개발"]["employees"][1]["name"];  // 김철수
?>
```

### 배열 반복

```php
<?php
$fruits = ["사과", "바나나", "오렌지", "키위"];

// for 반복문
for ($i = 0; $i < count($fruits); $i++) {
    echo $fruits[$i] . "<br>";
}

// foreach 반복문 (값만)
foreach ($fruits as $fruit) {
    echo $fruit . "<br>";
}

// foreach 반복문 (인덱스와 값)
foreach ($fruits as $index => $fruit) {
    echo "$index: $fruit<br>";
}

// 연관 배열 반복
$person = [
    "name" => "홍길동",
    "age" => 25,
    "city" => "서울"
];

foreach ($person as $key => $value) {
    echo "$key: $value<br>";
}

// 다차원 배열 반복
$users = [
    ["name" => "홍길동", "age" => 25],
    ["name" => "김철수", "age" => 30],
    ["name" => "이영희", "age" => 28]
];

foreach ($users as $user) {
    echo "이름: " . $user["name"] . ", 나이: " . $user["age"] . "<br>";
}

// 중첩 foreach
foreach ($users as $index => $user) {
    echo "사용자 " . ($index + 1) . ":<br>";
    foreach ($user as $key => $value) {
        echo "  $key: $value<br>";
    }
}
?>
```

### 배열 함수

```php
<?php
$numbers = [5, 3, 8, 1, 2];
$fruits = ["사과", "바나나", "오렌지"];

// 배열 정보
echo count($numbers);           // 5 (배열 길이)
echo sizeof($numbers);          // 5 (count와 동일)
var_dump(empty($numbers));      // bool(false) (배열이 비어있는지 확인)
var_dump(isset($numbers[1]));   // bool(true) (배열 요소가 존재하는지 확인)
var_dump(in_array(3, $numbers)); // bool(true) (값이 배열에 있는지 확인)
echo array_search("바나나", $fruits); // 1 (값의 인덱스/키 찾기)

// 배열 조작
$combined = array_merge($numbers, $fruits);  // 배열 합치기
$sliced = array_slice($numbers, 1, 3);       // 부분 배열 [3, 8, 1]
array_push($fruits, "키위", "망고");         // 끝에 요소 추가
$lastFruit = array_pop($fruits);            // 마지막 요소 제거 및 반환 ("망고")
array_unshift($fruits, "수박");             // 처음에 요소 추가
$firstFruit = array_shift($fruits);         // 첫 번째 요소 제거 및 반환 ("수박")

// 배열 변환
$doubled = array_map(function($n) {          // 각 요소에 함수 적용
    return $n * 2;
}, $numbers);

$filtered = array_filter($numbers, function($n) {  // 조건에 맞는 요소만 필터링
    return $n > 3;
});

$sum = array_reduce($numbers, function($carry, $n) {  // 배열을 단일 값으로 줄이기
    return $carry + $n;
}, 0);

// 정렬
sort($numbers);                // 값으로 정렬 (인덱스 재설정)
rsort($numbers);               // 값으로 역순 정렬
asort($person);                // 값으로 정렬 (키 유지)
arsort($person);               // 값으로 역순 정렬 (키 유지)
ksort($person);                // 키로 정렬
krsort($person);               // 키로 역순 정렬

// 사용자 정의 정렬
usort($users, function($a, $b) {  // 값으로 사용자 정의 정렬
    return $a["age"] <=> $b["age"];  // 나이로 정렬
});

// 배열 키와 값
$keys = array_keys($person);    // 키만 추출
$values = array_values($person); // 값만 추출
$flipped = array_flip($person);  // 키와 값 교체

// 배열 채우기
$filled = array_fill(0, 5, "값");  // 0부터 시작해 5개의 요소를 "값"으로 채움
$range = range(1, 10, 2);  // 1부터 10까지 2씩 증가하는 배열 [1, 3, 5, 7, 9]

// 배열 교차와 차집합
$array1 = [1, 2, 3, 4, 5];
$array2 = [3, 4, 5, 6, 7];
$intersection = array_intersect($array1, $array2);  // 교집합 [3, 4, 5]
$difference = array_diff($array1, $array2);        // 차집합 [1, 2]
?>
```

### 배열 구조 분해 (PHP 7.1+)

```php
<?php
// 리스트 구조 분해
$info = ["홍길동", 25, "서울"];
[$name, $age, $city] = $info;

echo $name;  // 홍길동
echo $age;   // 25
echo $city;  // 서울

// 일부 요소만 구조 분해
[, $age,] = $info;  // 두 번째 요소만 가져오기
echo $age;  // 25

// 키가 있는 배열 구조 분해 (PHP 7.1+)
$data = ["name" => "홍길동", "age" => 25, "city" => "서울"];
["name" => $n, "age" => $a] = $data;

echo $n;  // 홍길동
echo $a;  // 25

// 중첩 배열 구조 분해
$user = [
    "홍길동",
    ["서울", "강남구"],
    ["PHP", "JavaScript", "Python"]
];

[$username, [$city, $district], $languages] = $user;
echo $username;  // 홍길동
echo $city;      // 서울
echo $district;  // 강남구
echo $languages[0];  // PHP
?>
```

### 배열 스프레드 (PHP 7.4+)

```php
<?php
$fruits1 = ["사과", "바나나"];
$fruits2 = ["오렌지", "키위"];

// PHP 7.4+ 스프레드 연산자
$allFruits = [...$fruits1, ...$fruits2];
// ["사과", "바나나", "오렌지", "키위"]

// 중간에 다른 요소 추가
$combined = [...$fruits1, "망고", ...$fruits2];
// ["사과", "바나나", "망고", "오렌지", "키위"]

// 연관 배열 스프레드
$defaults = ["host" => "localhost", "port" => 3306, "user" => "root"];
$custom = ["user" => "admin", "password" => "secret"];

$config = [...$defaults, ...$custom];
// ["host" => "localhost", "port" => 3306, "user" => "admin", "password" => "secret"]
// 중복 키는 마지막 값으로 덮어씀
?>
``` 