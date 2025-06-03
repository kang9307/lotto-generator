/**
 * sitemap.xml 파일 자동 업데이트 스크립트
 * Copyright (c) 2025 braindetox.kr
 * 
 * 사용법: node update_sitemap.js
 */

const fs = require('fs');
const path = require('path');

// 파일 경로 설정
const postsDir = path.join(__dirname, 'posts');
const indexJsonPath = path.join(postsDir, 'index.json');
const sitemapPath = path.join(__dirname, 'sitemap.xml');

// 오늘 날짜 (YYYY-MM-DD 형식)
const today = new Date().toISOString().split('T')[0];

// sitemap.xml 파일 생성 함수
function generateSitemap() {
    try {
        // index.json 파일 읽기
        if (!fs.existsSync(indexJsonPath)) {
            console.error('index.json 파일을 찾을 수 없습니다.');
            process.exit(1);
        }
        
        const indexContent = fs.readFileSync(indexJsonPath, 'utf8');
        const indexData = JSON.parse(indexContent);
        
        // 기본 페이지 URL 설정
        const mainPages = [
            { url: 'https://braindetox.kr/', priority: '1.0', changefreq: 'weekly' },
            { url: 'https://braindetox.kr/lotto.html', priority: '0.8', changefreq: 'weekly' },
            { url: 'https://braindetox.kr/subnet.html', priority: '0.8', changefreq: 'weekly' },
            { url: 'https://braindetox.kr/password.html', priority: '0.8', changefreq: 'monthly' },
            { url: 'https://braindetox.kr/qrcode.html', priority: '0.8', changefreq: 'monthly' },
            { url: 'https://braindetox.kr/privacy.html', priority: '0.5', changefreq: 'monthly' },
            { url: 'https://braindetox.kr/blog.html', priority: '0.9', changefreq: 'daily' }
        ];
        
        // XML 시작 부분
        let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
        sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        // 메인 페이지 추가
        mainPages.forEach(page => {
            sitemap += '  <url>\n';
            sitemap += `    <loc>${page.url}</loc>\n`;
            sitemap += `    <lastmod>${today}</lastmod>\n`;
            sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
            sitemap += `    <priority>${page.priority}</priority>\n`;
            sitemap += '  </url>\n';
        });
        
        // 블로그 포스트 추가
        if (indexData.posts && indexData.posts.length > 0) {
            indexData.posts.forEach(post => {
                sitemap += '  <url>\n';
                sitemap += `    <loc>https://braindetox.kr/blog.html?post=${post.id}</loc>\n`;
                sitemap += `    <lastmod>${post.date}</lastmod>\n`;
                sitemap += '    <changefreq>monthly</changefreq>\n';
                sitemap += '    <priority>0.7</priority>\n';
                sitemap += '  </url>\n';
            });
        }
        
        // XML 종료
        sitemap += '</urlset>';
        
        // sitemap.xml 파일 저장
        fs.writeFileSync(sitemapPath, sitemap);
        console.log(`sitemap.xml 파일이 업데이트되었습니다. 총 ${mainPages.length + indexData.posts.length}개의 URL이 포함되었습니다.`);
        
        // 포스트 개수 출력
        console.log(`  - 기본 페이지: ${mainPages.length}개`);
        console.log(`  - 블로그 포스트: ${indexData.posts.length}개`);
        
    } catch (error) {
        console.error('sitemap.xml 파일 생성 중 오류 발생:', error.message);
        process.exit(1);
    }
}

// 실행
generateSitemap(); 