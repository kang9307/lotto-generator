/**
 * 블로그 포스트를 독립 HTML 파일로 변환하는 스크립트
 * Copyright (c) 2025 braindetox.kr
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { JSDOM } = require('jsdom'); // JSDOM 라이브러리 사용 (npm install jsdom)

// 파일 관련 함수들을 Promise 기반으로 변환
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);

// 설정
const postsDir = './posts/';
const outputDir = './posts/';
const templatePath = './post_template.html';
const debug = true;

// 디버그 로그 함수
function debugLog(...args) {
    if (debug) {
        console.log('[Debug]', ...args);
    }
}

// 디렉토리 생성 함수
async function ensureDirectoryExists(directory) {
    try {
        await mkdir(directory, { recursive: true });
        console.log(`디렉토리 생성 완료: ${directory}`);
    } catch (err) {
        if (err.code !== 'EEXIST') {
            console.error(`디렉토리 생성 오류: ${err.message}`);
            throw err;
        }
    }
}

// HTML 특수 문자 이스케이프
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// HTML 특수 문자 언이스케이프
function unescapeHtml(safe) {
    if (!safe) return '';
    return safe
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, "\"")
        .replace(/&#039;/g, "'");
}

// HTML 파일에서 콘텐츠 추출 (JSDOM 사용)
async function extractContentFromHtml(filePath) {
    try {
        const content = await readFile(filePath, 'utf8');
        debugLog(`HTML 파일 로드 (${filePath}): ${content.length} 바이트`);
        
        const dom = new JSDOM(content);
        const document = dom.window.document;
        
        // 메타데이터 추출
        const meta = {
            title: document.querySelector('title')?.textContent?.replace(' - BrainDetox 기술 블로그', '') || '',
            date: document.querySelector('meta[itemprop="datePublished"]')?.getAttribute('content') || 
                  document.querySelector('.post-date')?.textContent || '',
            category: document.querySelector('meta[itemprop="articleSection"]')?.getAttribute('content') || 
                      document.querySelector('.post-category')?.textContent || '일반',
            description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
            keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
            modifiedDate: document.querySelector('meta[itemprop="dateModified"]')?.getAttribute('content') || '',
            englishTitle: document.querySelector('.post-subtitle')?.textContent || ''
        };
        
        // 본문 콘텐츠 추출
        let bodyContent = '';
        
        // 1. article 태그 내의 콘텐츠 시도
        const article = document.querySelector('article');
        if (article) {
            // post-content 클래스를 가진 div 찾기
            const postContent = article.querySelector('.post-content');
            if (postContent) {
                // 광고를 제외한 내용만 추출
                const adElements = postContent.querySelectorAll('.post-ad');
                adElements.forEach(ad => ad.remove());
                
                bodyContent = postContent.innerHTML;
            } else {
                // article 전체 내용 사용
                bodyContent = article.innerHTML;
            }
        } else {
            // 2. body 태그 내의 콘텐츠 시도
            const body = document.querySelector('body');
            if (body) {
                bodyContent = body.innerHTML;
            }
        }
        
        // 내용이 비어있으면 전체 파일 내용 사용
        if (!bodyContent.trim()) {
            debugLog(`${filePath}에서 본문 콘텐츠를 찾을 수 없어 전체 내용을 사용합니다.`);
            bodyContent = content;
        }
        
        debugLog(`추출된 메타데이터:`, meta);
        debugLog(`추출된 본문 길이: ${bodyContent.length} 문자`);
        
        return {
            meta,
            content: bodyContent
        };
    } catch (err) {
        console.error(`HTML 파일 처리 중 오류 (${filePath}):`, err);
        throw err;
    }
}

// 마크다운 파일에서 콘텐츠 추출
async function extractContentFromMarkdown(filePath) {
    try {
        const content = await readFile(filePath, 'utf8');
        debugLog(`마크다운 파일 로드 (${filePath}): ${content.length} 바이트`);
        
        // 마크다운 파일에서 메타데이터 추출 (프론트매터 형식)
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
        const match = content.match(frontmatterRegex);
        
        const meta = {
            title: '',
            date: new Date().toISOString().split('T')[0],
            category: '일반',
            description: '',
            keywords: '',
            modifiedDate: '',
            englishTitle: ''
        };
        
        let bodyContent = content;
        
        if (match) {
            // 프론트매터 추출
            const frontmatter = match[1];
            frontmatter.split('\n').forEach(line => {
                const [key, ...valueParts] = line.split(':');
                if (key && valueParts.length > 0) {
                    const value = valueParts.join(':').trim();
                    if (key.trim() === 'title') meta.title = value;
                    if (key.trim() === 'date') meta.date = value;
                    if (key.trim() === 'category') meta.category = value;
                    if (key.trim() === 'description') meta.description = value;
                    if (key.trim() === 'keywords') meta.keywords = value;
                    if (key.trim() === 'modified_date') meta.modifiedDate = value;
                    if (key.trim() === 'english_title') meta.englishTitle = value;
                }
            });
            
            // 본문 내용 추출 (프론트매터 제외)
            bodyContent = content.substring(match[0].length);
        }
        
        debugLog(`추출된 메타데이터:`, meta);
        debugLog(`추출된 본문 길이: ${bodyContent.length} 문자`);
        
        return {
            meta,
            content: bodyContent
        };
    } catch (err) {
        console.error(`마크다운 파일 처리 중 오류 (${filePath}):`, err);
        throw err;
    }
}

// 포스트 목록 가져오기
async function getPostList() {
    try {
        // 포스트 디렉토리에서 파일 목록 가져오기
        const files = await readdir(postsDir);
        
        // HTML 및 마크다운 파일만 필터링
        const postFiles = files.filter(file => 
            (file.endsWith('.html') || file.endsWith('.md')) &&
            !file.includes('_converted_')
        );
        
        console.log(`총 ${postFiles.length}개의 파일을 처리합니다.`);
        
        // 각 파일에 대한 메타데이터 추출
        const posts = [];
        
        for (const file of postFiles) {
            try {
                const filePath = path.join(postsDir, file);
                
                // 파일명에서 ID 추출 (확장자 제외)
                const id = path.basename(file, path.extname(file));
                
                // 파일 확장자에 따라 내용 추출
                let extractedData;
                if (file.endsWith('.html')) {
                    extractedData = await extractContentFromHtml(filePath);
                } else if (file.endsWith('.md')) {
                    extractedData = await extractContentFromMarkdown(filePath);
                } else {
                    console.warn(`지원되지 않는 파일 형식: ${file}`);
                    continue;
                }
                
                const { meta, content } = extractedData;
                
                posts.push({
                    id,
                    filename: file,
                    title: meta.title || id,
                    date: meta.date,
                    category: meta.category,
                    description: meta.description || `${meta.title || id} - 기술 블로그 글입니다.`,
                    keywords: meta.keywords || `${meta.category}, 기술 블로그`,
                    modifiedDate: meta.modifiedDate || meta.date,
                    englishTitle: meta.englishTitle || '',
                    content: content
                });
                
                console.log(`포스트 정보 추출 완료: ${id}`);
            } catch (err) {
                console.error(`파일 처리 중 오류 발생 (${file}): ${err.message}`);
            }
        }
        
        return posts;
    } catch (err) {
        console.error(`포스트 목록 가져오기 오류: ${err.message}`);
        return [];
    }
}

// HTML 템플릿에 포스트 데이터 적용
async function generateHtmlFile(post, template) {
    try {
        // 템플릿에 데이터 적용
        let html = template
            .replace(/POST_TITLE/g, post.title)
            .replace(/POST_ID/g, post.id)
            .replace(/POST_DATE/g, post.date)
            .replace(/POST_CATEGORY/g, post.category)
            .replace(/POST_DESCRIPTION/g, post.description)
            .replace(/POST_KEYWORDS/g, post.keywords)
            .replace(/POST_MODIFIED_DATE/g, post.modifiedDate || post.date)
            .replace(/POST_ENGLISH_TITLE/g, post.englishTitle || '');
        
        // 본문 내용 적용 (HTML 이스케이프 없이 그대로 삽입)
        html = html.replace(/POST_CONTENT/g, post.content);
        
        // 출력 파일 경로
        const outputPath = path.join(outputDir, `${post.id}.html`);
        
        // HTML 파일 저장
        await writeFile(outputPath, html, 'utf8');
        console.log(`HTML 파일 생성 완료: ${outputPath} (${html.length} 바이트)`);
        
        return outputPath;
    } catch (err) {
        console.error(`HTML 파일 생성 오류 (${post.id}): ${err.message}`);
        throw err;
    }
}

// sitemap.xml 업데이트
async function updateSitemap(posts) {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://braindetox.kr/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://braindetox.kr/blog.html</loc>
        <lastmod>${today}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://braindetox.kr/lotto.html</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://braindetox.kr/subnet.html</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://braindetox.kr/password.html</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://braindetox.kr/qrcode.html</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://braindetox.kr/datetime.html</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://braindetox.kr/privacy.html</loc>
        <lastmod>${today}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.5</priority>
    </url>`;
        
    // 각 포스트에 대한 URL 추가
    for (const post of posts) {
        sitemap += `
    <url>
        <loc>https://braindetox.kr/posts/${post.id}.html</loc>
        <lastmod>${post.modifiedDate || post.date}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`;
    }
    
    sitemap += `
</urlset>`;
        
        // sitemap.xml 파일 저장
        await writeFile('./sitemap.xml', sitemap, 'utf8');
        console.log('sitemap.xml 업데이트 완료');
    } catch (err) {
        console.error(`sitemap.xml 업데이트 오류: ${err.message}`);
    }
}

// 메인 함수
async function main() {
    try {
        console.log('블로그 포스트 변환 시작...');
        
        // 출력 디렉토리 확인
        await ensureDirectoryExists(outputDir);
        
        // 템플릿 파일 읽기
        const template = await readFile(templatePath, 'utf8');
        
        // 포스트 목록 가져오기
        const posts = await getPostList();
        
        if (posts.length === 0) {
            console.log('변환할 포스트가 없습니다.');
            return;
        }
        
        console.log(`총 ${posts.length}개의 포스트를 변환합니다...`);
        
        // 각 포스트를 HTML 파일로 변환
        const htmlFiles = [];
        for (const post of posts) {
            try {
                const htmlFile = await generateHtmlFile(post, template);
                htmlFiles.push(htmlFile);
            } catch (err) {
                console.error(`포스트 변환 오류 (${post.id}): ${err.message}`);
            }
        }
        
        // sitemap.xml 업데이트
        await updateSitemap(posts);
        
        console.log(`변환 완료: ${htmlFiles.length}개의 HTML 파일 생성됨`);
    } catch (err) {
        console.error(`스크립트 실행 오류: ${err.message}`);
    }
}

// 스크립트 실행
main();