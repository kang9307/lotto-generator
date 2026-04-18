const fs = require('fs');
let h = fs.readFileSync('yg_bus.html', 'utf8');
const before = h.length;

// Note: template은 JSON-escaped string 안에 있음. 백슬래시 escape 유의.

// 1. Title — 키워드 프론트로, 2026 표기
h = h.split('<title>영광터미널 종합 시간안내<\\/title>').join(
  '<title>영광터미널 시간표 2026 | 서울·광주·인천공항·목포·전주·군산 버스 | BrainDetox<\\/title>'
);

// 2. og:title
h = h.split('property=\\"og:title\\" content=\\"영광터미널 종합 시간안내\\"').join(
  'property=\\"og:title\\" content=\\"영광터미널 시간표 2026 | 서울·광주·인천공항 버스 시간안내\\"'
);

// 3. Twitter 타이틀/디스크립션 없으면 추가 (현재 twitter:card만 있음)
// 확인 생략. description 강화 먼저.

// 4. description 강화
const oldDesc = 'name=\\"description\\" content=\\"영광버스터미널 종합 시간안내 — 서울, 광주, 목포, 전주, 군산, 인천공항 방면 버스 시간표\\"';
const newDesc = 'name=\\"description\\" content=\\"2026년 영광버스터미널 최신 시간표. 서울(센트럴)·광주(송정역/문장)·인천공항(심야)·목포(함평/무안)·전주(정읍/고창)·군산(대야)·인천·부천·안산·안양 방면 실시간 다음 버스 안내. 법성→광주 시간표 포함. 금호고속 안내 및 화물 접수 정보.\\"';
h = h.split(oldDesc).join(newDesc);

// 5. meta keywords 추가 (newDesc 바로 뒤)
const keywordsTag = '<meta name=\\"keywords\\" content=\\"영광터미널 시간표, 영광버스터미널, 영광 서울 버스, 영광 광주 버스, 영광 인천공항 버스, 영광 목포 버스, 영광 전주 버스, 영광 군산 버스, 영광 인천 버스, 영광 고속버스, 영광 시외버스, 법성 광주, 영광 심야버스, 영광 송정역, 2026 영광 버스 시간표\\">';
// description 다음에 keywords 삽입
h = h.replace(
  newDesc + '>',
  newDesc + '>\\n' + keywordsTag
);

// 6. robots/googlebot/author 추가 (keywords 뒤)
const extraMetas =
  '<meta name=\\"robots\\" content=\\"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1\\">\\n' +
  '<meta name=\\"googlebot\\" content=\\"index, follow\\">\\n' +
  '<meta name=\\"author\\" content=\\"BrainDetox\\">\\n' +
  '<meta name=\\"language\\" content=\\"Korean\\">\\n' +
  '<meta name=\\"geo.region\\" content=\\"KR-46\\">\\n' +
  '<meta name=\\"geo.placename\\" content=\\"영광군, 전라남도\\">\\n' +
  '<meta http-equiv=\\"content-language\\" content=\\"ko-KR\\">';
h = h.replace(keywordsTag, keywordsTag + '\\n' + extraMetas);

// 7. Favicon blob UUID → 실제 경로
h = h.replace(
  new RegExp('<link rel=\\\\"icon\\\\" type=\\\\"image/png\\\\" href=\\\\"[a-f0-9-]{36}\\\\"'),
  '<link rel=\\"icon\\" type=\\"image/png\\" href=\\"https://braindetox.kr/site_logo.png\\"'
);
h = h.replace(
  new RegExp('<link rel=\\\\"apple-touch-icon\\\\" href=\\\\"[a-f0-9-]{36}\\\\"'),
  '<link rel=\\"apple-touch-icon\\" href=\\"https://braindetox.kr/site_logo.png\\"'
);

// 8. Twitter Card 보강 (title + description 추가)
const twitterCard = '<meta name=\\"twitter:card\\" content=\\"summary_large_image\\">';
const twitterExtras =
  '<meta name=\\"twitter:title\\" content=\\"영광터미널 시간표 2026 | 서울·광주·인천공항·목포·전주\\">\\n' +
  '<meta name=\\"twitter:description\\" content=\\"2026 영광버스터미널 전 방면 최신 시간표 · 실시간 다음 버스 안내\\">\\n' +
  '<meta name=\\"twitter:image\\" content=\\"https://braindetox.kr/site_logo.png\\">';
h = h.replace(twitterCard, twitterCard + '\\n' + twitterExtras);

// 9. JSON-LD 구조화 데이터 (canonical 바로 뒤)
const canonicalTag = '<link rel=\\"canonical\\" href=\\"https://braindetox.kr/yg_bus.html\\">';
const jsonLdData = {
  '@context': 'https://schema.org',
  '@type': 'BusStation',
  'name': '영광버스터미널',
  'alternateName': ['영광터미널', '영광 버스터미널'],
  'url': 'https://braindetox.kr/yg_bus.html',
  'image': 'https://braindetox.kr/site_logo.png',
  'address': {
    '@type': 'PostalAddress',
    'addressCountry': 'KR',
    'addressRegion': '전라남도',
    'addressLocality': '영광군'
  },
  'telephone': '+82-61-353-0040',
  'description': '영광버스터미널 종합 시간표 · 서울·광주·인천공항·목포·전주·군산 방면 고속/시외버스 시간안내',
  'areaServed': ['서울', '광주', '인천공항', '목포', '전주', '군산', '인천', '부천', '안산', '안양', '법성', '함평', '무안', '정읍', '고창', '흥덕', '대야'],
  'openingHours': 'Mo-Fr 08:00-16:30',
  'publisher': {
    '@type': 'Organization',
    'name': 'BrainDetox',
    'url': 'https://braindetox.kr',
    'logo': { '@type': 'ImageObject', 'url': 'https://braindetox.kr/site_logo.png' }
  }
};
const jsonLdScript = '<script type=\\"application/ld+json\\">' +
  JSON.stringify(jsonLdData).replace(/</g, '\\u003c') +
  '<\\/script>';
h = h.replace(canonicalTag, canonicalTag + '\\n' + jsonLdScript);

// WebSite + BreadcrumbList 추가
const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    { '@type': 'ListItem', 'position': 1, 'name': 'BrainDetox', 'item': 'https://braindetox.kr/' },
    { '@type': 'ListItem', 'position': 2, 'name': '영광터미널 시간표', 'item': 'https://braindetox.kr/yg_bus.html' }
  ]
};
const breadcrumbScript = '<script type=\\"application/ld+json\\">' +
  JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c') +
  '<\\/script>';
h = h.replace(jsonLdScript, jsonLdScript + '\\n' + breadcrumbScript);

fs.writeFileSync('yg_bus.html', h);
console.log('SEO 개선 적용 완료 - diff:', h.length - before, 'bytes');
