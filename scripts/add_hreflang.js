/**
 * hreflang 태그 자동 추가 스크립트
 * Copyright (c) 2025 braindetox.kr
 *
 * 사용법: node scripts/add_hreflang.js
 *
 * 기능:
 * - 모든 HTML 파일에 hreflang 태그 추가
 * - 다국어 SEO 최적화
 */

const fs = require('fs');
const path = require('path');

// 설정
const BASE_URL = 'https://braindetox.kr';
const LANGUAGES = ['ko', 'en', 'ja', 'zh'];
const ROOT_DIR = path.join(__dirname, '..');

// hreflang 태그 생성
function generateHreflangTags(pagePath, isPost = false) {
    let tags = '';

    for (const lang of LANGUAGES) {
        let href;
        if (lang === 'ko') {
            href = `${BASE_URL}${pagePath}`;
        } else {
            href = `${BASE_URL}/${lang}${pagePath}`;
        }
        tags += `    <link rel="alternate" hreflang="${lang}" href="${href}">\n`;
    }

    // x-default (한국어를 기본으로)
    tags += `    <link rel="alternate" hreflang="x-default" href="${BASE_URL}${pagePath}">`;

    return tags;
}

// HTML 파일에 hreflang 태그 추가
function addHreflangToFile(filePath, pagePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // 이미 hreflang 태그가 있는지 확인
        if (content.includes('hreflang="en"') && content.includes('hreflang="ja"') && content.includes('hreflang="zh"')) {
            console.log(`  ⏭️  이미 hreflang 태그 존재: ${filePath}`);
            return false;
        }

        // 기존 hreflang 태그 제거 (부분적으로 있는 경우)
        content = content.replace(/<link[^>]*hreflang[^>]*>\s*/gi, '');

        // hreflang 태그 생성
        const hreflangTags = generateHreflangTags(pagePath);

        // </head> 태그 앞에 hreflang 태그 삽입
        if (content.includes('</head>')) {
            content = content.replace('</head>', `${hreflangTags}\n</head>`);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  ✅ hreflang 추가: ${filePath}`);
            return true;
        } else {
            console.log(`  ⚠️  </head> 태그를 찾을 수 없음: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`  ❌ 오류: ${filePath} - ${error.message}`);
        return false;
    }
}

// 루트 HTML 파일 처리
function processRootHtmlFiles() {
    console.log('\n📄 루트 HTML 파일 처리 중...');

    const htmlFiles = fs.readdirSync(ROOT_DIR)
        .filter(file => file.endsWith('.html') && !file.startsWith('post_'));

    let processed = 0;

    for (const file of htmlFiles) {
        const filePath = path.join(ROOT_DIR, file);
        const pagePath = `/${file}`;

        if (addHreflangToFile(filePath, pagePath)) {
            processed++;
        }
    }

    console.log(`   처리된 파일: ${processed}/${htmlFiles.length}개`);
    return processed;
}

// posts 폴더 HTML 파일 처리
function processPostsHtmlFiles() {
    console.log('\n📝 posts 폴더 HTML 파일 처리 중...');

    const postsDir = path.join(ROOT_DIR, 'posts');

    if (!fs.existsSync(postsDir)) {
        console.log('   posts 폴더가 존재하지 않습니다.');
        return 0;
    }

    const htmlFiles = fs.readdirSync(postsDir)
        .filter(file => file.endsWith('.html'));

    let processed = 0;

    for (const file of htmlFiles) {
        const filePath = path.join(postsDir, file);
        const pagePath = `/posts/${file}`;

        if (addHreflangToFile(filePath, pagePath)) {
            processed++;
        }
    }

    console.log(`   처리된 파일: ${processed}/${htmlFiles.length}개`);
    return processed;
}

// 메인 실행
function main() {
    console.log('═'.repeat(50));
    console.log('🌐 hreflang 태그 자동 추가 스크립트');
    console.log('═'.repeat(50));
    console.log(`기준 URL: ${BASE_URL}`);
    console.log(`지원 언어: ${LANGUAGES.join(', ')}`);

    const rootProcessed = processRootHtmlFiles();
    const postsProcessed = processPostsHtmlFiles();

    console.log('\n═'.repeat(50));
    console.log('✅ 완료!');
    console.log(`   총 처리된 파일: ${rootProcessed + postsProcessed}개`);
    console.log('═'.repeat(50));
    console.log('\n💡 다음 단계:');
    console.log('   1. node scripts/generate_i18n_pages.js  # 다국어 페이지 생성');
    console.log('   2. node generate_sitemap.js             # 사이트맵 업데이트');
    console.log('   3. Git commit & push');
}

main();
