# 다국어 재번역 플랜 (2026-04-14 작성)

## 배경
사전 치환(dictionary word-replacement) 방식으로 번역되어 한국어 조사·어미가 영문/일문/중문 단어와 섞인 파일들. HTML/CSS/JS 로직은 정상, 사용자 노출 텍스트만 파손.
- **Skill `braindetox-tool-gen` 이후 생성된 파일은 깨끗** (환율 계산기 44개 등)
- 이미 처리 완료: `daily_work_calculator` 3개 + `{lang}/static/*` 도구 30개
- **대상 파일 목록은 `REMAINING_RETRANSLATION.json`에 저장됨**

## 잔여 오염 규모
| 구분 | EN | JA | ZH | 합계 |
|------|----|----|----|------|
| 루트 레벨 도구 | 22 | 21 | 22 | **65** |
| 블로그 포스트 | 99 | 92 | 99 | **290** |

## 실행 순서 (우선순위 상→하)

### Phase 1: 루트 레벨 도구 65개 (우선 — SEO 가치 높음)
인기 도구 위주: `lotto.html`, `tetris.html`, `mbti_test.html`, `brain-games.html`, `compatibility_test.html`, `pomodoro.html`, `color_palette.html`, `password.html`, `qrcode.html`, `speed_test.html`, `subnet.html`, `datetime.html`, `unit-converter.html`, `interest_calculator.html`, `docker_builder.html`, `crontab_generator.html`, `rsync_tool.html`, `my_day.html`, `mindfulness.html`, `fortune_tarot.html`, `privacy.html`, `blog.html`(ZH만)

**배치 전략: 언어별 3배치 × 3언어 = 9개 병렬 에이전트**
- EN 배치 1 (8): lotto, tetris, mbti_test, brain-games, compatibility_test, pomodoro, color_palette, password
- EN 배치 2 (8): qrcode, speed_test, subnet, datetime, unit-converter, interest_calculator, docker_builder, crontab_generator
- EN 배치 3 (6): rsync_tool, my_day, mindfulness, fortune_tarot, privacy, (+blog 제외)
- JA 동일 구조 (blog 제외로 21개)
- ZH 동일 구조 (blog 포함 22개)

### Phase 2: 블로그 포스트 290개 (분량 대, 토큰 관리 필요)
- EN 99 / JA 92 / ZH 99
- 1배치당 5~6개 파일, 언어별 ~18배치
- **총 ~54 에이전트**, 3~4세션 분산 권장
- 카테고리별 그룹핑 추천: AI/기술, Ceph, 건강, 금융/경제, 생활

## 에이전트 프롬프트 템플릿
```
Retranslate N corrupted HTML files into natural {TARGET_LANG} at:
c:\Users\Karyu\Webstorage_Drive\00.Swkang_Home\14.Github_Repository\lotto-generator\{lang}\{root|posts}\

Files: [list]

Each file has dictionary-word corruption: Korean particles mixed with {TARGET_LANG} words.

For each file:
1. Read KO source at `...\lotto-generator\<same-path-without-{lang}-prefix>` for intended meaning
2. Read the broken {lang} file
3. Rewrite ALL user-visible text (title, meta, og:*, twitter:*, JSON-LD, body, JS messages) in natural {TARGET_LANG}
4. Keep HTML/CSS/JS/IDs/classes/event handlers UNCHANGED
5. Keep `<html lang="{lang}">`, hreflang/canonical for /{lang}/..., og:locale="{LOCALE}", inLanguage="{LOCALE_FULL}"
6. Korean-specific concepts (jeonse/wolse, 국민연금, zodiac, public holidays) → keep proper names + {TARGET_LANG} explanation, do NOT convert to other countries' systems
7. Korean currency (KRW/원) preserved — this is Korean-targeted content
8. Write each file via Write tool

Report: "Done: N files" with line counts per file.
```

언어별 설정:
| 언어 | lang | locale | inLanguage | 폰트 대체 |
|------|------|--------|------------|----------|
| EN   | en   | en_US  | en-US      | Inter / system |
| JA   | ja   | ja_JP  | ja-JP      | Noto Sans JP |
| ZH   | zh   | zh_CN  | zh-CN      | Noto Sans SC |

## 검증 스크립트 (`_scan_remaining.js` 사용)
```bash
node _scan_remaining.js
```
- 재번역 후 `Clean: X, Corrupted: 0` 이 되어야 완료

## 커밋 전략
- Phase 1 완료 시 1커밋 ("Retranslate root-level multilang tools")
- Phase 2 배치별 커밋 (카테고리 단위로 3~5커밋)
- 사이트맵은 변경 불필요 (URL 불변, 내용만 수정)

## 실행 시작 시 체크리스트
1. `node _scan_remaining.js` 실행 → 현황 재확인 (다른 변경으로 카운트 달라졌을 수 있음)
2. `REMAINING_RETRANSLATION.json` 리스트와 비교
3. 위 프롬프트 템플릿으로 에이전트 3~9개 병렬 실행
4. 완료 후 재검증

---

## Phase 3: 크로스랭귀지 링크 버그 (2026-04-14 발견)

**문제**: `{lang}/**` 파일에서 `href="../tool.html"` 또는 `href="/xxx.html"` 식으로 링크 → 한국어 루트로 이동 (예: `ja/index.html`의 `href="../tetris.html"` → `/tetris.html` 한글 버전 호출).

**규모 (`CROSSLANG_LINK_ISSUES.json` 참조)**:
| 언어 | 고유 타겟 | 총 발생 건수 |
|------|-----------|--------------|
| EN   | 31        | 84           |
| JA   | 31        | 97           |
| ZH   | 31        | 76           |
| **합계** |         | **257**      |

**주요 패턴**:
1. **언어 홈(`{lang}/index.html`)의 도구 카드**: `../tetris.html`, `../lotto.html` 등 23개 도구 × 3언어 = **69건**
2. **블로그 포스트/기타에서 `blog.html`로 링크**: `ja/blog.html` (JA 포스트 31건), 루트 `blog.html` (JA 23건) 등
3. **절대경로 `/static_index.html`**: 언어 prefix 누락 (JA 15건)
4. **다국어 미지원 도구**: `powerball.html`, `megamillions.html`, `doublecolorball.html`, `lotto7.html`, `random_picker.html` 등 → 이들은 KO만 존재하므로 **링크 제거 또는 alternate lang="x-default" 유지가 맞음**

**수정 방식**:
- `../tool.html` → `tool.html` (같은 언어 폴더 내 상대경로)
- 절대경로 `/xxx.html` → `/{lang}/xxx.html`
- 다국어 미지원 도구는 KO 버전 링크하되 `rel="alternate"` 명시 또는 카드 자체 제외
- 블로그 링크 `{lang}/blog.html`는 이미 존재하므로 `blog.html`(상대) 또는 `/{lang}/blog.html`(절대)로

**실행**: node 스크립트로 일괄 치환 가능 (AI 에이전트 불필요, 로직 단순).
Phase 1/2 전에 먼저 해결하는 게 이상적 — 재번역한 파일들이 잘못된 링크 패턴 상속할 수 있음.

**추천 순서**:
1. **Phase 3 먼저 (링크 버그 수정)** — node 스크립트 1회 실행
2. Phase 1 (루트 도구 65개 재번역)
3. Phase 2 (포스트 290개 재번역)
