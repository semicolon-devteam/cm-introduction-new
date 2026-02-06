-- SEO 테이블 RLS 정책 추가
-- anon key로 접근 가능하도록 설정

-- seo_keywords 테이블
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to seo_keywords"
  ON seo_keywords FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to seo_keywords"
  ON seo_keywords FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to seo_keywords"
  ON seo_keywords FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete access to seo_keywords"
  ON seo_keywords FOR DELETE
  USING (true);

-- seo_rank_history 테이블
ALTER TABLE seo_rank_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to seo_rank_history"
  ON seo_rank_history FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to seo_rank_history"
  ON seo_rank_history FOR INSERT
  WITH CHECK (true);

-- seo_site_settings 테이블
ALTER TABLE seo_site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to seo_site_settings"
  ON seo_site_settings FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to seo_site_settings"
  ON seo_site_settings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to seo_site_settings"
  ON seo_site_settings FOR UPDATE
  USING (true);

-- seo_onboarding 테이블
ALTER TABLE seo_onboarding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to seo_onboarding"
  ON seo_onboarding FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to seo_onboarding"
  ON seo_onboarding FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to seo_onboarding"
  ON seo_onboarding FOR UPDATE
  USING (true);

-- seo_weekly_missions 테이블
ALTER TABLE seo_weekly_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to seo_weekly_missions"
  ON seo_weekly_missions FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to seo_weekly_missions"
  ON seo_weekly_missions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to seo_weekly_missions"
  ON seo_weekly_missions FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete access to seo_weekly_missions"
  ON seo_weekly_missions FOR DELETE
  USING (true);
