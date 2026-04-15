# Phase 2 실행 계획 (블로그 포스트 재번역) — 8단계 검증 완료

## 현황
- **잔여**: 99개 고유 포스트 × 평균 3언어 = 약 290 파일 (EN 99 / JA 92 / ZH 99)
- **평균 크기**: 825 라인, 최대 ~2,500 라인

## Phase 1 실데이터 기반 제약
- 1 에이전트당 **2-3 파일**이 최적 (6+ 파일은 ~40% 확률 부분 실패)
- 세션당 **8-10 에이전트** 실행이 한도 안전선
- Claude Max x20 플랜: 주간 한도 ~80% 소모 시 1주 대기

## 8 스테이지 분배 (검증: 중복/누락 0건, 99/99 커버)

| 스테이지 | 주제 | 포스트 수 | × 3언어 | 에이전트 수 |
|---------|------|-----------|---------|-------------|
| 1 | AI / LLM / Claude | 13 | ~39 | 15 |
| 2 | Ceph 스토리지 | 9 | ~27 | 10 |
| 3 | Dev / Linux / SEO | 14 | ~42 | 16 |
| 4 | 건강 / 식단 (일반) | 14 | ~42 | 16 |
| 5 | 한국 정책 / 정치 / 금융 | 14 | ~42 | 16 |
| 6 | 문화 / 트렌드 / 라이프 | 13 | ~39 | 15 |
| 7 | 건강 - 영양제 / 멘탈 | 12 | ~36 | 14 |
| 8 | 기타 / 보안 / 계절 / 운세 | 10 | ~30 | 12 |
| **합계** | | **99** | **~297** | **~114** |

**파일 목록 단일 진실 소스**: `PHASE2_STAGES.json` (배포 직전 자동 생성됨)

---

### Stage 1: AI / LLM / Claude (13)
- `ai_agent_era_2026_productivity_tools_guide`
- `ai_emotion_facetech_future_lifestyle_2025`
- `ai_future_jobs_career_skills`
- `ai_future_social_impact`
- `ai_hyper_personalized_marketing_strategies`
- `ai_technology_2025_comparison`
- `ai_technology_outlook_future_2026`
- `ai_technology_trends_2025_analysis`
- `anthropic_claude_code_complete_guide`
- `artificial_intelligence_intro`
- `claude_code_skills_complete_guide`
- `korea_ai_technology_future`
- `multimodal_ai_content_creation_future`

### Stage 2: Ceph 스토리지 (9)
- `ceph_bucket_monitoring_script`
- `ceph_crush_algorithm_guide`
- `ceph_installation_guide_2025`
- `ceph_performance_optimization_guide`
- `ceph_rados_crush_deep_dive`
- `ceph_rbd_vs_cephfs_comparison`
- `ceph_reef_read_balance_guide`
- `ceph_storage_features_complete_guide`
- `ceph_storage_intro`

### Stage 3: Dev / Linux / SEO 기술 (14)
- `android_version_security`
- `google-search-console-canonical-url`
- `home_office_productivity`
- `javascript_basic`
- `linux_grep_awk`
- `linux_rsync_guide`
- `meta_tags_seo_guide`
- `networking_basic`
- `php_language_guide_part1` ~ `part5`
- `robots_txt_guide`

### Stage 4: 건강 / 식단 (14)
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

### Stage 5: 한국 정책 / 정치 / 금융 (14)
- `2025_government_support_guide`
- `dsr_loan_regulation_3_phase_guide`
- `four_day_workweek_implementation_guide`
- `g7_50th_2025_report`
- `g7_50th_summit_analysis`
- `jeonse_fraud_comprehensive_report`
- `korea_21st_president_inauguration`
- `korea_crisis_diagnosis_2025_june`
- `korea_economic_social_challenges_2025`
- `korea_esg_corporate_trends`
- `korea_presidential_election_2025`
- `korea_youth_child_age_standards`
- `korea_youth_child_age_standards_guide`
- `year_end_tax_settlement_2025_guide`

### Stage 6: 문화 / 트렌드 / 라이프스타일 (13)
- `avoca_life_peaceful_hobbies_guide`
- `climate_sensitivity_eco_friendly_consumption_tips`
- `google_trends_august_2025_week4_analysis`
- `google_trends_july_2025_week3_analysis`
- `korea_top_10_tourist_destinations`
- `kpop_demon_hunters_movie_trend_analysis`
- `new_year_goals_achievement_2026_guide`
- `omnivore_consumer_marketing_strategies_2025`
- `shortform_commerce_success_guide`
- `side_business_trends_2026_top10`
- `squid_game_season3_analysis_complete`
- `topping_economy_personal_customizing_items`
- `yeonggwang_population_trend`

### Stage 7: 건강 - 영양제 / 멘탈 (12)
- `meditation_benefits`
- `menopause_essential_supplements`
- `office_worker_vitamin_solution`
- `quince_benefits_liquor_guide`
- `stress_free_healing_harmless_media_top5`
- `stress_management_meditation`
- `tofu_health_benefits`
- `udca_guide`
- `urusa_drug_effects_side_effects`
- `vitamin_d_benefits`
- `winter_immunity_complete_guide`
- `zinc_intake_guide`

### Stage 8: 기타 / 보안 / 계절 / 운세 (10)
- `lotto_645_comprehensive_guide`
- `sitemap_importance`
- `skt-usim-hacking-precautions`
- `skt_usim_hacking_reauth_guide`
- `summer_electricity_saving_guide`
- `summer_vacation_budget_guide`
- `voice_phishing_fraud_alert`
- `zodiac_horoscope_20250616`
- `zodiac_horoscope_20250617`
- `zodiac_horoscope_20250619`

---

## 에이전트 프롬프트 템플릿 (Posts)

```
Retranslate 2-3 corrupted blog posts into natural {TARGET_LANG} at:
c:\Users\Karyu\Webstorage_Drive\00.Swkang_Home\14.Github_Repository\lotto-generator\{lang}\posts\

Files:
1. <filename1>.html
2. <filename2>.html
(3. <filename3>.html)

Each has dictionary-word corruption: Korean particles mixed with {TARGET_LANG}.

Per file:
1. Read KO source `...\lotto-generator\posts\<same-filename>`
2. Read broken {lang} file
3. Rewrite ALL user-visible text (title, meta, og/twitter, JSON-LD Article/FAQ, body h1/h2/p/li/code labels, footer, share, back-to-list) in natural {TARGET_LANG}
4. Keep HTML/CSS/JS/IDs/classes UNCHANGED
5. `<html lang="{lang}">`, hreflang/canonical /{lang}/posts/..., og:locale="{LOCALE}", inLanguage="{LOCALE_FULL}"
6. Korean-specific (DSR/전세/국민연금/띠/김치/청국장): keep proper names + {TARGET_LANG} explanation; do NOT convert
7. KRW currency preserved
8. Write each via Write tool

Report "Done: N files" with line counts.
```

언어별 메타:
- EN: `en_US` / `en-US`
- JA: `ja_JP` / `ja-JP`
- ZH: `zh_CN` / `zh-CN`

## 스테이지 실행 절차
1. `node _scan_remaining.js` → 잔여 확인
2. `PHASE2_STAGES.json` 에서 해당 Stage 포스트 목록 로드
3. **언어별 분리**: EN/JA/ZH 각 4-5 에이전트 (각 2-3파일)
4. 병렬 실행
5. 부분 실패 시 미완료만 1-2 에이전트 재시도
6. `node _scan_remaining.js` 재검증 → 0건 되어야 완료
7. `git add` + 커밋 (`Retranslate posts stage N/8`)
8. 배포

## 세션 분산 권장
- **스테이지 간 최소 4-5일** (주간 한도 회복)
- 1 스테이지 = 1 세션 (2-3시간)
- **총 8주 완료 예상**

## 병행 옵션: 기계적 임시 치환
에이전트 실행 전 토큰 없이 일반 패턴만 복원:
```js
// "Year"→"년/年/年", "Day"→"일/日/日", "Week"→"주/週/周",
// "Generate기"→"Generator/ジェネレーター/生成器", "Minutes"→"분/分/分"
```
- 완벽한 번역 아님
- 에이전트 0개 소모
- Stage 진행 전 완충재로 실행 가능
