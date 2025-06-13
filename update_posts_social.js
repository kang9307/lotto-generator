/**
 * 기존 포스트에 소셜 공유 기능을 추가하는 스크립트
 * Copyright (c) 2025 braindetox.kr
 */

const fs = require('fs');
const path = require('path');

// 포스트 디렉토리 경로
const postsDir = './posts';

// 소셜 공유 버튼 HTML
const socialShareHTML = `
<!-- 공유 섹션 -->
<div class="share-section">
    <h3>이 글 공유하기</h3>
    <div class="social-share">
        <button id="kakao-share" class="share-btn kakao-btn">
            <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png" alt="카카오톡 공유">
            카카오톡
        </button>
        <button id="facebook-share" class="share-btn facebook-btn">
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSJ3aGl0ZSIgZD0iTTUwNCAxNTYuNmMwLTM2LjQtMjkuNi02Ni02Ni02NmgtMzY0Yy0zNi40IDAtNjYgMjkuNi02NiA2NnYxOTguOGMwIDM2LjQgMjkuNiA2NiA2NiA2Nmg3NnYtMTQxLjFoLTQ2LjJjLTYuNyAwLTEyLjEtNS40LTEyLjEtMTIuMXYtNDMuMmMwLTYuNyA1LjQtMTIuMSAxMi4xLTEyLjFoNDYuMnYtNDAuNmMwLTUwLjkgMzAuMy04Ni4yIDgzLjctODYuMmgyNy43YzYuNyAwIDEyLjEgNS40IDEyLjEgMTIuMXY0My4yYzAgNi43LTUuNSAxMi4xLTEyLjIgMTIuMWgtMTdDMjY3IDEwNS40IDI2NCAxMTguMyAyNjQgMTMyLjF2MzUuMmg0NS4xYzcuOCAwIDEzLjggNi44IDEyLjMgMTQuNWwtNS4zIDQzLjJjLTEuMSA2LjEtNi40IDEwLjYtMTIuNiAxMC42SDI2NFYzNTVjMTMxLjEtMTkuMSAxOTguMy0xNTUuNSAxNDAuNS0yNzQuN2ExOTMuOCAxOTMuOCAwIDAgMCA5OS41IDc2LjN6Ii8+PC9zdmc+" alt="페이스북 공유">
            페이스북
        </button>
        <button id="twitter-share" class="share-btn twitter-btn">
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0yMS45MyA0LjM2YTguNjkgOC42OSAwIDAgMC0yLjQ4LjY4IDguMzMgOC4zMyAwIDAxLjY5LTIuMTIgOC42NyA4LjY3IDAgMDEtMi43NCAxLjA2IDQuNDc4IDQuNDc4IDAgMDAtNy44NiAzLjA3IDEyLjQ4IDEyLjQ4IDAgMDEtOC4xMy00LjEyIDQuNTEgNC41MSAwIDAwMS40MyA1Ljk4IDQuNTMgNC41MyAwIDAxLTIuMDYtLjU2djAuMDVhNC40OTggNC40OTggMCAwMDMuNjEgNC40MiA0LjU3IDQuNTcgMCAwMS0yLjA1LjA4YTQuNDcgNC40NyAwIDAwNC4yNyAzLjEgOS4wNCA5LjA0IDAgMDEtNS41NiAxLjkgOC45OSA4Ljk5IDAgMDEtMS4wNy0uMDYgMTIuNzYgMTIuNzYgMCAwMDYuOCAyIiBzdHJva2U9IndoaXRlIi8+PC9zdmc+" alt="X(트위터) 공유">
            X(트위터)
        </button>
        <button id="threads-share" class="share-btn threads-btn">
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9ImZlYXRoZXIgZmVhdGhlci1tZXNzYWdlLWNpcmNsZSI+PHBhdGggZD0iTTE3LjQ1IDIzLjY3Yy0yLjAxLjgtNC4xMS44LTYuMTIgMC0xLjI4LS41LTIuNDYtMS4yNy0zLjQ5LTIuMy0zLjM5LTMuMzktNC41LTguNTYtMi44LTEzLjEzQzYuNTMgNC4zMiA5LjE5IDIuMTIgMTIuMTQgMS40MWMyLjk1LS43IDYuMDktLjE1IDguNiAxLjU2IDEuOTggMS4zNSAzLjU3IDMuMjkgNC41NiA1LjU4IDEuNTggMy42NyAxLjAxIDcuOTItMS40IDExLjA5YTEzLjAwNCAxMy4wMDQgMCAwIDEtNi40NSA0LjAzeiI+PC9wYXRoPjwvc3ZnPg==" alt="쓰레드 공유">
            쓰레드
        </button>
        <button id="link-copy" class="share-btn link-btn">
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9ImZlYXRoZXIgZmVhdGhlci1saW5rIj48cGF0aCBkPSJNMTAgMTNhNSA1IDAgMCAwIDcuNTQuNTRsMyAzYTUgNSAwIDAgMC03LjA3LTcuMDdsLTEuNzIgMS43MSI+PC9wYXRoPjxwYXRoIGQ9Ik0xNCAxMWE1IDUgMCAwIDAtNy41NC0uNTRsLTMgM2E1IDUgMCAwIDAgNy4wNyA3LjA3bDEuNzEtMS43MSI+PC9wYXRoPjwvc3ZnPg==" alt="링크 복사">
            링크 복사
        </button>
    </div>
</div>
`;

// 소셜 공유 JavaScript
const socialShareJS = `
<!-- 소셜 미디어 공유 및 링크 복사 기능 -->
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // 카카오톡 공유 버튼
        const kakaoShareBtn = document.getElementById('kakao-share');
        if (kakaoShareBtn) {
            kakaoShareBtn.addEventListener('click', function() {
                if (!window.Kakao) {
                    alert('카카오톡 SDK를 불러올 수 없습니다.');
                    return;
                }
                
                // SDK 초기화 확인 및 재시도
                if (!window.Kakao.isInitialized()) {
                    window.Kakao.init('e06d0ee93e450a11bc6451d46e09cd88');
                }
                
                // 모바일 환경 확인
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                
                try {
                    if (window.Kakao.Share) {
                        // 최신 SDK Share 객체 사용
                        window.Kakao.Share.sendDefault({
                            objectType: 'feed',
                            content: {
                                title: document.title,
                                description: document.querySelector('meta[name="description"]').getAttribute('content'),
                                imageUrl: 'https://braindetox.kr/site_logo.png',
                                link: {
                                    mobileWebUrl: window.location.href,
                                    webUrl: window.location.href
                                }
                            },
                            buttons: [
                                {
                                    title: '웹으로 보기',
                                    link: {
                                        mobileWebUrl: window.location.href,
                                        webUrl: window.location.href
                                    }
                                }
                            ]
                        });
                    } else if (window.Kakao.Link) {
                        // 구 버전 호환성 유지
                        window.Kakao.Link.sendDefault({
                            objectType: 'feed',
                            content: {
                                title: document.title,
                                description: document.querySelector('meta[name="description"]').getAttribute('content'),
                                imageUrl: 'https://braindetox.kr/site_logo.png',
                                link: {
                                    mobileWebUrl: window.location.href,
                                    webUrl: window.location.href
                                }
                            },
                            buttons: [
                                {
                                    title: '웹으로 보기',
                                    link: {
                                        mobileWebUrl: window.location.href,
                                        webUrl: window.location.href
                                    }
                                }
                            ]
                        });
                    } else {
                        // 모바일이 아니거나 카카오톡 미설치 시 웹 공유 사용
                        window.open(\`https://sharer.kakao.com/talk/friends/picker/link?url=\${encodeURIComponent(window.location.href)}&text=\${encodeURIComponent(document.title)}\`, 'kakaotalk_share', 'width=350, height=650');
                    }
                } catch (error) {
                    console.error('카카오톡 공유 중 오류 발생:', error);
                    alert('카카오톡 공유 기능을 사용할 수 없습니다. 다른 방법으로 공유해 주세요.');
                }
            });
        }
        
        // 페이스북 공유 버튼
        const facebookShareBtn = document.getElementById('facebook-share');
        if (facebookShareBtn) {
            facebookShareBtn.addEventListener('click', function() {
                // 모바일 환경 확인
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                const shareUrl = \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(window.location.href)}\`;
                
                if (isMobile) {
                    // 모바일에서는 새 창이 아닌 현재 창에서 열기
                    window.location.href = shareUrl;
                } else {
                    // PC에서는 팝업으로 열기
                    window.open(shareUrl, 'facebook-share-dialog', 'width=626,height=436');
                }
            });
        }
        
        // X(트위터) 공유 버튼
        const twitterShareBtn = document.getElementById('twitter-share');
        if (twitterShareBtn) {
            twitterShareBtn.addEventListener('click', function() {
                const text = document.title;
                const shareUrl = \`https://twitter.com/intent/tweet?text=\${encodeURIComponent(text)}&url=\${encodeURIComponent(window.location.href)}\`;
                window.open(shareUrl, 'twitter-share-dialog', 'width=626,height=436');
            });
        }
        
        // 쓰레드 공유 버튼
        const threadsShareBtn = document.getElementById('threads-share');
        if (threadsShareBtn) {
            threadsShareBtn.addEventListener('click', function() {
                // 쓰레드는 직접 공유 API가 없어서 링크 복사 후 알림
                const currentUrl = window.location.href;
                const tempTextArea = document.createElement('textarea');
                tempTextArea.value = currentUrl;
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                document.execCommand('copy');
                document.body.removeChild(tempTextArea);
                alert('링크가 복사되었습니다. 쓰레드 앱에 붙여넣기하여 공유하세요!');
            });
        }
        
        // 링크 복사 버튼
        const linkCopyBtn = document.getElementById('link-copy');
        if (linkCopyBtn) {
            linkCopyBtn.addEventListener('click', function() {
                const currentUrl = window.location.href;
                
                // 임시 텍스트 영역 생성
                const tempTextArea = document.createElement('textarea');
                tempTextArea.value = currentUrl;
                document.body.appendChild(tempTextArea);
                
                // 텍스트 선택 및 복사
                tempTextArea.select();
                document.execCommand('copy');
                
                // 임시 요소 제거
                document.body.removeChild(tempTextArea);
                
                // 토스트 메시지 표시
                alert('링크가 복사되었습니다!');
            });
        }
    });
</script>
`;

// 카카오톡 SDK 스크립트
const kakaoSDK = `
<!-- 카카오톡 공유 SDK -->
<script src="https://t1.kakaocdn.net/kakao_js_sdk/2.4.0/kakao.min.js" integrity="sha384-mXVrIX2T/Kszp6Z0aEWaA8Nm7J6/ZeWXbL8UpGRjKwWe56Srd/iyNmWMBhcItAjH" crossorigin="anonymous"></script>
`;

/**
 * 포스트 파일을 처리하는 함수
 * @param {string} filePath - 파일 경로
 */
async function processPostFile(filePath) {
    try {
        // 파일 읽기
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 이미 소셜 공유 버튼이 있는지 확인
        if (content.includes('id="kakao-share"') || content.includes('class="share-section"')) {
            console.log(`[SKIP] ${filePath} - 이미 소셜 공유 버튼이 있습니다.`);
            return;
        }
        
        // 카카오톡 SDK가 있는지 확인
        const hasKakaoSDK = content.includes('kakao_js_sdk') || content.includes('kakao.min.js');
        
        // 하단 광고 위치 찾기 (또는 다른 적절한 위치)
        let insertPosition;
        
        if (content.includes('<div class="post-ad post-ad-bottom">')) {
            // 하단 광고 위에 삽입
            insertPosition = content.indexOf('<div class="post-ad post-ad-bottom">');
            content = content.slice(0, insertPosition) + socialShareHTML + '\n\n' + content.slice(insertPosition);
        } else if (content.includes('<!-- 목록으로 돌아가기 링크 -->')) {
            // 목록으로 돌아가기 링크 위에 삽입
            insertPosition = content.indexOf('<!-- 목록으로 돌아가기 링크 -->');
            content = content.slice(0, insertPosition) + socialShareHTML + '\n\n' + content.slice(insertPosition);
        } else if (content.includes('<div class="back-to-list">')) {
            // 목록으로 돌아가기 링크 위에 삽입 (대체 방법)
            insertPosition = content.indexOf('<div class="back-to-list">');
            content = content.slice(0, insertPosition) + socialShareHTML + '\n\n' + content.slice(insertPosition);
        } else if (content.includes('</article>')) {
            // 아티클 태그 닫기 직전에 삽입
            insertPosition = content.indexOf('</article>');
            content = content.slice(0, insertPosition) + socialShareHTML + '\n\n' + content.slice(insertPosition);
        } else {
            // 적절한 위치를 찾을 수 없는 경우 body 태그 닫기 직전에 삽입
            insertPosition = content.indexOf('</body>');
            content = content.slice(0, insertPosition) + socialShareHTML + '\n\n' + content.slice(insertPosition);
        }
        
        // 카카오톡 SDK 추가 (없는 경우)
        if (!hasKakaoSDK) {
            const headEndPosition = content.indexOf('</head>');
            if (headEndPosition !== -1) {
                content = content.slice(0, headEndPosition) + kakaoSDK + '\n' + content.slice(headEndPosition);
            }
        }
        
        // 소셜 공유 JavaScript 추가
        const bodyEndPosition = content.indexOf('</body>');
        if (bodyEndPosition !== -1) {
            content = content.slice(0, bodyEndPosition) + socialShareJS + '\n' + content.slice(bodyEndPosition);
        }
        
        // 파일 쓰기
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[SUCCESS] ${filePath} - 소셜 공유 기능이 추가되었습니다.`);
    } catch (error) {
        console.error(`[ERROR] ${filePath} - 처리 중 오류 발생:`, error);
    }
}

/**
 * 모든 포스트 파일을 처리하는 함수
 */
async function processAllPosts() {
    try {
        // 디렉토리가 존재하는지 확인
        if (!fs.existsSync(postsDir)) {
            console.error(`[ERROR] 디렉토리가 존재하지 않습니다: ${postsDir}`);
            return;
        }
        
        // 모든 HTML 파일 가져오기
        const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.html'));
        
        if (files.length === 0) {
            console.log('[INFO] 처리할 HTML 파일이 없습니다.');
            return;
        }
        
        console.log(`[INFO] 총 ${files.length}개의 HTML 파일을 처리합니다.`);
        
        // 각 파일 처리
        for (const file of files) {
            const filePath = path.join(postsDir, file);
            await processPostFile(filePath);
        }
        
        console.log('[INFO] 모든 파일 처리가 완료되었습니다.');
    } catch (error) {
        console.error('[ERROR] 처리 중 오류 발생:', error);
    }
}

// 스크립트 실행
processAllPosts(); 