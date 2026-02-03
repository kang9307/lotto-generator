/**
 * 동적 헤더와 푸터 로딩 및 다국어(i18n) 지원을 위한 JavaScript
 * Copyright (c) 2025 braindetox.kr
 */

// 다국어 지원 시스템 (i18n)
const i18n = {
    currentLang: 'ko',
    translations: {},
    supportedLangs: ['ko', 'en', 'ja', 'zh'],
    langNames: {
        ko: '한국어',
        en: 'English',
        ja: '日本語',
        zh: '中文'
    },

    // URL 경로에서 현재 언어 감지
    detectLanguage() {
        const path = window.location.pathname;
        if (path.startsWith('/en/') || path.includes('/en/')) return 'en';
        if (path.startsWith('/ja/') || path.includes('/ja/')) return 'ja';
        if (path.startsWith('/zh/') || path.includes('/zh/')) return 'zh';
        return 'ko';
    },

    // 기본 경로 계산 (언어 폴더 고려)
    getBasePath() {
        const path = window.location.pathname;
        const lang = this.detectLanguage();

        // 웹 서버 환경
        if (window.location.protocol !== 'file:') {
            if (lang !== 'ko') {
                // /en/, /ja/, /zh/ 폴더에서는 상위로
                if (path.includes('/posts/')) {
                    return `../../`;
                }
                return '../';
            } else {
                if (path.includes('/posts/')) {
                    return '../';
                }
                return '';
            }
        }
        return '';
    },

    // 번역 JSON 로딩
    async loadTranslations(lang) {
        try {
            const basePath = this.getBasePath();
            const response = await fetch(`${basePath}i18n/${lang}.json`);
            if (!response.ok) throw new Error('Translation file not found');
            this.translations = await response.json();
            this.currentLang = lang;
            return true;
        } catch (error) {
            console.error('번역 파일 로딩 실패:', error);
            // 기본 한국어 로드 시도
            if (lang !== 'ko') {
                return this.loadTranslations('ko');
            }
            return false;
        }
    },

    // 키로 번역 텍스트 가져오기 (예: 'navigation.home')
    t(key, fallback = '') {
        const keys = key.split('.');
        let value = this.translations;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return fallback || key;
            }
        }

        return value || fallback || key;
    },

    // 현재 페이지의 다른 언어 버전 URL 생성
    getAlternateUrl(targetLang) {
        const path = window.location.pathname;
        const currentLang = this.detectLanguage();
        let pagePath = path;

        // 현재 언어 경로 제거
        if (currentLang !== 'ko') {
            pagePath = path.replace(new RegExp(`^/${currentLang}/`), '/');
        }

        // 타겟 언어 경로 추가
        if (targetLang === 'ko') {
            return pagePath;
        } else {
            return `/${targetLang}${pagePath}`;
        }
    },

    // 언어 전환
    switchLanguage(targetLang) {
        if (!this.supportedLangs.includes(targetLang)) return;

        localStorage.setItem('preferred_language', targetLang);
        const newUrl = this.getAlternateUrl(targetLang);
        window.location.href = newUrl;
    },

    // 저장된 언어 선호도 가져오기
    getPreferredLanguage() {
        return localStorage.getItem('preferred_language') || 'ko';
    }
};

// 전역으로 i18n 노출
window.i18n = i18n;

document.addEventListener('DOMContentLoaded', async function() {
    // 환경 감지 (로컬 파일 시스템인지 웹 서버인지)
    const isLocalFileSystem = window.location.protocol === 'file:';

    // 현재 언어 감지 및 번역 로딩
    i18n.currentLang = i18n.detectLanguage();

    // 웹 서버 환경에서만 번역 로딩 시도
    if (!isLocalFileSystem) {
        await i18n.loadTranslations(i18n.currentLang);
    }

    // 로컬 파일 시스템에서 현재 실제 경로 구하기 (Windows와 다른 OS 호환)
    const currentPath = window.location.pathname;
    const projectRoot = getProjectRoot(currentPath);

    // 현재 경로 감지 (루트 디렉토리인지 하위 디렉토리인지)
    // 경로 감지 수정 - 보다 정확한 경로 감지를 위해 정규식 개선
    const pathName = window.location.pathname;
    const isSubDirectory = pathName.includes('/posts/') ||
                           pathName.match(/\/[^\/]+\/[^\/]+\.html$/) ||
                           pathName.includes('post_');

    // 다국어 폴더 감지
    const isLangSubDirectory = /^\/(en|ja|zh)\//.test(pathName);

    // 컴포넌트 경로 결정
    let headerFile, footerFile;
    if (isLangSubDirectory) {
        const lang = i18n.currentLang;
        if (pathName.includes('/posts/')) {
            headerFile = `components/${lang}-header.html`;
            footerFile = `components/${lang}-footer.html`;
        } else {
            headerFile = `components/${lang}-header.html`;
            footerFile = `components/${lang}-footer.html`;
        }
    } else if (isSubDirectory) {
        headerFile = 'components/header.html';
        footerFile = 'components/footer.html';
    } else {
        headerFile = 'components/root-header.html';
        footerFile = 'components/root-footer.html';
    }

    // 컴포넌트 기본 경로
    let componentsBasePath;
    if (isLangSubDirectory) {
        if (pathName.includes('/posts/')) {
            componentsBasePath = '../../';
        } else {
            componentsBasePath = '../';
        }
    } else if (isSubDirectory) {
        componentsBasePath = '../';
    } else {
        componentsBasePath = '';
    }

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

    // 언어 전환 UI 생성
    function createLanguageSwitcher() {
        const currentLang = i18n.currentLang;
        const langName = i18n.langNames[currentLang];

        return `
        <div class="language-switcher">
            <button class="lang-btn" aria-label="Select language" onclick="toggleLangDropdown(event)">
                <span class="current-lang">${currentLang.toUpperCase()}</span>
                <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M2 4l4 4 4-4"/>
                </svg>
            </button>
            <ul class="lang-dropdown" id="lang-dropdown">
                ${i18n.supportedLangs.map(lang => `
                    <li>
                        <a href="${i18n.getAlternateUrl(lang)}"
                           hreflang="${lang}"
                           data-lang="${lang}"
                           class="${lang === currentLang ? 'active' : ''}">
                            ${i18n.langNames[lang]}
                        </a>
                    </li>
                `).join('')}
            </ul>
        </div>`;
    }

    // 전역 언어 드롭다운 토글 함수
    window.toggleLangDropdown = function(event) {
        event.stopPropagation();
        const dropdown = document.getElementById('lang-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    };

    // 드롭다운 외부 클릭 시 닫기
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('lang-dropdown');
        if (dropdown && !event.target.closest('.language-switcher')) {
            dropdown.classList.remove('show');
        }
    });

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

    // 다국어 지원 네비게이션 텍스트 가져오기
    function getNavText(key) {
        if (!isLocalFileSystem && i18n.translations.navigation) {
            return i18n.t(`navigation.${key}`);
        }
        // 기본 한국어 텍스트
        const defaultTexts = {
            home: '홈',
            blog: '기술 블로그',
            lotto: '로또 번호 생성기',
            subnet: '서브넷 계산기',
            password: '비밀번호 생성기',
            qrcode: 'QR 코드 생성기',
            datetime: '시간/날짜 계산기',
            tools: '무료 도구 모음'
        };
        return defaultTexts[key] || key;
    }

    // 다국어 지원 푸터 텍스트 가져오기
    function getFooterText() {
        if (!isLocalFileSystem && i18n.translations.site) {
            return {
                copyright: i18n.t('site.copyright'),
                contactText: i18n.t('site.contactText'),
                privacyPolicy: i18n.t('site.privacyPolicy')
            };
        }
        return {
            copyright: '© 2025 BrainDetox Utility Box. 모든 권리 보유.',
            contactText: '사이트 내 모든 도구는 무료로 제공되며, 문의사항은 이메일로 연락 바랍니다.',
            privacyPolicy: '개인정보 처리방침'
        };
    }

    // 하드코딩된 헤더와 푸터 로드 (로컬 파일 시스템용)
    function loadHardcodedComponents() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        const footerPlaceholder = document.getElementById('footer-placeholder');

        const langSwitcher = createLanguageSwitcher();

        if (headerPlaceholder) {
            // 현재 경로에 맞는 헤더 선택
            if (isSubDirectory) {
                // 하위 디렉토리용 헤더
                headerPlaceholder.innerHTML = `
                <header class="main-header">
                    <div class="header-container" style="position: relative;">
                        <div class="lang-switcher-nav" style="position: absolute; right: 10px; top: 10px; z-index: 100;">${langSwitcher}</div>
                        <div class="header-top" style="text-align: center;">
                            <h1 class="site-title" style="display: inline-block; margin-bottom: 8px;"><a href="${projectRoot}index.html" style="color: inherit; text-decoration: none; font-weight: 900 !important;">BrainDetox Utility Box</a></h1>
                        </div>
                        <nav class="main-nav" style="margin-top: 5px;">
                            <ul class="nav-list" style="gap: 10px; display: flex; justify-content: center; flex-wrap: wrap;">
                                <li class="nav-item">
                                    <a href="${projectRoot}index.html" class="nav-link">${getNavText('home')}</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}blog.html" class="nav-link">${getNavText('blog')}</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}lotto.html" class="nav-link">${getNavText('lotto')}</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}subnet.html" class="nav-link">${getNavText('subnet')}</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}password.html" class="nav-link">${getNavText('password')}</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}qrcode.html" class="nav-link">${getNavText('qrcode')}</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}datetime.html" class="nav-link">${getNavText('datetime')}</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}static_index.html" class="nav-link">${getNavText('tools')}</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </header>`;
            } else {
                // 루트 디렉토리용 헤더
                headerPlaceholder.innerHTML = `
                <header class="main-header">
                    <div class="header-container" style="position: relative;">
                        <div class="lang-switcher-nav" style="position: absolute; right: 10px; top: 10px; z-index: 100;">${langSwitcher}</div>
                        <div class="header-top" style="text-align: center;">
                            <h1 class="site-title" style="display: inline-block; margin-bottom: 8px;"><a href="${projectRoot}index.html" style="color: inherit; text-decoration: none; font-weight: 900 !important;">BrainDetox Utility Box</a></h1>
                        </div>
                        <nav class="main-nav" style="margin-top: 5px;">
                            <ul class="nav-list" style="gap: 10px; display: flex; justify-content: center; flex-wrap: wrap;">
                                <li class="nav-item">
                                    <a href="${projectRoot}index.html" class="nav-link">${getNavText('home')}</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}blog.html" class="nav-link">${getNavText('blog')}</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}lotto.html" class="nav-link">${getNavText('lotto')}</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}subnet.html" class="nav-link">${getNavText('subnet')}</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}password.html" class="nav-link">${getNavText('password')}</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}qrcode.html" class="nav-link">${getNavText('qrcode')}</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}datetime.html" class="nav-link">${getNavText('datetime')}</a>
                                </li>
                                <li class="nav-item">
                                    <a href="${projectRoot}static_index.html" class="nav-link">${getNavText('tools')}</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </header>`;
            }
        }

        const footerText = getFooterText();

        if (footerPlaceholder) {
            // 현재 경로에 맞는 푸터 선택
            if (isSubDirectory) {
                // 하위 디렉토리용 푸터
                footerPlaceholder.innerHTML = `
                <footer class="main-footer">
                    <div class="footer-container">
                        <p class="footer-text">
                            ${footerText.copyright}
                        </p>
                        <p class="footer-text">
                            ${footerText.contactText} (<a href="mailto:jhtoka@gmail.com" class="footer-link">jhtoka@gmail.com</a>)
                        </p>
                        <p class="footer-text">
                            <a href="${projectRoot}privacy.html" class="footer-link">${footerText.privacyPolicy}</a>
                        </p>
                    </div>
                </footer>`;
            } else {
                // 루트 디렉토리용 푸터
                footerPlaceholder.innerHTML = `
                <footer class="main-footer">
                    <div class="footer-container">
                        <p class="footer-text">
                            ${footerText.copyright}
                        </p>
                        <p class="footer-text">
                            ${footerText.contactText} (<a href="mailto:jhtoka@gmail.com" class="footer-link">jhtoka@gmail.com</a>)
                        </p>
                        <p class="footer-text">
                            <a href="${projectRoot}privacy.html" class="footer-link">${footerText.privacyPolicy}</a>
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
                .then(response => {
                    if (!response.ok) {
                        // 언어별 헤더가 없으면 기본 헤더 사용
                        return fetch(`${componentsBasePath}components/root-header.html`);
                    }
                    return response;
                })
                .then(response => response.text())
                .then(data => {
                    headerPlaceholder.innerHTML = data;
                    // 언어 전환 UI 추가
                    addLanguageSwitcherToHeader();
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
                .then(response => {
                    if (!response.ok) {
                        return fetch(`${componentsBasePath}components/root-footer.html`);
                    }
                    return response;
                })
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

    // 헤더에 언어 전환 UI 추가 (메뉴 바 오른쪽 끝에 배치)
    function addLanguageSwitcherToHeader() {
        // 이미 언어 스위처가 있으면 스킵
        if (document.querySelector('.language-switcher')) return;

        const headerContainer = document.querySelector('.header-container');

        if (headerContainer) {
            const langSwitcherHtml = createLanguageSwitcher();
            const langDiv = document.createElement('div');
            langDiv.className = 'lang-switcher-nav';
            langDiv.style.cssText = 'position: absolute; right: 10px; top: 10px; z-index: 100;';
            langDiv.innerHTML = langSwitcherHtml;
            headerContainer.style.position = 'relative';
            headerContainer.insertBefore(langDiv, headerContainer.firstChild);
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

// ============================================
// 최근 사용 도구 추적 시스템 (사용자 재방문 유도)
// ============================================
const RecentTools = {
    storageKey: 'braindetox_recent_tools',
    maxItems: 5,

    // 도구 목록 정의
    tools: {
        'lotto.html': { name: '로또 번호 생성기', icon: '🎱', category: '게임' },
        'subnet.html': { name: '서브넷 계산기', icon: '🌐', category: 'IT' },
        'password.html': { name: '비밀번호 생성기', icon: '🔐', category: '보안' },
        'qrcode.html': { name: 'QR 코드 생성기', icon: '📱', category: '유틸리티' },
        'datetime.html': { name: '시간/날짜 계산기', icon: '📅', category: '유틸리티' },
        'speed_test.html': { name: '인터넷 속도 측정', icon: '🚀', category: 'IT' },
        'mbti_test.html': { name: 'MBTI 테스트', icon: '🧠', category: '심리' },
        'fortune_tarot.html': { name: '타로 운세', icon: '🔮', category: '운세' },
        'color_palette.html': { name: '색상 팔레트', icon: '🎨', category: '디자인' },
        'unit_converter.html': { name: '단위 변환기', icon: '📐', category: '유틸리티' },
        'crontab_generator.html': { name: '크론탭 생성기', icon: '⏰', category: 'IT' },
        'docker_builder.html': { name: 'Docker 빌더', icon: '🐳', category: 'IT' },
        'random_picker.html': { name: '랜덤 뽑기', icon: '🎲', category: '유틸리티' },
        'interest_calculator.html': { name: '이자 계산기', icon: '💰', category: '금융' },
        'pomodoro.html': { name: '뽀모도로 타이머', icon: '🍅', category: '생산성' },
        'brain-games.html': { name: '브레인 게임', icon: '🎮', category: '게임' },
        'my_day.html': { name: '마이 데이', icon: '☀️', category: '생활' },
        'blog.html': { name: '기술 블로그', icon: '📝', category: '콘텐츠' }
    },

    // 현재 페이지 기록
    trackCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();

        if (this.tools[filename]) {
            this.addTool(filename);
        }
    },

    // 도구 추가
    addTool(filename) {
        let recent = this.getRecent();

        // 이미 있으면 제거 (맨 앞으로 이동시키기 위해)
        recent = recent.filter(item => item !== filename);

        // 맨 앞에 추가
        recent.unshift(filename);

        // 최대 개수 유지
        if (recent.length > this.maxItems) {
            recent = recent.slice(0, this.maxItems);
        }

        localStorage.setItem(this.storageKey, JSON.stringify(recent));
    },

    // 최근 사용 목록 가져오기
    getRecent() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    // 관련 도구 가져오기 (같은 카테고리)
    getRelatedTools(currentFile, limit = 3) {
        const current = this.tools[currentFile];
        if (!current) return [];

        const related = [];
        for (const [file, info] of Object.entries(this.tools)) {
            if (file !== currentFile && info.category === current.category) {
                related.push({ file, ...info });
            }
        }

        // 랜덤하게 섞어서 반환
        return related.sort(() => Math.random() - 0.5).slice(0, limit);
    },

    // 최근 사용 위젯 렌더링
    renderRecentWidget() {
        const recent = this.getRecent();
        if (recent.length === 0) return;

        const lang = i18n.detectLanguage();
        const basePath = lang === 'ko' ? '' : '../';

        const container = document.createElement('div');
        container.id = 'recent-tools-widget';
        container.innerHTML = `
            <style>
                #recent-tools-widget {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    padding: 12px;
                    z-index: 9999;
                    max-width: 200px;
                    font-family: 'Noto Sans KR', sans-serif;
                    transition: transform 0.3s ease;
                }
                #recent-tools-widget.collapsed {
                    transform: translateX(calc(100% + 10px));
                }
                #recent-tools-widget .widget-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #eee;
                }
                #recent-tools-widget .widget-title {
                    font-size: 12px;
                    font-weight: bold;
                    color: #333;
                }
                #recent-tools-widget .widget-toggle {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                    padding: 2px 6px;
                }
                #recent-tools-widget .tool-item {
                    display: flex;
                    align-items: center;
                    padding: 6px 8px;
                    text-decoration: none;
                    color: #333;
                    border-radius: 6px;
                    font-size: 12px;
                    transition: background 0.2s;
                }
                #recent-tools-widget .tool-item:hover {
                    background: #f5f5f5;
                }
                #recent-tools-widget .tool-icon {
                    margin-right: 8px;
                    font-size: 14px;
                }
                #recent-tools-toggle {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #3498db;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    cursor: pointer;
                    z-index: 9998;
                    font-size: 18px;
                    display: none;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                }
                @media (max-width: 768px) {
                    #recent-tools-widget {
                        bottom: 70px;
                        right: 10px;
                        max-width: 180px;
                    }
                }
            </style>
            <div class="widget-header">
                <span class="widget-title">⏱️ 최근 사용</span>
                <button class="widget-toggle" onclick="RecentTools.toggleWidget()">✕</button>
            </div>
            <div class="widget-content">
                ${recent.map(file => {
                    const tool = this.tools[file];
                    if (!tool) return '';
                    return `<a href="${basePath}${file}" class="tool-item">
                        <span class="tool-icon">${tool.icon}</span>
                        <span>${tool.name}</span>
                    </a>`;
                }).join('')}
            </div>
        `;

        // 토글 버튼
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'recent-tools-toggle';
        toggleBtn.innerHTML = '⏱️';
        toggleBtn.onclick = () => this.toggleWidget();

        document.body.appendChild(container);
        document.body.appendChild(toggleBtn);

        // 상태 복원
        if (localStorage.getItem('recent_widget_collapsed') === 'true') {
            container.classList.add('collapsed');
            toggleBtn.style.display = 'block';
        }
    },

    // 위젯 토글
    toggleWidget() {
        const widget = document.getElementById('recent-tools-widget');
        const toggle = document.getElementById('recent-tools-toggle');

        if (widget.classList.contains('collapsed')) {
            widget.classList.remove('collapsed');
            toggle.style.display = 'none';
            localStorage.setItem('recent_widget_collapsed', 'false');
        } else {
            widget.classList.add('collapsed');
            toggle.style.display = 'block';
            localStorage.setItem('recent_widget_collapsed', 'true');
        }
    },

    // 초기화
    init() {
        this.trackCurrentPage();

        // 메인 도구 페이지에서만 위젯 표시 (블로그 포스트 제외)
        const path = window.location.pathname;
        if (!path.includes('/posts/') && this.getRecent().length > 0) {
            // DOM 로드 후 렌더링
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.renderRecentWidget());
            } else {
                this.renderRecentWidget();
            }
        }
    }
};

// 최근 사용 도구 시스템 초기화
RecentTools.init();
