/**
 * 로또 번호 생성기 (Lotto Number Generator)
 * Copyright (c) 2023-2025 braindetox.kr
 * All rights reserved.
 * 
 * 사유 라이센스 (Proprietary License):
 * 이 소프트웨어는 braindetox.kr의 독점 소유물입니다.
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
    
    // 메뉴 관련 요소
    const navLinks = document.querySelectorAll('.nav-link');
    const utilitySections = document.querySelectorAll('.utility-section');
    
    // 탭 관련 요소
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // 로또 용지의 행 ID
    const paperRowIds = ['paper-row-A', 'paper-row-B', 'paper-row-C', 'paper-row-D', 'paper-row-E'];
    const paperRowCopyIds = ['paper-row-A-copy', 'paper-row-B-copy', 'paper-row-C-copy', 'paper-row-D-copy', 'paper-row-E-copy'];
    
    // 오늘 날짜를 표시
    if (issueDate) {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
        issueDate.textContent = formattedDate;
    }
    
    // 탭 전환 이벤트 설정
    if (tabs.length > 0 && tabContents.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }
    
    // 네비게이션 메뉴 이벤트 설정 - 수정된 부분
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // .html로 끝나는 실제 페이지 링크는 기본 동작(페이지 이동)을 유지
            if (href && (href.endsWith('.html') || href === '/' || href === '')) {
                // 기본 동작을 막지 않음 (preventDefault 호출 없음)
                return; // 페이지 이동 처리는 브라우저에 맡김
            }
            
            // 내부 링크(#으로 시작하는)에 대해서만 SPA 방식 적용
            if (href && href.startsWith('#')) {
                e.preventDefault(); // 내부 링크에 대해서만 기본 동작 방지
                const targetId = href.substring(1);
                
                // 활성 메뉴 표시 변경
                navLinks.forEach(item => item.classList.remove('active'));
                this.classList.add('active');
                
                // 해당 섹션 표시
                utilitySections.forEach(section => {
                    if (section.id === targetId) {
                        section.classList.add('active');
                    } else {
                        section.classList.remove('active');
                    }
                });
            }
        });
    });
    
    // URL 해시 값에 따라 초기 섹션 표시
    function handleHashChange() {
        const hash = window.location.hash;
        
        // 해시가 있는 경우에만 SPA 내부 링크 처리
        if (hash && hash.startsWith('#')) {
            const targetLink = document.querySelector(`.nav-link[href="${hash}"]`);
            if (targetLink) {
                // 내부 링크 클릭 효과
                targetLink.click();
            }
        }
    }
    
    // 초기 페이지 로드 및 해시 변경 시 처리
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    
    // 로또 용지 체크박스 이벤트
    if (showPaperCheckbox && lottoPaper) {
        showPaperCheckbox.addEventListener('change', function() {
            lottoPaper.style.display = this.checked ? 'flex' : 'none';
            
            // 체크박스가 체크되면 로또 용지 초기화 및 마킹
            if (this.checked) {
                initLottoPaper();
                markLottoPaper();
            }
        });
    }
    
    // 버튼에 클릭 이벤트 추가
    if (generateBtn) {
        generateBtn.addEventListener('click', generateLottoNumbers);
    }
    
    // 인쇄 버튼 이벤트
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
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
            const rowElement = document.getElementById(rowId);
            if (rowElement) {
                initLottoRow(rowId);
            }
        });
        
        // 하단 로또 용지 초기화 (복사본)
        paperRowCopyIds.forEach(rowId => {
            const rowElement = document.getElementById(rowId);
            if (rowElement) {
                initLottoRow(rowId);
            }
        });
    }

    // 각 로또 행 초기화 함수
    function initLottoRow(rowId) {
        const rowContainer = document.getElementById(rowId);
        if (!rowContainer) return;
        
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
                const numSpan = document.createElement('span');
                numSpan.classList.add('paper-number');
                numSpan.textContent = num;
                numSpan.dataset.number = num;
                rowContainer.appendChild(numSpan);
            });
        });
    }
    
    // 로또 용지 마킹 함수
    function markLottoPaper() {
        // 모든 마킹 초기화
        const allNumbers = document.querySelectorAll('.paper-number');
        allNumbers.forEach(num => {
            num.classList.remove('marked');
        });
        
        // 결과 컨테이너에서 생성된 모든 게임의 번호 가져오기
        const games = document.querySelectorAll('.game');
        
        // 최대 5개 게임만 마킹 (A-E 행)
        for (let i = 0; i < Math.min(games.length, 5); i++) {
            const gameNumbers = [];
            const numberElements = games[i].querySelectorAll('.number');
            
            numberElements.forEach(el => {
                gameNumbers.push(parseInt(el.textContent));
            });
            
            // 해당 행에 번호 마킹
            markRowNumbers(paperRowIds[i], gameNumbers);
            
            // 복사본 행에도 번호 마킹
            markRowNumbers(paperRowCopyIds[i], gameNumbers);
        }
    }
    
    // 특정 행에 번호 마킹
    function markRowNumbers(rowId, gameNumbers) {
        const rowElement = document.getElementById(rowId);
        if (!rowElement) return;
        
        const paperNumbers = rowElement.querySelectorAll('.paper-number');
        
        paperNumbers.forEach(numEl => {
            const num = parseInt(numEl.dataset.number);
            if (gameNumbers.includes(num)) {
                numEl.classList.add('marked');
            }
        });
    }
    
    // 초기화: 로또 용지 번호 생성
    initLottoPaper();

    // 링크 복사 기능 (있는 경우)
    const linkCopyBtn = document.getElementById('link-copy');
    if (linkCopyBtn) {
        linkCopyBtn.addEventListener('click', function() {
            const currentUrl = window.location.href;
            navigator.clipboard.writeText(currentUrl).then(() => {
                showToast('링크가 복사되었습니다!');
            });
        });
    }

    // 토스트 메시지 표시 함수
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // 토스트 메시지 표시
        setTimeout(() => {
            toast.style.display = 'block';
            setTimeout(() => {
                toast.style.opacity = '1';
            }, 10);
        }, 100);
        
        // 2초 후 토스트 메시지 숨기기
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }
}); 