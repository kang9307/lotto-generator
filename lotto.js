/**
 * BrainDetox Utility Box - 로또 번호 생성기
 * Copyright (c) 2023-2025
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소 가져오기
    const generateBtn = document.getElementById('generate-btn');
    const gameCountSelect = document.getElementById('game-count');
    const resultsContainer = document.getElementById('results');
    const kakaoShareBtn = document.getElementById('kakao-share');
    const resultShareSection = document.getElementById('result-share-section');
    const resultKakaoShareBtn = document.getElementById('result-kakao-share');
    
    // 탭 관련 요소
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // 연속된 번호 제한 확률 - 70%에서 50%로 감소시켜 다양성 향상
    const CONSECUTIVE_LIMIT_PROBABILITY = 0.5;
    
    // 생성된 로또 번호를 저장할 전역 변수
    let generatedLottoNumbers = [];
    
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
    
    // 카카오톡 공유 버튼에 이벤트 추가
    if (kakaoShareBtn) {
        kakaoShareBtn.addEventListener('click', function() {
            shareToKakao(false); // 사이트 공유
        });
    }
    
    // 로또 결과 공유 버튼에 이벤트 추가
    if (resultKakaoShareBtn) {
        resultKakaoShareBtn.addEventListener('click', function() {
            shareToKakao(true); // 결과 공유
        });
    }
    
    // 로또 번호 생성 함수
    function generateLottoNumbers() {
        // 게임 수 가져오기
        let gameCount = parseInt(gameCountSelect.value);
        
        // 결과 컨테이너 초기화
        resultsContainer.innerHTML = '';
        
        // 생성된 로또 번호 배열 초기화
        generatedLottoNumbers = [];
        
        // 각 게임마다 번호 생성
        for (let i = 0; i < gameCount; i++) {
            const numbers = generateRandomNumbers();
            generatedLottoNumbers.push(numbers); // 생성된 번호 저장
            displayNumbers(numbers, i + 1);
        }
        
        // 로또 번호가 생성되었으므로 공유 섹션 표시
        if (resultShareSection) {
            resultShareSection.style.display = 'block';
        }
    }
    
    // 암호학적으로 안전한 난수 생성 함수
    function getSecureRandomNumber(min, max) {
        // crypto.getRandomValues 지원 여부 확인
        if (window.crypto && window.crypto.getRandomValues) {
            const range = max - min + 1;
            const byteCount = Math.ceil(Math.log2(range) / 8);
            const maxValidNumber = Math.floor((256 ** byteCount) / range) * range - 1;
            const array = new Uint8Array(byteCount);
            let randomNumber;
            
            do {
                window.crypto.getRandomValues(array);
                randomNumber = 0;
                for (let i = 0; i < byteCount; i++) {
                    randomNumber = (randomNumber << 8) | array[i];
                }
            } while (randomNumber > maxValidNumber);
            
            return min + (randomNumber % range);
        } else {
            // 폴백: 기존 Math.random() 사용
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
    
    // 랜덤 번호 생성 함수
    function generateRandomNumbers() {
        // 1부터 45까지의 숫자 중 중복 없이 6개 선택
        const numbers = [];
        
        while (numbers.length < 6) {
            // 암호학적으로 안전한 난수 생성 함수 사용
            const randomNum = getSecureRandomNumber(1, 45);
            
            // 이미 선택된 번호인 경우 건너뛰기
            if (numbers.includes(randomNum)) {
                continue;
            }
            
            // 연속된 번호 제한 검사 (예: 1,2 또는 44,45와 같은 연속 번호)
            if (numbers.length > 0 && Math.random() < CONSECUTIVE_LIMIT_PROBABILITY) {
                // 기존 번호들과 연속된 번호인지 확인
                const isConsecutive = numbers.some(num => 
                    Math.abs(num - randomNum) === 1
                );
                
                if (isConsecutive) {
                    continue; // 연속된 번호면 다시 뽑기
                }
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
        
        // 모바일 화면 체크
        const isMobile = window.innerWidth <= 768;
        
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
            
            // 숫자 애니메이션 효과를 위한 지연 시간 설정
            setTimeout(() => {
                numberSpan.style.opacity = '1';
                numberSpan.style.transform = 'scale(1)';
            }, index * 100);
            
            numbersDiv.appendChild(numberSpan);
        });
        
        gameDiv.appendChild(numbersDiv);
        resultsContainer.appendChild(gameDiv);
        
        // 결과 영역으로 스크롤
        setTimeout(() => {
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }
    
    // 카카오톡으로 로또 번호 공유 함수
    function shareToKakao(isResultShare) {
        if (!window.Kakao) {
            alert('카카오톡 SDK를 불러올 수 없습니다.');
            return;
        }
        
        // 결과 공유인 경우, 생성된 번호가 있는지 확인
        if (isResultShare && generatedLottoNumbers.length === 0) {
            alert('먼저 로또 번호를 생성해주세요!');
            return;
        }
        
        // SDK 초기화 확인 및 재시도
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init('e06d0ee93e450a11bc6451d46e09cd88');
        }
        
        // 공유 데이터 설정
        let title, description;
        
        if (isResultShare) {
            // 로또 결과 공유
            title = '행운의 로또 번호를 공유합니다!';
            
            // 공유할 메시지 생성
            description = '내가 생성한 로또 번호:\n';
            generatedLottoNumbers.forEach((numbers, index) => {
                description += `게임 ${index + 1}: ${numbers.join(', ')}\n`;
            });
        } else {
            // 사이트 공유
            title = '로또 번호 생성기 - BrainDetox Utility Box';
            description = '무료 로또 번호 생성기로 나만의 로또 번호를 뽑아보세요.';
        }
        
        try {
            if (window.Kakao.Share) {
                // 최신 SDK Share 객체 사용
                window.Kakao.Share.sendDefault({
                    objectType: 'feed',
                    content: {
                        title: title,
                        description: description,
                        imageUrl: 'https://braindetox.kr/site_logo.png',
                        link: {
                            mobileWebUrl: window.location.href,
                            webUrl: window.location.href
                        }
                    },
                    buttons: [
                        {
                            title: '나도 번호 생성하기',
                            link: {
                                mobileWebUrl: window.location.href,
                                webUrl: window.location.href
                            }
                        }
                    ]
                });
            } else if (window.Kakao.Link) {
                // 구 버전 호환성 유지
                window.Kakao.Link.sendDefault({
                    objectType: 'feed',
                    content: {
                        title: title,
                        description: description,
                        imageUrl: 'https://braindetox.kr/site_logo.png',
                        link: {
                            mobileWebUrl: window.location.href,
                            webUrl: window.location.href
                        }
                    },
                    buttons: [
                        {
                            title: '나도 번호 생성하기',
                            link: {
                                mobileWebUrl: window.location.href,
                                webUrl: window.location.href
                            }
                        }
                    ]
                });
            } else {
                // 모바일이 아니거나 카카오톡 미설치 시 웹 공유 사용
                if (isResultShare) {
                    alert('생성된 로또 번호를 카카오톡으로 공유할 수 없습니다. 다른 방법으로 공유해 주세요.');
                } else {
                    alert('카카오톡 공유 기능을 사용할 수 없습니다. 다른 방법으로 공유해 주세요.');
                }
            }
        } catch (error) {
            console.error('카카오톡 공유 중 오류 발생:', error);
            alert('카카오톡 공유 기능을 사용할 수 없습니다. 다른 방법으로 공유해 주세요.');
        }
    }
}); 