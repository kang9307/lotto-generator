/**
 * 비밀번호 생성기 (Password Generator)
 * Copyright (c) 2025 braindetox.kr
 * All rights reserved.
 */

document.addEventListener('DOMContentLoaded', function() {
    // 요소 참조 - 생성기
    const passwordOutput = document.getElementById('password-output');
    const copyBtn = document.getElementById('copy-password');
    const generateBtn = document.getElementById('generate-password');
    const lengthSlider = document.getElementById('password-length');
    const lengthValue = document.getElementById('length-value');
    const strengthText = document.getElementById('strength-text');
    const strengthBar = document.getElementById('strength-bar');
    
    // 옵션 체크박스 - 생성기
    const includeUppercase = document.getElementById('include-uppercase');
    const includeLowercase = document.getElementById('include-lowercase');
    const includeNumbers = document.getElementById('include-numbers');
    const includeSymbols = document.getElementById('include-symbols');
    const excludeSimilar = document.getElementById('exclude-similar');
    
    // 요소 참조 - 검증기
    const validatePasswordInput = document.getElementById('validate-password');
    const validatePasswordBtn = document.getElementById('validate-password-btn');
    const togglePasswordVisibilityBtn = document.getElementById('toggle-password-visibility');
    const validatorStrengthText = document.getElementById('validator-strength-text');
    const validatorStrengthBar = document.getElementById('validator-strength-bar');
    
    // 검증 기준 요소들
    const lengthCriteria = document.getElementById('length-criteria');
    const uppercaseCriteria = document.getElementById('uppercase-criteria');
    const lowercaseCriteria = document.getElementById('lowercase-criteria');
    const numberCriteria = document.getElementById('number-criteria');
    const symbolCriteria = document.getElementById('symbol-criteria');
    const repeatCriteria = document.getElementById('repeat-criteria');
    
    // 탭 기능
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            // 탭 활성화
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 콘텐츠 활성화
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === target) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // 비밀번호 길이 슬라이더 업데이트
    lengthSlider.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });
    
    // 비밀번호 생성 버튼 클릭 이벤트
    generateBtn.addEventListener('click', generatePassword);
    
    // 복사 버튼 클릭 이벤트
    copyBtn.addEventListener('click', function() {
        if (passwordOutput.textContent !== '여기에 생성된 비밀번호가 표시됩니다') {
            // 비밀번호 텍스트 선택 및 복사
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = passwordOutput.textContent.trim();
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextArea);
            
            // 복사 버튼 텍스트 변경
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '복사됨!';
            
            // 2초 후 원래 텍스트로 복원
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        }
    });
    
    // 검증기 기능
    if (validatePasswordBtn) {
        // 비밀번호 검증 버튼 클릭 이벤트
        validatePasswordBtn.addEventListener('click', function() {
            validatePassword();
        });
        
        // 입력 필드에서 엔터 키 이벤트
        validatePasswordInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                validatePasswordBtn.click();
            }
        });
    }
    
    // 비밀번호 가시성 토글 버튼
    if (togglePasswordVisibilityBtn) {
        togglePasswordVisibilityBtn.addEventListener('click', function() {
            if (validatePasswordInput.type === 'password') {
                validatePasswordInput.type = 'text';
                togglePasswordVisibilityBtn.textContent = '비밀번호 숨기기';
            } else {
                validatePasswordInput.type = 'password';
                togglePasswordVisibilityBtn.textContent = '비밀번호 보기';
            }
        });
    }
    
    // 비밀번호 검증 함수
    function validatePassword() {
        const password = validatePasswordInput.value;
        
        if (!password) {
            alert('비밀번호를 입력해주세요.');
            return;
        }
        
        // 기준 검사
        const hasLength = password.length >= 12;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSymbols = /[^A-Za-z0-9]/.test(password);
        const hasNoRepeat = !(/(.)\1{2,}/.test(password));
        
        // 기준 결과 업데이트
        updateCriteria(lengthCriteria, hasLength);
        updateCriteria(uppercaseCriteria, hasUpper);
        updateCriteria(lowercaseCriteria, hasLower);
        updateCriteria(numberCriteria, hasNumbers);
        updateCriteria(symbolCriteria, hasSymbols);
        updateCriteria(repeatCriteria, hasNoRepeat);
        
        // 강도 평가
        const strengthResult = evaluatePasswordStrength(password);
        
        // 강도 표시 업데이트
        validatorStrengthText.textContent = strengthResult.strength;
        validatorStrengthBar.className = 'strength-bar';
        validatorStrengthBar.classList.add(strengthResult.barClass);
    }
    
    // 기준 충족 여부 UI 업데이트
    function updateCriteria(criteriaElement, isMet) {
        const iconElement = criteriaElement.querySelector('.criteria-icon');
        
        if (isMet) {
            iconElement.textContent = '✅';
            criteriaElement.classList.add('criteria-met');
            criteriaElement.classList.remove('criteria-unmet');
        } else {
            iconElement.textContent = '❌';
            criteriaElement.classList.add('criteria-unmet');
            criteriaElement.classList.remove('criteria-met');
        }
    }
    
    // 비밀번호 생성 함수
    function generatePassword() {
        // 옵션 확인
        const length = parseInt(lengthSlider.value);
        const hasUpper = includeUppercase.checked;
        const hasLower = includeLowercase.checked;
        const hasNumbers = includeNumbers.checked;
        const hasSymbols = includeSymbols.checked;
        const hasSimilarExcluded = excludeSimilar.checked;
        
        // 적어도 하나의 문자 세트가 선택되었는지 확인
        if (!hasUpper && !hasLower && !hasNumbers && !hasSymbols) {
            alert('적어도 하나의 문자 유형을 선택해주세요.');
            return;
        }
        
        // 문자 세트 정의
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        // 비슷한 문자 (제외할 문자들)
        const similarChars = 'iIlL1oO0';
        
        // 사용할 문자 세트 구성
        let chars = '';
        
        if (hasUpper) chars += uppercaseChars;
        if (hasLower) chars += lowercaseChars;
        if (hasNumbers) chars += numberChars;
        if (hasSymbols) chars += symbolChars;
        
        // 비슷한 문자 제외 옵션이 활성화된 경우
        if (hasSimilarExcluded) {
            for (let i = 0; i < similarChars.length; i++) {
                chars = chars.replace(similarChars[i], '');
            }
        }
        
        // 비밀번호 생성
        let password = '';
        
        // 각 문자 유형이 최소 1개씩 포함되도록 함
        if (hasUpper) {
            const randomUpperIdx = Math.floor(Math.random() * uppercaseChars.length);
            password += uppercaseChars[randomUpperIdx];
        }
        
        if (hasLower) {
            const randomLowerIdx = Math.floor(Math.random() * lowercaseChars.length);
            password += lowercaseChars[randomLowerIdx];
        }
        
        if (hasNumbers) {
            const randomNumberIdx = Math.floor(Math.random() * numberChars.length);
            password += numberChars[randomNumberIdx];
        }
        
        if (hasSymbols) {
            const randomSymbolIdx = Math.floor(Math.random() * symbolChars.length);
            password += symbolChars[randomSymbolIdx];
        }
        
        // 나머지 길이만큼 랜덤 문자 추가
        for (let i = password.length; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }
        
        // 비밀번호 문자 순서 섞기
        password = shuffleString(password);
        
        // 비밀번호 표시
        passwordOutput.textContent = password;
        
        // 비밀번호 강도 평가 및 표시
        const strengthResult = evaluatePasswordStrength(password);
        strengthText.textContent = strengthResult.strength;
        strengthBar.className = 'strength-bar';
        strengthBar.classList.add(strengthResult.barClass);
    }
    
    // 문자열을 무작위로 섞는 함수
    function shuffleString(string) {
        const array = string.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }
    
    // 비밀번호 강도 평가 함수
    function evaluatePasswordStrength(password) {
        // 기본 점수: 0
        let score = 0;
        
        // 길이 점수: 최대 40점
        const lengthScore = Math.min(40, password.length * 2);
        score += lengthScore;
        
        // 문자 다양성 점수
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSymbols = /[^A-Za-z0-9]/.test(password);
        
        // 각 문자 유형별 10점씩 부여
        if (hasUpper) score += 10;
        if (hasLower) score += 10;
        if (hasNumbers) score += 10;
        if (hasSymbols) score += 10;
        
        // 연속된 중복 패턴 감지 (감점)
        const repeatingPatterns = password.match(/(.)\1{2,}/g);
        if (repeatingPatterns) {
            score -= repeatingPatterns.length * 5;
        }
        
        // 점수 범위 조정: 0~100
        score = Math.max(0, Math.min(100, score));
        
        // 강도 평가
        let strength = '';
        let barClass = '';
        
        if (score < 30) {
            strength = '매우 약함';
            barClass = 'weak';
        } else if (score < 50) {
            strength = '약함';
            barClass = 'weak';
        } else if (score < 70) {
            strength = '보통';
            barClass = 'medium';
        } else if (score < 90) {
            strength = '강함';
            barClass = 'strong';
        } else {
            strength = '매우 강함';
            barClass = 'very-strong';
        }
        
        return { strength, barClass, score };
    }
    
    // 페이지 로드 시 초기 비밀번호 생성
    generatePassword();
}); 