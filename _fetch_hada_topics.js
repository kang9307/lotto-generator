/**
 * GeekNews (news.hada.io) 토픽 추출기
 *
 * 사용법:
 *   node _fetch_hada_topics.js                 # 오늘 (자정 기준)
 *   node _fetch_hada_topics.js 2026-05-15      # 특정 날짜
 *   node _fetch_hada_topics.js 2026-05-15 15   # 상위 15개
 *
 * 출력:
 *   _hada_topics_YYYY-MM-DD.json (구조화 데이터)
 *   터미널 출력 (사람용 요약)
 *
 * 주의:
 *   - hada.io의 글/원문은 **절대 복제/번역 금지**
 *   - 이 데이터는 토픽 발굴(주제 찾기) 용도로만 사용
 *   - blog 작성 시 본인 의견 중심으로 자체 작성하고 "참고 자료"에 링크만
 */

const https = require('https');
const fs = require('fs');

// TLS 인증서 검증 우회 (회사 망 SSL 인터셉트 환경 대응)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const arg1 = process.argv[2];
const arg2 = process.argv[3];

const date = arg1 || new Date().toISOString().slice(0, 10);
const topN = parseInt(arg2, 10) || 10;

if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error('Invalid date format. Use YYYY-MM-DD');
  process.exit(1);
}

const url = `https://news.hada.io/past?day=${date}`;
const outputPath = `_hada_topics_${date}.json`;

console.log(`Fetching: ${url}`);

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8'
  }
}, (res) => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    const topics = parseTopics(html);

    if (topics.length === 0) {
      console.error('No topics found. Page structure may have changed.');
      process.exit(1);
    }

    // 자동 점수 매기기
    topics.forEach(t => {
      const s = scoreTopic(t);
      t.score = s.total;
      t.scoreBreakdown = s.breakdown;
      t.recommendation = s.recommendation;
    });

    const result = topics.slice(0, topN);
    const top3 = [...result].sort((a, b) => b.score - a.score).slice(0, 3);

    fs.writeFileSync(outputPath, JSON.stringify({
      date,
      fetchedAt: new Date().toISOString(),
      count: result.length,
      top3Ranks: top3.map(t => t.rank),
      topics: result
    }, null, 2));

    console.log(`\n📰 GeekNews 토픽 추출 완료 (${date})`);
    console.log(`📁 저장: ${outputPath}`);
    console.log(`📊 추출 수: ${result.length}개\n`);
    console.log('=' .repeat(80));

    // 🏆 AI 추천 톱 3 (상단 강조)
    console.log('\n🏆 오늘의 추천 톱 3 (BrainDetox 사이트 핏 기반 자동 분석)\n');
    top3.forEach((t, i) => {
      console.log(`★ #${t.rank} [score: ${t.score}/100] ${t.title}`);
      console.log(`   📝 추천 이유: ${t.recommendation}`);
      console.log(`   🔗 ${t.url}`);
      console.log();
    });

    console.log('=' .repeat(80));
    console.log('\n📋 전체 톱 ' + result.length + '개:\n');

    result.forEach((t, i) => {
      const star = top3.find(x => x.rank === t.rank) ? ' ★' : '';
      console.log(`[${i + 1}]${star} ${t.title} (score: ${t.score})`);
      console.log(`    👍 ${t.points} pts  💬 ${t.comments} comments  👤 ${t.user}`);
      console.log(`    🔗 ${t.url}`);
      console.log(`    💭 ${t.description.slice(0, 100)}${t.description.length > 100 ? '...' : ''}`);
      console.log(`    📌 hada: ${t.hadaUrl}`);
      console.log();
    });

    console.log('=' .repeat(80));
    console.log('\n📌 사용법 (Claude Code에서):');
    console.log(`   "오늘 hada ${top3[0].rank}번 글 써줘"  (← 추천 1위 즉시 작성)`);
    console.log(`   "hada ${date} ${top3[1].rank}"  (← 추천 2위)`);
    console.log('\n⚠️  원문 번역 금지. 본인 관점/한국 시장 분석/실무 적용 의견 중심으로 작성.\n');
  });
}).on('error', e => {
  console.error('Fetch failed:', e.message);
  process.exit(1);
});

function parseTopics(html) {
  const topics = [];

  // topic_row 단위로 분할
  const rowRegex = /<div class='topic_row'[^>]*data-topic-state-id='(\d+)'[^>]*>([\s\S]*?)(?=<div class='topic_row'|<div class='listfooter'|<div class='footer'|$)/g;

  let match;
  let rank = 0;
  while ((match = rowRegex.exec(html)) !== null) {
    rank++;
    const id = match[1];
    const row = match[2];

    const titleMatch = row.match(/<a href='([^']+)' rel='nofollow' id='tr\d+'>\s*<h1>([^<]+)<\/h1>/);
    if (!titleMatch) continue;

    const url = titleMatch[1].trim();
    const title = decodeEntities(titleMatch[2].trim());

    const sourceMatch = row.match(/<span class=topicurl>\(([^)]+)\)<\/span>/);
    const source = sourceMatch ? sourceMatch[1].trim() : '';

    const descMatch = row.match(/<div class='topicdesc'>\s*<a[^>]*>([\s\S]*?)<\/a>/);
    const description = descMatch ? decodeEntities(stripTags(descMatch[1])).trim() : '';

    const pointsMatch = row.match(/<span id='tp\d+'>(\d+)<\/span>\s*points/);
    const points = pointsMatch ? parseInt(pointsMatch[1], 10) : 0;

    const userMatch = row.match(/<a href='\/@([^']+)'>/);
    const user = userMatch ? userMatch[1] : '';

    const commentsMatch = row.match(/댓글\s*(\d+)\s*개/);
    const comments = commentsMatch ? parseInt(commentsMatch[1], 10) : 0;

    topics.push({
      rank,
      id,
      title,
      url,
      source,
      description,
      points,
      comments,
      user,
      hadaUrl: `https://news.hada.io/topic?id=${id}`
    });
  }

  return topics;
}

// ============================================================
// 🤖 토픽 자동 점수 산정 (BrainDetox 사이트 핏 기반)
// ============================================================
//
// 평가 기준:
//   1. Engagement (40점): 인기도/토론 활성도
//   2. Site Fit (35점): braindetox.kr 콘텐츠와의 적합성
//   3. SEO Potential (15점): 검색 키워드 강도
//   4. Freshness (10점): 토픽의 신선도/장기성
//
// braindetox.kr 핵심 영역:
//   AI/LLM/에이전트, 개발 도구(IDE/CLI), 인프라/DevOps,
//   클라우드/스토리지(Ceph), 보안, 한국 시장
//
function scoreTopic(t) {
  const breakdown = { engagement: 0, siteFit: 0, seo: 0, freshness: 0 };
  const reasons = [];

  // 1. Engagement (40점)
  if (t.points >= 15) { breakdown.engagement += 25; reasons.push(`고인기(${t.points}pts)`); }
  else if (t.points >= 10) { breakdown.engagement += 20; reasons.push(`인기(${t.points}pts)`); }
  else if (t.points >= 5) breakdown.engagement += 12;
  else if (t.points >= 2) breakdown.engagement += 5;

  if (t.comments >= 10) { breakdown.engagement += 15; reasons.push(`활발한 토론(${t.comments}코멘트)`); }
  else if (t.comments >= 5) { breakdown.engagement += 10; reasons.push(`토론 활성`); }
  else if (t.comments >= 2) breakdown.engagement += 6;
  else if (t.comments >= 1) breakdown.engagement += 2;

  // 2. Site Fit (35점) - 키워드 매칭
  const text = (t.title + ' ' + t.description).toLowerCase();

  const aiKeywords = ['ai', 'llm', 'gpt', 'claude', 'gemini', 'anthropic', 'openai', '에이전트', 'agent', 'mcp', '인공지능', '머신러닝', '딥러닝'];
  const aiHits = aiKeywords.filter(k => text.includes(k)).length;
  if (aiHits >= 3) { breakdown.siteFit += 20; reasons.push('AI 강한 핏'); }
  else if (aiHits >= 1) { breakdown.siteFit += 15; reasons.push('AI 관련'); }

  const devKeywords = ['code', 'cursor', 'vscode', 'ide', 'cli', 'github', '개발', '프로그래밍', 'python', 'rust', 'go', 'javascript', 'typescript', 'docker', 'kubernetes', 'k8s'];
  const devHits = devKeywords.filter(k => text.includes(k)).length;
  if (devHits >= 2) { breakdown.siteFit += 10; reasons.push('개발 도구'); }
  else if (devHits >= 1) breakdown.siteFit += 5;

  const infraKeywords = ['ceph', 'storage', 'cloud', 'aws', '클라우드', '스토리지', '서버', 'linux', 's3', 'rust', 'minio'];
  const infraHits = infraKeywords.filter(k => text.includes(k)).length;
  if (infraHits >= 2) { breakdown.siteFit += 8; reasons.push('인프라/스토리지'); }
  else if (infraHits >= 1) breakdown.siteFit += 4;

  const koreanKeywords = ['한국', '국내', 'korea', '韓國', '한글', '서울', '카카오', '네이버', '쿠팡', '토스'];
  if (koreanKeywords.some(k => text.includes(k))) { breakdown.siteFit += 7; reasons.push('한국 시장'); }

  // URL source 신뢰도
  if (t.url.includes('github.com')) breakdown.siteFit += 3;
  if (t.url.includes('anthropic.com') || t.url.includes('openai.com') || t.url.includes('google.com') || t.url.includes('arxiv.org')) breakdown.siteFit += 5;

  // 3. SEO Potential (15점)
  const titleWords = t.title.split(/\s+/).length;
  if (titleWords >= 4 && titleWords <= 12) breakdown.seo += 5;

  // 신상품 이름 (버전 번호 포함) → SEO 선점 가능
  if (/\d+\.\d+|\d+점|v\d|버전|version/i.test(t.title)) { breakdown.seo += 5; reasons.push('신상 SEO 선점 가능'); }

  // "비교", "vs", "차이" 단어 → 비교형 검색 수요
  if (/vs|비교|차이|대안|alternative/i.test(text)) { breakdown.seo += 5; reasons.push('비교형 검색 수요'); }

  // 4. Freshness (10점)
  // 본문이 충분히 길수록 깊이 있는 토픽
  if (t.description.length >= 150) breakdown.freshness += 5;
  if (t.description.length >= 80) breakdown.freshness += 3;

  // 트렌딩 키워드
  const trendKeywords = ['2026', '2025', '출시', 'release', 'launch', '공개', '발표'];
  if (trendKeywords.some(k => text.includes(k))) { breakdown.freshness += 5; reasons.push('트렌딩'); }

  // 감점: 너무 짧은 설명, 0 코멘트
  if (t.description.length < 50) breakdown.engagement -= 5;
  if (t.points === 0 && t.comments === 0) breakdown.engagement -= 10;

  // Show GN(자기 홍보) 감점
  if (/show gn|show hn/i.test(t.title)) { breakdown.siteFit -= 5; reasons.push('자기홍보 감점'); }

  const total = Math.max(0, Math.min(100,
    breakdown.engagement + breakdown.siteFit + breakdown.seo + breakdown.freshness
  ));

  const recommendation = reasons.length > 0 ? reasons.join(', ') : '핏 보통';

  return { total, breakdown, recommendation };
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, '');
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}
