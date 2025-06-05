/**
 * 시간/날짜 계산기 (Date/Time Calculator)
 * Copyright (c) 2025 braindetox.kr
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
    // DOM 요소 가져오기 - 탭 관련
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // DOM 요소 가져오기 - 날짜 차이 계산기
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const calcDiffBtn = document.getElementById('calc-diff');
    const diffResultDiv = document.getElementById('diff-result');
    const diffDaysDiv = document.getElementById('diff-days');
    const diffWeeksDiv = document.getElementById('diff-weeks');
    const diffMonthsDiv = document.getElementById('diff-months');
    const diffYearsDiv = document.getElementById('diff-years');
    
    // DOM 요소 가져오기 - 날짜 더하기/빼기 계산기
    const baseDateInput = document.getElementById('base-date');
    const operationSelect = document.getElementById('operation');
    const durationValueInput = document.getElementById('duration-value');
    const durationUnitSelect = document.getElementById('duration-unit');
    const calcAddSubBtn = document.getElementById('calc-add-sub');
    const addSubResultDiv = document.getElementById('add-sub-result');
    const newDateDiv = document.getElementById('new-date');
    
    // DOM 요소 가져오기 - 업무일 계산기
    const workStartDateInput = document.getElementById('work-start-date');
    const workEndDateInput = document.getElementById('work-end-date');
    const excludeWeekendsSelect = document.getElementById('exclude-weekends');
    const calcWorkdaysBtn = document.getElementById('calc-workdays');
    const workdayResultDiv = document.getElementById('workday-result');
    const workdayCountDiv = document.getElementById('workday-count');
    const weekendCountDiv = document.getElementById('weekend-count');
    
    // DOM 요소 가져오기 - 시간 변환기
    const timeValueInput = document.getElementById('time-value');
    const fromUnitSelect = document.getElementById('from-unit');
    const toUnitSelect = document.getElementById('to-unit');
    const calcTimeConvBtn = document.getElementById('calc-time-conv');
    const timeConvResultDiv = document.getElementById('time-conv-result');
    const convertedTimeDiv = document.getElementById('converted-time');
    
    // 탭 전환 이벤트 설정
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            tabContents.forEach(content => {
                if (content.id === tabId) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });
    
    // 초기 날짜 설정 (오늘 날짜로)
    const today = new Date();
    const todayStr = formatDateForInput(today);
    
    if (startDateInput) startDateInput.value = todayStr;
    if (endDateInput) endDateInput.value = todayStr;
    if (baseDateInput) baseDateInput.value = todayStr;
    if (workStartDateInput) workStartDateInput.value = todayStr;
    if (workEndDateInput) workEndDateInput.value = todayStr;
    
    // 날짜 차이 계산 버튼 이벤트
    if (calcDiffBtn) {
        calcDiffBtn.addEventListener('click', calculateDateDifference);
    }
    
    // 날짜 더하기/빼기 버튼 이벤트
    if (calcAddSubBtn) {
        calcAddSubBtn.addEventListener('click', calculateDateAddSub);
    }
    
    // 업무일 계산 버튼 이벤트
    if (calcWorkdaysBtn) {
        calcWorkdaysBtn.addEventListener('click', calculateWorkdays);
    }
    
    // 시간 변환 버튼 이벤트
    if (calcTimeConvBtn) {
        calcTimeConvBtn.addEventListener('click', convertTime);
    }
    
    // 날짜 차이 계산 함수
    function calculateDateDifference() {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        
        // 입력 유효성 검사
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            alert('유효한 날짜를 입력해주세요.');
            return;
        }
        
        // 두 날짜 간의 차이 계산 (밀리초)
        let diff = Math.abs(endDate.getTime() - startDate.getTime());
        
        // 밀리초를 일로 변환
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(days / 7);
        
        // 월 차이 계산 (대략적인 계산)
        let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
        months += endDate.getMonth() - startDate.getMonth();
        
        // 일 보정 (1월 15일 -> 2월 10일은 1개월로 계산)
        if (endDate.getDate() < startDate.getDate()) {
            months--;
        }
        
        // 년 차이 계산
        const years = Math.floor(months / 12);
        
        // 결과 표시
        diffDaysDiv.textContent = `일 수: ${days}일`;
        diffWeeksDiv.textContent = `주 수: ${weeks}주 ${days % 7}일`;
        diffMonthsDiv.textContent = `월 수: ${Math.abs(months)}개월 ${days - Math.floor(months * 30)}일 (대략)`;
        diffYearsDiv.textContent = `년 수: ${years}년 ${months % 12}개월`;
        
        diffResultDiv.style.display = 'block';
    }
    
    // 날짜 더하기/빼기 함수
    function calculateDateAddSub() {
        const baseDate = new Date(baseDateInput.value);
        const operation = operationSelect.value;
        const durationValue = parseInt(durationValueInput.value);
        const durationUnit = durationUnitSelect.value;
        
        // 입력 유효성 검사
        if (isNaN(baseDate.getTime()) || isNaN(durationValue) || durationValue < 0) {
            alert('유효한 입력값을 입력해주세요.');
            return;
        }
        
        // 새 날짜 계산
        const newDate = new Date(baseDate);
        
        if (operation === 'add') {
            // 더하기 연산
            switch (durationUnit) {
                case 'days':
                    newDate.setDate(newDate.getDate() + durationValue);
                    break;
                case 'weeks':
                    newDate.setDate(newDate.getDate() + (durationValue * 7));
                    break;
                case 'months':
                    newDate.setMonth(newDate.getMonth() + durationValue);
                    break;
                case 'years':
                    newDate.setFullYear(newDate.getFullYear() + durationValue);
                    break;
            }
        } else {
            // 빼기 연산
            switch (durationUnit) {
                case 'days':
                    newDate.setDate(newDate.getDate() - durationValue);
                    break;
                case 'weeks':
                    newDate.setDate(newDate.getDate() - (durationValue * 7));
                    break;
                case 'months':
                    newDate.setMonth(newDate.getMonth() - durationValue);
                    break;
                case 'years':
                    newDate.setFullYear(newDate.getFullYear() - durationValue);
                    break;
            }
        }
        
        // 결과 표시
        const formattedDate = formatDateForDisplay(newDate);
        newDateDiv.textContent = `계산된 날짜: ${formattedDate}`;
        
        addSubResultDiv.style.display = 'block';
    }
    
    // 업무일 계산 함수
    function calculateWorkdays() {
        const startDate = new Date(workStartDateInput.value);
        const endDate = new Date(workEndDateInput.value);
        const excludeWeekends = excludeWeekendsSelect.value === 'yes';
        
        // 입력 유효성 검사
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            alert('유효한 날짜를 입력해주세요.');
            return;
        }
        
        // 총 일수 계산
        const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        // 주말 계산
        let weekendCount = 0;
        let currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) { // 0: 일요일, 6: 토요일
                weekendCount++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // 업무일 계산
        const workdayCount = excludeWeekends ? totalDays - weekendCount : totalDays;
        
        // 결과 표시
        workdayCountDiv.textContent = `업무일 수: ${workdayCount}일`;
        weekendCountDiv.textContent = `주말 수: ${weekendCount}일`;
        
        workdayResultDiv.style.display = 'block';
    }
    
    // 시간 변환 함수
    function convertTime() {
        const timeValue = parseFloat(timeValueInput.value);
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;
        
        // 입력 유효성 검사
        if (isNaN(timeValue) || timeValue < 0) {
            alert('유효한 시간 값을 입력해주세요.');
            return;
        }
        
        // 모든 단위를 초로 변환
        let seconds;
        switch (fromUnit) {
            case 'seconds':
                seconds = timeValue;
                break;
            case 'minutes':
                seconds = timeValue * 60;
                break;
            case 'hours':
                seconds = timeValue * 60 * 60;
                break;
            case 'days':
                seconds = timeValue * 24 * 60 * 60;
                break;
        }
        
        // 초에서 목표 단위로 변환
        let result;
        switch (toUnit) {
            case 'seconds':
                result = seconds;
                break;
            case 'minutes':
                result = seconds / 60;
                break;
            case 'hours':
                result = seconds / (60 * 60);
                break;
            case 'days':
                result = seconds / (24 * 60 * 60);
                break;
        }
        
        // 결과 표시
        convertedTimeDiv.textContent = `${timeValue} ${getUnitName(fromUnit)} = ${result.toFixed(2)} ${getUnitName(toUnit)}`;
        
        timeConvResultDiv.style.display = 'block';
    }
    
    // 단위 이름 반환 함수
    function getUnitName(unit) {
        switch (unit) {
            case 'seconds':
                return '초';
            case 'minutes':
                return '분';
            case 'hours':
                return '시간';
            case 'days':
                return '일';
            default:
                return unit;
        }
    }
    
    // 입력 필드용 날짜 형식 (YYYY-MM-DD)
    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // 표시용 날짜 형식 (YYYY년 MM월 DD일 요일)
    function formatDateForDisplay(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekDay = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
        
        return `${year}년 ${month}월 ${day}일 (${weekDay})`;
    }
    
    // 공유 기능 설정
    setupShareButtons();
});

// 공유 버튼 설정 함수
function setupShareButtons() {
    const kakaoShareBtn = document.getElementById('kakao-share');
    const facebookShareBtn = document.getElementById('facebook-share');
    const twitterShareBtn = document.getElementById('twitter-share');
    const threadsShareBtn = document.getElementById('threads-share');
    const linkCopyBtn = document.getElementById('link-copy');
    
    // 카카오톡 공유 버튼 이벤트
    if (kakaoShareBtn) {
        kakaoShareBtn.addEventListener('click', function() {
            if (!window.Kakao) {
                alert('카카오톡 SDK를 불러올 수 없습니다.');
                return;
            }
            
            // SDK 초기화 확인 및 재시도
            if (!window.Kakao.isInitialized()) {
                window.Kakao.init('e06d0ee93e450a11bc6451d46e09cd88');
            }
            
            try {
                if (window.Kakao.Share) {
                    // 최신 SDK Share 객체 사용
                    window.Kakao.Share.sendDefault({
                        objectType: 'feed',
                        content: {
                            title: '시간/날짜 계산기 - BrainDetox Utility Box',
                            description: '날짜 간 차이, D-day, 업무일 계산 등 다양한 날짜 및 시간 계산 기능',
                            imageUrl: 'https://braindetox.kr/site_logo.png',
                            link: {
                                mobileWebUrl: window.location.href,
                                webUrl: window.location.href
                            }
                        },
                        buttons: [
                            {
                                title: '웹으로 보기',
                                link: {
                                    mobileWebUrl: window.location.href,
                                    webUrl: window.location.href
                                }
                            }
                        ]
                    });
                } else {
                    // 웹 공유 사용
                    window.open(`https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('시간/날짜 계산기 - BrainDetox Utility Box')}`, 'kakaotalk_share', 'width=350, height=650');
                }
            } catch (error) {
                console.error('카카오톡 공유 중 오류 발생:', error);
                alert('카카오톡 공유 기능을 사용할 수 없습니다. 다른 방법으로 공유해 주세요.');
            }
        });
    }
    
    // 페이스북 공유 버튼 이벤트
    if (facebookShareBtn) {
        facebookShareBtn.addEventListener('click', function() {
            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
            window.open(shareUrl, 'facebook-share-dialog', 'width=626,height=436');
        });
    }
    
    // 트위터 공유 버튼 이벤트
    if (twitterShareBtn) {
        twitterShareBtn.addEventListener('click', function() {
            const text = '시간/날짜 계산기 - 날짜 차이, D-day, 업무일 계산 등 다양한 기능 제공';
            const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
            window.open(shareUrl, 'twitter-share-dialog', 'width=626,height=436');
        });
    }
    
    // 쓰레드 공유 버튼 이벤트
    if (threadsShareBtn) {
        threadsShareBtn.addEventListener('click', function() {
            // 쓰레드는 직접 공유 API가 없어서 링크 복사 후 알림
            const currentUrl = window.location.href;
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = currentUrl;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextArea);
            alert('링크가 복사되었습니다. 쓰레드 앱에 붙여넣기하여 공유하세요!');
        });
    }
    
    // 링크 복사 버튼 이벤트
    if (linkCopyBtn) {
        linkCopyBtn.addEventListener('click', function() {
            const tempInput = document.createElement('input');
            document.body.appendChild(tempInput);
            tempInput.value = window.location.href;
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            alert('링크가 클립보드에 복사되었습니다.');
        });
    }
}