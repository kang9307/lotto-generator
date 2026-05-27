# dev.to 발행 패키지

## 제목 (택 1)

**옵션 A (추천 - 스토리 + 가치)**:
```
I built 6 free dev tools to skip the signup walls — here's what I learned
```

**옵션 B (정보형)**:
```
6 dev tools I built to replace jwt.io, Postman, and curlbuilder.com — no signup needed
```

**옵션 C (호기심)**:
```
Why I stopped using jwt.io and built my own JWT decoder (and 5 other tools)
```

## 태그 (정확히 4개, dev.to 기본)

```
#webdev #showdev #productivity #devtools
```

## 커버 이미지

braindetox.kr/site_logo.png 또는 직접 만든 도구 스크린샷 모자이크 권장. 없으면 dev.to 기본 자동 이미지 사용 OK.

## 본문 (그대로 복사해서 dev.to editor에 붙여넣기)

---

You know that moment when you just want to decode a JWT, but [jwt.io](https://jwt.io) wants you to log in to "save your tokens"? Or when you need a quick curl command and Postman's 200MB Electron app feels like overkill?

I had that moment too many times in 2025, so over the past year I built **6 small dev tools** to replace the ones with signup walls, ads, and heavy apps. All free, all in the browser, no account needed. Here's what I built, why each one is different, and what I learned along the way.

## 1. JWT Decoder — privacy-first, no library

🔗 [JWT Decoder](https://braindetox.kr/en/static/jwt_decoder.html)

**The problem:** Most online JWT decoders ask you to paste your token into a remote server. For a *secret* token. With *signature verification*. That's how data leaks happen.

**What I built:**
- Decode, generate, verify in one page
- HS256 / HS512 using the **Web Crypto API** (zero external libraries)
- Tokens never leave your browser — all crypto runs locally
- Color-coded segments (header / payload / signature)
- `exp` / `iat` / `nbf` shown as relative time + ISO-8601

If you've ever pasted a production JWT into jwt.io and felt a small wave of regret, this one is for you.

## 2. SSH Config Generator — visual `~/.ssh/config`

🔗 [SSH Config Generator](https://braindetox.kr/en/static/ssh_config_generator.html)

**The problem:** Editing `~/.ssh/config` for a bastion + 5 internal hosts is a special kind of pain. ProxyJump syntax is unforgiving.

**What I built:**
- Visual multi-host editor
- ProxyJump (bastion host) support
- Port forwarding (LocalForward, RemoteForward, DynamicForward)
- 4 presets: AWS EC2, DigitalOcean, Bastion+Internal, Dev+LocalForward
- Output: monospace preview + copy + download `.txt` + `chmod 600` reminder

I made this after the third time I tunneled through the wrong host trying to reach a Kubernetes node.

## 3. iptables Generator — 50 real-world scenarios

🔗 [iptables Generator](https://braindetox.kr/en/static/iptables_generator.html)

**The problem:** iptables documentation is dense, and getting 5 rules right under pressure is harder than it should be.

**What I built:**
- Rule builder for common patterns: SSH hardening, DDoS rate limiting, Docker bridge, Kubernetes node, NAT/port forwarding
- 50 ready-to-paste scenarios — pick one, edit IPs/ports, you're done
- Tested against the actual iptables syntax (no AI hallucination)
- Both `iptables` and `iptables-save` formats

A reasonable middle ground between "memorize the man page" and "ask AI and hope."

## 4. curl Command Builder — 4-language output

🔗 [curl Command Builder](https://braindetox.kr/en/static/curl_builder.html)

**The problem:** curl is great until you need to translate it to fetch/axios/Python requests for a teammate's stack.

**What I built:**
- GUI to build any curl command (headers, body, auth, file upload)
- 8 common options as toggles (`-k`, `-v`, `-L`, `-i`, `-s`, `--compressed`, `-o`, `--max-time`)
- **Simultaneous output in 4 formats**: curl, fetch (JS), axios, Python requests
- 6 presets: GET, POST JSON, Bearer Token, Form Data, File Download, Reset

The 4-language output is what I missed in every other curl builder I tried.

## 5. YAML / JSON Converter — with k8s and Helm presets

🔗 [YAML/JSON Converter](https://braindetox.kr/en/static/yaml_json_converter.html)

**The problem:** Most YAML/JSON converters are one-way and stuck in 2018 UX.

**What I built:**
- Real-time bidirectional conversion
- Auto-detect input format (YAML or JSON)
- 5 presets: Kubernetes Service, docker-compose, Helm values, GitHub Actions, plain JSON
- Key sorting toggle
- 3-column grid on desktop, vertical on mobile

The Helm values preset alone has saved me an embarrassing number of `helm install` attempts.

## 6. HTTP Status Codes — 100+ codes with usage scenarios

🔗 [HTTP Status Codes](https://braindetox.kr/en/static/http_status_codes.html)

**The problem:** Quick — what's the difference between 401, 403, and 451?

**What I built:**
- 100+ codes across 1xx, 2xx, 3xx, 4xx, 5xx
- Real-time search and category filter with color-coded borders
- POPULAR badge for the codes you actually see (200, 301, 401, 403, 404, 500, 503)
- "When to use" scenarios for each
- FAQ section with 6 common questions

It's a reference, not a calculator, but it's the reference I open three times a week.

---

## What I learned building these

A few things that surprised me:

**1. Privacy is a feature, not a sermon.**
For tools that handle secrets (JWTs, SSH configs), running everything in-browser with no server is a *concrete user benefit*. People notice. They share the link to colleagues with "this one doesn't phone home."

**2. Multi-language matters more than you think.**
I shipped all 6 tools in 4 languages (English, Korean, Japanese, Chinese). Watching the analytics, ~30% of the traffic uses a non-English version. If the tool is for "the global dev community," shipping English-only is leaving 30% on the table.

**3. Presets > options.**
Every tool above has 4–6 presets at the top. They get used way more than the manual builder. A new user wants "give me AWS EC2 SSH config" not "let me fill in 17 fields." Defaults to a working starting point beats power-user flexibility for first-time use.

**4. `<details>` is underused.**
The HTTP Status Codes page uses 100+ `<details>` elements for the per-code explanations. They collapse by default, search works across all of them (because content is in the DOM), and the page weighs less than a single React component would.

**5. Building in public is slow but cumulative.**
None of these tools went viral on day one. But six months in, the steady search traffic from "free jwt decoder," "ssh config generator," "iptables rate limit example" adds up. The flywheel is real, just slower than every marketing post claims.

## Try them, break them, tell me

All 6 are free, no signup, no telemetry beyond Google Analytics on the marketing pages:

- [JWT Decoder](https://braindetox.kr/en/static/jwt_decoder.html)
- [SSH Config Generator](https://braindetox.kr/en/static/ssh_config_generator.html)
- [iptables Generator](https://braindetox.kr/en/static/iptables_generator.html)
- [curl Command Builder](https://braindetox.kr/en/static/curl_builder.html)
- [YAML/JSON Converter](https://braindetox.kr/en/static/yaml_json_converter.html)
- [HTTP Status Codes](https://braindetox.kr/en/static/http_status_codes.html)

If something breaks or you wish a tool had a specific preset, the comments are the fastest place to reach me. I read everything.

Thanks for reading — and may your `iptables` rules always work on the first try.

---

## 발행 시 주의사항

### dev.to 에디터에서 설정
1. **Title**: 위 옵션 중 하나
2. **Tags**: `#webdev #showdev #productivity #devtools` (정확히 4개)
3. **Cover image**: 선택사항, 없어도 OK
4. **Series**: 공란 (단편)
5. **Canonical URL**: 비워두기 (dev.to를 원본으로)

### 작성 후 체크리스트
- [ ] 모든 링크 클릭해서 페이지 정상 로드 확인
- [ ] 미리보기로 마크다운 렌더링 확인
- [ ] 본문에 braindetox.kr 링크 6개 (도구별 1개씩)
- [ ] "Lessons learned" 섹션이 너무 홍보처럼 보이지 않게 유지

### 발행 후 (선택사항, 어그로 X)
- 본인 X(Twitter) / LinkedIn에 dev.to 글 1회 공유
- braindetox.kr 자체 블로그에 "I published on dev.to" 같은 메타 글 X (자기 인용 위험)
- 댓글 달리면 답변 (1주일 정도 모니터링)

### 효과 예상
- **1주차**: dev.to 자체 노출 (#showdev 태그) → 100~500 view
- **1개월**: 검색 유입 (Google이 dev.to 도메인 신뢰) → 누적 1,000~3,000 view
- **백링크**: dev.to → braindetox.kr 6개 영구 (도메인 권위 매우 ↑)
- **이상적 시나리오**: 추천 받으면 dev.to 메인 노출 → 1만+ view

### 발행 안 권장
- 같은 글을 medium·hashnode에 동시 발행 → dev.to canonical 이슈
- 매주 발행 → 어그로 인식
- 짧게 6개 도구만 나열 → 가치 ↓

### 다음 단계 (글이 잘 받혀지면)
- 1~2개월 후 "Lessons from running these tools for a year" 후속편
- 도구별 깊이 있는 튜토리얼 1편씩 (총 6개)
