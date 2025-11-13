# Vercel 배포 가이드

## 빌드 테스트 완료 ✅

### 빌드 결과

- **빌드 상태**: ✅ 성공
- **빌드 시간**: ~30초
- **번들 사이즈**:
  - First Load JS: 105 kB (최적화됨)
  - 최대 청크: 196 kB (517-8542b2eaceb2e94d.js)
  - Middleware: 67.8 kB

### 페이지 빌드 타입

- **정적 페이지 (SSG)**: `/`, `/_not-found`
- **동적 페이지 (SSR)**: `/auth/login`, `/auth/register`, `/dashboard`, `/profile`
- **API Routes**: `/api/auth/check-nickname`

## Vercel 배포 준비사항

### 1. 환경 변수 설정 (필수)

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

```
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App URL (자동 설정됨)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 2. Vercel 프로젝트 설정

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `.next` (기본값)
- **Install Command**: `npm install` (기본값)
- **Node.js Version**: 18.x 이상

### 3. 배포 명령어

```bash
# Vercel CLI로 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 4. 배포 체크리스트

- [x] 빌드 성공
- [x] TypeScript 타입 체크 통과
- [x] ESLint 검사 통과
- [x] 번들 사이즈 최적화 확인
- [x] 환경 변수 설정 파일 준비 (.env.production.example)
- [x] vercel.json 설정 완료
- [x] Production 서버 테스트 완료

### 5. 성능 지표

- **First Load JS**: 105 kB ✅ (목표: < 150 kB)
- **최대 청크 크기**: 196 kB ✅ (목표: < 250 kB)
- **정적 최적화**: 홈페이지 SSG 적용 ✅

### 6. 주의사항

- Supabase 환경 변수는 반드시 Vercel 대시보드에서 설정
- `SUPABASE_SERVICE_ROLE_KEY`는 민감한 정보이므로 절대 클라이언트 코드에 노출 금지
- 한국 리전(icn1) 설정으로 국내 사용자 성능 최적화

## 배포 후 확인사항

1. 로그인/회원가입 기능 테스트
2. OAuth 로그인 (Google, GitHub) 동작 확인
3. 인증 콜백 URL이 올바르게 설정되었는지 확인
4. Supabase 대시보드에서 Production URL 허용 목록 추가
