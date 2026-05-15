const fs = require('fs');
const path = 'posts/index.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const NEW_POSTS = [
  {
    id: 'pet_summer_care_guide_2026',
    filename: 'pet_summer_care_guide_2026.html',
    title: '2026 반려동물 여름 관리 - 열사병·산책·사료 보관 가이드',
    date: '2026-05-14',
    category: '생활/건강',
    keywords: '반려동물 여름, 강아지 열사병, 고양이 더위, 반려동물 산책, 사료 보관, 펫 여름, 동물병원 응급, 반려동물 건강, 펫 케어, 펫 호텔',
    featured: true
  },
  {
    id: 'houseplant_summer_care_guide_2026',
    filename: 'houseplant_summer_care_guide_2026.html',
    title: '2026 반려식물 여름 관리 - 잎 마름·물주기·통풍 완벽 가이드',
    date: '2026-05-14',
    category: '생활/취미',
    keywords: '반려식물, 식물 키우기, 여름 식물 관리, 다육이, 몬스테라, 산세베리아, 식물 물주기, 식물 통풍, 식물 분갈이, 식물 비료',
    featured: true
  },
  {
    id: 'ai_video_generation_tools_2026_comparison',
    filename: 'ai_video_generation_tools_2026_comparison.html',
    title: 'AI 영상 생성 도구 2026 - Sora 2 · Veo 3 · Runway 비교',
    date: '2026-05-14',
    category: 'IT/기술',
    keywords: 'AI 영상 생성, Sora 2, Veo 3, Runway, Pika, AI 비디오, 영상 AI, OpenAI Sora, Google Veo, 크리에이터 도구',
    featured: true
  },
  {
    id: 'ai_music_generation_tools_2026_comparison',
    filename: 'ai_music_generation_tools_2026_comparison.html',
    title: 'AI 음악 생성 도구 2026 - Suno v5 · Udio · Stable Audio 비교',
    date: '2026-05-14',
    category: 'IT/기술',
    keywords: 'AI 음악, Suno v5, Udio, Stable Audio, AIVA, AI 작곡, 음악 생성, AI 보컬, 인디 음악, AI BGM',
    featured: true
  },
  {
    id: 'ai_tutor_alternative_to_academies_2026',
    filename: 'ai_tutor_alternative_to_academies_2026.html',
    title: 'AI 튜터 2026 비교 - 학원·인강 대체할 수 있을까',
    date: '2026-05-14',
    category: 'IT/기술',
    keywords: 'AI 튜터, Khanmigo, Duolingo Max, ChatGPT 학습, 산타토익, AI 학습, 학원 대체, 인강 대체, AI 교육, 자기주도 학습',
    featured: true
  },
  {
    id: 'diet_supplements_2026_comparison',
    filename: 'diet_supplements_2026_comparison.html',
    title: '다이어트 보조제 2026 정보 - 성분별 작용·부작용 가이드',
    date: '2026-05-14',
    category: '건강/식단',
    keywords: '다이어트 보조제, 가르시니아, EGCG, 글루코만난, 카페인 다이어트, 키토 보조제, 단백질 보충제, 보조제 부작용, 다이어트 정보, 체중 감량',
    featured: true
  }
];

const newFiles = NEW_POSTS.map(p => p.filename);
const filtered = data.files.filter(f => !newFiles.includes(f));
data.files = [...newFiles, ...filtered];

const newIds = NEW_POSTS.map(p => p.id);
data.posts = data.posts.filter(p => !newIds.includes(p.id));
data.posts = [...NEW_POSTS, ...data.posts];

data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
data.posts.forEach((p, i) => { p.featured = i < 5; });

data.totalFiles = data.files.length;
data.lastUpdated = '2026-05-14';

fs.writeFileSync(path, JSON.stringify(data, null, 2));

console.log('=== Index updated ===');
console.log('Total files:', data.totalFiles);
console.log('lastUpdated:', data.lastUpdated);
console.log('New posts added:', NEW_POSTS.length);
console.log('\nTop 5 featured (most recent):');
data.posts.filter(p => p.featured).forEach(p => {
  console.log('  ' + p.date + ' - ' + p.title);
});
