#!/usr/bin/env node
/**
 * 메타 description 자동 보강 스크립트
 * - 120자 미만인 description을 150~160자로 보강
 * - title + h1 + 첫 p 텍스트를 조합하여 자연스러운 description 생성
 * - 기존 description이 있으면 확장, 없으면 새로 생성
 */
const fs = require('fs');
const path = require('path');

const MIN_LENGTH = 120;
const TARGET_LENGTH = 155;
const SKIP_FILES = new Set(['404.html', 'post_template.html', 'privacy.html', 'dashboard.html']);

let fixed = 0;
let skipped = 0;
let total = 0;

function extractText(html, tag) {
    const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const m = html.match(re);
    if (!m) return '';
    // HTML 태그 제거, 엔티티 디코드
    return m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
}

function getTitle(html) {
    const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (!m) return '';
    // " - BrainDetox..." 같은 접미사 제거
    return m[1].replace(/\s*[-|]\s*(BrainDetox|braindetox).*$/i, '').trim();
}

function getFirstParagraph(html) {
    // post-content 또는 articleBody 내부의 첫 p 태그
    const bodyMatch = html.match(/class=["']post-content["'][^>]*>([\s\S]*)/i) ||
                      html.match(/itemprop=["']articleBody["'][^>]*>([\s\S]*)/i) ||
                      html.match(/<main[^>]*>([\s\S]*)/i);
    if (!bodyMatch) return '';
    const body = bodyMatch[1];
    const pMatch = body.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (!pMatch) return '';
    return pMatch[1].replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildDescription(html, existingDesc) {
    const title = getTitle(html);
    const h1 = extractText(html, 'h1');
    const firstP = getFirstParagraph(html);

    // 기존 description이 있고 어느 정도 유용하면 확장
    if (existingDesc && existingDesc.length >= 30) {
        // 부족한 부분을 firstP로 보충
        if (existingDesc.length < TARGET_LENGTH && firstP) {
            const remaining = TARGET_LENGTH - existingDesc.length - 2;
            if (remaining > 20) {
                const supplement = firstP.substring(0, remaining);
                const lastSpace = supplement.lastIndexOf(' ');
                const clean = lastSpace > 10 ? supplement.substring(0, lastSpace) : supplement;
                return (existingDesc + ' ' + clean).substring(0, TARGET_LENGTH).trim();
            }
        }
        return existingDesc; // 이미 있으면 그대로 (30자 이상)
    }

    // description이 없거나 너무 짧으면 새로 생성
    let desc = '';

    // 전략: h1 또는 title + firstP 조합
    const heading = h1 || title;
    if (heading && firstP) {
        desc = heading + ' - ' + firstP;
    } else if (heading) {
        desc = heading;
    } else if (firstP) {
        desc = firstP;
    }

    // TARGET_LENGTH로 자르기 (단어 단위)
    if (desc.length > TARGET_LENGTH) {
        desc = desc.substring(0, TARGET_LENGTH);
        const lastSpace = desc.lastIndexOf(' ');
        if (lastSpace > TARGET_LENGTH * 0.6) {
            desc = desc.substring(0, lastSpace);
        }
        // 마침표/쉼표로 깔끔하게 자르기
        const lastPeriod = desc.lastIndexOf('.');
        const lastComma = desc.lastIndexOf(',');
        const cutAt = Math.max(lastPeriod, lastComma);
        if (cutAt > TARGET_LENGTH * 0.6) {
            desc = desc.substring(0, cutAt + 1);
        }
    }

    return desc.trim();
}

function processFile(filePath) {
    total++;
    let html = fs.readFileSync(filePath, 'utf8');

    // 현재 description 추출
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
    const currentDesc = descMatch ? descMatch[1] : '';

    if (currentDesc.length >= MIN_LENGTH) {
        skipped++;
        return; // 이미 충분히 길면 스킵
    }

    // 새 description 생성
    const newDesc = buildDescription(html, currentDesc);

    if (!newDesc || newDesc.length < 30) {
        // 생성 실패 (콘텐츠 부족)
        skipped++;
        return;
    }

    // description이 이미 충분하거나 개선 안 됐으면 스킵
    if (newDesc === currentDesc || newDesc.length <= currentDesc.length) {
        skipped++;
        return;
    }

    // 안전하게 큰따옴표/작은따옴표 이스케이프
    const safeDesc = newDesc.replace(/"/g, '&quot;').replace(/'/g, '&#39;');

    if (descMatch) {
        // 기존 description 교체
        html = html.replace(descMatch[0], `<meta name="description" content="${safeDesc}">`);
    } else {
        // description이 없으면 title 다음에 추가
        const titleMatch = html.match(/<\/title>/i);
        if (titleMatch) {
            const insertAt = html.indexOf(titleMatch[0]) + titleMatch[0].length;
            html = html.substring(0, insertAt) + `\n    <meta name="description" content="${safeDesc}">` + html.substring(insertAt);
        }
    }

    fs.writeFileSync(filePath, html);
    fixed++;
}

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (['posts', 'static', 'en', 'ja', 'zh'].includes(entry.name) ||
                dir.includes('en') || dir.includes('ja') || dir.includes('zh')) {
                walk(fullPath);
            }
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            if (SKIP_FILES.has(entry.name) || entry.name.startsWith('naver') || entry.name.startsWith('_')) continue;
            processFile(fullPath);
        }
    }
}

console.log('=== 메타 description 자동 보강 ===\n');
walk('.');
console.log(`총 검사: ${total}`);
console.log(`수정됨: ${fixed}`);
console.log(`스킵: ${skipped}`);
console.log(`\n완료.`);
