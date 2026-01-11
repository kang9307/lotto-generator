/**
 * 다국어 페이지 자동 생성 스크립트
 * Copyright (c) 2025 braindetox.kr
 *
 * 사용법: node scripts/generate_i18n_pages.js
 *
 * 기능:
 * - 한국어 페이지를 기반으로 영어/일본어/중국어 버전 생성
 * - 메타 태그, canonical URL, hreflang 자동 설정
 * - 폴더 구조 자동 생성 (/en/, /ja/, /zh/)
 */

const fs = require('fs');
const path = require('path');

// 설정
const BASE_URL = 'https://braindetox.kr';
const LANGUAGES = ['en', 'ja', 'zh'];
const ROOT_DIR = path.join(__dirname, '..');

// 번역 데이터 로드
function loadTranslations() {
    const translations = {};
    const i18nDir = path.join(ROOT_DIR, 'i18n');

    for (const lang of ['ko', ...LANGUAGES]) {
        const filePath = path.join(i18nDir, `${lang}.json`);
        if (fs.existsSync(filePath)) {
            translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    }

    return translations;
}

// hreflang 태그 생성
function generateHreflangTags(pagePath) {
    let tags = '';
    const allLangs = ['ko', ...LANGUAGES];

    for (const lang of allLangs) {
        let href;
        if (lang === 'ko') {
            href = `${BASE_URL}${pagePath}`;
        } else {
            href = `${BASE_URL}/${lang}${pagePath}`;
        }
        tags += `    <link rel="alternate" hreflang="${lang}" href="${href}">\n`;
    }
    tags += `    <link rel="alternate" hreflang="x-default" href="${BASE_URL}${pagePath}">`;

    return tags;
}

// 페이지 키 추출 (파일명에서)
function getPageKey(filename) {
    const name = filename.replace('.html', '').replace(/-/g, '_').replace('_', '');

    const keyMap = {
        'index': 'index',
        'lotto': 'lotto',
        'subnet': 'subnet',
        'password': 'password',
        'qrcode': 'qrcode',
        'datetime': 'datetime',
        'blog': 'blog'
    };

    return keyMap[name] || null;
}

// HTML 콘텐츠 변환
function transformHtmlContent(content, targetLang, pagePath, translations) {
    const koTrans = translations.ko;
    const targetTrans = translations[targetLang];

    if (!targetTrans) {
        console.log(`  ⚠️  ${targetLang} 번역 파일이 없습니다.`);
        return content;
    }

    let transformed = content;

    // 1. lang 속성 변경
    transformed = transformed.replace(/<html[^>]*lang="[^"]*"/, `<html lang="${targetLang}"`);
    transformed = transformed.replace(/<html(?![^>]*lang)/, `<html lang="${targetLang}"`);

    // 2. canonical URL 변경
    const canonicalRegex = /<link[^>]*rel="canonical"[^>]*href="[^"]*"[^>]*>/gi;
    const newCanonical = `<link rel="canonical" href="${BASE_URL}/${targetLang}${pagePath}">`;
    if (canonicalRegex.test(transformed)) {
        transformed = transformed.replace(canonicalRegex, newCanonical);
    }

    // 3. og:url 변경
    const ogUrlRegex = /<meta[^>]*property="og:url"[^>]*content="[^"]*"[^>]*>/gi;
    const newOgUrl = `<meta property="og:url" content="${BASE_URL}/${targetLang}${pagePath}">`;
    transformed = transformed.replace(ogUrlRegex, newOgUrl);

    // 4. og:locale 변경
    const localeMap = {
        'en': 'en_US',
        'ja': 'ja_JP',
        'zh': 'zh_CN'
    };
    const ogLocaleRegex = /<meta[^>]*property="og:locale"[^>]*content="[^"]*"[^>]*>/gi;
    const newOgLocale = `<meta property="og:locale" content="${localeMap[targetLang]}">`;
    transformed = transformed.replace(ogLocaleRegex, newOgLocale);

    // 5. 기존 hreflang 태그 제거
    transformed = transformed.replace(/<link[^>]*hreflang[^>]*>\s*/gi, '');

    // 6. 새 hreflang 태그 추가
    const hreflangTags = generateHreflangTags(pagePath);
    transformed = transformed.replace('</head>', `${hreflangTags}\n</head>`);

    // 7. 페이지별 title/description 번역
    const pageKey = getPageKey(path.basename(pagePath));
    if (pageKey && targetTrans.pages && targetTrans.pages[pageKey]) {
        const pageTrans = targetTrans.pages[pageKey];

        // title 변경
        if (pageTrans.title) {
            transformed = transformed.replace(/<title>[^<]*<\/title>/i, `<title>${pageTrans.title}</title>`);

            // og:title 변경
            const ogTitleRegex = /<meta[^>]*property="og:title"[^>]*content="[^"]*"[^>]*>/gi;
            transformed = transformed.replace(ogTitleRegex, `<meta property="og:title" content="${pageTrans.title}">`);

            // twitter:title 변경
            const twitterTitleRegex = /<meta[^>]*name="twitter:title"[^>]*content="[^"]*"[^>]*>/gi;
            transformed = transformed.replace(twitterTitleRegex, `<meta name="twitter:title" content="${pageTrans.title}">`);
        }

        // description 변경
        if (pageTrans.description) {
            const descRegex = /<meta[^>]*name="description"[^>]*content="[^"]*"[^>]*>/gi;
            transformed = transformed.replace(descRegex, `<meta name="description" content="${pageTrans.description}">`);

            // og:description 변경
            const ogDescRegex = /<meta[^>]*property="og:description"[^>]*content="[^"]*"[^>]*>/gi;
            transformed = transformed.replace(ogDescRegex, `<meta property="og:description" content="${pageTrans.description}">`);

            // twitter:description 변경
            const twitterDescRegex = /<meta[^>]*name="twitter:description"[^>]*content="[^"]*"[^>]*>/gi;
            transformed = transformed.replace(twitterDescRegex, `<meta name="twitter:description" content="${pageTrans.description}">`);
        }
    }

    // 8. keywords 변경
    if (targetTrans.seo && targetTrans.seo.keywords) {
        const keywordsRegex = /<meta[^>]*name="keywords"[^>]*content="[^"]*"[^>]*>/gi;
        transformed = transformed.replace(keywordsRegex, `<meta name="keywords" content="${targetTrans.seo.keywords}">`);
    }

    // 9. JSON-LD 스키마 inLanguage 변경
    const langCodeMap = {
        'en': 'en-US',
        'ja': 'ja-JP',
        'zh': 'zh-CN'
    };
    transformed = transformed.replace(/"inLanguage"\s*:\s*"[^"]*"/g, `"inLanguage": "${langCodeMap[targetLang]}"`);

    // 10. CSS/JS 경로 수정 (상대 경로로)
    // 언어 폴더에서 루트로 참조해야 하므로 ../를 추가
    // ./styles.css, styles.css 모두 처리
    transformed = transformed.replace(/href="\.\/styles\.css"/g, 'href="../styles.css"');
    transformed = transformed.replace(/href="styles\.css"/g, 'href="../styles.css"');
    transformed = transformed.replace(/src="\.\/common\.js"/g, 'src="../common.js"');
    transformed = transformed.replace(/src="common\.js"/g, 'src="../common.js"');
    transformed = transformed.replace(/src="\.\/menu\.js"/g, 'src="../menu.js"');
    transformed = transformed.replace(/src="menu\.js"/g, 'src="../menu.js"');
    transformed = transformed.replace(/src="\.\/([^"]+\.js)"/g, 'src="../$1"');
    transformed = transformed.replace(/src="([^"\.\/][^"\/]*\.js)"/g, 'src="../$1"');
    transformed = transformed.replace(/href="\.\/([^"]+\.css)"/g, 'href="../$1"');
    transformed = transformed.replace(/href="([^"\.\/][^"\/]*\.css)"/g, 'href="../$1"');

    // 11. 이미지 경로 수정
    transformed = transformed.replace(/src="\.\/images\//g, 'src="../images/');
    transformed = transformed.replace(/src="images\//g, 'src="../images/');
    transformed = transformed.replace(/href="\.\/images\//g, 'href="../images/');
    transformed = transformed.replace(/href="images\//g, 'href="../images/');

    // 12. 내부 링크 수정 (언어 폴더 내 링크로)
    // 예: href="lotto.html" -> href="lotto.html" (같은 언어 폴더 내)
    // href="../index.html" 등은 그대로 유지

    // 13. 본문 텍스트 번역 (bodyText 매핑 사용)
    // 긴 문자열부터 먼저 치환해야 부분 매칭 문제 방지
    if (targetTrans.bodyText) {
        const sortedKeys = Object.keys(targetTrans.bodyText).sort((a, b) => b.length - a.length);
        for (const koreanText of sortedKeys) {
            const translatedText = targetTrans.bodyText[koreanText];
            // 전역 치환 (g 플래그)
            const escapedKorean = koreanText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedKorean, 'g');
            transformed = transformed.replace(regex, translatedText);
        }
    }

    // 14. JSON-LD 스키마 내 한국어 텍스트 번역
    if (targetTrans.bodyText) {
        // JSON-LD 블록 찾아서 번역 적용
        transformed = transformed.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi, (match, jsonContent) => {
            let translatedJson = jsonContent;
            const sortedKeys = Object.keys(targetTrans.bodyText).sort((a, b) => b.length - a.length);
            for (const koreanText of sortedKeys) {
                const translatedText = targetTrans.bodyText[koreanText];
                const escapedKorean = koreanText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(escapedKorean, 'g');
                translatedJson = translatedJson.replace(regex, translatedText);
            }
            return `<script type="application/ld+json">${translatedJson}</script>`;
        });
    }

    return transformed;
}

// 단일 페이지 생성
function generatePage(sourcePath, targetLang, translations) {
    const filename = path.basename(sourcePath);
    const pagePath = `/${filename}`;

    // 원본 파일 읽기
    const content = fs.readFileSync(sourcePath, 'utf8');

    // 콘텐츠 변환
    const transformed = transformHtmlContent(content, targetLang, pagePath, translations);

    // 타겟 폴더 생성
    const targetDir = path.join(ROOT_DIR, targetLang);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // 파일 저장
    const targetPath = path.join(targetDir, filename);
    fs.writeFileSync(targetPath, transformed, 'utf8');

    return targetPath;
}

// posts 폴더 페이지 생성
function generatePostPage(sourcePath, targetLang, translations) {
    const filename = path.basename(sourcePath);
    const pagePath = `/posts/${filename}`;

    // 원본 파일 읽기
    const content = fs.readFileSync(sourcePath, 'utf8');

    // 콘텐츠 변환 (posts용 추가 수정)
    let transformed = transformHtmlContent(content, targetLang, pagePath, translations);

    // posts 폴더는 상대 경로가 더 깊음 (/lang/posts/ -> root)
    // 원본 posts는 ../xxx로 root를 참조
    // 다국어 posts는:
    //   - CSS/JS/이미지: ../../xxx로 참조 (루트)
    //   - 내부 페이지 (blog.html 등): ../xxx로 참조 (같은 언어 폴더)

    // CSS, JS, 이미지 등 리소스 경로를 ../../로 변환 (단, 이미 ../../인 건 제외)
    // 음수 전방탐색으로 이중 변환 방지
    transformed = transformed.replace(/(href|src)="\.\.\/(?!\.\.)styles\.css"/g, '$1="../../styles.css"');
    transformed = transformed.replace(/(href|src)="\.\.\/(?!\.\.)common\.js"/g, '$1="../../common.js"');
    transformed = transformed.replace(/(href|src)="\.\.\/(?!\.\.)menu\.js"/g, '$1="../../menu.js"');
    transformed = transformed.replace(/(href|src)="\.\.\/(?!\.\.)images\//g, '$1="../../images/');
    transformed = transformed.replace(/(href|src)="\.\.\/(?!\.\.)components\//g, '$1="../../components/');
    // 기타 JS/CSS 파일 (단, ../로만 시작하고 ../../가 아닌 경우)
    transformed = transformed.replace(/(href|src)="\.\.\/(?!\.\.)([^"\/]+\.(js|css))"/g, '$1="../../$2"');

    // 내부 HTML 페이지 링크 (blog.html, index.html 등)는 ../로 유지
    // 이미 ../xxx.html 형태이므로 그대로 유지됨

    // 타겟 폴더 생성
    const targetDir = path.join(ROOT_DIR, targetLang, 'posts');
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // 파일 저장
    const targetPath = path.join(targetDir, filename);
    fs.writeFileSync(targetPath, transformed, 'utf8');

    return targetPath;
}

// static 폴더 페이지 생성
function generateStaticPage(sourcePath, targetLang, translations) {
    const filename = path.basename(sourcePath);
    const pagePath = `/static/${filename}`;

    // 원본 파일 읽기
    const content = fs.readFileSync(sourcePath, 'utf8');

    // 콘텐츠 변환 (static용 추가 수정)
    let transformed = transformHtmlContent(content, targetLang, pagePath, translations);

    // static 폴더는 상대 경로가 더 깊음 (/lang/static/ -> root)
    // 원본 static은 ../xxx로 root를 참조
    // 다국어 static은:
    //   - CSS/JS/이미지: ../../xxx로 참조 (루트)
    //   - 내부 페이지 (index.html 등): ../xxx로 참조 (같은 언어 폴더)

    // CSS, JS, 이미지 경로를 ../../로 변환 (음수 전방탐색으로 이중 변환 방지)
    transformed = transformed.replace(/(href|src)="\.\.\/(?!\.\.)styles\.css"/g, '$1="../../styles.css"');
    transformed = transformed.replace(/(href|src)="\.\.\/(?!\.\.)common\.js"/g, '$1="../../common.js"');
    transformed = transformed.replace(/(href|src)="\.\.\/(?!\.\.)menu\.js"/g, '$1="../../menu.js"');
    transformed = transformed.replace(/(href|src)="\.\.\/(?!\.\.)images\//g, '$1="../../images/');
    transformed = transformed.replace(/(href|src)="\.\.\/(?!\.\.)components\//g, '$1="../../components/');
    transformed = transformed.replace(/(href|src)="\.\.\/(?!\.\.)static\/images\//g, '$1="../../static/images/');
    // 기타 JS/CSS 파일
    transformed = transformed.replace(/(href|src)="\.\.\/(?!\.\.)([^"\/]+\.(js|css))"/g, '$1="../../$2"');

    // 타겟 폴더 생성
    const targetDir = path.join(ROOT_DIR, targetLang, 'static');
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // 파일 저장
    const targetPath = path.join(targetDir, filename);
    fs.writeFileSync(targetPath, transformed, 'utf8');

    return targetPath;
}

// 메인 페이지 목록 (루트 디렉토리)
const MAIN_PAGES = [
    'index.html',
    'static_index.html',
    'lotto.html',
    'lotto7.html',
    'powerball.html',
    'megamillions.html',
    'doublecolorball.html',
    'subnet.html',
    'password.html',
    'qrcode.html',
    'datetime.html',
    'blog.html',
    'speed_test.html',
    'color_palette.html',
    'unit-converter.html',
    'interest_calculator.html',
    'random_picker.html',
    'crontab_generator.html',
    'docker_builder.html',
    'rsync_tool.html',
    'pomodoro.html',
    'mindfulness.html',
    'brain-games.html',
    'tetris.html',
    'fortune_tarot.html',
    'mbti_test.html',
    'compatibility_test.html',
    'my_day.html',
    'privacy.html'
];

// static 폴더 페이지 목록
const STATIC_PAGES = [
    'static/salary_calculator.html',
    'static/age_calculator.html',
    'static/char_counter.html',
    'static/daily_work_calculator.html',
    'static/fortune_zodiac.html',
    'static/icon_generator.html',
    'static/jeonse_wolse_calculator.html',
    'static/mbti_compatibility.html',
    'static/nickname_generator.html',
    'static/random_menu.html',
    'static/relaxing_day.html',
    'static/token_counter.html',
    'static/vnd_krw_calculator.html'
];

// 메인 실행
function main() {
    console.log('═'.repeat(50));
    console.log('🌐 다국어 페이지 자동 생성 스크립트');
    console.log('═'.repeat(50));
    console.log(`대상 언어: ${LANGUAGES.join(', ')}`);

    // 번역 데이터 로드
    console.log('\n📚 번역 데이터 로딩...');
    const translations = loadTranslations();
    console.log(`   로드된 언어: ${Object.keys(translations).join(', ')}`);

    // 각 언어별 페이지 생성
    for (const lang of LANGUAGES) {
        console.log(`\n🔄 ${lang.toUpperCase()} 페이지 생성 중...`);

        // 메인 페이지 생성
        let mainCount = 0;
        for (const page of MAIN_PAGES) {
            const sourcePath = path.join(ROOT_DIR, page);
            if (fs.existsSync(sourcePath)) {
                try {
                    generatePage(sourcePath, lang, translations);
                    mainCount++;
                    process.stdout.write('.');
                } catch (error) {
                    console.log(`\n  ❌ 오류 (${page}): ${error.message}`);
                }
            }
        }
        console.log(`\n   메인 페이지: ${mainCount}개 생성`);

        // static 폴더 페이지 생성
        let staticCount = 0;
        for (const page of STATIC_PAGES) {
            const sourcePath = path.join(ROOT_DIR, page);
            if (fs.existsSync(sourcePath)) {
                try {
                    generateStaticPage(sourcePath, lang, translations);
                    staticCount++;
                    process.stdout.write('.');
                } catch (error) {
                    console.log(`\n  ❌ 오류 (${page}): ${error.message}`);
                }
            }
        }
        console.log(`\n   Static 페이지: ${staticCount}개 생성`);

        // posts 폴더 페이지 생성
        const postsDir = path.join(ROOT_DIR, 'posts');
        if (fs.existsSync(postsDir)) {
            const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.html'));
            let postCount = 0;

            for (const file of postFiles) {
                const sourcePath = path.join(postsDir, file);
                try {
                    generatePostPage(sourcePath, lang, translations);
                    postCount++;
                    if (postCount % 10 === 0) process.stdout.write('.');
                } catch (error) {
                    console.log(`\n  ❌ 오류 (posts/${file}): ${error.message}`);
                }
            }
            console.log(`\n   블로그 포스트: ${postCount}개 생성`);
        }
    }

    console.log('\n═'.repeat(50));
    console.log('✅ 다국어 페이지 생성 완료!');
    console.log('═'.repeat(50));
    console.log('\n💡 다음 단계:');
    console.log('   1. node generate_sitemap.js  # 사이트맵 업데이트');
    console.log('   2. Git commit & push');
    console.log('   3. Google Search Console에서 sitemap 재제출');
}

main();
