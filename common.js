/**
 * 동적 헤더와 푸터 로딩을 위한 JavaScript
 * Copyright (c) 2025 braindetox.kr
 */

document.addEventListener('DOMContentLoaded', function() {
    // 환경 감지 (로컬 파일 시스템인지 웹 서버인지)
    const isLocalFileSystem = window.location.protocol === 'file:';
    
    if (isLocalFileSystem) {
        // 로컬 파일 시스템에서는 하드코딩된 HTML 사용
        const headerHTML = `
        <header class="main-header">
            <div class="header-container">
                <h1 class="site-title"><a href="index.html" style="color: inherit; text-decoration: none;">BrainDetox Utility Box</a></h1>
                <nav class="main-nav">
                    <ul class="nav-list">
                        <li class="nav-item">
                            <a href="index.html" class="nav-link">홈</a>
                        </li>
                        <li class="nav-item">
                            <a href="blog.html" class="nav-link">기술 블로그</a>
                        </li>
                        <li class="nav-item">
                            <a href="lotto.html" class="nav-link">로또 번호 생성기</a>
                        </li>
                        <li class="nav-item">
                            <a href="subnet.html" class="nav-link">서브넷 계산기</a>
                        </li>
                        <li class="nav-item">
                            <a href="password.html" class="nav-link">비밀번호 생성기</a>
                        </li>
                        <li class="nav-item">
                            <a href="qrcode.html" class="nav-link">QR 코드 생성기</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>`;

        const footerHTML = `
        <footer class="main-footer">
            <div class="footer-container">
                <p class="footer-text">
                    &copy; 2025 BrainDetox Utility Box. 모든 권리 보유.
                </p>
                <p class="footer-text">
                    사이트 내 모든 도구는 무료로 제공되며, 문의사항은 이메일(<a href="mailto:jhtoka@gmail.com" class="footer-link">jhtoka@gmail.com</a>)로 연락 바랍니다.
                </p>
                <p class="footer-text">
                    <a href="privacy.html" class="footer-link">개인정보 처리방침</a> | <a href="privacy.html" class="footer-link">Privacy Policy</a>
                </p>
            </div>
        </footer>`;

        document.getElementById('header-placeholder').innerHTML = headerHTML;
        document.getElementById('footer-placeholder').innerHTML = footerHTML;
        setupActiveMenu();
    } else {
        // 웹 서버 환경에서는 fetch API 사용 (더 현대적인 방식)
        fetch('components/header.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header-placeholder').innerHTML = data;
                setupActiveMenu();
            })
            .catch(error => {
                console.error('헤더를 로드하는 중 오류가 발생했습니다:', error);
                document.getElementById('header-placeholder').innerHTML = '<p>헤더를 로드할 수 없습니다.</p>';
            });
        
        fetch('components/footer.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('footer-placeholder').innerHTML = data;
            })
            .catch(error => {
                console.error('푸터를 로드하는 중 오류가 발생했습니다:', error);
                document.getElementById('footer-placeholder').innerHTML = '<p>푸터를 로드할 수 없습니다.</p>';
            });
    }
    
    // 현재 페이지에 맞는 메뉴 활성화
    function setupActiveMenu() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const menuLinks = document.querySelectorAll('.nav-link');
        menuLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
}); 