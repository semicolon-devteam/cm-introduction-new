-- SEO Dashboard 전체 테이블 마이그레이션
-- 팀 전체가 공유하는 SEO 관련 데이터

-- 1. 키워드 테이블
CREATE TABLE IF NOT EXISTS seo_keywords (
  id SERIAL PRIMARY KEY,
  domain VARCHAR(255) NOT NULL,
  keyword TEXT NOT NULL,
  keyword_type VARCHAR(10) NOT NULL DEFAULT 'main' CHECK (keyword_type IN ('main', 'sub')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(domain, keyword)
);

CREATE INDEX IF NOT EXISTS idx_seo_keywords_domain ON seo_keywords(domain);

-- 2. 순위 이력 테이블
CREATE TABLE IF NOT EXISTS seo_rank_history (
  id SERIAL PRIMARY KEY,
  domain VARCHAR(255) NOT NULL,
  keyword TEXT NOT NULL,
  rank INTEGER NOT NULL,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_rank_history_domain_keyword ON seo_rank_history(domain, keyword);
CREATE INDEX IF NOT EXISTS idx_seo_rank_history_checked_at ON seo_rank_history(checked_at);

-- 3. 사이트 설정 테이블 (GTM ID, 자동화 설정 등)
CREATE TABLE IF NOT EXISTS seo_site_settings (
  id SERIAL PRIMARY KEY,
  domain VARCHAR(255) NOT NULL UNIQUE,
  gtm_container_id VARCHAR(50),
  auto_meta_tags BOOLEAN NOT NULL DEFAULT true,
  auto_index_now BOOLEAN NOT NULL DEFAULT true,
  weekly_report BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_seo_site_settings_domain ON seo_site_settings(domain);

-- 4. 온보딩 진행 상태 테이블
CREATE TABLE IF NOT EXISTS seo_onboarding (
  id SERIAL PRIMARY KEY,
  domain VARCHAR(255) NOT NULL UNIQUE,
  completed_steps TEXT[] NOT NULL DEFAULT '{}',
  dismissed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_seo_onboarding_domain ON seo_onboarding(domain);

-- RLS 활성화
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_rank_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_onboarding ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모든 테이블에 대해 SELECT/INSERT/UPDATE/DELETE 허용
CREATE POLICY "seo_keywords_select" ON seo_keywords FOR SELECT USING (true);
CREATE POLICY "seo_keywords_insert" ON seo_keywords FOR INSERT WITH CHECK (true);
CREATE POLICY "seo_keywords_update" ON seo_keywords FOR UPDATE USING (true);
CREATE POLICY "seo_keywords_delete" ON seo_keywords FOR DELETE USING (true);

CREATE POLICY "seo_rank_history_select" ON seo_rank_history FOR SELECT USING (true);
CREATE POLICY "seo_rank_history_insert" ON seo_rank_history FOR INSERT WITH CHECK (true);
CREATE POLICY "seo_rank_history_update" ON seo_rank_history FOR UPDATE USING (true);
CREATE POLICY "seo_rank_history_delete" ON seo_rank_history FOR DELETE USING (true);

CREATE POLICY "seo_site_settings_select" ON seo_site_settings FOR SELECT USING (true);
CREATE POLICY "seo_site_settings_insert" ON seo_site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "seo_site_settings_update" ON seo_site_settings FOR UPDATE USING (true);
CREATE POLICY "seo_site_settings_delete" ON seo_site_settings FOR DELETE USING (true);

CREATE POLICY "seo_onboarding_select" ON seo_onboarding FOR SELECT USING (true);
CREATE POLICY "seo_onboarding_insert" ON seo_onboarding FOR INSERT WITH CHECK (true);
CREATE POLICY "seo_onboarding_update" ON seo_onboarding FOR UPDATE USING (true);
CREATE POLICY "seo_onboarding_delete" ON seo_onboarding FOR DELETE USING (true);
