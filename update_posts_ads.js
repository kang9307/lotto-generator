/**
 * 기존 블로그 포스트에 광고 슬롯 추가 스크립트
 * Copyright (c) 2025 braindetox.kr
 * 
 * 사용법: node update_posts_ads.js
 */

const fs = require('fs');
const path = require('path');

// 블로그 포스트 디렉토리 경로 설정
const postsDir = path.join(__dirname, 'posts');

// 광고 코드 정의
const MIDDLE_AD_CODE = `
<!-- 중간 광고 -->
<div class="post-ad post-ad-middle">
    <ins class="adsbygoogle"
         style="display:block; text-align:center;"
         data-ad-layout="in-article"
         data-ad-format="fluid"
         data-ad-client="ca-pub-7911569280980377"
         data-ad-slot="3746430046"></ins>
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</div>
`;

const BOTTOM_AD_CODE = `
<!-- 하단 광고 -->
<div class="post-ad post-ad-bottom">
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-7911569280980377"
         data-ad-slot="2489862062"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</div>
`;

// 모든 블로그 포스트 파일 가져오기
function getPostFiles() {
    return new Promise((resolve, reject) => {
        fs.readdir(postsDir, (err, files) => {
            if (err) {
                return reject(err);
            }
            
            // HTML 파일만 필터링
            const htmlFiles = files.filter(file => file.endsWith('.html') && file !== 'index.html');
            resolve(htmlFiles);
        });
    });
}

// HTML 파일에 광고 코드 삽입
function insertAdsToHtml(htmlContent) {
    // 이미 광고 코드가 있는지 확인
    if (htmlContent.includes('post-ad-middle') || htmlContent.includes('post-ad-bottom')) {
        return { 
            content: htmlContent, 
            modified: false, 
            message: '이미 광고 코드가 포함되어 있습니다.' 
        };
    }
    
    // Google AdSense 스크립트가 head에 있는지 확인하고 없으면 추가
    if (!htmlContent.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')) {
        htmlContent = htmlContent.replace('</head>', `    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7911569280980377" crossorigin="anonymous"></script>
</head>`);
    }
    
    // 중간 광고 삽입 (article 본문 중간)
    // post-content 요소를 찾아서 그 내부 내용의 중간에 광고 삽입
    const articleBodyMatch = htmlContent.match(/<div class="post-content"[^>]*>([\s\S]*?)<\/div>\s*<\/article>/i);
    
    if (articleBodyMatch) {
        const fullMatch = articleBodyMatch[0];
        const bodyContent = articleBodyMatch[1];
        
        // 본문 내용을 HTML 구문 분석기를 통해 분석할 수는 없으므로
        // 단락을 기준으로 중간 지점 찾기
        const paragraphs = bodyContent.split('</p>');
        
        // 단락이 충분히 있는 경우만 중간에 광고 삽입
        if (paragraphs.length >= 4) {
            const middleIndex = Math.floor(paragraphs.length / 2);
            paragraphs[middleIndex] += MIDDLE_AD_CODE;
            
            const newBodyContent = paragraphs.join('</p>');
            const newFullMatch = fullMatch.replace(bodyContent, newBodyContent);
            htmlContent = htmlContent.replace(fullMatch, newFullMatch);
        } else {
            // 단락이 적으면 본문 끝에 중간 광고 추가
            htmlContent = htmlContent.replace('</div>\s*</article>', `${MIDDLE_AD_CODE}</div></article>`);
        }
    }
    
    // 하단 광고 삽입 (article 태그 닫기 직전)
    htmlContent = htmlContent.replace('</article>', `${BOTTOM_AD_CODE}</article>`);
    
    return { 
        content: htmlContent, 
        modified: true, 
        message: '광고 코드가 성공적으로 삽입되었습니다.' 
    };
}

// 모든 파일 처리
async function processAllFiles() {
    try {
        const files = await getPostFiles();
        console.log(`총 ${files.length}개의 HTML 파일을 처리합니다...`);
        
        let successCount = 0;
        let skippedCount = 0;
        let errorCount = 0;
        
        for (const file of files) {
            const filePath = path.join(postsDir, file);
            
            try {
                // 파일 읽기
                const content = fs.readFileSync(filePath, 'utf8');
                
                // 광고 코드 삽입
                const result = insertAdsToHtml(content);
                
                if (result.modified) {
                    // 수정된 내용 저장
                    fs.writeFileSync(filePath, result.content, 'utf8');
                    console.log(`✅ ${file}: ${result.message}`);
                    successCount++;
                } else {
                    console.log(`⏭️ ${file}: ${result.message}`);
                    skippedCount++;
                }
            } catch (fileError) {
                console.error(`❌ ${file} 처리 중 오류 발생:`, fileError.message);
                errorCount++;
            }
        }
        
        console.log('\n작업 완료:');
        console.log(`- 성공: ${successCount}개 파일`);
        console.log(`- 건너뜀: ${skippedCount}개 파일`);
        console.log(`- 오류: ${errorCount}개 파일`);
        
    } catch (error) {
        console.error('포스트 파일 목록을 가져오는 중 오류 발생:', error.message);
    }
}

// 스크립트 실행
processAllFiles(); 