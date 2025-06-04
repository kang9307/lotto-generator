/**
 * 기술 블로그 - HTML 파일 로더 및 렌더러
 * Copyright (c) 2025 braindetox.kr
 */

document.addEventListener('DOMContentLoaded', function() {
    // 전역 변수
    const postList = document.getElementById('postList');
    const markdownContent = document.getElementById('markdownContent');
    const categoryFilter = document.getElementById('categoryFilter');
    const lastUpdatedEl = document.getElementById('lastUpdated');
    const totalPostsEl = document.getElementById('totalPosts');
    const featuredList = document.getElementById('featuredList');
    
    // HTML 파일이 저장된 디렉토리 경로
    const postsDir = './posts/';
    
    // 현재 로드된 포스트 데이터
    let posts = [];
    let categories = new Set();
    let currentPost = null;
    
    // 디버깅 플래그
    const DEBUG = true;
    
    // 기본 도메인 설정 (www 포함)
    const baseDomain = 'https://www.braindetox.kr';
    
    // 디버깅 로그 함수
    function debugLog(...args) {
        if (DEBUG) {
            console.log('[Blog Debug]', ...args);
        }
    }
    
    // SEO용 메타 태그 업데이트 함수
    function updateMetaTags(post) {
        // post가 없으면 기본 메타 태그 사용
        if (!post) {
            document.title = '기술 블로그 - BrainDetox Utility Box | Technical Blog';
            updateMetaTag('description', '프로그래밍, 네트워크, 클라우드, 보안 등 IT 관련 유용한 정보를 제공합니다. Technical blog providing useful information about programming, networking, cloud, security and other IT topics.');
            updateMetaTag('keywords', '기술 블로그, 개발, 프로그래밍, IT, 시사, 경제, technical blog, development, programming, IT, current affairs, economy');
            
            // Open Graph 및 Twitter 카드 업데이트
            updateMetaTag('og:title', '기술 블로그 - BrainDetox Utility Box | Technical Blog', 'property');
            updateMetaTag('og:description', '프로그래밍, 네트워크, 클라우드, 보안 등 IT 관련 유용한 정보를 제공합니다.', 'property');
            updateMetaTag('og:url', `${baseDomain}${window.location.pathname}`, 'property');
            
            updateMetaTag('twitter:title', '기술 블로그 - BrainDetox Utility Box | Technical Blog');
            updateMetaTag('twitter:description', '프로그래밍, 네트워크, 클라우드, 보안 등 IT 관련 유용한 정보를 제공합니다.');
            
            // 소셜 미디어 공유 버튼 기본 정보 설정
            updateSocialShareButtons(null);
            
            return;
        }
        
        // 포스트 정보 기반 메타 태그 생성
        const postTitle = `${post.title} - BrainDetox 기술 블로그`;
        
        // 설명 생성 - 첫 100자 정도의 텍스트 추출 (태그 제거)
        let description = '';
        if (post.description) {
            description = post.description;
        } else {
            description = `${post.title} - ${post.category} 카테고리의 기술 블로그 글입니다.`;
        }
        
        // 영어 설명 추가
        const englishTitle = post.englishTitle || (post.title.includes('(') ? post.title : `${post.title} | Technical Blog Article`);
        
        // 메타 태그 업데이트
        document.title = postTitle;
        updateMetaTag('description', `${description} | Technical blog article about ${post.category}.`);
        updateMetaTag('keywords', post.keywords || `${post.category}, 기술 블로그, ${post.title}`);
        
        // 정규화된 URL (canonical) 업데이트
        updateMetaTag('canonical', `${baseDomain}${window.location.pathname}?post=${post.id}`, 'link');
        
        // Open Graph 및 Twitter 카드 업데이트
        updateMetaTag('og:title', postTitle, 'property');
        updateMetaTag('og:description', description, 'property');
        updateMetaTag('og:url', `${baseDomain}${window.location.pathname}?post=${post.id}`, 'property');
        updateMetaTag('og:type', 'article', 'property');
        if (post.category) {
            updateMetaTag('article:section', post.category, 'property');
        }
        updateMetaTag('article:published_time', post.date, 'property');
        updateMetaTag('article:modified_time', post.modifiedDate || post.date, 'property');
        
        updateMetaTag('twitter:title', post.englishTitle || englishTitle);
        updateMetaTag('twitter:description', description);
        
        // 소셜 미디어 공유 버튼 업데이트
        updateSocialShareButtons(post);
        
        debugLog('메타 태그 업데이트 완료:', postTitle);
    }
    
    // 소셜 미디어 공유 버튼 업데이트 함수
    function updateSocialShareButtons(post) {
        // 카카오톡 공유 버튼 이벤트 업데이트
        const kakaoShareBtn = document.getElementById('kakao-share');
        if (kakaoShareBtn) {
            kakaoShareBtn.onclick = function() {
                // SDK 초기화 확인
                if (!window.Kakao) {
                    console.error('카카오톡 SDK를 불러올 수 없습니다.');
                    alert('카카오톡 SDK를 불러올 수 없습니다. 다른 방법으로 공유해 주세요.');
                    return;
                }
                
                // SDK 초기화 확인 및 재시도
                if (!window.Kakao.isInitialized()) {
                    try {
                        window.Kakao.init('e06d0ee93e450a11bc6451d46e09cd88');
                    } catch (error) {
                        console.error('카카오톡 SDK 초기화 실패:', error);
                        alert('카카오톡 SDK 초기화에 실패했습니다. 다른 방법으로 공유해 주세요.');
                        return;
                    }
                }
                
                // 공유 정보 설정
                const url = post ? `${baseDomain}${window.location.pathname}?post=${post.id}` : `${baseDomain}${window.location.pathname}`;
                const title = post ? `${post.title} - BrainDetox 기술 블로그` : '기술 블로그 - BrainDetox Utility Box';
                const description = post ? (post.description || `${post.title} - ${post.category} 카테고리의 기술 블로그 글입니다.`) : 
                    '프로그래밍, 네트워크, 클라우드, 보안 등 다양한 IT 기술에 대한 정보와 시사와 경제 등의 소식도 제공합니다.';
                
                // 절대 경로로 이미지 URL 설정
                const imageUrl = `${baseDomain}/site_logo.png`;
                
                try {
                    // 이미지 없이도 기본 공유 기능 실행
                    if (window.Kakao.Share) {
                        window.Kakao.Share.sendDefault({
                            objectType: 'feed',
                            content: {
                                title: title,
                                description: description,
                                imageUrl: imageUrl,
                                link: {
                                    mobileWebUrl: url,
                                    webUrl: url
                                }
                            },
                            buttons: [
                                {
                                    title: '웹으로 보기',
                                    link: {
                                        mobileWebUrl: url,
                                        webUrl: url
                                    }
                                }
                            ]
                        });
                    } else if (window.Kakao.Link) {
                        window.Kakao.Link.sendDefault({
                            objectType: 'feed',
                            content: {
                                title: title,
                                description: description,
                                imageUrl: imageUrl,
                                link: {
                                    mobileWebUrl: url,
                                    webUrl: url
                                }
                            },
                            buttons: [
                                {
                                    title: '웹으로 보기',
                                    link: {
                                        mobileWebUrl: url,
                                        webUrl: url
                                    }
                                }
                            ]
                        });
                    } else {
                        window.open(`https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, 'kakaotalk_share', 'width=350, height=650');
                    }
                } catch (error) {
                    console.error('카카오톡 공유 중 오류 발생:', error);
                    alert('카카오톡 공유 기능을 사용할 수 없습니다. 다른 방법으로 공유해 주세요.');
                }
            };
        }
        
        // 페이스북 공유 버튼
        const facebookShareBtn = document.getElementById('facebook-share');
        if (facebookShareBtn) {
            facebookShareBtn.onclick = function() {
                const url = post ? `${baseDomain}${window.location.pathname}?post=${post.id}` : `${baseDomain}${window.location.pathname}`;
                const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                
                if (isMobile) {
                    window.location.href = shareUrl;
                } else {
                    window.open(shareUrl, 'facebook-share-dialog', 'width=626,height=436');
                }
            };
        }
        
        // 트위터 공유 버튼
        const twitterShareBtn = document.getElementById('twitter-share');
        if (twitterShareBtn) {
            twitterShareBtn.onclick = function() {
                const url = post ? `${baseDomain}${window.location.pathname}?post=${post.id}` : `${baseDomain}${window.location.pathname}`;
                const title = post ? `${post.title} - BrainDetox 기술 블로그` : '기술 블로그 - BrainDetox Utility Box';
                const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
                
                window.open(shareUrl, 'twitter-share-dialog', 'width=626,height=436');
            };
        }
        
        // 링크 복사 버튼
        const linkCopyBtn = document.getElementById('link-copy');
        if (linkCopyBtn) {
            linkCopyBtn.onclick = function() {
                const url = post ? `${baseDomain}${window.location.pathname}?post=${post.id}` : `${baseDomain}${window.location.pathname}`;
                navigator.clipboard.writeText(url).then(() => {
                    alert('링크가 클립보드에 복사되었습니다.');
                }).catch(err => {
                    console.error('클립보드 복사 중 오류 발생:', err);
                });
            };
        }
        
        // 쓰레드 공유 버튼
        const threadsShareBtn = document.getElementById('threads-share');
        if (threadsShareBtn) {
            threadsShareBtn.onclick = function() {
                const url = post ? `${baseDomain}${window.location.pathname}?post=${post.id}` : `${baseDomain}${window.location.pathname}`;
                navigator.clipboard.writeText(url).then(() => {
                    alert('링크가 클립보드에 복사되었습니다.\n쓰레드 앱에 붙여넣기 해주세요.');
                }).catch(err => {
                    console.error('클립보드 복사 중 오류 발생:', err);
                });
            };
        }
    }
    
    // 메타 태그 업데이트 헬퍼 함수
    function updateMetaTag(name, content, attr = 'name') {
        if (!name || !content) return;
        
        // 기존 태그 찾기
        let meta;
        if (attr === 'link') {
            meta = document.querySelector(`link[rel="${name}"]`);
            // 없으면 생성
            if (!meta) {
                meta = document.createElement('link');
                meta.setAttribute('rel', name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('href', content);
        } else {
            meta = document.querySelector(`meta[${attr}="${name}"]`);
            // 없으면 생성
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(attr, name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        }
    }
    
    // 날짜 포맷팅 함수
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // 파일 확장자 추출 함수
    function getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }
    
    // 파일명에서 ID 추출 함수
    function getIdFromFilename(filename) {
        // 확장자 제거
        return filename.replace(/\.[^/.]+$/, "");
    }
    
    // 포스트 목록 가져오기
    async function fetchPostList() {
        try {
            debugLog('포스트 목록 가져오기 시작...');
            postList.innerHTML = '<li class="post-item loading">포스트 목록을 불러오는 중...</li>';
            
            // 실제 파일 목록 확인
            const availablePosts = [];
            
            try {
                // 디렉토리 인덱스 파일을 통해 파일 목록 가져오기 시도
                const response = await fetch(`${postsDir}index.json`, {
                    cache: 'no-store'
                });
                
                if (response.ok) {
                    // index.json 파일이 있는 경우
                    debugLog('디렉토리 인덱스 파일 발견');
                    const indexData = await response.json();
                    
                    // HTML 파일 목록 및 포스트 메타데이터 가져오기
                    if (indexData.posts && Array.isArray(indexData.posts)) {
                        // posts 배열이 있는 경우 (새로운 방식)
                        debugLog(`index.json에서 ${indexData.posts.length}개 포스트 메타데이터 로드`);
                        
                        for (const post of indexData.posts) {
                            availablePosts.push({
                                id: post.id,
                                title: post.title,
                                date: post.date,
                                modifiedDate: post.modifiedDate || post.date,
                                category: post.category,
                                featured: post.featured,
                                filename: post.filename
                            });
                            
                            // 카테고리 추가
                            if (post.category) {
                                categories.add(post.category);
                            }
                        }
                    } else if (indexData.files && Array.isArray(indexData.files)) {
                        // files 배열만 있는 경우 (기존 방식)
                        const fileList = indexData.files;
                        debugLog(`index.json에서 ${fileList.length}개 파일 목록 로드`);
                        
                        // 각 파일에 대해 처리
                        for (const filename of fileList) {
                            // 파일명에서 확장자 확인
                            if (!filename.toLowerCase().endsWith('.html')) {
                                debugLog(`HTML 파일이 아님, 건너뜀: ${filename}`);
                                continue; // HTML 파일만 처리
                            }
                            
                            const filePath = `${postsDir}${filename}`;
                            debugLog(`파일 로드 시도: ${filePath}`);
                            
                            try {
                                // fetch API를 사용하여 파일 로드 시도
                                const response = await fetch(filePath, { 
                                    cache: 'no-store',
                                    headers: {
                                        'Cache-Control': 'no-cache',
                                        'Pragma': 'no-cache'
                                    }
                                });
                                
                                if (response.ok) {
                                    debugLog(`파일 로드 성공: ${filename}`);
                                    const htmlContent = await response.text();
                                    
                                    // HTML에서 메타데이터 추출
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(htmlContent, 'text/html');
                                    
                                    // 제목 추출
                                    const titleEl = doc.querySelector('meta[property="og:title"]') || doc.querySelector('title');
                                    const title = titleEl ? titleEl.getAttribute('content') || titleEl.textContent : filename;
                                    
                                    // 날짜 추출
                                    const dateEl = doc.querySelector('meta[property="article:published_time"]') || doc.querySelector('meta[itemprop="datePublished"]');
                                    const date = dateEl ? dateEl.getAttribute('content') : new Date().toISOString().split('T')[0];
                                    
                                    // 카테고리 추출
                                    const categoryEl = doc.querySelector('meta[property="article:section"]') || doc.querySelector('meta[itemprop="articleSection"]');
                                    const category = categoryEl ? categoryEl.getAttribute('content') : '미분류';
                                    
                                    // 파일 이름에서 ID 추출
                                    const id = getIdFromFilename(filename);
                                    
                                    // 포스트 정보 저장
                                    availablePosts.push({
                                        id,
                                        title,
                                        date,
                                        modifiedDate: date,
                                        category,
                                        featured: false,
                                        filename
                                    });
                                    
                                    // 카테고리 추가
                                    if (category) {
                                        categories.add(category);
                                    }
                                } else {
                                    console.warn(`파일을 찾을 수 없음: ${filename}, 상태 코드: ${response.status}`);
                                }
                            } catch (error) {
                                console.error(`파일 ${filename} 처리 중 오류:`, error);
                            }
                        }
                    }
                } else {
                    // index.json 파일이 없는 경우 디렉토리 목록 페이지 파싱 시도
                    debugLog('인덱스 파일 없음. 디렉토리 탐색을 시도합니다.');
                    
                    // 포스트 디렉토리 탐색 시도
                    const dirResponse = await fetch(postsDir, {
                        cache: 'no-store'
                    });
                    
                    if (dirResponse.ok) {
                        const html = await dirResponse.text();
                        // HTML 디렉토리 목록에서 .html 파일 추출
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const links = doc.querySelectorAll('a');
                        
                        // HTML 파일 목록 추출
                        const fileList = [];
                        links.forEach(link => {
                            const href = link.getAttribute('href');
                            if (href && href.endsWith('.html')) {
                                fileList.push(href);
                            }
                        });
                        
                        debugLog(`디렉토리 탐색에서 ${fileList.length}개 HTML 파일 발견`);
                        
                        // 각 HTML 파일 처리
                        for (const filename of fileList) {
                            const filePath = `${postsDir}${filename}`;
                            const response = await fetch(filePath);
                            
                            if (response.ok) {
                                const htmlContent = await response.text();
                                
                                // HTML에서 메타데이터 추출
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(htmlContent, 'text/html');
                                
                                // 제목 추출
                                const titleEl = doc.querySelector('meta[property="og:title"]') || doc.querySelector('title');
                                const title = titleEl ? titleEl.getAttribute('content') || titleEl.textContent : filename;
                                
                                // 날짜 추출
                                const dateEl = doc.querySelector('meta[property="article:published_time"]') || doc.querySelector('meta[itemprop="datePublished"]');
                                const date = dateEl ? dateEl.getAttribute('content') : new Date().toISOString().split('T')[0];
                                
                                // 카테고리 추출
                                const categoryEl = doc.querySelector('meta[property="article:section"]') || doc.querySelector('meta[itemprop="articleSection"]');
                                const category = categoryEl ? categoryEl.getAttribute('content') : '미분류';
                                
                                // 포스트 정보 저장
                                const id = getIdFromFilename(filename);
                                availablePosts.push({
                                    id,
                                    title,
                                    date,
                                    modifiedDate: date,
                                    category,
                                    featured: false,
                                    filename
                                });
                                
                                // 카테고리 추가
                                if (category) {
                                    categories.add(category);
                                }
                            }
                        }
                    } else {
                        // 디렉토리 탐색도 실패한 경우 오류 메시지 표시
                        debugLog('디렉토리 탐색 실패. 파일 목록을 가져올 수 없습니다.');
                        throw new Error('HTML 파일 목록을 가져올 수 없습니다. posts/index.json 파일이 필요합니다.');
                    }
                }
                
            } catch (error) {
                console.error('파일 목록 가져오기 실패:', error);
                debugLog('파일 목록 가져오기 실패:', error);
                
                // 오류 메시지 표시
                postList.innerHTML = '<li class="post-item error">파일 목록을 불러올 수 없습니다. posts/index.json 파일을 확인해주세요.</li>';
                markdownContent.innerHTML = `
                    <div class="error-message">
                        <p>포스트 목록을 불러올 수 없습니다.</p>
                        <p>posts/index.json 파일이 있는지 확인하세요.</p>
                        <p>오류 메시지: ${error.message}</p>
                    </div>`;
                return [];
            }
            
            debugLog(`총 ${availablePosts.length}개의 포스트를 로드했습니다.`);
            posts = availablePosts;
            
            if (posts.length === 0) {
                console.warn('로드된 포스트가 없습니다.');
                postList.innerHTML = '<li class="post-item">등록된 글이 없습니다.</li>';
                markdownContent.innerHTML = `
                    <div class="error-message">
                        <p>등록된 글이 없습니다.</p>
                        <p>posts 디렉토리에 HTML 파일이 있는지 확인하세요.</p>
                    </div>`;
                
                // 파일 로드 실패 시 디버깅 정보 표시
                debugLog('파일 로드 디버깅 정보:');
                debugLog('- 포스트 디렉토리:', postsDir);
                debugLog('- 환경:', window.location.protocol === 'file:' ? '로컬 파일 시스템' : '웹 서버');
            } else {
                // 카테고리 필터 업데이트
                updateCategoryFilter();
                
                // 포스트 목록 렌더링
                renderPostList();
                
                // 추천 글 렌더링
                renderFeaturedPosts();
                
                // 메타 정보 업데이트
                updateMetaInfo();
                
                // 최신 글 바로 표시
                loadLatestPost();
                
                debugLog('로드된 포스트:', posts);
            }
            
            return posts;
        } catch (error) {
            console.error('포스트 목록을 가져오는 중 오류가 발생했습니다:', error);
            debugLog('포스트 목록 가져오기 중 예외 발생:', error);
            postList.innerHTML = '<li class="post-item error">포스트 목록을 불러올 수 없습니다.</li>';
            return [];
        }
    }
    
    // 최신 글 로드
    function loadLatestPost() {
        if (posts.length > 0) {
            // 날짜 기준으로 정렬하여 최신 글 가져오기
            const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
            const latestPost = sortedPosts[0];
            
            debugLog(`최신 글 로드: ${latestPost.title}`);
            // 최신 글 로드
            loadPost(latestPost.id);
        }
    }
    
    // 포스트 목록 렌더링
    function renderPostList(filterCategory = 'all') {
        let filteredPosts = posts;
        
        if (filterCategory !== 'all') {
            filteredPosts = posts.filter(post => post.category === filterCategory);
        }
        
        if (filteredPosts.length === 0) {
            postList.innerHTML = '<li class="post-item">이 카테고리에 포스트가 없습니다.</li>';
            return;
        }
        
        // 날짜 최신순으로 정렬
        filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 목록 렌더링
        postList.innerHTML = '';
        filteredPosts.forEach(post => {
            const li = document.createElement('li');
            li.className = 'post-item';
            li.setAttribute('data-id', post.id);
            
            // 카테고리 배지
            const categorySpan = post.category ? 
                `<span class="post-category">${post.category}</span>` : '';
            
            li.innerHTML = `
                ${categorySpan}
                ${post.title}
                <span class="post-date">${formatDate(post.date)}</span>
            `;
            
            li.addEventListener('click', () => loadPost(post.id));
            postList.appendChild(li);
        });
        
        // 총 포스트 수 업데이트
        if (totalPostsEl) {
            totalPostsEl.textContent = posts.length;
        }
    }
    
    // 추천 글 목록 렌더링
    function renderFeaturedPosts() {
        if (!featuredList) return;
        
        const featuredPosts = posts.filter(post => post.featured);
        
        if (featuredPosts.length === 0) {
            featuredList.innerHTML = '<li>추천 글이 없습니다.</li>';
            return;
        }
        
        featuredList.innerHTML = '';
        featuredPosts.forEach(post => {
            const li = document.createElement('li');
            li.textContent = post.title;
            li.addEventListener('click', () => loadPost(post.id));
            featuredList.appendChild(li);
        });
    }
    
    // 카테고리 필터 업데이트
    function updateCategoryFilter() {
        if (!categoryFilter) return;
        
        categoryFilter.innerHTML = '<option value="all">모든 카테고리</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        
        // 카테고리 변경 이벤트 리스너
        categoryFilter.addEventListener('change', () => {
            renderPostList(categoryFilter.value);
        });
    }
    
    // 메타 정보 업데이트
    function updateMetaInfo() {
        // 최신 업데이트 날짜 찾기
        if (posts.length > 0 && lastUpdatedEl) {
            // modifiedDate가 있으면 우선 사용, 없으면 date 사용
            const latestDate = new Date(Math.max(...posts.map(post => 
                new Date(post.modifiedDate || post.date)
            )));
            lastUpdatedEl.textContent = formatDate(latestDate);
        } else if (lastUpdatedEl) {
            lastUpdatedEl.textContent = '업데이트 없음';
        }
        
        if (totalPostsEl) {
            totalPostsEl.textContent = posts.length;
        }
    }
    
    // 포스트 로드 및 표시
    async function loadPost(postId) {
        try {
            // 활성 포스트 표시
            document.querySelectorAll('.post-item').forEach(item => {
                item.classList.remove('active');
            });
            
            const activeItem = document.querySelector(`.post-item[data-id="${postId}"]`);
            if (activeItem) {
                activeItem.classList.add('active');
            }
            
            // 현재 포스트 찾기
            currentPost = posts.find(post => post.id === postId);
            
            if (!currentPost) {
                markdownContent.innerHTML = '<div class="error-message">포스트를 찾을 수 없습니다.</div>';
                updateMetaTags(null); // 기본 메타태그로 복원
                return;
            }
            
            // 로딩 표시
            markdownContent.innerHTML = '<div class="loading-spinner">포스트를 불러오는 중...</div>';
            
            // HTML 파일 내용 가져오기
            try {
                const filePath = `${postsDir}${currentPost.filename}`;
                debugLog(`HTML 파일 콘텐츠 로드 시도: ${filePath}`);
                
                const response = await fetch(filePath, {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`파일을 불러올 수 없습니다: ${response.status} ${response.statusText}`);
                }
                
                const htmlContent = await response.text();
                debugLog(`HTML 파일 콘텐츠 로드 성공: ${htmlContent.length} 바이트`);
                
                // HTML 파서로 문서 파싱
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, 'text/html');
                
                // article 요소 추출
                const articleContent = doc.querySelector('article');
                
                if (articleContent) {
                    // 메타데이터 업데이트
                    const metaTags = doc.querySelectorAll('meta');
                    metaTags.forEach(meta => {
                        const name = meta.getAttribute('name') || meta.getAttribute('property');
                        const content = meta.getAttribute('content');
                        
                        if (name && content) {
                            if (name === 'keywords') {
                                currentPost.keywords = content;
                            } else if (name === 'description') {
                                currentPost.description = content;
                            }
                        }
                    });
                    
                    // JSON-LD 스크립트 확인
                    const jsonLdScript = doc.querySelector('script[type="application/ld+json"]');
                    if (jsonLdScript) {
                        try {
                            const jsonLdData = JSON.parse(jsonLdScript.textContent);
                            if (jsonLdData.keywords) {
                                currentPost.keywords = jsonLdData.keywords;
                            }
                        } catch (e) {
                            debugLog('JSON-LD 파싱 오류:', e);
                        }
                    }
                    
                    // SEO를 위한 메타 태그 업데이트
                    updateMetaTags(currentPost);
                    
                    // 포스트 콘텐츠 표시
                    markdownContent.innerHTML = '';
                    markdownContent.appendChild(articleContent.cloneNode(true));
                    
                    // 코드 하이라이팅 적용 (이미 HTML에 포함된 경우 필요 없음)
                    markdownContent.querySelectorAll('pre code').forEach(block => {
                        if (window.hljs) {
                            hljs.highlightElement(block);
                        }
                    });
                } else {
                    // article 요소가 없으면 전체 body 내용 사용
                    const bodyContent = doc.querySelector('body');
                    if (bodyContent) {
                        markdownContent.innerHTML = bodyContent.innerHTML;
                    } else {
                        markdownContent.innerHTML = htmlContent;
                    }
                    
                    // SEO를 위한 메타 태그 업데이트
                    updateMetaTags(currentPost);
                }
                
                // URL 파라미터 업데이트
                updateUrlParam(postId);
                
                // 관련 게시물 표시 (같은 카테고리의 다른 글)
                renderRelatedPosts(currentPost);
                
            } catch (error) {
                debugLog(`HTML 파일 콘텐츠 로드 실패:`, error);
                
                // 오류 메시지 표시
                markdownContent.innerHTML = `
                    <div class="error-message">
                        <p>포스트를 불러올 수 없습니다.</p>
                        <p>오류 메시지: ${error.message}</p>
                    </div>`;
            }
            
        } catch (error) {
            console.error('포스트를 불러오는 중 오류가 발생했습니다:', error);
            debugLog('포스트 로드 중 예외 발생:', error);
            markdownContent.innerHTML = `
                <div class="error-message">
                    <p>포스트를 불러올 수 없습니다.</p>
                    <p>오류 메시지: ${error.message}</p>
                </div>`;
        }
    }
    
    // 관련 게시물 표시 함수 (SEO 개선)
    function renderRelatedPosts(currentPost) {
        if (!currentPost || !currentPost.category || posts.length <= 1) return;
        
        // 같은 카테고리의 다른 포스트 찾기 (최대 3개)
        const relatedPosts = posts
            .filter(post => post.category === currentPost.category && post.id !== currentPost.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
        
        if (relatedPosts.length === 0) return;
        
        // 관련 게시물 HTML 생성
        const relatedPostsHTML = `
            <div class="related-posts">
                <h3>관련 게시물 (Related Posts)</h3>
                <ul>
                    ${relatedPosts.map(post => `
                        <li>
                            <a href="?post=${post.id}" class="related-post-link" data-id="${post.id}">
                                ${post.title}
                            </a>
                            <span class="post-date">${formatDate(post.date)}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        
        // 관련 게시물 추가
        const articleElement = markdownContent.querySelector('article');
        if (articleElement) {
            articleElement.insertAdjacentHTML('beforeend', relatedPostsHTML);
            
            // 관련 게시물 링크에 이벤트 리스너 추가
            document.querySelectorAll('.related-post-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const postId = this.getAttribute('data-id');
                    loadPost(postId);
                });
            });
        }
    }
    
    // URL 파라미터 업데이트
    function updateUrlParam(postId) {
        if (history.pushState) {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('post', postId);
            window.history.pushState({ path: newUrl.href }, '', newUrl.href);
        }
    }
    
    // URL에서 포스트 ID 가져오기
    function getPostIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('post');
    }
    
    // 새로고침 버튼 이벤트 리스너
    document.getElementById('refreshBtn')?.addEventListener('click', function() {
        debugLog('새로고침 버튼 클릭됨');
        fetchPostList();
    });
    
    // 초기화
    async function init() {
        debugLog('블로그 초기화 중...');
        await fetchPostList();
        
        // URL에서 포스트 ID 확인
        const postId = getPostIdFromUrl();
        if (postId) {
            loadPost(postId);
        }
        
        // 5분마다 목록 새로고침 (자동 업데이트)
        setInterval(fetchPostList, 5 * 60 * 1000);
    }
    
    // 초기화 실행
    init();
}); 