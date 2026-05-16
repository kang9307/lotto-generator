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
// + 같은 카테고리 관련 도구 자동 추천 (내부 회유 강화)
// ============================================
const RecentTools = {
    storageKey: 'braindetox_recent_tools',
    maxItems: 5,

    // 카테고리 다국어 매핑
    categoryLabels: {
        'game': { ko: '게임/복권', en: 'Games/Lottery', ja: 'ゲーム・宝くじ', zh: '游戏/彩票' },
        'it_dev': { ko: 'IT/개발', en: 'IT/Development', ja: 'IT・開発', zh: 'IT/开发' },
        'it_net': { ko: 'IT/네트워크', en: 'IT/Network', ja: 'IT・ネットワーク', zh: 'IT/网络' },
        'it_util': { ko: 'IT/유틸', en: 'IT/Utility', ja: 'IT・ユーティリティ', zh: 'IT/工具' },
        'security': { ko: '보안', en: 'Security', ja: 'セキュリティ', zh: '安全' },
        'utility': { ko: '유틸리티', en: 'Utility', ja: 'ユーティリティ', zh: '实用工具' },
        'design': { ko: '디자인', en: 'Design', ja: 'デザイン', zh: '设计' },
        'finance': { ko: '금융', en: 'Finance', ja: '金融', zh: '金融' },
        'personality': { ko: '심리/테스트', en: 'Personality/Test', ja: '心理・テスト', zh: '心理/测试' },
        'fortune': { ko: '운세', en: 'Fortune', ja: '占い', zh: '运势' },
        'health': { ko: '건강', en: 'Health', ja: '健康', zh: '健康' },
        'productivity': { ko: '생산성', en: 'Productivity', ja: '生産性', zh: '生产力' },
        'meditation': { ko: '명상/힐링', en: 'Meditation/Healing', ja: '瞑想・癒し', zh: '冥想/治愈' },
        'entertainment': { ko: '엔터테인먼트', en: 'Entertainment', ja: 'エンターテイメント', zh: '娱乐' }
    },

    // 도구 목록 정의 (전체 66개, 다국어 이름 + 카테고리 키)
    tools: {
        // === 게임/복권 ===
        'lotto.html': { name: { ko: '로또 번호 생성기', en: 'Lotto Number Generator', ja: 'ロト番号ジェネレーター', zh: '彩票号码生成器' }, icon: '🎱', cat: 'game' },
        'lotto7.html': { name: { ko: '로또 7/45', en: 'Lotto 7/45', ja: 'ロト 7/45', zh: '乐透 7/45' }, icon: '🎱', cat: 'game' },
        'powerball.html': { name: { ko: '파워볼', en: 'Powerball', ja: 'パワーボール', zh: '强力球' }, icon: '🎰', cat: 'game' },
        'megamillions.html': { name: { ko: '메가밀리언', en: 'Mega Millions', ja: 'メガミリオンズ', zh: '百万彩' }, icon: '💵', cat: 'game' },
        'doublecolorball.html': { name: { ko: '쌍색구', en: 'Double Color Ball', ja: '双色球', zh: '双色球' }, icon: '🔴', cat: 'game' },
        'tetris.html': { name: { ko: '테트리스', en: 'Tetris', ja: 'テトリス', zh: '俄罗斯方块' }, icon: '🧩', cat: 'game' },
        'brain-games.html': { name: { ko: '브레인 게임', en: 'Brain Games', ja: 'ブレインゲーム', zh: '脑力游戏' }, icon: '🎮', cat: 'game' },

        // === IT 개발 ===
        'crontab_generator.html': { name: { ko: '크론탭 생성기', en: 'Crontab Generator', ja: 'Crontabジェネレーター', zh: 'Crontab生成器' }, icon: '⏰', cat: 'it_dev' },
        'docker_builder.html': { name: { ko: 'Docker 빌더', en: 'Docker Builder', ja: 'Dockerビルダー', zh: 'Docker构建器' }, icon: '🐳', cat: 'it_dev' },
        'rsync_tool.html': { name: { ko: 'Rsync 도구', en: 'Rsync Tool', ja: 'Rsyncツール', zh: 'Rsync工具' }, icon: '🔄', cat: 'it_dev' },
        'static/base64_encoder.html': { name: { ko: 'Base64 인코더', en: 'Base64 Encoder', ja: 'Base64エンコーダー', zh: 'Base64编码器' }, icon: '🔣', cat: 'it_dev' },
        'static/json_formatter.html': { name: { ko: 'JSON 포매터', en: 'JSON Formatter', ja: 'JSONフォーマッター', zh: 'JSON格式化' }, icon: '📋', cat: 'it_dev' },
        'static/regex_tester.html': { name: { ko: '정규식 테스터', en: 'Regex Tester', ja: '正規表現テスター', zh: '正则表达式测试' }, icon: '🔍', cat: 'it_dev' },
        'static/code_image.html': { name: { ko: '코드 이미지 생성기', en: 'Code Image Generator', ja: 'コード画像ジェネレーター', zh: '代码图片生成器' }, icon: '💻', cat: 'it_dev' },
        'static/token_counter.html': { name: { ko: 'AI 토큰 카운터', en: 'AI Token Counter', ja: 'AIトークンカウンター', zh: 'AI令牌计数器' }, icon: '🤖', cat: 'it_dev' },

        // === IT 네트워크 ===
        'speed_test.html': { name: { ko: '인터넷 속도 측정', en: 'Internet Speed Test', ja: 'インターネット速度測定', zh: '网速测试' }, icon: '🚀', cat: 'it_net' },
        'subnet.html': { name: { ko: '서브넷 계산기', en: 'Subnet Calculator', ja: 'サブネット計算機', zh: '子网计算器' }, icon: '🌐', cat: 'it_net' },
        'static/iptables_generator.html': { name: { ko: 'iptables 생성기', en: 'iptables Generator', ja: 'iptablesジェネレーター', zh: 'iptables生成器' }, icon: '🛡️', cat: 'it_net' },
        'static/nginx_generator.html': { name: { ko: 'Nginx 설정 생성기', en: 'Nginx Config Generator', ja: 'Nginx設定ジェネレーター', zh: 'Nginx配置生成器' }, icon: '⚙️', cat: 'it_net' },

        // === IT 유틸 / 진단 ===
        'static/dead_pixel_test.html': { name: { ko: '데드픽셀 테스트', en: 'Dead Pixel Test', ja: 'デッドピクセルテスト', zh: '坏点测试' }, icon: '🖥️', cat: 'it_util' },
        'static/frequency_test.html': { name: { ko: '주파수 테스트', en: 'Frequency Test', ja: '周波数テスト', zh: '频率测试' }, icon: '🔊', cat: 'it_util' },
        'static/noise_meter.html': { name: { ko: '소음 측정기', en: 'Noise Meter', ja: '騒音計', zh: '噪音计' }, icon: '🔉', cat: 'it_util' },

        // === 보안 ===
        'password.html': { name: { ko: '비밀번호 생성기', en: 'Password Generator', ja: 'パスワード生成', zh: '密码生成器' }, icon: '🔐', cat: 'security' },
        'static/password_generator.html': { name: { ko: '강력 비밀번호 생성기', en: 'Strong Password Generator', ja: '強力パスワード生成', zh: '强密码生成器' }, icon: '🔑', cat: 'security' },

        // === 유틸리티 ===
        'qrcode.html': { name: { ko: 'QR 코드 생성기', en: 'QR Code Generator', ja: 'QRコード生成', zh: '二维码生成器' }, icon: '📱', cat: 'utility' },
        'static/qr_code_generator.html': { name: { ko: 'QR 코드 생성기 Pro', en: 'QR Code Generator Pro', ja: 'QRコード生成 Pro', zh: '二维码生成器Pro' }, icon: '📲', cat: 'utility' },
        'datetime.html': { name: { ko: '시간/날짜 계산기', en: 'Date/Time Calculator', ja: '日時計算機', zh: '日期时间计算器' }, icon: '📅', cat: 'utility' },
        'random_picker.html': { name: { ko: '랜덤 뽑기', en: 'Random Picker', ja: 'ランダム抽選', zh: '随机抽签' }, icon: '🎲', cat: 'utility' },
        'unit-converter.html': { name: { ko: '단위 변환기', en: 'Unit Converter', ja: '単位変換', zh: '单位换算' }, icon: '📐', cat: 'utility' },
        'static/unit_converter.html': { name: { ko: '단위 변환기 Pro', en: 'Unit Converter Pro', ja: '単位変換 Pro', zh: '单位换算Pro' }, icon: '📏', cat: 'utility' },
        'static/age_calculator.html': { name: { ko: '나이 계산기', en: 'Age Calculator', ja: '年齢計算機', zh: '年龄计算器' }, icon: '🎂', cat: 'utility' },
        'static/char_counter.html': { name: { ko: '글자 수 세기', en: 'Character Counter', ja: '文字数カウント', zh: '字符计数' }, icon: '📝', cat: 'utility' },
        'static/nickname_generator.html': { name: { ko: '닉네임 생성기', en: 'Nickname Generator', ja: 'ニックネーム生成', zh: '昵称生成器' }, icon: '✨', cat: 'utility' },
        'static/random_menu.html': { name: { ko: '메뉴 추천', en: 'Random Menu', ja: 'メニュー推薦', zh: '菜单推荐' }, icon: '🍽️', cat: 'utility' },
        'static/spin_wheel.html': { name: { ko: '돌림판 룰렛', en: 'Spin Wheel', ja: 'ルーレット', zh: '随机转盘' }, icon: '🎯', cat: 'utility' },
        'static/timezone_converter.html': { name: { ko: '타임존 변환기', en: 'Timezone Converter', ja: 'タイムゾーン変換', zh: '时区转换' }, icon: '🌏', cat: 'utility' },

        // === 디자인 ===
        'color_palette.html': { name: { ko: '색상 팔레트', en: 'Color Palette', ja: 'カラーパレット', zh: '配色板' }, icon: '🎨', cat: 'design' },
        'static/ascii_art.html': { name: { ko: 'ASCII 아트', en: 'ASCII Art', ja: 'ASCIIアート', zh: 'ASCII艺术' }, icon: '🖼️', cat: 'design' },
        'static/css_gradient_generator.html': { name: { ko: 'CSS 그라디언트 생성기', en: 'CSS Gradient Generator', ja: 'CSSグラデーション生成', zh: 'CSS渐变生成器' }, icon: '🌈', cat: 'design' },
        'static/fractal_explorer.html': { name: { ko: '프랙탈 익스플로러', en: 'Fractal Explorer', ja: 'フラクタルエクスプローラー', zh: '分形探索器' }, icon: '🌀', cat: 'design' },
        'static/icon_generator.html': { name: { ko: '아이콘 생성기', en: 'Icon Generator', ja: 'アイコン生成', zh: '图标生成器' }, icon: '⭐', cat: 'design' },
        'static/particle_system.html': { name: { ko: '파티클 시스템', en: 'Particle System', ja: 'パーティクルシステム', zh: '粒子系统' }, icon: '✨', cat: 'design' },

        // === 금융 ===
        'interest_calculator.html': { name: { ko: '이자 계산기', en: 'Interest Calculator', ja: '利息計算機', zh: '利息计算器' }, icon: '💰', cat: 'finance' },
        'static/daily_work_calculator.html': { name: { ko: '일급 계산기', en: 'Daily Wage Calculator', ja: '日給計算機', zh: '日工资计算器' }, icon: '💵', cat: 'finance' },
        'static/jeonse_wolse_calculator.html': { name: { ko: '전세/월세 계산기', en: 'Jeonse/Wolse Calculator', ja: 'チョンセ/月貰計算機', zh: '全租/月租计算器' }, icon: '🏠', cat: 'finance' },
        'static/salary_calculator.html': { name: { ko: '연봉 실수령액 계산기', en: 'Salary Calculator', ja: '年収手取り計算機', zh: '年薪到手计算器' }, icon: '💼', cat: 'finance' },
        'static/currency_calculator.html': { name: { ko: '통합 환율 계산기', en: 'Multi-Currency Calculator', ja: '多通貨為替計算機', zh: '多币种汇率计算器' }, icon: '💱', cat: 'finance' },
        'static/usd_krw_calculator.html': { name: { ko: '달러 환율 계산기', en: 'USD/KRW Calculator', ja: '米ドル為替計算機', zh: '美元汇率计算器' }, icon: '🇺🇸', cat: 'finance' },
        'static/jpy_krw_calculator.html': { name: { ko: '엔화 환율 계산기', en: 'JPY/KRW Calculator', ja: '円為替計算機', zh: '日元汇率计算器' }, icon: '🇯🇵', cat: 'finance' },
        'static/eur_krw_calculator.html': { name: { ko: '유로 환율 계산기', en: 'EUR/KRW Calculator', ja: 'ユーロ為替計算機', zh: '欧元汇率计算器' }, icon: '🇪🇺', cat: 'finance' },
        'static/cny_krw_calculator.html': { name: { ko: '위안 환율 계산기', en: 'CNY/KRW Calculator', ja: '人民元為替計算機', zh: '人民币汇率计算器' }, icon: '🇨🇳', cat: 'finance' },
        'static/gbp_krw_calculator.html': { name: { ko: '파운드 환율 계산기', en: 'GBP/KRW Calculator', ja: 'ポンド為替計算機', zh: '英镑汇率计算器' }, icon: '🇬🇧', cat: 'finance' },
        'static/thb_krw_calculator.html': { name: { ko: '바트 환율 계산기', en: 'THB/KRW Calculator', ja: 'バーツ為替計算機', zh: '泰铢汇率计算器' }, icon: '🇹🇭', cat: 'finance' },
        'static/php_krw_calculator.html': { name: { ko: '페소 환율 계산기', en: 'PHP/KRW Calculator', ja: 'ペソ為替計算機', zh: '比索汇率计算器' }, icon: '🇵🇭', cat: 'finance' },
        'static/idr_krw_calculator.html': { name: { ko: '루피아 환율 계산기', en: 'IDR/KRW Calculator', ja: 'ルピア為替計算機', zh: '印尼盾汇率计算器' }, icon: '🇮🇩', cat: 'finance' },
        'static/twd_krw_calculator.html': { name: { ko: '대만달러 환율 계산기', en: 'TWD/KRW Calculator', ja: '台湾ドル為替計算機', zh: '新台币汇率计算器' }, icon: '🇹🇼', cat: 'finance' },
        'static/vnd_krw_calculator.html': { name: { ko: '동 환율 계산기', en: 'VND/KRW Calculator', ja: 'ドン為替計算機', zh: '越南盾汇率计算器' }, icon: '🇻🇳', cat: 'finance' },

        // === 심리/테스트 ===
        'mbti_test.html': { name: { ko: 'MBTI 테스트', en: 'MBTI Test', ja: 'MBTI診断', zh: 'MBTI测试' }, icon: '🧠', cat: 'personality' },
        'compatibility_test.html': { name: { ko: '궁합 테스트', en: 'Compatibility Test', ja: '相性テスト', zh: '配对测试' }, icon: '💕', cat: 'personality' },
        'static/mbti_compatibility.html': { name: { ko: 'MBTI 궁합', en: 'MBTI Compatibility', ja: 'MBTI相性', zh: 'MBTI配对' }, icon: '🫶', cat: 'personality' },
        'static/personality_test.html': { name: { ko: '성격 테스트', en: 'Personality Test', ja: '性格診断', zh: '性格测试' }, icon: '🎭', cat: 'personality' },

        // === 운세 ===
        'fortune_tarot.html': { name: { ko: '타로 운세', en: 'Tarot Fortune', ja: 'タロット占い', zh: '塔罗运势' }, icon: '🔮', cat: 'fortune' },
        'static/fortune_zodiac.html': { name: { ko: '별자리 운세', en: 'Zodiac Fortune', ja: '星座占い', zh: '星座运势' }, icon: '✨', cat: 'fortune' },
        'static/name_compatibility.html': { name: { ko: '이름 궁합', en: 'Name Compatibility', ja: '名前相性', zh: '姓名配对' }, icon: '💖', cat: 'fortune' },

        // === 건강 ===
        'static/bmi_calculator.html': { name: { ko: 'BMI 계산기', en: 'BMI Calculator', ja: 'BMI計算機', zh: 'BMI计算器' }, icon: '⚖️', cat: 'health' },
        'static/color_blindness_test.html': { name: { ko: '색맹/색약 테스트', en: 'Color Blindness Test', ja: '色覚テスト', zh: '色盲测试' }, icon: '👁️', cat: 'health' },
        'static/hearing_age_test.html': { name: { ko: '청력 나이 테스트', en: 'Hearing Age Test', ja: '聴力年齢テスト', zh: '听力年龄测试' }, icon: '👂', cat: 'health' },

        // === 생산성 ===
        'pomodoro.html': { name: { ko: '뽀모도로 타이머', en: 'Pomodoro Timer', ja: 'ポモドーロタイマー', zh: '番茄钟' }, icon: '🍅', cat: 'productivity' },
        'static/meeting_calculator.html': { name: { ko: '회의 비용 계산기', en: 'Meeting Cost Calculator', ja: '会議コスト計算機', zh: '会议成本计算器' }, icon: '📊', cat: 'productivity' },

        // === 명상/힐링 ===
        'mindfulness.html': { name: { ko: '마인드풀니스', en: 'Mindfulness', ja: 'マインドフルネス', zh: '正念冥想' }, icon: '🧘', cat: 'meditation' },
        'my_day.html': { name: { ko: '마이 데이', en: 'My Day', ja: 'マイデイ', zh: '我的一天' }, icon: '☀️', cat: 'meditation' },
        'static/mind_refresh_studio.html': { name: { ko: '마인드 리프레시 스튜디오', en: 'Mind Refresh Studio', ja: 'マインドリフレッシュ', zh: '心灵刷新工作室' }, icon: '🌿', cat: 'meditation' },
        'static/relaxing_day.html': { name: { ko: '릴랙싱 데이', en: 'Relaxing Day', ja: 'リラックスデイ', zh: '放松的一天' }, icon: '🌅', cat: 'meditation' },

        // === 엔터테인먼트 / 반응 게임 ===
        'static/hitel_chat.html': { name: { ko: '하이텔 채팅 (레트로)', en: 'Hitel Chat (Retro)', ja: 'ハイテルチャット', zh: 'Hitel聊天(复古)' }, icon: '📟', cat: 'entertainment' },
        'static/max_chatbot.html': { name: { ko: 'MAX 챗봇', en: 'MAX Chatbot', ja: 'MAXチャットボット', zh: 'MAX聊天机器人' }, icon: '🤖', cat: 'entertainment' },
        'static/reaction_test.html': { name: { ko: '반응속도 테스트', en: 'Reaction Test', ja: '反応速度テスト', zh: '反应速度测试' }, icon: '⚡', cat: 'entertainment' },
        'static/typing_test.html': { name: { ko: '타자 속도 테스트', en: 'Typing Test', ja: 'タイピングテスト', zh: '打字测试' }, icon: '⌨️', cat: 'entertainment' }
    },

    // 현재 언어로 도구 이름 반환
    getToolName(tool) {
        if (typeof tool.name === 'string') return tool.name;
        const lang = this.getCurrentLang();
        return tool.name[lang] || tool.name.ko || '';
    },

    // 현재 언어로 카테고리 라벨 반환
    getCategoryLabel(catKey) {
        if (this.categoryLabels[catKey]) {
            const lang = this.getCurrentLang();
            return this.categoryLabels[catKey][lang] || this.categoryLabels[catKey].ko;
        }
        return catKey;
    },

    // 현재 언어 감지
    getCurrentLang() {
        if (typeof i18n !== 'undefined' && i18n.currentLang) return i18n.currentLang;
        const path = window.location.pathname;
        if (path.startsWith('/en/') || path.includes('/en/')) return 'en';
        if (path.startsWith('/ja/') || path.includes('/ja/')) return 'ja';
        if (path.startsWith('/zh/') || path.includes('/zh/')) return 'zh';
        return 'ko';
    },

    // 도구 페이지 키 추출 (다국어 경로 지원)
    // 예: /lotto.html → lotto.html
    //     /static/age_calculator.html → static/age_calculator.html
    //     /en/lotto.html → lotto.html
    //     /en/static/age_calculator.html → static/age_calculator.html
    getToolKey() {
        let path = window.location.pathname;
        // 언어 prefix 제거
        path = path.replace(/^\/(en|ja|zh)\//, '/');
        // 선행 슬래시 제거
        if (path.startsWith('/')) path = path.substring(1);
        return path;
    },

    // 절대 URL 생성 (현재 언어 prefix 유지)
    getToolUrl(toolKey) {
        const lang = (typeof i18n !== 'undefined' && i18n.currentLang) ? i18n.currentLang : 'ko';
        const langPrefix = lang === 'ko' ? '' : `/${lang}`;
        return `${langPrefix}/${toolKey}`;
    },

    // 현재 페이지 기록
    trackCurrentPage() {
        const key = this.getToolKey();
        if (this.tools[key]) {
            this.addTool(key);
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

    // 관련 도구 가져오기 (같은 카테고리, 다국어 지원)
    getRelatedTools(currentFile, limit = 3) {
        const current = this.tools[currentFile];
        if (!current) return [];

        const related = [];
        for (const [file, info] of Object.entries(this.tools)) {
            if (file !== currentFile && info.cat === current.cat) {
                related.push({
                    file,
                    name: this.getToolName(info),
                    icon: info.icon,
                    category: this.getCategoryLabel(info.cat)
                });
            }
        }

        // 랜덤하게 섞어서 반환
        return related.sort(() => Math.random() - 0.5).slice(0, limit);
    },

    // 최근 사용 위젯 렌더링
    renderRecentWidget() {
        const recent = this.getRecent();
        if (recent.length === 0) return;

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
                <span class="widget-title">⏱️ ${({ko:'최근 사용',en:'Recent',ja:'最近使用',zh:'最近使用'})[this.getCurrentLang()] || '최근 사용'}</span>
                <button class="widget-toggle" onclick="RecentTools.toggleWidget()">✕</button>
            </div>
            <div class="widget-content">
                ${recent.map(file => {
                    const tool = this.tools[file];
                    if (!tool) return '';
                    return `<a href="${this.getToolUrl(file)}" class="tool-item">
                        <span class="tool-icon">${tool.icon}</span>
                        <span>${this.getToolName(tool)}</span>
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

    // 본문 내 "관련 도구" 섹션 자동 삽입
    // 도구 페이지의 main 또는 body 끝부분에 같은 카테고리 도구를 추천
    renderRelatedToolsSection() {
        const currentKey = this.getToolKey();
        const related = this.getRelatedTools(currentKey, 4);
        if (related.length === 0) return;

        // 이미 렌더링된 경우 중복 방지
        if (document.getElementById('related-tools-section')) return;

        // 카테고리 라벨 (현재 도구의 카테고리, 다국어 지원)
        const currentTool = this.tools[currentKey];
        const categoryLabel = currentTool ? this.getCategoryLabel(currentTool.cat) : '';

        // 다국어 헤더 텍스트
        const lang = (typeof i18n !== 'undefined' && i18n.currentLang) ? i18n.currentLang : 'ko';
        const headerText = {
            ko: '🔗 함께 사용하면 좋은 도구',
            en: '🔗 Related Tools You Might Like',
            ja: '🔗 一緒に使うと便利なツール',
            zh: '🔗 一起使用更好的工具'
        }[lang] || '🔗 함께 사용하면 좋은 도구';

        const subText = {
            ko: `같은 "${categoryLabel}" 카테고리의 도구입니다`,
            en: `Other tools in the "${categoryLabel}" category`,
            ja: `同じ「${categoryLabel}」カテゴリのツール`,
            zh: `同一"${categoryLabel}"类别的工具`
        }[lang] || `같은 "${categoryLabel}" 카테고리의 도구입니다`;

        const section = document.createElement('section');
        section.id = 'related-tools-section';
        section.innerHTML = `
            <style>
                #related-tools-section {
                    max-width: 1200px;
                    margin: 3rem auto 2rem;
                    padding: 2rem 1.5rem;
                    background: linear-gradient(135deg, #f8f9fb 0%, #eef2f7 100%);
                    border-radius: 16px;
                    border: 1px solid #e0e6ed;
                    font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
                }
                #related-tools-section .rt-header {
                    text-align: center;
                    margin-bottom: 1.5rem;
                }
                #related-tools-section .rt-title {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #2c3e50;
                    margin: 0 0 0.4rem 0;
                }
                #related-tools-section .rt-subtitle {
                    font-size: 0.9rem;
                    color: #7f8c9b;
                    margin: 0;
                }
                #related-tools-section .rt-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 1rem;
                    max-width: 1000px;
                    margin: 0 auto;
                }
                #related-tools-section .rt-card {
                    display: flex;
                    align-items: center;
                    padding: 1rem 1.2rem;
                    background: white;
                    border-radius: 12px;
                    text-decoration: none;
                    color: #333;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
                    border: 1px solid #e8edf2;
                    transition: all 0.25s ease;
                }
                #related-tools-section .rt-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 18px rgba(52, 152, 219, 0.15);
                    border-color: #3498db;
                }
                #related-tools-section .rt-icon {
                    font-size: 1.8rem;
                    margin-right: 0.9rem;
                    flex-shrink: 0;
                }
                #related-tools-section .rt-info {
                    flex: 1;
                    min-width: 0;
                }
                #related-tools-section .rt-name {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #2c3e50;
                    margin: 0 0 0.2rem 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                #related-tools-section .rt-cat {
                    font-size: 0.78rem;
                    color: #95a5b5;
                    margin: 0;
                }
                @media (max-width: 768px) {
                    #related-tools-section { padding: 1.5rem 1rem; margin: 2rem 0.5rem; }
                    #related-tools-section .rt-title { font-size: 1.2rem; }
                    #related-tools-section .rt-grid { grid-template-columns: 1fr; }
                }
            </style>
            <div class="rt-header">
                <h2 class="rt-title">${headerText}</h2>
                <p class="rt-subtitle">${subText}</p>
            </div>
            <div class="rt-grid">
                ${related.map(tool => `
                    <a href="${this.getToolUrl(tool.file)}" class="rt-card">
                        <div class="rt-icon">${tool.icon}</div>
                        <div class="rt-info">
                            <div class="rt-name">${tool.name}</div>
                            <div class="rt-cat">${tool.category}</div>
                        </div>
                    </a>
                `).join('')}
            </div>
        `;

        // 삽입 위치 결정: main의 끝 → body 끝 순서로 시도
        const main = document.querySelector('main') || document.querySelector('.container');
        const footerPlaceholder = document.getElementById('footer-placeholder');

        if (footerPlaceholder && footerPlaceholder.parentNode) {
            // footer placeholder 직전에 삽입
            footerPlaceholder.parentNode.insertBefore(section, footerPlaceholder);
        } else if (main) {
            main.appendChild(section);
        } else {
            document.body.appendChild(section);
        }
    },

    // 초기화
    init() {
        this.trackCurrentPage();

        // 블로그 포스트는 제외, 도구 페이지에서만 동작
        const path = window.location.pathname;
        if (path.includes('/posts/')) return;

        const renderAll = () => {
            // 1. 본문 내 "관련 도구" 섹션 (모든 도구 페이지)
            const currentKey = this.getToolKey();
            if (this.tools[currentKey]) {
                this.renderRelatedToolsSection();
            }
            // 2. 우측 하단 "최근 사용" 위젯 (최근 사용 이력 있을 때만)
            if (this.getRecent().length > 0) {
                this.renderRecentWidget();
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', renderAll);
        } else {
            renderAll();
        }
    }
};

// 최근 사용 도구 시스템 초기화
RecentTools.init();
