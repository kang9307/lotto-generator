/**
 * 모든 블로그 포스트 HTML 파일의 메타 태그 수정 스크립트
 * Copyright (c) 2025 braindetox.kr
 * 
 * 사용법: node fix_meta_tags.js
 */

const fs = require('fs');
const path = require('path');

// 파일 경로 설정
const postsDir = path.join(__dirname, 'posts');

// 수정된 파일 수 카운트
let fixedFiles = 0;
let totalFiles = 0;

// 포스트 ID 추출 함수
function extractPostId(filename) {
    return filename.replace('.html', '');
}

// HTML 파일 고치기
function fixHtmlFile(filePath, postId) {
    try {
        // 파일 내용 읽기
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 표준 URL 형식 - www 없음
        const canonicalUrl = `https://braindetox.kr/blog.html?post=${postId}`;
        
        // 이미 수정된 파일인지 확인 (canonical 태그가 있고 og:url이 올바른 값을 가지는지)
        const hasCanonical = content.includes(`<link rel="canonical" href="${canonicalUrl}">`);
        const hasCorrectOgUrl = content.includes(`<meta property="og:url" content="${canonicalUrl}">`);
        
        let newContent = content;
        
        // canonical 태그 추가 또는 수정
        if (!hasCanonical) {
            // 기존 canonical 태그가 있는지 확인
            if (newContent.includes('<link rel="canonical"')) {
                // 기존 canonical 태그 수정
                newContent = newContent.replace(
                    /<link rel="canonical" href="[^"]*">/i,
                    `<link rel="canonical" href="${canonicalUrl}">`
                );
            } else {
                // viewport 메타 태그 다음에 canonical 태그 추가
                newContent = newContent.replace(
                    /<meta name="viewport".*?>/i,
                    `$&\n    <!-- canonical URL -->\n    <link rel="canonical" href="${canonicalUrl}">`
                );
            }
        }
        
        // og:url 태그 수정
        if (!hasCorrectOgUrl) {
            // 잘못된 og:url 태그를 찾아 수정
            newContent = newContent.replace(
                /<meta property="og:url" content="[^"]*">/i,
                `<meta property="og:url" content="${canonicalUrl}">`
            );
        }
        
        // www.braindetox.kr를 braindetox.kr로 일관되게 변경 (모든 URL 패턴에 대해)
        newContent = newContent.replace(
            /https:\/\/www\.braindetox\.kr/g,
            'https://braindetox.kr'
        );
        
        // JSON-LD의 구문 오류 수정 ("mainEntityOfPage",,: 형태 수정)
        newContent = newContent.replace(
            /"mainEntityOfPage",,:\s*"[^"]*"/g,
            (match) => {
                // 원래 URL 값 추출
                const urlMatch = match.match(/"mainEntityOfPage",,:\s*"([^"]*)"/);
                const url = urlMatch ? urlMatch[1] : canonicalUrl;
                return `"mainEntityOfPage": "${url}"`;
            }
        );
        
        // JSON-LD의 mainEntityOfPage 추가 또는 수정
        if (!newContent.includes(`"mainEntityOfPage": "${canonicalUrl}"`)) {
            // 기존 mainEntityOfPage가 있는지 확인
            if (newContent.includes('"mainEntityOfPage":')) {
                // 기존 mainEntityOfPage 수정
                newContent = newContent.replace(
                    /"mainEntityOfPage":\s*"[^"]*"/,
                    `"mainEntityOfPage": "${canonicalUrl}"`
                );
            } else {
                // image 객체 다음에 mainEntityOfPage 추가
                newContent = newContent.replace(
                    /"image":\s*\{\s*\n\s*"@type":\s*"ImageObject",\s*\n\s*"url":\s*"[^"]*"\s*\n\s*\}(\s*)\n/,
                    `"image": {\n        "@type": "ImageObject",\n        "url": "https://braindetox.kr/site_logo.png"\n      },\n      "mainEntityOfPage": "${canonicalUrl}"$1\n`
                );
            }
        }
        
        // JSON-LD 닫는 괄호 수정 (,} 형태의 잘못된 JSON 수정)
        newContent = newContent.replace(/,(\s*)\}/g, '$1}');
        
        // 변경된 내용이 있으면 파일 저장
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`메타 태그 수정 완료: ${path.basename(filePath)}`);
            return true;
        } else {
            console.log(`변경 사항 없음: ${path.basename(filePath)}`);
            return false;
        }
    } catch (error) {
        console.error(`파일 처리 중 오류 발생 (${path.basename(filePath)}):`, error.message);
        return false;
    }
}

// 모든 HTML 파일 처리
function processAllHtmlFiles() {
    try {
        // 디렉토리 확인
        if (!fs.existsSync(postsDir)) {
            console.error('posts 디렉토리를 찾을 수 없습니다.');
            process.exit(1);
        }
        
        // posts 디렉토리 내 모든 파일 목록 가져오기
        const files = fs.readdirSync(postsDir);
        
        // HTML 파일만 필터링
        const htmlFiles = files.filter(file => file.endsWith('.html'));
        totalFiles = htmlFiles.length;
        
        console.log(`총 ${totalFiles}개의 HTML 파일을 처리합니다...`);
        
        // 각 HTML 파일 처리
        htmlFiles.forEach(file => {
            const filePath = path.join(postsDir, file);
            const postId = extractPostId(file);
            
            const isFixed = fixHtmlFile(filePath, postId);
            if (isFixed) {
                fixedFiles++;
            }
        });
        
        console.log(`\n작업 완료: 총 ${totalFiles}개 파일 중 ${fixedFiles}개 파일의 메타 태그가 수정되었습니다.`);
        
    } catch (error) {
        console.error('처리 중 오류 발생:', error.message);
        process.exit(1);
    }
}

// 실행
processAllHtmlFiles(); 