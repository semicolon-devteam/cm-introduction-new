-- SEO 미션 검증 상태 컬럼 추가
-- verification_status: pending(미검증), verified(검증완료), failed(검증실패)

ALTER TABLE seo_weekly_missions
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending'
CHECK (verification_status IN ('pending', 'verified', 'failed'));

-- 검증 일시 컬럼 추가
ALTER TABLE seo_weekly_missions
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

-- 검증 메시지 (실패 시 이유 등)
ALTER TABLE seo_weekly_missions
ADD COLUMN IF NOT EXISTS verification_message TEXT;
