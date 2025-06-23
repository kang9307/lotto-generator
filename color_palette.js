// 색상 팔레트 생성기 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 전역 변수
    let currentPalette = [];
    let currentHarmony = 'monochromatic';
    
    // 초기화
    initializeColorTool();
    
    function initializeColorTool() {
        setupTabNavigation();
        setupColorPickerEvents();
        setupHarmonyButtons();
        setupSliders();
        setupPresetButtons();
        generateInitialPalette();
        updateAccessibility();
    }
    
    // 탭 네비게이션 설정
    function setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                // 모든 탭 버튼과 콘텐츠 비활성화
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // 선택된 탭 활성화
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }
    
    // 색상 피커 이벤트 설정
    function setupColorPickerEvents() {
        const mainColorPicker = document.getElementById('mainColor');
        const converterColorPicker = document.getElementById('converterColor');
        const foregroundColorPicker = document.getElementById('foregroundColor');
        const backgroundColorPicker = document.getElementById('backgroundColor');
        
        mainColorPicker.addEventListener('input', (e) => {
            updateColorValues(e.target.value);
            generatePalette();
        });
        
        converterColorPicker.addEventListener('input', (e) => {
            updateConverterValues(e.target.value);
        });
        
        foregroundColorPicker.addEventListener('input', updateAccessibility);
        backgroundColorPicker.addEventListener('input', updateAccessibility);
        
        // 텍스트 입력 필드 이벤트
        document.getElementById('hexValue').addEventListener('input', (e) => {
            if (isValidHex(e.target.value)) {
                mainColorPicker.value = e.target.value;
                updateColorValues(e.target.value);
                generatePalette();
            }
        });
    }
    
    // 조화 버튼 설정
    function setupHarmonyButtons() {
        const harmonyButtons = document.querySelectorAll('.harmony-btn');
        
        harmonyButtons.forEach(button => {
            button.addEventListener('click', () => {
                harmonyButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentHarmony = button.dataset.harmony;
                generatePalette();
            });
        });
    }
    
    // 슬라이더 설정
    function setupSliders() {
        const colorCountSlider = document.getElementById('colorCount');
        const saturationSlider = document.getElementById('saturation');
        const lightnessSlider = document.getElementById('lightness');
        
        if (colorCountSlider) {
            colorCountSlider.addEventListener('input', (e) => {
                const valueSpan = document.getElementById('colorCountValue');
                if (valueSpan) valueSpan.textContent = e.target.value;
                generatePalette();
            });
        }
        
        if (saturationSlider) {
            saturationSlider.addEventListener('input', (e) => {
                const valueSpan = document.getElementById('saturationValue');
                if (valueSpan) valueSpan.textContent = e.target.value + '%';
                generatePalette();
            });
        }
        
        if (lightnessSlider) {
            lightnessSlider.addEventListener('input', (e) => {
                const valueSpan = document.getElementById('lightnessValue');
                if (valueSpan) valueSpan.textContent = e.target.value + '%';
                generatePalette();
            });
        }
    }
    
    // 프리셋 버튼 설정
    function setupPresetButtons() {
        const presetButtons = document.querySelectorAll('.preset-btn');
        
        presetButtons.forEach(button => {
            button.addEventListener('click', () => {
                const preset = button.dataset.preset;
                if (preset) {
                    applyPreset(preset);
                }
            });
        });
    }
    
    // 색상 값 업데이트
    function updateColorValues(hexColor) {
        const rgb = hexToRgb(hexColor);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        document.getElementById('hexValue').value = hexColor;
        document.getElementById('rgbValue').value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        document.getElementById('hslValue').value = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
    }
    
    // 변환기 값 업데이트
    function updateConverterValues(hexColor) {
        const rgb = hexToRgb(hexColor);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
        
        document.getElementById('convHex').value = hexColor;
        document.getElementById('convRgb').value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
        document.getElementById('convHsl').value = `${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`;
        document.getElementById('convHsv').value = `${Math.round(hsv.h)}, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%`;
        document.getElementById('convCmyk').value = `${Math.round(cmyk.c)}, ${Math.round(cmyk.m)}, ${Math.round(cmyk.y)}, ${Math.round(cmyk.k)}`;
    }
    
    // 팔레트 생성
    function generatePalette() {
        const baseColor = document.getElementById('mainColor').value;
        const colorCount = parseInt(document.getElementById('colorCount').value);
        const saturation = parseInt(document.getElementById('saturation').value);
        const lightness = parseInt(document.getElementById('lightness').value);
        
        currentPalette = generateColorHarmony(baseColor, currentHarmony, colorCount, saturation, lightness);
        displayPalette();
        updateCodeGeneration();
    }
    
    // 색상 조화 생성
    function generateColorHarmony(baseColor, harmony, count, saturation, lightness) {
        const baseHsl = rgbToHsl(...Object.values(hexToRgb(baseColor)));
        const colors = [];
        
        switch (harmony) {
            case 'monochromatic':
                colors.push(...generateMonochromatic(baseHsl, count, saturation, lightness));
                break;
            case 'analogous':
                colors.push(...generateAnalogous(baseHsl, count, saturation, lightness));
                break;
            case 'complementary':
                colors.push(...generateComplementary(baseHsl, count, saturation, lightness));
                break;
            case 'triadic':
                colors.push(...generateTriadic(baseHsl, count, saturation, lightness));
                break;
            case 'split':
                colors.push(...generateSplitComplementary(baseHsl, count, saturation, lightness));
                break;
            case 'tetradic':
                colors.push(...generateTetradic(baseHsl, count, saturation, lightness));
                break;
        }
        
        return colors.map(hsl => hslToHex(hsl.h, hsl.s, hsl.l));
    }
    
    // 단색 조화
    function generateMonochromatic(baseHsl, count, saturation, lightness) {
        const colors = [];
        const lightnessStep = 80 / (count - 1);
        
        for (let i = 0; i < count; i++) {
            colors.push({
                h: baseHsl.h,
                s: saturation,
                l: Math.max(10, Math.min(90, 20 + i * lightnessStep))
            });
        }
        
        return colors;
    }
    
    // 인접색 조화
    function generateAnalogous(baseHsl, count, saturation, lightness) {
        const colors = [];
        const hueStep = 60 / (count - 1);
        
        for (let i = 0; i < count; i++) {
            colors.push({
                h: (baseHsl.h - 30 + i * hueStep + 360) % 360,
                s: saturation,
                l: lightness
            });
        }
        
        return colors;
    }
    
    // 보색 조화
    function generateComplementary(baseHsl, count, saturation, lightness) {
        const colors = [];
        const complementaryHue = (baseHsl.h + 180) % 360;
        
        colors.push({ h: baseHsl.h, s: saturation, l: lightness });
        colors.push({ h: complementaryHue, s: saturation, l: lightness });
        
        // 추가 색상이 필요하면 중간 톤 생성
        for (let i = 2; i < count; i++) {
            const ratio = i / (count - 1);
            colors.push({
                h: i % 2 === 0 ? baseHsl.h : complementaryHue,
                s: saturation * (0.5 + ratio * 0.5),
                l: lightness * (0.7 + ratio * 0.3)
            });
        }
        
        return colors;
    }
    
    // 삼각 조화
    function generateTriadic(baseHsl, count, saturation, lightness) {
        const colors = [];
        const hues = [baseHsl.h, (baseHsl.h + 120) % 360, (baseHsl.h + 240) % 360];
        
        for (let i = 0; i < count; i++) {
            colors.push({
                h: hues[i % 3],
                s: saturation,
                l: lightness + (i > 2 ? (i - 2) * 10 : 0)
            });
        }
        
        return colors;
    }
    
    // 분할 보색
    function generateSplitComplementary(baseHsl, count, saturation, lightness) {
        const colors = [];
        const complementary = (baseHsl.h + 180) % 360;
        
        colors.push({ h: baseHsl.h, s: saturation, l: lightness });
        colors.push({ h: (complementary - 30 + 360) % 360, s: saturation, l: lightness });
        colors.push({ h: (complementary + 30) % 360, s: saturation, l: lightness });
        
        for (let i = 3; i < count; i++) {
            const hue = colors[i % 3].h;
            colors.push({
                h: hue,
                s: saturation * 0.8,
                l: lightness + (i - 2) * 15
            });
        }
        
        return colors;
    }
    
    // 사각 조화
    function generateTetradic(baseHsl, count, saturation, lightness) {
        const colors = [];
        const hues = [
            baseHsl.h,
            (baseHsl.h + 90) % 360,
            (baseHsl.h + 180) % 360,
            (baseHsl.h + 270) % 360
        ];
        
        for (let i = 0; i < count; i++) {
            colors.push({
                h: hues[i % 4],
                s: saturation,
                l: lightness + (i > 3 ? (i - 3) * 10 : 0)
            });
        }
        
        return colors;
    }
    
    // 팔레트 표시
    function displayPalette() {
        const paletteGrid = document.getElementById('paletteGrid');
        paletteGrid.innerHTML = '';
        
        currentPalette.forEach((color, index) => {
            const colorCard = createColorCard(color, index);
            paletteGrid.appendChild(colorCard);
        });
    }
    
    // 색상 카드 생성
    function createColorCard(hexColor, index) {
        const rgb = hexToRgb(hexColor);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        const card = document.createElement('div');
        card.className = 'color-card';
        card.innerHTML = `
            <div class="color-swatch" style="background-color: ${hexColor};">
                <span style="color: ${getContrastColor(hexColor)}; font-weight: bold;">
                    ${index === 0 ? '기본' : `색상 ${index + 1}`}
                </span>
            </div>
            <div class="color-info">
                <div class="color-hex">${hexColor.toUpperCase()}</div>
                <div class="color-values-mini">
                    RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}<br>
                    HSL: ${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%
                </div>
            </div>
        `;
        
        // 클릭시 클립보드 복사
        card.addEventListener('click', () => {
            copyToClipboard(hexColor);
            showToast(`${hexColor} 복사됨!`);
        });
        
        return card;
    }
    
    // 접근성 업데이트
    function updateAccessibility() {
        const foregroundColor = document.getElementById('foregroundColor').value;
        const backgroundColor = document.getElementById('backgroundColor').value;
        
        const contrastRatio = calculateContrastRatio(foregroundColor, backgroundColor);
        const wcagAA = contrastRatio >= 4.5;
        const wcagAAA = contrastRatio >= 7;
        
        document.getElementById('contrastRatio').textContent = `${contrastRatio.toFixed(2)}:1`;
        document.getElementById('wcagAA').className = `wcag-badge ${wcagAA ? 'wcag-pass' : 'wcag-fail'}`;
        document.getElementById('wcagAA').textContent = `WCAG AA ${wcagAA ? '✓' : '✗'}`;
        document.getElementById('wcagAAA').className = `wcag-badge ${wcagAAA ? 'wcag-pass' : 'wcag-fail'}`;
        document.getElementById('wcagAAA').textContent = `WCAG AAA ${wcagAAA ? '✓' : '✗'}`;
        
        const preview = document.getElementById('contrastPreview');
        preview.style.backgroundColor = backgroundColor;
        preview.style.color = foregroundColor;
    }
    
    // 대비율 계산
    function calculateContrastRatio(color1, color2) {
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);
        
        const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
        const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
        
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }
    
    // 휘도 계산
    function getLuminance(r, g, b) {
        const rs = r / 255;
        const gs = g / 255;
        const bs = b / 255;
        
        const rLinear = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
        const gLinear = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
        const bLinear = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);
        
        return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
    }
    
    // 코드 생성 업데이트
    function updateCodeGeneration() {
        const palette = currentPalette;
        
        // CSS 변수
        const cssVars = `:root {\n${palette.map((color, index) => 
            `  --color-${index === 0 ? 'primary' : index === 1 ? 'secondary' : `accent-${index - 1}`}: ${color};`
        ).join('\n')}\n}`;
        
        // Sass 변수
        const sassVars = palette.map((color, index) => 
            `$color-${index === 0 ? 'primary' : index === 1 ? 'secondary' : `accent-${index - 1}`}: ${color};`
        ).join('\n');
        
        // JavaScript 객체
        const jsObj = `const colorPalette = {\n${palette.map((color, index) => 
            `  ${index === 0 ? 'primary' : index === 1 ? 'secondary' : `accent${index - 1}`}: '${color}'`
        ).join(',\n')}\n};`;
        
        // JSON
        const jsonObj = `{\n  "palette": {\n${palette.map((color, index) => 
            `    "${index === 0 ? 'primary' : index === 1 ? 'secondary' : `accent${index - 1}`}": "${color}"`
        ).join(',\n')}\n  }\n}`;
        
        document.getElementById('cssVariables').innerHTML = `<button class="copy-btn" onclick="copyCode('cssVariables')">복사</button>${cssVars}`;
        document.getElementById('sassVariables').innerHTML = `<button class="copy-btn" onclick="copyCode('sassVariables')">복사</button>${sassVars}`;
        document.getElementById('jsObject').innerHTML = `<button class="copy-btn" onclick="copyCode('jsObject')">복사</button>${jsObj}`;
        document.getElementById('jsonData').innerHTML = `<button class="copy-btn" onclick="copyCode('jsonData')">복사</button>${jsonObj}`;
    }
    
    // 프리셋 적용
    function applyPreset(preset) {
        const presets = {
            'modern-blue': { name: '모던 블루', base: '#667eea', harmony: 'monochromatic' },
            'warm-sunset': { name: '따뜻한 석양', base: '#ff6b35', harmony: 'analogous' },
            'nature-green': { name: '자연 그린', base: '#00c851', harmony: 'complementary' },
            'elegant-purple': { name: '우아한 퍼플', base: '#9c27b0', harmony: 'triadic' },
            'vintage-brown': { name: '빈티지 브라운', base: '#8d6e63', harmony: 'split' },
            'ocean-blue': { name: '오션 블루', base: '#0277bd', harmony: 'monochromatic' },
            'spring-pink': { name: '봄 핑크', base: '#e91e63', harmony: 'analogous' },
            'autumn-orange': { name: '가을 오렌지', base: '#ff9800', harmony: 'complementary' },
            'minimalist-gray': { name: '미니멀 그레이', base: '#607d8b', harmony: 'monochromatic' },
            'tropical-teal': { name: '트로피컬 틸', base: '#009688', harmony: 'triadic' },
            'royal-indigo': { name: '로얄 인디고', base: '#3f51b5', harmony: 'split' },
            'sunset-red': { name: '석양 레드', base: '#f44336', harmony: 'tetradic' },
            'forest-deep': { name: '깊은 숲', base: '#2e7d32', harmony: 'analogous' },
            'lavender-soft': { name: '부드러운 라벤더', base: '#9575cd', harmony: 'complementary' },
            'golden-wheat': { name: '황금 밀', base: '#ffc107', harmony: 'split' },
            'midnight-navy': { name: '미드나잇 네이비', base: '#1a237e', harmony: 'monochromatic' },
            'cherry-blossom': { name: '벚꽃', base: '#f8bbd9', harmony: 'analogous' },
            'cyber-neon': { name: '사이버 네온', base: '#00bcd4', harmony: 'triadic' }
        };
        
        const presetData = presets[preset];
        if (presetData) {
            // 메인 색상 설정
            document.getElementById('mainColor').value = presetData.base;
            updateColorValues(presetData.base);
            
            // 조화 이론 버튼 업데이트
            document.querySelectorAll('.harmony-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.harmony === presetData.harmony) {
                    btn.classList.add('active');
                }
            });
            
            // 프리셋 버튼 업데이트
            document.querySelectorAll('.preset-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            const currentPresetBtn = document.querySelector(`[data-preset="${preset}"]`);
            if (currentPresetBtn) {
                currentPresetBtn.classList.add('active');
            }
            
            // 현재 조화 이론 업데이트
            currentHarmony = presetData.harmony;
            
            // 팔레트 생성
            generatePalette();
            
            // 성공 메시지 표시
            showToast(`${presetData.name} 프리셋이 적용되었습니다!`);
        }
    }
    
    // 초기 팔레트 생성
    function generateInitialPalette() {
        generatePalette();
    }
    
    // 소셜 공유 설정
    // 소셜 공유는 HTML에서 처리되므로 여기서는 제거
    
    // 유틸리티 함수들
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return { h: h * 360, s: s * 100, l: l * 100 };
    }
    
    function hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        const r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
        const g = Math.round(hue2rgb(p, q, h) * 255);
        const b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
        
        return rgbToHex(r, g, b);
    }
    
    function rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        
        let h = 0;
        if (delta !== 0) {
            if (max === r) h = ((g - b) / delta) % 6;
            else if (max === g) h = (b - r) / delta + 2;
            else h = (r - g) / delta + 4;
        }
        h = Math.round(h * 60);
        if (h < 0) h += 360;
        
        const s = max === 0 ? 0 : delta / max;
        const v = max;
        
        return { h, s: s * 100, v: v * 100 };
    }
    
    function rgbToCmyk(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const k = 1 - Math.max(r, g, b);
        const c = (1 - r - k) / (1 - k) || 0;
        const m = (1 - g - k) / (1 - k) || 0;
        const y = (1 - b - k) / (1 - k) || 0;
        
        return {
            c: c * 100,
            m: m * 100,
            y: y * 100,
            k: k * 100
        };
    }
    
    function getContrastColor(hexColor) {
        const rgb = hexToRgb(hexColor);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff';
    }
    
    function isValidHex(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }
    
    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }
    
    function showToast(message) {
        // 간단한 토스트 알림
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
});

// 전역 함수들
function generatePalette() {
    const baseColor = document.getElementById('mainColor');
    const colorCount = document.getElementById('colorCount');
    const saturation = document.getElementById('saturation');
    const lightness = document.getElementById('lightness');
    
    if (baseColor && colorCount && saturation && lightness) {
        const baseColorValue = baseColor.value;
        const colorCountValue = parseInt(colorCount.value);
        const saturationValue = parseInt(saturation.value);
        const lightnessValue = parseInt(lightness.value);
        
        // 현재 선택된 조화 유형 찾기
        const activeHarmonyBtn = document.querySelector('.harmony-btn.active');
        const currentHarmony = activeHarmonyBtn ? activeHarmonyBtn.dataset.harmony : 'monochromatic';
        
        // 팔레트 생성 (여기에 팔레트 생성 로직 구현)
        const palette = generateColorHarmonyGlobal(baseColorValue, currentHarmony, colorCountValue, saturationValue, lightnessValue);
        displayPaletteGlobal(palette);
        updateCodeGenerationGlobal(palette);
    }
}

function generateColorHarmonyGlobal(baseColor, harmony, count, saturation, lightness) {
    // 간단한 팔레트 생성 로직
    const colors = [];
    const baseRgb = hexToRgbGlobal(baseColor);
    const baseHsl = rgbToHslGlobal(baseRgb.r, baseRgb.g, baseRgb.b);
    
    for (let i = 0; i < count; i++) {
        let hue = baseHsl.h;
        switch (harmony) {
            case 'analogous':
                hue = (baseHsl.h + i * 30) % 360;
                break;
            case 'complementary':
                hue = i % 2 === 0 ? baseHsl.h : (baseHsl.h + 180) % 360;
                break;
            case 'triadic':
                hue = (baseHsl.h + i * 120) % 360;
                break;
            case 'split':
                if (i === 0) hue = baseHsl.h;
                else if (i === 1) hue = (baseHsl.h + 150) % 360;
                else hue = (baseHsl.h + 210) % 360;
                break;
            case 'tetradic':
                hue = (baseHsl.h + i * 90) % 360;
                break;
            default: // monochromatic
                hue = baseHsl.h;
        }
        
        const adjustedSaturation = harmony === 'monochromatic' ? saturation : Math.max(30, saturation - i * 10);
        const adjustedLightness = lightness + (i - Math.floor(count/2)) * 15;
        
        colors.push(hslToHexGlobal(hue, adjustedSaturation, Math.max(10, Math.min(90, adjustedLightness))));
    }
    
    return colors;
}

function displayPaletteGlobal(colors) {
    const paletteGrid = document.getElementById('paletteGrid');
    if (!paletteGrid) return;
    
    paletteGrid.innerHTML = '';
    
    colors.forEach((color, index) => {
        const colorCard = createColorCardGlobal(color, index);
        paletteGrid.appendChild(colorCard);
    });
}

function createColorCardGlobal(hexColor, index) {
    const card = document.createElement('div');
    card.className = 'color-card';
    
    const rgb = hexToRgbGlobal(hexColor);
    const hsl = rgbToHslGlobal(rgb.r, rgb.g, rgb.b);
    
    card.innerHTML = `
        <div class="color-swatch" style="background-color: ${hexColor};">
            <span style="color: ${getBrightness(hexColor) > 128 ? '#000' : '#fff'}; font-weight: bold;">${index + 1}</span>
        </div>
        <div class="color-info">
            <div class="color-hex">${hexColor}</div>
            <div class="color-values-mini">
                RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}<br>
                HSL: ${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        navigator.clipboard.writeText(hexColor).then(() => {
            showToastGlobal(`${hexColor} 복사됨!`);
        });
    });
    
    return card;
}

function updateCodeGenerationGlobal(colors) {
    // CSS 변수 업데이트
    const cssVars = document.getElementById('cssVariables');
    if (cssVars) {
        let cssCode = ':root {\n';
        colors.forEach((color, index) => {
            cssCode += `  --color-${index + 1}: ${color};\n`;
        });
        cssCode += '}';
        cssVars.textContent = cssCode;
    }
    
    // SCSS 변수 업데이트
    const scssVars = document.getElementById('sassVariables');
    if (scssVars) {
        let scssCode = '';
        colors.forEach((color, index) => {
            scssCode += `$color-${index + 1}: ${color};\n`;
        });
        scssVars.textContent = scssCode;
    }
    
    // JavaScript 객체 업데이트
    const jsObj = document.getElementById('jsObject');
    if (jsObj) {
        let jsCode = 'const colorPalette = {\n';
        colors.forEach((color, index) => {
            jsCode += `  color${index + 1}: '${color}',\n`;
        });
        jsCode += '};';
        jsObj.textContent = jsCode;
    }
    
    // JSON 데이터 업데이트
    const jsonData = document.getElementById('jsonData');
    if (jsonData) {
        const palette = {};
        colors.forEach((color, index) => {
            palette[`color${index + 1}`] = color;
        });
        jsonData.textContent = JSON.stringify({ palette }, null, 2);
    }
}

function hexToRgbGlobal(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHslGlobal(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHexGlobal(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    const r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
    const g = Math.round(hue2rgb(p, q, h) * 255);
    const b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
    
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function getBrightness(hex) {
    const rgb = hexToRgbGlobal(hex);
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
}

function copyCode(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent.replace('복사', '').trim();
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToastGlobal('코드가 복사되었습니다!');
        });
    } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToastGlobal('코드가 복사되었습니다!');
    }
}

function showToastGlobal(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
