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
    
    // 기본 도메인 설정 (www 제거)
    const baseDomain = 'https://braindetox.kr';
    const baseUrl = '/blog.html?post='; // 다시 파라미터 방식으로 변경
    
    // 디버깅 로그 함수
    function debugLog(...args) {
        if (DEBUG) {
            console.log('[Blog Debug]', ...args);
        }
    }
    
    // 메타 태그 업데이트 함수
    function updateMetaTags(post) {
        // 기본 메타 태그 (포스트가 없는 경우)
        if (!post) {
            document.title = '기술 블로그 - BrainDetox Utility Box';
            
            // 기본 메타 태그 업데이트
            updateOrCreateMetaTag('description', '프로그래밍, 네트워크, 클라우드, 보안 등 IT 관련 유용한 정보를 제공하는 기술 블로그입니다.');
            updateOrCreateMetaTag('keywords', '기술 블로그, 개발, 프로그래밍, IT, 네트워크, 클라우드, 보안');
            
            // Open Graph 태그 업데이트
            updateOrCreateMetaTag('og:title', '기술 블로그 - BrainDetox', 'property');
            updateOrCreateMetaTag('og:description', '프로그래밍, 네트워크, 클라우드 등 IT 관련 유용한 정보를 제공합니다.', 'property');
            updateOrCreateMetaTag('og:url', `${baseDomain}/blog.html`, 'property');
            updateOrCreateMetaTag('og:type', 'website', 'property');
            
            // 기본 canonical URL 설정
            let canonicalLink = document.querySelector('link[rel="canonical"]');
            if (!canonicalLink) {
                canonicalLink = document.createElement('link');
                canonicalLink.rel = 'canonical';
                document.head.appendChild(canonicalLink);
            }
            canonicalLink.href = `${baseDomain}/blog.html`;
            
            return;
        }
        
        // 포스트 정보가 있는 경우 메타 태그 업데이트
        const postTitle = `${post.title} - BrainDetox 기술 블로그`;
        document.title = postTitle;
        
        // 포스트 설명 생성
        const description = post.description || `${post.title} - BrainDetox 기술 블로그의 ${post.category} 카테고리 포스트입니다.`;
        
        // 메타 태그 업데이트 또는 생성
        updateOrCreateMetaTag('description', description);
        updateOrCreateMetaTag('keywords', `${post.category}, ${post.tags?.join(', ') || ''}, 브레인디톡스, 기술블로그`);
        
        // Open Graph 태그 업데이트
        updateOrCreateMetaTag('og:title', post.title, 'property');
        updateOrCreateMetaTag('og:description', description, 'property');
        
        // 표준 URL 형식의 canonical URL
        const canonicalUrl = `${baseDomain}${baseUrl}${post.id}`;
        updateOrCreateMetaTag('og:url', canonicalUrl, 'property');
        updateOrCreateMetaTag('og:type', 'article', 'property');
        
        // 포스트 메타 정보 추가
        updateOrCreateMetaTag('article:published_time', post.date, 'property');
        if (post.modifiedDate) {
            updateOrCreateMetaTag('article:modified_time', post.modifiedDate, 'property');
        }
        updateOrCreateMetaTag('article:section', post.category, 'property');
        
        // 표준 URL 태그 설정 (중요: 검색 엔진이 이 URL을 기준으로 인덱싱)
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.rel = 'canonical';
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.href = canonicalUrl;
        
        // 구조화된 데이터 업데이트 (JSON-LD)
        updateStructuredData(post);
        
        debugLog('메타 태그 업데이트됨:', post.title, 'Canonical URL:', canonicalUrl);
    }
    
    // 메타 태그 업데이트 또는 생성 헬퍼 함수
    function updateOrCreateMetaTag(name, content, attributeName = 'name') {
        let metaTag = document.querySelector(`meta[${attributeName}="${name}"]`);
        
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.setAttribute(attributeName, name);
            document.head.appendChild(metaTag);
        }
        
        metaTag.setAttribute('content', content);
    }
    
    // 구조화된 데이터 업데이트 함수 추가
    function updateStructuredData(post) {
        // 기존 JSON-LD 스크립트 제거
        const existingScript = document.querySelector('script[type="application/ld+json"]');
        if (existingScript) {
            existingScript.remove();
        }
        
        // 새 구조화 데이터 생성
        let jsonLdData;
        
        if (!post) {
            // 블로그 목록 페이지용 구조화 데이터
            jsonLdData = {
                "@context": "https://schema.org",
                "@type": "Blog",
                "name": "BrainDetox 기술 블로그",
                "url": `${baseDomain}/blog.html`,
                "description": "프로그래밍, 네트워크, 클라우드, 보안 등 IT 관련 유용한 정보를 제공하는 기술 블로그입니다.",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${baseDomain}/blog.html?search={search_term_string}`,
                    "query-input": "required name=search_term_string"
                }
            };
        } else {
            // 블로그 포스트용 구조화 데이터
            jsonLdData = {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": `${baseDomain}${baseUrl}${post.id}`
                },
                "headline": post.title,
                "description": post.description || `${post.title} - ${post.category} 카테고리의 기술 블로그 글입니다.`,
                "datePublished": post.date,
                "dateModified": post.modifiedDate || post.date,
                "author": {
                    "@type": "Person",
                    "name": "BrainDetox"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "BrainDetox",
                    "logo": {
                        "@type": "ImageObject",
                        "url": `${baseDomain}/site_logo.png`
                    }
                },
                "articleSection": post.category
            };
        }
        
        // 새 JSON-LD 스크립트 추가
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(jsonLdData);
        document.head.appendChild(script);
    }
    
    // 소셜 미디어 공유 버튼 업데이트 함수
    function updateSocialShareButtons(post) {
        // 카카오톡 공유 버튼 이벤트 업데이트
        const kakaoShareBtn = document.getElementById('kakao-share');
        if (kakaoShareBtn) {
            kakaoShareBtn.onclick = function() {
                // 카카오톡 공유용 URL 생성
                const url = post ? `${baseDomain}${window.location.pathname}?post=${post.id}` : `${baseDomain}${window.location.pathname}`;
                const title = post ? `${post.title} - BrainDetox 기술 블로그` : '기술 블로그 - BrainDetox Utility Box';
                
                // 카카오톡 SDK가 없거나 초기화되지 않은 경우 URL 복사로 대체
                if (!window.Kakao || !window.Kakao.isInitialized()) {
                    // 모바일 기기인 경우 카카오톡 앱 공유 링크로 리다이렉트
                    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                        window.location.href = `kakaolink://send?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
                    } else {
                        // 데스크톱에서는 URL 복사로 대체
                        navigator.clipboard.writeText(url).then(() => {
                            alert('URL이 복사되었습니다. 카카오톡에 붙여넣기 해주세요.');
                        }).catch(err => {
                            alert('URL을 복사할 수 없습니다. 수동으로 복사해주세요: ' + url);
                        });
                    }
                    return;
                }
                
                // 카카오톡 SDK가 초기화된 경우 공유 기능 실행
                try {
                    if (window.Kakao.Share) {
                        window.Kakao.Share.sendDefault({
                            objectType: 'feed',
                            content: {
                                title: title,
                                description: post ? (post.description || `${post.category} 카테고리의 기술 블로그 글입니다.`) : 
                                    '프로그래밍, 네트워크, 클라우드, 보안 등 다양한 IT 기술 정보를 제공합니다.',
                                imageUrl: `${baseDomain}/site_logo.png`,
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
                        // 예전 버전 API 사용
                        alert('URL이 복사되었습니다. 카카오톡에 붙여넣기 해주세요.');
                        navigator.clipboard.writeText(url);
                    }
                } catch (error) {
                    // 오류 발생 시 URL 복사로 대체
                    navigator.clipboard.writeText(url).then(() => {
                        alert('URL이 복사되었습니다. 카카오톡에 붙여넣기 해주세요.');
                    }).catch(err => {
                        alert('URL을 복사할 수 없습니다. 수동으로 복사해주세요: ' + url);
                    });
                }
            };
        }
        
        // 페이스북 공유 버튼
        const facebookShareBtn = document.getElementById('facebook-share');
        if (facebookShareBtn) {
            facebookShareBtn.onclick = function() {
                const url = post ? `${baseDomain}${window.location.pathname}?post=${post.id}` : `${baseDomain}${window.location.pathname}`;
                const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                
                // 새 창으로 공유 페이지 열기
                window.open(shareUrl, 'facebook-share', 'width=580,height=296');
            };
        }
        
        // 트위터 공유 버튼
        const twitterShareBtn = document.getElementById('twitter-share');
        if (twitterShareBtn) {
            twitterShareBtn.onclick = function() {
                const url = post ? `${baseDomain}${window.location.pathname}?post=${post.id}` : `${baseDomain}${window.location.pathname}`;
                const title = post ? `${post.title} - BrainDetox 기술 블로그` : '기술 블로그 - BrainDetox Utility Box';
                const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
                
                // 새 창으로 공유 페이지 열기
                window.open(shareUrl, 'twitter-share', 'width=550,height=235');
            };
        }
        
        // 쓰레드 공유 버튼 (URL 복사 기능만 제공)
        const threadsShareBtn = document.getElementById('threads-share');
        if (threadsShareBtn) {
            threadsShareBtn.onclick = function() {
                const url = post ? `${baseDomain}${window.location.pathname}?post=${post.id}` : `${baseDomain}${window.location.pathname}`;
                
                navigator.clipboard.writeText(url).then(() => {
                    alert('URL이 복사되었습니다. 쓰레드 앱에 붙여넣기 해주세요.');
                }).catch(err => {
                    prompt('URL을 복사하여 쓰레드 앱에 붙여넣기 해주세요:', url);
                });
            };
        }
        
        // 링크 복사 버튼
        const linkCopyBtn = document.getElementById('link-copy');
        if (linkCopyBtn) {
            linkCopyBtn.onclick = function() {
                const url = post ? `${baseDomain}${window.location.pathname}?post=${post.id}` : `${baseDomain}${window.location.pathname}`;
                
                // clipboard API 사용 시도
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(url).then(() => {
                        alert('URL이 클립보드에 복사되었습니다.');
                    }).catch(err => {
                        // clipboard API 실패 시 대체 방법
                        fallbackCopyTextToClipboard(url);
                    });
                } else {
                    // 지원하지 않는 브라우저용 대체 방법
                    fallbackCopyTextToClipboard(url);
                }
            };
        }
    }
    
    // 클립보드 복사 대체 함수
    function fallbackCopyTextToClipboard(text) {
        try {
            // textarea 요소 생성
            const textArea = document.createElement('textarea');
            textArea.value = text;
            
            // textarea 스타일 설정
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            // 복사 명령 실행
            const successful = document.execCommand('copy');
            if (successful) {
                alert('URL이 클립보드에 복사되었습니다.');
            } else {
                prompt('수동으로 URL을 복사하세요:', text);
            }
            
            document.body.removeChild(textArea);
        } catch (err) {
            prompt('수동으로 URL을 복사하세요:', text);
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
    
    // 글 목록 가져오기
    async function fetchPostList() {
        try {
            // 로딩 상태 표시
            if (postList) {
                postList.innerHTML = '<div class="loading-spinner">글 목록을 불러오는 중...</div>';
            }

            // 먼저 미리 정의된 포스트 인덱스 파일 시도
            try {
                debugLog('인덱스 파일 로드 시도: ' + `${postsDir}index.json`);
                const indexResponse = await fetch(`${postsDir}index.json`);
                if (indexResponse.ok) {
                    const indexData = await indexResponse.json();
                    
                    // 유효한 JSON 데이터가 있는지 확인
                    if (Array.isArray(indexData) && indexData.length > 0) {
                        debugLog('인덱스 파일 데이터:', indexData);
                        
                        posts = indexData.map(post => ({
                            id: post.id,
                            title: post.title,
                            description: post.description || '',
                            excerpt: post.excerpt || post.description || '',
                            category: post.category || '미분류',
                            tags: post.tags || [],
                            thumbnailUrl: post.thumbnailUrl || '',
                            date: post.date || '',
                            modifiedDate: post.modifiedDate || '',
                            filename: post.filename || `${post.id}.html`
                        }));
                        
                        debugLog('인덱스 파일에서 포스트 목록 로드 성공:', posts.length);
                        
                        // 날짜 기준 내림차순 정렬 (최신 글이 먼저)
                        posts.sort((a, b) => {
                            const dateA = new Date(a.date);
                            const dateB = new Date(b.date);
                            return dateB - dateA;
                        });
                        
                        // 카테고리 목록 업데이트
                        updateCategories();
                        
                        // 포스트 목록 렌더링 등 업데이트
                        renderPostList();
                        renderFeaturedPosts();
                        updateMetaInfo();
                        
                        return posts;
                    }
                } else {
                    debugLog('인덱스 파일 로드 실패, 상태 코드:', indexResponse.status);
                }
            } catch (indexError) {
                console.error('인덱스 파일 로드 실패, 디렉토리 스캔으로 대체:', indexError);
            }

            // 인덱스 파일 로드 실패 시 정적 포스트 데이터 사용
            debugLog('정적 포스트 데이터 사용');
            posts = getStaticPostsData();
            
            // 카테고리 목록 업데이트
            updateCategories();
            
            // 상태 업데이트
            renderPostList();
            renderFeaturedPosts();
            updateMetaInfo();
            
            return posts;
        } catch (error) {
            console.error('포스트 목록 가져오기 실패:', error);
            
            // 오류 메시지 표시
            if (postList) {
                postList.innerHTML = `
                <div class="error-message">
                    <p>글 목록을 불러오는 중 오류가 발생했습니다.</p>
                    <p>오류 메시지: ${error.message}</p>
                    <button id="retryBtn" class="retry-btn">다시 시도</button>
                </div>`;
                
                // 다시 시도 버튼에 이벤트 연결
                const retryBtn = document.getElementById('retryBtn');
                if (retryBtn) {
                    retryBtn.addEventListener('click', fetchPostList);
                }
            }
            
            // 오류 발생해도 기본 포스트 데이터 제공
            posts = getStaticPostsData();
            updateCategories();
            renderPostList();
            
            return posts;
        }
    }
    
    // 정적 포스트 데이터 반환 (인덱스 파일 로드 실패 시 사용)
    function getStaticPostsData() {
        // 기본 정적 포스트 데이터
        return [
            {
                id: "ai_future_jobs_career_skills",
                title: "AI 시대의 직업과 필요한 역량",
                description: "인공지능 시대에 각광받는 직업과 이를 위해 필요한 역량에 대해 알아봅니다.",
                category: "기술/IT",
                date: "2025-06-08",
                tags: ["AI", "인공지능", "미래", "직업", "경력", "기술", "역량"],
                filename: "ai_future_jobs_career_skills.html"
            },
            {
                id: "ai_future_social_impact",
                title: "인공지능이 사회에 미치는 영향과 전망",
                description: "인공지능 기술이 우리 사회에 가져올 변화와 미래 전망에 대해 분석합니다.",
                category: "기술/IT",
                date: "2025-06-07",
                tags: ["AI", "인공지능", "사회", "미래", "기술 영향", "윤리"],
                filename: "ai_future_social_impact.html"
            },
            {
                id: "android_version_security",
                title: "안드로이드 버전별 보안 이슈와 대응 방법",
                description: "안드로이드 OS의 각 버전별 보안 취약점과 사용자 대응 방법을 알아봅니다.",
                category: "보안",
                date: "2025-06-06",
                tags: ["안드로이드", "보안", "운영체제", "취약점", "대응방법"],
                filename: "android_version_security.html"
            },
            {
                id: "ceph_storage_intro",
                title: "Ceph 스토리지 시스템 개요: 기본 구조와 활용",
                description: "오픈소스 분산 스토리지 시스템인 Ceph의 구조와 활용 방법에 대한 소개입니다.",
                category: "기술/IT",
                date: "2025-06-02",
                tags: ["Ceph", "스토리지", "분산시스템", "오픈소스", "클라우드"],
                filename: "ceph_storage_intro.html"
            },
            {
                id: "healthy_diet_nutrition",
                title: "건강한 식단과 영양소 섭취 가이드",
                description: "균형 잡힌 식단 구성과 필수 영양소 섭취 방법에 대한 종합 가이드입니다.",
                category: "건강",
                date: "2025-05-25",
                tags: ["건강", "식단", "영양", "다이어트", "웰빙"],
                filename: "healthy_diet_nutrition.html"
            }
        ];
    }
    
    // 카테고리 목록 업데이트
    function updateCategories() {
        categories = new Set(posts.map(post => post.category));
        categories.add('all'); // '전체' 카테고리 추가
        
        // 카테고리 필터 업데이트
        updateCategoryFilter();
    }
    
    // 포스트 목록 렌더링
    function renderPostList(filterCategory = 'all') {
        if (!postList) return;
        
        // 포스트 목록 비우기
        postList.innerHTML = '';
        
        // 카테고리 필터링
        let filteredPosts = posts;
        if (filterCategory !== 'all') {
            filteredPosts = posts.filter(post => post.category === filterCategory);
        }
        
        // 날짜 최신순으로 정렬
        filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 결과가 없는 경우
        if (filteredPosts.length === 0) {
            postList.innerHTML = '<li class="post-item no-results">검색 결과가 없습니다.</li>';
            return;
        }
        
        // 포스트 항목을 목록에 추가
        filteredPosts.forEach(post => {
            const listItem = document.createElement('li');
            listItem.className = 'post-item';
            listItem.setAttribute('data-id', post.id);
            
            const postLink = document.createElement('a');
            // 정적 HTML 페이지 경로로 변경
            postLink.href = `posts/${post.id}.html`;
            postLink.textContent = post.title;
            
            // 클릭 이벤트 핸들러 제거 (정적 페이지로 직접 이동)
            
            const postDate = document.createElement('span');
            postDate.className = 'post-date';
            postDate.textContent = formatDate(post.date);
            
            const postCategory = document.createElement('span');
            postCategory.className = 'post-category';
            postCategory.textContent = post.category;
            // 카테고리 속성 추가 - 스타일 적용을 위한 data-category 속성 추가
            postCategory.setAttribute('data-category', post.category);
            
            // 리스트 아이템에 요소 추가
            listItem.appendChild(postLink);
            listItem.appendChild(postDate);
            listItem.appendChild(postCategory);
            
            // 포스트가 추천된 경우 표시
            if (post.featured) {
                const featuredBadge = document.createElement('span');
                featuredBadge.className = 'featured-badge';
                featuredBadge.textContent = '추천';
                listItem.appendChild(featuredBadge);
            }
            
            postList.appendChild(listItem);
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
    
    // 관련 게시물 표시 함수 (SEO 개선)
    function renderRelatedPosts(currentPost) {
        if (!currentPost || !currentPost.category) return;
        
        // 같은 카테고리의 다른 게시물 찾기 (최대 5개)
        const relatedPosts = posts
            .filter(post => post.category === currentPost.category && post.id !== currentPost.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        if (relatedPosts.length === 0) return;
        
        // 관련 게시물 HTML 생성 (독립 HTML 파일 방식으로 변경)
        const relatedPostsHTML = `
            <div class="related-posts">
                <h3>관련 게시물</h3>
                <ul>
                    ${relatedPosts.map(post => `
                        <li>
                            <a href="./posts/${post.id}.html" class="related-post-link" data-id="${post.id}">
                                ${post.title}
                            </a>
                            <span class="post-date">${formatDate(post.date)}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        
        // 관련 게시물 추가
        markdownContent.insertAdjacentHTML('beforeend', relatedPostsHTML);
        
        // 관련 게시물 링크에 이벤트 리스너 추가
        document.querySelectorAll('.related-post-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const postId = this.getAttribute('data-id');
                loadPost(postId);
            });
        });
    }
    
    // URL에서 포스트 ID 가져오기
    function getPostIdFromUrl() {
        try {
            // URL 파라미터에서 post 값 추출
            const urlParams = new URLSearchParams(window.location.search);
            const postId = urlParams.get('post');
            
            // 유효한 포스트 ID인지 확인
            if (postId && postId.trim() !== '') {
                return postId.trim();
            }
            
            return null;
        } catch (error) {
            console.error('URL에서 포스트 ID 가져오기 실패:', error);
            return null;
        }
    }
    
    // URL 상태 업데이트
    function updateUrlState(postId) {
        try {
            // 유효한 포스트 ID인지 확인
            if (!postId) {
                // 포스트 ID가 없으면 기본 블로그 URL로 변경
                const baseUrl = `${window.location.pathname}`;
                window.history.pushState({ postId: null }, '기술 블로그', baseUrl);
                return;
            }
            
            // 포스트 ID가 있으면 URL 파라미터 추가
            const newUrl = `${window.location.pathname}?post=${postId}`;
            
            // 현재 URL과 다른 경우에만 URL 상태 업데이트
            if (window.location.href !== newUrl) {
                window.history.pushState({ postId }, '포스트 보기', newUrl);
            }
        } catch (error) {
            console.error('URL 상태 업데이트 실패:', error);
        }
    }
    
    // 초기화 함수
    async function init() {
        try {
            // DOM 요소 참조 설정
            setupDOMReferences();
            
            // 이벤트 리스너 설정
            setupEventListeners();
            
            // 카테고리 필터 업데이트
            updateCategoryFilter();
            
            // 포스트 목록 가져오기
            const postData = await fetchPostList();
            
            if (postData && postData.length > 0) {
                posts = postData;
                
                // 카테고리 목록 업데이트
                updateCategories();
                
                // 포스트 목록 렌더링
                renderPostList();
                
                // 메타 정보 업데이트
                updateMetaInfo();
                
                // 포스트 로딩 (필요 없으므로 제거)
                // URL에서 postId를 가져와서 해당 포스트 로드
                
                debugLog('블로그 초기화 완료');
            } else {
                console.error('포스트 데이터를 불러오는데 실패했습니다.');
                
                // 오류 메시지 표시
                if (postList) {
                    postList.innerHTML = '<li class="error">포스트 목록을 불러오는데 실패했습니다.</li>';
                }
                
                if (markdownContent) {
                    markdownContent.innerHTML = '<div class="error-message"><h2>포스트를 불러오는데 실패했습니다</h2><p>잠시 후 다시 시도해주세요.</p></div>';
                }
            }
        } catch (error) {
            console.error('초기화 중 오류 발생:', error);
            
            // 오류 메시지 표시
            if (postList) {
                postList.innerHTML = `<li class="error">초기화 중 오류가 발생했습니다: ${error.message}</li>`;
            }
            
            if (markdownContent) {
                markdownContent.innerHTML = `<div class="error-message"><h2>초기화 중 오류가 발생했습니다</h2><p>오류 메시지: ${error.message}</p></div>`;
            }
        }
    }
    
    // 블로그 레이아웃 전환 (목록/포스트)
    function toggleBlogLayout(isPostView) {
        const blogLayout = document.querySelector('.blog-layout');
        const sidebar = document.querySelector('.blog-sidebar');
        const content = document.querySelector('.blog-content');
        
        if (!blogLayout || !sidebar || !content) return;
        
        // 이제 항상 목록 보기 모드 (포스트는 정적 페이지에서 보임)
        sidebar.style.display = '';
        content.style.display = '';
        blogLayout.classList.remove('post-view-mode');
        
        // 기본 콘텐츠 표시
        if (markdownContent) {
            markdownContent.innerHTML = `
            <div class="welcome-message">
                <h2>기술 블로그에 오신 것을 환영합니다</h2>
                <p>왼쪽 목록에서 관심있는 글을 선택하세요.</p>
                <div class="featured-posts">
                    <h3>추천 글</h3>
                    <ul id="featuredList">
                        <!-- 추천 글 목록이 여기에 동적으로 로드됨 -->
                        <li>추천 글을 불러오는 중...</li>
                    </ul>
                </div>
            </div>`;
            
            // 추천 글 목록 렌더링
            renderFeaturedPosts();
        }
    }
    
    // 이벤트 리스너 설정
    function setupEventListeners() {
        // 카테고리 필터 이벤트 리스너
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                renderPostList(this.value);
            });
        }
        
        // 새로고침 버튼 이벤트 리스너
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async function() {
                try {
                    // 포스트 목록 새로고침
                    this.classList.add('refreshing');
                    
                    // 포스트 목록 다시 가져오기
                    const updatedPosts = await fetchPostList();
                    if (updatedPosts && updatedPosts.length > 0) {
                        posts = updatedPosts;
                        
                        // 카테고리 필터 현재 값 유지
                        const currentCategory = categoryFilter ? categoryFilter.value : 'all';
                        
                        // 카테고리 목록 업데이트
                        updateCategories();
                        
                        // 포스트 목록 다시 렌더링
                        renderPostList(currentCategory);
                        
                        // 메타 정보 업데이트
                        updateMetaInfo();
                    }
                } catch (error) {
                    console.error('포스트 목록 새로고침 실패:', error);
                    
                    // 오류 메시지 표시
                    if (postList) {
                        postList.innerHTML = `<li class="error">새로고침 실패: ${error.message}</li>`;
                    }
                } finally {
                    this.classList.remove('refreshing');
                }
            });
        }
        
        // 공유 버튼 이벤트 리스너
        setupShareButtons();
    }
    
    // 블로그 스타일 조정 - 스크롤 지원
    const blogSidebar = document.querySelector('.blog-sidebar');
    const postListContainer = document.querySelector('.post-list-container');
    
    if (blogSidebar && postListContainer) {
        // 사이드바 높이 조정
        blogSidebar.style.maxHeight = 'calc(100vh - 200px)';
        
        // 포스트 목록 스크롤 지원
        postListContainer.style.maxHeight = 'calc(100vh - 300px)';
        postListContainer.style.overflowY = 'auto';
        postListContainer.style.paddingRight = '10px';
    }
    
    // 초기화 시작
    init();
}); 