# Supabase 설정 가이드

## 🚨 회원가입 에러 해결

`"Database error saving new user"` 에러가 발생하는 경우, 다음 단계를 따라 해결하세요.

## 문제 원인

Supabase Auth는 사용자 계정을 생성한 후, 추가 프로필 정보를 저장하기 위해 `public.users` 테이블을 참조합니다. 이 테이블이 없거나 적절히 설정되지 않으면 회원가입이 실패합니다.

## 해결 방법

### 방법 1: 향상된 설정 (권장) ⭐

1. [Supabase Dashboard](https://app.supabase.com)에 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭
4. `supabase/migrations/002_users_table_enhanced.sql` 파일의 내용을 복사
5. SQL Editor에 붙여넣고 **Run** 클릭

이 설정은 semicolon-devteam/core-supabase를 참고하여 개선된 버전으로:

- login_id와 nickname 지원
- 초대 코드 자동 생성
- Soft delete 지원
- 더 견고한 에러 처리

### 방법 2: 빠른 설정

기본적인 설정만 필요한 경우:

1. SQL Editor에서 `supabase/quick-setup.sql` 실행

### 방법 3: 전체 설정

더 완전한 설정(스토리지 포함)을 원한다면:

1. SQL Editor에서 `supabase/migrations/001_auth_setup.sql` 실행
2. 이 스크립트는 다음을 포함합니다:
   - users 테이블 생성
   - RLS 정책 설정
   - 자동 프로필 생성 트리거
   - 아바타 스토리지 버킷
   - updated_at 자동 업데이트

### 방법 3: Supabase CLI 사용

```bash
# Supabase CLI 설치 (아직 안 했다면)
npm install -g supabase

# 프로젝트 초기화
supabase init

# 로그인
supabase login

# 프로젝트 링크
supabase link --project-ref [your-project-ref]

# 마이그레이션 실행
supabase db push
```

## 설정 확인

설정이 완료되었는지 확인하려면:

1. SQL Editor에서 다음 쿼리 실행:

```sql
-- users 테이블 확인
SELECT * FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'users';

-- 트리거 확인
SELECT * FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

2. 테스트 회원가입 시도

## 추가 설정

### 이메일 인증 설정

1. Supabase Dashboard → Authentication → Providers
2. Email 섹션에서:
   - `Confirm email` 활성화 (권장)
   - `Double confirm email changes` 활성화
   - 이메일 템플릿 커스터마이징

### OAuth 프로바이더 설정

1. Authentication → Providers
2. 원하는 프로바이더 활성화:
   - Google: Client ID와 Secret 입력
   - GitHub: OAuth App 생성 후 정보 입력
3. Redirect URL 설정:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```

### 환경 변수 설정

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 문제 해결

### 여전히 에러가 발생하는 경우

1. **RLS 정책 확인**:

```sql
SELECT * FROM pg_policies WHERE tablename = 'users';
```

2. **트리거 함수 로그 확인**:

```sql
-- 트리거 함수를 디버그 모드로 수정
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  RAISE LOG 'Creating user profile for %', NEW.id;

  INSERT INTO public.users (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;  -- 중복 방지

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

3. **수동으로 테스트 데이터 삽입**:

```sql
-- Auth 없이 직접 테스트
INSERT INTO public.users (id, email, username)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  'testuser'
);
```

## 보안 고려사항

1. **Service Role Key**는 서버 사이드에서만 사용
2. **RLS 정책**을 항상 활성화
3. **사용자 입력**을 항상 검증
4. **민감한 데이터**는 별도 테이블에 암호화하여 저장

## 관련 문서

- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)
- [Database Triggers](https://supabase.com/docs/guides/database/triggers)
