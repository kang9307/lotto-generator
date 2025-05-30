/**
 * 로또 번호 생성기 (Lotto Number Generator)
 * Copyright (c) 2023-2025 lotto.rewrite.kr
 * All rights reserved.
 * 
 * 사유 라이센스 (Proprietary License):
 * 이 소프트웨어는 lotto.rewrite.kr의 독점 소유물입니다.
 * 저작권자의 명시적인 서면 허가 없이 이 소프트웨어의 전체 또는 일부를
 * 복제, 수정, 배포하거나 파생 작업을 생성하는 것을 금지합니다.
 * 
 * 이 코드의 무단 복제 및 재배포를 금지합니다.
 * Unauthorized copying or redistribution of this code is prohibited.
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소 가져오기
    const generateBtn = document.getElementById('generate-btn');
    const printBtn = document.getElementById('print-btn');
    const gameCountSelect = document.getElementById('game-count');
    const resultsContainer = document.getElementById('results');
    const showPaperCheckbox = document.getElementById('show-paper');
    const lottoPaper = document.getElementById('lotto-paper');
    const issueDate = document.getElementById('issue-date');
    
    // 로또 용지의 행 ID
    const paperRowIds = ['paper-row-A', 'paper-row-B', 'paper-row-C', 'paper-row-D', 'paper-row-E'];
    const paperRowCopyIds = ['paper-row-A-copy', 'paper-row-B-copy', 'paper-row-C-copy', 'paper-row-D-copy', 'paper-row-E-copy'];
    
    // 오늘 날짜를 표시
    const today = new Date();
    const formattedDate = `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    issueDate.textContent = formattedDate;
    
    // 로또 용지 체크박스 이벤트
    showPaperCheckbox.addEventListener('change', function() {
        lottoPaper.style.display = this.checked ? 'flex' : 'none';
        
        // 체크박스가 체크되면 로또 용지 초기화 및 마킹
        if (this.checked) {
            initLottoPaper();
            markLottoPaper();
        }
    });
    
    // 버튼에 클릭 이벤트 추가
    generateBtn.addEventListener('click', generateLottoNumbers);
    
    // 인쇄 버튼 이벤트
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    // 로또 번호 생성 함수
    function generateLottoNumbers() {
        // 게임 수 가져오기
        let gameCount = parseInt(gameCountSelect.value);
        
        // 결과 컨테이너 초기화
        resultsContainer.innerHTML = '';
        
        // 각 게임마다 번호 생성
        for (let i = 0; i < gameCount; i++) {
            const numbers = generateRandomNumbers();
            displayNumbers(numbers, i + 1);
        }
        
        // 로또 용지가 표시 중이면 마킹
        if (showPaperCheckbox.checked) {
            markLottoPaper();
        }
    }
    
    // 개선된 랜덤 번호 생성 함수
    function generateRandomNumbers() {
        // 1부터 45까지의 숫자 중 중복 없이 6개 선택
        const numbers = [];
        let attempts = 0;
        const maxAttempts = 100; // 무한 루프 방지
        
        while (numbers.length < 6 && attempts < maxAttempts) {
            attempts++;
            const randomNum = Math.floor(Math.random() * 45) + 1;
            
            // 이미 선택된 번호인 경우 건너뛰기
            if (numbers.includes(randomNum)) {
                continue;
            }
            
            // 연속된 번호 확인 및 제한
            let hasConsecutive = false;
            
            // 연속된 앞/뒤 번호가 있는지 확인
            if (numbers.includes(randomNum - 1) && numbers.includes(randomNum + 1)) {
                // 두 개의 연속된 번호 사이에 위치한 경우 (예: 이미 10, 12가 있을 때 11이 나온 경우)
                hasConsecutive = true;
            } else if (numbers.includes(randomNum - 1) || numbers.includes(randomNum + 1)) {
                // 하나의 연속된 번호가 있는 경우 (예: 이미 10이 있을 때 11이 나온 경우)
                // 이미 연속된 번호 쌍이 있는지 확인
                for (let i = 0; i < numbers.length - 1; i++) {
                    if (numbers[i] + 1 === numbers[i + 1]) {
                        // 이미 연속된 번호 쌍이 있으면 연속 번호 추가 제한
                        hasConsecutive = true;
                        break;
                    }
                }
            }
            
            // 연속된 번호 3개 이상 방지 (70% 확률로 거부)
            if (hasConsecutive && Math.random() < 0.7) {
                continue; // 70% 확률로 연속된 번호 추가 거부
            }
            
            // 최종적으로 번호 추가
            numbers.push(randomNum);
        }
        
        // 번호가 6개 미만인 경우 (거의 일어나지 않음) 나머지 무작위로 채우기
        while (numbers.length < 6) {
            const randomNum = Math.floor(Math.random() * 45) + 1;
            if (!numbers.includes(randomNum)) {
                numbers.push(randomNum);
            }
        }
        
        // 오름차순 정렬
        return numbers.sort((a, b) => a - b);
    }
    
    // 번호 표시 함수
    function displayNumbers(numbers, gameNumber) {
        // 게임 결과를 담을 div 생성
        const gameDiv = document.createElement('div');
        gameDiv.classList.add('game');
        
        // 게임 번호 표시
        const gameTitle = document.createElement('div');
        gameTitle.classList.add('game-title');
        gameTitle.textContent = `게임 ${gameNumber}`;
        gameDiv.appendChild(gameTitle);
        
        // 번호들을 담을 div 생성
        const numbersDiv = document.createElement('div');
        numbersDiv.classList.add('numbers');
        
        // 각 번호를 span으로 생성하고 색상 적용
        numbers.forEach(num => {
            const numberSpan = document.createElement('span');
            numberSpan.classList.add('number');
            numberSpan.textContent = num;
            
            // 번호 범위에 따라 색상 클래스 추가
            if (num >= 1 && num <= 10) {
                numberSpan.classList.add('yellow');
            } else if (num >= 11 && num <= 20) {
                numberSpan.classList.add('blue');
            } else if (num >= 21 && num <= 30) {
                numberSpan.classList.add('red');
            } else if (num >= 31 && num <= 40) {
                numberSpan.classList.add('gray');
            } else {
                numberSpan.classList.add('green');
            }
            
            numbersDiv.appendChild(numberSpan);
        });
        
        gameDiv.appendChild(numbersDiv);
        resultsContainer.appendChild(gameDiv);
    }
    
    // 로또 용지 초기화 함수
    function initLottoPaper() {
        // 상단 로또 용지 초기화
        paperRowIds.forEach(rowId => {
            initLottoRow(rowId);
        });
        
        // 하단 로또 용지 초기화 (복사본)
        paperRowCopyIds.forEach(rowId => {
            initLottoRow(rowId);
        });
    }

    // 각 로또 행 초기화 함수
    function initLottoRow(rowId) {
        const rowContainer = document.getElementById(rowId);
        rowContainer.innerHTML = ''; // 기존 내용 초기화
        
        // 1~45 번호를 행별로 정렬하여 생성 (5행 9열)
        const rows = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [10, 11, 12, 13, 14, 15, 16, 17, 18],
            [19, 20, 21, 22, 23, 24, 25, 26, 27],
            [28, 29, 30, 31, 32, 33, 34, 35, 36],
            [37, 38, 39, 40, 41, 42, 43, 44, 45]
        ];
        
        // 각 행의 번호를 순서대로 추가
        rows.forEach(row => {
            row.forEach(num => {
                const numDiv = document.createElement('div');
                numDiv.classList.add('paper-number');
                numDiv.setAttribute('data-number', num);
                numDiv.textContent = num;
                rowContainer.appendChild(numDiv);
            });
        });
    }
    
    // 로또 용지 마킹 함수
    function markLottoPaper() {
        // 모든 마킹 초기화
        const allPaperNumbers = document.querySelectorAll('.paper-number');
        allPaperNumbers.forEach(num => {
            num.classList.remove('marked');
        });
        
        // 생성된 게임 수 확인
        const games = document.querySelectorAll('.game');
        const gameCount = games.length;
        
        // 각 게임별로 마킹 (상단 로또 용지)
        for (let i = 0; i < gameCount && i < 5; i++) { // 최대 5개 게임만 마킹 (A~E)
            const gameNumbers = games[i].querySelectorAll('.number');
            const rowId = paperRowIds[i];
            
            markRowNumbers(rowId, gameNumbers);
        }
        
        // 하단 로또 용지도 동일하게 마킹 (복사본)
        for (let i = 0; i < gameCount && i < 5; i++) {
            const gameNumbers = games[i].querySelectorAll('.number');
            const rowId = paperRowCopyIds[i];
            
            markRowNumbers(rowId, gameNumbers);
        }
    }
    
    // 각 행의 번호 마킹 함수
    function markRowNumbers(rowId, gameNumbers) {
        gameNumbers.forEach(numElem => {
            const num = parseInt(numElem.textContent);
            const paperNumber = document.querySelector(`#${rowId} .paper-number[data-number="${num}"]`);
            if (paperNumber) {
                paperNumber.classList.add('marked');
            }
        });
    }
    
    // 초기화: 로또 용지 번호 생성
    initLottoPaper();
}); 