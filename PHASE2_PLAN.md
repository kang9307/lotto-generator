# Phase 2 실행 계획 (블로그 포스트 재번역) — 8단계 분산

## 현황
- **잔여**: 99개 고유 포스트 × 평균 3언어 = 약 290 파일 (EN 99 / JA 92 / ZH 99)
- **평균 크기**: 825 라인, 최대 ~2,500 라인
- **총 볼륨**: ~240,000 라인

## Phase 1 실데이터 기반 제약
- 1 에이전트당 2-3 파일이 최적 (6+ 파일은 60% 확률로 부분 실패)
- 세션당 8-10 에이전트 실행이 한도 안전선
- Claude Max x20 플랜: 주간 한도 ~80% 소모 시 1주 대기

## 8 스테이지 구성 (세션당 12-15 에이전트)

세션당 **12-13 고유 포스트 × 3언어 ≈ 36-40 파일**, 에이전트 **13-15개**.

### Stage 1: AI/LLM (12 포스트 × 3언어 = 36 파일)
- `ai_agent_era_2026_productivity_tools_guide`
- `ai_emotion_facetech_future_lifestyle_2025`
- `ai_future_jobs_career_skills`
- `ai_future_social_impact`
- `ai_hyper_personalized_marketing_strategies`
- `ai_technology_2025_comparison`
- `ai_technology_outlook_future_2026`
- `ai_technology_trends_2025_analysis`
- `artificial_intelligence_intro`
- `anthropic_claude_code_complete_guide`
- `claude_code_skills_complete_guide`
- `korea_ai_technology_future`

### Stage 2: Ceph 스토리지 시리즈 (9 포스트 × 3언어 = 27 파일)
- `ceph_bucket_monitoring_script`
- `ceph_crush_algorithm_guide`
- `ceph_installation_guide_2025`
- `ceph_performance_optimization_guide`
- `ceph_rados_crush_deep_dive`
- `ceph_rbd_vs_cephfs_comparison`
- `ceph_reef_read_balance_guide`
- `ceph_storage_features_complete_guide`
- `ceph_storage_intro`

### Stage 3: 리눅스/기술 (12 포스트 × 3언어 = ~35 파일)
- `linux_grep_awk`
- `linux_rsync_guide`
- `android_version_security`
- `javascript_basic`
- `google-search-console-canonical-url`
- `google_trends_august_2025_week4_analysis`
- `google_trends_july_2025_week3_analysis`
- `korea_esg_corporate_trends`
- `home_office_productivity`
- (추가 2-3개는 세션 시 선택)

### Stage 4: 건강/의학 (12 포스트 × 3언어 = ~35 파일)
- `anemia_breathlessness`
- `cheonggukjang_benefits`
- `coffee_alternative_vitamin_energy`
- `coffee_fatty_liver`
- `dash_diet_guide`
- `digital_detox_guide`
- `fatty_liver_diet`
- `healthy_diet_nutrition`
- `immune_system_overview`
- `immunity_boost_lifestyle`
- `insomnia_solutions`
- `knee_joint_health`
- `korean_traditional_herbs`
- `kudzu_root_benefits_juice_liquor_guide`

### Stage 5: 금융/경제/정책 (12 포스트 × 3언어)
- `2025_government_support_guide`
- `dsr_loan_regulation_3_phase_guide`
- `four_day_workweek_implementation_guide`
- `jeonse_fraud_comprehensive_report`
- `korea_crisis_diagnosis_2025_june`
- `korea_economic_social_challenges_2025`
- `korea_presidential_election_2025`
- `korea_21st_president_inauguration`
- `korea_youth_child_age_standards`
- `korea_youth_child_age_standards_guide`
- `g7_50th_2025_report`
- `g7_50th_summit_analysis`

### Stage 6: 라이프스타일/문화/여행 (12 포스트)
- `avoca_life_peaceful_hobbies_guide`
- `climate_sensitivity_eco_friendly_consumption_tips`
- `korea_top_10_tourist_destinations`
- `kpop_demon_hunters_movie_trend_analysis`
- 기타 나머지에서 12개 선택

### Stage 7: 기타 1 (13-15 포스트)
`REMAINING_RETRANSLATION.json`에서 미처리 중 13-15개 선택

### Stage 8: 기타 2 + 마무리 검증 (13-15 포스트)
최종 남은 포스트 + 전체 재검증

## 실행 간격 권장
- **스테이지 간 최소 4-5일 간격** (주간 한도 회복)
- 1 스테이지 = 1세션 (2-3시간)
- **총 8주에 걸쳐 완료**

## 에이전트 프롬프트 템플릿

```
Retranslate 2-3 corrupted blog posts into natural {TARGET_LANG} at:
c:\Users\Karyu\Webstorage_Drive\00.Swkang_Home\14.Github_Repository\lotto-generator\{lang}\posts\

Files:
1. <filename1>.html
2. <filename2>.html
3. <filename3>.html (optional)

Each has dictionary-word corruption: Korean particles mixed with {TARGET_LANG} words.

Per file:
1. Read KO source `...\lotto-generator\posts\<same-filename>`
2. Read broken {lang} file
3. Rewrite ALL user-visible text (title, meta, og/twitter, JSON-LD Article/FAQ, body h1/h2/p/li/code labels if Korean, footer, share buttons, back-to-list link) in natural {TARGET_LANG}
4. Keep HTML/CSS/JS/IDs/classes UNCHANGED
5. `<html lang="{lang}">`, hreflang/canonical /{lang}/posts/..., og:locale="{LOCALE}", inLanguage="{LOCALE_FULL}"
6. Korean-specific concepts (DSR/전세/국민연금/띠/김치/된장/청국장): keep proper names + {TARGET_LANG} explanation; do NOT convert to foreign equivalents
7. KRW currency preserved
8. Write each via Write tool

Report "Done: N files" with line counts.
```

언어별:
- EN: `en_US` / `en-US`
- JA: `ja_JP` / `ja-JP`
- ZH: `zh_CN` / `zh-CN`

## 각 스테이지 실행 절차
1. `node _scan_remaining.js` 로 잔여 재확인
2. 해당 스테이지의 12-15 포스트 선택
3. **언어별 분리**: EN 에이전트 4-5개 (각 2-3파일), JA 동일, ZH 동일
4. 병렬 실행 대기
5. 부분 실패 시 미완료 파일만 재시도 (1-2 에이전트)
6. `node _scan_remaining.js` 재검증
7. `git add` + 커밋 ("Retranslate posts stage N/8")
8. 배포 (필요 시)

## 기계 사전 치환 옵션 (병행 가능)
완전 번역 전 임시 완화책:
```js
// "Year" → "년/年/年", "Day" → "일/日/日", "Week" → "주/週/周", "Generate기" → "Generator/ジェネレーター/生成器"
```
- 완벽하진 않지만 가독성 확보
- 에이전트 0개 소모
- Stage 진행 전 실행 가능

## 예상 총량
- 세션: 8회 × 2-3시간 = 총 20시간
- 주간 한도 사용: 세션당 ~20-30% (안전 범위)
- 완료 기간: **8주**
