/**
 * 늙은아이의 유틸리티 창고 - 로또 번호 생성기
 * Copyright (c) 2023-2025
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소 가져오기
    const generateBtn = document.getElementById('generate-btn');
    const gameCountSelect = document.getElementById('game-count');
    const resultsContainer = document.getElementById('results');
    const recentWinnersContainer = document.getElementById('recent-winners');
    const loadingMessage = document.querySelector('.loading-message');
    
    // 페이지 로드 시 최근 당첨번호 가져오기
    fetchRecentWinningNumbers();
    
    // 탭 관련 요소
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // 탭 전환 이벤트 설정
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // 모든 탭 비활성화
                tabs.forEach(t => t.classList.remove('active'));
                
                // 클릭한 탭 활성화
                this.classList.add('active');
                
                // 모든 탭 컨텐츠 숨기기
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });
                
                // 해당 탭 컨텐츠 표시
                const activeContent = document.getElementById(tabId);
                if (activeContent) {
                    activeContent.classList.add('active');
                }
            });
        });
    }
    
    // 버튼에 클릭 이벤트 추가
    if (generateBtn) {
        generateBtn.addEventListener('click', generateLottoNumbers);
    }
    
    // 최근 당첨번호 가져오기 함수
    async function fetchRecentWinningNumbers() {
        try {
            // 로딩 메시지 표시
            if (loadingMessage) {
                loadingMessage.style.display = 'block';
            }
            
            const recentWinnersContainer = document.getElementById('recent-winners');
            
            // 임의의 당첨번호 생성 (API 연결 실패 시 사용)
            const dummyWinningNumbers = [8, 11, 14, 17, 36, 39];
            const dummyBonusNumber = 22;
            
            // 임의의 당첨 데이터 생성
            const dummyData = {
                drawNo: "1174",
                drawDate: "2025-05-31",
                numbers: dummyWinningNumbers,
                bonusNo: dummyBonusNumber,
                totalPrize: "상세 정보는 동행복권 사이트에서 확인하세요",
                winners: [
                    { rank: 1, count: 15, prize: '약 20억원' },
                    { rank: 2, count: 63, prize: '약 5,800만원' },
                    { rank: 3, count: 187, prize: '약 195만원' },
                    { rank: 4, count: 9412, prize: '약 5만원' },
                    { rank: 5, count: 160523, prize: '약 5천원' }
                ]
            };
            
            // 당첨번호 표시
            displayWinningNumbers(dummyData, '임시 데이터');
            
            // 로딩 메시지 숨기기
            if (loadingMessage) {
                loadingMessage.style.display = 'none';
            }
        } catch (error) {
            console.error('당첨번호를 가져오는 중 오류가 발생했습니다:', error);
            
            if (recentWinnersContainer) {
                recentWinnersContainer.innerHTML = '<p class="error-message">당첨번호를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>';
            }
            
            // 로딩 메시지 숨기기
            if (loadingMessage) {
                loadingMessage.style.display = 'none';
            }
        }
    }
    
    // 당첨번호 표시 함수
    function displayWinningNumbers(drawData, dataSource = '') {
        if (!recentWinnersContainer) return;
        
        // 컨테이너 초기화
        recentWinnersContainer.innerHTML = '';
        
        // 당첨 정보 컨테이너 생성
        const drawContainer = document.createElement('div');
        drawContainer.classList.add('draw-result');
        
        // 회차 정보
        const drawInfo = document.createElement('div');
        drawInfo.classList.add('draw-info');
        drawInfo.textContent = `제 ${drawData.drawNo}회 (${drawData.drawDate}) 당첨번호`;
        drawContainer.appendChild(drawInfo);
        
        // 데이터 소스 표시
        if (dataSource) {
            const sourceInfo = document.createElement('div');
            sourceInfo.classList.add('data-source');
            sourceInfo.textContent = `데이터 출처: ${dataSource}`;
            sourceInfo.style.fontSize = '0.8rem';
            sourceInfo.style.color = '#666';
            sourceInfo.style.marginBottom = '10px';
            drawContainer.appendChild(sourceInfo);
        }
        
        // 번호 컨테이너
        const numbersContainer = document.createElement('div');
        numbersContainer.classList.add('winning-numbers');
        
        // 당첨번호 표시
        drawData.numbers.forEach(number => {
            const ball = document.createElement('div');
            ball.classList.add('lotto-ball');
            ball.textContent = number;
            
            // 번호 범위에 따라 색상 클래스 추가
            if (number >= 1 && number <= 10) {
                ball.style.backgroundColor = '#ffd700'; // 노란색
            } else if (number >= 11 && number <= 20) {
                ball.style.backgroundColor = '#4b89dc'; // 파란색
            } else if (number >= 21 && number <= 30) {
                ball.style.backgroundColor = '#e74c3c'; // 빨간색
            } else if (number >= 31 && number <= 40) {
                ball.style.backgroundColor = '#7f8c8d'; // 회색
            } else {
                ball.style.backgroundColor = '#2ecc71'; // 초록색
            }
            
            numbersContainer.appendChild(ball);
        });
        
        // + 기호
        const plusSign = document.createElement('div');
        plusSign.classList.add('plus-sign');
        plusSign.textContent = '+';
        numbersContainer.appendChild(plusSign);
        
        // 보너스 번호
        const bonusBall = document.createElement('div');
        bonusBall.classList.add('lotto-ball', 'bonus-ball');
        bonusBall.textContent = drawData.bonusNo;
        
        // 보너스 번호 색상 설정
        const bonusNo = drawData.bonusNo;
        if (bonusNo >= 1 && bonusNo <= 10) {
            bonusBall.style.backgroundColor = '#ffd700'; // 노란색
        } else if (bonusNo >= 11 && bonusNo <= 20) {
            bonusBall.style.backgroundColor = '#4b89dc'; // 파란색
        } else if (bonusNo >= 21 && bonusNo <= 30) {
            bonusBall.style.backgroundColor = '#e74c3c'; // 빨간색
        } else if (bonusNo >= 31 && bonusNo <= 40) {
            bonusBall.style.backgroundColor = '#7f8c8d'; // 회색
        } else {
            bonusBall.style.backgroundColor = '#2ecc71'; // 초록색
        }
        
        numbersContainer.appendChild(bonusBall);
        drawContainer.appendChild(numbersContainer);
        
        // 당첨금 정보 테이블 생성
        if (drawData.winners && drawData.winners.length > 0) {
            const winnerInfoContainer = document.createElement('div');
            winnerInfoContainer.classList.add('winner-info-container');
            
            // 테이블 생성
            const table = document.createElement('table');
            table.classList.add('winner-table');
            
            // 테이블 헤더
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            
            const headers = ['순위', '당첨자 수', '당첨금액'];
            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
            
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            // 테이블 본문
            const tbody = document.createElement('tbody');
            
            drawData.winners.forEach(winner => {
                const row = document.createElement('tr');
                
                const rankCell = document.createElement('td');
                rankCell.textContent = `${winner.rank}등`;
                
                const countCell = document.createElement('td');
                countCell.textContent = winner.count.toLocaleString() + '명';
                
                const prizeCell = document.createElement('td');
                prizeCell.textContent = winner.prize;
                
                row.appendChild(rankCell);
                row.appendChild(countCell);
                row.appendChild(prizeCell);
                
                tbody.appendChild(row);
            });
            
            table.appendChild(tbody);
            winnerInfoContainer.appendChild(table);
            drawContainer.appendChild(winnerInfoContainer);
        }
        
        // 최종 추가
        recentWinnersContainer.appendChild(drawContainer);
        
        // 정보 메시지 추가
        const infoText = document.createElement('p');
        infoText.classList.add('info-text');
        infoText.innerHTML = '* 정확한 당첨번호와 당첨금액은 <a href="https://dhlottery.co.kr/gameResult.do?method=byWin" target="_blank" class="external-link">동행복권 공식 사이트</a>에서 확인하세요.';
        recentWinnersContainer.appendChild(infoText);
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
    }
    
    // 랜덤 번호 생성 함수
    function generateRandomNumbers() {
        // 1부터 45까지의 숫자 중 중복 없이 6개 선택
        const numbers = [];
        
        while (numbers.length < 6) {
            const randomNum = Math.floor(Math.random() * 45) + 1;
            
            // 이미 선택된 번호인 경우 건너뛰기
            if (numbers.includes(randomNum)) {
                continue;
            }
            
            numbers.push(randomNum);
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
        numbers.forEach((num, index) => {
            const numberSpan = document.createElement('span');
            numberSpan.classList.add('number');
            numberSpan.textContent = num;
            numberSpan.style.setProperty('--i', index);
            
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
}); 