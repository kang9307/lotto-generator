/**
 * 블로그 포스트 자동 검증 스크립트
 * Copyright (c) 2026 braindetox.kr
 *
 * 사용법:
 *   node validate_posts.js {slug}          # 특정 슬러그의 4언어 파일 검증
 *   node validate_posts.js --all           # 최근 발행분 검증 (오늘 + 1일)
 *   node validate_posts.js --check-slug X  # 슬러그 충돌 검사만
 *
 * 검증 항목:
 *  1. 4언어 파일 존재
 *  2. Meta description 25~160자
 *  3. AdSense <ins> 태그 본문 없음 (자동 광고 only)
 *  4. JSON-LD BlogPosting + FAQPage 4언어 모두 포함
 *  5. hreflang × 5, canonical, OG 1200x630, Twitter Card
 *  6. GA·AdSense·Kakao SDK 일관성
 *  7. og:locale·inLanguage 언어별 일치
 *  8. </body>·</html> 정상 종료
 *  9. 슬러그 충돌 (변종 존재 검사)
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const LANGS = [
  { code: 'ko', dir: 'posts', cssPath: '../styles.css', locale: 'ko_KR', inLang: 'ko-KR' },
  { code: 'en', dir: 'en/posts', cssPath: '../../styles.css', locale: 'en_US', inLang: 'en-US' },
  { code: 'ja', dir: 'ja/posts', cssPath: '../../styles.css', locale: 'ja_JP', inLang: 'ja-JP' },
  { code: 'zh', dir: 'zh/posts', cssPath: '../../styles.css', locale: 'zh_CN', inLang: 'zh-CN' }
];

function validateFile(filePath, lang) {
  const issues = [];
  if (!fs.existsSync(filePath)) return ['MISSING'];

  const c = fs.readFileSync(filePath, 'utf8');

  // 1) Meta description 25~160자
  const dMatch = c.match(/<meta name="description"\s+content="([^"]*)"/);
  if (!dMatch) {
    issues.push('no-meta-description');
  } else {
    const desc = dMatch[1];
    const len = desc.length;
    if (len < 25) issues.push(`desc-too-short(${len})`);
    else if (len > 160) issues.push(`desc-too-long(${len})`);
    // 큰따옴표 escape 검사 (description 안에 escape 안 된 " 있으면 위 regex가 일찍 끊김)
    // 추가 검사: 매칭된 desc 끝이 실제로 의도된 끝인지 확인
  }

  // 2) AdSense <ins> 태그 본문 없음
  const insCount = (c.match(/<ins class="adsbygoogle"/g) || []).length;
  if (insCount > 0) issues.push(`ins-violation(${insCount})`);

  // 3) JSON-LD BlogPosting + FAQPage
  const jsonLdCount = (c.match(/application\/ld\+json/g) || []).length;
  if (jsonLdCount < 2) issues.push(`jsonld-count(${jsonLdCount})`);
  if (!/"@type"\s*:\s*"BlogPosting"/.test(c)) issues.push('no-BlogPosting');
  if (!/"@type"\s*:\s*"FAQPage"/.test(c)) issues.push('no-FAQPage');

  // 4) hreflang × 5
  const hreflangCount = (c.match(/rel="alternate" hreflang/g) || []).length;
  if (hreflangCount < 5) issues.push(`hreflang(${hreflangCount}/5)`);

  // 5) canonical
  if (!/rel="canonical"/.test(c)) issues.push('no-canonical');

  // 6) OG 1200x630
  if (!/property="og:image:width" content="1200"/.test(c)) issues.push('no-og-w');
  if (!/property="og:image:height" content="630"/.test(c)) issues.push('no-og-h');

  // 7) Twitter Card
  if (!/name="twitter:card" content="summary_large_image"/.test(c)) issues.push('no-twitter-card');

  // 8) GA / AdSense / Kakao
  if (!/G-YE3ELRSMZE/.test(c)) issues.push('no-GA');
  if (!/ca-pub-7911569280980377/.test(c)) issues.push('no-AdSense');
  if (!/kakao_js_sdk/.test(c)) issues.push('no-Kakao');

  // 9) og:locale / inLanguage 언어별 일치
  const expLoc = lang.locale;
  const expInLang = lang.inLang;
  if (!new RegExp(`property="og:locale" content="${expLoc}"`).test(c)) issues.push(`og-locale!=${expLoc}`);
  if (!new RegExp(`"inLanguage"\\s*:\\s*"${expInLang}"`).test(c)) issues.push(`inLanguage!=${expInLang}`);

  // 10) html lang
  if (!new RegExp(`<html lang="${lang.code}"`).test(c)) issues.push(`html-lang!=${lang.code}`);

  // 11) closing tags
  if (!/<\/body>/.test(c)) issues.push('no-body-close');
  if (!/<\/html>/.test(c)) issues.push('no-html-close');

  // 12) CSS path
  if (!c.includes(`href="${lang.cssPath}"`)) issues.push(`css-path!=${lang.cssPath}`);

  return issues;
}

function checkSlugConflict(slug) {
  // 동일/유사 슬러그 변종 검사
  const variants = [];
  for (const lang of LANGS) {
    const dir = path.join(ROOT, lang.dir);
    if (!fs.existsSync(dir)) continue;
    for (const fname of fs.readdirSync(dir)) {
      if (!fname.endsWith('.html')) continue;
      const baseName = fname.replace('.html', '');
      if (baseName === slug) continue; // 본인은 제외
      // 슬러그가 다른 슬러그의 부분 문자열이거나 변종인지
      if (baseName.includes(slug) || slug.includes(baseName)) {
        const v = `${lang.dir}/${fname}`;
        if (!variants.includes(v)) variants.push(v);
      }
    }
  }
  return variants;
}

function validateSlug(slug) {
  console.log(`\n=== 검증 시작: ${slug} ===\n`);

  // 1) 슬러그 충돌 검사
  const conflicts = checkSlugConflict(slug);
  if (conflicts.length > 0) {
    console.log('⚠️  슬러그 변종/충돌 발견:');
    conflicts.forEach(c => console.log(`   - ${c}`));
    console.log('   → 신규 작성 전 기존 슬러그 사용 검토 필요\n');
  }

  // 2) 4언어 파일 검증
  let totalIssues = 0;
  let missing = 0;
  for (const lang of LANGS) {
    const filePath = path.join(ROOT, lang.dir, `${slug}.html`);
    const issues = validateFile(filePath, lang);
    if (issues.length === 1 && issues[0] === 'MISSING') {
      console.log(`❌ ${lang.code.padEnd(2)} | MISSING: ${filePath.replace(ROOT + path.sep, '')}`);
      missing++;
      continue;
    }
    if (issues.length === 0) {
      console.log(`✅ ${lang.code.padEnd(2)} | OK: ${lang.dir}/${slug}.html`);
    } else {
      console.log(`⚠️  ${lang.code.padEnd(2)} | ${lang.dir}/${slug}.html → ${issues.join(', ')}`);
      totalIssues += issues.length;
    }
  }

  console.log(`\n=== 요약 ===`);
  console.log(`  Missing: ${missing}/4`);
  console.log(`  Total issues: ${totalIssues}`);
  console.log(`  Slug variants: ${conflicts.length}`);

  if (missing === 0 && totalIssues === 0) {
    console.log('\n✅ 검증 통과 - 모든 4언어 파일 정상');
    process.exit(0);
  } else {
    console.log('\n❌ 검증 실패 - 위 이슈 수정 필요');
    process.exit(1);
  }
}

function validateAll() {
  // 최근 N일 발행분 검증 (가장 최근 lastUpdated 기준)
  const indexPath = path.join(ROOT, 'posts/index.json');
  if (!fs.existsSync(indexPath)) {
    console.error('posts/index.json 없음');
    process.exit(1);
  }
  const idx = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const recentDate = idx.lastUpdated;
  const recentPosts = idx.posts.filter(p => p.date === recentDate);

  console.log(`최근 발행일 ${recentDate} - ${recentPosts.length}편 검증\n`);

  let allOk = true;
  for (const p of recentPosts) {
    const slug = p.id;
    console.log(`\n--- ${slug} ---`);
    for (const lang of LANGS) {
      const filePath = path.join(ROOT, lang.dir, `${slug}.html`);
      const issues = validateFile(filePath, lang);
      if (issues.length === 0) {
        console.log(`  ✅ ${lang.code}`);
      } else {
        console.log(`  ⚠️  ${lang.code}: ${issues.join(', ')}`);
        allOk = false;
      }
    }
  }

  if (allOk) {
    console.log('\n✅ 최근 발행분 전체 검증 통과');
    process.exit(0);
  } else {
    console.log('\n❌ 일부 이슈 발견');
    process.exit(1);
  }
}

// CLI 진입점
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage:');
  console.log('  node validate_posts.js {slug}          # 특정 슬러그 4언어 검증');
  console.log('  node validate_posts.js --all           # 최근 발행분 검증');
  console.log('  node validate_posts.js --check-slug X  # 슬러그 충돌만');
  process.exit(0);
}

if (args[0] === '--all') {
  validateAll();
} else if (args[0] === '--check-slug') {
  if (!args[1]) { console.error('슬러그 필요'); process.exit(1); }
  const conflicts = checkSlugConflict(args[1]);
  if (conflicts.length === 0) {
    console.log(`✅ ${args[1]} - 충돌 없음`);
    process.exit(0);
  } else {
    console.log(`⚠️  ${args[1]} 변종/충돌:`);
    conflicts.forEach(c => console.log(`   - ${c}`));
    process.exit(1);
  }
} else {
  validateSlug(args[0]);
}
