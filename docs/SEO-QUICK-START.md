# SEO 빠른 시작 가이드

## 1분 요약

### GTM 설정 (한 번만)

```
1. SEO 대시보드 접속
2. GTM Container ID 입력 → 생성
3. 생성된 코드를 프로젝트 layout.tsx에 복사
```

### 웹훅 연동 (새 글 자동 색인)

```typescript
// 글 발행 API에 추가

// 1. 키워드 자동 조회
const { keywords } = await fetch(
  "https://www.semi-colon.space/api/dashboard/seo/keywords?projectId=jungchipan",
).then((r) => r.json());

// 2. 웹훅 호출
await fetch("https://www.semi-colon.space/api/dashboard/seo/webhook", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: "https://도메인/posts/슬러그",
    host: "도메인",
    title: "글제목",
    keywords, // 자동으로 가져온 키워드
  }),
});
```

### 수동 색인 요청

```
1. 대시보드 → IndexNow 섹션
2. URL 입력
3. 제출
```

---

## 체크리스트

### 새 프로젝트 SEO 설정

- [ ] GTM Container 생성
- [ ] GTM 코드 layout.tsx에 적용
- [ ] Search Console 등록
- [ ] seo-projects.ts에 프로젝트 추가
- [ ] 웹훅 연동 코드 추가
- [ ] IndexNow 키 파일 배포 (`/{key}.txt`)

### 환경변수

```env
# 필수
GOOGLE_CLIENT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
INDEXNOW_KEY=...

# 권장
GROQ_API_KEY=...
```

---

## API 엔드포인트

| 기능           | Method | URL                                      |
| -------------- | ------ | ---------------------------------------- |
| 웹훅           | POST   | `/api/dashboard/seo/webhook`             |
| IndexNow       | POST   | `/api/dashboard/seo/indexnow`            |
| GTM 코드 생성  | POST   | `/api/dashboard/seo/gtm-tags`            |
| 주간 리포트    | POST   | `/api/dashboard/seo/weekly-report`       |
| 키워드 조회    | GET    | `/api/dashboard/seo/keywords?projectId=` |
| Search Console | GET    | `/api/dashboard/search-console`          |

---

## 자주 묻는 질문

**Q: GTM 코드는 한 번만 적용하면 되나요?**
A: 네, layout.tsx에 한 번 적용하면 모든 페이지에 자동 적용됩니다.

**Q: 웹훅이 실패하면 글 발행도 실패하나요?**
A: 아니요, try-catch로 감싸서 웹훅 실패와 무관하게 글은 발행됩니다.

**Q: IndexNow 요청 후 언제 색인되나요?**
A: 보통 몇 시간 내, 최대 며칠 내 색인됩니다. (검색엔진 상황에 따라 다름)

---

상세 가이드: [SEO-DASHBOARD-GUIDE.md](./SEO-DASHBOARD-GUIDE.md)
