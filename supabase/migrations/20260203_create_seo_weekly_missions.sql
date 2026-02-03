-- SEO Weekly Missions Table
-- 팀 전체가 공유하는 주간 SEO 미션 테이블

CREATE TABLE IF NOT EXISTS seo_weekly_missions (
  id SERIAL PRIMARY KEY,
  domain VARCHAR(255) NOT NULL,
  week_start DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('content', 'technical', 'link', 'image', 'meta')),
  priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  estimated_time VARCHAR(50) NOT NULL,
  ai_tip TEXT,
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- 도메인 + 주차 기준 조회를 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_seo_weekly_missions_domain_week
  ON seo_weekly_missions(domain, week_start);

-- 상태별 조회를 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_seo_weekly_missions_status
  ON seo_weekly_missions(status);

-- RLS (Row Level Security) 활성화
ALTER TABLE seo_weekly_missions ENABLE ROW LEVEL SECURITY;

-- 모든 인증된 사용자가 조회할 수 있도록 정책 설정
CREATE POLICY "Anyone can view seo_weekly_missions"
  ON seo_weekly_missions
  FOR SELECT
  USING (true);

-- service_role만 삽입/수정/삭제 가능
CREATE POLICY "Service role can insert seo_weekly_missions"
  ON seo_weekly_missions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update seo_weekly_missions"
  ON seo_weekly_missions
  FOR UPDATE
  USING (true);

CREATE POLICY "Service role can delete seo_weekly_missions"
  ON seo_weekly_missions
  FOR DELETE
  USING (true);

-- 테이블 코멘트
COMMENT ON TABLE seo_weekly_missions IS '팀 전체가 공유하는 주간 SEO 미션';
COMMENT ON COLUMN seo_weekly_missions.domain IS '대상 도메인 (예: semicolon.dev)';
COMMENT ON COLUMN seo_weekly_missions.week_start IS '해당 주의 시작일 (월요일)';
COMMENT ON COLUMN seo_weekly_missions.category IS 'content|technical|link|image|meta';
COMMENT ON COLUMN seo_weekly_missions.priority IS 'high|medium|low';
COMMENT ON COLUMN seo_weekly_missions.status IS 'pending|in_progress|completed';
COMMENT ON COLUMN seo_weekly_missions.ai_tip IS 'AI가 제안하는 실행 팁';
COMMENT ON COLUMN seo_weekly_missions.summary IS '해당 주차 미션 요약';
