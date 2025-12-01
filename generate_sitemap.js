/**
 * sitemap.xml 완전 재생성 스크립트
 * Copyright (c) 2025 braindetox.kr
 * 
 * 사용법: node generate_sitemap.js
 * 
 * 기능:
 * - posts 폴더의 모든 HTML 파일 자동 스캔
 * - 모든 도구 페이지 포함
 * - 정적 URL 사용 (파라미터 URL 제거)
 * - 일관된 XML 포맷
 */

const fs = require('fs');
const path = require('path');

// 설정
const BASE_URL = 'https://braindetox.kr';
const postsDir = path.join(__dirname, 'posts');
const sitemapPath = path.join(__dirname, 'sitemap.xml');

// 오늘 날짜 (YYYY-MM-DD 형식)
const today = new Date().toISOString().split('T')[0];

// 메인 페이지 및 도구 페이지 목록
const mainPages = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
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
    { path: '/privacy.html', priority: '0.5', changefreq: 'monthly' },
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

// sitemap.xml 생성
function generateSitemap() {
    console.log('🔄 sitemap.xml 생성 시작...\n');
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // 1. 메인 페이지 추가
    console.log('📄 메인/도구 페이지 추가 중...');
    mainPages.forEach(page => {
        xml += '  <url>\n';
        xml += `    <loc>${BASE_URL}${page.path}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += '  </url>\n';
    });
    console.log(`   ✅ ${mainPages.length}개 페이지 추가됨\n`);
    
    // 2. 블로그 포스트 추가 (정적 URL 사용!)
    console.log('📝 블로그 포스트 추가 중...');
    const postIds = getPostFiles();
    
    postIds.forEach(postId => {
        const filePath = path.join(postsDir, `${postId}.html`);
        const lastmod = getFileModDate(filePath);
        
        // 정적 URL 사용! (파라미터 URL 아님)
        xml += '  <url>\n';
        xml += `    <loc>${BASE_URL}/posts/${postId}.html</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';
    });
    console.log(`   ✅ ${postIds.length}개 포스트 추가됨\n`);
    
    xml += '</urlset>';
    
    // 파일 저장
    fs.writeFileSync(sitemapPath, xml, 'utf8');
    
    // 결과 출력
    const totalUrls = mainPages.length + postIds.length;
    console.log('═'.repeat(50));
    console.log(`✅ sitemap.xml 생성 완료!`);
    console.log(`   📊 총 URL 수: ${totalUrls}개`);
    console.log(`   📅 lastmod: ${today}`);
    console.log(`   📁 파일 위치: ${sitemapPath}`);
    console.log('═'.repeat(50));
    console.log('\n💡 다음 단계:');
    console.log('   1. Git commit & push');
    console.log('   2. Google Search Console에서 sitemap 재제출');
    console.log('   3. URL 검사 도구로 주요 페이지 색인 요청\n');
}

// 실행
generateSitemap();

