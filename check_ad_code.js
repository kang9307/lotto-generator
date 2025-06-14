/**
 * posts 디렉토리 내의 HTML 파일에서 광고 관련 코드가 있는지 확인하는 스크립트
 * Copyright (c) 2025 braindetox.kr
 */

const fs = require('fs');
const path = require('path');

// 파일 경로 설정
const postsDir = path.join(__dirname, 'posts');

// posts 디렉토리 내의 모든 HTML 파일 목록 가져오기
let files;
try {
    files = fs.readdirSync(postsDir).filter(file => file.endsWith('.html'));
} catch (error) {
    console.error('posts 디렉토리를 읽을 수 없습니다:', error.message);
    process.exit(1);
}

console.log(`총 ${files.length}개의 HTML 파일을 검사합니다...`);

let count = 0;
let filesWithAdCode = [];

// 각 파일에서 광고 관련 코드 확인
files.forEach(file => {
    const filePath = path.join(postsDir, file);
    
    try {
        // 파일 내용 읽기
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 광고 관련 코드가 있는지 확인
        if (content.includes('post-ad')) {
            count++;
            filesWithAdCode.push(file);
            console.log(`✓ ${file} - 광고 관련 코드 있음`);
        }
    } catch (error) {
        console.error(`✗ ${file} 검사 중 오류 발생:`, error.message);
    }
});

console.log(`\n검사 완료: 총 ${files.length}개 파일 중 ${count}개 파일에 광고 관련 코드 있음`);

if (count > 0) {
    console.log('\n광고 관련 코드가 있는 파일:');
    filesWithAdCode.forEach(file => {
        console.log(`- ${file}`);
    });
} 