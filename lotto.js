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
            
            // CORS 프록시 URL
            const proxyUrls = [
                'https://api.allorigins.win/get?url=',
                'https://corsproxy.io/?',
                'https://cors-anywhere.herokuapp.com/'
            ];
            
            try {
                // 동행복권 메인 페이지에서 데이터 가져오기
                const lotteryData = await fetchFromDHLotteryMain(proxyUrls);
                
                if (lotteryData && lotteryData.numbers.length === 6) {
                    displayWinningNumbers(lotteryData, '동행복권');
                } else {
                    throw new Error('데이터 파싱 실패');
                }
                
            } catch (apiError) {
                console.error('스크래핑 실패:', apiError.message);
                
                // 사용자에게 친절한 오류 메시지 표시
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.innerHTML = `
                    <p>🔍 당첨번호 정보를 가져오는 중 오류가 발생했습니다.</p>
                    <p>오류 내용: ${apiError.message}</p>
                    <p>현재 로또 사이트 접속이 원활하지 않습니다.</p>
                    <p>나중에 다시 시도해 주세요.</p>
                `;
                
                if (recentWinnersContainer) {
                    // 기존 오류 메시지가 있으면 제거
                    const existingError = recentWinnersContainer.querySelector('.error-message');
                    if (existingError) {
                        recentWinnersContainer.removeChild(existingError);
                    }
                    
                    recentWinnersContainer.prepend(errorMessage);
                }
            }
            
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
    
    // 동행복권 메인 페이지에서 당첨번호 가져오기
    async function fetchFromDHLotteryMain(proxyUrls) {
        let lotteryData = null;
        let lastError = null;
        
        // 여러 프록시 서버 시도
        for (const proxyUrl of proxyUrls) {
            try {
                const lotteryPageUrl = 'https://dhlottery.co.kr/common.do?method=main';
                
                let fetchUrl;
                if (proxyUrl.includes('allorigins')) {
                    fetchUrl = `${proxyUrl}${encodeURIComponent(lotteryPageUrl)}`;
                } else {
                    fetchUrl = `${proxyUrl}${lotteryPageUrl}`;
                }
                
                console.log(`[동행복권 메인] 프록시 서버 시도: ${proxyUrl}`);
                const response = await fetch(fetchUrl, { timeout: 15000 });
                let htmlContent;
                
                if (proxyUrl.includes('allorigins')) {
                    const data = await response.json();
                    htmlContent = data.contents;
                } else {
                    htmlContent = await response.text();
                }
                
                // HTML 파싱을 위한 임시 DOM 요소 생성
                const parser = new DOMParser();
                // 메타 태그의 인코딩을 명시적으로 설정
                let doc = parser.parseFromString(htmlContent, 'text/html');
                
                // 인코딩 문제 디버깅
                console.log('[인코딩 디버깅] 응답 헤더:', response.headers);
                console.log('[인코딩 디버깅] HTML 샘플:', htmlContent.substring(0, 200));
                
                // 인코딩 처리 시도 (인코딩이 깨지는 경우)
                try {
                    // UTF-8로 강제 변환 시도
                    const encoder = new TextEncoder();
                    const decoder = new TextDecoder('euc-kr');
                    
                    // 이미 UTF-8로 잘 인코딩된 경우 이 과정은 불필요할 수 있음
                    // 그러나 EUC-KR로 인코딩된 응답을 처리하기 위한 백업 처리
                    if (htmlContent.includes('') || htmlContent.includes('ֽ') || !doc.querySelector('.lotto6_45')) {
                        console.log('[인코딩 문제 감지] EUC-KR 디코딩 시도');
                        
                        // TextDecoder API를 지원하는 브라우저에서만 동작
                        if (typeof TextDecoder !== 'undefined') {
                            try {
                                // 서버에서 이미 UTF-8로 변환된 응답이 아닌 경우에만 수행
                                const bytes = encoder.encode(htmlContent);
                                htmlContent = decoder.decode(bytes);
                                
                                // 다시 파싱
                                const docRetry = parser.parseFromString(htmlContent, 'text/html');
                                if (docRetry.querySelector('.lotto6_45')) {
                                    // 변수 재할당 (const를 let으로 변경)
                                    doc = docRetry;
                                    console.log('[인코딩 수정] 성공적으로 인코딩 변환됨');
                                }
                            } catch (encError) {
                                console.error('[인코딩 오류]', encError);
                            }
                        }
                    }
                } catch (encError) {
                    console.warn('[인코딩 변환 오류]', encError);
                }
                
                // 메인 페이지에서 로또 당첨 정보 추출
                const mainLottoSection = doc.querySelector('.lotto6_45');
                
                if (!mainLottoSection) {
                    console.warn('메인 페이지에서 로또 정보 섹션을 찾을 수 없습니다.');
                    throw new Error('메인 페이지에서 로또 정보를 찾을 수 없습니다.');
                }
                
                // 회차 정보 추출
                let drawNoText = '';
                const drawNoElement = mainLottoSection.querySelector('h3, h4, strong, .win_result');
                
                if (drawNoElement) {
                    drawNoText = drawNoElement.textContent.trim();
                    // 회차 숫자만 추출 (예: "1174회 당첨결과" -> "1174")
                    const drawNoMatch = drawNoText.match(/(\d+)회/);
                    if (drawNoMatch) {
                        drawNoText = drawNoMatch[1];
                    }
                }
                
                if (!drawNoText) {
                    console.warn('회차 정보를 찾을 수 없습니다.');
                    
                    // 다른 방법으로 추출 시도
                    const allText = mainLottoSection.textContent;
                    const drawNoMatch = allText.match(/(\d+)회/);
                    if (drawNoMatch) {
                        drawNoText = drawNoMatch[1];
                    } else {
                        throw new Error('회차 정보를 찾을 수 없습니다.');
                    }
                }
                
                // 당첨일 추출
                let drawDate = '';
                const dateElement = mainLottoSection.querySelector('.date, p');
                if (dateElement) {
                    const dateText = dateElement.textContent.trim();
                    // 날짜 형식 추출 (예: "2025-05-31 추첨" -> "2025-05-31")
                    const dateMatch = dateText.match(/(\d{4}-\d{2}-\d{2})/);
                    if (dateMatch) {
                        drawDate = dateMatch[1];
                    } else {
                        drawDate = dateText;
                    }
                }
                
                // 당첨번호 추출 - 여러 가능한 클래스/요소 시도
                const numberElements = mainLottoSection.querySelectorAll('.num, .ball, .winning_number');
                
                let numbers = [];
                let bonusNo = 0;
                
                if (numberElements.length >= 6) {
                    // 일반적인 방법으로 번호 추출
                    for (let i = 0; i < numberElements.length; i++) {
                        const num = parseInt(numberElements[i].textContent.trim(), 10);
                        if (!isNaN(num) && num >= 1 && num <= 45) {
                            if (numbers.length < 6) {
                                numbers.push(num);
                            } else if (numbers.length === 6 && !bonusNo) {
                                bonusNo = num;
                                break; // 7개 숫자를 모두 찾았으므로 중단
                            }
                        }
                    }
                }
                
                // 다른 방법으로 시도 - 텍스트에서 숫자 추출
                if (numbers.length < 6 || !bonusNo) {
                    console.warn('DOM 요소에서 당첨번호를 추출할 수 없어 텍스트에서 추출 시도');
                    
                    const lottoSectionText = mainLottoSection.textContent;
                    
                    // 숫자 추출을 위한 정규식 패턴 - 1부터 45 사이의 숫자만 추출
                    const numPattern = /\b([1-9]|[1-3][0-9]|4[0-5])\b/g;
                    const matches = Array.from(lottoSectionText.matchAll(numPattern), m => parseInt(m[0], 10));
                    
                    // 추출된 숫자가 충분한지 확인
                    if (matches.length >= 7) {
                        numbers = matches.slice(0, 6);
                        bonusNo = matches[6];
                    } else {
                        throw new Error('당첨번호를 추출할 수 없습니다.');
                    }
                }
                
                // 보너스 번호가 없을 경우 별도로 찾기
                if (!bonusNo) {
                    const bonusElement = mainLottoSection.querySelector('.bonus, .plus');
                    if (bonusElement) {
                        const numElement = bonusElement.nextElementSibling || bonusElement.querySelector('.num');
                        if (numElement) {
                            bonusNo = parseInt(numElement.textContent.trim(), 10);
                        }
                    }
                    
                    // 보너스 번호를 찾지 못한 경우 - 텍스트에서 찾기
                    if (!bonusNo) {
                        const bonusTextMatch = mainLottoSection.textContent.match(/보너스\D*(\d+)/i) || 
                                            mainLottoSection.textContent.match(/\+\D*(\d+)/);
                        if (bonusTextMatch) {
                            bonusNo = parseInt(bonusTextMatch[1], 10);
                        }
                    }
                }
                
                if (numbers.length !== 6 || !bonusNo) {
                    console.warn('당첨번호가 올바르지 않습니다.');
                    throw new Error('당첨번호 형식이 올바르지 않습니다.');
                }
                
                // 당첨금 정보는 메인 페이지에서 정확히 추출하기 어려우므로 간소화
                lotteryData = {
                    drawNo: drawNoText,
                    drawDate: drawDate || '최근 추첨일',
                    numbers: numbers,
                    bonusNo: bonusNo,
                    totalPrize: '상세 정보는 동행복권 사이트에서 확인하세요',
                    winners: generateBasicWinners()
                };
                
                return lotteryData;
            } catch (error) {
                console.warn(`[동행복권 메인] 프록시 ${proxyUrl} 사용 시도 실패:`, error.message);
                lastError = error;
                continue;
            }
        }
        
        if (lastError) throw lastError;
        throw new Error('동행복권 메인 페이지에서 데이터를 가져오지 못했습니다');
    }
    
    // 기본 당첨자 정보 생성 (실제 데이터가 없을 때 사용)
    function generateBasicWinners() {
        return [
            { rank: 1, count: 1, prize: '정보 확인 필요' },
            { rank: 2, count: 20, prize: '정보 확인 필요' },
            { rank: 3, count: 200, prize: '정보 확인 필요' },
            { rank: 4, count: 2000, prize: '정보 확인 필요' },
            { rank: 5, count: 20000, prize: '정보 확인 필요' }
        ];
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