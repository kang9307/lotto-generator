<!-- category: 프로그래밍 -->
<!-- date: 2025-06-01 -->
<!-- featured: true -->
<!-- keywords: JavaScript, 프로그래밍, 웹개발, 기초문법, programming, web development, syntax basics -->

# JavaScript 기초 문법 정리 (JavaScript Basic Syntax)

JavaScript는 웹 개발에서 가장 널리 사용되는 프로그래밍 언어입니다. 이 글에서는 JavaScript의 기본 문법과 주요 개념에 대해 설명합니다.

**English**: JavaScript is the most widely used programming language in web development. This article explains the basic syntax and key concepts of JavaScript.

## 변수 선언 (Variable Declaration)

JavaScript에서는 `var`, `let`, `const` 키워드를 사용하여 변수를 선언할 수 있습니다.

**English**: In JavaScript, you can declare variables using the keywords `var`, `let`, and `const`.

```javascript
// var (함수 스코프 - function scope)
var x = 5;

// let (블록 스코프 - block scope)
let y = 10;

// const (상수, 재할당 불가 - constant, cannot be reassigned)
const PI = 3.14;
```

## 데이터 타입 (Data Types)

JavaScript의 기본 데이터 타입은 다음과 같습니다:

**English**: JavaScript has the following basic data types:

- **String**: 문자열 (text)
- **Number**: 숫자 (numbers)
- **Boolean**: 논리값 (true/false)
- **null**: 값이 없음 (no value)
- **undefined**: 값이 할당되지 않음 (unassigned value)
- **Object**: 객체 (objects)
- **Symbol**: 고유하고 변경 불가능한 데이터 타입 (unique and immutable data type)

```javascript
let name = "홍길동";  // String
let age = 25;         // Number
let isActive = true;  // Boolean
let user = {          // Object
  name: "홍길동",
  age: 25
};
```

## 함수 (Functions)

함수는 코드의 재사용성을 높이는 중요한 개념입니다.

**English**: Functions are important concepts that enhance code reusability.

```javascript
// 함수 선언식 (Function Declaration)
function add(a, b) {
  return a + b;
}

// 함수 표현식 (Function Expression)
const multiply = function(a, b) {
  return a * b;
};

// 화살표 함수 (Arrow Function)
const divide = (a, b) => a / b;
```

## 배열과 반복문 (Arrays and Loops)

배열과 반복문을 사용하여 데이터를 효율적으로 처리할 수 있습니다.

```javascript
// 배열 선언
const fruits = ["사과", "바나나", "오렌지"];

// for 반복문
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}

// forEach 메서드
fruits.forEach(fruit => {
  console.log(fruit);
});

// map 메서드 (새로운 배열 반환)
const fruitLengths = fruits.map(fruit => fruit.length);
```

JavaScript의 기본 문법을 익히면 다양한 웹 애플리케이션을 개발할 수 있습니다. 