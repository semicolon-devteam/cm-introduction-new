export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      agreements: {
        Row: {
          code: string
          created_at: string
          description: string
          is_optional: boolean
          title: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string
          description: string
          is_optional?: boolean
          title: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          is_optional?: boolean
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      anonymous_visitor_logs: {
        Row: {
          client_ip: unknown
          created_at: string
          id: number
          session_key: string
          user_agent: string | null
          visit_date: string
        }
        Insert: {
          client_ip?: unknown
          created_at?: string
          id?: number
          session_key: string
          user_agent?: string | null
          visit_date?: string
        }
        Update: {
          client_ip?: unknown
          created_at?: string
          id?: number
          session_key?: string
          user_agent?: string | null
          visit_date?: string
        }
        Relationships: []
      }
      badge_conditions: {
        Row: {
          badge_id: number
          condition_type: string
          condition_value: number
          created_at: string
          id: number
          updated_at: string | null
        }
        Insert: {
          badge_id: number
          condition_type: string
          condition_value: number
          created_at?: string
          id?: number
          updated_at?: string | null
        }
        Update: {
          badge_id?: number
          condition_type?: string
          condition_value?: number
          created_at?: string
          id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "badge_conditions_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          badge_type: string
          created_at: string
          created_by: number | null
          deleted_at: string | null
          description: string | null
          file_id: string | null
          id: number
          is_purchasable: boolean | null
          name: string
          required_points: number | null
          status: Database["public"]["Enums"]["badge_status"]
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          badge_type: string
          created_at?: string
          created_by?: number | null
          deleted_at?: string | null
          description?: string | null
          file_id?: string | null
          id?: number
          is_purchasable?: boolean | null
          name: string
          required_points?: number | null
          status?: Database["public"]["Enums"]["badge_status"]
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          badge_type?: string
          created_at?: string
          created_by?: number | null
          deleted_at?: string | null
          description?: string | null
          file_id?: string | null
          id?: number
          is_purchasable?: boolean | null
          name?: string
          required_points?: number | null
          status?: Database["public"]["Enums"]["badge_status"]
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "badges_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "badges_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      banners: {
        Row: {
          click_count: number | null
          created_at: string
          created_by: number | null
          deleted_at: string | null
          description: string | null
          display_order: number | null
          end_at: string
          height: number | null
          id: number
          image_url: string
          is_responsive: boolean | null
          link_url: string | null
          position: Database["public"]["Enums"]["banner_position"]
          start_at: string
          status: Database["public"]["Enums"]["banner_status"]
          target_devices: Database["public"]["Enums"]["device_type"][] | null
          target_window: string | null
          title: string
          updated_at: string | null
          updated_by: number | null
          width: number | null
        }
        Insert: {
          click_count?: number | null
          created_at?: string
          created_by?: number | null
          deleted_at?: string | null
          description?: string | null
          display_order?: number | null
          end_at: string
          height?: number | null
          id?: number
          image_url: string
          is_responsive?: boolean | null
          link_url?: string | null
          position: Database["public"]["Enums"]["banner_position"]
          start_at: string
          status?: Database["public"]["Enums"]["banner_status"]
          target_devices?: Database["public"]["Enums"]["device_type"][] | null
          target_window?: string | null
          title: string
          updated_at?: string | null
          updated_by?: number | null
          width?: number | null
        }
        Update: {
          click_count?: number | null
          created_at?: string
          created_by?: number | null
          deleted_at?: string | null
          description?: string | null
          display_order?: number | null
          end_at?: string
          height?: number | null
          id?: number
          image_url?: string
          is_responsive?: boolean | null
          link_url?: string | null
          position?: Database["public"]["Enums"]["banner_position"]
          start_at?: string
          status?: Database["public"]["Enums"]["banner_status"]
          target_devices?: Database["public"]["Enums"]["device_type"][] | null
          target_window?: string | null
          title?: string
          updated_at?: string | null
          updated_by?: number | null
          width?: number | null
        }
        Relationships: []
      }
      blocked_ips: {
        Row: {
          blocked_at: string | null
          blocked_by: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          ip_address: unknown
          reason: string | null
          updated_at: string | null
        }
        Insert: {
          blocked_at?: string | null
          blocked_by?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address: unknown
          reason?: string | null
          updated_at?: string | null
        }
        Update: {
          blocked_at?: string | null
          blocked_by?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          reason?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      board_categories: {
        Row: {
          board_id: number
          created_at: string
          deleted_at: string | null
          description: string | null
          display_order: number | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          board_id: number
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          board_id?: number
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "board_categories_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      board_users: {
        Row: {
          board_id: number
          created_at: string
          deleted_at: string | null
          id: number
          updated_at: string | null
          user_id: number
        }
        Insert: {
          board_id: number
          created_at?: string
          deleted_at?: string | null
          id?: number
          updated_at?: string | null
          user_id: number
        }
        Update: {
          board_id?: number
          created_at?: string
          deleted_at?: string | null
          id?: number
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "board_users_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "board_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      boards: {
        Row: {
          created_at: string
          created_by: number | null
          deleted_at: string | null
          description: string | null
          display_settings: Json | null
          feature_settings: Json | null
          id: number
          is_active: boolean | null
          maximum_members: number | null
          name: string
          permission_settings: Json | null
          point_settings: Json
          updated_at: string | null
          updated_by: number | null
          upload_settings: Json | null
          visibility: Database["public"]["Enums"]["board_visibility"] | null
        }
        Insert: {
          created_at?: string
          created_by?: number | null
          deleted_at?: string | null
          description?: string | null
          display_settings?: Json | null
          feature_settings?: Json | null
          id?: number
          is_active?: boolean | null
          maximum_members?: number | null
          name: string
          permission_settings?: Json | null
          point_settings?: Json
          updated_at?: string | null
          updated_by?: number | null
          upload_settings?: Json | null
          visibility?: Database["public"]["Enums"]["board_visibility"] | null
        }
        Update: {
          created_at?: string
          created_by?: number | null
          deleted_at?: string | null
          description?: string | null
          display_settings?: Json | null
          feature_settings?: Json | null
          id?: number
          is_active?: boolean | null
          maximum_members?: number | null
          name?: string
          permission_settings?: Json | null
          point_settings?: Json
          updated_at?: string | null
          updated_by?: number | null
          upload_settings?: Json | null
          visibility?: Database["public"]["Enums"]["board_visibility"] | null
        }
        Relationships: [
          {
            foreignKeyName: "boards_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boards_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmark_folders: {
        Row: {
          created_at: string
          display_order: number | null
          id: number
          name: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: number
          name: string
          updated_at?: string | null
          user_id?: number
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: number
          name?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bookmark_folders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_action_types: {
        Row: {
          action_code: string
          created_at: string
          description: string | null
          is_active: boolean
          name: string
          updated_at: string | null
        }
        Insert: {
          action_code: string
          created_at?: string
          description?: string | null
          is_active?: boolean
          name: string
          updated_at?: string | null
        }
        Update: {
          action_code?: string
          created_at?: string
          description?: string | null
          is_active?: boolean
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      challenge_codes: {
        Row: {
          category: string | null
          code: string
          created_at: string
          description: string
          is_active: boolean
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          code: string
          created_at?: string
          description: string
          is_active?: boolean
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          code?: string
          created_at?: string
          description?: string
          is_active?: boolean
          updated_at?: string | null
        }
        Relationships: []
      }
      challenge_types: {
        Row: {
          created_at: string
          description: string | null
          is_active: boolean
          name: string
          type_code: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          is_active?: boolean
          name: string
          type_code: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          is_active?: boolean
          name?: string
          type_code?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      challenges: {
        Row: {
          action_code: string
          additional_settings: Json | null
          code: string
          created_at: string
          depends_on: string[] | null
          exclude_boards: number[] | null
          expire_days: number | null
          id: number
          include_boards: number[] | null
          is_active: boolean
          name: string
          point_code: string
          reward_point: number
          sort_order: number
          target_count: number
          type_code: string
          updated_at: string | null
        }
        Insert: {
          action_code: string
          additional_settings?: Json | null
          code: string
          created_at?: string
          depends_on?: string[] | null
          exclude_boards?: number[] | null
          expire_days?: number | null
          id?: number
          include_boards?: number[] | null
          is_active?: boolean
          name: string
          point_code?: string
          reward_point: number
          sort_order?: number
          target_count: number
          type_code: string
          updated_at?: string | null
        }
        Update: {
          action_code?: string
          additional_settings?: Json | null
          code?: string
          created_at?: string
          depends_on?: string[] | null
          exclude_boards?: number[] | null
          expire_days?: number | null
          id?: number
          include_boards?: number[] | null
          is_active?: boolean
          name?: string
          point_code?: string
          reward_point?: number
          sort_order?: number
          target_count?: number
          type_code?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_action_code_fkey"
            columns: ["action_code"]
            isOneToOne: false
            referencedRelation: "challenge_action_types"
            referencedColumns: ["action_code"]
          },
          {
            foreignKeyName: "challenges_code_fkey"
            columns: ["code"]
            isOneToOne: true
            referencedRelation: "challenge_codes"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "challenges_point_code_fkey"
            columns: ["point_code"]
            isOneToOne: false
            referencedRelation: "point_codes"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "challenges_type_code_fkey"
            columns: ["type_code"]
            isOneToOne: false
            referencedRelation: "challenge_types"
            referencedColumns: ["type_code"]
          },
        ]
      }
      chat_message_read_receipts: {
        Row: {
          id: number
          message_id: number
          read_at: string
          user_id: number
        }
        Insert: {
          id?: number
          message_id: number
          read_at?: string
          user_id: number
        }
        Update: {
          id?: number
          message_id?: number
          read_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "chat_message_read_receipts_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_message_read_receipts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_message_reports: {
        Row: {
          admin_notes: string | null
          created_at: string
          description: string | null
          id: number
          message_id: number
          processed_at: string | null
          processed_by: number | null
          reason: string
          reported_user_id: number
          reporter_id: number
          room_id: number
          status: Database["public"]["Enums"]["chat_report_status"] | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          id?: number
          message_id: number
          processed_at?: string | null
          processed_by?: number | null
          reason: string
          reported_user_id: number
          reporter_id: number
          room_id: number
          status?: Database["public"]["Enums"]["chat_report_status"] | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          id?: number
          message_id?: number
          processed_at?: string | null
          processed_by?: number | null
          reason?: string
          reported_user_id?: number
          reporter_id?: number
          room_id?: number
          status?: Database["public"]["Enums"]["chat_report_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_message_reports_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_message_reports_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_message_reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_message_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_message_reports_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string | null
          created_at: string
          delete_reason: string | null
          deleted_at: string | null
          deleted_by: number | null
          edited_at: string | null
          file_name: string | null
          file_url: string | null
          id: number
          is_deleted: boolean | null
          is_edited: boolean | null
          mentions: number[] | null
          message_type: Database["public"]["Enums"]["chat_message_type"] | null
          metadata: Json | null
          original_content: string | null
          reactions: Json | null
          reply_to_id: number | null
          room_id: number
          sender_id: number
          status: Database["public"]["Enums"]["chat_message_status"] | null
          thread_id: number | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          delete_reason?: string | null
          deleted_at?: string | null
          deleted_by?: number | null
          edited_at?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: number
          is_deleted?: boolean | null
          is_edited?: boolean | null
          mentions?: number[] | null
          message_type?: Database["public"]["Enums"]["chat_message_type"] | null
          metadata?: Json | null
          original_content?: string | null
          reactions?: Json | null
          reply_to_id?: number | null
          room_id: number
          sender_id: number
          status?: Database["public"]["Enums"]["chat_message_status"] | null
          thread_id?: number | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          delete_reason?: string | null
          deleted_at?: string | null
          deleted_by?: number | null
          edited_at?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: number
          is_deleted?: boolean | null
          is_edited?: boolean | null
          mentions?: number[] | null
          message_type?: Database["public"]["Enums"]["chat_message_type"] | null
          metadata?: Json | null
          original_content?: string | null
          reactions?: Json | null
          reply_to_id?: number | null
          room_id?: number
          sender_id?: number
          status?: Database["public"]["Enums"]["chat_message_status"] | null
          thread_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          id: number
          invited_by: number | null
          is_active: boolean | null
          is_banned: boolean | null
          is_online: boolean | null
          joined_at: string
          last_read_at: string | null
          last_read_message_id: number | null
          last_seen_at: string | null
          left_at: string | null
          metadata: Json | null
          notification_settings: Json | null
          role: Database["public"]["Enums"]["chat_participant_role"] | null
          room_id: number
          unread_count: number | null
          user_id: number
        }
        Insert: {
          id?: number
          invited_by?: number | null
          is_active?: boolean | null
          is_banned?: boolean | null
          is_online?: boolean | null
          joined_at?: string
          last_read_at?: string | null
          last_read_message_id?: number | null
          last_seen_at?: string | null
          left_at?: string | null
          metadata?: Json | null
          notification_settings?: Json | null
          role?: Database["public"]["Enums"]["chat_participant_role"] | null
          room_id: number
          unread_count?: number | null
          user_id: number
        }
        Update: {
          id?: number
          invited_by?: number | null
          is_active?: boolean | null
          is_banned?: boolean | null
          is_online?: boolean | null
          joined_at?: string
          last_read_at?: string | null
          last_read_message_id?: number | null
          last_seen_at?: string | null
          left_at?: string | null
          metadata?: Json | null
          notification_settings?: Json | null
          role?: Database["public"]["Enums"]["chat_participant_role"] | null
          room_id?: number
          unread_count?: number | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_pinned_messages: {
        Row: {
          expires_at: string | null
          id: number
          message_id: number
          order_index: number | null
          pinned_at: string
          pinned_by: number
          room_id: number
        }
        Insert: {
          expires_at?: string | null
          id?: number
          message_id: number
          order_index?: number | null
          pinned_at?: string
          pinned_by: number
          room_id: number
        }
        Update: {
          expires_at?: string | null
          id?: number
          message_id?: number
          order_index?: number | null
          pinned_at?: string
          pinned_by?: number
          room_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "chat_pinned_messages_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_pinned_messages_pinned_by_fkey"
            columns: ["pinned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_pinned_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_room_invitations: {
        Row: {
          created_at: string
          expires_at: string | null
          id: number
          invitation_message: string | null
          invitee_id: number
          inviter_id: number
          responded_at: string | null
          room_id: number
          status: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: number
          invitation_message?: string | null
          invitee_id: number
          inviter_id: number
          responded_at?: string | null
          room_id: number
          status?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: number
          invitation_message?: string | null
          invitee_id?: number
          inviter_id?: number
          responded_at?: string | null
          room_id?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_room_invitations_invitee_id_fkey"
            columns: ["invitee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_room_invitations_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_room_invitations_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          id: number
          join_code: string | null
          last_message_at: string | null
          max_participants: number | null
          metadata: Json | null
          name: string
          owner_id: number
          participant_count: number | null
          room_type: Database["public"]["Enums"]["chat_room_type"] | null
          status: Database["public"]["Enums"]["chat_room_status"] | null
          updated_at: string | null
          welcome_message_content: string | null
          welcome_message_enabled: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: number
          join_code?: string | null
          last_message_at?: string | null
          max_participants?: number | null
          metadata?: Json | null
          name: string
          owner_id: number
          participant_count?: number | null
          room_type?: Database["public"]["Enums"]["chat_room_type"] | null
          status?: Database["public"]["Enums"]["chat_room_status"] | null
          updated_at?: string | null
          welcome_message_content?: string | null
          welcome_message_enabled?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: number
          join_code?: string | null
          last_message_at?: string | null
          max_participants?: number | null
          metadata?: Json | null
          name?: string
          owner_id?: number
          participant_count?: number | null
          room_type?: Database["public"]["Enums"]["chat_room_type"] | null
          status?: Database["public"]["Enums"]["chat_room_status"] | null
          updated_at?: string | null
          welcome_message_content?: string | null
          welcome_message_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_point_purchase_requests: {
        Row: {
          admin_notes: string | null
          coin_code: string
          coin_name_custom: string | null
          created_at: string
          deposit_amount: number
          exchange_name: string | null
          id: number
          issued_point_amount: number | null
          metadata: Json | null
          payment_method: string
          point_code: string
          processed_at: string | null
          processed_by: number | null
          rejection_reason: string | null
          status: string
          transaction_id: string
          updated_at: string | null
          user_id: number
          wallet_address: string
        }
        Insert: {
          admin_notes?: string | null
          coin_code: string
          coin_name_custom?: string | null
          created_at?: string
          deposit_amount: number
          exchange_name?: string | null
          id?: number
          issued_point_amount?: number | null
          metadata?: Json | null
          payment_method: string
          point_code: string
          processed_at?: string | null
          processed_by?: number | null
          rejection_reason?: string | null
          status?: string
          transaction_id: string
          updated_at?: string | null
          user_id: number
          wallet_address: string
        }
        Update: {
          admin_notes?: string | null
          coin_code?: string
          coin_name_custom?: string | null
          created_at?: string
          deposit_amount?: number
          exchange_name?: string | null
          id?: number
          issued_point_amount?: number | null
          metadata?: Json | null
          payment_method?: string
          point_code?: string
          processed_at?: string | null
          processed_by?: number | null
          rejection_reason?: string | null
          status?: string
          transaction_id?: string
          updated_at?: string | null
          user_id?: number
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "coin_point_purchase_requests_coin_code_fkey"
            columns: ["coin_code"]
            isOneToOne: false
            referencedRelation: "coin_types"
            referencedColumns: ["coin_code"]
          },
          {
            foreignKeyName: "coin_point_purchase_requests_point_code_fkey"
            columns: ["point_code"]
            isOneToOne: false
            referencedRelation: "point_codes"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "coin_point_purchase_requests_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coin_point_purchase_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_types: {
        Row: {
          coin_code: string
          coin_name: string
          coin_symbol: string
          created_at: string
          description: string | null
          display_order: number | null
          icon_url: string | null
          is_active: boolean
          is_purchase_enabled: boolean
          metadata: Json | null
          updated_at: string | null
        }
        Insert: {
          coin_code: string
          coin_name: string
          coin_symbol: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon_url?: string | null
          is_active?: boolean
          is_purchase_enabled?: boolean
          metadata?: Json | null
          updated_at?: string | null
        }
        Update: {
          coin_code?: string
          coin_name?: string
          coin_symbol?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon_url?: string | null
          is_active?: boolean
          is_purchase_enabled?: boolean
          metadata?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          deleted_at: string | null
          dislike_count: number | null
          id: number
          like_count: number | null
          parent_id: number | null
          post_id: number
          status: Database["public"]["Enums"]["comment_status"] | null
          updated_at: string | null
          writer_id: number | null
          writer_ip: unknown
          writer_name: string | null
          comments_writer_is_blocked_by_current_user: boolean | null
          reactions_comment_by_current_user: string | null
        }
        Insert: {
          content: string
          created_at?: string
          deleted_at?: string | null
          dislike_count?: number | null
          id?: number
          like_count?: number | null
          parent_id?: number | null
          post_id: number
          status?: Database["public"]["Enums"]["comment_status"] | null
          updated_at?: string | null
          writer_id?: number | null
          writer_ip?: unknown
          writer_name?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          deleted_at?: string | null
          dislike_count?: number | null
          id?: number
          like_count?: number | null
          parent_id?: number | null
          post_id?: number
          status?: Database["public"]["Enums"]["comment_status"] | null
          updated_at?: string | null
          writer_id?: number | null
          writer_ip?: unknown
          writer_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post_popularity_scores"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_writer_id_fkey"
            columns: ["writer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category_id: number
          created_at: string
          created_by: number | null
          deleted_at: string | null
          highlight: boolean | null
          id: number
          is_published: boolean | null
          order_no: number | null
          question: string
          show_in_main: boolean | null
          updated_at: string | null
          updated_by: number | null
          view_count: number | null
        }
        Insert: {
          answer: string
          category_id: number
          created_at?: string
          created_by?: number | null
          deleted_at?: string | null
          highlight?: boolean | null
          id?: number
          is_published?: boolean | null
          order_no?: number | null
          question: string
          show_in_main?: boolean | null
          updated_at?: string | null
          updated_by?: number | null
          view_count?: number | null
        }
        Update: {
          answer?: string
          category_id?: number
          created_at?: string
          created_by?: number | null
          deleted_at?: string | null
          highlight?: boolean | null
          id?: number
          is_published?: boolean | null
          order_no?: number | null
          question?: string
          show_in_main?: boolean | null
          updated_at?: string | null
          updated_by?: number | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "faqs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "help_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faqs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faqs_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      file_download_histories: {
        Row: {
          created_at: string
          download_url: string | null
          expires_at: string
          file_path: string
          id: number
          point_amount: number | null
          user_id: number
        }
        Insert: {
          created_at?: string
          download_url?: string | null
          expires_at: string
          file_path: string
          id?: number
          point_amount?: number | null
          user_id: number
        }
        Update: {
          created_at?: string
          download_url?: string | null
          expires_at?: string
          file_path?: string
          id?: number
          point_amount?: number | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "file_download_histories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      help_categories: {
        Row: {
          code: string
          created_at: string
          deleted_at: string | null
          description: string | null
          display_order: number | null
          icon_name: string | null
          id: number
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      menu: {
        Row: {
          board_id: number | null
          created_at: string
          deleted_at: string | null
          display_order: number | null
          id: number
          is_mobile_enabled: boolean | null
          is_pc_enabled: boolean | null
          link_url: string | null
          name: string
          parent_id: number | null
          required_level: number | null
          sub_type: Database["public"]["Enums"]["menu_sub_type"] | null
          type: Database["public"]["Enums"]["menu_type"]
          updated_at: string | null
        }
        Insert: {
          board_id?: number | null
          created_at?: string
          deleted_at?: string | null
          display_order?: number | null
          id?: number
          is_mobile_enabled?: boolean | null
          is_pc_enabled?: boolean | null
          link_url?: string | null
          name: string
          parent_id?: number | null
          required_level?: number | null
          sub_type?: Database["public"]["Enums"]["menu_sub_type"] | null
          type: Database["public"]["Enums"]["menu_type"]
          updated_at?: string | null
        }
        Update: {
          board_id?: number | null
          created_at?: string
          deleted_at?: string | null
          display_order?: number | null
          id?: number
          is_mobile_enabled?: boolean | null
          is_pc_enabled?: boolean | null
          link_url?: string | null
          name?: string
          parent_id?: number | null
          required_level?: number | null
          sub_type?: Database["public"]["Enums"]["menu_sub_type"] | null
          type?: Database["public"]["Enums"]["menu_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menu"
            referencedColumns: ["id"]
          },
        ]
      }
      migrations: {
        Row: {
          applied_at: string
          description: string | null
          id: number
          version: string
        }
        Insert: {
          applied_at?: string
          description?: string | null
          id?: number
          version: string
        }
        Update: {
          applied_at?: string
          description?: string | null
          id?: number
          version?: string
        }
        Relationships: []
      }
      notification_events: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: number
          interpolation_values: Json | null
          notification_template_name: string
          push_result: Json | null
          update_reason: string | null
          updated_at: string | null
          user_id: number | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          interpolation_values?: Json | null
          notification_template_name: string
          push_result?: Json | null
          update_reason?: string | null
          updated_at?: string | null
          user_id?: number | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          interpolation_values?: Json | null
          notification_template_name?: string
          push_result?: Json | null
          update_reason?: string | null
          updated_at?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_events_notification_template_name_fkey"
            columns: ["notification_template_name"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["template_name"]
          },
          {
            foreignKeyName: "notification_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_schedules: {
        Row: {
          created_at: string
          error_message: string | null
          id: number
          interpolation_values: Json | null
          is_sent: boolean
          next_retry_at: string | null
          notification_template_name: string
          retry_count: number
          scheduled_at: string
          sent_at: string | null
          updated_at: string | null
          user_ids: number[]
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: number
          interpolation_values?: Json | null
          is_sent?: boolean
          next_retry_at?: string | null
          notification_template_name: string
          retry_count?: number
          scheduled_at: string
          sent_at?: string | null
          updated_at?: string | null
          user_ids: number[]
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: number
          interpolation_values?: Json | null
          is_sent?: boolean
          next_retry_at?: string | null
          notification_template_name?: string
          retry_count?: number
          scheduled_at?: string
          sent_at?: string | null
          updated_at?: string | null
          user_ids?: number[]
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          body: string | null
          created_at: string
          is_email_send: boolean
          is_enabled: boolean
          is_push_send: boolean
          is_sms_send: boolean
          mobile_landing_url: string | null
          template_group: string | null
          template_name: string
          template_sub_group: string | null
          title: string | null
          updated_at: string | null
          web_landing_url: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          is_email_send?: boolean
          is_enabled?: boolean
          is_push_send?: boolean
          is_sms_send?: boolean
          mobile_landing_url?: string | null
          template_group?: string | null
          template_name: string
          template_sub_group?: string | null
          title?: string | null
          updated_at?: string | null
          web_landing_url?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          is_email_send?: boolean
          is_enabled?: boolean
          is_push_send?: boolean
          is_sms_send?: boolean
          mobile_landing_url?: string | null
          template_group?: string | null
          template_name?: string
          template_sub_group?: string | null
          title?: string | null
          updated_at?: string | null
          web_landing_url?: string | null
        }
        Relationships: []
      }
      permission_changes: {
        Row: {
          changed_at: string | null
          changed_by: number | null
          id: number
          new_type: Database["public"]["Enums"]["permission_type"] | null
          old_type: Database["public"]["Enums"]["permission_type"] | null
          user_id: number | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: number | null
          id?: number
          new_type?: Database["public"]["Enums"]["permission_type"] | null
          old_type?: Database["public"]["Enums"]["permission_type"] | null
          user_id?: number | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: number | null
          id?: number
          new_type?: Database["public"]["Enums"]["permission_type"] | null
          old_type?: Database["public"]["Enums"]["permission_type"] | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "permission_changes_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permission_changes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      point_codes: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      point_error_logs: {
        Row: {
          additional_info: Json | null
          amount: number | null
          created_at: string | null
          error_message: string
          error_type: string
          id: number
          point_code: string | null
          table_name: string | null
          table_record_id: string | null
          user_id: number | null
        }
        Insert: {
          additional_info?: Json | null
          amount?: number | null
          created_at?: string | null
          error_message: string
          error_type: string
          id?: number
          point_code?: string | null
          table_name?: string | null
          table_record_id?: string | null
          user_id?: number | null
        }
        Update: {
          additional_info?: Json | null
          amount?: number | null
          created_at?: string | null
          error_message?: string
          error_type?: string
          id?: number
          point_code?: string | null
          table_name?: string | null
          table_record_id?: string | null
          user_id?: number | null
        }
        Relationships: []
      }
      point_expiration_logs: {
        Row: {
          created_at: string | null
          execution_date: string
          execution_time: unknown
          id: number
          total_expired_amount: number
        }
        Insert: {
          created_at?: string | null
          execution_date: string
          execution_time: unknown
          id?: number
          total_expired_amount: number
        }
        Update: {
          created_at?: string | null
          execution_date?: string
          execution_time?: unknown
          id?: number
          total_expired_amount?: number
        }
        Relationships: []
      }
      point_policies: {
        Row: {
          created_at: string | null
          expiration_period: number | null
          expiration_period_type: Database["public"]["Enums"]["point_expiration_period_type"]
          fixed_expiration_date: string | null
          id: number
          is_auto_issue: boolean | null
          name: string
          point_code: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expiration_period?: number | null
          expiration_period_type: Database["public"]["Enums"]["point_expiration_period_type"]
          fixed_expiration_date?: string | null
          id?: number
          is_auto_issue?: boolean | null
          name: string
          point_code: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expiration_period?: number | null
          expiration_period_type?: Database["public"]["Enums"]["point_expiration_period_type"]
          fixed_expiration_date?: string | null
          id?: number
          is_auto_issue?: boolean | null
          name?: string
          point_code?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "point_policies_point_code_fkey"
            columns: ["point_code"]
            isOneToOne: false
            referencedRelation: "point_codes"
            referencedColumns: ["code"]
          },
        ]
      }
      point_security_logs: {
        Row: {
          change_amount: number | null
          detected_at: string | null
          event_type: string
          id: number
          new_balance: number | null
          old_balance: number | null
          point_code: string
          severity: string | null
          source_info: Json | null
          user_id: number
        }
        Insert: {
          change_amount?: number | null
          detected_at?: string | null
          event_type: string
          id?: number
          new_balance?: number | null
          old_balance?: number | null
          point_code: string
          severity?: string | null
          source_info?: Json | null
          user_id: number
        }
        Update: {
          change_amount?: number | null
          detected_at?: string | null
          event_type?: string
          id?: number
          new_balance?: number | null
          old_balance?: number | null
          point_code?: string
          severity?: string | null
          source_info?: Json | null
          user_id?: number
        }
        Relationships: []
      }
      point_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string | null
          description: string | null
          expiration_date: string | null
          id: number
          point_code: string
          policy_id: number | null
          related_transaction_id: number | null
          transaction_type: Database["public"]["Enums"]["point_transaction_type"]
          updated_at: string | null
          user_id: number
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string | null
          description?: string | null
          expiration_date?: string | null
          id?: number
          point_code: string
          policy_id?: number | null
          related_transaction_id?: number | null
          transaction_type: Database["public"]["Enums"]["point_transaction_type"]
          updated_at?: string | null
          user_id: number
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string | null
          description?: string | null
          expiration_date?: string | null
          id?: number
          point_code?: string
          policy_id?: number | null
          related_transaction_id?: number | null
          transaction_type?: Database["public"]["Enums"]["point_transaction_type"]
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "point_transactions_point_code_fkey"
            columns: ["point_code"]
            isOneToOne: false
            referencedRelation: "point_codes"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "point_transactions_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "point_policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_transactions_related_transaction_id_fkey"
            columns: ["related_transaction_id"]
            isOneToOne: false
            referencedRelation: "point_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      post_bookmarks: {
        Row: {
          created_at: string
          folder_id: number | null
          id: number
          post_id: number
          user_id: number
        }
        Insert: {
          created_at?: string
          folder_id?: number | null
          id?: number
          post_id: number
          user_id?: number
        }
        Update: {
          created_at?: string
          folder_id?: number | null
          id?: number
          post_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "post_bookmarks_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "bookmark_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post_popularity_scores"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      post_download_histories: {
        Row: {
          created_at: string
          expires_at: string
          id: number
          point_amount: number | null
          post_id: number
          user_id: number
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: number
          point_amount?: number | null
          post_id: number
          user_id: number
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: number
          point_amount?: number | null
          post_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "post_download_histories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post_popularity_scores"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_download_histories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_download_histories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      post_views: {
        Row: {
          created_at: string
          id: number
          post_id: number
          viewer_id: number | null
          viewer_ip: unknown
        }
        Insert: {
          created_at?: string
          id?: number
          post_id: number
          viewer_id?: number | null
          viewer_ip: unknown
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: number
          viewer_id?: number | null
          viewer_ip?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "post_views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post_popularity_scores"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          attachments: Json | null
          board_id: number
          category_id: number | null
          comment_count: number | null
          content: string
          created_at: string
          created_by: number | null
          deleted_at: string | null
          dislike_count: number | null
          download_point: number | null
          id: number
          is_anonymous: boolean | null
          is_notice: boolean | null
          is_secret: boolean | null
          like_count: number | null
          metadata: Json | null
          parent_id: number | null
          password: string | null
          restrict_attachments: Json | null
          status: Database["public"]["Enums"]["post_status"] | null
          thumbnail: string | null
          title: string
          updated_at: string | null
          updated_by: number | null
          view_count: number | null
          writer_id: number | null
          writer_ip: unknown
          writer_name: string | null
          posts_writer_is_blocked_by_current_user: boolean | null
          reactions_post_by_current_user: string | null
        }
        Insert: {
          attachments?: Json | null
          board_id: number
          category_id?: number | null
          comment_count?: number | null
          content: string
          created_at?: string
          created_by?: number | null
          deleted_at?: string | null
          dislike_count?: number | null
          download_point?: number | null
          id?: number
          is_anonymous?: boolean | null
          is_notice?: boolean | null
          is_secret?: boolean | null
          like_count?: number | null
          metadata?: Json | null
          parent_id?: number | null
          password?: string | null
          restrict_attachments?: Json | null
          status?: Database["public"]["Enums"]["post_status"] | null
          thumbnail?: string | null
          title: string
          updated_at?: string | null
          updated_by?: number | null
          view_count?: number | null
          writer_id?: number | null
          writer_ip?: unknown
          writer_name?: string | null
        }
        Update: {
          attachments?: Json | null
          board_id?: number
          category_id?: number | null
          comment_count?: number | null
          content?: string
          created_at?: string
          created_by?: number | null
          deleted_at?: string | null
          dislike_count?: number | null
          download_point?: number | null
          id?: number
          is_anonymous?: boolean | null
          is_notice?: boolean | null
          is_secret?: boolean | null
          like_count?: number | null
          metadata?: Json | null
          parent_id?: number | null
          password?: string | null
          restrict_attachments?: Json | null
          status?: Database["public"]["Enums"]["post_status"] | null
          thumbnail?: string | null
          title?: string
          updated_at?: string | null
          updated_by?: number | null
          view_count?: number | null
          writer_id?: number | null
          writer_ip?: unknown
          writer_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "board_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "post_popularity_scores"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "posts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_writer_id_fkey"
            columns: ["writer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts_search_logs: {
        Row: {
          board_id: number | null
          created_at: string
          id: number
          referer: string | null
          result_count: number | null
          search_query: string
          search_type: string
          sort_by: string | null
          user_agent: string | null
          user_id: number | null
          user_ip: unknown
        }
        Insert: {
          board_id?: number | null
          created_at?: string
          id?: number
          referer?: string | null
          result_count?: number | null
          search_query: string
          search_type?: string
          sort_by?: string | null
          user_agent?: string | null
          user_id?: number | null
          user_ip?: unknown
        }
        Update: {
          board_id?: number | null
          created_at?: string
          id?: number
          referer?: string | null
          result_count?: number | null
          search_query?: string
          search_type?: string
          sort_by?: string | null
          user_agent?: string | null
          user_id?: number | null
          user_ip?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "posts_search_logs_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_search_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reactions: {
        Row: {
          created_at: string
          reaction_type: Database["public"]["Enums"]["reaction_type"]
          target_id: number
          target_type: Database["public"]["Enums"]["reaction_target_type"]
          user_id: number
        }
        Insert: {
          created_at?: string
          reaction_type: Database["public"]["Enums"]["reaction_type"]
          target_id: number
          target_type: Database["public"]["Enums"]["reaction_target_type"]
          user_id?: number
        }
        Update: {
          created_at?: string
          reaction_type?: Database["public"]["Enums"]["reaction_type"]
          target_id?: number
          target_type?: Database["public"]["Enums"]["reaction_target_type"]
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      report_types: {
        Row: {
          code: string
          created_at: string
          description: string | null
          display_order: number
          is_active: boolean
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          display_order?: number
          is_active?: boolean
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          display_order?: number
          is_active?: boolean
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          content: string
          created_at: string
          deleted_at: string | null
          id: number
          process_comment: string | null
          processed_at: string | null
          processed_by: number | null
          report_type_code: string
          reporter_id: number
          status: Database["public"]["Enums"]["report_status"]
          target_id: number
          target_type: Database["public"]["Enums"]["report_target_type"]
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string
          deleted_at?: string | null
          id?: number
          process_comment?: string | null
          processed_at?: string | null
          processed_by?: number | null
          report_type_code: string
          reporter_id?: number
          status?: Database["public"]["Enums"]["report_status"]
          target_id: number
          target_type: Database["public"]["Enums"]["report_target_type"]
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          deleted_at?: string | null
          id?: number
          process_comment?: string | null
          processed_at?: string | null
          processed_by?: number | null
          report_type_code?: string
          reporter_id?: number
          status?: Database["public"]["Enums"]["report_status"]
          target_id?: number
          target_type?: Database["public"]["Enums"]["report_target_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_report_type_code_fkey"
            columns: ["report_type_code"]
            isOneToOne: false
            referencedRelation: "report_types"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      site_config_kv: {
        Row: {
          description: string | null
          key: Database["public"]["Enums"]["site_config_key"]
          updated_at: string
          updated_by: number | null
          value: Json
        }
        Insert: {
          description?: string | null
          key: Database["public"]["Enums"]["site_config_key"]
          updated_at?: string
          updated_by?: number | null
          value: Json
        }
        Update: {
          description?: string | null
          key?: Database["public"]["Enums"]["site_config_key"]
          updated_at?: string
          updated_by?: number | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "site_config_kv_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_agreements: {
        Row: {
          agreed: boolean
          agreed_at: string
          agreement_code: string
          user_id: number
        }
        Insert: {
          agreed?: boolean
          agreed_at?: string
          agreement_code: string
          user_id?: number
        }
        Update: {
          agreed?: boolean
          agreed_at?: string
          agreement_code?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_agreements_agreement_code_fkey"
            columns: ["agreement_code"]
            isOneToOne: false
            referencedRelation: "agreements"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "user_agreements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_attendance: {
        Row: {
          attendance_date: string
          created_at: string
          id: number
          user_id: number
        }
        Insert: {
          attendance_date?: string
          created_at?: string
          id?: number
          user_id?: number
        }
        Update: {
          attendance_date?: string
          created_at?: string
          id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_attendance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          acquired_at: string
          acquisition_type: string
          badge_id: number
          created_at: string
          id: number
          is_active: boolean | null
          transaction_id: number | null
          updated_at: string | null
          user_id: number
        }
        Insert: {
          acquired_at?: string
          acquisition_type: string
          badge_id: number
          created_at?: string
          id?: number
          is_active?: boolean | null
          transaction_id?: number | null
          updated_at?: string | null
          user_id: number
        }
        Update: {
          acquired_at?: string
          acquisition_type?: string
          badge_id?: number
          created_at?: string
          id?: number
          is_active?: boolean | null
          transaction_id?: number | null
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "point_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_blocks: {
        Row: {
          blocked_user_id: number
          blocker_user_id: number
          created_at: string
          id: number
          reason: string | null
        }
        Insert: {
          blocked_user_id: number
          blocker_user_id?: number
          created_at?: string
          id?: number
          reason?: string | null
        }
        Update: {
          blocked_user_id?: number
          blocker_user_id?: number
          created_at?: string
          id?: number
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_blocks_blocked_user_id_fkey"
            columns: ["blocked_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_blocks_blocker_user_id_fkey"
            columns: ["blocker_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenge_progress: {
        Row: {
          challenge_id: number
          claimed_at: string | null
          created_at: string
          current_count: number
          expires_at: string | null
          id: number
          is_claimed: boolean
          progress_date: string | null
          updated_at: string
          user_id: number
        }
        Insert: {
          challenge_id: number
          claimed_at?: string | null
          created_at?: string
          current_count?: number
          expires_at?: string | null
          id?: number
          is_claimed?: boolean
          progress_date?: string | null
          updated_at?: string
          user_id?: number
        }
        Update: {
          challenge_id?: number
          claimed_at?: string | null
          created_at?: string
          current_count?: number
          expires_at?: string | null
          id?: number
          is_claimed?: boolean
          progress_date?: string | null
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_challenge_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_level_configs: {
        Row: {
          additional_settings: Json | null
          daily_comment_limit: number
          daily_file_upload_limit: number
          daily_post_limit: number
          level: number
          level_name: string | null
          required_points: number
        }
        Insert: {
          additional_settings?: Json | null
          daily_comment_limit?: number
          daily_file_upload_limit?: number
          daily_post_limit?: number
          level: number
          level_name?: string | null
          required_points: number
        }
        Update: {
          additional_settings?: Json | null
          daily_comment_limit?: number
          daily_file_upload_limit?: number
          daily_post_limit?: number
          level?: number
          level_name?: string | null
          required_points?: number
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          body: string | null
          created_at: string
          id: number
          is_read: boolean
          mobile_landing_url: string | null
          params: Json | null
          title: string
          updated_at: string | null
          user_id: number
          web_landing_url: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: number
          is_read?: boolean
          mobile_landing_url?: string | null
          params?: Json | null
          title: string
          updated_at?: string | null
          user_id: number
          web_landing_url?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: number
          is_read?: boolean
          mobile_landing_url?: string | null
          params?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: number
          web_landing_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_point_wallets: {
        Row: {
          balance: number
          created_at: string | null
          id: number
          point_code: string
          updated_at: string | null
          user_id: number
          version: number
        }
        Insert: {
          balance?: number
          created_at?: string | null
          id?: number
          point_code: string
          updated_at?: string | null
          user_id: number
          version?: number
        }
        Update: {
          balance?: number
          created_at?: string | null
          id?: number
          point_code?: string
          updated_at?: string | null
          user_id?: number
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_point_wallets_point_code_fkey"
            columns: ["point_code"]
            isOneToOne: false
            referencedRelation: "point_codes"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "user_point_wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          activity_level: number | null
          auth_user_id: string | null
          avatar_file_id: string | null
          avatar_path: string | null
          birthdate: string | null
          created_at: string
          deleted_at: string | null
          email: string
          gender: Database["public"]["Enums"]["gender"] | null
          id: number
          info_open_settings: Json | null
          invite_code: string
          invited_by: number | null
          is_withdrawal_requested: boolean
          login_id: string
          nickname: string
          nickname_changed_at: string | null
          permission_type: Database["public"]["Enums"]["permission_type"]
          phone_number: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
        }
        Insert: {
          activity_level?: number | null
          auth_user_id?: string | null
          avatar_file_id?: string | null
          avatar_path?: string | null
          birthdate?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: number
          info_open_settings?: Json | null
          invite_code: string
          invited_by?: number | null
          is_withdrawal_requested?: boolean
          login_id: string
          nickname: string
          nickname_changed_at?: string | null
          permission_type?: Database["public"]["Enums"]["permission_type"]
          phone_number?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
        }
        Update: {
          activity_level?: number | null
          auth_user_id?: string | null
          avatar_file_id?: string | null
          avatar_path?: string | null
          birthdate?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: number
          info_open_settings?: Json | null
          invite_code?: string
          invited_by?: number | null
          is_withdrawal_requested?: boolean
          login_id?: string
          nickname?: string
          nickname_changed_at?: string | null
          permission_type?: Database["public"]["Enums"]["permission_type"]
          phone_number?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      post_popularity_scores: {
        Row: {
          board_id: number | null
          comment_count: number | null
          created_at: string | null
          like_count: number | null
          name: string | null
          popularity_score: number | null
          post_id: number | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      anonymous_visitor_log_create: {
        Args: { p_session_key: string }
        Returns: boolean
      }
      banners_increment_click_count: {
        Args: { p_banner_id: number }
        Returns: undefined
      }
      blocked_ips_do_block: {
        Args: {
          ip_to_block: unknown
          p_blocked_by_user_id?: number
          p_reason: string
        }
        Returns: undefined
      }
      blocked_ips_do_unblock: {
        Args: { ip_to_unblock: unknown }
        Returns: undefined
      }
      blocked_ips_is_blocked: { Args: { check_ip: unknown }; Returns: boolean }
      coin_point_purchase_requests_create: {
        Args: {
          p_coin_code: string
          p_coin_name_custom?: string
          p_deposit_amount: number
          p_exchange_name?: string
          p_payment_method: string
          p_transaction_id: string
          p_wallet_address: string
        }
        Returns: Json
      }
      coin_purchase_request_admin_process: {
        Args: {
          p_action: string
          p_admin_notes?: string
          p_issued_point_amount?: number
          p_rejection_reason?: string
          p_request_id: number
        }
        Returns: Json
      }
      coin_purchase_request_cancel: {
        Args: { p_request_id: number }
        Returns: Json
      }
      comments_create: {
        Args: {
          p_anonymous_nickname?: string
          p_content: string
          p_parent_id?: number
          p_post_id: number
        }
        Returns: number
      }
      comments_writer_is_blocked_by_current_user: {
        Args: { "": Database["public"]["Tables"]["comments"]["Row"] }
        Returns: {
          error: true
        } & "the function public.comments_writer_is_blocked_by_current_user with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
      }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      extract_client_ip: { Args: never; Returns: unknown }
      faq_increment_view_count: { Args: { faq_id: number }; Returns: undefined }
      file_download_history_create: {
        Args: {
          p_board_id?: number
          p_download_url: string
          p_expires_at: string
          p_file_path: string
        }
        Returns: Json
      }
      file_download_history_get_exist: {
        Args: { p_file_path: string }
        Returns: Json
      }
      generate_random_code: { Args: { length?: number }; Returns: string }
      get_daily_visitor_count: { Args: { p_hours?: number }; Returns: number }
      get_monthly_popular_posts: {
        Args: { p_date?: string; p_limit?: number }
        Returns: Json
      }
      get_nickname_from_auth_uid: { Args: never; Returns: string }
      get_site_config_kv: { Args: { p_key: string }; Returns: Json }
      get_user_id_from_auth_uid: { Args: never; Returns: number }
      get_weekly_popular_posts: {
        Args: { p_date?: string; p_limit?: number }
        Returns: Json
      }
      has_permission: {
        Args: {
          allowed_permissions: Database["public"]["Enums"]["permission_type"][]
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      points_issue: {
        Args: {
          p_amount: number
          p_description?: string
          p_point_code: string
          p_policy_id: number
          p_user_id: number
        }
        Returns: undefined
      }
      post_download_history_create: {
        Args: { p_expires_at: string; p_post_id: number }
        Returns: Json
      }
      post_download_history_get_exist: {
        Args: { p_post_id: number }
        Returns: Json
      }
      posts_check_read_condition: {
        Args: { p_post_id: number }
        Returns: string
      }
      posts_create: {
        Args: {
          p_anonymous_nickname?: string
          p_attachments?: Json
          p_board_id: number
          p_category_id?: number
          p_content: string
          p_download_point?: number
          p_is_anonymous?: boolean
          p_is_notice?: boolean
          p_is_secret?: boolean
          p_metadata?: Json
          p_parent_id?: number
          p_password?: string
          p_restrict_attachments?: Json
          p_title: string
        }
        Returns: number
      }
      posts_delete: { Args: { p_post_id: number }; Returns: boolean }
      posts_get_daily_popular: {
        Args: { p_date?: string; p_limit?: number }
        Returns: Json
      }
      posts_get_dashboard_recent: {
        Args: { p_board_ids?: number[]; p_limit_per_board?: number }
        Returns: Json
      }
      posts_read: {
        Args: { p_post_id: number; p_viewer_ip: unknown }
        Returns: Json
      }
      posts_search: {
        Args: {
          p_board_id?: number
          p_page_number?: number
          p_page_size?: number
          p_query: string
          p_search_type?: string
          p_sort_by?: string
        }
        Returns: {
          board_id: number
          comment_count: number
          content: string
          created_at: string
          id: number
          is_notice: boolean
          like_count: number
          score: number
          title: string
          view_count: number
          writer_name: string
        }[]
      }
      posts_search_by_content: {
        Args: {
          p_board_id?: number
          p_page_number?: number
          p_page_size?: number
          p_query: string
          p_sort_by?: string
        }
        Returns: {
          board_id: number
          comment_count: number
          content: string
          created_at: string
          id: number
          is_notice: boolean
          like_count: number
          score: number
          title: string
          view_count: number
          writer_name: string
        }[]
      }
      posts_search_by_title: {
        Args: {
          p_board_id?: number
          p_page_number?: number
          p_page_size?: number
          p_query: string
          p_sort_by?: string
        }
        Returns: {
          board_id: number
          comment_count: number
          content: string
          created_at: string
          id: number
          is_notice: boolean
          like_count: number
          score: number
          title: string
          view_count: number
          writer_name: string
        }[]
      }
      posts_search_by_title_and_content: {
        Args: {
          p_board_id?: number
          p_page_number?: number
          p_page_size?: number
          p_query: string
          p_sort_by?: string
        }
        Returns: {
          board_id: number
          comment_count: number
          content: string
          created_at: string
          id: number
          is_notice: boolean
          like_count: number
          score: number
          title: string
          view_count: number
          writer_name: string
        }[]
      }
      posts_search_count: {
        Args: { p_board_id?: number; p_query: string; p_search_type?: string }
        Returns: number
      }
      posts_writer_is_blocked_by_current_user: {
        Args: { "": Database["public"]["Tables"]["posts"]["Row"] }
        Returns: {
          error: true
        } & "the function public.posts_writer_is_blocked_by_current_user with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
      }
      reactions_comment_by_current_user: {
        Args: { "": Database["public"]["Tables"]["comments"]["Row"] }
        Returns: {
          error: true
        } & "the function public.reactions_comment_by_current_user with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
      }
      reactions_create: {
        Args: {
          p_reaction_type: string
          p_target_id: number
          p_target_type: string
        }
        Returns: boolean
      }
      reactions_post_by_current_user: {
        Args: { "": Database["public"]["Tables"]["posts"]["Row"] }
        Returns: {
          error: true
        } & "the function public.reactions_post_by_current_user with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
      }
      refresh_post_popularity_scores: { Args: never; Returns: undefined }
      user_attendance_process: { Args: never; Returns: boolean }
      user_challenge_progress_claim_reward: {
        Args: { p_challenge_id: number }
        Returns: Json
      }
      user_point_wallets_ranking: {
        Args: never
        Returns: {
          achieved_at: string
          activity_level: number
          avatar_path: string
          balance: number
          nickname: string
          rank_position: number
          user_id: number
        }[]
      }
      users_block_user: {
        Args: { p_blocked_user_id: number; p_reason?: string }
        Returns: boolean
      }
      users_is_blocked_by_current_user: {
        Args: { p_user_id: number }
        Returns: boolean
      }
      users_is_email_duplicate: { Args: { p_email: string }; Returns: boolean }
      users_is_login_id_duplicate: {
        Args: { p_login_id: string }
        Returns: boolean
      }
      users_is_nickname_duplicate: {
        Args: { p_nickname: string }
        Returns: boolean
      }
      users_nickname_change_validation: {
        Args: { p_new_nickname: string }
        Returns: Json
      }
      users_unblock_user: {
        Args: { p_blocked_user_id: number }
        Returns: boolean
      }
      users_withdrawal: { Args: { p_user_id: number }; Returns: undefined }
    }
    Enums: {
      badge_condition_type:
        | "post_count"
        | "comment_count"
        | "attendance_days"
        | "point_purchase"
        | "level"
      badge_status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
      banner_position:
        | "LEFT_SIDE"
        | "RIGHT_SIDE"
        | "CENTER"
        | "TOP"
        | "BOTTOM"
        | "POPUP"
        | "FLOATING"
      banner_status: "DRAFT" | "ACTIVE" | "PAUSED" | "DELETED"
      board_visibility: "public" | "private" | "hidden"
      chat_message_status: "sent" | "delivered" | "read" | "deleted"
      chat_message_type: "text" | "image" | "file" | "system" | "welcome"
      chat_participant_role: "owner" | "admin" | "member"
      chat_report_status: "pending" | "reviewed" | "resolved" | "dismissed"
      chat_room_status: "active" | "archived" | "deleted"
      chat_room_type: "public" | "private"
      comment_status: "published" | "deleted" | "blocked"
      device_type: "PC" | "MOBILE" | "TABLET"
      gender: "male" | "female"
      menu_sub_type: "common" | "partner"
      menu_type: "link" | "board"
      permission_type:
        | "super_admin"
        | "admin"
        | "moderator"
        | "manager"
        | "staff"
        | "user"
        | "anonymous"
      point_expiration_period_type:
        | "YEAR"
        | "MONTH"
        | "DAY"
        | "DATE"
        | "WEEK"
        | "NEVER"
      point_transaction_type: "EARN" | "USE" | "REFUND" | "EXPIRE"
      post_status: "draft" | "published" | "deleted" | "blocked"
      reaction_target_type: "user" | "post" | "comment"
      reaction_type: "like" | "dislike"
      report_status: "pending" | "processing" | "completed" | "rejected"
      report_target_type: "user" | "post" | "comment"
      site_config_key:
        | "user.register_level"
        | "user.register_point"
        | "user.login_point"
        | "user.nickname_change_interval_days"
        | "upload.allowed_ext.image"
        | "upload.allowed_ext.video"
        | "upload.allowed_ext.document"
        | "upload.max_size.user_avatar"
        | "upload.max_size.user_image"
        | "terms.version"
        | "maintenance_mode"
        | "site.name"
        | "site.title"
        | "site.contact_email"
        | "user.profile_fields"
        | "site.forbidden_words"
        | "site.terms_of_service"
        | "site.privacy_policy"
        | "cleanup.days_visit_logs"
        | "cleanup.days_member_leave"
        | "site.enable_ip_base_view_count"
        | "challenge.is_enabled"
        | "ranking_exclude_users"
      user_status:
        | "active"
        | "inactive"
        | "suspended"
        | "dormant"
        | "pending_withdrawal"
        | "withdrawn"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      badge_condition_type: [
        "post_count",
        "comment_count",
        "attendance_days",
        "point_purchase",
        "level",
      ],
      badge_status: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      banner_position: [
        "LEFT_SIDE",
        "RIGHT_SIDE",
        "CENTER",
        "TOP",
        "BOTTOM",
        "POPUP",
        "FLOATING",
      ],
      banner_status: ["DRAFT", "ACTIVE", "PAUSED", "DELETED"],
      board_visibility: ["public", "private", "hidden"],
      chat_message_status: ["sent", "delivered", "read", "deleted"],
      chat_message_type: ["text", "image", "file", "system", "welcome"],
      chat_participant_role: ["owner", "admin", "member"],
      chat_report_status: ["pending", "reviewed", "resolved", "dismissed"],
      chat_room_status: ["active", "archived", "deleted"],
      chat_room_type: ["public", "private"],
      comment_status: ["published", "deleted", "blocked"],
      device_type: ["PC", "MOBILE", "TABLET"],
      gender: ["male", "female"],
      menu_sub_type: ["common", "partner"],
      menu_type: ["link", "board"],
      permission_type: [
        "super_admin",
        "admin",
        "moderator",
        "manager",
        "staff",
        "user",
        "anonymous",
      ],
      point_expiration_period_type: [
        "YEAR",
        "MONTH",
        "DAY",
        "DATE",
        "WEEK",
        "NEVER",
      ],
      point_transaction_type: ["EARN", "USE", "REFUND", "EXPIRE"],
      post_status: ["draft", "published", "deleted", "blocked"],
      reaction_target_type: ["user", "post", "comment"],
      reaction_type: ["like", "dislike"],
      report_status: ["pending", "processing", "completed", "rejected"],
      report_target_type: ["user", "post", "comment"],
      site_config_key: [
        "user.register_level",
        "user.register_point",
        "user.login_point",
        "user.nickname_change_interval_days",
        "upload.allowed_ext.image",
        "upload.allowed_ext.video",
        "upload.allowed_ext.document",
        "upload.max_size.user_avatar",
        "upload.max_size.user_image",
        "terms.version",
        "maintenance_mode",
        "site.name",
        "site.title",
        "site.contact_email",
        "user.profile_fields",
        "site.forbidden_words",
        "site.terms_of_service",
        "site.privacy_policy",
        "cleanup.days_visit_logs",
        "cleanup.days_member_leave",
        "site.enable_ip_base_view_count",
        "challenge.is_enabled",
        "ranking_exclude_users",
      ],
      user_status: [
        "active",
        "inactive",
        "suspended",
        "dormant",
        "pending_withdrawal",
        "withdrawn",
      ],
    },
  },
} as const
