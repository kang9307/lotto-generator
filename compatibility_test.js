// 궁합 테스트 JavaScript

// 탭 전환 기능
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.compatibility-tab');
    const sections = document.querySelectorAll('.compatibility-section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // 모든 탭 비활성화
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // 클릭된 탭 활성화
            this.classList.add('active');
            document.getElementById(`${targetTab}-section`).classList.add('active');
            
            // 결과 숨기기
            document.getElementById('compatibility-result').classList.remove('active');
        });
    });
});

// 이름 호환성 데이터
const nameCompatibilityData = {
    excellent: ['가-나', '김-이', '박-최', '정-한', '조-윤', '장-임', '오-서', '신-권', '황-안', '송-홍'],
    good: ['가-다', '김-박', '이-정', '최-조', '한-장', '윤-오', '임-서', '신-황', '권-안', '송-홍'],
    normal: ['가-라', '김-최', '이-조', '박-한', '정-윤', '장-임', '오-신', '서-권', '황-송', '안-홍'],
    poor: ['가-마', '김-한', '이-윤', '박-임', '최-오', '정-서', '조-신', '장-권', '황-송', '안-홍']
};

// MBTI 궁합 데이터
const mbtiCompatibility = {
    'INTJ': { 
        'ENFP': 95, 'ENTP': 90, 'INFJ': 85, 'INFP': 80, 'ENTJ': 75, 'INTP': 70,
        'ENFJ': 65, 'ISTJ': 60, 'ISFJ': 55, 'ESTJ': 50, 'ESFJ': 45, 'ISTP': 40,
        'ISFP': 35, 'ESTP': 30, 'ESFP': 25, 'INTJ': 70
    },
    'INTP': {
        'ENFJ': 95, 'ENTJ': 90, 'INFJ': 85, 'ENFP': 80, 'INTJ': 75, 'ENTP': 70,
        'INFP': 65, 'ISTJ': 60, 'ISFJ': 55, 'ESTJ': 50, 'ESFJ': 45, 'ISTP': 40,
        'ISFP': 35, 'ESTP': 30, 'ESFP': 25, 'INTP': 70
    },
    'ENTJ': {
        'INFP': 95, 'INTP': 90, 'ENFJ': 85, 'ENFP': 80, 'INTJ': 75, 'ENTP': 70,
        'INFJ': 65, 'ISTJ': 60, 'ISFJ': 55, 'ESTJ': 50, 'ESFJ': 45, 'ISTP': 40,
        'ISFP': 35, 'ESTP': 30, 'ESFP': 25, 'ENTJ': 70
    },
    'ENTP': {
        'INFJ': 95, 'INTJ': 90, 'ENFJ': 85, 'INFP': 80, 'ENTJ': 75, 'INTP': 70,
        'ENFP': 65, 'ISTJ': 60, 'ISFJ': 55, 'ESTJ': 50, 'ESFJ': 45, 'ISTP': 40,
        'ISFP': 35, 'ESTP': 30, 'ESFP': 25, 'ENTP': 70
    },
    'INFJ': {
        'ENTP': 95, 'ENFP': 90, 'INTJ': 85, 'INFP': 80, 'ENFJ': 75, 'ENTJ': 70,
        'INTP': 65, 'ISTJ': 60, 'ISFJ': 55, 'ESTJ': 50, 'ESFJ': 45, 'ISTP': 40,
        'ISFP': 35, 'ESTP': 30, 'ESFP': 25, 'INFJ': 70
    },
    'INFP': {
        'ENFJ': 95, 'ENTJ': 90, 'ENFP': 85, 'INFJ': 80, 'ENTP': 75, 'INTJ': 70,
        'INTP': 65, 'ISTJ': 60, 'ISFJ': 55, 'ESTJ': 50, 'ESFJ': 45, 'ISTP': 40,
        'ISFP': 35, 'ESTP': 30, 'ESFP': 25, 'INFP': 70
    },
    'ENFJ': {
        'INFP': 95, 'INTP': 90, 'ENFP': 85, 'INFJ': 80, 'ENTP': 75, 'ENTJ': 70,
        'INTJ': 65, 'ISTJ': 60, 'ISFJ': 55, 'ESTJ': 50, 'ESFJ': 45, 'ISTP': 40,
        'ISFP': 35, 'ESTP': 30, 'ESFP': 25, 'ENFJ': 70
    },
    'ENFP': {
        'INTJ': 95, 'INFJ': 90, 'ENFJ': 85, 'INFP': 80, 'ENTP': 75, 'ENTJ': 70,
        'INTP': 65, 'ISTJ': 60, 'ISFJ': 55, 'ESTJ': 50, 'ESFJ': 45, 'ISTP': 40,
        'ISFP': 35, 'ESTP': 30, 'ESFP': 25, 'ENFP': 70
    },
    'ISTJ': {
        'ESFP': 90, 'ESTP': 85, 'ISFP': 80, 'ESFJ': 75, 'ENFP': 70, 'ESTJ': 65,
        'ISFJ': 60, 'INTJ': 55, 'INFJ': 50, 'ENTJ': 45, 'ENFJ': 40, 'INTP': 35,
        'INFP': 30, 'ENTP': 25, 'ISTP': 20, 'ISTJ': 70
    },
    'ISFJ': {
        'ESFP': 90, 'ESTP': 85, 'ENFP': 80, 'ESFJ': 75, 'ISFP': 70, 'ESTJ': 65,
        'ISTJ': 60, 'INTJ': 55, 'INFJ': 50, 'ENTJ': 45, 'ENFJ': 40, 'INTP': 35,
        'INFP': 30, 'ENTP': 25, 'ISTP': 20, 'ISFJ': 70
    },
    'ESTJ': {
        'ISFP': 90, 'ISTP': 85, 'ESFP': 80, 'ISFJ': 75, 'ENFP': 70, 'ISTJ': 65,
        'ESFJ': 60, 'INTJ': 55, 'INFJ': 50, 'ENTJ': 45, 'ENFJ': 40, 'INTP': 35,
        'INFP': 30, 'ENTP': 25, 'ESTP': 20, 'ESTJ': 70
    },
    'ESFJ': {
        'ISFP': 90, 'ISTP': 85, 'ESFP': 80, 'ISTJ': 75, 'ENFP': 70, 'ISFJ': 65,
        'ESTJ': 60, 'INTJ': 55, 'INFJ': 50, 'ENTJ': 45, 'ENFJ': 40, 'INTP': 35,
        'INFP': 30, 'ENTP': 25, 'ESTP': 20, 'ESFJ': 70
    },
    'ISTP': {
        'ESFJ': 90, 'ESTJ': 85, 'ISFJ': 80, 'ESFP': 75, 'ENFJ': 70, 'ESTP': 65,
        'ISFP': 60, 'INTJ': 55, 'INFJ': 50, 'ENTJ': 45, 'ENFP': 40, 'INTP': 35,
        'INFP': 30, 'ENTP': 25, 'ISTJ': 20, 'ISTP': 70
    },
    'ISFP': {
        'ESFJ': 90, 'ESTJ': 85, 'ENFJ': 80, 'ESFP': 75, 'ISFJ': 70, 'ESTP': 65,
        'ISTP': 60, 'INTJ': 55, 'INFJ': 50, 'ENTJ': 45, 'ENFP': 40, 'INTP': 35,
        'INFP': 30, 'ENTP': 25, 'ISTJ': 20, 'ISFP': 70
    },
    'ESTP': {
        'ISFJ': 90, 'ISTJ': 85, 'ESFJ': 80, 'ISFP': 75, 'ENFJ': 70, 'ISTP': 65,
        'ESFP': 60, 'INTJ': 55, 'INFJ': 50, 'ENTJ': 45, 'ENFP': 40, 'INTP': 35,
        'INFP': 30, 'ENTP': 25, 'ESTJ': 20, 'ESTP': 70
    },
    'ESFP': {
        'ISFJ': 90, 'ISTJ': 85, 'ESFJ': 80, 'ENFJ': 75, 'ISFP': 70, 'ISTP': 65,
        'ESTP': 60, 'INTJ': 55, 'INFJ': 50, 'ENTJ': 45, 'ENFP': 40, 'INTP': 35,
        'INFP': 30, 'ENTP': 25, 'ESTJ': 20, 'ESFP': 70
    }
};

// 별자리 궁합 데이터
const zodiacCompatibility = {
    '양자리': {
        '사자자리': 95, '사수자리': 90, '쌍둥이자리': 85, '물병자리': 80, '양자리': 75,
        '천칭자리': 70, '처녀자리': 65, '전갈자리': 60, '물고기자리': 55, '황소자리': 50,
        '게자리': 45, '염소자리': 40
    },
    '황소자리': {
        '처녀자리': 95, '염소자리': 90, '게자리': 85, '물고기자리': 80, '황소자리': 75,
        '전갈자리': 70, '사자자리': 65, '물병자리': 60, '사수자리': 55, '양자리': 50,
        '쌍둥이자리': 45, '천칭자리': 40
    },
    '쌍둥이자리': {
        '천칭자리': 95, '물병자리': 90, '양자리': 85, '사자자리': 80, '쌍둥이자리': 75,
        '사수자리': 70, '처녀자리': 65, '물고기자리': 60, '염소자리': 55, '황소자리': 50,
        '게자리': 45, '전갈자리': 40
    },
    '게자리': {
        '전갈자리': 95, '물고기자리': 90, '황소자리': 85, '처녀자리': 80, '게자리': 75,
        '염소자리': 70, '사자자리': 65, '물병자리': 60, '사수자리': 55, '쌍둥이자리': 50,
        '양자리': 45, '천칭자리': 40
    },
    '사자자리': {
        '양자리': 95, '사수자리': 90, '쌍둥이자리': 85, '천칭자리': 80, '사자자리': 75,
        '물병자리': 70, '전갈자리': 65, '황소자리': 60, '처녀자리': 55, '게자리': 50,
        '염소자리': 45, '물고기자리': 40
    },
    '처녀자리': {
        '황소자리': 95, '염소자리': 90, '게자리': 85, '전갈자리': 80, '처녀자리': 75,
        '물고기자리': 70, '양자리': 65, '사자자리': 60, '천칭자리': 55, '사수자리': 50,
        '물병자리': 45, '쌍둥이자리': 40
    },
    '천칭자리': {
        '쌍둥이자리': 95, '물병자리': 90, '사자자리': 85, '사수자리': 80, '천칭자리': 75,
        '양자리': 70, '게자리': 65, '처녀자리': 60, '전갈자리': 55, '염소자리': 50,
        '물고기자리': 45, '황소자리': 40
    },
    '전갈자리': {
        '게자리': 95, '물고기자리': 90, '처녀자리': 85, '염소자리': 80, '전갈자리': 75,
        '황소자리': 70, '천칭자리': 65, '사수자리': 60, '물병자리': 55, '양자리': 50,
        '사자자리': 45, '쌍둥이자리': 40
    },
    '사수자리': {
        '양자리': 95, '사자자리': 90, '물병자리': 85, '천칭자리': 80, '사수자리': 75,
        '쌍둥이자리': 70, '처녀자리': 65, '물고기자리': 60, '게자리': 55, '황소자리': 50,
        '전갈자리': 45, '염소자리': 40
    },
    '염소자리': {
        '황소자리': 95, '처녀자리': 90, '전갈자리': 85, '물고기자리': 80, '염소자리': 75,
        '게자리': 70, '천칭자리': 65, '양자리': 60, '사자자리': 55, '쌍둥이자리': 50,
        '사수자리': 45, '물병자리': 40
    },
    '물병자리': {
        '쌍둥이자리': 95, '천칭자리': 90, '사수자리': 85, '양자리': 80, '물병자리': 75,
        '사자자리': 70, '염소자리': 65, '전갈자리': 60, '물고기자리': 55, '처녀자리': 50,
        '황소자리': 45, '게자리': 40
    },
    '물고기자리': {
        '게자리': 95, '전갈자리': 90, '황소자리': 85, '염소자리': 80, '물고기자리': 75,
        '처녀자리': 70, '사수자리': 65, '양자리': 60, '천칭자리': 55, '사자자리': 50,
        '물병자리': 45, '쌍둥이자리': 40
    }
};

// 이름 궁합 계산
function calculateNameCompatibility() {
    const name1 = document.getElementById('name1').value.trim();
    const name2 = document.getElementById('name2').value.trim();
    const birth1 = document.getElementById('birth1').value;
    const birth2 = document.getElementById('birth2').value;
    
    if (!name1 || !name2 || !birth1 || !birth2) {
        alert('모든 정보를 입력해주세요.');
        return;
    }
    
    // 이름 호환성 계산
    const nameScore = calculateNameScore(name1, name2);
    
    // 생년월일 호환성 계산
    const birthScore = calculateBirthScore(birth1, birth2);
    
    // 전체 점수 계산
    const totalScore = Math.round((nameScore + birthScore) / 2);
    
    // 결과 표시
    displayCompatibilityResult(totalScore, 'name', {
        name1: name1,
        name2: name2,
        nameScore: nameScore,
        birthScore: birthScore
    });
}

// 이름 점수 계산 함수
function calculateNameScore(name1, name2) {
    // 이름의 자음과 모음을 분석하여 점수 계산
    const score1 = getNameNumericValue(name1);
    const score2 = getNameNumericValue(name2);
    
    const difference = Math.abs(score1 - score2);
    const maxDiff = Math.max(score1, score2);
    
    if (maxDiff === 0) return 70;
    
    const compatibility = 100 - (difference / maxDiff) * 50;
    return Math.max(40, Math.min(95, Math.round(compatibility)));
}

// 이름의 숫자 값 계산
function getNameNumericValue(name) {
    let total = 0;
    for (let i = 0; i < name.length; i++) {
        total += name.charCodeAt(i);
    }
    return total % 100;
}

// 생년월일 점수 계산
function calculateBirthScore(birth1, birth2) {
    const date1 = new Date(birth1);
    const date2 = new Date(birth2);
    
    // 나이 차이 계산
    const ageDiff = Math.abs(date1.getFullYear() - date2.getFullYear());
    
    // 월 호환성 계산
    const monthDiff = Math.abs(date1.getMonth() - date2.getMonth());
    
    // 일 호환성 계산
    const daySum = (date1.getDate() + date2.getDate()) % 10;
    
    let score = 80;
    
    // 나이 차이에 따른 점수 조정
    if (ageDiff <= 3) score += 10;
    else if (ageDiff <= 7) score += 5;
    else if (ageDiff > 15) score -= 15;
    
    // 월 차이에 따른 점수 조정
    if (monthDiff <= 2 || monthDiff >= 10) score += 5;
    else if (monthDiff >= 5 && monthDiff <= 7) score -= 5;
    
    // 생일 합에 따른 점수 조정
    if (daySum === 0 || daySum === 9) score += 10;
    else if (daySum === 7 || daySum === 3) score += 5;
    
    return Math.max(40, Math.min(95, score));
}

// MBTI 궁합 계산
function calculateMBTICompatibility() {
    const mbti1 = document.getElementById('mbti1').value;
    const mbti2 = document.getElementById('mbti2').value;
    
    if (!mbti1 || !mbti2) {
        alert('두 사람의 MBTI를 모두 선택해주세요.');
        return;
    }
    
    const score = mbtiCompatibility[mbti1][mbti2] || 50;
    
    displayCompatibilityResult(score, 'mbti', {
        mbti1: mbti1,
        mbti2: mbti2
    });
}

// 별자리 궁합 계산
function calculateZodiacCompatibility() {
    const zodiac1 = document.getElementById('zodiac1').value;
    const zodiac2 = document.getElementById('zodiac2').value;
    
    if (!zodiac1 || !zodiac2) {
        alert('두 사람의 별자리를 모두 선택해주세요.');
        return;
    }
    
    const score = zodiacCompatibility[zodiac1][zodiac2] || 50;
    
    displayCompatibilityResult(score, 'zodiac', {
        zodiac1: zodiac1,
        zodiac2: zodiac2
    });
}

// 궁합 결과 표시
function displayCompatibilityResult(score, type, data) {
    const resultDiv = document.getElementById('compatibility-result');
    
    let level, levelClass, description, details;
    
    if (score >= 90) {
        level = '💎 환상의 궁합';
        levelClass = 'level-excellent';
        description = '정말 완벽한 궁합입니다! 서로를 깊이 이해하고 보완해주는 최고의 관계입니다.';
    } else if (score >= 80) {
        level = '💖 최고의 궁합';
        levelClass = 'level-great';
        description = '매우 좋은 궁합입니다! 서로에게 큰 힘이 되어주는 특별한 관계입니다.';
    } else if (score >= 70) {
        level = '💕 좋은 궁합';
        levelClass = 'level-good';
        description = '좋은 궁합입니다! 서로 노력한다면 더욱 발전할 수 있는 관계입니다.';
    } else if (score >= 60) {
        level = '💛 보통 궁합';
        levelClass = 'level-normal';
        description = '평범한 궁합입니다. 서로의 차이점을 인정하고 이해한다면 좋은 관계가 될 수 있습니다.';
    } else {
        level = '💙 노력이 필요한 궁합';
        levelClass = 'level-effort';
        description = '조금 더 노력이 필요한 궁합입니다. 서로를 더 깊이 알아가는 시간이 필요합니다.';
    }
    
    // 세부 정보 생성
    if (type === 'name') {
        details = `
            <div class="detail-card">
                <h4>이름 궁합</h4>
                <div class="score">${data.nameScore}점</div>
                <div class="description">이름의 조화</div>
            </div>
            <div class="detail-card">
                <h4>생년월일 궁합</h4>
                <div class="score">${data.birthScore}점</div>
                <div class="description">생년월일의 조화</div>
            </div>
        `;
    } else if (type === 'mbti') {
        details = `
            <div class="detail-card">
                <h4>${data.mbti1}</h4>
                <div class="score">첫 번째</div>
                <div class="description">성격 유형</div>
            </div>
            <div class="detail-card">
                <h4>${data.mbti2}</h4>
                <div class="score">두 번째</div>
                <div class="description">성격 유형</div>
            </div>
        `;
    } else if (type === 'zodiac') {
        details = `
            <div class="detail-card">
                <h4>${data.zodiac1}</h4>
                <div class="score">첫 번째</div>
                <div class="description">별자리</div>
            </div>
            <div class="detail-card">
                <h4>${data.zodiac2}</h4>
                <div class="score">두 번째</div>
                <div class="description">별자리</div>
            </div>
        `;
    }
    
    resultDiv.innerHTML = `
        <h2>💝 궁합 테스트 결과</h2>
        <div class="compatibility-score">${score}점</div>
        <div class="compatibility-level ${levelClass}">${level}</div>
        <div class="compatibility-description">${description}</div>
        <div class="compatibility-details">${details}</div>
        
        <div class="share-section">
            <h3 style="text-align: center; margin-bottom: 20px;">🎉 결과를 친구들과 공유해보세요!</h3>
            <div class="share-buttons">
                <button id="kakao-share" class="share-btn kakao-btn" onclick="shareKakao()">
                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj48cGF0aCBkPSJNMTIgM2M1LjggMCA5IDMuMSA5IDYuNSAwIDIuNCAxLjIgNC41LTMgNi41bDEuNSAzLjVzLjEuMyAwIC4zYy0uMSAwLS4yLS4xLS4zLS4yTDE2IDEzLjhjLTEuMi4zLTIuNi41LTQgLjUtNS44IDAtOS0zLjEtOS02LjVTNi4yIDMgMTIgM3oiIGZpbGw9IiMzQzFFMUUiLz48L3N2Zz4=" alt="카카오톡 공유">
                    카카오톡
                </button>
                <button id="facebook-share" class="share-btn facebook-btn" onclick="shareFacebook()">
                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTE4IDJoLTNhNSA1IDAgMCAwLTUgNXYzSDd2NGgzdjhoNHYtOGgzbC0xLTRoLTJWN2EyIDIgMCAwIDEgMi0yaDN6Ii8+PC9zdmc+" alt="페이스북 공유">
                    페이스북
                </button>
                <button id="twitter-share" class="share-btn twitter-btn" onclick="shareTwitter()">
                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0ibTIzIDNhMTAuOSAxMC45IDAgMCAxLTMuMTQgMS41MyA0LjQ4IDQuNDggMCAwIDAtNy44NiAzdjFBMTAuNjYgMTAuNjYgMCAwIDEgMyA0czQgOSA1IDEwLTMgMi0zIDJhMjIgMjIgMCAwIDAgMTEtMUE4IDE0IDAgMCAwIDIzIDN6Ii8+PC9zdmc+" alt="트위터 공유">
                    X(트위터)
                </button>
                <button id="threads-share" class="share-btn threads-btn" onclick="shareThreads()">
                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDJhOSA5IDAgMCAxIDkgOXYxYTkgOSAwIDAgMS0xOCAwdi0xYTkgOSAwIDAgMSA5LTl6Ii8+PHBhdGggZD0iTTEyIDZhMyAzIDAgMCAxIDMgM3YzYTMgMyAwIDAgMS02IDBWOWEzIDMgMCAwIDEgMy0zeiIvPjwvc3ZnPg==" alt="쓰레드 공유">
                    Threads
                </button>
            </div>
        </div>
    `;
    
    // CSS 클래스 추가
    const style = document.createElement('style');
    style.textContent = `
        .level-excellent { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; }
        .level-great { background: linear-gradient(135deg, #ff9f43, #feca57); color: white; }
        .level-good { background: linear-gradient(135deg, #48dbfb, #0abde3); color: white; }
        .level-normal { background: linear-gradient(135deg, #1dd1a1, #10ac84); color: white; }
        .level-effort { background: linear-gradient(135deg, #a55eea, #8c7ae6); color: white; }
    `;
    document.head.appendChild(style);
    
    resultDiv.classList.add('active');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
} 