import { NextRequest, NextResponse } from "next/server";

import { createServiceRoleClient } from "@/lib/supabase/server";

import type { Database } from "@/lib/supabase/database.types";

type SEOKeywordRow = Database["public"]["Tables"]["seo_keywords"]["Row"];
type SEORankHistoryRow = Database["public"]["Tables"]["seo_rank_history"]["Row"];
type SEOSiteSettingsRow = Database["public"]["Tables"]["seo_site_settings"]["Row"];
type SEOOnboardingRow = Database["public"]["Tables"]["seo_onboarding"]["Row"];

// GET: 데이터 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // keywords, rank_history, settings, onboarding
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json({ success: false, error: "도메인이 필요합니다." }, { status: 400 });
    }

    const supabase = await createServiceRoleClient();

    switch (type) {
      case "keywords": {
        const { data, error } = await supabase
          .from("seo_keywords")
          .select("*")
          .eq("domain", domain)
          .order("created_at", { ascending: false });

        if (error) throw error;
        const typedData = data as SEOKeywordRow[] | null;
        return NextResponse.json({ success: true, data: typedData || [] });
      }

      case "rank_history": {
        const keyword = searchParams.get("keyword");
        const days = parseInt(searchParams.get("days") || "30", 10);
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

        let query = supabase
          .from("seo_rank_history")
          .select("*")
          .eq("domain", domain)
          .gte("checked_at", cutoffDate)
          .order("checked_at", { ascending: true });

        if (keyword) {
          query = query.eq("keyword", keyword);
        }

        const { data, error } = await query;
        if (error) throw error;
        const typedData = data as SEORankHistoryRow[] | null;
        return NextResponse.json({ success: true, data: typedData || [] });
      }

      case "settings": {
        const { data, error } = await supabase
          .from("seo_site_settings")
          .select("*")
          .eq("domain", domain)
          .single();

        if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
        const typedData = data as SEOSiteSettingsRow | null;
        return NextResponse.json({
          success: true,
          data: typedData || {
            domain,
            gtm_container_id: null,
            auto_meta_tags: true,
            auto_index_now: true,
            weekly_report: false,
          },
        });
      }

      case "onboarding": {
        const { data, error } = await supabase
          .from("seo_onboarding")
          .select("*")
          .eq("domain", domain)
          .single();

        if (error && error.code !== "PGRST116") throw error;
        const typedData = data as SEOOnboardingRow | null;
        return NextResponse.json({
          success: true,
          data: typedData || { domain, completed_steps: [], dismissed: false },
        });
      }

      default:
        return NextResponse.json({ success: false, error: "잘못된 type입니다." }, { status: 400 });
    }
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ success: false, error: "조회 실패" }, { status: 500 });
  }
}

// POST: 데이터 생성/업데이트
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, domain, ...data } = body;

    if (!domain || !type) {
      return NextResponse.json(
        { success: false, error: "domain과 type이 필요합니다." },
        { status: 400 },
      );
    }

    const supabase = await createServiceRoleClient();

    switch (type) {
      case "keywords": {
        const { keyword, keyword_type = "main" } = data;
        if (!keyword) {
          return NextResponse.json(
            { success: false, error: "keyword가 필요합니다." },
            { status: 400 },
          );
        }

        const { error } = await supabase
          .from("seo_keywords")
          .upsert({ domain, keyword, keyword_type }, { onConflict: "domain,keyword" });

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case "rank_history": {
        const { keyword, rank } = data;
        if (!keyword || rank === undefined) {
          return NextResponse.json(
            { success: false, error: "keyword와 rank가 필요합니다." },
            { status: 400 },
          );
        }

        const { error } = await supabase.from("seo_rank_history").insert({ domain, keyword, rank });

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case "settings": {
        const { gtm_container_id, auto_meta_tags, auto_index_now, weekly_report } = data;

        const { error } = await supabase.from("seo_site_settings").upsert(
          {
            domain,
            gtm_container_id,
            auto_meta_tags,
            auto_index_now,
            weekly_report,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "domain" },
        );

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case "onboarding": {
        const { completed_steps, dismissed } = data;

        const { error } = await supabase.from("seo_onboarding").upsert(
          {
            domain,
            completed_steps: completed_steps || [],
            dismissed: dismissed || false,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "domain" },
        );

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ success: false, error: "잘못된 type입니다." }, { status: 400 });
    }
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ success: false, error: "저장 실패" }, { status: 500 });
  }
}

// DELETE: 데이터 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const domain = searchParams.get("domain");
    const id = searchParams.get("id");

    if (!domain || !type) {
      return NextResponse.json(
        { success: false, error: "domain과 type이 필요합니다." },
        { status: 400 },
      );
    }

    const supabase = await createServiceRoleClient();

    switch (type) {
      case "keywords": {
        if (id) {
          const { error } = await supabase.from("seo_keywords").delete().eq("id", parseInt(id, 10));
          if (error) throw error;
        }
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { success: false, error: "삭제 불가능한 type입니다." },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ success: false, error: "삭제 실패" }, { status: 500 });
  }
}
