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
    
    // DOM 요소 참조 설정 함수 추가
    function setupDOMReferences() {
        // 이미 전역 변수로 선언되어 있으므로 빈 함수로 유지
        // 필요한 경우 여기에 추가적인 DOM 요소 참조 로직을 추가할 수 있음
    }
    
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
                            filename: post.filename || `${post.id}.html`,
                            featured: post.featured || false  // featured 속성이 true인 포스트만 추천글로 표시
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
                    } else {
                        debugLog('인덱스 파일의 형식이 잘못되었거나 비어 있습니다. 디렉토리 스캔으로 대체합니다.');
                        return await fetchPostsFromDirectory();
                    }
                } else {
                    debugLog('인덱스 파일 로드 실패, 상태 코드:', indexResponse.status);
                    return await fetchPostsFromDirectory();
                }
            } catch (indexError) {
                console.error('인덱스 파일 로드 실패, 디렉토리 스캔으로 대체:', indexError);
                return await fetchPostsFromDirectory();
            }
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
    
    // 디렉토리에서 HTML 파일 목록을 가져와 포스트 배열로 변환하는 함수
    async function fetchPostsFromDirectory() {
        try {
            // posts 디렉토리의 모든 HTML 파일 목록을 가져오는 시도
            const allPosts = [];
            
            // 정적 데이터를 기본으로 사용
            const staticPosts = getStaticPostsData();
            
            // 실제 파일 목록을 가져올 수 없으므로, 미리 알고 있는 파일 목록을 사용
            const knownFiles = [
                "zinc_intake_guide.html", "yeonggwang_population_trend.html", "vitamin_d_benefits.html",
                "udca_guide.html", "tofu_health_benefits.html", "stress_management_meditation.html",
                "squid_game_season3_analysis_complete.html", "skt_usim_hacking_reauth_guide.html",
                "skt-usim-hacking-precautions.html", "sitemap_importance.html", "robots_txt_guide.html",
                "php_language_guide_part5.html", "php_language_guide_part4.html", "php_language_guide_part3.html",
                "php_language_guide_part2.html", "php_language_guide_part1.html", "networking_basic.html",
                "meta_tags_seo_guide.html", "meditation_benefits.html", "linux_grep_awk.html",
                "korea_presidential_election_2025.html", "korea_esg_corporate_trends.html",
                "korea_economic_social_challenges_2025.html", "korea_ai_technology_future.html",
                "korea_21st_president_inauguration.html", "korean_traditional_herbs.html",
                "knee_joint_health.html", "jeonse_fraud_comprehensive_report.html", "javascript_basic.html",
                "insomnia_solutions.html", "immunity_boost_lifestyle.html", "immune_system_overview.html",
                "home_office_productivity.html", "healthy_diet_nutrition.html", "fatty_liver_diet.html",
                "digital_detox_guide.html", "dash_diet_guide.html", "coffee_fatty_liver.html",
                "cheonggukjang_benefits.html", "ceph_storage_intro.html", "ceph_rados_crush_deep_dive.html",
                "artificial_intelligence_intro.html", "anemia_breathlessness.html", 
                "android_version_security.html", "ai_future_social_impact.html", "ai_future_jobs_career_skills.html"
            ];
            
            // 각 파일에 대해 처리
            for (const filename of knownFiles) {
                try {
                    // 파일명에서 ID 추출 (확장자 제거)
                    const id = filename.replace('.html', '');
                    
                    // 이미 정적 데이터에 있는 항목인지 확인
                    const existingPost = staticPosts.find(post => post.id === id);
                    
                    if (existingPost) {
                        // 기존 정적 데이터 사용
                        allPosts.push(existingPost);
                        continue;
                    }
                    
                    // HTML 파일 내용 가져오기
                    const htmlResponse = await fetch(`${postsDir}${filename}`);
                    if (htmlResponse.ok) {
                        const htmlContent = await htmlResponse.text();
                        
                        // HTML에서 메타데이터 추출 (제목, 날짜, 카테고리 등)
                        const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/);
                        let title = id; // 기본값으로 ID 사용
                        
                        if (titleMatch) {
                            title = titleMatch[1].replace(' - BrainDetox 기술 블로그', '');
                        }
                        
                        // 메타 정보 추출
                        const categoryMatch = htmlContent.match(/<meta\s+name="category"\s+content="(.*?)"\s*\/?>/);
                        const dateMatch = htmlContent.match(/<meta\s+name="date"\s+content="(.*?)"\s*\/?>/);
                        const descriptionMatch = htmlContent.match(/<meta\s+name="description"\s+content="(.*?)"\s*\/?>/);
                        
                        // ID와 제목에서 자동으로 추천 여부 판단 (ID에 특정 키워드가 있으면 추천글로 설정)
                        const isFeatured = id.includes('featured') || 
                                           title.toLowerCase().includes('추천') ||
                                           Math.random() < 0.3; // 30% 확률로 추천글로 설정
                        
                        allPosts.push({
                            id: id,
                            title: title,
                            description: descriptionMatch ? descriptionMatch[1] : '',
                            category: categoryMatch ? categoryMatch[1] : 
                                     (id.includes('ceph') ? '기술/IT' : 
                                     id.includes('health') || id.includes('diet') ? '건강' : 
                                     id.includes('korea') ? '시사/경제' : '미분류'),
                            date: dateMatch ? dateMatch[1] : 
                                  (new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
                            filename: filename,
                            featured: isFeatured
                        });
                    }
                } catch (fileError) {
                    console.error(`파일 처리 중 오류: ${filename}`, fileError);
                }
            }
            
            // 모든 파일을 처리한 후 중복 제거 (ID 기준)
            const uniquePosts = [];
            const seenIds = new Set();
            
            for (const post of allPosts) {
                if (!seenIds.has(post.id)) {
                    seenIds.add(post.id);
                    uniquePosts.push(post);
                }
            }
            
            // 날짜 기준 내림차순 정렬
            uniquePosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            posts = uniquePosts;
            
            // 카테고리 목록 업데이트
            updateCategories();
            
            // 포스트 목록 렌더링 등 업데이트
            renderPostList();
            renderFeaturedPosts();
            updateMetaInfo();
            
            return posts;
        } catch (error) {
            console.error('디렉토리에서 포스트 목록 가져오기 실패:', error);
            // 오류 발생 시 정적 데이터 반환
            return getStaticPostsData();
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
                filename: "ai_future_jobs_career_skills.html",
                featured: true
            },
            {
                id: "ai_future_social_impact",
                title: "인공지능이 사회에 미치는 영향과 전망",
                description: "인공지능 기술이 우리 사회에 가져올 변화와 미래 전망에 대해 분석합니다.",
                category: "기술/IT",
                date: "2025-06-07",
                tags: ["AI", "인공지능", "사회", "미래", "기술 영향", "윤리"],
                filename: "ai_future_social_impact.html",
                featured: true
            },
            {
                id: "android_version_security",
                title: "안드로이드 버전별 보안 이슈와 대응 방법",
                description: "안드로이드 OS의 각 버전별 보안 취약점과 사용자 대응 방법을 알아봅니다.",
                category: "보안",
                date: "2025-06-06",
                tags: ["안드로이드", "보안", "운영체제", "취약점", "대응방법"],
                filename: "android_version_security.html",
                featured: true
            },
            {
                id: "ceph_storage_intro",
                title: "Ceph 스토리지 시스템 개요: 기본 구조와 활용",
                description: "오픈소스 분산 스토리지 시스템인 Ceph의 구조와 활용 방법에 대한 소개입니다.",
                category: "기술/IT",
                date: "2025-06-02",
                tags: ["Ceph", "스토리지", "분산시스템", "오픈소스", "클라우드"],
                filename: "ceph_storage_intro.html",
                featured: true
            },
            {
                id: "healthy_diet_nutrition",
                title: "건강한 식단과 영양소 섭취 가이드",
                description: "균형 잡힌 식단 구성과 필수 영양소 섭취 방법에 대한 종합 가이드입니다.",
                category: "건강",
                date: "2025-05-25",
                tags: ["건강", "식단", "영양", "다이어트", "웰빙"],
                filename: "healthy_diet_nutrition.html",
                featured: true
            },
            {
                id: "squid_game_season3_analysis_complete",
                title: "'오징어 게임' 시즌 3 완벽 분석",
                description: "돌아온 거물급 시리즈, 무엇을 기대하고 주목해야 하는가?",
                category: "시사/연예",
                date: "2025-06-08",
                tags: ["오징어 게임", "넷플릭스", "시즌3", "분석", "리뷰"],
                filename: "squid_game_season3_analysis_complete.html",
                featured: true
            },
            {
                id: "korea_esg_corporate_trends",
                title: "한국 주요 기업의 ESG 경영 현황과 미래 전망",
                description: "대한민국 기업들의 환경, 사회, 지배구조 측면의 경영 현황을 분석합니다.",
                category: "시사/경제",
                date: "2025-06-05",
                tags: ["ESG", "기업경영", "지속가능성", "투자", "경제"],
                filename: "korea_esg_corporate_trends.html",
                featured: true
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
        
        const featuredPosts = posts.filter(post => post.featured === true);
        
        if (featuredPosts.length === 0) {
            featuredList.innerHTML = '<li>추천 글이 없습니다.</li>';
            return;
        }
        
        featuredList.innerHTML = '';
        featuredPosts.forEach(post => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = `posts/${post.id}.html`;
            link.textContent = post.title;
            li.appendChild(link);
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
                            <a href="./posts/${post.id}.html" class="related-post-link">
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
                
                // 최신 포스트 로드
                loadLatestPost();
                
                // 메타 정보 업데이트
                updateMetaInfo();
                
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
        
        // 최신 포스트 표시
        loadLatestPost();
    }
    
    // 최신 포스트 로드 함수
    async function loadLatestPost() {
        if (!markdownContent || posts.length === 0) {
            console.error('markdownContent 요소 또는 포스트 데이터가 없습니다.');
            return;
        }
        
        try {
            // 날짜 최신순으로 정렬
            const latestPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
            
            if (latestPosts.length === 0) {
                console.error('정렬된 포스트 목록이 비어 있습니다.');
                markdownContent.innerHTML = '<div class="welcome-message">아직 등록된 글이 없습니다.</div>';
                return;
            }
            
            console.log('최신 포스트:', latestPosts[0]);
            const latestPost = latestPosts[0];
            
            // 포스트 경로
            const postPath = `${postsDir}${latestPost.filename}`;
            console.log('포스트 경로:', postPath);
            
            // 포스트 HTML 가져오기
            const response = await fetch(postPath);
            
            if (!response.ok) {
                throw new Error(`포스트 로드 실패: HTTP 오류 ${response.status}`);
            }
            
            const html = await response.text();
            
            // HTML 파싱
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // 포스트 컨텐츠 추출
            const postContent = doc.querySelector('.post-content');
            if (!postContent) {
                console.error('포스트 컨텐츠를 찾을 수 없습니다. HTML 구조:', html.substring(0, 200));
                throw new Error('포스트 컨텐츠를 찾을 수 없습니다.');
            }
            
            // 내용 일부만 추출 (첫 3개 단락 또는 800자)
            let excerptContent = '';
            const paragraphs = postContent.querySelectorAll('p');
            console.log('찾은 단락 수:', paragraphs.length);
            
            // 최대 3개 단락 또는 800자까지만 표시
            let charCount = 0;
            const maxChars = 800;
            let usedParagraphs = 0;
            
            for (let i = 0; i < Math.min(3, paragraphs.length); i++) {
                const paragraphText = paragraphs[i].textContent;
                charCount += paragraphText.length;
                usedParagraphs++;
                excerptContent += paragraphs[i].outerHTML;
                
                if (charCount >= maxChars) break;
            }
            
            // 단락이 없는 경우 전체 내용 일부 표시
            if (paragraphs.length === 0) {
                excerptContent = postContent.innerHTML.substring(0, maxChars);
                if (excerptContent.length >= maxChars) {
                    excerptContent += '...';
                }
            }
            
            // 더보기 링크 추가
            const moreText = (usedParagraphs < paragraphs.length || charCount >= maxChars) ? 
                '<p class="read-more"><a href="./posts/' + latestPost.id + '.html">더 보기...</a></p>' : '';
            
            // 마크다운 컨텐츠 영역에 포스트 출력
            markdownContent.innerHTML = `
            <div class="latest-post">
                <h2>최신 글</h2>
                <article class="post post-preview">
                    <header class="post-header">
                        <h1 class="post-title"><a href="./posts/${latestPost.id}.html">${latestPost.title}</a></h1>
                        <div class="post-meta">
                            <span class="post-date"><i class="fas fa-calendar-alt"></i> ${formatDate(latestPost.date)}</span>
                            <span class="post-category"><i class="fas fa-folder"></i> ${latestPost.category}</span>
                        </div>
                    </header>
                    <div class="post-content">
                        ${excerptContent}
                        ${moreText}
                    </div>
                    <footer class="post-footer">
                        <div class="post-tags">
                            ${latestPost.tags && latestPost.tags.length > 0 ? latestPost.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('') : ''}
                        </div>
                        <div class="read-full">
                            <a href="./posts/${latestPost.id}.html" class="read-more-link">글 전체 보기</a>
                        </div>
                    </footer>
                </article>
                <div class="featured-posts">
                    <h3>추천 글</h3>
                    <ul id="featuredList">
                        <!-- 추천 글 목록이 여기에 동적으로 로드됨 -->
                        <li>추천 글을 불러오는 중...</li>
                    </ul>
                </div>
            </div>`;
            
            // featuredList 요소 다시 참조 (innerHTML이 변경되었으므로)
            window.featuredList = document.getElementById('featuredList');
            
            // 추천 글 목록 렌더링
            renderFeaturedPosts();
            
        } catch (error) {
            console.error('최신 포스트 로드 실패:', error);
            
            // 오류 시 기본 메시지 표시
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
            
            // featuredList 요소 다시 참조
            window.featuredList = document.getElementById('featuredList');
            
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
    
    // 공유 버튼 이벤트 설정 함수
    function setupShareButtons() {
        // 현재 페이지의 공유 버튼 설정
        updateSocialShareButtons(null);
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