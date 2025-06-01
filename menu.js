/**
 * 늙은아이의 유틸리티 창고 - 메뉴 데이터
 * Copyright (c) 2023-2025
 */

// 메뉴 데이터 배열
const menuItems = [
    {
        id: 'home',
        name: '홈',
        url: 'index.html',
        isActive: false
    },
    {
        id: 'lotto',
        name: '로또',
        url: 'lotto.html',
        isActive: false
    },
    {
        id: 'subnet',
        name: '서브넷 계산기',
        url: 'subnet.html',
        isActive: false
    }
    // 추가 메뉴는 여기에 계속 추가할 수 있습니다
];

// 현재 페이지 URL에 따라 메뉴 활성화 처리
document.addEventListener('DOMContentLoaded', function() {
    // 현재 페이지 URL 가져오기
    const currentPageURL = window.location.pathname.split('/').pop();
    
    // 현재 페이지에 해당하는 메뉴 찾기
    let currentMenuItem = menuItems.find(item => item.url === currentPageURL);
    
    // index.html이 생략된 경우 처리 (예: 도메인만 입력한 경우)
    if (!currentMenuItem && (currentPageURL === '' || currentPageURL === '/')) {
        currentMenuItem = menuItems.find(item => item.id === 'home');
    }
    
    // 메뉴 활성화 표시
    if (currentMenuItem) {
        const activeMenuLink = document.querySelector(`.nav-link[href="${currentMenuItem.url}"]`);
        if (activeMenuLink) {
            activeMenuLink.classList.add('active');
        }
    }
}); 