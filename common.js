/**
 * 동적 헤더와 푸터 로딩을 위한 JavaScript
 * Copyright (c) 2025 braindetox.kr
 */

document.addEventListener('DOMContentLoaded', function() {
    // 헤더 로드
    fetch('components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            
            // 현재 페이지 URL 기반으로 활성 메뉴 설정
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const menuLinks = document.querySelectorAll('.nav-link');
            menuLinks.forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    link.classList.add('active');
                }
            });
        })
        .catch(error => {
            console.error('헤더를 로드하는 중 오류가 발생했습니다:', error);
            document.getElementById('header-placeholder').innerHTML = '<p>헤더를 로드할 수 없습니다.</p>';
        });
    
    // 푸터 로드
    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => {
            console.error('푸터를 로드하는 중 오류가 발생했습니다:', error);
            document.getElementById('footer-placeholder').innerHTML = '<p>푸터를 로드할 수 없습니다.</p>';
        });
}); 