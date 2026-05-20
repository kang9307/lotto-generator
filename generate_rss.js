/**
 * RSS feed 다국어 생성 스크립트
 * Copyright (c) 2026 braindetox.kr
 *
 * 사용법: node generate_rss.js
 *
 * 생성 파일:
 * - rss.xml         (한국어, 메인)
 * - en/rss.xml      (영어)
 * - ja/rss.xml      (일본어)
 * - zh/rss.xml      (중국어)
 *
 * 각 RSS feed에는 최근 30개 포스트의 메타데이터 포함.
 * 구글/Bing/Yandex 등이 새 콘텐츠 발견 속도를 높이는 데 사용.
 *
 * 신규 포스트 발행 후 generate_sitemap.js와 함께 실행 권장.
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://braindetox.kr';
const ITEMS_PER_FEED = 30;

const LANGS = [
  { code: 'ko', dir: '.',  indexPath: 'posts/index.json',     postsPath: '/posts',     siteTitle: 'BrainDetox - 개발자 도구·블로그', siteDesc: '개발자 도구, IT/기술 트렌드, AI 코딩, DevOps, 라이프스타일을 다루는 BrainDetox 기술 블로그' },
  { code: 'en', dir: 'en', indexPath: 'en/posts/index.json',  postsPath: '/en/posts',  siteTitle: 'BrainDetox - Developer Tools & Tech Blog', siteDesc: 'Developer tools, IT trends, AI coding, DevOps, and lifestyle topics from BrainDetox tech blog' },
  { code: 'ja', dir: 'ja', indexPath: 'ja/posts/index.json',  postsPath: '/ja/posts',  siteTitle: 'BrainDetox - 開発者ツール・技術ブログ', siteDesc: '開発者ツール、IT・技術トレンド、AIコーディング、DevOps、ライフスタイルを扱うBrainDetox技術ブログ' },
  { code: 'zh', dir: 'zh', indexPath: 'zh/posts/index.json',  postsPath: '/zh/posts',  siteTitle: 'BrainDetox - 开发者工具·技术博客', siteDesc: '开发者工具、IT/技术趋势、AI编程、DevOps与生活方式 - BrainDetox技术博客' }
];

// XML 특수문자 이스케이프
function xmlEscape(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// YYYY-MM-DD → RFC 822 (RSS pubDate 표준)
function toRfc822(dateStr) {
  const d = new Date(dateStr + 'T09:00:00+09:00'); // KST 오전 9시 가정
  return d.toUTCString();
}

// 카테고리 다국어 매핑
const CATEGORY_MAP = {
  'IT/기술': { ko: 'IT/기술', en: 'Tech', ja: 'IT・技術', zh: 'IT/技术' },
  '생활/건강': { ko: '생활/건강', en: 'Life & Health', ja: '生活・健康', zh: '生活/健康' },
  '금융/경제': { ko: '금융/경제', en: 'Finance', ja: '金融・経済', zh: '金融/经济' },
  '자기계발': { ko: '자기계발', en: 'Self-Improvement', ja: '自己啓発', zh: '自我提升' },
  '법률상식': { ko: '법률상식', en: 'Legal', ja: '法律', zh: '法律常识' }
};

function localizeCategory(cat, lang) {
  if (!cat) return '';
  const map = CATEGORY_MAP[cat];
  return map ? (map[lang] || cat) : cat;
}

// 포스트 메타에서 description 생성 (keywords 기반 간략 요약)
function buildDescription(post, lang) {
  if (post.description) return post.description;
  const kws = (post.keywords || '').split(',').map(s => s.trim()).filter(Boolean).slice(0, 6).join(', ');
  if (!kws) return post.title;
  const tmpl = {
    ko: `${post.title}. 주요 키워드: ${kws}`,
    en: `${post.title}. Key topics: ${kws}`,
    ja: `${post.title}。主なトピック: ${kws}`,
    zh: `${post.title}。主要话题: ${kws}`
  };
  return tmpl[lang] || tmpl.en;
}

// RSS 2.0 XML 생성
function buildRss(lang, posts) {
  const lastBuild = new Date().toUTCString();
  const channelUrl = `${BASE_URL}${lang.code === 'ko' ? '' : '/' + lang.code}`;
  const feedUrl = `${BASE_URL}${lang.code === 'ko' ? '' : '/' + lang.code}/rss.xml`;

  const items = posts.slice(0, ITEMS_PER_FEED).map(p => {
    const postUrl = `${BASE_URL}${lang.postsPath}/${p.filename}`;
    const cat = localizeCategory(p.category, lang.code);
    const desc = buildDescription(p, lang.code);
    return `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${xmlEscape(postUrl)}</link>
      <guid isPermaLink="true">${xmlEscape(postUrl)}</guid>
      <pubDate>${toRfc822(p.date)}</pubDate>
      <category>${xmlEscape(cat)}</category>
      <description><![CDATA[${desc}]]></description>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${xmlEscape(lang.siteTitle)}</title>
    <link>${xmlEscape(channelUrl)}</link>
    <description>${xmlEscape(lang.siteDesc)}</description>
    <language>${lang.code}</language>
    <copyright>Copyright © ${new Date().getFullYear()} BrainDetox. All rights reserved.</copyright>
    <atom:link href="${xmlEscape(feedUrl)}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <image>
      <url>${BASE_URL}/site_logo.png</url>
      <title>${xmlEscape(lang.siteTitle)}</title>
      <link>${xmlEscape(channelUrl)}</link>
    </image>
${items}
  </channel>
</rss>
`;
}

// 메인 실행
function main() {
  const root = __dirname;
  let total = 0;

  LANGS.forEach(lang => {
    const idxPath = path.join(root, lang.indexPath);
    if (!fs.existsSync(idxPath)) {
      console.log(`⚠️  ${lang.indexPath} 없음 - 건너뜀`);
      return;
    }

    const data = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
    const posts = (data.posts || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date));

    const rss = buildRss(lang, posts);
    const outPath = lang.code === 'ko'
      ? path.join(root, 'rss.xml')
      : path.join(root, lang.dir, 'rss.xml');

    fs.writeFileSync(outPath, rss, 'utf8');
    const itemCount = Math.min(posts.length, ITEMS_PER_FEED);
    console.log(`✅ ${outPath.replace(root + path.sep, '')} 생성 (${itemCount}개 항목)`);
    total += itemCount;
  });

  console.log(`\n📡 RSS feed 4개 생성 완료 (총 ${total}개 항목)`);
  console.log('   - https://braindetox.kr/rss.xml      (한국어)');
  console.log('   - https://braindetox.kr/en/rss.xml   (영어)');
  console.log('   - https://braindetox.kr/ja/rss.xml   (일본어)');
  console.log('   - https://braindetox.kr/zh/rss.xml   (중국어)');
}

main();
