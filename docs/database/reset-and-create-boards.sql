-- ===================================================================
-- cm-template Board 데이터 완전 리셋 및 샘플 생성
-- ===================================================================
-- 목적: 기존 게시판 데이터를 삭제하고 템플릿용 샘플 게시판 생성
-- 작성일: 2024-11-09
-- 실행 방법: Supabase Dashboard → SQL Editor에서 실행
-- ===================================================================

-- ============================================================
-- STEP 1: 기존 데이터 삭제 (외래키 제약으로 인해 순서 중요)
-- ============================================================

-- 1-1. boards를 참조하는 테이블들 먼저 삭제
DELETE FROM reactions WHERE target_type = 'post' AND target_id IN (SELECT id FROM posts);
DELETE FROM reactions WHERE target_type = 'comment' AND target_id IN (SELECT id FROM comments);
DELETE FROM comments;
DELETE FROM posts;

-- 1-2. menu 테이블에서 boards 참조 삭제
DELETE FROM menu WHERE board_id IS NOT NULL;

-- 1-3. 카테고리 삭제
DELETE FROM board_categories;

-- 1-4. 게시판 멤버 삭제
DELETE FROM board_users;

-- 1-5. 게시판 삭제
DELETE FROM boards;

-- 1-6. 시퀀스 리셋 (ID를 1부터 다시 시작)
ALTER SEQUENCE IF EXISTS boards_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS board_categories_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS board_users_id_seq RESTART WITH 1;

-- ============================================================
-- STEP 2: 샘플 게시판 생성 (8개)
-- ============================================================

-- 1️⃣ 공지사항 (ID: 100) - 관리자 전용 쓰기
INSERT INTO public.boards (
  id, name, description, visibility,
  permission_settings,
  feature_settings,
  point_settings,
  display_settings,
  upload_settings,
  is_active
) VALUES (
  100,
  '공지사항',
  '사이트 운영 공지 및 업데이트 소식',
  'public',
  jsonb_build_object(
    'list_level', 1,
    'read_level', 1,
    'write_level', 99,
    'comment_level', 2,
    'upload_level', 99
  ),
  jsonb_build_object(
    'use_category', false,
    'use_secret', false,
    'use_comments', true,
    'use_editor', true,
    'use_file_upload', true,
    'forbidden_words', array[]::text[]
  ),
  jsonb_build_object(
    'read_post', 0,
    'write_post', 0,
    'write_comment', 0,
    'download_file', 0,
    'like_post', 0,
    'dislike_post', 0,
    'like_comment', 0,
    'dislike_comment', 0
  ),
  jsonb_build_object('posts_per_page', 20, 'new_post_hours', 168, 'hot_post_views', 100),
  jsonb_build_object('max_file_size', 10485760, 'allowed_types', array['image/*', 'application/pdf'], 'max_files', 5),
  true
);

-- 2️⃣ 자유게시판 (ID: 200) - 비회원도 글 작성 가능
INSERT INTO public.boards (
  id, name, description, visibility,
  permission_settings,
  feature_settings,
  point_settings,
  display_settings,
  upload_settings,
  is_active
) VALUES (
  200,
  '자유게시판',
  '누구나 자유롭게 글을 쓸 수 있는 게시판',
  'public',
  jsonb_build_object(
    'list_level', 1,
    'read_level', 1,
    'write_level', 1,
    'comment_level', 1,
    'upload_level', 2
  ),
  jsonb_build_object(
    'use_category', false,
    'use_secret', false,
    'use_comments', true,
    'use_editor', true,
    'use_file_upload', true,
    'forbidden_words', array['금지어1', '금지어2']::text[]
  ),
  jsonb_build_object(
    'read_post', 0,
    'write_post', 10,
    'write_comment', 2,
    'download_file', -5,
    'like_post', 1,
    'dislike_post', 0,
    'like_comment', 1,
    'dislike_comment', 0
  ),
  jsonb_build_object('posts_per_page', 20, 'new_post_hours', 24, 'hot_post_views', 100),
  jsonb_build_object('max_file_size', 5242880, 'allowed_types', array['image/*'], 'max_files', 3),
  true
);

-- 3️⃣ 정보공유 (ID: 300) - 카테고리 활용
INSERT INTO public.boards (
  id, name, description, visibility,
  permission_settings,
  feature_settings,
  point_settings,
  display_settings,
  upload_settings,
  is_active
) VALUES (
  300,
  '정보공유',
  '유용한 정보를 카테고리별로 공유하는 게시판',
  'public',
  jsonb_build_object(
    'list_level', 1,
    'read_level', 1,
    'write_level', 2,
    'comment_level', 2,
    'upload_level', 2
  ),
  jsonb_build_object(
    'use_category', true,
    'use_secret', false,
    'use_comments', true,
    'use_editor', true,
    'use_file_upload', true,
    'forbidden_words', array[]::text[]
  ),
  jsonb_build_object(
    'read_post', 0,
    'write_post', 20,
    'write_comment', 5,
    'download_file', -10,
    'like_post', 2,
    'dislike_post', -1,
    'like_comment', 1,
    'dislike_comment', 0
  ),
  jsonb_build_object('posts_per_page', 20, 'new_post_hours', 24, 'hot_post_views', 100),
  jsonb_build_object('max_file_size', 10485760, 'allowed_types', array['image/*', 'application/pdf', 'application/zip'], 'max_files', 5),
  true
);

-- 4️⃣ 파일자료실 (ID: 400) - 대용량 파일 업로드
INSERT INTO public.boards (
  id, name, description, visibility,
  permission_settings,
  feature_settings,
  point_settings,
  display_settings,
  upload_settings,
  is_active
) VALUES (
  400,
  '파일자료실',
  '각종 파일 자료를 공유하는 게시판',
  'public',
  jsonb_build_object(
    'list_level', 1,
    'read_level', 1,
    'write_level', 2,
    'comment_level', 2,
    'upload_level', 3
  ),
  jsonb_build_object(
    'use_category', true,
    'use_secret', false,
    'use_comments', true,
    'use_editor', true,
    'use_file_upload', true,
    'forbidden_words', array[]::text[]
  ),
  jsonb_build_object(
    'read_post', 0,
    'write_post', 30,
    'write_comment', 5,
    'download_file', -20,
    'like_post', 3,
    'dislike_post', 0,
    'like_comment', 1,
    'dislike_comment', 0
  ),
  jsonb_build_object('posts_per_page', 20, 'new_post_hours', 24, 'hot_post_views', 100),
  jsonb_build_object(
    'max_file_size', 52428800,
    'allowed_types', array['image/*', 'application/pdf', 'application/zip', 'application/x-rar', 'video/*'],
    'max_files', 10
  ),
  true
);

-- 5️⃣ 1:1문의 (ID: 500) - 비밀글 기능
INSERT INTO public.boards (
  id, name, description, visibility,
  permission_settings,
  feature_settings,
  point_settings,
  display_settings,
  upload_settings,
  is_active
) VALUES (
  500,
  '1:1문의',
  '관리자에게 비밀글로 문의하는 게시판',
  'public',
  jsonb_build_object(
    'list_level', 2,
    'read_level', 2,
    'write_level', 2,
    'comment_level', 99,
    'upload_level', 2
  ),
  jsonb_build_object(
    'use_category', true,
    'use_secret', true,
    'use_comments', false,
    'use_editor', true,
    'use_file_upload', true,
    'forbidden_words', array[]::text[]
  ),
  jsonb_build_object(
    'read_post', 0,
    'write_post', 0,
    'write_comment', 0,
    'download_file', 0,
    'like_post', 0,
    'dislike_post', 0,
    'like_comment', 0,
    'dislike_comment', 0
  ),
  jsonb_build_object('posts_per_page', 20, 'new_post_hours', 24, 'hot_post_views', 100),
  jsonb_build_object('max_file_size', 10485760, 'allowed_types', array['image/*', 'application/pdf'], 'max_files', 3),
  true
);

-- 6️⃣ 회원전용 (ID: 600) - Private 게시판
INSERT INTO public.boards (
  id, name, description, visibility,
  permission_settings,
  feature_settings,
  point_settings,
  display_settings,
  upload_settings,
  is_active
) VALUES (
  600,
  '회원전용',
  '인증된 회원만 접근 가능한 게시판',
  'private',
  jsonb_build_object(
    'list_level', 2,
    'read_level', 2,
    'write_level', 2,
    'comment_level', 2,
    'upload_level', 2
  ),
  jsonb_build_object(
    'use_category', false,
    'use_secret', true,
    'use_comments', true,
    'use_editor', true,
    'use_file_upload', true,
    'forbidden_words', array[]::text[]
  ),
  jsonb_build_object(
    'read_post', 0,
    'write_post', 50,
    'write_comment', 10,
    'download_file', -15,
    'like_post', 5,
    'dislike_post', 0,
    'like_comment', 2,
    'dislike_comment', 0
  ),
  jsonb_build_object('posts_per_page', 20, 'new_post_hours', 24, 'hot_post_views', 100),
  jsonb_build_object('max_file_size', 20971520, 'allowed_types', array['image/*', 'application/pdf', 'application/zip'], 'max_files', 5),
  true
);

-- 7️⃣ 갤러리 (ID: 700) - 이미지 전용
INSERT INTO public.boards (
  id, name, description, visibility,
  permission_settings,
  feature_settings,
  point_settings,
  display_settings,
  upload_settings,
  is_active
) VALUES (
  700,
  '갤러리',
  '사진과 이미지를 공유하는 게시판',
  'public',
  jsonb_build_object(
    'list_level', 1,
    'read_level', 1,
    'write_level', 2,
    'comment_level', 2,
    'upload_level', 2
  ),
  jsonb_build_object(
    'use_category', true,
    'use_secret', false,
    'use_comments', true,
    'use_editor', false,
    'use_file_upload', true,
    'forbidden_words', array[]::text[]
  ),
  jsonb_build_object(
    'read_post', 0,
    'write_post', 15,
    'write_comment', 3,
    'download_file', -5,
    'like_post', 2,
    'dislike_post', 0,
    'like_comment', 1,
    'dislike_comment', 0
  ),
  jsonb_build_object('posts_per_page', 30, 'new_post_hours', 24, 'hot_post_views', 200),
  jsonb_build_object(
    'max_file_size', 10485760,
    'allowed_types', array['image/*'],
    'max_files', 10
  ),
  true
);

-- 8️⃣ VIP라운지 (ID: 800) - Hidden + 고레벨 전용
INSERT INTO public.boards (
  id, name, description, visibility,
  permission_settings,
  feature_settings,
  point_settings,
  display_settings,
  upload_settings,
  is_active
) VALUES (
  800,
  'VIP라운지',
  '레벨 5 이상 회원만 접근 가능한 프리미엄 게시판',
  'hidden',
  jsonb_build_object(
    'list_level', 5,
    'read_level', 5,
    'write_level', 5,
    'comment_level', 5,
    'upload_level', 5
  ),
  jsonb_build_object(
    'use_category', false,
    'use_secret', true,
    'use_comments', true,
    'use_editor', true,
    'use_file_upload', true,
    'forbidden_words', array[]::text[]
  ),
  jsonb_build_object(
    'read_post', 0,
    'write_post', 100,
    'write_comment', 20,
    'download_file', 0,
    'like_post', 10,
    'dislike_post', 0,
    'like_comment', 5,
    'dislike_comment', 0
  ),
  jsonb_build_object('posts_per_page', 20, 'new_post_hours', 24, 'hot_post_views', 100),
  jsonb_build_object('max_file_size', 104857600, 'allowed_types', array['image/*', 'video/*', 'application/*'], 'max_files', 20),
  true
);

-- ============================================================
-- STEP 3: 카테고리 생성 (총 14개)
-- ============================================================

-- 정보공유 카테고리 (5개)
INSERT INTO public.board_categories (board_id, name, description, display_order)
VALUES
  (300, 'IT/프로그래밍', 'IT 및 개발 관련 정보', 1),
  (300, '생활정보', '일상 생활에 유용한 정보', 2),
  (300, '건강/운동', '건강과 운동에 관한 정보', 3),
  (300, '재테크', '재테크 및 투자 정보', 4),
  (300, '기타', '기타 유용한 정보', 99);

-- 파일자료실 카테고리 (4개)
INSERT INTO public.board_categories (board_id, name, description, display_order)
VALUES
  (400, '문서자료', 'PDF, 문서 파일', 1),
  (400, '이미지/디자인', '이미지 및 디자인 파일', 2),
  (400, '동영상', '동영상 파일', 3),
  (400, '압축파일', 'ZIP, RAR 등 압축 파일', 4);

-- 1:1문의 카테고리 (5개)
INSERT INTO public.board_categories (board_id, name, description, display_order)
VALUES
  (500, '서비스문의', '서비스 이용 관련 문의', 1),
  (500, '기술지원', '기술적 문제 해결 문의', 2),
  (500, '결제문의', '결제 및 환불 관련 문의', 3),
  (500, '제안/건의', '서비스 개선 제안', 4),
  (500, '기타', '기타 문의사항', 99);

-- 갤러리 카테고리 (5개)
INSERT INTO public.board_categories (board_id, name, description, display_order)
VALUES
  (700, '풍경/여행', '풍경 및 여행 사진', 1),
  (700, '인물', '인물 사진', 2),
  (700, '동물', '동물 사진', 3),
  (700, '일상', '일상 사진', 4),
  (700, '기타', '기타 사진', 99);

-- ============================================================
-- STEP 4: 생성 확인
-- ============================================================

-- 게시판 개수 확인 (8개여야 함)
SELECT COUNT(*) as total_boards FROM boards;

-- 카테고리 개수 확인 (14개여야 함)
SELECT COUNT(*) as total_categories FROM board_categories;

-- 게시판 목록 확인
SELECT id, name, visibility,
       permission_settings->>'write_level' as write_level,
       feature_settings->>'use_category' as use_category
FROM boards
ORDER BY id;

-- 카테고리별 개수 확인
SELECT b.name as board_name, COUNT(bc.id) as category_count
FROM boards b
LEFT JOIN board_categories bc ON b.id = bc.board_id
GROUP BY b.id, b.name
ORDER BY b.id;

-- ============================================================
-- 완료
-- ============================================================
-- ✅ 기존 데이터 삭제 완료
-- ✅ 8개 샘플 게시판 생성 완료
-- ✅ 14개 카테고리 생성 완료
-- ============================================================
