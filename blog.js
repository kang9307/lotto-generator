/**
 * 기술 블로그 - HTML 파일 로더 및 렌더러
 * Copyright (c) 2025 braindetox.kr
 */

document.addEventListener('DOMContentLoaded', function() {
    initBlog();
});

// 전역 변수
let postList = null;
let markdownContent = null;
let totalPostsEl = null;
let featuredList = null;
let categorySelect = null;
    let posts = [];
    let currentPost = null;
let postsDir = './posts/';

// 디버그 로깅 함수
function debugLog(message) {
    if (false) { // 디버그 모드 끄기
        console.log(`[DEBUG] ${message}`);
    }
}

// 날짜 포맷팅 함수
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
}

// HTML 태그 제거 및 정리 함수
function cleanHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

// 파일명에서 카테고리 결정 함수
function determineCategoryFromFilename(id) {
    // 특정 파일에 대한 수동 카테고리 매핑
    const manualCategoryMap = {
        "sitemap_importance": "IT/기술",
        "robots_txt_guide": "IT/기술",
        "meta_tags_seo_guide": "IT/기술",
        "skt_usim_hacking_reauth_guide": "보안",
        "skt-usim-hacking-precautions": "보안",
        "javascript_basic": "프로그래밍",
        "php_language_guide_part1": "프로그래밍",
        "php_language_guide_part2": "프로그래밍",
        "php_language_guide_part3": "프로그래밍",
        "php_language_guide_part4": "프로그래밍",
        "php_language_guide_part5": "프로그래밍",
        "networking_basic": "네트워크",
        "linux_grep_awk": "IT/기술",
        "ceph_storage_intro": "IT/기술",
        "ceph_rados_crush_deep_dive": "IT/기술",
        "ai_future_jobs_career_skills": "IT/기술",
        "ai_future_social_impact": "IT/기술",
        "artificial_intelligence_intro": "IT/기술",
        "android_version_security": "보안",
        "korea_presidential_election_2025": "사회/경제",
        "korea_21st_president_inauguration": "사회/경제",
        "korea_economic_social_challenges_2025": "사회/경제",
        "korea_esg_corporate_trends": "사회/경제",
        "korea_ai_technology_future": "IT/기술",
        "jeonse_fraud_comprehensive_report": "사회/경제",
        "squid_game_season3_analysis_complete": "문화/엔터",
        "yeonggwang_population_trend": "사회/경제"
    };
    
    // 수동 매핑에 있으면 해당 카테고리 반환
    if (manualCategoryMap[id]) {
        return manualCategoryMap[id];
    }
    
    // 키워드 기반 카테고리 추정
    if (id.includes('ai') || id.includes('ceph') || id.includes('tech') || 
        id.includes('seo') || id.includes('sitemap') || id.includes('robots') ||
        id.includes('meta_tags') || id.includes('javascript') || id.includes('php')) {
        return "IT/기술";
    } else if (id.includes('security') || id.includes('hack') || id.includes('usim')) {
        return "보안";
    } else if (id.includes('health') || id.includes('diet') || id.includes('vitamin') || 
              id.includes('benefits') || id.includes('fatty') || id.includes('liver') ||
              id.includes('meditation') || id.includes('immune') || id.includes('tofu') ||
              id.includes('zinc') || id.includes('knee') || id.includes('udca') ||
              id.includes('anemia') || id.includes('insomnia') || id.includes('herbs')) {
        return "건강";
    } else if (id.includes('network')) {
        return "네트워크";
    } else if (id.includes('javascript') || id.includes('php') || id.includes('python')) {
        return "프로그래밍";
    } else if (id.includes('korea') || id.includes('economic') || id.includes('president') ||
              id.includes('jeonse') || id.includes('fraud') || id.includes('population')) {
        return "사회/경제";
    } else if (id.includes('game') || id.includes('squid') || id.includes('season')) {
        return "문화/엔터";
    }
    
    return "기타";
}

// 블로그 페이지 초기화
async function initBlog() {
    try {
        loadCommonElements();
        debugLog('블로그 페이지 초기화 시작');
        
        // 전역 요소 참조
        postList = document.getElementById('postList');
        markdownContent = document.getElementById('markdownContent');
        totalPostsEl = document.getElementById('totalPosts');
        featuredList = document.getElementById('featuredList');
        categorySelect = document.getElementById('categorySelect');
        
        // 카테고리 변경 이벤트 리스너
        if (categorySelect) {
            categorySelect.addEventListener('change', function(e) {
                const selectedCategory = e.target.value;
                renderPostList(selectedCategory);
            });
        }
        
        // 포스트 데이터 로드
        posts = await loadPostData();
        
        if (!posts || posts.length === 0) {
            debugLog('포스트 데이터가 없습니다.');
            if (postList) {
                postList.innerHTML = '<li class="post-item no-results">등록된 글이 없습니다.</li>';
            }
            if (totalPostsEl) {
                totalPostsEl.textContent = '0';
            }
            
            // 마지막 업데이트 시간 표시
            updateLastUpdatedTime();
            
                    return;
                }
                
        // 데이터 로드 완료 후 처리
        debugLog(`포스트 데이터 로드 완료: ${posts.length}개`);
        
        // 카테고리 옵션 채우기
        populateCategoryOptions();
        
        // 포스트 목록 렌더링
        renderPostList('all');
        
        // 최신 포스트 로드
        await loadLatestPost();
        
        // 마지막 업데이트 시간 표시
        updateLastUpdatedTime();
        
        console.log("블로그 초기화 완료!");
        
    } catch (error) {
        console.error('블로그 초기화 오류:', error);
        if (postList) {
            postList.innerHTML = '<li class="post-item error">오류가 발생했습니다. 나중에 다시 시도하세요.</li>';
        }
        if (totalPostsEl) {
            totalPostsEl.textContent = '0';
        }
        
        // 오류가 발생해도 마지막 업데이트 시간 표시
        updateLastUpdatedTime();
    }
}

// 포스트 데이터 로드 함수
async function loadPostData() {
    try {
        debugLog('포스트 데이터 로드 시작');
        
        // posts 디렉토리의 index.json 파일에서 실제 존재하는 파일 목록을 가져옵니다
        const response = await fetch('./posts/index.json');
                if (response.ok) {
            const data = await response.json();
            const files = data.files || [];
            
            // 실제 존재하는 파일만으로 포스트 데이터 생성
            const realPosts = [];
            
            // 파일 내용에서 제목과 카테고리를 추출하기 위한 프로미스 배열
            const filePromises = files.map(async (filename) => {
                // 파일명에서 ID 추출 (확장자 제거)
                const id = filename.replace('.html', '');
                
                try {
                    // HTML 파일에서 제목과 카테고리 추출 시도
                    const fileResponse = await fetch(`./posts/${filename}`);
                    if (fileResponse.ok) {
                        const html = await fileResponse.text();
                        
                        // HTML에서 제목 추출 (h1 태그 또는 title 태그)
                        let title = extractTitle(html) || formatTitle(id);
                        
                        // HTML에서 카테고리 추출 (meta 태그 또는 특정 클래스)
                        let category = extractCategory(html, id);
                        
                        // HTML에서 날짜 추출
                        let date = extractDate(html, filename);
                        
                        // 태그 추정 (파일명에서 유추)
                        const words = id.split('_');
                        const tags = words.filter(word => word.length > 2).slice(0, 3);
                        
                        // 추천 글 여부 (임의 선정)
                        const featured = Math.random() < 0.2; // 약 20% 확률로 추천 글로 지정
                        
                        // 포스트 객체 생성
                        return {
                            id: id,
                            title: title,
                            filename: filename,
                            date: date,
                            category: category,
                            tags: tags,
                            featured: featured
                        };
                                }
                            } catch (error) {
                                console.error(`파일 ${filename} 처리 중 오류:`, error);
                            }
                
                // 파일을 읽을 수 없는 경우 기본값 사용
                // 메타데이터 추출 (파일명에서 유추)
                const title = formatTitle(id);
                
                // 카테고리 추정 (파일명에서 유추)
                let category = determineCategoryFromFilename(id);
                
                // 파일명에서 날짜 추출 시도
                let date = extractDateFromFilename(filename);
                if (!date) {
                    // 랜덤 날짜 생성 (최근 30일 이내)
                    const randomDaysAgo = Math.floor(Math.random() * 30);
                    const dateObj = new Date();
                    dateObj.setDate(dateObj.getDate() - randomDaysAgo);
                    date = dateObj.toISOString().split('T')[0];
                }
                
                // 태그 추정 (파일명에서 유추)
                const words = id.split('_');
                const tags = words.filter(word => word.length > 2).slice(0, 3);
                
                // 추천 글 여부 (임의 선정)
                const featured = Math.random() < 0.2; // 약 20% 확률로 추천 글로 지정
                
                // 포스트 객체 생성
                return {
                    id: id,
                    title: title,
                    filename: filename,
                    date: date,
                    category: category,
                    tags: tags,
                    featured: featured
                };
            });
            
            // 모든 파일 처리 완료 대기
            const postsData = await Promise.all(filePromises);
            
            // 날짜 기준 내림차순 정렬 (최신 날짜가 먼저 오도록)
            postsData.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                // 유효한 날짜인지 확인
                const isValidDateA = !isNaN(dateA.getTime());
                const isValidDateB = !isNaN(dateB.getTime());
                
                // 둘 다 유효한 날짜면 비교
                if (isValidDateA && isValidDateB) {
                    return dateB - dateA;
                }
                // A만 유효하지 않으면 B가 먼저
                else if (!isValidDateA && isValidDateB) {
                    return 1;
                }
                // B만 유효하지 않으면 A가 먼저
                else if (isValidDateA && !isValidDateB) {
                    return -1;
                }
                // 둘 다 유효하지 않으면 원래 순서 유지
                return 0;
            });
            
            console.log(`실제 파일 기반 포스트 수: ${postsData.length}개 로드됨`);
            return postsData;
                    } else {
            console.error('index.json 파일을 로드할 수 없습니다.');
            return [];
                    }
            } catch (error) {
        console.error('포스트 데이터 로드 오류:', error);
                return [];
    }
}

// HTML에서 제목 추출 함수
function extractTitle(html) {
    // h1 태그에서 제목 추출 시도
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match && h1Match[1]) {
        return cleanHtml(h1Match[1]);
    }
    
    // title 태그에서 제목 추출 시도
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
        // 사이트 이름 등 불필요한 부분 제거
        let title = titleMatch[1].replace(/\s*\|.*$/, '').replace(/\s*-.*$/, '');
        return cleanHtml(title);
    }
    
    return null;
}

// HTML에서 카테고리 추출 함수
function extractCategory(html, id) {
    // meta 태그에서 카테고리 추출 시도
    const metaMatch = html.match(/<meta\s+name="category"\s+content="([^"]+)"/i);
    if (metaMatch && metaMatch[1]) {
        return metaMatch[1];
    }
    
    // 특정 클래스나 ID를 가진 요소에서 카테고리 추출 시도
    const categoryClassMatch = html.match(/<span\s+class="post-category[^"]*"[^>]*>(.*?)<\/span>/i);
    if (categoryClassMatch && categoryClassMatch[1]) {
        return cleanHtml(categoryClassMatch[1]);
    }
    
    // 카테고리 클래스 내용 추출 시도
    const categoryDivMatch = html.match(/<div[^>]*class="[^"]*post-meta[^"]*"[^>]*>.*?<span[^>]*class="[^"]*post-category[^"]*"[^>]*>.*?<i[^>]*><\/i>\s*(.*?)\s*<\/span>/i);
    if (categoryDivMatch && categoryDivMatch[1]) {
        return cleanHtml(categoryDivMatch[1]);
    }
    
    // 특정 키워드 기반 카테고리 추정
    return determineCategoryFromFilename(id);
}

// HTML에서 날짜 추출 함수
function extractDate(html, filename) {
    // meta 태그에서 날짜 추출 시도
    const metaMatch = html.match(/<meta\s+name="date"\s+content="([^"]+)"/i) || 
                      html.match(/<meta\s+property="article:published_time"\s+content="([^"]+)"/i);
    if (metaMatch && metaMatch[1]) {
        return metaMatch[1].split('T')[0]; // ISO 형식에서 날짜 부분만 추출
    }
    
    // 날짜 클래스를 가진 요소에서 추출 시도
    const dateClassMatch = html.match(/<span\s+class="post-date[^"]*"[^>]*>(.*?)<\/span>/i);
    if (dateClassMatch && dateClassMatch[1]) {
        const dateText = cleanHtml(dateClassMatch[1]);
        // "2025년 06월 12일" 형식의 날짜를 ISO 형식으로 변환
        const dateMatch = dateText.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
        if (dateMatch) {
            const year = dateMatch[1];
            const month = String(dateMatch[2]).padStart(2, '0');
            const day = String(dateMatch[3]).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    }
    
    // 파일명에서 날짜 추출 시도 (예: 2023-05-15-post-title.html)
    const filenameMatch = filename.match(/^(\d{4}-\d{2}-\d{2})-/);
    if (filenameMatch) {
        return filenameMatch[1];
    }
    
    // 기본값: 현재 날짜에서 랜덤하게 30일 이내의 날짜 생성
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - randomDaysAgo);
    return date.toISOString().split('T')[0];
}

// 파일명을 제목 형식으로 변환
function formatTitle(id) {
    return id.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    }
    
    // 포스트 목록 렌더링
    function renderPostList(filterCategory = 'all') {
    console.log(`포스트 목록 렌더링 시작 (카테고리: ${filterCategory})`);
    
    if (!postList) {
        console.error("포스트 목록 요소가 없습니다.");
        return;
    }
        
        // 포스트 목록 비우기
        postList.innerHTML = '';
        
        // 카테고리 필터링
        let filteredPosts = posts;
        if (filterCategory !== 'all') {
            filteredPosts = posts.filter(post => post.category === filterCategory);
        console.log(`카테고리 '${filterCategory}'로 필터링: ${filteredPosts.length}개 포스트`);
        }
        
        // 날짜 최신순으로 정렬
        filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 결과가 없는 경우
        if (filteredPosts.length === 0) {
            postList.innerHTML = '<li class="post-item no-results">검색 결과가 없습니다.</li>';
        if (totalPostsEl) {
            totalPostsEl.textContent = '0';
        }
            return;
        }
    
    // 모든 게시글 표시
    const displayPosts = filteredPosts;
    console.log(`표시할 포스트 수: ${displayPosts.length}개`);
        
        // 포스트 항목을 목록에 추가
    displayPosts.forEach(post => {
            const listItem = document.createElement('li');
            listItem.className = 'post-item';
            listItem.setAttribute('data-id', post.id);
            
            const postLink = document.createElement('a');
        postLink.href = `posts/${post.id}.html`;
            postLink.textContent = post.title;
            
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
        totalPostsEl.textContent = filteredPosts.length;
    }
    
    console.log("포스트 목록 렌더링 완료");
}

// 마지막 업데이트 시간 표시 함수
function updateLastUpdatedTime() {
    const lastUpdatedEl = document.getElementById('lastUpdated');
    if (lastUpdatedEl) {
        const now = new Date();
        const formattedDate = `${now.getFullYear()}년 ${String(now.getMonth() + 1).padStart(2, '0')}월 ${String(now.getDate()).padStart(2, '0')}일 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        lastUpdatedEl.textContent = formattedDate;
    }
}

// 카테고리 옵션 채우기 함수
function populateCategoryOptions() {
    if (!categorySelect || !posts || posts.length === 0) {
        console.error("카테고리 선택 요소 또는 포스트 데이터가 없습니다.");
            return;
        }
        
    try {
        console.log("카테고리 옵션 채우기 시작");
        
        // 기존 옵션 비우기
        categorySelect.innerHTML = '';
        
        // 전체 글 옵션 추가
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = '전체 글';
        categorySelect.appendChild(allOption);
        
        // 포스트에서 고유한 카테고리 추출
        const uniqueCategories = [];
        posts.forEach(post => {
            if (post.category && !uniqueCategories.includes(post.category)) {
                uniqueCategories.push(post.category);
            }
        });
        
        // 카테고리 정렬
        uniqueCategories.sort();
        
        console.log(`추출된 카테고리 (${uniqueCategories.length}개):`, uniqueCategories);
        
        // 카테고리별로 옵션 추가
        uniqueCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
        
        console.log("카테고리 옵션 채우기 완료");
        
        // 카테고리 변경 이벤트 리스너 다시 추가
        if (categorySelect) {
            categorySelect.addEventListener('change', function(e) {
                const selectedCategory = e.target.value;
                renderPostList(selectedCategory);
            });
        }
    } catch (error) {
        console.error('카테고리 옵션 채우기 오류:', error);
    }
}

// 최신 포스트 로드 함수
async function loadLatestPost() {
    if (!markdownContent) {
        console.error('markdownContent 요소가 없습니다.');
        return;
    }
    
    if (!posts || posts.length === 0) {
        console.error('포스트 데이터가 없습니다.');
        markdownContent.innerHTML = '<div class="welcome-message"><h2>기술 블로그에 오신 것을 환영합니다</h2><p>아직 등록된 글이 없습니다.</p></div>';
                return;
            }
            
    try {
        // 날짜 최신순으로 정렬
        const latestPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (latestPosts.length === 0) {
            console.error('정렬된 포스트 목록이 비어 있습니다.');
            markdownContent.innerHTML = '<div class="welcome-message"><h2>기술 블로그에 오신 것을 환영합니다</h2><p>아직 등록된 글이 없습니다.</p></div>';
            return;
        }
        
        const latestPost = latestPosts[0];
        console.log('최신 포스트:', latestPost);
        
        // 최근 3주 이내 최신 글 필터링
        const threeWeeksAgo = new Date();
        threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21); // 3주 = 21일
        
        // 3주 이내의 글 필터링
        const recentPosts = latestPosts.filter(post => new Date(post.date) >= threeWeeksAgo);
        console.log(`최근 3주 이내 글 수: ${recentPosts.length}개`);
        
        // 추천 글 필터링
        const featuredPosts = latestPosts.filter(post => post.featured === true).slice(0, 8);
        console.log(`추천 글 수: ${featuredPosts.length}개`);
        
        // 최신 포스트 미리보기 컨텐츠 생성
        const excerptContent = `
            <p>이 글에서는 ${latestPost.title}에 대한 핵심 내용을 살펴봅니다.</p>
            <p>이는 ${latestPost.category} 카테고리에 속하는 글로, 해당 주제에 관심 있는 독자들에게 유용한 정보를 제공합니다.</p>
        `;
        
        // 태그 HTML 생성
        let tagsHtml = '';
        if (latestPost.tags && latestPost.tags.length > 0) {
            tagsHtml = latestPost.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('');
        }
        
        // 최근 글 목록 HTML 생성
        let recentPostsHtml = '';
        if (recentPosts.length > 1) {
            // 최신 글을 제외한 나머지 최근 글 목록 (최대 5개)
            const otherRecentPosts = recentPosts.slice(1, 6);
            if (otherRecentPosts.length > 0) {
                recentPostsHtml = `
                <div class="recent-posts">
                    <h3>최근 글</h3>
                    <ul class="recent-posts-list">
                        ${otherRecentPosts.map(post => 
                            `<li class="recent-post-item">
                                <a href="./posts/${post.id}.html">${post.title}</a>
                                <span class="post-date">${formatDate(post.date)}</span>
                            </li>`
                        ).join('')}
                    </ul>
                </div>`;
            }
        }
        
        // 추천 글 목록 HTML 생성
        let featuredPostsHtml = '';
        if (featuredPosts.length > 0) {
            featuredPostsHtml = `
            <div class="featured-posts" style="border-left: 4px solid #e74c3c;">
                <h3>추천 글</h3>
                <ul class="recent-posts-list">
                    ${featuredPosts.map(post => 
                        `<li class="recent-post-item">
                            <a href="./posts/${post.id}.html">${post.title}</a>
                            <span class="post-date">${formatDate(post.date)}</span>
                        </li>`
                    ).join('')}
                </ul>
            </div>`;
        }
        
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
                    <p class="read-more"><a href="./posts/${latestPost.id}.html">더 보기...</a></p>
                </div>
                <footer class="post-footer">
                    <div class="post-tags">
                        ${tagsHtml}
                    </div>
                    <div class="read-full">
                        <a href="./posts/${latestPost.id}.html" class="read-more-link">글 전체 보기</a>
                    </div>
                </footer>
            </article>
            ${recentPostsHtml}
            ${featuredPostsHtml}
                    </div>`;
            
        } catch (error) {
        console.error('최신 포스트 로드 실패:', error);
        
        // 오류 시 기본 메시지 표시
            markdownContent.innerHTML = `
        <div class="welcome-message">
            <h2>기술 블로그에 오신 것을 환영합니다</h2>
            <p>왼쪽 목록에서 관심있는 글을 선택하세요.</p>
                </div>`;
        }
    }
    
// 파일명에서 날짜 추출 함수
function extractDateFromFilename(filename) {
    // YYYY-MM-DD 형식의 날짜 추출
    const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
        return dateMatch[1];
    }
    
    // YYYYMMDD 형식의 날짜 추출
    const dateMatch2 = filename.match(/^(\d{4})(\d{2})(\d{2})/);
    if (dateMatch2) {
        return `${dateMatch2[1]}-${dateMatch2[2]}-${dateMatch2[3]}`;
    }
    
    return null;
}

// 공통 요소 로드
function loadCommonElements() {
    // 헤더와 푸터 로드
    const headerContainer = document.getElementById('root-header');
    const footerContainer = document.getElementById('root-footer');
    
    if (headerContainer) {
        fetch('./components/root-header.html')
            .then(response => response.text())
            .then(html => {
                headerContainer.innerHTML = html;
            })
            .catch(error => {
                console.error('헤더 로드 실패:', error);
            });
    }
    
    if (footerContainer) {
        fetch('./components/root-footer.html')
            .then(response => response.text())
            .then(html => {
                footerContainer.innerHTML = html;
            })
            .catch(error => {
                console.error('푸터 로드 실패:', error);
            });
    }
} 