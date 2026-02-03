/**
 * Database Types for cm-introduction
 *
 * Generated manually based on database schema
 */

export type InquiryStatus = "NEW" | "ACK" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export type PostStatus = "draft" | "published" | "archived" | "deleted";

export type UserStatus = "active" | "inactive" | "suspended" | "deleted";

export type PermissionType = "admin" | "manager" | "user" | "guest";

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

// Leader related types
export interface CareerItem {
  company: string;
  role: string;
  period: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRow = Record<string, any>;

export interface Database {
  public: {
    Tables: {
      part_timers: {
        Row: {
          id: number;
          nickname: string;
          role: string;
          team: string | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          nickname: string;
          role: string;
          team?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          nickname?: string;
          role?: string;
          team?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      contacts: {
        Row: {
          id: number;
          name: string;
          email: string;
          phone: string | null;
          company: string | null;
          message: string;
          status: InquiryStatus;
          admin_notes: string | null;
          created_at: string;
          updated_at: string | null;
          resolved_at: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          email: string;
          phone?: string | null;
          company?: string | null;
          message: string;
          status?: InquiryStatus;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string | null;
          resolved_at?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          email?: string;
          phone?: string | null;
          company?: string | null;
          message?: string;
          status?: InquiryStatus;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string | null;
          resolved_at?: string | null;
        };
        Relationships: [];
      };
      leaders: {
        Row: {
          id: number;
          slug: string;
          name: string;
          nickname: string | null;
          position: string;
          summary: string | null;
          career: CareerItem[];
          profile_image: string | null;
          message: string | null;
          skills: string[];
          social_links: SocialLinks;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          slug: string;
          name: string;
          nickname?: string | null;
          position: string;
          summary?: string | null;
          career?: CareerItem[];
          profile_image?: string | null;
          message?: string | null;
          skills?: string[];
          social_links?: SocialLinks;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          slug?: string;
          name?: string;
          nickname?: string | null;
          position?: string;
          summary?: string | null;
          career?: CareerItem[];
          profile_image?: string | null;
          message?: string | null;
          skills?: string[];
          social_links?: SocialLinks;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      // SEO Weekly Missions
      seo_weekly_missions: {
        Row: {
          id: number;
          domain: string;
          week_start: string;
          title: string;
          description: string;
          category: "content" | "technical" | "link" | "image" | "meta";
          priority: "high" | "medium" | "low";
          status: "pending" | "in_progress" | "completed";
          estimated_time: string;
          ai_tip: string | null;
          summary: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          domain: string;
          week_start: string;
          title: string;
          description: string;
          category: "content" | "technical" | "link" | "image" | "meta";
          priority?: "high" | "medium" | "low";
          status?: "pending" | "in_progress" | "completed";
          estimated_time: string;
          ai_tip?: string | null;
          summary?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          domain?: string;
          week_start?: string;
          title?: string;
          description?: string;
          category?: "content" | "technical" | "link" | "image" | "meta";
          priority?: "high" | "medium" | "low";
          status?: "pending" | "in_progress" | "completed";
          estimated_time?: string;
          ai_tip?: string | null;
          summary?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      // SEO Keywords
      seo_keywords: {
        Row: {
          id: number;
          domain: string;
          keyword: string;
          keyword_type: "main" | "sub";
          created_at: string;
        };
        Insert: {
          id?: number;
          domain: string;
          keyword: string;
          keyword_type?: "main" | "sub";
          created_at?: string;
        };
        Update: {
          id?: number;
          domain?: string;
          keyword?: string;
          keyword_type?: "main" | "sub";
          created_at?: string;
        };
        Relationships: [];
      };
      // SEO Rank History
      seo_rank_history: {
        Row: {
          id: number;
          domain: string;
          keyword: string;
          rank: number;
          checked_at: string;
        };
        Insert: {
          id?: number;
          domain: string;
          keyword: string;
          rank: number;
          checked_at?: string;
        };
        Update: {
          id?: number;
          domain?: string;
          keyword?: string;
          rank?: number;
          checked_at?: string;
        };
        Relationships: [];
      };
      // SEO Site Settings
      seo_site_settings: {
        Row: {
          id: number;
          domain: string;
          gtm_container_id: string | null;
          auto_meta_tags: boolean;
          auto_index_now: boolean;
          weekly_report: boolean;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          domain: string;
          gtm_container_id?: string | null;
          auto_meta_tags?: boolean;
          auto_index_now?: boolean;
          weekly_report?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          domain?: string;
          gtm_container_id?: string | null;
          auto_meta_tags?: boolean;
          auto_index_now?: boolean;
          weekly_report?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      // SEO Onboarding
      seo_onboarding: {
        Row: {
          id: number;
          domain: string;
          completed_steps: string[];
          dismissed: boolean;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          domain: string;
          completed_steps?: string[];
          dismissed?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          domain?: string;
          completed_steps?: string[];
          dismissed?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      // Legacy tables - loosely typed for compatibility
      posts: {
        Row: AnyRow;
        Insert: AnyRow;
        Update: AnyRow;
        Relationships: [];
      };
      users: {
        Row: AnyRow;
        Insert: AnyRow;
        Update: AnyRow;
        Relationships: [];
      };
      menu: {
        Row: AnyRow;
        Insert: AnyRow;
        Update: AnyRow;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      inquiry_status: InquiryStatus;
      post_status: PostStatus;
      user_status: UserStatus;
      permission_type: PermissionType;
      gender: Gender;
    };
    CompositeTypes: Record<string, never>;
  };
}
