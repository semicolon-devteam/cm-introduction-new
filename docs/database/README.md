# Database Setup Guide

## 📋 파일 설명

### 1. `reset-and-create-boards.sql` ⭐ 권장

**용도**: 기존 게시판 데이터를 완전히 삭제하고 새 샘플 게시판 생성

**포함 내용**:

- ✅ STEP 1: 기존 데이터 삭제 (board_categories, board_users, boards)
- ✅ STEP 2: 8개 샘플 게시판 생성
- ✅ STEP 3: 14개 카테고리 생성
- ✅ STEP 4: 생성 확인 쿼리

**실행 방법**:

```bash
# Supabase Dashboard → SQL Editor
# 1. reset-and-create-boards.sql 파일 내용 복사
# 2. SQL Editor에 붙여넣기
# 3. Run 클릭
```

**결과**:

- 기존 게시판 모두 삭제
- 템플릿용 8개 게시판 생성 (ID: 100, 200, 300, 400, 500, 600, 700, 800)
- 14개 카테고리 생성

---

### 2. `sample-boards.sql`

**용도**: 기존 데이터를 유지하면서 샘플 게시판만 추가

**포함 내용**:

- 8개 샘플 게시판 INSERT 문
- 14개 카테고리 INSERT 문

**실행 방법**:

```bash
# Supabase Dashboard → SQL Editor
# sample-boards.sql 파일 실행
```

**주의사항**:

- 기존 게시판과 ID 충돌 가능
- ID 100, 200, 300... 이 이미 존재하면 오류 발생

---

## 🚀 빠른 시작

### Option 1: 완전 리셋 (권장) ⭐

```bash
# 1. Supabase Dashboard 접속
# https://supabase.com/dashboard/project/wloqfachtbxceqikzosi

# 2. SQL Editor 메뉴 클릭

# 3. reset-and-create-boards.sql 내용 붙여넣기

# 4. Run 클릭

# 5. 확인 쿼리 결과 확인:
# - total_boards: 8
# - total_categories: 14
```

### Option 2: 기존 데이터 유지하고 추가

```bash
# 1. Supabase Dashboard → SQL Editor

# 2. sample-boards.sql 내용 붙여넣기

# 3. Run 클릭
```

---

## 📊 생성되는 게시판 목록

| ID  | 게시판명   | 시연 케이스        | visibility |
| --- | ---------- | ------------------ | ---------- |
| 100 | 공지사항   | 관리자 전용 쓰기   | public     |
| 200 | 자유게시판 | 비회원 작성 가능   | public     |
| 300 | 정보공유   | 카테고리 활용      | public     |
| 400 | 파일자료실 | 대용량 파일 업로드 | public     |
| 500 | 1:1문의    | 비밀글 기능        | public     |
| 600 | 회원전용   | Private 게시판     | private    |
| 700 | 갤러리     | 이미지 전용        | public     |
| 800 | VIP라운지  | Hidden + 고레벨    | hidden     |

---

## 🔍 생성 후 확인 방법

### 1. 게시판 목록 조회

```sql
SELECT
  id,
  name,
  visibility,
  permission_settings->>'write_level' as write_level,
  feature_settings->>'use_category' as use_category
FROM boards
ORDER BY id;
```

### 2. 카테고리 목록 조회

```sql
SELECT
  b.name as board_name,
  bc.name as category_name,
  bc.display_order
FROM board_categories bc
JOIN boards b ON bc.board_id = b.id
ORDER BY b.id, bc.display_order;
```

### 3. 게시판별 카테고리 개수

```sql
SELECT
  b.name as board_name,
  COUNT(bc.id) as category_count
FROM boards b
LEFT JOIN board_categories bc ON b.id = bc.board_id
GROUP BY b.id, b.name
ORDER BY b.id;
```

**예상 결과**:
| board_name | category_count |
|------------|----------------|
| 공지사항 | 0 |
| 자유게시판 | 0 |
| 정보공유 | 5 |
| 파일자료실 | 4 |
| 1:1문의 | 5 |
| 회원전용 | 0 |
| 갤러리 | 5 |
| VIP라운지 | 0 |

---

## 🔧 트러블슈팅

### 오류: "duplicate key value violates unique constraint"

**원인**: ID가 이미 존재하는 경우

**해결**:

1. `reset-and-create-boards.sql` 사용 (기존 데이터 삭제)
2. 또는 `sample-boards.sql`의 ID를 수정

### 오류: "violates foreign key constraint"

**원인**: posts, comments 등 다른 테이블에서 boards를 참조하는 경우

**해결**:

```sql
-- 1. 참조 데이터 먼저 삭제
DELETE FROM comments;
DELETE FROM posts;
DELETE FROM reactions;

-- 2. 그 다음 reset-and-create-boards.sql 실행
```

### 오류: "permission denied"

**원인**: Supabase RLS 정책으로 인한 접근 제한

**해결**:

1. Supabase Dashboard에서 SQL Editor 사용 (관리자 권한)
2. Service Role Key로 실행 (SUPABASE_SERVICE_ROLE_KEY 사용)

---

## 📚 참고 문서

- **게시판 구성 가이드**: [BOARD-EXAMPLES.md](./BOARD-EXAMPLES.md)
- **core-supabase 스키마**: `semicolon-devteam/core-supabase/docker/volumes/db/init/schemas/04-boards.sql`
- **DDD Architecture**: [../architecture/DDD-ARCHITECTURE.md](../architecture/DDD-ARCHITECTURE.md)

---

## 💡 다음 단계

1. ✅ **게시판 데이터 생성 완료** (이 문서의 스크립트 실행)
2. ⏭️ **Board 도메인 구현** (DDD 구조)
   - `src/app/boards/_repositories/`
   - `src/app/boards/_api-clients/`
   - `src/app/boards/_hooks/`
   - `src/app/boards/_components/`
3. ⏭️ **권한 체크 로직 구현**
   - `lib/utils/permission.ts`
4. ⏭️ **포인트 정책 적용**
   - 글 작성/댓글/다운로드 시 포인트 차감/지급

---

**작성일**: 2024-11-09
**작성자**: Sarah (Product Owner)
**버전**: 1.0
