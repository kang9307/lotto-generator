/**
 * posts 디렉토리 내의 모든 HTML 파일에서 광고 컨테이너를 제거하는 스크립트
 * Copyright (c) 2025 braindetox.kr
 */

const fs = require('fs');
const path = require('path');

// 파일 경로 설정
const postsDir = path.join(__dirname, 'posts');

// 광고 컨테이너 패턴 - 더 넓은 범위의 패턴으로 수정
const middleAdPattern = /<div class="post-ad post-ad-middle">[\s\S]*?<\/div>/g;
const bottomAdPattern = /<div class="post-ad post-ad-bottom">[\s\S]*?<\/div>/g;

// posts 디렉토리 내의 모든 HTML 파일 목록 가져오기
let files;
try {
    files = fs.readdirSync(postsDir).filter(file => file.endsWith('.html'));
} catch (error) {
    console.error('posts 디렉토리를 읽을 수 없습니다:', error.message);
    process.exit(1);
}

console.log(`총 ${files.length}개의 HTML 파일을 처리합니다...`);

let processedCount = 0;
let modifiedCount = 0;

// 각 파일에서 광고 컨테이너 제거
files.forEach(file => {
    const filePath = path.join(postsDir, file);
    
    try {
        // 파일 내용 읽기
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 광고 컨테이너가 있는지 확인
        const hasMiddleAd = middleAdPattern.test(content);
        const hasBottomAd = bottomAdPattern.test(content);
        
        // 광고 컨테이너 제거
        if (hasMiddleAd || hasBottomAd) {
            const originalContent = content;
            
            // 중간 광고 제거
            content = content.replace(middleAdPattern, '');
            
            // 하단 광고 제거
            content = content.replace(bottomAdPattern, '');
            
            // 변경된 내용 저장
            fs.writeFileSync(filePath, content, 'utf8');
            
            modifiedCount++;
            console.log(`✅ ${file} - 광고 컨테이너 제거 완료`);
        } else {
            console.log(`ℹ️ ${file} - 광고 컨테이너 없음`);
        }
        
        processedCount++;
    } catch (error) {
        console.error(`❌ ${file} 처리 중 오류 발생:`, error.message);
    }
});

console.log(`\n처리 완료: 총 ${processedCount}개 파일 중 ${modifiedCount}개 파일에서 광고 컨테이너 제거됨`); 