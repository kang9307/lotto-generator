/**
 * 기술 블로그 - 마크다운 파일 로더 및 렌더러
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
    
    // 마크다운 파일이 저장된 디렉토리 경로
    const markdownDir = './posts/';
    
    // 현재 로드된 포스트 데이터
    let posts = [];
    let categories = new Set();
    let currentPost = null;
    
    // 디버깅 플래그
    const DEBUG = true;
    
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
            updateMetaTag('description', '프로그래밍, 네트워크, 클라우드, 보안 등 IT 관련 유용한 정보를 마크다운 형식으로 제공합니다. Technical blog providing useful information about programming, networking, cloud, security and other IT topics.');
            updateMetaTag('keywords', '기술 블로그, 마크다운, 개발, 프로그래밍, IT, 시사, 경제, technical blog, markdown, development, programming, IT, current affairs, economy');
            
            // Open Graph 및 Twitter 카드 업데이트
            updateMetaTag('og:title', '기술 블로그 - BrainDetox Utility Box | Technical Blog', 'property');
            updateMetaTag('og:description', '프로그래밍, 네트워크, 클라우드, 보안 등 IT 관련 유용한 정보를 마크다운 형식으로 제공합니다.', 'property');
            updateMetaTag('og:url', window.location.href, 'property');
            
            updateMetaTag('twitter:title', '기술 블로그 - BrainDetox Utility Box | Technical Blog');
            updateMetaTag('twitter:description', '프로그래밍, 네트워크, 클라우드, 보안 등 IT 관련 유용한 정보를 마크다운 형식으로 제공합니다.');
            
            return;
        }
        
        // 포스트 정보 기반 메타 태그 생성
        const postTitle = `${post.title} - BrainDetox 기술 블로그`;
        
        // 키워드 추출 - 마크다운 파일에서 keywords 메타데이터 추출
        const keywordsMatch = post.content && post.content.match(/<!--\s*keywords:\s*(.+?)\s*-->/);
        const keywords = keywordsMatch ? keywordsMatch[1] : `${post.category}, 기술 블로그, 마크다운, 개발, 프로그래밍, ${post.title}`;
        
        // 설명 생성 - 첫 100자 정도의 텍스트 추출 (태그 제거)
        let description = '';
        if (post.content) {
            // HTML 태그 제거 및 내용 추출
            const tempDiv = document.createElement('div');
            // 마크다운을 HTML로 변환 후 태그 제거
            tempDiv.innerHTML = marked.parse(post.content);
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            // 처음 200자 정도 사용 (또는 # 제목 이후 첫 단락)
            description = textContent.replace(/\s+/g, ' ').trim().substring(0, 200) + '...';
        } else {
            description = `${post.title} - ${post.category} 카테고리의 기술 블로그 글입니다.`;
        }
        
        // 영어 설명 추가
        const englishTitle = post.title.includes('(') ? post.title : `${post.title} | Technical Blog Article`;
        
        // 메타 태그 업데이트
        document.title = postTitle;
        updateMetaTag('description', `${description} | Technical blog article about ${post.category}.`);
        updateMetaTag('keywords', keywords);
        
        // 정규화된 URL (canonical) 업데이트
        updateMetaTag('canonical', `${window.location.origin}${window.location.pathname}?post=${post.id}`, 'link');
        
        // Open Graph 및 Twitter 카드 업데이트
        updateMetaTag('og:title', postTitle, 'property');
        updateMetaTag('og:description', description, 'property');
        updateMetaTag('og:url', `${window.location.origin}${window.location.pathname}?post=${post.id}`, 'property');
        updateMetaTag('og:type', 'article', 'property');
        if (post.category) {
            updateMetaTag('article:section', post.category, 'property');
        }
        updateMetaTag('article:published_time', post.date, 'property');
        updateMetaTag('article:modified_time', post.modifiedDate || post.date, 'property');
        
        updateMetaTag('twitter:title', englishTitle);
        updateMetaTag('twitter:description', description);
        
        debugLog('메타 태그 업데이트 완료:', postTitle);
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
    
    // 마크다운 파일에서 메타데이터 추출 함수
    function extractMetadata(content) {
        const metadata = {
            title: '',
            date: new Date().toISOString().split('T')[0], // 기본값은 오늘 날짜
            category: '미분류',
            featured: false,
            keywords: ''  // SEO용 키워드 추가
        };
        
        // 첫 번째 줄이 H1(#)으로 시작하면 제목으로 사용
        const titleMatch = content.match(/^# (.+)$/m);
        if (titleMatch) {
            metadata.title = titleMatch[1].trim();
        }
        
        // 카테고리 메타데이터 추출 (<!-- category: 카테고리명 -->)
        const categoryMatch = content.match(/<!--\s*category:\s*(.+?)\s*-->/);
        if (categoryMatch) {
            metadata.category = categoryMatch[1].trim();
        }
        
        // 날짜 메타데이터 추출 (<!-- date: YYYY-MM-DD -->)
        const dateMatch = content.match(/<!--\s*date:\s*(\d{4}-\d{2}-\d{2})\s*-->/);
        if (dateMatch) {
            metadata.date = dateMatch[1];
        }
        
        // 추천 글 메타데이터 추출 (<!-- featured: true|false -->)
        const featuredMatch = content.match(/<!--\s*featured:\s*(true|false)\s*-->/);
        if (featuredMatch) {
            metadata.featured = featuredMatch[1].toLowerCase() === 'true';
        }
        
        // SEO용 키워드 추출 (<!-- keywords: 키워드1, 키워드2, ... -->)
        const keywordsMatch = content.match(/<!--\s*keywords:\s*(.+?)\s*-->/);
        if (keywordsMatch) {
            metadata.keywords = keywordsMatch[1].trim();
        }
        
        debugLog('추출된 메타데이터:', metadata);
        return metadata;
    }
    
    // 마크다운 파일 목록 가져오기
    async function fetchPostList() {
        try {
            debugLog('포스트 목록 가져오기 시작...');
            postList.innerHTML = '<li class="post-item loading">포스트 목록을 불러오는 중...</li>';
            
            // 실제 파일 목록 확인
            const availablePosts = [];
            
            // 알려진 모든 마크다운 파일 목록
            // 로컬 및 웹 환경 모두에서 동작하도록 설정
            const knownFiles = [
                'javascript_basic.md',
                'networking_basic.md'
                // 더 많은 파일이 추가되면 여기에 추가
            ];
            
            debugLog('총 ' + knownFiles.length + '개의 파일을 로드합니다.');
            debugLog('마크다운 디렉토리 경로:', markdownDir);
            // 개인정보 보호를 위해 전체 URL 대신 프로토콜만 표시
            debugLog('브라우저 환경:', window.location.protocol);
            
            // 각 파일에 대해 처리
            for (const filename of knownFiles) {
                try {
                    const filePath = `${markdownDir}${filename}`;
                    debugLog(`파일 로드 시도: ${filePath}`);
                    
                    // fetch API를 사용하여 파일 로드 시도
                    // 캐시를 무시하고 항상 새로 로드 (디버깅용)
                    const response = await fetch(filePath, { 
                        cache: 'no-store',
                        headers: {
                            'Cache-Control': 'no-cache',
                            'Pragma': 'no-cache'
                        }
                    });
                    
                    debugLog(`파일 응답 상태: ${response.status} ${response.statusText}`);
                    
                    if (response.ok) {
                        debugLog(`파일 로드 성공: ${filename}`);
                        const content = await response.text();
                        debugLog(`파일 내용 로드 (${content.length} 바이트)`);
                        
                        // 콘텐츠가 비어있는지 확인
                        if (!content || content.trim() === '') {
                            debugLog(`경고: ${filename}의 내용이 비어 있습니다.`);
                            continue;
                        }
                        
                        // 메타데이터 추출
                        const metadata = extractMetadata(content);
                        
                        // 파일 이름에서 ID 추출
                        const id = getIdFromFilename(filename);
                        
                        // 마지막 수정 날짜는 메타데이터의 날짜 사용
                        const modifiedDate = metadata.date;
                        
                        // 포스트 정보 저장
                        availablePosts.push({
                            id,
                            title: metadata.title || filename, // 제목이 없으면 파일명 사용
                            date: metadata.date,
                            modifiedDate: modifiedDate,
                            category: metadata.category,
                            featured: metadata.featured,
                            filename,
                            content: content // 전체 콘텐츠도 저장
                        });
                        
                        // 카테고리 추가
                        if (metadata.category) {
                            categories.add(metadata.category);
                        }
                    } else {
                        console.warn(`파일을 찾을 수 없음: ${filename}, 상태 코드: ${response.status}`);
                        // 추가 디버깅 정보
                        debugLog(`파일 로드 실패. 상세 정보:`, {
                            filePath,
                            status: response.status,
                            statusText: response.statusText,
                            headers: Array.from(response.headers.entries())
                        });
                        
                        // 로컬 파일 시스템에서는 fetch가 실패할 수 있으므로 대체 방법 시도
                        if (window.location.protocol === 'file:') {
                            debugLog('로컬 파일 시스템 환경 감지. 대체 방법으로 시도합니다.');
                            
                            // 로컬 테스트용 샘플 콘텐츠 생성 (실제 파일 내용과 유사하게)
                            const sampleContent = createSampleContent(filename);
                            
                            // 메타데이터 추출
                            const metadata = extractMetadata(sampleContent);
                            
                            // 파일 이름에서 ID 추출
                            const id = getIdFromFilename(filename);
                            
                            // 포스트 정보 저장
                            availablePosts.push({
                                id,
                                title: metadata.title || filename, // 제목이 없으면 파일명 사용
                                date: metadata.date,
                                modifiedDate: metadata.date,
                                category: metadata.category,
                                featured: metadata.featured,
                                filename,
                                content: sampleContent // 샘플 콘텐츠 저장
                            });
                            
                            // 카테고리 추가
                            if (metadata.category) {
                                categories.add(metadata.category);
                            }
                            
                            debugLog(`로컬 파일 시스템용 샘플 콘텐츠 생성 완료: ${filename}`);
                        }
                    }
                } catch (error) {
                    console.error(`파일 ${filename} 처리 중 오류:`, error);
                    debugLog(`파일 처리 중 예외 발생:`, error);
                }
            }
            
            debugLog(`총 ${availablePosts.length}개의 포스트를 로드했습니다.`);
            posts = availablePosts;
            
            if (posts.length === 0) {
                console.warn('로드된 포스트가 없습니다.');
                postList.innerHTML = '<li class="post-item">등록된 글이 없습니다.</li>';
                markdownContent.innerHTML = `
                    <div class="error-message">
                        <p>등록된 글이 없습니다.</p>
                    </div>`;
                
                // 파일 로드 실패 시 디버깅 정보 표시
                debugLog('파일 로드 디버깅 정보:');
                debugLog('- 마크다운 디렉토리:', markdownDir);
                debugLog('- 파일 목록:', knownFiles);
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
            
            let content;
            
            // 이미 로드된 콘텐츠가 있으면 사용, 없으면 가져오기
            if (currentPost.content) {
                content = currentPost.content;
                debugLog(`캐시된 콘텐츠 사용: ${currentPost.filename}`);
            } else {
                // 마크다운 파일 내용 가져오기
                try {
                    const filePath = `${markdownDir}${currentPost.filename}`;
                    debugLog(`파일 콘텐츠 로드 시도: ${filePath}`);
                    
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
                    
                    content = await response.text();
                    // 캐싱을 위해 포스트 객체에 콘텐츠 저장
                    currentPost.content = content;
                    debugLog(`파일 콘텐츠 로드 성공: ${content.length} 바이트`);
                } catch (error) {
                    debugLog(`파일 콘텐츠 로드 실패:`, error);
                    
                    // 로컬 파일 시스템에서는 샘플 콘텐츠 사용
                    if (window.location.protocol === 'file:') {
                        content = createSampleContent(currentPost.filename);
                        debugLog(`로컬 파일 시스템용 샘플 콘텐츠 사용`);
                    } else {
                        throw error;
                    }
                }
            }
            
            // 메타데이터 주석 제거 (표시되지 않도록)
            const cleanContent = content
                .replace(/<!--\s*category:.*?-->/g, '')
                .replace(/<!--\s*date:.*?-->/g, '')
                .replace(/<!--\s*featured:.*?-->/g, '')
                .replace(/<!--\s*keywords:.*?-->/g, '')
                .replace(/^#\s+.*?\n\s*\n/m, '\n'); // 첫 번째 h1 제목과 다음 빈 줄까지 제거 (멀티라인)
            
            // 마크다운 렌더링
            const htmlContent = marked.parse(cleanContent);
            
            // SEO를 위한 메타 태그 업데이트
            updateMetaTags(currentPost);
            
            // 콘텐츠 헤더 추가 - 구조화된 데이터 포함
            markdownContent.innerHTML = `
                <article itemscope itemtype="https://schema.org/BlogPosting">
                    <meta itemprop="headline" content="${currentPost.title}">
                    <meta itemprop="datePublished" content="${currentPost.date}">
                    <meta itemprop="dateModified" content="${currentPost.modifiedDate || currentPost.date}">
                    <meta itemprop="author" content="BrainDetox">
                    ${currentPost.keywords ? `<meta itemprop="keywords" content="${currentPost.keywords}">` : ''}
                    
                    <div class="post-content-header">
                        <h1 class="post-title" itemprop="name">${currentPost.title}</h1>
                        <div class="post-meta">
                            <span class="post-date" itemprop="datePublished" content="${currentPost.date}">${formatDate(currentPost.date)}</span>
                            ${currentPost.category ? `<span class="post-category" itemprop="articleSection">${currentPost.category}</span>` : ''}
                        </div>
                    </div>
                    <div class="post-content" itemprop="articleBody">
                        ${htmlContent}
                    </div>
                </article>
            `;
            
            // 코드 하이라이팅
            document.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
            
            // URL 파라미터 업데이트
            updateUrlParam(postId);
            
            // 관련 게시물 표시 (같은 카테고리의 다른 글)
            renderRelatedPosts(currentPost);
            
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
    
    // 공유 기능
    document.getElementById('kakao-share')?.addEventListener('click', function() {
        if (window.Kakao && window.Kakao.Link) {
            const postParam = currentPost ? `?post=${currentPost.id}` : '';
            const shareUrl = `${window.location.origin}${window.location.pathname}${postParam}`;
            
            window.Kakao.Link.sendDefault({
                objectType: 'feed',
                content: {
                    title: currentPost ? currentPost.title : '기술 블로그 - BrainDetox Utility Box',
                    description: '프로그래밍, 네트워크, 클라우드, 보안 등 다양한 IT 기술에 대한 정보와 시사와 경제 등의 소식도 제공합니다.',
                    imageUrl: 'https://braindetox.kr/images/utility-warehouse-preview.jpg',
                    link: {
                        mobileWebUrl: shareUrl,
                        webUrl: shareUrl
                    }
                },
                buttons: [
                    {
                        title: '웹으로 보기',
                        link: {
                            mobileWebUrl: shareUrl,
                            webUrl: shareUrl
                        }
                    }
                ]
            });
        } else {
            alert('카카오톡 공유 기능을 사용할 수 없습니다.');
        }
    });
    
    // 페이스북 공유 버튼
    document.getElementById('facebook-share')?.addEventListener('click', function() {
        const postParam = currentPost ? `?post=${currentPost.id}` : '';
        const shareUrl = `${window.location.origin}${window.location.pathname}${postParam}`;
        const url = encodeURIComponent(shareUrl);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    });
    
    // 트위터 공유 버튼
    document.getElementById('twitter-share')?.addEventListener('click', function() {
        const postParam = currentPost ? `?post=${currentPost.id}` : '';
        const shareUrl = `${window.location.origin}${window.location.pathname}${postParam}`;
        const url = encodeURIComponent(shareUrl);
        const text = currentPost ? encodeURIComponent(currentPost.title) : encodeURIComponent('기술 블로그 - BrainDetox Utility Box');
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    });
    
    // 쓰레드 공유 버튼
    document.getElementById('threads-share')?.addEventListener('click', function() {
        const postParam = currentPost ? `?post=${currentPost.id}` : '';
        const shareUrl = `${window.location.origin}${window.location.pathname}${postParam}`;
        // 쓰레드는 공유 API가 없으므로 URL을 클립보드에 복사
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                alert('URL이 클립보드에 복사되었습니다. 쓰레드 앱에 붙여넣기 하세요.');
            })
            .catch(err => {
                console.error('클립보드 복사 실패:', err);
                alert('URL 복사에 실패했습니다. 수동으로 복사해주세요.');
            });
    });
    
    // 링크 복사 버튼
    document.getElementById('link-share')?.addEventListener('click', function() {
        const postParam = currentPost ? `?post=${currentPost.id}` : '';
        const shareUrl = `${window.location.origin}${window.location.pathname}${postParam}`;
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                alert('URL이 클립보드에 복사되었습니다.');
            })
            .catch(err => {
                console.error('클립보드 복사 실패:', err);
                alert('URL 복사에 실패했습니다. 수동으로 복사해주세요.');
            });
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
    
    // 로컬 테스트용 샘플 콘텐츠 생성 함수
    function createSampleContent(filename) {
        // 파일명에 따라 다른 샘플 콘텐츠 생성
        if (filename === 'javascript_basic.md') {
            return `# JavaScript 기초
<!-- category: 프로그래밍 -->
<!-- date: 2024-05-15 -->
<!-- featured: true -->

## 소개

JavaScript는 웹의 언어로, 현대 웹 개발에 필수적인 요소입니다. 이 글에서는 JavaScript의 기본 개념에 대해 알아보겠습니다.

## 변수와 데이터 타입

JavaScript에서는 \`var\`, \`let\`, \`const\` 키워드를 사용하여 변수를 선언합니다.

\`\`\`javascript
// 변수 선언
let name = "홍길동";
const age = 30;
var isActive = true;
\`\`\`

## 함수

JavaScript에서 함수는 다음과 같이 선언합니다:

\`\`\`javascript
// 함수 선언
function greet(name) {
  return "안녕하세요, " + name + "님!";
}

// 화살표 함수
const greet2 = (name) => {
  return "안녕하세요, " + name + "님!";
};
\`\`\`

## 배열과 객체

JavaScript에서 데이터 구조로 배열과 객체를 사용합니다:

\`\`\`javascript
// 배열
const fruits = ["사과", "바나나", "오렌지"];

// 객체
const person = {
  name: "홍길동",
  age: 30,
  isActive: true
};
\`\`\`

## 마무리

이것은 JavaScript의 아주 기본적인 소개입니다. 더 많은 내용은 추후 포스트에서 다루겠습니다.`;
        } else if (filename === 'networking_basic.md') {
            return `# 네트워킹 기초
<!-- category: 네트워크 -->
<!-- date: 2024-05-10 -->
<!-- featured: false -->

## 소개

네트워킹은 컴퓨터 시스템과 장치들이 서로 통신하는 방법을 다루는 분야입니다. 이 글에서는 네트워킹의 기본 개념을 알아보겠습니다.

## OSI 7계층 모델

OSI 모델은 네트워크 통신을 7개의 계층으로 나눕니다:

1. 물리 계층
2. 데이터 링크 계층
3. 네트워크 계층
4. 전송 계층
5. 세션 계층
6. 표현 계층
7. 응용 계층

## IP 주소

IP 주소는 네트워크 상의 장치를 식별하는 고유한 주소입니다.

\`\`\`
IPv4: 192.168.1.1
IPv6: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
\`\`\`

## TCP와 UDP

TCP(Transmission Control Protocol)와 UDP(User Datagram Protocol)는 전송 계층의 주요 프로토콜입니다.

### TCP 특징
- 연결 지향적
- 신뢰성 있는 전송
- 순서 보장

### UDP 특징
- 비연결성
- 신뢰성 없음
- 빠른 속도

## 마무리

네트워킹의 기본 개념을 간략하게 살펴보았습니다. 다음 포스트에서는 더 깊이 있는 내용을 다루겠습니다.`;
        } else {
            // 기본 샘플 콘텐츠
            return `# ${filename.replace('.md', '')}
<!-- category: 미분류 -->
<!-- date: ${new Date().toISOString().split('T')[0]} -->
<!-- featured: false -->

## 샘플 콘텐츠

이 콘텐츠는 로컬 테스트를 위해 생성된 샘플입니다.

## 마크다운 지원

마크다운 문법이 지원됩니다:

- 목록 항목 1
- 목록 항목 2
- 목록 항목 3

\`\`\`
코드 블록도 지원됩니다.
\`\`\`

> 인용문도 지원됩니다.

## 마무리

이것은 테스트용 샘플 콘텐츠입니다.`;
        }
    }
    
    // 초기화 실행
    init();
}); 