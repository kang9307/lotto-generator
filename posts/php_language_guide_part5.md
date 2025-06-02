<!-- title: PHP 언어 완벽 가이드 - 객체지향 프로그래밍 (PHP Object-Oriented Programming) -->
<!-- category: 프로그래밍 -->
<!-- date: 2025-06-02 -->
<!-- keywords: PHP, 웹 개발, PHP OOP, PHP 객체지향, PHP 클래스, PHP 인터페이스, PHP 추상 클래스, PHP 네임스페이스, PHP 트레이트 -->

# PHP 객체지향 프로그래밍

PHP는 PHP 5부터 본격적으로 객체지향 프로그래밍(OOP)을 지원하기 시작했으며, 이후 버전에서 계속해서 관련 기능이 개선되었습니다.

## 클래스와 객체

### 클래스 정의 및 객체 생성

```php
<?php
// 클래스 정의
class User {
    // 속성(프로퍼티)
    public $name;
    public $email;
    private $password;
    
    // 생성자
    public function __construct($name, $email, $password) {
        $this->name = $name;
        $this->email = $email;
        $this->password = $password;
    }
    
    // 메소드
    public function login() {
        return "사용자 {$this->email}이(가) 로그인했습니다.";
    }
    
    public function getInfo() {
        return "이름: {$this->name}, 이메일: {$this->email}";
    }
    
    // 비밀번호 변경 메소드 (private 속성 접근)
    public function changePassword($newPassword) {
        $this->password = $newPassword;
        return "비밀번호가 변경되었습니다.";
    }
}

// 객체 생성
$user1 = new User("홍길동", "hong@example.com", "secret123");

// 객체 메소드 호출
echo $user1->login();  // 사용자 hong@example.com이(가) 로그인했습니다.
echo $user1->getInfo();  // 이름: 홍길동, 이메일: hong@example.com

// 공개 속성 접근
echo $user1->name;  // 홍길동
$user1->name = "홍길순";
echo $user1->name;  // 홍길순

// 비공개 속성 접근 시도
// echo $user1->password;  // 오류: 비공개 속성에 접근할 수 없음
?>
```

### 접근 제어자

```php
<?php
class Product {
    public $name;        // 어디서든 접근 가능
    protected $price;    // 이 클래스와 자식 클래스에서만 접근 가능
    private $discount;   // 이 클래스 내에서만 접근 가능
    
    public function __construct($name, $price, $discount = 0) {
        $this->name = $name;
        $this->price = $price;
        $this->discount = $discount;
    }
    
    public function getFinalPrice() {
        return $this->price * (1 - $this->discount / 100);
    }
    
    protected function calculateTax($rate = 10) {
        return $this->getFinalPrice() * ($rate / 100);
    }
    
    private function applySpecialDiscount() {
        $this->discount += 5;
    }
    
    public function applyHolidayDiscount() {
        $this->applySpecialDiscount();  // 자기 자신의 private 메소드 호출 가능
        return "할인이 적용되었습니다.";
    }
}

$product = new Product("스마트폰", 1000000, 10);
echo $product->name;  // 스마트폰
echo $product->getFinalPrice();  // 900000

// 오류: protected 속성에 접근할 수 없음
// echo $product->price;

// 오류: protected 메소드에 접근할 수 없음
// $product->calculateTax();

// 오류: private 메소드에 접근할 수 없음
// $product->applySpecialDiscount();

// 공개 메소드를 통해 비공개 메소드 간접 호출
echo $product->applyHolidayDiscount();  // 할인이 적용되었습니다.
?>
```

### 상속

```php
<?php
// 부모 클래스
class Vehicle {
    protected $brand;
    protected $color;
    
    public function __construct($brand, $color) {
        $this->brand = $brand;
        $this->color = $color;
    }
    
    public function getInfo() {
        return "브랜드: {$this->brand}, 색상: {$this->color}";
    }
    
    protected function startEngine() {
        return "엔진 시동!";
    }
}

// 자식 클래스
class Car extends Vehicle {
    private $doors;
    
    public function __construct($brand, $color, $doors) {
        parent::__construct($brand, $color);  // 부모 생성자 호출
        $this->doors = $doors;
    }
    
    public function getInfo() {
        // 부모 메소드 오버라이딩 및 확장
        return parent::getInfo() . ", 문 개수: {$this->doors}";
    }
    
    public function drive() {
        $engineStatus = $this->startEngine();  // 상속받은 protected 메소드 호출
        return $engineStatus . " 자동차가 주행 중입니다.";
    }
}

$car = new Car("현대", "검정", 4);
echo $car->getInfo();  // 브랜드: 현대, 색상: 검정, 문 개수: 4
echo $car->drive();    // 엔진 시동! 자동차가 주행 중입니다.

// instanceof 연산자로 객체 타입 확인
var_dump($car instanceof Car);      // bool(true)
var_dump($car instanceof Vehicle);  // bool(true)
?>
```

### 상수

```php
<?php
class Math {
    // 클래스 상수
    const PI = 3.14159;
    const E = 2.71828;
    
    public function getCircleArea($radius) {
        return self::PI * $radius * $radius;
    }
}

// 상수 접근
echo Math::PI;  // 3.14159

$math = new Math();
echo $math->getCircleArea(5);  // 약 78.5397

// PHP 7.1+에서는 접근 제어자 지원
class Configuration {
    public const VERSION = "1.0.0";
    protected const SECRET_KEY = "abc123";
    private const API_ENDPOINT = "https://api.example.com";
    
    public function getApiUrl() {
        return self::API_ENDPOINT . "/v" . self::VERSION;
    }
}

echo Configuration::VERSION;  // 1.0.0
// echo Configuration::SECRET_KEY;  // 오류: protected 상수에 접근할 수 없음
?>
```

### 정적 멤버

```php
<?php
class Database {
    // 정적 속성
    private static $connection = null;
    private static $connectionCount = 0;
    
    // 정적 메소드
    public static function connect($host, $user, $password) {
        if (self::$connection === null) {
            // 실제로는 여기서 데이터베이스 연결을 설정
            self::$connection = "DB connected to $host as $user";
            self::$connectionCount++;
        }
        
        return self::$connection;
    }
    
    public static function getConnectionCount() {
        return self::$connectionCount;
    }
    
    // 일반 메소드
    public function query($sql) {
        if (self::$connection === null) {
            throw new Exception("먼저 연결을 설정해야 합니다.");
        }
        
        return "Query executed: $sql";
    }
}

// 정적 메소드 호출
$dbConnection = Database::connect("localhost", "root", "password");
echo $dbConnection;  // DB connected to localhost as root
echo Database::getConnectionCount();  // 1

// 일반 메소드를 사용하려면 인스턴스 필요
$db = new Database();
echo $db->query("SELECT * FROM users");  // Query executed: SELECT * FROM users
?>
```

### 추상 클래스

```php
<?php
// 추상 클래스
abstract class Shape {
    protected $color;
    
    public function __construct($color) {
        $this->color = $color;
    }
    
    // 일반 메소드
    public function getColor() {
        return $this->color;
    }
    
    // 추상 메소드 (자식 클래스에서 반드시 구현해야 함)
    abstract public function getArea();
    abstract public function getPerimeter();
}

// 구체 클래스 (추상 클래스 구현)
class Circle extends Shape {
    private $radius;
    
    public function __construct($color, $radius) {
        parent::__construct($color);
        $this->radius = $radius;
    }
    
    public function getArea() {
        return pi() * $this->radius * $this->radius;
    }
    
    public function getPerimeter() {
        return 2 * pi() * $this->radius;
    }
}

class Rectangle extends Shape {
    private $width;
    private $height;
    
    public function __construct($color, $width, $height) {
        parent::__construct($color);
        $this->width = $width;
        $this->height = $height;
    }
    
    public function getArea() {
        return $this->width * $this->height;
    }
    
    public function getPerimeter() {
        return 2 * ($this->width + $this->height);
    }
}

// 추상 클래스는 인스턴스화할 수 없음
// $shape = new Shape("빨강");  // 오류

$circle = new Circle("파랑", 5);
echo $circle->getColor();   // 파랑
echo $circle->getArea();    // 약 78.54
echo $circle->getPerimeter();  // 약 31.42

$rectangle = new Rectangle("초록", 4, 6);
echo $rectangle->getColor();  // 초록
echo $rectangle->getArea();   // 24
echo $rectangle->getPerimeter();  // 20
?>
```

### 인터페이스

```php
<?php
// 인터페이스 정의
interface Drawable {
    public function draw();
}

interface Resizable {
    public function resize($scale);
}

// 여러 인터페이스 구현
class Square implements Drawable, Resizable {
    private $size;
    
    public function __construct($size) {
        $this->size = $size;
    }
    
    public function draw() {
        return "정사각형을 그립니다. 크기: {$this->size}";
    }
    
    public function resize($scale) {
        $this->size *= $scale;
        return "크기가 {$this->size}로 조정되었습니다.";
    }
}

// 상속과 인터페이스 조합
abstract class UIElement {
    protected $id;
    
    public function __construct($id) {
        $this->id = $id;
    }
    
    abstract public function render();
}

class Button extends UIElement implements Drawable, Resizable {
    private $width;
    private $height;
    
    public function __construct($id, $width, $height) {
        parent::__construct($id);
        $this->width = $width;
        $this->height = $height;
    }
    
    public function render() {
        return "<button id='{$this->id}'>버튼</button>";
    }
    
    public function draw() {
        return "버튼을 그립니다. 크기: {$this->width}x{$this->height}";
    }
    
    public function resize($scale) {
        $this->width *= $scale;
        $this->height *= $scale;
        return "버튼 크기가 {$this->width}x{$this->height}로 조정되었습니다.";
    }
}

// 인터페이스 사용
$square = new Square(10);
echo $square->draw();    // 정사각형을 그립니다. 크기: 10
echo $square->resize(2); // 크기가 20로 조정되었습니다.

$button = new Button("submit-btn", 100, 50);
echo $button->render();  // <button id='submit-btn'>버튼</button>
echo $button->draw();    // 버튼을 그립니다. 크기: 100x50
echo $button->resize(1.5); // 버튼 크기가 150x75로 조정되었습니다.

// 타입 힌트에 인터페이스 사용
function drawElements(array $elements) {
    foreach ($elements as $element) {
        if ($element instanceof Drawable) {
            echo $element->draw() . "<br>";
        }
    }
}

drawElements([$square, $button]);
?>
```

### 트레이트 (PHP 5.4+)

```php
<?php
// 트레이트 정의
trait Logger {
    private $logCount = 0;
    
    public function log($message) {
        $this->logCount++;
        return date('Y-m-d H:i:s') . " - $message (로그 #{$this->logCount})";
    }
    
    public function getLogCount() {
        return $this->logCount;
    }
}

trait FileSystem {
    public function readFile($path) {
        return "파일 읽기: $path";
    }
    
    public function writeFile($path, $content) {
        return "파일 쓰기: $path, 내용: $content";
    }
}

// 클래스에 트레이트 사용
class User {
    use Logger;
    
    private $name;
    
    public function __construct($name) {
        $this->name = $name;
        $this->log("사용자 {$this->name} 생성됨");
    }
}

class FileManager {
    // 여러 트레이트 사용
    use Logger, FileSystem;
    
    public function copyFile($source, $destination) {
        $this->log("파일 복사: $source -> $destination");
        $content = $this->readFile($source);
        $this->writeFile($destination, $content);
        return "파일이 복사되었습니다.";
    }
}

$user = new User("홍길동");
echo $user->log("로그인 시도");  // 2025-06-05 12:34:56 - 로그인 시도 (로그 #2)
echo $user->getLogCount();  // 2

$fileManager = new FileManager();
echo $fileManager->log("파일 관리자 초기화");  // 2025-06-05 12:34:56 - 파일 관리자 초기화 (로그 #1)
echo $fileManager->copyFile("/path/to/source.txt", "/path/to/destination.txt");
?>
```

### 메소드 체이닝

```php
<?php
class Query {
    private $table;
    private $where = [];
    private $orderBy;
    private $limit;
    
    public function from($table) {
        $this->table = $table;
        return $this;  // 메소드 체이닝을 위해 $this 반환
    }
    
    public function where($column, $operator, $value) {
        $this->where[] = "$column $operator '$value'";
        return $this;
    }
    
    public function orderBy($column, $direction = 'ASC') {
        $this->orderBy = "$column $direction";
        return $this;
    }
    
    public function limit($limit) {
        $this->limit = $limit;
        return $this;
    }
    
    public function build() {
        $sql = "SELECT * FROM {$this->table}";
        
        if (!empty($this->where)) {
            $sql .= " WHERE " . implode(" AND ", $this->where);
        }
        
        if ($this->orderBy) {
            $sql .= " ORDER BY {$this->orderBy}";
        }
        
        if ($this->limit) {
            $sql .= " LIMIT {$this->limit}";
        }
        
        return $sql;
    }
}

// 메소드 체이닝 사용
$query = new Query();
$sql = $query->from('users')
             ->where('age', '>', 18)
             ->where('status', '=', 'active')
             ->orderBy('created_at', 'DESC')
             ->limit(10)
             ->build();

echo $sql;
// 출력: SELECT * FROM users WHERE age > '18' AND status = 'active' ORDER BY created_at DESC LIMIT 10
?>
```

### 매직 메소드

```php
<?php
class Person {
    private $data = [];
    
    // 매직 메소드: 설정되지 않은 속성에 접근할 때 호출
    public function __get($name) {
        if (array_key_exists($name, $this->data)) {
            return $this->data[$name];
        }
        return null;
    }
    
    // 매직 메소드: 설정되지 않은 속성에 값을 할당할 때 호출
    public function __set($name, $value) {
        $this->data[$name] = $value;
    }
    
    // 매직 메소드: isset() 함수 호출 시 호출
    public function __isset($name) {
        return isset($this->data[$name]);
    }
    
    // 매직 메소드: unset() 함수 호출 시 호출
    public function __unset($name) {
        unset($this->data[$name]);
    }
    
    // 매직 메소드: 객체를 문자열로 변환할 때 호출
    public function __toString() {
        return "Person 객체: " . json_encode($this->data);
    }
    
    // 매직 메소드: 정의되지 않은 메소드 호출 시 호출
    public function __call($name, $arguments) {
        $prefix = substr($name, 0, 3);
        if ($prefix === 'get') {
            $property = lcfirst(substr($name, 3));
            return $this->__get($property);
        } elseif ($prefix === 'set') {
            $property = lcfirst(substr($name, 3));
            $this->__set($property, $arguments[0]);
            return $this;
        }
        throw new Exception("메소드 '$name'은(는) 존재하지 않습니다.");
    }
    
    // 매직 메소드: 정의되지 않은 정적 메소드 호출 시 호출
    public static function __callStatic($name, $arguments) {
        return "정적 메소드 '$name'이(가) 호출됨";
    }
    
    // 매직 메소드: 객체가 복제될 때 호출
    public function __clone() {
        // 깊은 복사를 위한 로직
        $this->data = array_map(function($item) {
            return is_object($item) ? clone $item : $item;
        }, $this->data);
    }
    
    // 매직 메소드: serialize() 함수 호출 시 호출
    public function __sleep() {
        // 직렬화할 속성 배열 반환
        return array_keys($this->data);
    }
    
    // 매직 메소드: unserialize() 함수 호출 시 호출
    public function __wakeup() {
        // 역직렬화 후 초기화 작업
    }
}

$person = new Person();
$person->name = "홍길동";  // __set() 호출
$person->age = 25;        // __set() 호출

echo $person->name;       // __get() 호출: 홍길동
echo isset($person->name); // __isset() 호출: true

echo $person->getName();   // __call() 호출: 홍길동
$person->setEmail("hong@example.com"); // __call() 호출

echo $person;             // __toString() 호출: Person 객체: {"name":"홍길동","age":25,"email":"hong@example.com"}

unset($person->age);      // __unset() 호출

echo Person::sayHello();   // __callStatic() 호출: 정적 메소드 'sayHello'이(가) 호출됨
?> 