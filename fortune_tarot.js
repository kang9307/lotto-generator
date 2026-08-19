/**
 * 오늘의 운세 & 타로 카드 (Daily Fortune & Tarot)
 * Copyright (c) 2023-2025 braindetox.kr
 * All rights reserved.
 */

// 별자리 데이터
// 언어판 페이지는 이 스크립트 로드 전에 window.FT_ZODIAC 로 재정의한다 (미정의 시 한국어 기본값)
const zodiacData = (typeof window !== 'undefined' && window.FT_ZODIAC) || {
    aries: {
        name: '양자리',
        icon: '♈',
        date: '3.21 - 4.19',
        element: '불',
        planet: '화성'
    },
    taurus: {
        name: '황소자리',
        icon: '♉',
        date: '4.20 - 5.20',
        element: '땅',
        planet: '금성'
    },
    gemini: {
        name: '쌍둥이자리',
        icon: '♊',
        date: '5.21 - 6.21',
        element: '바람',
        planet: '수성'
    },
    cancer: {
        name: '게자리',
        icon: '♋',
        date: '6.22 - 7.22',
        element: '물',
        planet: '달'
    },
    leo: {
        name: '사자자리',
        icon: '♌',
        date: '7.23 - 8.22',
        element: '불',
        planet: '태양'
    },
    virgo: {
        name: '처녀자리',
        icon: '♍',
        date: '8.23 - 9.22',
        element: '땅',
        planet: '수성'
    },
    libra: {
        name: '천칭자리',
        icon: '♎',
        date: '9.23 - 10.23',
        element: '바람',
        planet: '금성'
    },
    scorpio: {
        name: '전갈자리',
        icon: '♏',
        date: '10.24 - 11.22',
        element: '물',
        planet: '명왕성'
    },
    sagittarius: {
        name: '사수자리',
        icon: '♐',
        date: '11.23 - 12.21',
        element: '불',
        planet: '목성'
    },
    capricorn: {
        name: '염소자리',
        icon: '♑',
        date: '12.22 - 1.19',
        element: '땅',
        planet: '토성'
    },
    aquarius: {
        name: '물병자리',
        icon: '♒',
        date: '1.20 - 2.18',
        element: '바람',
        planet: '천왕성'
    },
    pisces: {
        name: '물고기자리',
        icon: '♓',
        date: '2.19 - 3.20',
        element: '물',
        planet: '해왕성'
    }
};

// 운세 메시지 풀
// 언어판 페이지는 이 스크립트 로드 전에 window.FT_FORTUNES 로 재정의한다 (미정의 시 한국어 기본값)
const fortuneMessages = (typeof window !== 'undefined' && window.FT_FORTUNES) || {
    love: [
        "새로운 만남의 기회가 찾아올 수 있어요",
        "연인과의 관계가 더욱 깊어질 것 같아요",
        "솔직한 대화가 관계 발전의 열쇠가 될 거예요",
        "작은 관심과 배려가 큰 변화를 만들어낼 것 같아요",
        "과거의 인연이 다시 찾아올 수도 있어요",
        "자신의 매력이 가장 빛나는 하루가 될 거예요",
        "사랑에 대한 새로운 관점을 갖게 될 것 같아요",
        "마음을 열고 다가가면 좋은 결과가 있을 거예요",
        "연인이나 배우자와의 소중한 시간을 가져보세요",
        "로맨틱한 분위기가 하루를 감쌀 것 같아요",
        "사랑하는 사람에게 진심을 전하기 좋은 날이에요",
        "감정적인 안정감을 느낄 수 있는 하루가 될 거예요",
        "이상형과 가까워질 기회가 생길 수 있어요",
        "서로에 대한 이해가 깊어지는 시간이 될 것 같아요",
        "예상치 못한 로맨틱한 상황이 펼쳐질 수도 있어요"
    ],
    career: [
        "새로운 프로젝트에서 실력을 발휘할 기회가 와요",
        "동료들과의 협력이 좋은 성과를 만들어낼 거예요",
        "창의적인 아이디어가 인정받을 수 있는 날이에요",
        "업무에서 예상보다 좋은 결과를 얻을 것 같아요",
        "승진이나 인사발령에 좋은 소식이 있을 수 있어요",
        "새로운 분야에 도전해볼 용기가 생길 거예요",
        "상사나 선배에게 좋은 인상을 남길 수 있어요",
        "팀워크를 발휘할 수 있는 기회가 주어질 것 같아요",
        "전문성을 키울 수 있는 학습 기회가 올 수 있어요",
        "네트워킹을 통해 새로운 기회를 발견할 거예요",
        "일에 대한 새로운 통찰을 얻게 될 것 같아요",
        "업무 효율이 크게 향상되는 하루가 될 거예요",
        "중요한 프레젠테이션이나 미팅이 성공적일 거예요",
        "직장에서의 위치가 더욱 공고해질 것 같아요",
        "커리어 발전에 도움이 되는 조언을 들을 수 있어요"
    ],
    money: [
        "예상치 못한 수입이 생길 수 있어요",
        "투자보다는 저축에 집중하는 것이 좋겠어요",
        "가계부를 정리하며 절약 방법을 찾아보세요",
        "부업이나 사이드 프로젝트 기회가 올 수 있어요",
        "금전 관리에 더욱 신중함이 필요한 시기예요",
        "큰 지출은 잠시 미루는 것이 현명할 것 같아요",
        "재정 계획을 다시 점검해볼 좋은 때예요",
        "돈 관련해서 좋은 조언을 들을 수 있을 거예요",
        "경제적 안정감을 느낄 수 있는 하루가 될 거예요",
        "합리적인 소비 습관을 기를 수 있는 기회예요",
        "부동산이나 주식에 관심을 가져볼 만해요",
        "용돈이나 보너스 등 기분 좋은 소식이 있을 수 있어요",
        "금전적 여유가 생겨 마음이 편해질 것 같아요",
        "저축 목표 달성에 한 걸음 더 가까워질 거예요",
        "경제적 독립을 위한 계획을 세워볼 좋은 날이에요"
    ],
    health: [
        "컨디션이 좋아져 활력이 넘칠 것 같아요",
        "규칙적인 운동을 시작하기 좋은 타이밍이에요",
        "건강한 식습관에 더욱 신경 써주세요",
        "충분한 휴식과 수면이 필요한 시기예요",
        "스트레스 해소를 위한 취미 활동을 해보세요",
        "정기 건강검진을 받아볼 것을 추천해요",
        "몸의 신호에 귀 기울이며 무리하지 마세요",
        "야외 활동으로 비타민D를 충전해보세요",
        "요가나 명상으로 마음의 평안을 찾아보세요",
        "물을 충분히 마시며 몸의 순환을 도와주세요",
        "새로운 운동을 배워보는 것도 좋을 것 같아요",
        "건강 보조식품 복용을 고려해볼 수 있어요",
        "면역력 강화에 신경 쓰는 것이 중요해요",
        "몸과 마음이 모두 건강해지는 하루가 될 거예요",
        "생활 패턴을 개선할 수 있는 기회가 올 거예요"
    ],
    relationships: [
        "가족과의 시간이 더욱 소중하게 느껴질 거예요",
        "친구들과의 모임에서 즐거운 시간을 보낼 수 있어요",
        "새로운 인맥을 만날 기회가 생길 것 같아요",
        "오해가 있었던 사람과 화해할 수 있는 날이에요",
        "주변 사람들에게 감사한 마음이 들 거예요",
        "소통을 통해 관계가 더욱 돈독해질 것 같아요",
        "누군가의 도움이나 조언이 큰 힘이 될 거예요",
        "예전 친구와 연락이 닿을 수도 있어요",
        "사회적 활동을 통해 좋은 사람들을 만날 수 있어요",
        "인간관계에서 새로운 깨달음을 얻을 것 같아요",
        "누군가에게 도움을 줄 수 있는 기회가 올 거예요",
        "갈등 상황이 원만하게 해결될 수 있어요",
        "진정한 친구가 누구인지 알게 되는 하루예요",
        "사람들과의 만남이 즐겁고 의미있을 것 같아요",
        "네트워킹이나 모임 참여를 적극 고려해보세요"
    ],
    study: [
        "새로운 지식을 습득하기 좋은 컨디션이에요",
        "집중력이 높아져 학습 효과가 뛰어날 거예요",
        "어려운 문제나 과제를 해결할 수 있을 것 같아요",
        "창의적인 아이디어가 샘솟는 하루가 될 거예요",
        "시험이나 발표 준비가 순조롭게 진행될 거예요",
        "새로운 언어나 기술을 배우기 시작해보세요",
        "독서를 통해 인사이트를 얻을 수 있는 날이에요",
        "온라인 강의나 세미나 참여를 고려해보세요",
        "스터디 그룹이나 동료와의 학습이 도움될 거예요",
        "기억력과 이해력이 평소보다 뛰어날 것 같아요",
        "자격증 취득을 위한 계획을 세워보기 좋은 때예요",
        "호기심을 자극하는 새로운 분야를 탐구해보세요",
        "학습 목표를 재정립하고 계획을 수정해보세요",
        "지식을 실제로 활용할 수 있는 기회가 올 거예요",
        "평생 학습의 중요성을 다시 한 번 깨닫게 될 거예요"
    ],
    overall: [
        "모든 일이 순조롭게 풀리는 하루가 될 것 같아요",
        "긍정적인 에너지가 당신을 둘러쌀 거예요",
        "새로운 시작을 위한 좋은 기회가 찾아올 수 있어요",
        "직감이 특히 예리해지는 하루가 될 것 같아요",
        "평소보다 운이 좋다고 느낄 수 있는 날이에요",
        "작은 행복들이 하루를 가득 채울 거예요",
        "변화의 바람이 당신에게 불어올 것 같아요",
        "내면의 평화와 안정감을 찾을 수 있을 거예요",
        "새로운 도전에 대한 용기가 생길 것 같아요",
        "주변의 지지와 격려를 많이 받을 수 있는 날이에요",
        "자신감이 충만해지는 하루가 될 거예요",
        "예상치 못한 기쁜 소식이나 선물이 있을 수 있어요",
        "균형잡힌 하루를 보낼 수 있을 것 같아요",
        "감사할 일들이 많이 생기는 하루가 될 거예요",
        "모든 면에서 성장할 수 있는 기회가 주어질 거예요"
    ]
};

// 타로 카드 데이터 (메이저 아르카나 22장)
// 언어판 페이지는 이 스크립트 로드 전에 window.FT_TAROT 로 재정의한다 (미정의 시 한국어 기본값)
const tarotCards = (typeof window !== 'undefined' && window.FT_TAROT) || [
    {
        name: "The Fool (바보)",
        keywords: ["새로운 시작", "모험", "순수함", "자유"],
        description: "새로운 여행의 시작을 알리는 카드입니다. 순수한 마음으로 새로운 도전을 시작하기에 좋은 때입니다. 과거에 얽매이지 말고 미래를 향해 나아가세요."
    },
    {
        name: "The Magician (마법사)",
        keywords: ["의지력", "집중", "창조", "능력"],
        description: "강한 의지력과 집중력으로 목표를 달성할 수 있는 시기입니다. 당신이 가진 모든 능력을 발휘하여 원하는 것을 현실로 만들어보세요."
    },
    {
        name: "The High Priestess (여교황)",
        keywords: ["직감", "내면의 지혜", "신비", "잠재의식"],
        description: "직감과 내면의 목소리에 귀를 기울여야 할 때입니다. 겉으로 드러나지 않은 진실을 발견하고, 깊은 통찰력을 발휘할 수 있을 거예요."
    },
    {
        name: "The Empress (여황제)",
        keywords: ["풍요", "창조성", "모성", "자연"],
        description: "풍요롭고 창조적인 에너지가 넘치는 시기입니다. 새로운 것을 창조하거나 기존의 것을 발전시키기에 좋은 때입니다."
    },
    {
        name: "The Emperor (황제)",
        keywords: ["권위", "안정", "리더십", "질서"],
        description: "강한 리더십과 체계적인 접근이 필요한 시기입니다. 규율과 질서를 통해 안정적인 기반을 구축할 수 있을 거예요."
    },
    {
        name: "The Hierophant (교황)",
        keywords: ["전통", "지혜", "영성", "가르침"],
        description: "전통적인 가치와 지혜가 중요한 역할을 하는 시기입니다. 멘토나 선배의 조언을 구하거나 영적인 성장을 추구해보세요."
    },
    {
        name: "The Lovers (연인들)",
        keywords: ["사랑", "관계", "선택", "조화"],
        description: "중요한 관계나 선택의 기로에 서 있음을 나타냅니다. 마음의 소리를 듣고 진정한 조화를 이룰 수 있는 선택을 하세요."
    },
    {
        name: "The Chariot (전차)",
        keywords: ["승리", "의지력", "통제", "진전"],
        description: "강한 의지력과 결단력으로 목표를 향해 나아가는 시기입니다. 어려움을 극복하고 승리를 쟁취할 수 있을 거예요."
    },
    {
        name: "Strength (힘)",
        keywords: ["내면의 힘", "용기", "인내", "자제력"],
        description: "육체적인 힘보다는 내면의 힘과 정신력이 중요한 시기입니다. 인내와 자제력으로 어려운 상황을 극복해보세요."
    },
    {
        name: "The Hermit (은둔자)",
        keywords: ["성찰", "내면 탐구", "지혜", "고독"],
        description: "혼자만의 시간을 통해 깊은 성찰과 내면 탐구가 필요한 시기입니다. 외부의 소음을 차단하고 진정한 자신을 찾아보세요."
    },
    {
        name: "Wheel of Fortune (운명의 바퀴)",
        keywords: ["운명", "변화", "순환", "기회"],
        description: "인생의 전환점이나 운명적인 변화가 다가오는 시기입니다. 변화의 흐름에 순응하며 새로운 기회를 잡아보세요."
    },
    {
        name: "Justice (정의)",
        keywords: ["공정", "균형", "진실", "법"],
        description: "공정함과 균형이 중요한 시기입니다. 올바른 판단과 공정한 처리를 통해 진실이 밝혀질 것입니다."
    },
    {
        name: "The Hanged Man (매달린 사람)",
        keywords: ["희생", "인내", "새로운 관점", "기다림"],
        description: "기다림과 인내가 필요한 시기입니다. 다른 관점에서 상황을 바라보면 새로운 해답을 찾을 수 있을 거예요."
    },
    {
        name: "Death (죽음)",
        keywords: ["변화", "끝과 시작", "변신", "재탄생"],
        description: "끝이자 새로운 시작을 의미합니다. 과거를 정리하고 새로운 변화를 받아들일 준비를 하세요."
    },
    {
        name: "Temperance (절제)",
        keywords: ["조화", "균형", "절제", "치유"],
        description: "균형과 조화가 중요한 시기입니다. 극단적인 것보다는 중용의 길을 택하며 치유와 회복에 집중하세요."
    },
    {
        name: "The Devil (악마)",
        keywords: ["유혹", "속박", "물질주의", "해방"],
        description: "자신을 구속하는 것들로부터 벗어날 필요가 있는 시기입니다. 진정한 자유를 찾기 위해 내면의 악마와 마주하세요."
    },
    {
        name: "The Tower (탑)",
        keywords: ["파괴", "갑작스러운 변화", "깨달음", "재건"],
        description: "갑작스러운 변화나 충격적인 깨달음이 있을 수 있는 시기입니다. 무너진 것 위에 더 견고한 것을 건설하세요."
    },
    {
        name: "The Star (별)",
        keywords: ["희망", "영감", "치유", "소원"],
        description: "희망과 영감이 넘치는 시기입니다. 어둠 속에서도 빛나는 별처럼, 희망을 잃지 말고 꿈을 향해 나아가세요."
    },
    {
        name: "The Moon (달)",
        keywords: ["환상", "직감", "무의식", "혼란"],
        description: "혼란스럽고 불분명한 상황에 있을 수 있습니다. 직감을 믿되 환상에 속지 않도록 주의하세요."
    },
    {
        name: "The Sun (태양)",
        keywords: ["행복", "성공", "활력", "긍정"],
        description: "밝고 긍정적인 에너지가 넘치는 시기입니다. 모든 일이 순조롭게 풀리고 행복한 소식이 있을 거예요."
    },
    {
        name: "Judgement (심판)",
        keywords: ["재탄생", "각성", "용서", "새로운 기회"],
        description: "과거를 돌아보고 새로운 출발을 할 수 있는 시기입니다. 자신을 용서하고 새로운 기회를 받아들이세요."
    },
    {
        name: "The World (세계)",
        keywords: ["완성", "성취", "통합", "성공"],
        description: "모든 것이 완성되고 성취되는 시기입니다. 긴 여정의 끝에서 큰 성공과 만족감을 얻을 수 있을 거예요."
    }
];

// 럭키 아이템 데이터
// 언어판 페이지는 이 스크립트 로드 전에 window.FT_LUCKY 로 재정의한다 (미정의 시 한국어 기본값)
const luckyItems = (typeof window !== 'undefined' && window.FT_LUCKY) || {
    colors: ['빨강', '파랑', '노랑', '초록', '보라', '주황', '분홍', '하양', '검정', '갈색', '회색', '금색', '은색'],
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 33, 44, 55, 77, 88, 99],
    items: ['반지', '목걸이', '시계', '브로치', '가방', '신발', '모자', '스카프', '선글라스', '향수', '꽃', '보석', '동전', '열쇠'],
    directions: ['동쪽', '서쪽', '남쪽', '북쪽', '동남쪽', '동북쪽', '서남쪽', '서북쪽']
};

// 결과 화면 문구 (언어판 페이지는 이 스크립트 로드 전에 window.FT_STRINGS 로 재정의 — 미정의 시 한국어 기본값)
const FT_STRINGS = Object.assign({
    locale: 'ko-KR',
    fortuneTitleSuffix: ' 오늘의 운세',
    luckyTitle: '✨ 오늘의 럭키 아이템',
    luckyColor: '럭키 컬러',
    luckyNumber: '럭키 넘버',
    luckyItem: '럭키 아이템',
    luckyDirection: '럭키 방향',
    categories: {
        love: '사랑운',
        career: '직업운',
        money: '금전운',
        health: '건강운',
        relationships: '인간관계운',
        study: '학업운',
        overall: '전체운'
    },
    tarotTitle: '🃏 오늘의 타로 카드',
    drawAgain: '🔄 다시 뽑기'
}, (typeof window !== 'undefined' && window.FT_STRINGS) || {});

// 암호학적 난수 정수 [min, max] (rejection sampling, 미지원 브라우저만 폴백)
function secureRandInt(min, max) {
    const range = max - min + 1;
    if (window.crypto && window.crypto.getRandomValues) {
        const maxValid = Math.floor(4294967296 / range) * range;
        const buf = new Uint32Array(1);
        let x;
        do {
            window.crypto.getRandomValues(buf);
            x = buf[0];
        } while (x >= maxValid);
        return min + (x % range);
    }
    return min + Math.floor(Math.random() * range);
}

// 모션 축소 설정 여부
function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// 타로 카드 aria-label (페이지 언어별)
function tarotCardLabel(n) {
    const lang = (document.documentElement.lang || 'ko').slice(0, 2);
    const map = {
        ko: '타로 카드 ' + n + '번',
        en: 'Tarot card ' + n,
        ja: 'タロットカード' + n,
        zh: '塔罗牌' + n
    };
    return map[lang] || map.ko;
}

// 날짜 기반 시드 생성 함수
function getDailySeed() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    return parseInt(`${year}${month.toString().padStart(2, '0')}${date.toString().padStart(2, '0')}`);
}

// 시드 기반 랜덤 함수
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// 시드 기반 배열에서 랜덤 선택
function getRandomFromArray(array, seed) {
    const index = Math.floor(seededRandom(seed) * array.length);
    return array[index];
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeZodiacGrid();
    initializeTarotDeck();
    initializeTabs();
    
    // 헤더/푸터 로드
    loadHeaderFooter();
});

// 헤더/푸터 로드 함수
function loadHeaderFooter() {
    // 헤더 로드
    if (document.getElementById('header-placeholder')) {
        fetch('components/header.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header-placeholder').innerHTML = data;
            })
            .catch(error => console.log('Header load failed:', error));
    }
    
    // 푸터 로드
    if (document.getElementById('footer-placeholder')) {
        fetch('components/footer.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('footer-placeholder').innerHTML = data;
            })
            .catch(error => console.log('Footer load failed:', error));
    }
}

// 탭 기능 초기화
function initializeTabs() {
    const tabs = document.querySelectorAll('.fortune-tab');
    const sections = document.querySelectorAll('.fortune-section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // 탭 활성화 상태 변경
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 섹션 표시/숨김
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            const targetSection = document.getElementById(`${targetTab}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// 별자리 그리드 초기화
function initializeZodiacGrid() {
    const grid = document.getElementById('zodiac-grid');
    
    Object.keys(zodiacData).forEach(zodiacKey => {
        const zodiac = zodiacData[zodiacKey];
        const card = document.createElement('div');
        card.className = 'zodiac-card';
        card.dataset.zodiac = zodiacKey;
        card.innerHTML = `
            <div class="zodiac-icon">${zodiac.icon}</div>
            <div class="zodiac-name">${zodiac.name}</div>
            <div class="zodiac-date">${zodiac.date}</div>
        `;
        
        card.addEventListener('click', function() {
            selectZodiac(zodiacKey);
        });
        
        grid.appendChild(card);
    });
}

// 별자리 선택 함수
function selectZodiac(zodiacKey) {
    // 이전 선택 제거
    document.querySelectorAll('.zodiac-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // 현재 선택 표시
    const selectedCard = document.querySelector(`[data-zodiac="${zodiacKey}"]`);
    selectedCard.classList.add('selected');
    
    // 운세 생성 및 표시
    const fortune = generateDailyFortune(zodiacKey);
    displayFortune(zodiacKey, fortune);
}

// 일일 운세 생성 함수
function generateDailyFortune(zodiacKey) {
    const baseSeed = getDailySeed();
    const zodiacSeed = zodiacKey.charCodeAt(0) + zodiacKey.charCodeAt(1);
    
    const categories = Object.keys(fortuneMessages);
    const fortune = {};
    
    categories.forEach((category, index) => {
        const seed = baseSeed + zodiacSeed + index * 123;
        fortune[category] = getRandomFromArray(fortuneMessages[category], seed);
    });
    
    // 럭키 아이템 생성
    fortune.lucky = {
        color: getRandomFromArray(luckyItems.colors, baseSeed + zodiacSeed + 1000),
        number: getRandomFromArray(luckyItems.numbers, baseSeed + zodiacSeed + 2000),
        item: getRandomFromArray(luckyItems.items, baseSeed + zodiacSeed + 3000),
        direction: getRandomFromArray(luckyItems.directions, baseSeed + zodiacSeed + 4000)
    };
    
    return fortune;
}

// 운세 결과 표시 함수
function displayFortune(zodiacKey, fortune) {
    const zodiac = zodiacData[zodiacKey];
    const resultDiv = document.getElementById('fortune-result');
    
    const categoryIcons = {
        love: '💕',
        career: '💼',
        money: '💰',
        health: '🏥',
        relationships: '👥',
        study: '📚',
        overall: '🌟'
    };
    
    const categoryNames = FT_STRINGS.categories;

    let fortuneHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h3 style="color: #667eea; font-size: 1.8rem; margin-bottom: 10px;">
                ${zodiac.icon} ${zodiac.name}${FT_STRINGS.fortuneTitleSuffix}
            </h3>
            <p style="color: #666; font-size: 1rem;">
                ${new Date().toLocaleDateString(FT_STRINGS.locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
            </p>
        </div>

        <div class="lucky-info">
            <h4 style="margin-bottom: 15px; font-size: 1.2rem;">${FT_STRINGS.luckyTitle}</h4>
            <div class="lucky-items">
                <div class="lucky-item">
                    <h5>${FT_STRINGS.luckyColor}</h5>
                    <span>${fortune.lucky.color}</span>
                </div>
                <div class="lucky-item">
                    <h5>${FT_STRINGS.luckyNumber}</h5>
                    <span>${fortune.lucky.number}</span>
                </div>
                <div class="lucky-item">
                    <h5>${FT_STRINGS.luckyItem}</h5>
                    <span>${fortune.lucky.item}</span>
                </div>
                <div class="lucky-item">
                    <h5>${FT_STRINGS.luckyDirection}</h5>
                    <span>${fortune.lucky.direction}</span>
                </div>
            </div>
        </div>
    `;
    
    Object.keys(categoryNames).forEach(category => {
        fortuneHTML += `
            <div class="fortune-category">
                <h4>${categoryIcons[category]} ${categoryNames[category]}</h4>
                <p>${fortune[category]}</p>
            </div>
        `;
    });
    
    resultDiv.innerHTML = fortuneHTML;
    resultDiv.classList.add('active');
    
    // 결과로 스크롤
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// 타로 덱 초기화
function initializeTarotDeck() {
    const deck = document.getElementById('tarot-deck');
    
    // 처음에는 뒷면만 보이는 5장의 카드 생성
    for (let i = 0; i < 5; i++) {
        const card = document.createElement('div');
        card.className = 'tarot-card';
        card.dataset.index = i;
        card.innerHTML = '🃏';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', tarotCardLabel(i + 1));

        card.addEventListener('click', function() {
            if (!this.classList.contains('flipped')) {
                selectTarotCard(i);
            }
        });
        card.addEventListener('keydown', function(e) {
            if ((e.key === 'Enter' || e.key === ' ') && !this.classList.contains('flipped')) {
                e.preventDefault();
                selectTarotCard(i);
            }
        });

        deck.appendChild(card);
    }
}

// 타로 카드 섞기
function shuffleTarotCards() {
    const cards = document.querySelectorAll('.tarot-card');
    const result = document.getElementById('tarot-result');
    
    // 모든 카드를 원래 상태로 되돌리기
    cards.forEach(card => {
        card.classList.remove('flipped');
        card.innerHTML = '🃏';
        card.style.pointerEvents = 'auto';
        card.style.opacity = '1';
    });
    
    // 결과 숨기기
    result.classList.remove('active');
    
    // 섞는 애니메이션 효과 (모션 축소 설정 시 생략)
    if (!prefersReducedMotion()) {
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    card.style.transform = 'translateY(0)';
                }, 100);
            }, index * 100);
        });
    }
}

// 타로 카드 선택
function selectTarotCard(index) {
    const card = document.querySelector(`[data-index="${index}"]`);
    // 타로는 뽑을 때마다 암호학적 난수로 새로 선택 (별자리 운세는 날짜 시드 유지)
    const selectedTarot = tarotCards[secureRandInt(0, tarotCards.length - 1)];
    
    // 카드 뒤집기 애니메이션
    card.classList.add('flipped');
    card.innerHTML = selectedTarot.name.split(' ')[0];
    
    // 다른 카드들 비활성화
    document.querySelectorAll('.tarot-card').forEach(c => {
        if (c !== card) {
            c.style.pointerEvents = 'none';
            c.style.opacity = '0.5';
        }
    });
    
    // 타로 결과 표시
    setTimeout(() => {
        displayTarotResult(selectedTarot);
    }, 600);
}

// 타로 결과 표시
function displayTarotResult(tarot) {
    const resultDiv = document.getElementById('tarot-result');
    
    const resultHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h3 style="color: #667eea; font-size: 1.5rem; margin-bottom: 15px;">
                ${FT_STRINGS.tarotTitle}
            </h3>
        </div>
        
        <div class="tarot-card-name">${tarot.name}</div>
        <div class="tarot-description">${tarot.description}</div>
        
        <div class="tarot-keywords">
            ${tarot.keywords.map(keyword => 
                `<span class="tarot-keyword">${keyword}</span>`
            ).join('')}
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <button class="action-button" onclick="shuffleTarotCards()">
                ${FT_STRINGS.drawAgain}
            </button>
        </div>
    `;
    
    resultDiv.innerHTML = resultHTML;
    resultDiv.classList.add('active');

    // 결과로 스크롤 (모션 축소 설정 시 즉시 이동)
    resultDiv.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

// 소셜 공유 기능은 HTML 파일의 인라인 스크립트에서 처리됩니다.