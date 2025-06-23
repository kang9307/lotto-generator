/**
 * MBTI 성격 테스트 JavaScript
 * Copyright (c) 2025 braindetox.kr
 * All rights reserved.
 */

// MBTI 테스트 질문 데이터
const mbtiQuestions = [
    {
        id: 1,
        question: "파티나 모임에서 당신은 주로...",
        answers: [
            { text: "많은 사람들과 대화하며 활기를 얻는다", type: "E", score: 2 },
            { text: "소수의 친한 사람들과 깊은 대화를 나눈다", type: "I", score: 2 }
        ]
    },
    {
        id: 2,
        question: "새로운 정보를 받아들일 때...",
        answers: [
            { text: "구체적인 사실과 세부사항에 집중한다", type: "S", score: 2 },
            { text: "전체적인 의미와 가능성을 생각한다", type: "N", score: 2 }
        ]
    },
    {
        id: 3,
        question: "중요한 결정을 내릴 때 더 중요하게 생각하는 것은...",
        answers: [
            { text: "논리적 분석과 객관적 사실", type: "T", score: 2 },
            { text: "사람들의 감정과 가치관", type: "F", score: 2 }
        ]
    },
    {
        id: 4,
        question: "일상생활에서 당신은...",
        answers: [
            { text: "계획을 세우고 체계적으로 행동한다", type: "J", score: 2 },
            { text: "유연하게 상황에 맞춰 행동한다", type: "P", score: 2 }
        ]
    },
    {
        id: 5,
        question: "새로운 사람을 만날 때...",
        answers: [
            { text: "먼저 다가가서 대화를 시작한다", type: "E", score: 2 },
            { text: "상대방이 먼저 말을 걸어주길 기다린다", type: "I", score: 2 }
        ]
    },
    {
        id: 6,
        question: "문제를 해결할 때...",
        answers: [
            { text: "과거의 경험과 검증된 방법을 활용한다", type: "S", score: 2 },
            { text: "새로운 아이디어와 창의적 방법을 시도한다", type: "N", score: 2 }
        ]
    },
    {
        id: 7,
        question: "갈등 상황에서...",
        answers: [
            { text: "사실에 근거해 논리적으로 해결한다", type: "T", score: 2 },
            { text: "서로의 마음을 이해하려 노력한다", type: "F", score: 2 }
        ]
    },
    {
        id: 8,
        question: "휴가 계획을 세울 때...",
        answers: [
            { text: "미리 상세한 일정을 계획한다", type: "J", score: 2 },
            { text: "대략적인 계획만 세우고 즉흥적으로 즐긴다", type: "P", score: 2 }
        ]
    },
    {
        id: 9,
        question: "에너지를 충전하는 방법은...",
        answers: [
            { text: "사람들과 함께 활동적으로 시간을 보낸다", type: "E", score: 2 },
            { text: "혼자만의 조용한 시간을 갖는다", type: "I", score: 2 }
        ]
    },
    {
        id: 10,
        question: "학습할 때 선호하는 방식은...",
        answers: [
            { text: "단계별로 차근차근 익힌다", type: "S", score: 2 },
            { text: "전체적인 그림을 먼저 이해한다", type: "N", score: 2 }
        ]
    },
    {
        id: 11,
        question: "비판을 받을 때...",
        answers: [
            { text: "객관적으로 분석하고 개선점을 찾는다", type: "T", score: 2 },
            { text: "상처받지만 상대방의 의도를 이해하려 한다", type: "F", score: 2 }
        ]
    },
    {
        id: 12,
        question: "프로젝트를 진행할 때...",
        answers: [
            { text: "마감일을 정하고 계획대로 진행한다", type: "J", score: 2 },
            { text: "유연하게 상황에 맞춰 조정한다", type: "P", score: 2 }
        ]
    },
    {
        id: 13,
        question: "토론할 때 당신은...",
        answers: [
            { text: "적극적으로 의견을 표현한다", type: "E", score: 2 },
            { text: "신중하게 생각한 후 발언한다", type: "I", score: 2 }
        ]
    },
    {
        id: 14,
        question: "책을 읽을 때...",
        answers: [
            { text: "실용적이고 구체적인 내용을 선호한다", type: "S", score: 2 },
            { text: "철학적이고 추상적인 내용을 선호한다", type: "N", score: 2 }
        ]
    },
    {
        id: 15,
        question: "팀 프로젝트에서...",
        answers: [
            { text: "효율성과 성과에 집중한다", type: "T", score: 2 },
            { text: "팀원들의 화합과 협력에 집중한다", type: "F", score: 2 }
        ]
    },
    {
        id: 16,
        question: "쇼핑할 때...",
        answers: [
            { text: "필요한 것만 계획적으로 구매한다", type: "J", score: 2 },
            { text: "둘러보다가 마음에 드는 것을 즉석에서 구매한다", type: "P", score: 2 }
        ]
    },
    {
        id: 17,
        question: "스트레스를 받을 때...",
        answers: [
            { text: "친구들과 만나서 이야기한다", type: "E", score: 2 },
            { text: "혼자 있으면서 생각을 정리한다", type: "I", score: 2 }
        ]
    },
    {
        id: 18,
        question: "여행할 때 선호하는 스타일은...",
        answers: [
            { text: "유명한 관광지와 맛집을 체계적으로 둘러본다", type: "S", score: 2 },
            { text: "현지 문화를 체험하고 새로운 것을 발견한다", type: "N", score: 2 }
        ]
    },
    {
        id: 19,
        question: "중요한 결정을 내릴 때...",
        answers: [
            { text: "데이터와 논리를 바탕으로 판단한다", type: "T", score: 2 },
            { text: "직감과 가치관을 바탕으로 판단한다", type: "F", score: 2 }
        ]
    },
    {
        id: 20,
        question: "일하는 환경으로 선호하는 것은...",
        answers: [
            { text: "명확한 규칙과 체계가 있는 환경", type: "J", score: 2 },
            { text: "자유롭고 유연한 환경", type: "P", score: 2 }
        ]
    }
];

// MBTI 결과 데이터
const mbtiResults = {
    "ENFP": {
        title: "재기발랄한 활동가",
        nickname: "캠페이너",
        description: "열정적이고 창의적이며 사교적인 자유로운 영혼으로, 언제나 웃을 일과 희망을 찾을 수 있습니다.",
        strengths: ["뛰어난 의사소통 능력", "열정적이고 열의가 넘침", "창의적이고 독창적", "호기심이 많고 개방적"],
        weaknesses: ["집중력이 쉽게 흩어짐", "계획을 세우거나 따르기 어려움", "스트레스 상황에서 예민해짐", "일상적인 일에 쉽게 지루해함"],
        careers: ["마케팅 전문가", "상담사", "기자", "작가", "연예인", "교사"],
        compatibility: ["INFJ (옹호자)", "INTJ (건축가)"]
    },
    "ENFJ": {
        title: "정의로운 사회운동가",
        nickname: "주인공",
        description: "타고난 지도자로서 카리스마와 열정으로 사람들에게 영감을 주는 유형입니다.",
        strengths: ["뛰어난 리더십", "타인에 대한 깊은 공감", "설득력 있는 의사소통", "열정적이고 카리스마 있음"],
        weaknesses: ["자신보다 타인을 우선시", "비판에 지나치게 민감", "완벽주의 성향", "자신의 감정을 무시하기 쉬움"],
        careers: ["교사", "상담사", "정치인", "인사담당자", "코치", "사회복지사"],
        compatibility: ["INFP (중재자)", "ISFP (모험가)"]
    },
    "ENTP": {
        title: "뜨거운 논쟁을 즐기는 변론가",
        nickname: "토론자",
        description: "지적 도전을 즐기는 혁신가로, 새로운 아이디어와 가능성을 탐구하는 것을 좋아합니다.",
        strengths: ["혁신적이고 창의적", "뛰어난 토론 능력", "빠른 사고와 기지", "학습 능력이 뛰어남"],
        weaknesses: ["일상적인 일에 쉽게 지루해함", "세부사항을 놓치기 쉬움", "감정보다 논리를 우선시", "완료보다 시작을 선호"],
        careers: ["발명가", "변호사", "컨설턴트", "기업가", "과학자", "저널리스트"],
        compatibility: ["INFJ (옹호자)", "INTJ (건축가)"]
    },
    "ENTJ": {
        title: "대담한 통솔자",
        nickname: "지휘관",
        description: "타고난 지도자로서 목표를 향해 나아가며 다른 사람들도 함께 이끌어갑니다.",
        strengths: ["강력한 리더십", "전략적 사고", "목표 지향적", "효율성을 추구"],
        weaknesses: ["타인의 감정을 간과하기 쉬움", "지나치게 비판적일 수 있음", "인내심이 부족", "독단적으로 보일 수 있음"],
        careers: ["CEO", "관리자", "변호사", "투자가", "컨설턴트", "정치인"],
        compatibility: ["INFP (중재자)", "INTP (논리학자)"]
    },
    "INFP": {
        title: "열정적인 중재자",
        nickname: "중재자",
        description: "이상주의자이자 충성심이 강한 성격으로, 자신의 가치관과 신념을 소중히 여깁니다.",
        strengths: ["강한 가치관과 신념", "창의적이고 상상력 풍부", "타인에 대한 깊은 공감", "독립적이고 자율적"],
        weaknesses: ["비현실적인 기대", "자기비판이 심함", "스트레스에 민감", "갈등 상황을 회피"],
        careers: ["작가", "상담사", "예술가", "사회복지사", "심리학자", "종교인"],
        compatibility: ["ENFJ (주인공)", "ENTJ (지휘관)"]
    },
    "INFJ": {
        title: "선의의 옹호자",
        nickname: "옹호자",
        description: "이상주의적이고 원칙주의적이며 자신만의 확고한 신념과 가치관을 가지고 있습니다.",
        strengths: ["뛰어난 통찰력", "강한 직관력", "타인에 대한 깊은 배려", "창의적이고 독창적"],
        weaknesses: ["완벽주의 성향", "지나치게 민감함", "비현실적 기대", "고집이 셀 수 있음"],
        careers: ["상담사", "작가", "교사", "종교인", "예술가", "심리학자"],
        compatibility: ["ENFP (활동가)", "ENTP (토론자)"]
    },
    "INTP": {
        title: "논리적인 사색가",
        nickname: "논리학자",
        description: "지적 호기심이 많고 이론적 사고를 즐기며 복잡한 문제 해결을 좋아합니다.",
        strengths: ["뛰어난 논리적 사고", "창의적 문제 해결", "독립적이고 객관적", "학습 능력이 뛰어남"],
        weaknesses: ["감정 표현에 어려움", "실행력 부족", "사회적 상황에 어색함", "일상적 업무에 무관심"],
        careers: ["연구원", "과학자", "프로그래머", "교수", "분석가", "철학자"],
        compatibility: ["ENTJ (지휘관)", "ESTJ (경영자)"]
    },
    "INTJ": {
        title: "용의주도한 전략가",
        nickname: "건축가",
        description: "독립적이고 전략적인 사고를 하며 자신만의 비전을 실현하고자 합니다.",
        strengths: ["전략적 사고력", "독립적이고 자기주도적", "강한 결단력", "체계적이고 효율적"],
        weaknesses: ["사회적 상황에 어색함", "지나치게 비판적", "감정 표현 부족", "완벽주의로 인한 스트레스"],
        careers: ["전략기획자", "연구원", "건축가", "투자가", "경영진", "컨설턴트"],
        compatibility: ["ENFP (활동가)", "ENTP (토론자)"]
    },
    "ESFP": {
        title: "자유로운 연예인",
        nickname: "연예인",
        description: "활기차고 열정적이며 사람들과 함께하는 것을 좋아하는 자유로운 영혼입니다.",
        strengths: ["뛰어난 사교성", "긍정적이고 낙관적", "유연하고 적응력 좋음", "실용적이고 현실적"],
        weaknesses: ["계획 세우기를 어려워함", "집중력이 부족", "갈등 상황을 회피", "스트레스에 민감"],
        careers: ["연예인", "판매원", "이벤트 기획자", "디자이너", "요리사", "스포츠 선수"],
        compatibility: ["ISFJ (수호자)", "ISTJ (현실주의자)"]
    },
    "ESFJ": {
        title: "사교적인 외교관",
        nickname: "집정관",
        description: "친화적이고 외향적이며 다른 사람들을 도우며 화합을 이루고자 합니다.",
        strengths: ["뛰어난 사교성", "타인을 배려하고 협력적", "책임감이 강함", "조직적이고 체계적"],
        weaknesses: ["비판에 지나치게 민감", "갈등 상황을 회피", "변화에 대한 저항", "자신의 욕구를 뒤로 미룸"],
        careers: ["간호사", "교사", "인사담당자", "사회복지사", "비서", "판매원"],
        compatibility: ["ISFP (모험가)", "ISTP (만능재주꾼)"]
    },
    "ESTP": {
        title: "모험을 즐기는 사업가",
        nickname: "사업가",
        description: "현실적이고 활동적이며 즉흥적으로 문제를 해결하는 것을 좋아합니다.",
        strengths: ["뛰어난 실행력", "위기 상황 대처 능력", "사교적이고 활동적", "현실감각이 뛰어남"],
        weaknesses: ["장기 계획 부족", "성급하고 충동적", "감정적 측면 간과", "일상적 업무에 지루함"],
        careers: ["영업사원", "운동선수", "기업가", "경찰", "소방관", "응급의료진"],
        compatibility: ["ISFJ (수호자)", "ISTJ (현실주의자)"]
    },
    "ESTJ": {
        title: "엄격한 관리자",
        nickname: "경영자",
        description: "체계적이고 실용적이며 전통과 질서를 중시하는 타고난 관리자입니다.",
        strengths: ["강력한 리더십", "체계적이고 조직적", "책임감이 강함", "현실적이고 실용적"],
        weaknesses: ["융통성 부족", "감정적 측면 간과", "변화에 대한 저항", "지나치게 통제적"],
        careers: ["관리자", "공무원", "회계사", "은행원", "군인", "판사"],
        compatibility: ["ISFP (모험가)", "INTP (논리학자)"]
    },
    "ISFP": {
        title: "호기심 많은 예술가",
        nickname: "모험가",
        description: "온화하고 친근하며 자신만의 가치관과 신념을 소중히 여기는 예술가적 성향입니다.",
        strengths: ["뛰어난 예술적 감각", "타인에 대한 깊은 공감", "유연하고 개방적", "겸손하고 온화함"],
        weaknesses: ["자기주장이 부족", "계획 세우기 어려움", "스트레스에 민감", "현실 도피 성향"],
        careers: ["예술가", "디자이너", "상담사", "음악가", "작가", "사진작가"],
        compatibility: ["ENFJ (주인공)", "ESFJ (집정관)"]
    },
    "ISFJ": {
        title: "용감한 수호자",
        nickname: "수호자",
        description: "따뜻하고 책임감이 강하며 다른 사람들을 보호하고 도우려는 성향이 강합니다.",
        strengths: ["강한 책임감", "타인에 대한 깊은 배려", "충성심이 강함", "실용적이고 현실적"],
        weaknesses: ["자기주장 부족", "변화에 대한 저항", "스트레스를 내면화", "과도한 희생정신"],
        careers: ["간호사", "교사", "상담사", "사회복지사", "비서", "도서관 사서"],
        compatibility: ["ESFP (연예인)", "ESTP (사업가)"]
    },
    "ISTP": {
        title: "만능 재주꾼",
        nickname: "만능재주꾼",
        description: "조용하고 과묵하지만 위기 상황에서 뛰어난 문제 해결 능력을 발휘합니다.",
        strengths: ["뛰어난 문제해결능력", "실용적이고 현실적", "유연하고 적응력 좋음", "독립적이고 자유로움"],
        weaknesses: ["감정 표현 부족", "장기 계획 어려움", "사회적 상황에 어색함", "타인에 대한 무관심"],
        careers: ["기술자", "정비사", "엔지니어", "파일럿", "외과의", "건축가"],
        compatibility: ["ESFJ (집정관)", "ESTJ (경영자)"]
    },
    "ISTJ": {
        title: "현실주의자",
        nickname: "현실주의자",
        description: "신중하고 체계적이며 전통과 질서를 중시하는 현실주의적 성향입니다.",
        strengths: ["강한 책임감", "신뢰할 수 있음", "체계적이고 조직적", "현실감각이 뛰어남"],
        weaknesses: ["융통성 부족", "변화에 대한 저항", "감정 표현 부족", "완벽주의 성향"],
        careers: ["회계사", "공무원", "은행원", "법무관", "의사", "관리자"],
        compatibility: ["ESFP (연예인)", "ESTP (사업가)"]
    }
};

// 전역 변수
let currentQuestion = 0;
let answers = [];
let scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

// 테스트 시작
function startTest() {
    document.getElementById('intro-section').style.display = 'none';
    document.getElementById('test-section').style.display = 'block';
    
    currentQuestion = 0;
    answers = [];
    scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    
    renderQuestion();
    updateProgress();
    updateNavigationButtons();
}

// 질문 렌더링
function renderQuestion() {
    const container = document.getElementById('questions-container');
    const question = mbtiQuestions[currentQuestion];
    
    container.innerHTML = `
        <div class="question-card active">
            <div style="text-align: center; margin-bottom: 20px;">
                <div class="question-number">${currentQuestion + 1}</div>
            </div>
            <div class="question-text">${question.question}</div>
            <div class="answers-container">
                ${question.answers.map((answer, index) => `
                    <div class="answer-option" onclick="selectAnswer(${index})" data-index="${index}">
                        <div class="answer-text">${answer.text}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // 이전 답변이 있다면 표시
    if (answers[currentQuestion] !== undefined) {
        const selectedIndex = answers[currentQuestion];
        document.querySelector(`[data-index="${selectedIndex}"]`).classList.add('selected');
    }
}

// 답변 선택
function selectAnswer(answerIndex) {
    // 이전 선택 제거
    document.querySelectorAll('.answer-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // 새 선택 추가
    document.querySelector(`[data-index="${answerIndex}"]`).classList.add('selected');
    
    answers[currentQuestion] = answerIndex;
    updateNavigationButtons();
    
    // 약간의 딜레이 후 자동으로 다음 질문으로
    setTimeout(() => {
        if (currentQuestion < mbtiQuestions.length - 1) {
            nextQuestion();
        }
    }, 300);
}

// 진행률 업데이트
function updateProgress() {
    const progress = ((currentQuestion + 1) / mbtiQuestions.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('progress-text').textContent = `${currentQuestion + 1} / ${mbtiQuestions.length}`;
}

// 네비게이션 버튼 업데이트
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const finishBtn = document.getElementById('finish-btn');
    
    prevBtn.disabled = currentQuestion === 0;
    
    if (currentQuestion === mbtiQuestions.length - 1) {
        nextBtn.style.display = 'none';
        finishBtn.style.display = answers[currentQuestion] !== undefined ? 'inline-block' : 'none';
    } else {
        nextBtn.style.display = 'inline-block';
        nextBtn.disabled = answers[currentQuestion] === undefined;
        finishBtn.style.display = 'none';
    }
}

// 이전 질문
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
        updateProgress();
        updateNavigationButtons();
    }
}

// 다음 질문
function nextQuestion() {
    if (currentQuestion < mbtiQuestions.length - 1 && answers[currentQuestion] !== undefined) {
        currentQuestion++;
        renderQuestion();
        updateProgress();
        updateNavigationButtons();
    }
}

// MBTI 유형 계산
function calculateMBTI() {
    scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    
    for (let i = 0; i < answers.length; i++) {
        const question = mbtiQuestions[i];
        const selectedAnswer = question.answers[answers[i]];
        scores[selectedAnswer.type] += selectedAnswer.score;
    }
    
    let mbtiType = '';
    mbtiType += scores.E > scores.I ? 'E' : 'I';
    mbtiType += scores.S > scores.N ? 'S' : 'N';
    mbtiType += scores.T > scores.F ? 'T' : 'F';
    mbtiType += scores.J > scores.P ? 'J' : 'P';
    
    return mbtiType;
}

// 결과 표시
function showResult() {
    const mbtiType = calculateMBTI();
    const result = mbtiResults[mbtiType];
    
    // 섹션 전환
    document.getElementById('test-section').style.display = 'none';
    document.getElementById('result-section').classList.add('active');
    
    // 결과 카드 렌더링
    document.getElementById('result-card').innerHTML = `
        <div class="mbti-type">${mbtiType}</div>
        <div class="mbti-title">${result.title}</div>
        <div class="mbti-description">${result.description}</div>
    `;
    
    // 상세 결과 렌더링
    document.getElementById('result-details').innerHTML = `
        <div class="detail-card">
            <div class="detail-title">💪 주요 강점</div>
            <ul class="detail-list">
                ${result.strengths.map(strength => `<li>${strength}</li>`).join('')}
            </ul>
        </div>
        <div class="detail-card">
            <div class="detail-title">⚠️ 주의할 점</div>
            <ul class="detail-list">
                ${result.weaknesses.map(weakness => `<li>${weakness}</li>`).join('')}
            </ul>
        </div>
        <div class="detail-card">
            <div class="detail-title">💼 추천 직업</div>
            <ul class="detail-list">
                ${result.careers.map(career => `<li>${career}</li>`).join('')}
            </ul>
        </div>
        <div class="detail-card">
            <div class="detail-title">💕 궁합 좋은 유형</div>
            <ul class="detail-list">
                ${result.compatibility.map(type => `<li>${type}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // 로컬 스토리지에 결과 저장
    localStorage.setItem('mbtiResult', JSON.stringify({
        type: mbtiType,
        title: result.title,
        nickname: result.nickname || result.title,
        description: result.description,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        careers: result.careers,
        compatibility: result.compatibility,
        date: new Date().toISOString(),
        scores: scores
    }));
    
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 테스트 재시작
function restartTest() {
    currentQuestion = 0;
    answers = [];
    scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    
    document.getElementById('result-section').classList.remove('active');
    document.getElementById('intro-section').style.display = 'block';
    document.getElementById('test-section').style.display = 'none';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}



// 페이지 로드 시 이전 결과 확인
window.addEventListener('load', function() {
    const savedResult = localStorage.getItem('mbtiResult');
    if (savedResult) {
        try {
            const result = JSON.parse(savedResult);
            const resultDate = new Date(result.date);
            const daysSince = Math.floor((new Date() - resultDate) / (1000 * 60 * 60 * 24));
            
            if (daysSince < 30) {
                const introSection = document.querySelector('#intro-section');
                const previousResultHTML = `
                    <div style="margin-top: 20px; padding: 20px; background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); border-radius: 12px; border: 2px solid #667eea;">
                        <h4 style="margin: 0 0 15px 0; color: #667eea; text-align: center;">📊 이전 테스트 결과</h4>
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; font-weight: bold; color: #667eea; margin-bottom: 10px;">${result.type}</div>
                            <p style="margin: 0; color: #555;">
                                ${daysSince === 0 ? '오늘' : `${daysSince}일 전`} 테스트 결과입니다
                            </p>
                        </div>
                    </div>
                `;
                introSection.insertAdjacentHTML('beforeend', previousResultHTML);
            }
        } catch (e) {
            console.log('이전 결과 로드 실패:', e);
        }
    }
}); 