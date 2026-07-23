/**
 * generate_category_pages.js
 * 카테고리별 SEO 허브(랜딩) 페이지 생성 스크립트
 * Copyright (c) 2026 braindetox.kr
 *
 * 사용법: node generate_category_pages.js
 *
 * 기능:
 * - ko/en/ja/zh 4개 언어 x 7개 표준 카테고리 = 28개 정적 페이지 생성
 * - posts/index.json (및 en/ja/zh 하위 동일 파일)의 category 값을 표준 7종 슬러그로 정규화
 *   (en/ja/zh 인덱스에는 로컬라이즈 변형 라벨이 일부 섞여 있어 CATEGORY_MAP으로 매핑)
 * - 헤더/푸터는 blog.html이 사용하는 components/*.html 원본을 그대로 읽어 정적으로 삽입
 *   (en/ja/zh 카테고리 페이지는 language 폴더 기준 2단계 깊이인데, common.js의 동적
 *   header/footer placeholder 로딩 로직은 "lang + posts" 2단계 깊이만 인식하고 "lang + category"
 *   조합은 인식하지 못해 상대경로 계산이 깨진다. 이를 피하기 위해 header/footer는 컴포넌트
 *   원본을 빌드 시점에 읽어 정적으로 삽입하고, 언어 스위처만 자바스크립트 삽입과 동일한 모양으로
 *   직접 생성한다. common.js 자체는 계속 로드하여 토글/드롭다운 등 전역 함수를 사용한다.)
 * - 재실행 시 동일 입력에 대해 동일 산출물을 생성하는 멱등 스크립트
 *
 * 금지 사항 (호출 시점 지침):
 * - posts/index.json 등 데이터 파일은 읽기 전용으로만 사용 (수정 금지)
 * - blog.html 등 기존 페이지는 참고만 하고 수정하지 않음
 * - git 명령 실행 금지
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://braindetox.kr';
const LANGUAGES = ['ko', 'en', 'ja', 'zh'];
const CATEGORY_ORDER = ['tech', 'dev', 'health', 'finance', 'law', 'life', 'culture'];

const LANG_DISPLAY = { ko: '한국어', en: 'English', ja: '日本語', zh: '中文' };
const OG_LOCALE = { ko: 'ko_KR', en: 'en_US', ja: 'ja_JP', zh: 'zh_CN' };
const IN_LANGUAGE = { ko: 'ko-KR', en: 'en-US', ja: 'ja-JP', zh: 'zh-CN' };

const HEADER_FILES = { ko: 'header.html', en: 'en-header.html', ja: 'ja-header.html', zh: 'zh-header.html' };
const FOOTER_FILES = { ko: 'footer.html', en: 'en-footer.html', ja: 'ja-footer.html', zh: 'zh-footer.html' };

// -----------------------------------------------------------------------------
// 원본 category 값 -> 표준 7종 슬러그 매핑
// ko 인덱스는 100% 표준 한국어 라벨을 쓰지만, en/ja/zh 인덱스에는 과거 로컬라이즈 작업의
// 잔재로 일부 변형 라벨이 섞여 있다 (실측 스캔 결과 기준). 여기 없는 값은 콘솔 경고 후 제외한다.
// -----------------------------------------------------------------------------
const CATEGORY_MAP = {
    // 한국어 표준 라벨 (4개 언어 index.json 전부에서 다수를 차지)
    'IT/기술': 'tech',
    '개발/인프라': 'dev',
    '생활/건강': 'health',
    '금융/경제': 'finance',
    '생활/법률': 'law',
    '생활/실용': 'life',
    '트렌드/문화': 'culture',
    // en 로컬라이즈 변형
    'Tech': 'tech',
    'Dev & Infra': 'dev',
    'Health': 'health',
    'Finance': 'finance',
    'Lifestyle': 'life',
    // ja 로컬라이즈 변형
    'IT・技術': 'tech',
    '開発・インフラ': 'dev',
    '健康': 'health',
    '金融・経済': 'finance',
    '暮らし': 'life',
    // zh 로컬라이즈 변형
    'IT/技术': 'tech',
    '开发/基础设施': 'dev',
    '金融/经济': 'finance',
    '生活': 'life',
};

// -----------------------------------------------------------------------------
// 카테고리 표시명 / 소개문(2~3문장, 온페이지) / meta description(길이 엄격 관리)
// desc 길이 규칙: ko/ja/zh 105~135자, en 120~158자, 큰따옴표(") 사용 금지
// -----------------------------------------------------------------------------
const CATEGORY_META = {
    tech: {
        name: { ko: 'IT/기술', en: 'Tech & IT', ja: 'IT・技術', zh: 'IT/技术' },
        intro: {
            ko: "프로그래밍 언어, 클라우드 인프라, 서버 운영, 정보 보안, AI 기술까지 IT 전반을 다루는 글 모음입니다. 실무에서 바로 활용할 수 있는 튜토리얼과 최신 기술 트렌드를 함께 소개합니다. 개발자는 물론 IT에 관심 있는 누구나 유용하게 읽을 수 있습니다.",
            en: "This collection covers the full spectrum of IT topics, from programming languages and cloud infrastructure to server operations, security, and artificial intelligence. Each article combines practical, hands-on tutorials with insights into the latest technology trends. Whether you're a developer or simply curious about tech, you'll find something useful here.",
            ja: "プログラミング言語、クラウドインフラ、サーバー運用、情報セキュリティ、AI技術まで、IT全般を扱った記事を集めました。実務ですぐに使えるチュートリアルと最新の技術トレンドをあわせて紹介しています。開発者はもちろん、ITに関心のある方にも役立つ内容です。",
            zh: "从编程语言、云计算基础设施、服务器运维,到信息安全与人工智能技术,全面覆盖IT领域的各类文章尽在于此。每篇文章都结合了可直接实践的教程与最新技术趋势解读。无论你是开发者还是对科技感兴趣的读者,都能从中获益。",
        },
        desc: {
            ko: "프로그래밍, 클라우드 컴퓨팅, 서버 인프라 구축, 정보 보안, AI 기술에 이르기까지 IT/기술 전반을 다루는 글을 한곳에 모았습니다. 실무에 바로 쓸 수 있는 가이드와 최신 기술 트렌드를 개발자와 IT 실무자를 위해 꾸준히 전합니다.",
            en: "Programming, cloud computing, server infrastructure, cybersecurity, and AI — practical guides and the latest IT trends for developers and tech professionals.",
            ja: "プログラミング、クラウドコンピューティング、サーバーインフラ構築、情報セキュリティ、AI技術に至るまで、IT・技術分野全般を扱う記事をひとつにまとめました。実務ですぐ使えるガイドと最新の技術トレンドを開発者やIT担当者に向けて継続的にお届けします。",
            zh: "从编程开发、云计算、服务器基础设施搭建,到信息安全与人工智能技术,全面系统地汇集IT/技术领域各类实用文章与深度解读内容。为开发者与IT从业人员持续提供可直接应用于实务的操作指南、经验总结与最新技术趋势深度解读。",
        },
    },
    dev: {
        name: { ko: '개발/인프라', en: 'Dev & Infra', ja: '開発・インフラ', zh: '开发/基础设施' },
        intro: {
            ko: "리눅스 서버 관리부터 Docker 컨테이너, 홈서버 구축, 백업과 모니터링 전략까지 개발/인프라 실무에 필요한 지식을 체계적으로 정리했습니다. 단계별 가이드 형식으로 구성되어 있어 따라 하기 쉽습니다. 현업 개발자와 인프라 담당자 모두에게 실질적인 도움이 됩니다.",
            en: "From Linux server administration and Docker containers to home server builds and backup and monitoring strategies, this collection organizes practical dev and infrastructure knowledge in a structured way. Guides are written step by step, making them easy to follow along. Both working developers and infrastructure engineers will find real, actionable value here.",
            ja: "Linuxサーバー管理からDockerコンテナ、ホームサーバー構築、バックアップとモニタリング戦略まで、開発・インフラ実務に必要な知識を体系的にまとめました。ステップバイステップのガイド形式で構成されているため、初心者でも取り組みやすい内容です。現役の開発者やインフラ担当者にとって実務に直結する情報です。",
            zh: "从Linux服务器管理、Docker容器,到家庭服务器搭建、备份与监控策略,系统整理了开发与基础设施实务所需的各类知识。内容采用分步骤指南的形式,便于跟随学习与实操。无论是一线开发者还是基础设施运维人员,都能从中获得切实可用的帮助。",
        },
        desc: {
            ko: "리눅스 서버 관리, Docker 컨테이너 활용, 홈서버 구축, 백업과 모니터링 전략까지 개발과 인프라 운영에 필요한 실전 노하우를 담은 글 모음입니다. 현업에 바로 적용할 수 있는 단계별 튜토리얼을 꾸준히 제공합니다.",
            en: "Linux server administration, Docker, home server builds, and backup strategies — practical, step-by-step tutorials for developers and sysadmins.",
            ja: "Linuxサーバー管理、Dockerコンテナの活用、ホームサーバー構築、バックアップとモニタリング戦略まで、開発とインフラ運用に必要な実践的なノウハウをまとめた記事集です。現場ですぐ使えるステップバイステップのチュートリアルを継続的に提供します。",
            zh: "全面汇集Linux服务器管理、Docker容器应用、家庭服务器搭建、备份与监控策略等开发与基础设施运维所需的各类实用知识与经验总结。为一线开发者与运维工作者持续提供可直接落地实践的分步骤技术教程与实战解决方案。",
        },
    },
    health: {
        name: { ko: '생활/건강', en: 'Health & Wellness', ja: '健康・暮らし', zh: '生活/健康' },
        intro: {
            ko: "견과류, 고구마, 차 종류 등 몸에 좋은 음식 정보부터 감기 민간요법, 만성질환 관리법까지 일상 건강에 도움이 되는 글을 모았습니다. 근거 있는 정보를 바탕으로 누구나 쉽게 실천할 수 있는 건강 팁을 전합니다. 몸과 마음 모두를 챙기는 균형 잡힌 생활에 참고가 됩니다.",
            en: "From the health benefits of nuts, sweet potatoes, and herbal teas to home remedies for colds and tips for managing chronic conditions, this collection brings together everyday wellness advice. Each article offers practical, evidence-informed guidance that's easy to put into practice. Use it as a reference for maintaining a balanced, healthy lifestyle for both body and mind.",
            ja: "ナッツやさつまいも、お茶類など体に良い食品の情報から、風邪の民間療法、慢性疾患の管理法まで、日常の健康に役立つ記事を集めました。根拠に基づいた情報をもとに、誰でも簡単に実践できる健康のコツを紹介しています。心と体のバランスを整えた生活を送るための参考になります。",
            zh: "从坚果、红薯、各类养生茶等有益健康的饮食知识,到感冒民间疗法、慢性病管理方法,汇集了众多贴近日常生活的健康类文章。内容基于可靠信息,提供人人都能轻松实践的健康小贴士。为兼顾身心健康的均衡生活方式提供参考。",
        },
        desc: {
            ko: "견과류, 고구마, 각종 차 등 몸에 좋은 식품 정보부터 감기 민간요법, 만성질환 관리법까지 일상 건강에 도움이 되는 글을 모았습니다. 근거를 바탕으로 누구나 쉽게 실천할 수 있는 건강 팁을 꾸준히 전합니다.",
            en: "Health benefits of nuts, sweet potatoes, and herbal teas, plus cold remedies and chronic condition tips — practical wellness advice for body and mind.",
            ja: "ナッツやさつまいも、各種お茶など体に良い食品の情報から、風邪の民間療法、慢性疾患の管理法まで、日常の健康に役立つ記事を幅広く集めました。信頼できる根拠に基づき、誰でも簡単に実践できる健康のコツを継続的にお届けします。",
            zh: "从坚果、红薯、各类养生茶等有益健康的日常饮食知识,到感冒民间疗法、慢性病日常管理方法,汇集了众多贴近生活的实用健康类文章与经验分享。以科学可靠的信息为基础,持续提供人人都能轻松实践的健康生活小贴士与实用建议内容。",
        },
    },
    finance: {
        name: { ko: '금융/경제', en: 'Finance & Economy', ja: '金融・経済', zh: '金融/经济' },
        intro: {
            ko: "연말정산, 정부 지원금, 대출 규제, 화폐와 경제의 역사까지 금융/경제와 관련된 다양한 주제를 다룹니다. 복잡한 제도와 정책을 알기 쉬운 언어로 풀어 설명하는 데 중점을 두었습니다. 실생활에 바로 적용할 수 있는 경제 정보를 찾는 분들에게 도움이 됩니다.",
            en: "Covering year-end tax settlements, government support programs, loan regulations, and even the history of money and economics, this collection tackles a wide range of finance and economy topics. Complex systems and policies are explained in clear, accessible language. It's a helpful resource for anyone looking for economic information they can apply right away.",
            ja: "年末調整、政府支援金、ローン規制から貨幣と経済の歴史まで、金融・経済に関する幅広いテーマを扱っています。複雑な制度や政策をわかりやすい言葉で解説することに重点を置きました。実生活にすぐ役立つ経済情報を探している方に役立ちます。",
            zh: "从年终结算、政府补贴、贷款监管政策,到货币与经济发展史,涵盖了金融经济领域的多元主题。内容着重以通俗易懂的语言解读复杂的制度与政策。为希望获取可直接应用于日常生活的经济知识的读者提供帮助。",
        },
        desc: {
            ko: "연말정산, 정부 지원금, 대출 규제, 화폐와 경제의 역사에 이르기까지 금융과 경제 관련 다양한 주제를 다룹니다. 복잡한 제도와 정책을 알기 쉬운 언어로 풀어 실생활에 도움이 되는 정보를 꾸준히 전합니다.",
            en: "Year-end tax settlements, government support programs, loan regulations, and the history of money — economic insights explained in clear, practical language.",
            ja: "年末調整、政府支援金、ローン規制から貨幣と経済の歴史まで、金融と経済に関する幅広いテーマを詳しく丁寧に解説しています。複雑な制度や政策をわかりやすい言葉で解説し、実生活にすぐ役立つ情報を継続的に丁寧にお届けします。",
            zh: "从年终结算、政府补贴申请、贷款监管政策,到货币与经济发展历史,全面涵盖金融经济领域的多元主题与深度分析解读内容。以通俗易懂的语言解读复杂制度与政策变化,持续为读者提供贴近日常生活的实用财经知识与理财投资建议内容。",
        },
    },
    law: {
        name: { ko: '생활/법률', en: 'Law & Legal', ja: '暮らしと法律', zh: '生活/法律' },
        intro: {
            ko: "계약서 작성, 온라인 사기 대응, 개인정보 보호, 각종 법률 분쟁 대처법 등 생활 속에서 마주치는 법률 문제를 다룹니다. 어려운 법률 용어를 쉽게 풀어 설명하는 데 중점을 두었습니다. 권리를 지키고 문제를 예방하는 데 실질적인 도움을 드립니다.",
            en: "Covering contract drafting, responding to online fraud, protecting personal information, and handling various legal disputes, this collection addresses legal issues that come up in everyday life. The focus is on explaining complex legal terms in plain, accessible language. It offers practical help for protecting your rights and preventing problems before they happen.",
            ja: "契約書の作成、オンライン詐欺への対応、個人情報保護、各種法的トラブルへの対処法など、生活の中で直面する法律問題を扱います。難しい法律用語をわかりやすく解説することに重点を置きました。権利を守り、トラブルを未然に防ぐための実践的な助けとなります。",
            zh: "涵盖合同起草、应对网络诈骗、个人信息保护、各类法律纠纷处理方法等日常生活中常遇到的法律问题。内容着重将复杂的法律术语用通俗易懂的方式讲解清楚。为维护自身权益、预防潜在纠纷提供切实可行的帮助。",
        },
        desc: {
            ko: "계약서 작성, 온라인 사기 대응, 개인정보 보호, 각종 법률 분쟁 대처법 등 생활 속에서 마주치는 법률 문제를 다룹니다. 어려운 법률 용어를 쉽게 풀어 권리를 지키는 데 실질적인 도움을 드립니다.",
            en: "Contract drafting, online fraud response, personal data protection, and everyday legal disputes — plain-language guidance to help protect your rights.",
            ja: "契約書の作成、オンライン詐欺への対応、個人情報保護、各種法的トラブルへの対処法など、生活の中で直面する法律問題を幅広く詳しく扱います。難しい法律用語をわかりやすく解説し、権利を守るための実践的な助けとなります。",
            zh: "涵盖合同起草、应对网络诈骗、个人信息保护、各类法律纠纷处理方法等日常生活中经常遇到的各种法律问题与应对建议。将复杂繁琐的法律术语用通俗易懂的方式逐一讲解清楚,为维护自身合法权益提供切实可行的应对建议与法律帮助。",
        },
    },
    life: {
        name: { ko: '생활/실용', en: 'Life & Practical', ja: '暮らしの実用', zh: '生活/实用' },
        intro: {
            ko: "여름휴가 예산 짜기, 전기요금 절약법, 국내 여행지 추천 등 일상을 더 알차게 만들어주는 실용 정보를 모았습니다. 누구나 바로 따라 할 수 있는 구체적인 팁 위주로 구성했습니다. 소소하지만 확실한 생활의 변화를 원하는 분들께 추천합니다.",
            en: "From budgeting for a summer vacation and saving on electricity bills to recommendations for domestic travel destinations, this collection gathers practical tips for making everyday life a little better. Each article focuses on concrete advice anyone can follow right away. Recommended for anyone looking for small but meaningful improvements to daily living.",
            ja: "夏休みの予算の立て方、電気代の節約術、国内旅行先のおすすめなど、日常をより充実させる実用的な情報を集めました。誰でもすぐに実践できる具体的なコツを中心に構成しています。小さくても確かな生活の変化を求める方におすすめです。",
            zh: "从暑假预算规划、省电技巧,到国内旅游胜地推荐,汇集了让日常生活更加充实的实用信息。内容以人人都能立即上手的具体技巧为主。适合希望在生活中做出微小却切实改变的读者参考。",
        },
        desc: {
            ko: "여름휴가 예산 짜기, 전기요금 절약법, 국내 여행지 추천 등 일상을 더 알차고 편리하게 만들어주는 실용 정보를 모았습니다. 누구나 바로 따라 할 수 있는 구체적인 생활 팁을 꾸준히 소개합니다.",
            en: "Budgeting for summer vacations, saving on electricity bills, and top domestic travel spots — practical tips anyone can follow to make daily life easier.",
            ja: "夏休みの予算の立て方、電気代の節約術、国内旅行先のおすすめなど、日常をより充実させる実用的な情報を幅広く詳しくご紹介します。誰でもすぐに実践できる具体的な生活のコツを継続的に、わかりやすく丁寧に詳しくお届けします。",
            zh: "从暑假预算规划、日常省电技巧,到国内热门旅游胜地推荐,汇集了让日常生活更加充实便利的各类实用生活信息与经验分享。以人人都能立即上手的具体技巧为主,持续为读者带来贴近生活的省心省钱的各类实用生活小妙招与建议内容。",
        },
    },
    culture: {
        name: { ko: '트렌드/문화', en: 'Trends & Culture', ja: 'トレンド・カルチャー', zh: '潮流/文化' },
        intro: {
            ko: "AI 시대의 게임 산업 변화, 새로운 엔터테인먼트 트렌드, 사회적으로 화제가 되는 문화 이슈까지 폭넓게 다룹니다. 빠르게 변하는 트렌드를 발 빠르게 포착해 전달하는 데 중점을 둡니다. 요즘 무엇이 화제인지 궁금한 분들께 신선한 읽을거리를 제공합니다.",
            en: "From shifts in the gaming industry driven by AI to emerging entertainment trends and culturally significant social issues, this collection covers a wide range of topics. The focus is on quickly capturing and sharing fast-moving trends as they happen. It offers fresh reading for anyone curious about what's making waves right now.",
            ja: "AI時代におけるゲーム産業の変化、新しいエンターテインメントのトレンド、社会的に話題となっている文化的トピックまで幅広く扱います。目まぐるしく変化するトレンドをいち早く捉えて伝えることに重点を置いています。今何が話題なのか気になる方に、新鮮な読み物を提供します。",
            zh: "从AI时代下游戏产业的变革,到新兴娱乐趋势、引发社会广泛关注的文化话题,内容覆盖面广泛。着重快速捕捉并传递瞬息万变的潮流动态。为关心当下热点话题的读者提供新鲜有趣的阅读内容。",
        },
        desc: {
            ko: "AI 시대의 게임 산업 변화, 새로운 엔터테인먼트 트렌드, 사회적으로 화제가 되는 문화 이슈까지 폭넓게 다룹니다. 빠르게 변하는 트렌드를 발 빠르게 포착해 신선한 이야기를 꾸준히 전합니다.",
            en: "AI-driven shifts in gaming, emerging entertainment trends, and social issues shaping culture today — fresh stories on what's trending right now.",
            ja: "AI時代におけるゲーム産業の変化、新しいエンターテインメントのトレンド、社会的に話題となっている文化的トピックまで幅広く扱います。目まぐるしく変化するトレンドをいち早く捉え、新鮮な話題を継続的に詳しくお届けします。",
            zh: "从AI时代下游戏产业的深刻变革,到新兴娱乐趋势、引发社会广泛关注的各类文化话题,内容覆盖面十分广泛且深入详实。着重快速捕捉瞬息万变的潮流动态,持续为读者带来新鲜有趣的深度资讯、独家视角与深入专业的解读分析内容。",
        },
    },
};

// -----------------------------------------------------------------------------
// 헤더/푸터 컴포넌트 원본 로딩
// -----------------------------------------------------------------------------
function readComponent(name) {
    return fs.readFileSync(path.join(__dirname, 'components', name), 'utf8').trim();
}

const headerRaw = {};
const footerRaw = {};
for (const lang of LANGUAGES) {
    headerRaw[lang] = readComponent(HEADER_FILES[lang]);
    footerRaw[lang] = readComponent(FOOTER_FILES[lang]);
}

// 언어 스위처 HTML (common.js의 createLanguageSwitcher()/addLanguageSwitcherToHeader()와 동일한 모양)
function buildLangSwitcherHtml(currentLang, slug) {
    const items = LANGUAGES.map(l => {
        const href = l === 'ko' ? `/category/${slug}.html` : `/${l}/category/${slug}.html`;
        const cls = l === currentLang ? ' class="active"' : '';
        return `                    <li><a href="${href}" hreflang="${l}" data-lang="${l}"${cls}>${LANG_DISPLAY[l]}</a></li>`;
    }).join('\n');

    return `<div class="language-switcher">
            <button class="lang-btn" aria-label="Select language" onclick="toggleLangDropdown(event)">
                <span class="current-lang">${currentLang.toUpperCase()}</span>
                <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M2 4l4 4 4-4"/>
                </svg>
            </button>
            <ul class="lang-dropdown" id="lang-dropdown">
${items}
            </ul>
        </div>`;
}

// header.html/{lang}-header.html 원본에 언어 스위처를 삽입해 정적 헤더 생성
function buildHeader(lang, slug) {
    const raw = headerRaw[lang];
    const marker = '<div class="header-container">';
    if (!raw.includes(marker)) {
        throw new Error(`[generate_category_pages] header-container 마커를 찾을 수 없습니다 (lang=${lang})`);
    }
    const switcherWrap = `<div class="lang-switcher-nav" style="position: absolute; right: 10px; top: 10px; z-index: 100;">
            ${buildLangSwitcherHtml(lang, slug)}
        </div>`;
    return raw.replace(marker, `<div class="header-container" style="position: relative;">\n        ${switcherWrap}`);
}

// -----------------------------------------------------------------------------
// 날짜 포맷 (언어별 네이티브 표기)
// -----------------------------------------------------------------------------
const EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

function formatDate(dateStr, lang) {
    const d = new Date(`${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return dateStr;
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const mm = String(m).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    switch (lang) {
        case 'ko': return `${y}년 ${mm}월 ${dd}일`;
        case 'ja': return `${y}年${mm}月${dd}日`;
        case 'zh': return `${y}年${mm}月${dd}日`;
        case 'en':
        default: return `${EN_MONTHS[m - 1]} ${day}, ${y}`;
    }
}

// -----------------------------------------------------------------------------
// 표시명 자기매핑: A3 표준화(2026-07-23) 이후 각 언어 index/배지에 아래 표시명이
// 그대로 실릴 수 있으므로, CATEGORY_META의 언어별 name을 CATEGORY_MAP에 자동 등록한다.
// -----------------------------------------------------------------------------
for (const [slug, meta] of Object.entries(CATEGORY_META)) {
    for (const name of Object.values(meta.name)) {
        if (!CATEGORY_MAP[name]) CATEGORY_MAP[name] = slug;
    }
}

// -----------------------------------------------------------------------------
// posts/index.json 로딩 및 카테고리 정규화
// -----------------------------------------------------------------------------
function loadPostsIndex(lang) {
    const file = lang === 'ko'
        ? path.join(__dirname, 'posts', 'index.json')
        : path.join(__dirname, lang, 'posts', 'index.json');
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(data.posts) ? data.posts : [];
}

function categorizePosts(posts) {
    const buckets = {};
    CATEGORY_ORDER.forEach(slug => { buckets[slug] = []; });
    const unmapped = {};

    for (const post of posts) {
        const raw = (post.category || '').trim();
        const slug = CATEGORY_MAP[raw];
        if (!slug) {
            unmapped[raw] = (unmapped[raw] || 0) + 1;
            continue;
        }
        buckets[slug].push(post);
    }

    for (const slug of CATEGORY_ORDER) {
        buckets[slug].sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return { buckets, unmapped };
}

// -----------------------------------------------------------------------------
// 페이지 타이틀/헤딩/문구 (언어별)
// -----------------------------------------------------------------------------
function buildTitle(lang, catName) {
    switch (lang) {
        case 'ko': return `${catName} 카테고리 - BrainDetox 기술 블로그`;
        case 'en': return `${catName} Articles - BrainDetox Tech Blog`;
        case 'ja': return `${catName}の記事一覧 - BrainDetox 技術ブログ`;
        case 'zh': return `${catName}分类文章 - BrainDetox 技术博客`;
    }
}

function buildH1(lang, catName) {
    switch (lang) {
        case 'ko': return `${catName} 카테고리`;
        case 'en': return `${catName} Articles`;
        case 'ja': return `${catName}の記事一覧`;
        case 'zh': return `${catName}分类文章`;
    }
}

function buildCountLabel(lang, count) {
    switch (lang) {
        case 'ko': return `총 ${count}개의 글`;
        case 'en': return `${count} articles`;
        case 'ja': return `${count}件の記事`;
        case 'zh': return `共 ${count} 篇文章`;
    }
}

// -----------------------------------------------------------------------------
// 페이지 본문 조립
// -----------------------------------------------------------------------------
function buildPage(lang, slug, posts) {
    const meta = CATEGORY_META[slug];
    const catName = meta.name[lang];
    const introText = meta.intro[lang];
    const descText = meta.desc[lang];
    const count = posts.length;

    const depth = lang === 'ko' ? 1 : 2;
    const cssPath = depth === 1 ? '../styles.css' : '../../styles.css';
    const jsPath = depth === 1 ? '../common.js' : '../../common.js';

    const canonicalPath = lang === 'ko' ? `/category/${slug}.html` : `/${lang}/category/${slug}.html`;
    const canonicalUrl = `${BASE_URL}${canonicalPath}`;

    const title = buildTitle(lang, catName);
    const h1 = buildH1(lang, catName);
    const countLabel = buildCountLabel(lang, count);

    // hreflang 5종 (4개 언어 + x-default)
    const hreflangLines = LANGUAGES.map(l => {
        const p = l === 'ko' ? `/category/${slug}.html` : `/${l}/category/${slug}.html`;
        return `    <link rel="alternate" hreflang="${l}" href="${BASE_URL}${p}">`;
    });
    hreflangLines.push(`    <link rel="alternate" hreflang="x-default" href="${BASE_URL}/category/${slug}.html">`);
    const hreflangBlock = hreflangLines.join('\n');

    // 글 목록 (정적 <a> 링크, 날짜 내림차순은 이미 정렬됨)
    const postListHtml = posts.map(p => {
        const dateLabel = formatDate(p.date, lang);
        return `                    <li class="post-item"><a href="../posts/${p.filename}">${p.title}</a><span class="post-date">${dateLabel}</span></li>`;
    }).join('\n');

    // JSON-LD (CollectionPage + ItemList, 상위 30개)
    const postBaseUrl = lang === 'ko' ? `${BASE_URL}/posts/` : `${BASE_URL}/${lang}/posts/`;
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: title,
        description: descText,
        url: canonicalUrl,
        inLanguage: IN_LANGUAGE[lang],
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: count,
            itemListElement: posts.slice(0, 30).map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `${postBaseUrl}${p.filename}`,
                name: p.title,
            })),
        },
    };

    const headerHtml = buildHeader(lang, slug);
    const footerHtml = footerRaw[lang];

    return `<!DOCTYPE html>
<!--
 * ${catName} - Category Hub Page (자동 생성)
 * generate_category_pages.js 로 생성됨 — 수동 편집 금지
 * Copyright (c) 2023-2026 braindetox.kr
 * All rights reserved.
-->
<html lang="${lang}">
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-YE3ELRSMZE"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-YE3ELRSMZE');
    </script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${descText}">
    <meta name="robots" content="index, follow">
    <title>${title}</title>

    <link rel="canonical" href="${canonicalUrl}">
${hreflangBlock}

    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${cssPath}">

    <!-- Google AdSense (자동 광고 스크립트만 사용, 수동 <ins> 광고 단위는 넣지 않음) -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7911569280980377" crossorigin="anonymous"></script>

    <link rel="icon" type="image/x-icon" href="https://braindetox.kr/favicon.ico">

    <!-- Open Graph -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${descText}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:image" content="https://braindetox.kr/site_logo.png">
    <meta property="og:image:width" content="800">
    <meta property="og:image:height" content="600">
    <meta property="og:site_name" content="BrainDetox Utility Box">
    <meta property="og:locale" content="${OG_LOCALE[lang]}">

    <!-- Twitter 카드 -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${descText}">
    <meta name="twitter:image" content="https://braindetox.kr/site_logo.png">
    <meta name="twitter:site" content="@braindetox">
    <meta name="twitter:creator" content="@braindetox">

    <!-- 공통 JavaScript (언어 스위처 토글 등 전역 함수 용도로만 사용) -->
    <script src="${jsPath}"></script>

    <!-- 구조화된 데이터 - JSON-LD -->
    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
    </script>
</head>
<body>
${headerHtml}

    <main class="container">
        <section class="content-section">
            <h1>${h1}</h1>

            <div class="blog-intro">
                <p>${introText}</p>
            </div>

            <div class="post-list-container">
                <div style="text-align: center; color: #7f8c8d; font-size: 0.95rem; margin-bottom: 15px;">${countLabel}</div>
                <ul class="post-list">
${postListHtml}
                </ul>
            </div>
        </section>
    </main>

${footerHtml}
</body>
</html>
`;
}

// -----------------------------------------------------------------------------
// 메인 실행
// -----------------------------------------------------------------------------
function main() {
    console.log('카테고리 SEO 허브 페이지 생성 시작...\n');

    const report = {};
    let totalWarnings = 0;
    let filesWritten = 0;

    for (const lang of LANGUAGES) {
        const posts = loadPostsIndex(lang);
        const { buckets, unmapped } = categorizePosts(posts);

        report[lang] = { total: posts.length, counts: {}, unmapped };

        const outDir = lang === 'ko'
            ? path.join(__dirname, 'category')
            : path.join(__dirname, lang, 'category');
        fs.mkdirSync(outDir, { recursive: true });

        for (const slug of CATEGORY_ORDER) {
            const bucketPosts = buckets[slug];
            report[lang].counts[slug] = bucketPosts.length;
            const html = buildPage(lang, slug, bucketPosts);
            fs.writeFileSync(path.join(outDir, `${slug}.html`), html, 'utf8');
            filesWritten++;
        }

        const unmappedTotal = Object.values(unmapped).reduce((a, b) => a + b, 0);
        if (unmappedTotal > 0) {
            totalWarnings += unmappedTotal;
            console.warn(`⚠ [${lang}] 매핑되지 않은 category 값 ${unmappedTotal}건 (제외됨):`);
            for (const [raw, cnt] of Object.entries(unmapped)) {
                console.warn(`    - "${raw}": ${cnt}건`);
            }
        }
    }

    console.log('\n=== 생성 요약 ===');
    for (const lang of LANGUAGES) {
        const mappedTotal = CATEGORY_ORDER.reduce((sum, slug) => sum + report[lang].counts[slug], 0);
        console.log(`\n[${lang}] index 총 ${report[lang].total}건 / 매핑 ${mappedTotal}건`);
        for (const slug of CATEGORY_ORDER) {
            console.log(`  - ${slug.padEnd(8)}: ${report[lang].counts[slug]}건`);
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ 카테고리 허브 페이지 생성 완료`);
    console.log(`   📄 생성 파일: ${filesWritten}개 (${LANGUAGES.length}개 언어 x ${CATEGORY_ORDER.length}개 카테고리)`);
    console.log(`   ⚠ 매핑 경고 총합: ${totalWarnings}건`);
    console.log('='.repeat(50));
}

main();
