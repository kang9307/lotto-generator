/**
 * dashboard-data.json 다국어 생성 스크립트
 * Copyright (c) 2025 braindetox.kr
 *
 * 사용법: node generate_dashboard_data.js
 *
 * 기능:
 * - posts/, en/posts/, ja/posts/, zh/posts/ 디렉토리의 HTML 파일 스캔
 * - 메타 태그에서 제목, 날짜, 카테고리, 키워드 추출
 * - 리포지토리 파일 타입 분포 집계
 * - 언어별 dashboard-data.json 출력 (4개)
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

const LANGS = [
    { code: 'ko', dir: 'posts', output: 'dashboard-data.json', uncategorized: '미분류', other: '기타', titleSuffix: / - BrainDetox.*$/, featuredPattern: /가이드|총정리|완벽|complete|guide/i },
    { code: 'en', dir: 'en/posts', output: 'en/dashboard-data.json', uncategorized: 'Uncategorized', other: 'Other', titleSuffix: / - BrainDetox.*$/, featuredPattern: /guide|complete|comprehensive|ultimate/i },
    { code: 'ja', dir: 'ja/posts', output: 'ja/dashboard-data.json', uncategorized: '未分類', other: 'その他', titleSuffix: / - BrainDetox.*$/, featuredPattern: /ガイド|完全|完璧|guide|complete/i },
    { code: 'zh', dir: 'zh/posts', output: 'zh/dashboard-data.json', uncategorized: '未分类', other: '其他', titleSuffix: / - BrainDetox.*$/, featuredPattern: /指南|完全|完整|guide|complete/i },
];

// ========== 카테고리 번역 맵 (미번역 포스트 대응) ==========
const CATEGORY_MAP = {
    en: { '시사/경제':'Current Affairs','IT/기술':'IT/Tech','인공지능':'AI','미분류':'Uncategorized','건강':'Health','일상공감':'Daily Life','생활/건강':'Life/Health','스토리지':'Storage','보안':'Security','생활/트렌드':'Life/Trends','트렌드':'Trends','라이프스타일':'Lifestyle','프로그래밍':'Programming','상식':'General Knowledge','시사/연예':'Entertainment','리눅스':'Linux','네트워크':'Network','금융/경제':'Finance' },
    ja: { '시사/경제':'時事/経済','IT/기술':'IT/技術','인공지능':'人工知能','미분류':'未分類','건강':'健康','일상공감':'日常共感','생활/건강':'生活/健康','스토리지':'ストレージ','보안':'セキュリティ','생활/트렌드':'生活/トレンド','트렌드':'トレンド','라이프스타일':'ライフスタイル','프로그래밍':'プログラミング','상식':'常識','시사/연예':'時事/芸能','리눅스':'Linux','네트워크':'ネットワーク','금융/경제':'金融/経済' },
    zh: { '시사/경제':'时事/经济','IT/기술':'IT/技术','인공지능':'人工智能','미분류':'未分类','건강':'健康','일상공감':'日常共鸣','생활/건강':'生活/健康','스토리지':'存储','보안':'安全','생활/트렌드':'生活/趋势','트렌드':'趋势','라이프스타일':'生活方式','프로그래밍':'编程','상식':'常识','시사/연예':'时事/娱乐','리눅스':'Linux','네트워크':'网络','금융/경제':'金融/经济' },
};

// 영문 카테고리 정규화 (여러 번역 변형을 통합)
const NORMALIZE_MAP = {
    en: { 'IT/Technology':'IT/Tech','Technology':'IT/Tech','Artificial Intelligence':'AI','Business/Economy':'Current Affairs','Current Affairs/Economy':'Current Affairs','Lifestyle/Health':'Life/Health','Lifestyle/Trends':'Life/Trends' },
    ja: { 'IT/テクノロジー':'IT/技術','テクノロジー':'IT/技術','ライフスタイル/健康':'生活/健康','ライフスタイル/トレンド':'生活/トレンド' },
    zh: { 'IT/科技':'IT/技术','科技':'IT/技术' },
};

function translateCategory(category, langCode) {
    if (langCode === 'ko') return category;
    const map = CATEGORY_MAP[langCode];
    // 완전 한국어 카테고리인 경우 번역
    if (map && map[category]) return map[category];
    // 한글이 섞인 깨진 번역 감지 (\uAC00-\uD7AF = Hangul Syllables)
    if (/[\uAC00-\uD7AF]/.test(category)) {
        // 한국어 카테고리 키 중 부분 매칭 시도
        for (const [ko, translated] of Object.entries(map)) {
            if (category.includes(ko.substring(0, 2)) || ko.includes(category.replace(/[^가-힣]/g, ''))) {
                return translated;
            }
        }
        return map['미분류'] || category;
    }
    // 영문 변형 정규화
    const norm = NORMALIZE_MAP[langCode];
    if (norm && norm[category]) return norm[category];
    return category;
}

// ========== 메타데이터 추출 (정규식) ==========
function extractMeta(html) {
    const get = (pattern) => {
        const m = html.match(pattern);
        return m ? m[1].trim() : '';
    };

    const title = get(/<title>([^<]+)<\/title>/i);
    const date = get(/<meta\s+property="article:published_time"\s+content="([^"]+)"/i);
    const category = get(/<meta\s+property="article:section"\s+content="([^"]+)"/i);
    const keywords = get(/<meta\s+name="keywords"\s+content="([^"]+)"/i);
    const description = get(/<meta\s+name="description"\s+content="([^"]+)"/i);

    return { title, date, category, keywords, description };
}

// ========== 포스트 스캔 ==========
function scanPosts(lang) {
    const postsDir = path.join(ROOT, lang.dir);
    if (!fs.existsSync(postsDir)) {
        console.error(`  ${lang.dir}/ 디렉토리를 찾을 수 없습니다.`);
        return [];
    }

    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.html'));
    const posts = [];

    for (const file of files) {
        try {
            const html = fs.readFileSync(path.join(postsDir, file), 'utf-8');
            const meta = extractMeta(html);
            if (meta.title) {
                const rawCategory = meta.category || lang.uncategorized;
                posts.push({
                    filename: file,
                    title: meta.title.replace(lang.titleSuffix, ''),
                    date: meta.date || '',
                    category: translateCategory(rawCategory, lang.code),
                    keywords: meta.keywords,
                    description: meta.description
                });
            }
        } catch (e) {
            console.warn(`  스킵: ${file} - ${e.message}`);
        }
    }

    return posts;
}

// ========== 파일 타입 집계 ==========
function countFileTypes(dir, result = {}, depth = 0) {
    if (depth > 3) return result; // 깊이 제한
    const skipDirs = ['node_modules', '.git', '.github', '.claude'];

    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory()) {
                if (!skipDirs.includes(entry.name)) {
                    countFileTypes(path.join(dir, entry.name), result, depth + 1);
                }
            } else {
                const ext = path.extname(entry.name).toLowerCase().replace('.', '') || 'other';
                result[ext] = (result[ext] || 0) + 1;
            }
        }
    } catch (e) { /* ignore */ }

    return result;
}

// ========== 통계 계산 ==========
function computeStats(posts, featuredPattern) {
    // 카테고리별 카운트
    const categoryCount = {};
    posts.forEach(p => {
        categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
    });

    // 월별 트렌드 (연도별)
    const monthlyTrend = {};
    posts.forEach(p => {
        if (!p.date) return;
        const d = new Date(p.date);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        if (!monthlyTrend[year]) monthlyTrend[year] = {};
        monthlyTrend[year][month] = (monthlyTrend[year][month] || 0) + 1;
    });

    // 키워드 집계
    const kwCount = {};
    const uniqueKw = new Set();
    posts.forEach(p => {
        if (!p.keywords) return;
        p.keywords.split(',').map(k => k.trim()).filter(k => k.length > 1).forEach(k => {
            kwCount[k] = (kwCount[k] || 0) + 1;
            uniqueKw.add(k);
        });
    });
    const topKeywords = Object.entries(kwCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 15);

    // 평균 제목 길이
    const titles = posts.filter(p => p.title);
    const avgTitleLength = titles.length > 0
        ? Math.round(titles.reduce((s, p) => s + p.title.length, 0) / titles.length)
        : 0;

    // 추천(featured) 포스트
    const featuredCount = posts.filter(p =>
        featuredPattern.test(p.title)
    ).length;

    return {
        stats: {
            totalPosts: posts.length,
            totalKeywords: uniqueKw.size,
            categories: Object.keys(categoryCount).length,
            avgTitleLength,
            featuredPosts: featuredCount
        },
        categoryCount,
        monthlyTrend,
        topKeywords
    };
}

// ========== 메인 ==========
function main() {
    console.log('📊 대시보드 데이터 다국어 생성 시작...\n');

    // 파일 타입 집계 (공통)
    console.log('  파일 타입 집계 중...');
    const allFileTypes = countFileTypes(ROOT);
    const mainTypes = ['html', 'js', 'css', 'json', 'md', 'xml', 'txt', 'png', 'jpg', 'svg', 'ico'];
    const totalFiles = Object.values(allFileTypes).reduce((a, b) => a + b, 0);

    for (const lang of LANGS) {
        console.log(`\n── [${lang.code.toUpperCase()}] ${lang.dir}/ 스캔 ──`);

        // 포스트 스캔
        const posts = scanPosts(lang);
        console.log(`  → ${posts.length}개 포스트 발견`);

        // 통계 계산
        const { stats, categoryCount, monthlyTrend, topKeywords } = computeStats(posts, lang.featuredPattern);

        // 파일 타입 (언어별 'other' 라벨)
        const fileTypes = {};
        let otherCount = 0;
        for (const [ext, cnt] of Object.entries(allFileTypes)) {
            if (mainTypes.includes(ext)) {
                fileTypes[ext.toUpperCase()] = cnt;
            } else {
                otherCount += cnt;
            }
        }
        if (otherCount > 0) fileTypes[lang.other] = otherCount;

        // 최신 포스트 (날짜순 상위 12개)
        const recentPosts = posts
            .filter(p => p.date)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 12)
            .map(p => ({
                title: p.title,
                date: p.date,
                category: p.category,
                filename: p.filename
            }));

        // JSON 출력
        const outputPath = path.join(ROOT, lang.output);
        const data = {
            generated: new Date().toISOString(),
            lang: lang.code,
            stats: { ...stats, totalFiles },
            posts: recentPosts,
            categoryCount,
            monthlyTrend,
            topKeywords,
            fileTypes
        };

        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`  ✅ ${lang.output} 생성 완료 (${stats.totalPosts} posts, ${stats.categories} categories)`);
    }

    console.log(`\n══════════════════════════════════════`);
    console.log(`✅ 총 ${LANGS.length}개 언어 dashboard-data.json 생성 완료!`);
    console.log(`  총 파일: ${totalFiles}개`);
}

main();
