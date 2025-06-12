/**
 * 동적 헤더와 푸터 로딩을 위한 JavaScript
 * Copyright (c) 2025 braindetox.kr
 */

document.addEventListener('DOMContentLoaded', function() {
    // 환경 감지 (로컬 파일 시스템인지 웹 서버인지)
    const isLocalFileSystem = window.location.protocol === 'file:';
    
    // 로컬 파일 시스템에서 현재 실제 경로 구하기 (Windows와 다른 OS 호환)
    const currentPath = window.location.pathname;
    const projectRoot = getProjectRoot(currentPath);
    
    // 현재 경로 감지 (루트 디렉토리인지 하위 디렉토리인지)
    // 경로 감지 수정 - 보다 정확한 경로 감지를 위해 정규식 개선
    const pathName = window.location.pathname;
    const isSubDirectory = pathName.includes('/posts/') || 
                           pathName.match(/\/[^\/]+\/[^\/]+\.html$/) ||
                           pathName.includes('post_');
    
    // 컴포넌트 경로 결정
    const headerFile = isSubDirectory ? 'components/header.html' : 'components/root-header.html';
    const footerFile = isSubDirectory ? 'components/footer.html' : 'components/root-footer.html';
    
    // 컴포넌트 기본 경로
    const componentsBasePath = isSubDirectory ? '../' : '';
    
    // 로컬 파일 시스템 경로 추출 함수
    function getProjectRoot(path) {
        // 로컬 파일 시스템이 아닌 경우 빈 문자열 반환
        if (!isLocalFileSystem) return '';
        
        try {
            // Windows 경로와 Unix 경로 모두 처리
            let normalizedPath = path.replace(/\\/g, '/');
            
            // 주소에 포함된 특수 문자 처리 (%3A 등)
            try {
                normalizedPath = decodeURIComponent(normalizedPath);
            } catch (e) {
                console.error('경로 디코딩 오류:', e);
            }
            
            // 프로젝트 폴더명 (수정 가능)
            const projectFolderName = 'lotto-generator';
            
            // 프로젝트 폴더 찾기
            const projectFolderIndex = normalizedPath.toLowerCase().indexOf(projectFolderName.toLowerCase());
            
            // 프로젝트 폴더가 경로에 있으면 해당 경로 반환
            if (projectFolderIndex !== -1) {
                return normalizedPath.substring(0, projectFolderIndex + projectFolderName.length + 1);
            }
            
            // 파일 이름 제거 (폴더 경로만 추출)
            const lastSlashIndex = normalizedPath.lastIndexOf('/');
            if (lastSlashIndex === -1) return '';
            
            let folderPath = normalizedPath.substring(0, lastSlashIndex + 1);
            
            // 서브디렉토리인 경우 상위 폴더로 이동
            if (isSubDirectory) {
                const parentSlashIndex = folderPath.substring(0, folderPath.length - 1).lastIndexOf('/');
                if (parentSlashIndex !== -1) {
                    folderPath = folderPath.substring(0, parentSlashIndex + 1);
                }
            }
            
            return folderPath;
        } catch (error) {
            console.error('프로젝트 루트 경로 추출 오류:', error);
            return '';
        }
    }
    
    // 초기화 - 헤더와 푸터 로드
    loadComponents();
    
    // 헤더와 푸터 로드 함수
    function loadComponents() {
        if (isLocalFileSystem) {
            // 로컬 파일 시스템에서는 하드코딩된 HTML 사용
            loadHardcodedComponents();
        } else {
            // 웹 서버 환경에서는 fetch API 사용
            loadDynamicComponents();
        }
    }
    
    // 하드코딩된 헤더와 푸터 로드 (로컬 파일 시스템용)
    function loadHardcodedComponents() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        const footerPlaceholder = document.getElementById('footer-placeholder');
        
        if (headerPlaceholder) {
            // 현재 경로에 맞는 헤더 선택
            if (isSubDirectory) {
                // 하위 디렉토리용 헤더
                headerPlaceholder.innerHTML = `
                <header class="main-header">
                    <div class="header-container">
                        <h1 class="site-title" style="text-align: center; margin-bottom: 8px;"><a href="${projectRoot}index.html" style="color: inherit; text-decoration: none; font-weight: 900 !important;">BrainDetox Utility Box</a></h1>
                        <nav class="main-nav" style="margin-top: 5px;">
                            <ul class="nav-list" style="gap: 10px; display: flex; justify-content: center; flex-wrap: wrap;">
                                <li class="nav-item">
                                    <a href="${projectRoot}index.html" class="nav-link">홈</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}blog.html" class="nav-link">기술 블로그</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}lotto.html" class="nav-link">로또 번호 생성기</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}subnet.html" class="nav-link">서브넷 계산기</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}password.html" class="nav-link">비밀번호 생성기</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}qrcode.html" class="nav-link">QR 코드 생성기</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}datetime.html" class="nav-link">시간/날짜 계산기</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </header>`;
            } else {
                // 루트 디렉토리용 헤더
                headerPlaceholder.innerHTML = `
                <header class="main-header">
                    <div class="header-container">
                        <h1 class="site-title" style="text-align: center; margin-bottom: 8px;"><a href="${projectRoot}index.html" style="color: inherit; text-decoration: none; font-weight: 900 !important;">BrainDetox Utility Box</a></h1>
                        <nav class="main-nav" style="margin-top: 5px;">
                            <ul class="nav-list" style="gap: 10px; display: flex; justify-content: center; flex-wrap: wrap;">
                                <li class="nav-item">
                                    <a href="${projectRoot}index.html" class="nav-link">홈</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}blog.html" class="nav-link">기술 블로그</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}lotto.html" class="nav-link">로또 번호 생성기</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}subnet.html" class="nav-link">서브넷 계산기</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}password.html" class="nav-link">비밀번호 생성기</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}qrcode.html" class="nav-link">QR 코드 생성기</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}datetime.html" class="nav-link">시간/날짜 계산기</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </header>`;
            }
        }
        
        if (footerPlaceholder) {
            // 현재 경로에 맞는 푸터 선택
            if (isSubDirectory) {
                // 하위 디렉토리용 푸터
                footerPlaceholder.innerHTML = `
                <footer class="main-footer">
                    <div class="footer-container">
                        <p class="footer-text">
                            &copy; 2025 BrainDetox Utility Box. 모든 권리 보유.
                        </p>
                        <p class="footer-text">
                            사이트 내 모든 도구는 무료로 제공되며, 문의사항은 이메일(<a href="mailto:jhtoka@gmail.com" class="footer-link">jhtoka@gmail.com</a>)로 연락 바랍니다.
                        </p>
                        <p class="footer-text">
                            <a href="${projectRoot}privacy.html" class="footer-link">개인정보 처리방침</a> | <a href="${projectRoot}privacy.html" class="footer-link">Privacy Policy</a>
                        </p>
                    </div>
                </footer>`;
            } else {
                // 루트 디렉토리용 푸터
                footerPlaceholder.innerHTML = `
                <footer class="main-footer">
                    <div class="footer-container">
                        <p class="footer-text">
                            &copy; 2025 BrainDetox Utility Box. 모든 권리 보유.
                        </p>
                        <p class="footer-text">
                            사이트 내 모든 도구는 무료로 제공되며, 문의사항은 이메일(<a href="mailto:jhtoka@gmail.com" class="footer-link">jhtoka@gmail.com</a>)로 연락 바랍니다.
                        </p>
                        <p class="footer-text">
                            <a href="${projectRoot}privacy.html" class="footer-link">개인정보 처리방침</a> | <a href="${projectRoot}privacy.html" class="footer-link">Privacy Policy</a>
                        </p>
                    </div>
                </footer>`;
            }
        }
        
        // 현재 페이지에 맞는 메뉴 활성화
        setupActiveMenu();
    }
    
    // 동적 헤더와 푸터 로드 (웹 서버용)
    function loadDynamicComponents() {
        // 헤더 로드
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            fetch(`${componentsBasePath}${headerFile}`)
                .then(response => response.text())
                .then(data => {
                    headerPlaceholder.innerHTML = data;
                    setupActiveMenu();
                })
                .catch(error => {
                    console.error('헤더를 로드하는 중 오류가 발생했습니다:', error);
                    headerPlaceholder.innerHTML = '<p>헤더를 로드할 수 없습니다.</p>';
                });
        }
        
        // 푸터 로드
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            fetch(`${componentsBasePath}${footerFile}`)
                .then(response => response.text())
                .then(data => {
                    footerPlaceholder.innerHTML = data;
                })
                .catch(error => {
                    console.error('푸터를 로드하는 중 오류가 발생했습니다:', error);
                    footerPlaceholder.innerHTML = '<p>푸터를 로드할 수 없습니다.</p>';
                });
        }
    }
    
    // 현재 페이지에 맞는 메뉴 활성화
    function setupActiveMenu() {
        // 현재 페이지 경로 추출
        let currentPage = '';
        
        if (isLocalFileSystem) {
            // 로컬 파일 시스템에서는 전체 경로에서 파일명만 추출
            const pathParts = window.location.pathname.replace(/\\/g, '/').split('/');
            currentPage = pathParts[pathParts.length - 1] || 'index.html';
            
            // 디버깅
            console.log('현재 활성화할 페이지(로컬):', currentPage);
        } else {
            // 웹 서버에서는 URL 경로의 마지막 부분만 사용
            currentPage = window.location.pathname.split('/').pop() || 'index.html';
            console.log('현재 활성화할 페이지(웹):', currentPage);
        }
        
        const menuLinks = document.querySelectorAll('.nav-link');
        
        menuLinks.forEach(link => {
            // 링크 URL 파싱
            const linkUrl = link.getAttribute('href');
            let linkPage = '';
            
            // 파일명 추출 - 경로에서 마지막 부분만 가져옴
            if (linkUrl.includes('/')) {
                linkPage = linkUrl.split('/').pop();
            } else {
                linkPage = linkUrl;
            }
            
            // 현재 페이지와 링크 페이지 비교
            if (linkPage === currentPage) {
                link.classList.add('active');
                console.log('메뉴 활성화:', linkPage);
            }
            
            // 블로그 포스트 페이지 특별 처리
            if ((currentPage.startsWith('post_') || window.location.pathname.includes('/posts/')) && 
                linkUrl.includes('blog.html')) {
                link.classList.add('active');
                console.log('블로그 메뉴 활성화');
            }
        });
    }
    
    // 모바일 환경에서 탭 레이아웃 최적화 함수
    function optimizeTabsForMobile() {
        const tabsContainers = document.querySelectorAll('.tabs');
        if (tabsContainers.length > 0) {
            // 모바일 환경에서 탭 최적화
            const isMobile = window.innerWidth <= 768;
            tabsContainers.forEach(tabsContainer => {
                if (isMobile) {
                    // 모바일 최적화 스타일
                    tabsContainer.style.justifyContent = 'center';
                    tabsContainer.style.display = 'flex';
                    tabsContainer.style.flexWrap = 'wrap';
                    tabsContainer.style.gap = '5px';
                    tabsContainer.style.overflowX = 'visible';
                    
                    // 각 탭에 대한 스타일 적용
                    const tabs = tabsContainer.querySelectorAll('.tab');
                    tabs.forEach(tab => {
                        tab.style.flex = '1 0 auto';
                        tab.style.minWidth = '80px';
                        tab.style.maxWidth = 'none';
                    });
                }
            });
        }
    }
    
    // 페이지 로드 시와 리사이즈 시 최적화 적용
    optimizeTabsForMobile();
    window.addEventListener('resize', optimizeTabsForMobile);
    
    // 메뉴 추가 시 자동 업데이트 기능 지원
    // 메뉴 변경 감지 및 모든 페이지에 반영하는 기능
    window.updateMenuItems = function(newItems) {
        if (!newItems || !Array.isArray(newItems)) return;
        
        // 로컬 스토리지에 메뉴 항목 저장
        localStorage.setItem('customMenuItems', JSON.stringify(newItems));
        
        // 현재 페이지에 반영
        updateCurrentPageMenu(newItems);
    };
    
    // 현재 페이지 메뉴 업데이트
    function updateCurrentPageMenu(menuItems) {
        if (!menuItems || !Array.isArray(menuItems)) return;
        
        const navLists = document.querySelectorAll('.nav-list');
        navLists.forEach(navList => {
            // 기존 메뉴 항목 유지 (홈, 기술 블로그는 항상 고정)
            const homeItem = navList.querySelector('.nav-item:nth-child(1)');
            const blogItem = navList.querySelector('.nav-item:nth-child(2)');
            
            // 새 메뉴 구성
            navList.innerHTML = '';
            if (homeItem) navList.appendChild(homeItem);
            if (blogItem) navList.appendChild(blogItem);
            
            // 새 메뉴 항목 추가
            menuItems.forEach(item => {
                const li = document.createElement('li');
                li.className = 'nav-item';
                
                const a = document.createElement('a');
                a.className = 'nav-link';
                a.href = isSubDirectory ? `../${item.url}` : item.url;
                a.textContent = item.title;
                
                li.appendChild(a);
                navList.appendChild(li);
            });
        });
        
        // 활성 메뉴 업데이트
        setupActiveMenu();
    }
    
    // 로컬 스토리지에 저장된 메뉴 항목 로드
    const savedMenuItems = localStorage.getItem('customMenuItems');
    if (savedMenuItems) {
        try {
            const menuItems = JSON.parse(savedMenuItems);
            updateCurrentPageMenu(menuItems);
        } catch (e) {
            console.error('메뉴 항목 파싱 오류:', e);
        }
    }
}); 