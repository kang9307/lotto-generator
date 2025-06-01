/**
 * QR 코드 생성기 (QR Code Generator)
 * Copyright (c) 2025 braindetox.kr
 * All rights reserved.
 * 
 * 사유 라이센스 (Proprietary License):
 * 이 소프트웨어는 braindetox.kr의 독점 소유물입니다.
 * 저작권자의 명시적인 서면 허가 없이 이 소프트웨어의 전체 또는 일부를
 * 복제, 수정, 배포하거나 파생 작업을 생성하는 것을 금지합니다.
 * 
 * 이 코드의 무단 복제 및 재배포를 금지합니다.
 * Unauthorized copying or redistribution of this code is prohibited.
 */

document.addEventListener('DOMContentLoaded', function() {
    // 탭 기능
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // 활성 탭 변경
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 활성 컨텐츠 변경
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // QR 코드 설정
    let qrcodeSize = 200;
    const qrcodeType = document.getElementById('qrcode-type');
    const urlInput = document.getElementById('url-input');
    const generateBtn = document.getElementById('generate-qrcode');
    const qrcodeOutput = document.getElementById('qrcode-output');
    const downloadBtn = document.getElementById('download-png');
    
    // 설정 관련 요소
    const sizeSlider = document.getElementById('qrcode-size');
    const sizeValueDisplay = document.getElementById('size-value');
    const errorCorrectionSelect = document.getElementById('error-correction');
    const foregroundColorPicker = document.getElementById('qrcode-foreground');
    const backgroundColorPicker = document.getElementById('qrcode-background');
    const applySettingsBtn = document.getElementById('apply-settings');
    
    // 각 유형별 폼 요소
    const urlForm = document.querySelector('.form-group');
    const wifiForm = document.getElementById('wifi-form');
    const contactForm = document.getElementById('contact-form');
    const emailForm = document.getElementById('email-form');
    const smsForm = document.getElementById('sms-form');
    const locationForm = document.getElementById('location-form');
    
    // 슬라이더 값 변경 시 표시 업데이트
    sizeSlider.addEventListener('input', function() {
        sizeValueDisplay.textContent = this.value + ' x ' + this.value + ' px';
    });
    
    // 모든 폼 숨기기 함수
    function hideAllForms() {
        urlForm.style.display = 'none';
        wifiForm.style.display = 'none';
        contactForm.style.display = 'none';
        emailForm.style.display = 'none';
        smsForm.style.display = 'none';
        locationForm.style.display = 'none';
    }
    
    // 기본 QR 코드 생성
    generateQRCode(urlInput.value);
    
    // QR 코드 생성 함수
    function generateQRCode(data) {
        qrcodeOutput.innerHTML = '';
        
        const errorCorrectionLevel = errorCorrectionSelect ? errorCorrectionSelect.value : 'M';
        const qr = qrcode(0, errorCorrectionLevel);
        qr.addData(data);
        qr.make();
        
        const qrImage = qr.createImgTag(4);
        qrcodeOutput.innerHTML = qrImage;
        
        // 이미지 스타일 적용
        const img = qrcodeOutput.querySelector('img');
        if (img) {
            img.style.width = qrcodeSize + 'px';
            img.style.height = qrcodeSize + 'px';
            img.style.display = 'block';
            img.style.margin = '0 auto';
            
            // 설정된 색상 적용 (단순화된 방식)
            if (foregroundColorPicker && backgroundColorPicker) {
                // 배경색 적용
                img.style.backgroundColor = backgroundColorPicker.value;
                
                // QR 코드 색상 적용을 위한 Canvas 사용
                if (foregroundColorPicker.value !== '#000000') {
                    applyColorToQRCode(img, foregroundColorPicker.value, backgroundColorPicker.value);
                }
            }
        }
    }
    
    // QR 코드 이미지에 색상 적용하는 함수
    function applyColorToQRCode(img, foreColor, backColor) {
        // 이미지가 로드된 후 Canvas에 그리고 색상 변경
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 캔버스 크기 설정
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 원본 이미지 그리기
            ctx.drawImage(img, 0, 0, img.width, img.height);
            
            // 이미지 데이터 가져오기
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // 각 픽셀에 대해 색상 변환
            const foreR = parseInt(foreColor.substr(1, 2), 16);
            const foreG = parseInt(foreColor.substr(3, 2), 16);
            const foreB = parseInt(foreColor.substr(5, 2), 16);
            
            const backR = parseInt(backColor.substr(1, 2), 16);
            const backG = parseInt(backColor.substr(3, 2), 16);
            const backB = parseInt(backColor.substr(5, 2), 16);
            
            for (let i = 0; i < data.length; i += 4) {
                // 검은색(QR 코드) 부분만 지정된 색상으로 변경
                if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
                    data[i] = foreR;     // R
                    data[i + 1] = foreG; // G
                    data[i + 2] = foreB; // B
                }
                // 흰색(배경) 부분은 배경색으로 변경
                else if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
                    data[i] = backR;     // R
                    data[i + 1] = backG; // G
                    data[i + 2] = backB; // B
                }
            }
            
            // 변경된 이미지 데이터를 캔버스에 다시 그리기
            ctx.putImageData(imageData, 0, 0);
            
            // 변경된 이미지로 교체
            img.src = canvas.toDataURL('image/png');
        };
    }
    
    // 생성 버튼 클릭 이벤트
    generateBtn.addEventListener('click', function() {
        const type = qrcodeType.value;
        const data = getQRCodeData(type);
        generateQRCode(data);
    });
    
    // QR 코드 유형 변경 시 레이블 업데이트
    qrcodeType.addEventListener('change', function() {
        const type = qrcodeType.value;
        
        // 모든 폼 숨기기
        hideAllForms();
        
        // 선택된 유형에 따라 적절한 폼 표시
        switch (type) {
            case 'url':
                urlForm.style.display = 'block';
                break;
            case 'text':
                urlForm.style.display = 'block';
                document.querySelector('label[for="url-input"]').textContent = '일반 텍스트:';
                urlInput.placeholder = '여기에 텍스트를 입력하세요';
                break;
            case 'wifi':
                wifiForm.style.display = 'block';
                break;
            case 'contact':
                contactForm.style.display = 'block';
                break;
            case 'email':
                emailForm.style.display = 'block';
                break;
            case 'sms':
                smsForm.style.display = 'block';
                break;
            case 'location':
                locationForm.style.display = 'block';
                break;
        }
    });
    
    // PNG 다운로드 기능
    downloadBtn.addEventListener('click', function() {
        const img = qrcodeOutput.querySelector('img');
        if (!img) return;
        
        // Canvas 생성 및 이미지 그리기
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const tempImg = new Image();
        
        tempImg.onload = function() {
            canvas.width = tempImg.width;
            canvas.height = tempImg.height;
            context.drawImage(tempImg, 0, 0);
            
            // 다운로드 링크 생성
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'qrcode.png';
            link.click();
        };
        
        tempImg.src = img.src;
    });
    
    // 설정 적용 버튼 클릭 이벤트
    applySettingsBtn.addEventListener('click', function() {
        // 설정 적용
        qrcodeSize = parseInt(sizeSlider.value);
        
        // 현재 활성화된 탭의 내용을 가져와 QR 코드 재생성
        const currentType = qrcodeType.value;
        let data = '';
        
        // 입력 데이터 형식 생성 로직 분리 (코드 중복 제거)
        data = getQRCodeData(currentType);
        
        // QR 코드 재생성
        generateQRCode(data);
    });
    
    // QR 코드 데이터 형식 생성 함수 (코드 중복 제거)
    function getQRCodeData(type) {
        let data = '';
        
        switch (type) {
            case 'url':
            case 'text':
                data = urlInput.value;
                break;
            case 'wifi':
                const ssid = document.getElementById('wifi-ssid').value;
                const password = document.getElementById('wifi-password').value;
                const security = document.getElementById('wifi-security').value;
                const isHidden = document.getElementById('wifi-hidden').checked;
                data = `WIFI:S:${ssid};T:${security};P:${password};H:${isHidden ? 'true' : 'false'};;`;
                break;
            case 'contact':
                const name = document.getElementById('contact-name').value;
                const phone = document.getElementById('contact-phone').value;
                const email = document.getElementById('contact-email').value;
                const address = document.getElementById('contact-address').value;
                data = `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nTEL:${phone}\nEMAIL:${email}\nADR:${address}\nEND:VCARD`;
                break;
            case 'email':
                const emailAddress = document.getElementById('email-address').value;
                const subject = document.getElementById('email-subject').value;
                const body = document.getElementById('email-body').value;
                data = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                break;
            case 'sms':
                const smsPhone = document.getElementById('sms-phone').value;
                const message = document.getElementById('sms-message').value;
                data = `smsto:${smsPhone}:${message}`;
                break;
            case 'location':
                const lat = document.getElementById('location-lat').value;
                const lng = document.getElementById('location-lng').value;
                data = `geo:${lat},${lng}`;
                break;
            default:
                data = urlInput.value;
        }
        
        return data;
    }
}); 