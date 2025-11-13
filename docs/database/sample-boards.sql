-- ===================================================================
-- cm-template 샘플 Board & Category 데이터
-- ===================================================================
-- 목적: 다양한 게시판 케이스를 시연하여 템플릿으로 활용
-- 작성일: 2024-11-09
-- 참고: core-supabase 04-boards.sql 스키마 기반
-- ===================================================================

-- 1️⃣ 공지사항 게시판 (관리자 전용 쓰기)
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

-- 2️⃣ 자유게시판 (비회원도 글 작성 가능)
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

-- 3️⃣ 정보공유 게시판 (카테고리 활용)
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

-- 정보공유 카테고리
INSERT INTO public.board_categories (board_id, name, description, display_order)
VALUES
  (300, 'IT/프로그래밍', 'IT 및 개발 관련 정보', 1),
  (300, '생활정보', '일상 생활에 유용한 정보', 2),
  (300, '건강/운동', '건강과 운동에 관한 정보', 3),
  (300, '재테크', '재테크 및 투자 정보', 4),
  (300, '기타', '기타 유용한 정보', 99);

-- 4️⃣ 파일자료실 (대용량 파일 업로드)
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

-- 파일자료실 카테고리
INSERT INTO public.board_categories (board_id, name, description, display_order)
VALUES
  (400, '문서자료', 'PDF, 문서 파일', 1),
  (400, '이미지/디자인', '이미지 및 디자인 파일', 2),
  (400, '동영상', '동영상 파일', 3),
  (400, '압축파일', 'ZIP, RAR 등 압축 파일', 4);

-- 5️⃣ 1:1문의 (비밀글 기능)
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

-- 1:1문의 카테고리
INSERT INTO public.board_categories (board_id, name, description, display_order)
VALUES
  (500, '서비스문의', '서비스 이용 관련 문의', 1),
  (500, '기술지원', '기술적 문제 해결 문의', 2),
  (500, '결제문의', '결제 및 환불 관련 문의', 3),
  (500, '제안/건의', '서비스 개선 제안', 4),
  (500, '기타', '기타 문의사항', 99);

-- 6️⃣ 회원전용 게시판 (Private)
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

-- 7️⃣ 갤러리 (이미지 중심)
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

-- 갤러리 카테고리
INSERT INTO public.board_categories (board_id, name, description, display_order)
VALUES
  (700, '풍경/여행', '풍경 및 여행 사진', 1),
  (700, '인물', '인물 사진', 2),
  (700, '동물', '동물 사진', 3),
  (700, '일상', '일상 사진', 4),
  (700, '기타', '기타 사진', 99);

-- 8️⃣ VIP라운지 (Hidden, 고레벨 전용)
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

-- ===================================================================
-- 완료
-- ===================================================================
-- 총 8개 게시판 생성
-- 총 14개 카테고리 생성 (정보공유 5개 + 파일자료실 4개 + 1:1문의 5개)
-- ===================================================================
