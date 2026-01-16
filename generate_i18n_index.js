/**
 * generate_i18n_index.js
 * 각 언어별 posts/index.json 생성 스크립트
 *
 * 기능:
 * - 한국어 posts/index.json을 기반으로 영어/일본어/중국어 index.json 생성
 * - 각 언어 HTML 파일에서 title과 category 추출
 * - 추출된 정보로 해당 언어 index.json 업데이트
 *
 * 사용법: node generate_i18n_index.js
 */

const fs = require('fs');
const path = require('path');

const languages = ['en', 'ja', 'zh'];

// 한국어 index.json 읽기
const baseIndexPath = './posts/index.json';
if (!fs.existsSync(baseIndexPath)) {
    console.error('Error: posts/index.json 파일이 없습니다.');
    process.exit(1);
}

const baseIndex = JSON.parse(fs.readFileSync(baseIndexPath, 'utf8'));
console.log(`기본 index.json 로드 완료: ${baseIndex.posts.length}개 포스트`);

languages.forEach(lang => {
    // deep copy
    const langIndex = JSON.parse(JSON.stringify(baseIndex));
    let updatedCount = 0;
    let missingCount = 0;

    langIndex.posts.forEach(post => {
        const htmlPath = `./${lang}/posts/${post.filename}`;

        if (fs.existsSync(htmlPath)) {
            const html = fs.readFileSync(htmlPath, 'utf8');

            // title 추출 - <title>태그에서 " - BrainDetox" 이후 제거
            const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
            if (titleMatch) {
                let extractedTitle = titleMatch[1];
                // " - BrainDetox" 또는 " | BrainDetox" 이후 제거
                extractedTitle = extractedTitle.replace(/\s*[-|]\s*BrainDetox.*$/i, '').trim();
                post.title = extractedTitle;
            }

            // category 추출 - <span class="post-category">에서
            const categoryMatch = html.match(/<span class="post-category">([^<]+)<\/span>/i);
            if (categoryMatch) {
                post.category = categoryMatch[1].trim();
            }

            updatedCount++;
        } else {
            missingCount++;
        }
    });

    // 언어별 index.json 저장
    const langIndexPath = `./${lang}/posts/index.json`;
    fs.writeFileSync(langIndexPath, JSON.stringify(langIndex, null, 2), 'utf8');

    console.log(`${lang}/posts/index.json 생성 완료 - 업데이트: ${updatedCount}개, 누락: ${missingCount}개`);
});

console.log('\n모든 언어별 index.json 생성 완료!');
