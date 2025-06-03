/**
 * 새 블로그 포스트 HTML 파일 생성 스크립트
 * Copyright (c) 2025 braindetox.kr
 * 
 * 사용법: node create_post.js <post_id> <post_title> <category> [keywords]
 * 예시: node create_post.js my_new_post "새로운 포스트 제목" "IT/기술" "키워드1, 키워드2, 키워드3"
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 명령행 인수 파싱
const args = process.argv.slice(2);
if (args.length < 3) {
    console.error('사용법: node create_post.js <post_id> <post_title> <category> [keywords]');
    process.exit(1);
}

const postId = args[0];
const postTitle = args[1];
const category = args[2];
const keywords = args[3] || '';

// 영어 제목 (기본값)
let englishTitle = `${postTitle} | Technical Article`;

// 날짜 설정 (현재 날짜)
const today = new Date();
const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식

// 파일 경로 설정
const postsDir = path.join(__dirname, 'posts');
const templatePath = path.join(__dirname, 'post_template.html');
const indexJsonPath = path.join(postsDir, 'index.json');
const outputFilePath = path.join(postsDir, `${postId}.html`);

// 템플릿 파일 읽기
let templateContent;
try {
    templateContent = fs.readFileSync(templatePath, 'utf8');
} catch (error) {
    console.error('템플릿 파일을 읽을 수 없습니다:', error.message);
    process.exit(1);
}

// 템플릿에 데이터 채우기
const postContent = templateContent
    .replace(/POST_ID/g, postId)
    .replace(/POST_TITLE/g, postTitle)
    .replace(/POST_ENGLISH_TITLE/g, englishTitle)
    .replace(/POST_DATE/g, dateStr)
    .replace(/POST_CATEGORY/g, category)
    .replace(/POST_KEYWORDS/g, keywords);

// 디렉토리 확인 및 생성
if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
}

// 파일 저장
try {
    fs.writeFileSync(outputFilePath, postContent);
    console.log(`포스트 HTML 파일이 생성되었습니다: ${outputFilePath}`);
} catch (error) {
    console.error('포스트 파일 저장 중 오류 발생:', error.message);
    process.exit(1);
}

// index.json 파일 업데이트
try {
    let indexData;
    
    if (fs.existsSync(indexJsonPath)) {
        const indexContent = fs.readFileSync(indexJsonPath, 'utf8');
        indexData = JSON.parse(indexContent);
    } else {
        indexData = { files: [], posts: [] };
    }
    
    // 파일 목록에 추가
    if (!indexData.files.includes(`${postId}.html`)) {
        indexData.files.push(`${postId}.html`);
    }
    
    // 포스트 데이터 추가 또는 업데이트
    const existingPostIndex = indexData.posts.findIndex(post => post.id === postId);
    const postData = {
        id: postId,
        filename: `${postId}.html`,
        title: postTitle,
        date: dateStr,
        category: category,
        featured: false
    };
    
    if (existingPostIndex >= 0) {
        indexData.posts[existingPostIndex] = postData;
    } else {
        indexData.posts.push(postData);
    }
    
    // 최신 날짜순으로 정렬
    indexData.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // index.json 파일 저장
    fs.writeFileSync(indexJsonPath, JSON.stringify(indexData, null, 2));
    console.log(`index.json 파일이 업데이트되었습니다.`);
    
    // sitemap.xml 자동 업데이트 실행
    console.log(`sitemap.xml 파일을 업데이트합니다...`);
    exec('node update_sitemap.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`sitemap.xml 업데이트 중 오류 발생: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`sitemap.xml 업데이트 중 오류: ${stderr}`);
            return;
        }
        console.log(stdout);
    });
    
} catch (error) {
    console.error('index.json 파일 업데이트 중 오류 발생:', error.message);
}

console.log(`
새 포스트가 성공적으로 생성되었습니다!

포스트 ID: ${postId}
제목: ${postTitle}
카테고리: ${category}
날짜: ${dateStr}

이제 ${outputFilePath} 파일을 편집하여 포스트 내용을 추가하세요.
`); 