/**
 * sitemap.xml 다국어 지원 생성 스크립트
 * Copyright (c) 2025 braindetox.kr
 *
 * 사용법: node generate_sitemap.js
 *
 * 기능:
 * - posts 폴더의 모든 HTML 파일 자동 스캔
 * - 모든 도구 페이지 포함
 * - 다국어 hreflang 링크 포함 (xhtml:link)
 * - 정적 URL 사용 (파라미터 URL 제거)
 */

const fs = require('fs');
const path = require('path');

// 설정
const BASE_URL = 'https://braindetox.kr';
const LANGUAGES = ['ko', 'en', 'ja', 'zh'];
const postsDir = path.join(__dirname, 'posts');
const sitemapPath = path.join(__dirname, 'sitemap.xml');

// 오늘 날짜 (YYYY-MM-DD 형식)
const today = new Date().toISOString().split('T')[0];

// 메인 페이지 및 도구 페이지 목록
const mainPages = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/static_index.html', priority: '0.95', changefreq: 'weekly' },
    { path: '/blog.html', priority: '0.9', changefreq: 'daily' },
    { path: '/lotto.html', priority: '0.8', changefreq: 'weekly' },
    { path: '/powerball.html', priority: '0.8', changefreq: 'weekly' },
    { path: '/megamillions.html', priority: '0.8', changefreq: 'weekly' },
    { path: '/doublecolorball.html', priority: '0.8', changefreq: 'weekly' },
    { path: '/lotto7.html', priority: '0.8', changefreq: 'weekly' },
    { path: '/subnet.html', priority: '0.8', changefreq: 'weekly' },
    { path: '/password.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/qrcode.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/datetime.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/rsync_tool.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/crontab_generator.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/docker_builder.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/random_picker.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/interest_calculator.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/speed_test.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/mbti_test.html', priority: '0.9', changefreq: 'monthly' },
    { path: '/compatibility_test.html', priority: '0.9', changefreq: 'weekly' },
    { path: '/fortune_tarot.html', priority: '0.9', changefreq: 'daily' },
    { path: '/color_palette.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/unit-converter.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/pomodoro.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/mindfulness.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/brain-games.html', priority: '0.9', changefreq: 'weekly' },
    { path: '/tetris.html', priority: '0.9', changefreq: 'monthly' },
    { path: '/my_day.html', priority: '0.8', changefreq: 'daily' },
    { path: '/privacy.html', priority: '0.5', changefreq: 'monthly' },
    { path: '/dashboard.html', priority: '0.6', changefreq: 'weekly' },
];

// static 폴더 페이지 목록
const staticPages = [
    { path: '/static/salary_calculator.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/age_calculator.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/char_counter.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/daily_work_calculator.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/fortune_zodiac.html', priority: '0.8', changefreq: 'daily' },
    { path: '/static/icon_generator.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/jeonse_wolse_calculator.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/mbti_compatibility.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/nickname_generator.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/random_menu.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/relaxing_day.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/token_counter.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/vnd_krw_calculator.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/max_chatbot.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/iptables_generator.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/meeting_calculator.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/nginx_generator.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/name_compatibility.html', priority: '0.9', changefreq: 'monthly' },
    { path: '/static/code_image.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/json_formatter.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/timezone_converter.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/hearing_age_test.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/color_blindness_test.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/typing_test.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/reaction_test.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/noise_meter.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/frequency_test.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/dead_pixel_test.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/mind_refresh_studio.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/personality_test.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/fractal_explorer.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/particle_system.html', priority: '0.8', changefreq: 'monthly' },
    { path: '/static/ascii_art.html', priority: '0.8', changefreq: 'monthly' },
];

// posts 폴더에서 HTML 파일 목록 가져오기
function getPostFiles() {
    try {
        const files = fs.readdirSync(postsDir);
        return files
            .filter(file => file.endsWith('.html'))
            .map(file => file.replace('.html', ''));
    } catch (error) {
        console.error('posts 폴더 읽기 오류:', error.message);
        return [];
    }
}

// 파일의 수정 날짜 가져오기
function getFileModDate(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.mtime.toISOString().split('T')[0];
    } catch (error) {
        return today;
    }
}

// hreflang 링크 생성
function generateHreflangLinks(pagePath) {
    let links = '';

    for (const lang of LANGUAGES) {
        let href;
        if (lang === 'ko') {
            href = `${BASE_URL}${pagePath}`;
        } else {
            href = `${BASE_URL}/${lang}${pagePath}`;
        }
        links += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>\n`;
    }

    // x-default (한국어를 기본으로)
    links += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${pagePath}"/>`;

    return links;
}

// sitemap.xml 생성
function generateSitemap() {
    console.log('🔄 sitemap.xml 다국어 지원 생성 시작...\n');

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

    let totalUrls = 0;

    // 1. 메인 페이지 추가 (모든 언어 버전)
    console.log('📄 메인/도구 페이지 추가 중...');

    for (const page of mainPages) {
        // 한국어 버전 (기본)
        xml += '  <url>\n';
        xml += `    <loc>${BASE_URL}${page.path}</loc>\n`;
        xml += `${generateHreflangLinks(page.path)}\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += '  </url>\n';
        totalUrls++;

        // 다른 언어 버전
        for (const lang of LANGUAGES.filter(l => l !== 'ko')) {
            const langPriority = (parseFloat(page.priority) * 0.95).toFixed(2);
            xml += '  <url>\n';
            xml += `    <loc>${BASE_URL}/${lang}${page.path}</loc>\n`;
            xml += `${generateHreflangLinks(page.path)}\n`;
            xml += `    <lastmod>${today}</lastmod>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${langPriority}</priority>\n`;
            xml += '  </url>\n';
            totalUrls++;
        }
    }

    console.log(`   ✅ ${mainPages.length * LANGUAGES.length}개 페이지 추가됨\n`);

    // 2. static 폴더 페이지 추가 (모든 언어 버전)
    console.log('📁 static 폴더 페이지 추가 중...');

    for (const page of staticPages) {
        // 한국어 버전 (기본)
        xml += '  <url>\n';
        xml += `    <loc>${BASE_URL}${page.path}</loc>\n`;
        xml += `${generateHreflangLinks(page.path)}\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += '  </url>\n';
        totalUrls++;

        // 다른 언어 버전
        for (const lang of LANGUAGES.filter(l => l !== 'ko')) {
            const langPriority = (parseFloat(page.priority) * 0.95).toFixed(2);
            xml += '  <url>\n';
            xml += `    <loc>${BASE_URL}/${lang}${page.path}</loc>\n`;
            xml += `${generateHreflangLinks(page.path)}\n`;
            xml += `    <lastmod>${today}</lastmod>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${langPriority}</priority>\n`;
            xml += '  </url>\n';
            totalUrls++;
        }
    }

    console.log(`   ✅ ${staticPages.length * LANGUAGES.length}개 페이지 추가됨\n`);

    // 3. 블로그 포스트 추가 (모든 언어 버전)
    console.log('📝 블로그 포스트 추가 중...');
    const postIds = getPostFiles();

    for (const postId of postIds) {
        const filePath = path.join(postsDir, `${postId}.html`);
        const lastmod = getFileModDate(filePath);
        const pagePath = `/posts/${postId}.html`;

        // 한국어 버전 (기본)
        xml += '  <url>\n';
        xml += `    <loc>${BASE_URL}${pagePath}</loc>\n`;
        xml += `${generateHreflangLinks(pagePath)}\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';
        totalUrls++;

        // 다른 언어 버전
        for (const lang of LANGUAGES.filter(l => l !== 'ko')) {
            xml += '  <url>\n';
            xml += `    <loc>${BASE_URL}/${lang}${pagePath}</loc>\n`;
            xml += `${generateHreflangLinks(pagePath)}\n`;
            xml += `    <lastmod>${lastmod}</lastmod>\n`;
            xml += '    <changefreq>monthly</changefreq>\n';
            xml += '    <priority>0.65</priority>\n';
            xml += '  </url>\n';
            totalUrls++;
        }
    }

    console.log(`   ✅ ${postIds.length * LANGUAGES.length}개 포스트 추가됨\n`);

    xml += '</urlset>';

    // 파일 저장
    fs.writeFileSync(sitemapPath, xml, 'utf8');

    // 결과 출력
    console.log('═'.repeat(50));
    console.log(`✅ sitemap.xml 다국어 지원 생성 완료!`);
    console.log(`   📊 총 URL 수: ${totalUrls}개`);
    console.log(`   🌐 지원 언어: ${LANGUAGES.join(', ')}`);
    console.log(`   📅 lastmod: ${today}`);
    console.log(`   📁 파일 위치: ${sitemapPath}`);
    console.log('═'.repeat(50));
    console.log('\n💡 다음 단계:');
    console.log('   1. Git commit & push');
    console.log('   2. Google Search Console에서 sitemap 재제출');
    console.log('   3. URL 검사 도구로 주요 페이지 색인 요청\n');
}

// 언어별 sitemap 생성 함수
function generateLanguageSitemaps() {
    console.log('\n🌐 언어별 sitemap 생성 시작...\n');

    const postIds = getPostFiles();

    for (const lang of LANGUAGES) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        let urlCount = 0;
        const langPrefix = lang === 'ko' ? '' : `/${lang}`;

        // 메인/도구 페이지
        for (const page of mainPages) {
            xml += '  <url>\n';
            xml += `    <loc>${BASE_URL}${langPrefix}${page.path}</loc>\n`;
            xml += `    <lastmod>${today}</lastmod>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;
            xml += '  </url>\n';
            urlCount++;
        }

        // static 페이지
        for (const page of staticPages) {
            xml += '  <url>\n';
            xml += `    <loc>${BASE_URL}${langPrefix}${page.path}</loc>\n`;
            xml += `    <lastmod>${today}</lastmod>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;
            xml += '  </url>\n';
            urlCount++;
        }

        // 블로그 포스트
        for (const postId of postIds) {
            const filePath = lang === 'ko'
                ? path.join(postsDir, `${postId}.html`)
                : path.join(__dirname, lang, 'posts', `${postId}.html`);
            const lastmod = getFileModDate(filePath);

            xml += '  <url>\n';
            xml += `    <loc>${BASE_URL}${langPrefix}/posts/${postId}.html</loc>\n`;
            xml += `    <lastmod>${lastmod}</lastmod>\n`;
            xml += '    <changefreq>monthly</changefreq>\n';
            xml += '    <priority>0.7</priority>\n';
            xml += '  </url>\n';
            urlCount++;
        }

        xml += '</urlset>';

        // 파일 저장
        const langSitemapPath = path.join(__dirname, `sitemap-${lang}.xml`);
        fs.writeFileSync(langSitemapPath, xml, 'utf8');
        console.log(`   ✅ sitemap-${lang}.xml 생성 완료 (${urlCount}개 URL)`);
    }

    console.log('\n💡 Google Search Console에서 각 언어별 sitemap 제출:');
    console.log('   - sitemap-ko.xml (한국어)');
    console.log('   - sitemap-en.xml (영어)');
    console.log('   - sitemap-ja.xml (일본어)');
    console.log('   - sitemap-zh.xml (중국어)\n');
}

// 실행
generateSitemap();
generateLanguageSitemaps();
