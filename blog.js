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
            categorySelect.addEventListener('change', (e) => {
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
        
        // 정적 데이터로 대체 (실제 구현에서는 서버에서 가져올 수 있음)
        return getStaticPostData();
        
    } catch (error) {
        console.error('포스트 데이터 로드 오류:', error);
        return [];
    }
}

// 정적 포스트 데이터 생성
function getStaticPostData() {
    // 샘플 데이터: 실제 구현에서는 서버에서 받아오거나 별도 파일로 관리
    
    // 샘플 포스트 목록 (10개로 제한)
    const knownFiles = [
        'ai_future_jobs_career_skills.html',
        'ai_future_social_impact.html', 
        'android_version_security.html',
        'anemia_breathlessness.html',
        'artificial_intelligence_intro.html',
        'ceph_rados_crush_deep_dive.html',
        'ceph_storage_intro.html',
        'cheonggukjang_benefits.html',
        'coffee_fatty_liver.html',
        'dash_diet_guide.html'
    ];
    
    // 제목 매핑 테이블
    const titleMap = {
        "ai_future_jobs_career_skills": "AI 시대의 직업과 필요한 역량",
        "ai_future_social_impact": "인공지능이 가져올 사회적 영향",
        "android_version_security": "안드로이드 버전별 보안 이슈",
        "anemia_breathlessness": "빈혈과 호흡곤란의 관계",
        "artificial_intelligence_intro": "인공지능 기초 개념 소개",
        "ceph_rados_crush_deep_dive": "Ceph RADOS/CRUSH 심층 분석",
        "ceph_storage_intro": "Ceph 스토리지 소개",
        "cheonggukjang_benefits": "청국장의 건강상 이점",
        "coffee_fatty_liver": "커피와 지방간의 관계",
        "dash_diet_guide": "DASH 다이어트 가이드"
    };
    
    // 카테고리 매핑 테이블
    const categoryMap = {
        "ai_future_jobs_career_skills": "IT/기술",
        "ai_future_social_impact": "IT/기술",
        "android_version_security": "보안",
        "anemia_breathlessness": "건강",
        "artificial_intelligence_intro": "IT/기술",
        "ceph_rados_crush_deep_dive": "IT/기술",
        "ceph_storage_intro": "IT/기술",
        "cheonggukjang_benefits": "건강",
        "coffee_fatty_liver": "건강",
        "dash_diet_guide": "건강"
    };
    
    const allPosts = [];
    
    // 샘플 포스트 생성 (최대 10개)
    for (let i = 0; i < knownFiles.length; i++) {
        const filename = knownFiles[i];
        const id = filename.replace('.html', '');
        
        let title = titleMap[id] || id.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        // 날짜 - 현재부터 최대 10일 전까지 랜덤하게 생성
        const daysAgo = Math.floor(Math.random() * 10);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        
        allPosts.push({
            id: id,
            title: title,
            filename: filename,
            date: date.toISOString().split('T')[0],
            category: categoryMap[id] || "기타",
            tags: ["태그1", "태그2"],
            featured: i < 5  // 5개만 추천 글로 설정
        });
    }
    
    // 날짜 기준 내림차순 정렬
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    debugLog(`정적 데이터로 포스트 수: ${allPosts.length}개 로드됨`);
    
    return allPosts;
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
    
    // 최대 10개만 표시하도록 제한
    const displayPosts = filteredPosts.slice(0, 10);
    
    // 포스트 항목을 목록에 추가
    displayPosts.forEach(post => {
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
        totalPostsEl.textContent = filteredPosts.length;
    }
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
    if (!categorySelect || !posts || posts.length === 0) return;
    
    // 기존 옵션 유지 (전체 글 옵션은 유지)
    const allOption = categorySelect.querySelector('option[value="all"]');
    categorySelect.innerHTML = '';
    categorySelect.appendChild(allOption);
    
    // 포스트에서 고유한 카테고리 추출
    const categories = [...new Set(posts.map(post => post.category))];
    
    // 카테고리별로 옵션 추가
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// 추천 글 목록 렌더링
function renderFeaturedPosts() {
    if (!featuredList) {
        debugLog('featuredList 요소가 없습니다');
        // featuredList 요소가 없으면 찾아서 설정
        featuredList = document.getElementById('featuredList');
        if (!featuredList) {
            debugLog('featuredList 요소를 찾을 수 없습니다');
            return;
        }
    }
    
    // 포스트가 없는 경우 처리
    if (!posts || posts.length === 0) {
        debugLog('렌더링할 포스트가 없습니다');
        featuredList.innerHTML = '<div class="featured-card no-posts">추천 글이 없습니다.</div>';
        return;
    }
    
    const featuredPosts = posts.filter(post => post.featured === true);
    
    if (featuredPosts.length === 0) {
        debugLog('추천 글이 없습니다');
        featuredList.innerHTML = '<div class="featured-card no-posts">추천 글이 없습니다.</div>';
        return;
    }
    
    debugLog(`추천 글 수: ${featuredPosts.length}개`);
    
    // 최대 5개까지만 표시
    const postsToShow = featuredPosts.slice(0, 5);
    
    // 카드 디자인으로 변경
    featuredList.innerHTML = '';
    featuredList.className = 'featured-cards-container';
    
    postsToShow.forEach(post => {
        const card = document.createElement('div');
        card.className = 'featured-card';
        
        const cardTitle = document.createElement('h4');
        cardTitle.className = 'card-title';
        
        const cardLink = document.createElement('a');
        cardLink.href = `posts/${post.id}.html`;
        cardLink.textContent = post.title;
        
        // 클릭 이벤트 추가 (정적 페이지로 직접 이동)
        cardLink.onclick = function(e) {
            e.preventDefault();
            window.location.href = cardLink.href;
        };
        
        cardTitle.appendChild(cardLink);
        
        const cardMeta = document.createElement('div');
        cardMeta.className = 'card-meta';
        
        const cardDate = document.createElement('span');
        cardDate.className = 'card-date';
        cardDate.innerHTML = `<i class="fas fa-calendar-alt"></i> ${formatDate(post.date)}`;
        
        const cardCategory = document.createElement('span');
        cardCategory.className = 'card-category';
        cardCategory.innerHTML = `<i class="fas fa-folder"></i> ${post.category}`;
        
        cardMeta.appendChild(cardDate);
        cardMeta.appendChild(cardCategory);
        
        card.appendChild(cardTitle);
        card.appendChild(cardMeta);
        
        featuredList.appendChild(card);
    });
    
    debugLog('추천 글 렌더링 완료');
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
        
        console.log('최신 포스트:', latestPosts[0]);
        const latestPost = latestPosts[0];
        
        // 최신 포스트 미리보기 컨텐츠 생성
        const excerptContent = `
            <p>이 글에서는 ${latestPost.title}에 대한 핵심 내용을 살펴봅니다.</p>
            <p>이는 ${latestPost.category} 카테고리에 속하는 글로, 해당 주제에 관심 있는 독자들에게 유용한 정보를 제공합니다.</p>
        `;
        
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
                        ${latestPost.tags && latestPost.tags.length > 0 ? latestPost.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('') : ''}
                    </div>
                    <div class="read-full">
                        <a href="./posts/${latestPost.id}.html" class="read-more-link">글 전체 보기</a>
                    </div>
                </footer>
            </article>
            <div class="featured-posts">
                <h3>추천 글</h3>
                <div id="featuredList" class="featured-cards-container">
                    <!-- 추천 글 목록이 여기에 동적으로 로드됨 -->
                    <div class="featured-card loading">추천 글을 불러오는 중...</div>
                </div>
            </div>
        </div>`;
        
        // featuredList 요소 다시 참조 (innerHTML이 변경되었으므로)
        featuredList = document.getElementById('featuredList');
        
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
                <div id="featuredList" class="featured-cards-container">
                    <!-- 추천 글 목록이 여기에 동적으로 로드됨 -->
                    <div class="featured-card loading">추천 글을 불러오는 중...</div>
                </div>
            </div>
        </div>`;
        
        // featuredList 요소 다시 참조
        featuredList = document.getElementById('featuredList');
        
        // 추천 글 목록 렌더링
        renderFeaturedPosts();
    }
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