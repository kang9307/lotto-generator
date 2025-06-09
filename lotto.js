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
    const copyToClipboardBtn = document.getElementById('copy-to-clipboard');
    const copyResultMsg = document.getElementById('copy-result');
    const numberPickerContainer = document.querySelector('.number-picker-container');
    const selectedCountElement = document.getElementById('selected-count');
    const clearSelectedBtn = document.getElementById('clear-selected');
    const randomPickBtn = document.getElementById('random-pick');
    
    // 선택 방식 라디오 버튼
    const pickTypeOptions = document.querySelectorAll('input[name="pick-type"]');
    
    // 탭 관련 요소
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // 연속된 번호 제한 확률 - 70%에서 50%로 감소시켜 다양성 향상
    const CONSECUTIVE_LIMIT_PROBABILITY = 0.5;
    
    // 생성된 로또 번호를 저장할 전역 변수
    let generatedLottoNumbers = [];
    
    // 사용자가 선택한 번호를 저장할 배열
    let selectedNumbers = [];
    
    // 현재 선택된 생성 방식 (auto, manual, semi-auto)
    let currentPickType = 'auto';
    
    // 색상별 번호 그룹 정의
    const colorGroups = [
        { color: 'yellow', range: [1, 10] },
        { color: 'blue', range: [11, 20] },
        { color: 'red', range: [21, 30] },
        { color: 'gray', range: [31, 40] },
        { color: 'green', range: [41, 45] }
    ];
    
    // 초기화 함수
    function init() {
        // 탭 이벤트 설정
        initTabs();
        
        // 번호 선택 UI 초기화
        initNumberPicker();
        
        // 이벤트 리스너 설정
        initEventListeners();
    }
    
    // 탭 전환 이벤트 설정
    function initTabs() {
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
    }
    
    // 번호 선택 UI 초기화
    function initNumberPicker() {
        // 각 색상 그룹별로 번호 버튼 생성
        colorGroups.forEach(group => {
            const groupElement = document.querySelector(`.${group.color}-group .number-buttons`);
            if (!groupElement) return;
            
            // 해당 범위의 번호 버튼 생성
            for (let i = group.range[0]; i <= group.range[1]; i++) {
                const button = document.createElement('button');
                button.classList.add('number-btn', group.color);
                button.textContent = i;
                button.dataset.number = i;
                
                // 클릭 이벤트 추가
                button.addEventListener('click', function() {
                    toggleNumberSelection(this);
                });
                
                groupElement.appendChild(button);
            }
        });
        
        // 버튼 텍스트와 아이콘 명확히 구성
        if (clearSelectedBtn) {
            clearSelectedBtn.innerHTML = '<i class="fas fa-times" style="margin-right:5px;"></i><span>선택 초기화</span>';
            clearSelectedBtn.addEventListener('click', clearSelectedNumbers);
        }
        
        // 랜덤 선택 버튼 이벤트
        if (randomPickBtn) {
            randomPickBtn.innerHTML = '<i class="fas fa-random" style="margin-right:5px;"></i><span>랜덤 선택</span>';
            randomPickBtn.addEventListener('click', randomSelectNumbers);
        }
    }
    
    // 이벤트 리스너 초기화
    function initEventListeners() {
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
        
        // 클립보드 복사 버튼에 이벤트 추가
        if (copyToClipboardBtn) {
            copyToClipboardBtn.addEventListener('click', copyAllNumbersToClipboard);
        }
        
        // 선택 방식 변경 이벤트
        pickTypeOptions.forEach(option => {
            option.addEventListener('change', function() {
                currentPickType = this.value;
                toggleNumberPickerVisibility();
            });
        });
    }
    
    // 번호 선택/해제 토글 함수
    function toggleNumberSelection(button) {
        const number = parseInt(button.dataset.number);
        
        // 이미 선택된 번호인 경우 선택 해제
        if (selectedNumbers.includes(number)) {
            selectedNumbers = selectedNumbers.filter(n => n !== number);
            button.classList.remove('selected');
        } 
        // 새로운 번호 선택 (최대 5개까지)
        else if (selectedNumbers.length < 5) {
            selectedNumbers.push(number);
            button.classList.add('selected');
        } else {
            alert('최대 5개까지 선택 가능합니다.');
            return;
        }
        
        // 선택된 번호 개수 표시 업데이트
        updateSelectedCount();
    }
    
    // 선택된 번호 개수 표시 업데이트
    function updateSelectedCount() {
        if (selectedCountElement) {
            selectedCountElement.textContent = selectedNumbers.length;
        }
    }
    
    // 선택된 번호 초기화
    function clearSelectedNumbers() {
        selectedNumbers = [];
        
        // 모든 선택 버튼 클래스 제거
        document.querySelectorAll('.number-btn.selected').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // 카운트 업데이트
        updateSelectedCount();
    }
    
    // 랜덤으로 번호 선택 (최대 5개)
    function randomSelectNumbers() {
        // 기존 선택 초기화
        clearSelectedNumbers();
        
        // 랜덤으로 1-5개 번호 선택
        const count = Math.floor(Math.random() * 5) + 1; // 1~5개
        
        while (selectedNumbers.length < count) {
            const randomNum = getSecureRandomNumber(1, 45);
            
            // 중복 방지
            if (selectedNumbers.includes(randomNum)) {
                continue;
            }
            
            selectedNumbers.push(randomNum);
            
            // 해당 버튼 선택 상태로 변경
            const button = document.querySelector(`.number-btn[data-number="${randomNum}"]`);
            if (button) {
                button.classList.add('selected');
            }
        }
        
        // 카운트 업데이트
        updateSelectedCount();
    }
    
    // 번호 선택 UI 표시/숨김 전환
    function toggleNumberPickerVisibility() {
        if (numberPickerContainer) {
            // 반자동 모드일 때만 번호 선택 UI 표시
            if (currentPickType === 'semi-auto') {
                numberPickerContainer.style.display = 'block';
            } else {
                numberPickerContainer.style.display = 'none';
            }
        }
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
            let numbers;
            
            // 선택 방식에 따른 번호 생성
            if (currentPickType === 'semi-auto') {
                // 반자동: 선택된 번호를 포함하여 생성
                numbers = generateSemiAutoNumbers();
            } else {
                // 자동: 완전 랜덤 생성
                numbers = generateRandomNumbers();
            }
            
            generatedLottoNumbers.push(numbers); // 생성된 번호 저장
            displayNumbers(numbers, i + 1);
        }
        
        // 로또 번호가 생성되었으므로 공유 섹션 표시
        if (resultShareSection) {
            resultShareSection.style.display = 'block';
        }
        
        // 복사 성공 메시지 초기화
        if (copyResultMsg) {
            copyResultMsg.style.display = 'none';
        }
    }
    
    // 반자동 번호 생성 함수 (사용자 선택 번호 포함)
    function generateSemiAutoNumbers() {
        // 선택된 번호가 없으면 완전 랜덤 생성
        if (selectedNumbers.length === 0) {
            return generateRandomNumbers();
        }
        
        // 선택된 번호를 복사 (원본 배열 변경 방지)
        const numbers = [...selectedNumbers];
        
        // 필요한 추가 번호 개수
        const remainingCount = 6 - numbers.length;
        
        // 나머지 번호 생성
        while (numbers.length < 6) {
            // 암호학적으로 안전한 난수 생성 함수 사용
            const randomNum = getSecureRandomNumber(1, 45);
            
            // 이미 선택되거나 포함된 번호면 건너뛰기
            if (numbers.includes(randomNum)) {
                continue;
            }
            
            // 연속된 번호 제한 검사 (기존 로직 유지)
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
            
            // 사용자가 선택한 번호인 경우 특별 표시
            if (currentPickType === 'semi-auto' && selectedNumbers.includes(num)) {
                numberSpan.classList.add('user-selected');
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
    
    // 간결한 공유 메시지 생성 함수
    function createCompactShareMessage() {
        if (generatedLottoNumbers.length === 0) {
            return null;
        }
        
        // 생성 날짜 추가
        const now = new Date();
        const dateStr = `${now.getFullYear()}.${(now.getMonth()+1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}`;
        
        // 메시지 시작
        let message = `🍀 행운의 로또 번호 (${dateStr})\n\n`;
        
        // 게임 수에 따라 최적화
        const gameCount = generatedLottoNumbers.length;
        
        // 모든 게임을 추가 (카카오톡 텍스트 길이 제한 고려)
        for (let i = 0; i < gameCount; i++) {
            const gameNumbers = generatedLottoNumbers[i];
            // 간결한 형식으로 게임 번호 추가
            message += `${i+1}게임: ${gameNumbers.join(', ')}\n`;
            
            // 카카오톡 메시지 길이 제한을 고려해 일정 수 이상이면 줄임
            if (i >= 4 && gameCount > 5) {
                message += `\n... 외 ${gameCount - (i+1)}개 게임\n`;
                break;
            }
        }
        
        // 출처 추가
        message += `\nBrainDetox Utility Box에서 생성`;
        
        return message;
    }
    
    // 전체 로또 번호 메시지 생성 함수 (클립보드 복사용)
    function createFullLottoMessage() {
        if (generatedLottoNumbers.length === 0) {
            return null;
        }
        
        // 생성 날짜 추가
        const now = new Date();
        const dateStr = `${now.getFullYear()}.${(now.getMonth()+1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}`;
        
        // 메시지 시작
        let message = `🍀 행운의 로또 번호 (${dateStr})\n\n`;
        
        // 모든 게임 추가 (제한 없이 전체 게임 포함)
        generatedLottoNumbers.forEach((numbers, index) => {
            message += `${index+1}게임: ${numbers.join(', ')}\n`;
        });
        
        // 출처 추가
        message += `\nBrainDetox Utility Box에서 생성`;
        
        return message;
    }
    
    // 전체 로또 번호를 클립보드에 복사하는 함수
    function copyAllNumbersToClipboard() {
        if (generatedLottoNumbers.length === 0) {
            alert('먼저 로또 번호를 생성해주세요!');
            return;
        }
        
        // 전체 로또 번호 메시지 생성
        const fullMessage = createFullLottoMessage();
        
        try {
            // 최신 Clipboard API 사용 시도
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(fullMessage)
                    .then(() => {
                        showCopySuccess();
                    })
                    .catch(err => {
                        console.error('클립보드 복사 중 오류 발생:', err);
                        copyUsingFallback(fullMessage);
                    });
            } else {
                // 구 버전 방식으로 복사
                copyUsingFallback(fullMessage);
            }
        } catch (err) {
            console.error('클립보드 복사 중 오류 발생:', err);
            copyUsingFallback(fullMessage);
        }
    }
    
    // 구 버전 방식의 클립보드 복사 기능
    function copyUsingFallback(text) {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = text;
        tempTextArea.style.position = 'fixed'; // 화면에서 보이지 않게 설정
        tempTextArea.style.opacity = '0';
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopySuccess();
            } else {
                alert('클립보드 복사에 실패했습니다. 브라우저 설정을 확인해주세요.');
            }
        } catch (err) {
            console.error('클립보드 복사 중 오류 발생:', err);
            alert('클립보드 복사에 실패했습니다. 브라우저 설정을 확인해주세요.');
        }
        
        document.body.removeChild(tempTextArea);
    }
    
    // 복사 성공 메시지 표시
    function showCopySuccess() {
        if (copyResultMsg) {
            copyResultMsg.style.display = 'block';
            
            // 3초 후 메시지 숨기기
            setTimeout(() => {
                copyResultMsg.style.display = 'none';
            }, 3000);
        } else {
            alert('클립보드에 복사되었습니다!');
        }
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
        
        try {
            if (isResultShare) {
                // 로또 결과 공유 (간결한 텍스트 형식)
                const shareMessage = createCompactShareMessage();
                if (!shareMessage) {
                    alert('공유할 로또 번호가 없습니다.');
                    return;
                }
                
                if (window.Kakao.Share) {
                    window.Kakao.Share.sendDefault({
                        objectType: 'text',
                        text: shareMessage,
                        link: {
                            mobileWebUrl: window.location.href,
                            webUrl: window.location.href
                        }
                    });
                } else if (window.Kakao.Link) {
                    window.Kakao.Link.sendDefault({
                        objectType: 'text',
                        text: shareMessage,
                        link: {
                            mobileWebUrl: window.location.href,
                            webUrl: window.location.href
                        }
                    });
                } else {
                    // 클립보드에 복사 대체 방법
                    const tempTextArea = document.createElement('textarea');
                    tempTextArea.value = shareMessage;
                    document.body.appendChild(tempTextArea);
                    tempTextArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempTextArea);
                    alert('카카오톡 공유를 지원하지 않는 환경입니다.\n로또 번호가 클립보드에 복사되었습니다.');
                }
            } else {
                // 사이트 공유 (기존 방식 유지)
                if (window.Kakao.Share) {
                    window.Kakao.Share.sendDefault({
                        objectType: 'feed',
                        content: {
                            title: '로또 번호 생성기 - BrainDetox Utility Box',
                            description: '무료 로또 번호 생성기로 나만의 로또 번호를 뽑아보세요.',
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
                    window.Kakao.Link.sendDefault({
                        objectType: 'feed',
                        content: {
                            title: '로또 번호 생성기 - BrainDetox Utility Box',
                            description: '무료 로또 번호 생성기로 나만의 로또 번호를 뽑아보세요.',
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
                    alert('카카오톡 공유 기능을 사용할 수 없습니다. 다른 방법으로 공유해 주세요.');
                }
            }
        } catch (error) {
            console.error('카카오톡 공유 중 오류 발생:', error);
            alert('카카오톡 공유 기능을 사용할 수 없습니다. 다른 방법으로 공유해 주세요.');
        }
    }
    
    // 초기화 함수 호출
    init();
}); 