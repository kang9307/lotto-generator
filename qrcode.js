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
    let qrcode = null; // QR 코드 객체 저장
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
    
    // QR 코드 생성 함수
    function generateQRCode(data) {
        // 기존 QR 코드가 있다면 초기화
        qrcodeOutput.innerHTML = '';
        
        try {
            // BOM 제거 및 UTF-8 텍스트 처리
            data = removeBOM(data);
            
            // 원본 데이터 저장
            const originalData = data;
            
            // 특수문자 처리를 위한 추가 인코딩 처리
            data = handleSpecialCharacters(data);
            
            // 데이터 길이 체크 (한글은 UTF-8에서 한 글자당 3바이트)
            const estimatedLength = new Blob([data]).size;
            
            // 데이터 길이가 너무 길면 경고 표시
            if (estimatedLength > 500) {
                const warnEl = document.createElement('div');
                warnEl.style.color = 'orange';
                warnEl.style.marginBottom = '10px';
                warnEl.textContent = '⚠️ 데이터가 너무 깁니다. QR 코드가 인식되지 않을 수 있습니다.';
                qrcodeOutput.appendChild(warnEl);
            }
            
            // QR 코드 옵션 설정
            const errorLevel = getErrorCorrectionLevel(errorCorrectionSelect ? errorCorrectionSelect.value : 'M'); // 기본값을 M으로 설정
            const size = qrcodeSize;
            const fgColor = foregroundColorPicker ? foregroundColorPicker.value : '#000000';
            const bgColor = backgroundColorPicker ? backgroundColorPicker.value : '#FFFFFF';
            
            // QR 코드 생성
            qrcode = new QRCode(qrcodeOutput, {
                text: data,
                width: size,
                height: size,
                colorDark: fgColor,
                colorLight: bgColor,
                correctLevel: errorLevel
            });
            
            // Base64 인코딩된 데이터인 경우 디코딩 방법 안내 표시
            if (data.startsWith('BASE64:')) {
                const infoEl = document.createElement('div');
                infoEl.style.marginTop = '15px';
                infoEl.style.padding = '10px';
                infoEl.style.backgroundColor = '#f8f9fa';
                infoEl.style.border = '1px solid #ddd';
                infoEl.style.borderRadius = '5px';
                infoEl.style.fontSize = '0.9rem';
                
                // 원본 텍스트 표시
                const originalTextEl = document.createElement('div');
                originalTextEl.style.marginBottom = '10px';
                originalTextEl.innerHTML = `<strong>원본 텍스트:</strong> <span style="word-break: break-all;">${originalData}</span>`;
                infoEl.appendChild(originalTextEl);
                
                // 디코딩 방법 안내
                const decodingInfoEl = document.createElement('div');
                decodingInfoEl.innerHTML = `
                    <p style="margin: 5px 0;"><strong>📱 QR 스캔 시 참고사항:</strong></p>
                    <p style="margin: 5px 0;">이 QR 코드는 한글 및 특수문자를 보존하기 위해 Base64로 인코딩되었습니다. 
                    일부 QR 코드 스캐너 앱에서는 자동으로 디코딩되지 않을 수 있습니다.</p>
                    <p style="margin: 5px 0;">스캔 결과가 <code>BASE64:...</code>로 시작하면 다음 웹사이트에서 디코딩할 수 있습니다:</p>
                    <a href="https://www.base64decode.org/" target="_blank" style="color: #3498db;">Base64 디코딩 사이트</a>
                `;
                infoEl.appendChild(decodingInfoEl);
                
                qrcodeOutput.appendChild(infoEl);
            }
        } catch (error) {
            console.error("QR 코드 생성 오류:", error);
            
            // 사용자 친화적인 오류 메시지 표시
            let errorMessage = '오류가 발생했습니다.';
            
            if (error.message && error.message.includes('overflow')) {
                errorMessage = '입력한 텍스트가 너무 깁니다. 더 짧은 텍스트를 입력하거나 설정에서 오류 수정 레벨을 "낮음(L)"으로 변경해 보세요.';
            }
            
            qrcodeOutput.innerHTML = `<p style="color: red; padding: 15px; background-color: #fff5f5; border-radius: 5px; border: 1px solid #ffcccc;">${errorMessage}</p>`;
        }
    }
    
    // UTF-8 BOM 제거 및 인코딩 처리 함수
    function removeBOM(text) {
        // BOM 제거 (UTF-8 BOM: \uFEFF)
        if (text.charCodeAt(0) === 0xFEFF) {
            text = text.substring(1);
        }
        
        // 한글 깨짐 방지를 위한 처리
        try {
            // 순수 한글 텍스트 처리를 위한 방법
            if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text)) {
                // 한글이 포함된 경우 TextEncoder를 사용하여 UTF-8로 변환
                return text; // 라이브러리가 알아서 처리하도록 함
            }
        } catch (e) {
            console.error("텍스트 인코딩 오류:", e);
        }
        
        return text;
    }
    
    // 특수문자 처리 함수 (한글과 특수문자 조합 처리)
    function handleSpecialCharacters(text) {
        try {
            // 한글이 포함되어 있는지 확인
            if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text)) {
                console.log("한글이 포함되어 있습니다. 안정적인 인코딩 처리를 적용합니다.");
                
                // Base64 인코딩 모드 사용 여부 확인
                const useBase64Encoding = document.getElementById('use-base64') ? document.getElementById('use-base64').checked : true;
                
                // 모든 한글 텍스트에 강화된 인코딩 처리 적용 (띄어쓰기 포함)
                // Base64 인코딩으로 모든 문자를 안전하게 처리
                if (useBase64Encoding) {
                    try {
                        // TextEncoder를 사용하여 UTF-8 바이트 배열로 변환
                        const encoder = new TextEncoder();
                        const utf8Bytes = encoder.encode(text);
                        
                        // UTF-8 바이트 배열을 Base64로 인코딩
                        const base64 = btoa(String.fromCharCode.apply(null, utf8Bytes));
                        
                        // Base64 문자열에 특별 마커 추가
                        const markedData = "BASE64:" + base64;
                        
                        // 디버그 로그
                        console.log("Base64 인코딩 적용됨: ", markedData);
                        
                        // QR 코드 생성 시 사용자에게 안내 메시지 표시
                        const warnEl = document.createElement('div');
                        warnEl.style.color = 'blue';
                        warnEl.style.marginBottom = '10px';
                        warnEl.style.fontSize = '0.8rem';
                        warnEl.textContent = '💡 한글 인코딩 모드가 적용되었습니다. QR 스캔 시 앱에 따라 Base64 디코딩이 필요할 수 있습니다.';
                        
                        // 이미 생성된 경고 메시지가 있는지 확인하고 없으면 추가
                        const existingWarning = document.querySelector('[data-warning="encoding"]');
                        if (!existingWarning && qrcodeOutput) {
                            warnEl.setAttribute('data-warning', 'encoding');
                            qrcodeOutput.appendChild(warnEl);
                        }
                        
                        return markedData;
                    } catch (encodeError) {
                        console.error("Base64 인코딩 오류:", encodeError);
                        // 인코딩 실패 시 기존 방식으로 폴백
                    }
                }
                
                // 기존 방식 (Base64 인코딩을 사용하지 않거나 실패한 경우)
                // 한글과 특수문자가 함께 있는지 확인
                if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣].*[-_\/\\\[\]{}()<>!@#$%^&*+=|:;,.?~\s]|[-_\/\\\[\]{}()<>!@#$%^&*+=|:;,.?~\s].*[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text)) {
                    console.log("한글과 특수문자/공백이 함께 포함되어 있습니다.");
                    
                    // 특수문자를 안전하게 처리
                    let processedText = text;
                    
                    // 문제가 되는 특수문자 처리 (띄어쓰기 포함)
                    const specialChars = [' ', '-', '_', '/', '\\', '[', ']', '{', '}', '(', ')', '<', '>', '!', '@', '#', '$', '%', '^', '&', '*', '+', '=', '|', ':', ';', ',', '.', '?', '~'];
                    
                    // 먼저 특수문자를 임시 마커로 변환
                    specialChars.forEach((char, index) => {
                        const marker = `__SPECIAL_${index}__`;
                        const regex = new RegExp('\\' + char, 'g');
                        processedText = processedText.replace(regex, marker);
                    });
                    
                    // 한글과 마커가 포함된 텍스트를 인코딩/디코딩
                    processedText = decodeURIComponent(encodeURIComponent(processedText));
                    
                    // 마커를 다시 원래 특수문자로 변환
                    specialChars.forEach((char, index) => {
                        const marker = `__SPECIAL_${index}__`;
                        const regex = new RegExp(marker, 'g');
                        processedText = processedText.replace(regex, char);
                    });
                    
                    return processedText;
                }
            }
        } catch (e) {
            console.error("특수문자 처리 오류:", e);
        }
        
        return text;
    }
    
    // 오류 수정 레벨 변환 함수
    function getErrorCorrectionLevel(level) {
        switch (level) {
            case 'L': return QRCode.CorrectLevel.L; // 약 7% 복원
            case 'M': return QRCode.CorrectLevel.M; // 약 15% 복원
            case 'Q': return QRCode.CorrectLevel.Q; // 약 25% 복원
            case 'H': return QRCode.CorrectLevel.H; // 약 30% 복원
            default: return QRCode.CorrectLevel.M; // 기본값을 M으로 변경 (더 안정적인 오류 수정)
        }
    }
    
    // QR 코드 데이터 형식 생성 함수
    function getQRCodeData(type) {
        let data = '';
        
        switch (type) {
            case 'url':
                // URL은 그대로 사용
                data = urlInput.value;
                break;
            case 'text':
                // 일반 텍스트 처리 - 한글은 그대로 사용
                data = urlInput.value;
                break;
            case 'wifi':
                const ssid = document.getElementById('wifi-ssid').value;
                const password = document.getElementById('wifi-password').value;
                const security = document.getElementById('wifi-security').value;
                const isHidden = document.getElementById('wifi-hidden').checked;
                // WIFI 포맷 (특수문자 처리를 위해 세미콜론 이스케이프 필요)
                data = `WIFI:S:${ssid.replace(/;/g, "\\;")};T:${security};P:${password.replace(/;/g, "\\;")};H:${isHidden ? 'true' : 'false'};;`;
                break;
            case 'contact':
                const name = document.getElementById('contact-name').value;
                const phone = document.getElementById('contact-phone').value;
                const email = document.getElementById('contact-email').value;
                const address = document.getElementById('contact-address').value;
                // vCard 형식 (개행문자 처리)
                data = `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nTEL:${phone}\nEMAIL:${email}\nADR:${address}\nEND:VCARD`;
                break;
            case 'email':
                const emailAddress = document.getElementById('email-address').value;
                const subject = document.getElementById('email-subject').value;
                const body = document.getElementById('email-body').value;
                // 이메일 형식
                data = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                break;
            case 'sms':
                const smsPhone = document.getElementById('sms-phone').value;
                const message = document.getElementById('sms-message').value;
                // SMS 메시지 형식
                data = `smsto:${smsPhone}:${message}`;
                break;
            case 'location':
                const lat = document.getElementById('location-lat').value;
                const lng = document.getElementById('location-lng').value;
                // 위치 정보 형식
                data = `geo:${lat},${lng}`;
                break;
            default:
                data = urlInput.value;
        }
        
        // 데이터 길이 검사 및 제한 (최대 900바이트로 제한)
        const dataLength = new Blob([data]).size;
        if (dataLength > 900) {
            alert('입력한 데이터가 너무 깁니다. QR 코드에는 약 500바이트까지 저장할 수 있습니다.\n(한글은 글자당 3바이트를 차지합니다)');
            // 긴 텍스트를 자동으로 자르기
            if (type === 'text' || type === 'url') {
                // 한글이 포함된 텍스트는 약 150자로 제한 (대략 450바이트)
                return data.substring(0, 150);
            }
        }
        
        return data;
    }
    
    // 생성 버튼 클릭 이벤트
    generateBtn.addEventListener('click', function() {
        const type = qrcodeType.value;
        const data = getQRCodeData(type);
        
        // 데이터가 비어있으면 생성하지 않음
        if (!data || data.trim() === '') {
            alert('QR 코드로 생성할 데이터를 입력해주세요.');
            return;
        }
        
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
                document.querySelector('label[for="url-input"]').textContent = '웹사이트 주소 (URL):';
                urlInput.placeholder = 'https://example.com';
                document.getElementById('input-notice').style.display = 'none';
                document.getElementById('encoding-option').style.display = 'none';
                break;
            case 'text':
                urlForm.style.display = 'block';
                document.querySelector('label[for="url-input"]').textContent = '일반 텍스트:';
                urlInput.placeholder = '여기에 텍스트를 입력하세요 (한글은 약 150자 이내로 입력)';
                document.getElementById('input-notice').style.display = 'block';
                document.getElementById('encoding-option').style.display = 'block';
                break;
            case 'wifi':
                wifiForm.style.display = 'block';
                document.getElementById('input-notice').style.display = 'none';
                document.getElementById('encoding-option').style.display = 'none';
                break;
            case 'contact':
                contactForm.style.display = 'block';
                document.getElementById('input-notice').style.display = 'none';
                document.getElementById('encoding-option').style.display = 'block'; // 연락처에는 한글이 포함될 수 있어 인코딩 옵션 표시
                break;
            case 'email':
                emailForm.style.display = 'block';
                document.getElementById('input-notice').style.display = 'none';
                document.getElementById('encoding-option').style.display = 'block'; // 이메일 제목/내용에 한글 포함될 수 있음
                break;
            case 'sms':
                smsForm.style.display = 'block';
                document.getElementById('input-notice').style.display = 'none';
                document.getElementById('encoding-option').style.display = 'block'; // SMS 메시지에 한글 포함될 수 있음
                break;
            case 'location':
                locationForm.style.display = 'block';
                document.getElementById('input-notice').style.display = 'none';
                document.getElementById('encoding-option').style.display = 'none';
                break;
        }
        
        // 유형이 변경되면 안내 메시지 업데이트
        updateTypeGuidance(type);
    });
    
    // QR 코드 유형에 따른 안내 메시지 업데이트
    function updateTypeGuidance(type) {
        const guideTab = document.getElementById('guide');
        if (!guideTab) return;
        
        // 기존 QR 길이 안내 제거
        const existingGuide = document.getElementById('qr-size-guide');
        if (existingGuide) {
            existingGuide.remove();
        }
        
        // 안내 요소 생성
        const guide = document.createElement('div');
        guide.id = 'qr-size-guide';
        guide.style.marginTop = '20px';
        guide.style.padding = '15px';
        guide.style.backgroundColor = '#f8f9fa';
        guide.style.borderRadius = '5px';
        guide.style.borderLeft = '4px solid #3498db';
        
        // 유형별 안내 메시지
        let message = '';
        switch (type) {
            case 'text':
                message = '<strong>텍스트 길이 제한:</strong> QR 코드는 저장할 수 있는 데이터 양에 제한이 있습니다. 한글은 영문보다 더 많은 공간을 차지하므로, 약 150자 이내로 입력하는 것이 좋습니다.';
                break;
            case 'url':
                message = '<strong>URL 길이 제한:</strong> 너무 긴 URL은 QR 코드 인식이 어려울 수 있습니다. 가능하면 URL 단축 서비스를 이용하세요.';
                break;
            case 'wifi':
                message = '<strong>WiFi 정보:</strong> WiFi 이름(SSID)과 비밀번호에 특수문자가 포함된 경우에도 정상적으로 인식됩니다.';
                break;
            case 'contact':
                message = '<strong>연락처 정보:</strong> 이름, 전화번호, 이메일, 주소 등의 정보를 모두 입력할 필요는 없습니다. 필요한 정보만 입력하세요.';
                break;
            default:
                message = '<strong>데이터 길이 제한:</strong> QR 코드에 저장할 수 있는 데이터 양에는 제한이 있습니다. 너무 많은 정보를 입력하면 QR 코드가 생성되지 않을 수 있습니다.';
        }
        
        guide.innerHTML = message;
        
        // 가이드 탭에 안내 추가
        const helpContent = guideTab.querySelector('.help-content');
        if (helpContent) {
            helpContent.appendChild(guide);
        }
    }
    
    // PNG 다운로드 기능
    downloadBtn.addEventListener('click', function() {
        if (!qrcode) return;
        
        try {
            // 이미지 URL 가져오기 (qrcodejs 라이브러리의 구조에 맞춤)
            const img = qrcodeOutput.querySelector('img');
            if (!img) return;
            
            // 다운로드 링크 생성
            const link = document.createElement('a');
            link.href = img.src;
            link.download = 'qrcode.png';
            link.click();
        } catch (error) {
            console.error("다운로드 오류:", error);
            alert("QR 코드 다운로드 중 오류가 발생했습니다.");
        }
    });
    
    // 설정 적용 버튼 클릭 이벤트
    applySettingsBtn.addEventListener('click', function() {
        // 설정 적용
        qrcodeSize = parseInt(sizeSlider.value);
        
        // 현재 QR 코드 재생성
        const currentType = qrcodeType.value;
        const data = getQRCodeData(currentType);
        generateQRCode(data);
    });
    
    // 초기 QR 코드 생성
    generateQRCode(urlInput.value);
}); 