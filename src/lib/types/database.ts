// Database Types for Vercel Storage Migration
// This file contains TypeScript types for the database tables

export interface Database {
  public: {
    Tables: {
      // Existing tables from original supabase.ts
      user_profiles: {
        Row: {
          id: string;
          uuid: string;
          nickname?: string;
          avatar_url?: string;
          locale?: string;
          signin_type?: string;
          signin_ip?: string;
          signin_provider?: string;
          signin_openid?: string;
          invite_code: string;
          invited_by: string;
          is_affiliate: boolean;
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          id: string;
          uuid?: string;
          nickname?: string;
          avatar_url?: string;
          locale?: string;
          signin_type?: string;
          signin_ip?: string;
          signin_provider?: string;
          signin_openid?: string;
          invite_code?: string;
          invited_by?: string;
          is_affiliate?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          uuid?: string;
          nickname?: string;
          avatar_url?: string;
          locale?: string;
          signin_type?: string;
          signin_ip?: string;
          signin_provider?: string;
          signin_openid?: string;
          invite_code?: string;
          invited_by?: string;
          is_affiliate?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      
      // New tables for Vercel storage migration
      site_config: {
        Row: {
          id: string;
          key: string;
          value: any; // JSONB
          description?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: any;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: any;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      backlink_items: {
        Row: {
          id: string;
          external_id: string;
          name: string;
          url?: string;
          type: 'free' | 'paid';
          category?: string;
          description?: string;
          priority?: 'high' | 'medium' | 'low';
          traffic?: string;
          as_value?: string;
          price?: string;
          completed: boolean;
          completed_at?: string;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          external_id: string;
          name: string;
          url?: string;
          type: 'free' | 'paid';
          category?: string;
          description?: string;
          priority?: 'high' | 'medium' | 'low';
          traffic?: string;
          as_value?: string;
          price?: string;
          completed?: boolean;
          completed_at?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          external_id?: string;
          name?: string;
          url?: string;
          type?: 'free' | 'paid';
          category?: string;
          description?: string;
          priority?: 'high' | 'medium' | 'low';
          traffic?: string;
          as_value?: string;
          price?: string;
          completed?: boolean;
          completed_at?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      seo_progress: {
        Row: {
          id: string;
          month: string;
          category: string;
          task_key: string;
          task_name: string;
          completed: boolean;
          completed_at?: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          month: string;
          category: string;
          task_key: string;
          task_name: string;
          completed?: boolean;
          completed_at?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          month?: string;
          category?: string;
          task_key?: string;
          task_name?: string;
          completed?: boolean;
          completed_at?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      cms_content: {
        Row: {
          id: string;
          path: string;
          content: string;
          content_type: string;
          file_size?: number;
          checksum?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          path: string;
          content: string;
          content_type?: string;
          file_size?: number;
          checksum?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          path?: string;
          content?: string;
          content_type?: string;
          file_size?: number;
          checksum?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      env_config: {
        Row: {
          id: string;
          key: string;
          value?: string;
          description?: string;
          is_secret: boolean;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value?: string;
          description?: string;
          is_secret?: boolean;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          description?: string;
          is_secret?: boolean;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      system_logs: {
        Row: {
          id: string;
          level: 'info' | 'warn' | 'error' | 'debug';
          message: string;
          context?: any; // JSONB
          source?: string;
          user_id?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          level: 'info' | 'warn' | 'error' | 'debug';
          message: string;
          context?: any;
          source?: string;
          user_id?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          level?: 'info' | 'warn' | 'error' | 'debug';
          message?: string;
          context?: any;
          source?: string;
          user_id?: string;
          created_at?: string;
        };
      };

      // Include other existing tables from the original supabase.ts
      orders: {
        Row: {
          id: string;
          order_no: string;
          user_id: string;
          user_email: string;
          amount: number;
          interval_type?: string;
          expired_at?: string;
          status: string;
          stripe_session_id?: string;
          credits: number;
          currency?: string;
          sub_id?: string;
          sub_interval_count?: number;
          sub_cycle_anchor?: number;
          sub_period_end?: number;
          sub_period_start?: number;
          sub_times?: number;
          product_id?: string;
          product_name?: string;
          valid_months?: number;
          order_detail?: string;
          paid_at?: string;
          paid_email?: string;
          paid_detail?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_no: string;
          user_id: string;
          user_email: string;
          amount: number;
          interval_type?: string;
          expired_at?: string;
          status: string;
          stripe_session_id?: string;
          credits: number;
          currency?: string;
          sub_id?: string;
          sub_interval_count?: number;
          sub_cycle_anchor?: number;
          sub_period_end?: number;
          sub_period_start?: number;
          sub_times?: number;
          product_id?: string;
          product_name?: string;
          valid_months?: number;
          order_detail?: string;
          paid_at?: string;
          paid_email?: string;
          paid_detail?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_no?: string;
          user_id?: string;
          user_email?: string;
          amount?: number;
          interval_type?: string;
          expired_at?: string;
          status?: string;
          stripe_session_id?: string;
          credits?: number;
          currency?: string;
          sub_id?: string;
          sub_interval_count?: number;
          sub_cycle_anchor?: number;
          sub_period_end?: number;
          sub_period_start?: number;
          sub_times?: number;
          product_id?: string;
          product_name?: string;
          valid_months?: number;
          order_detail?: string;
          paid_at?: string;
          paid_email?: string;
          paid_detail?: string;
          created_at?: string;
        };
      };

      credits: {
        Row: {
          id: string;
          trans_no: string;
          user_id: string;
          trans_type: string;
          credits: number;
          order_no?: string;
          expired_at?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          trans_no: string;
          user_id: string;
          trans_type: string;
          credits: number;
          order_no?: string;
          expired_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          trans_no?: string;
          user_id?: string;
          trans_type?: string;
          credits?: number;
          order_no?: string;
          expired_at?: string;
          created_at?: string;
        };
      };

      posts: {
        Row: {
          id: string;
          uuid: string;
          slug?: string;
          title?: string;
          description?: string;
          content?: string;
          status?: string;
          cover_url?: string;
          author_name?: string;
          author_avatar_url?: string;
          locale?: string;
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          uuid: string;
          slug?: string;
          title?: string;
          description?: string;
          content?: string;
          status?: string;
          cover_url?: string;
          author_name?: string;
          author_avatar_url?: string;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          uuid?: string;
          slug?: string;
          title?: string;
          description?: string;
          content?: string;
          status?: string;
          cover_url?: string;
          author_name?: string;
          author_avatar_url?: string;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      affiliates: {
        Row: {
          id: string;
          user_id: string;
          invited_by: string;
          paid_order_no: string;
          paid_amount: number;
          reward_percent: number;
          reward_amount: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          invited_by: string;
          paid_order_no?: string;
          paid_amount?: number;
          reward_percent?: number;
          reward_amount?: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          invited_by?: string;
          paid_order_no?: string;
          paid_amount?: number;
          reward_percent?: number;
          reward_amount?: number;
          status?: string;
          created_at?: string;
        };
      };

      feedbacks: {
        Row: {
          id: string;
          uuid: string;
          user_id: string;
          content?: string;
          status?: string;
          reply?: string;
          replied_at?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          uuid: string;
          user_id: string;
          content?: string;
          status?: string;
          reply?: string;
          replied_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          uuid?: string;
          user_id?: string;
          content?: string;
          status?: string;
          reply?: string;
          replied_at?: string;
          created_at?: string;
        };
      };

      api_keys_legacy: {
        Row: {
          id: string;
          api_key: string;
          title?: string;
          user_id: string;
          status?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          api_key: string;
          title?: string;
          user_id: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          api_key?: string;
          title?: string;
          user_id?: string;
          status?: string;
          created_at?: string;
        };
      };

      growth_platforms: {
        Row: {
          id: string;
          name: string;
          domain: string;
          category: string;
          description?: string;
          submission_url?: string;
          pricing?: string;
          da_score?: number;
          monthly_traffic?: number;
          difficulty_level?: number;
          contact_email?: string;
          notes?: string;
          is_active: boolean;
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          name: string;
          domain: string;
          category: string;
          description?: string;
          submission_url?: string;
          pricing?: string;
          da_score?: number;
          monthly_traffic?: number;
          difficulty_level?: number;
          contact_email?: string;
          notes?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          domain?: string;
          category?: string;
          description?: string;
          submission_url?: string;
          pricing?: string;
          da_score?: number;
          monthly_traffic?: number;
          difficulty_level?: number;
          contact_email?: string;
          notes?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      growth_submissions: {
        Row: {
          id: string;
          platform_id: string;
          title: string;
          description?: string;
          submission_url?: string;
          status: string;
          submitted_by?: string;
          submitted_at?: string;
          approved_at?: string;
          live_url?: string;
          is_featured: boolean;
          notes?: string;
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          platform_id: string;
          title: string;
          description?: string;
          submission_url?: string;
          status?: string;
          submitted_by?: string;
          submitted_at?: string;
          approved_at?: string;
          live_url?: string;
          is_featured?: boolean;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          platform_id?: string;
          title?: string;
          description?: string;
          submission_url?: string;
          status?: string;
          submitted_by?: string;
          submitted_at?: string;
          approved_at?: string;
          live_url?: string;
          is_featured?: boolean;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      growth_indexing_checks: {
        Row: {
          id: string;
          platform_id: string;
          submission_id?: string;
          search_query: string;
          is_indexed: boolean;
          search_results_count: number;
          first_result_url?: string;
          check_date: string;
          notes?: string;
        };
        Insert: {
          id?: string;
          platform_id: string;
          submission_id?: string;
          search_query: string;
          is_indexed?: boolean;
          search_results_count?: number;
          first_result_url?: string;
          check_date?: string;
          notes?: string;
        };
        Update: {
          id?: string;
          platform_id?: string;
          submission_id?: string;
          search_query?: string;
          is_indexed?: boolean;
          search_results_count?: number;
          first_result_url?: string;
          check_date?: string;
          notes?: string;
        };
      };

      growth_metrics: {
        Row: {
          id: string;
          platform_id: string;
          da_score?: number;
          monthly_traffic?: number;
          traffic_source?: string;
          check_date: string;
          notes?: string;
        };
        Insert: {
          id?: string;
          platform_id: string;
          da_score?: number;
          monthly_traffic?: number;
          traffic_source?: string;
          check_date?: string;
          notes?: string;
        };
        Update: {
          id?: string;
          platform_id?: string;
          da_score?: number;
          monthly_traffic?: number;
          traffic_source?: string;
          check_date?: string;
          notes?: string;
        };
      };

      game_plugin_settings: {
        Row: {
          id: string;
          plugin_id: string;
          is_active: boolean;
          homepage_type: string;
          download_url?: string;
          iframe_url?: string;
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          plugin_id: string;
          is_active?: boolean;
          homepage_type: string;
          download_url?: string;
          iframe_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          plugin_id?: string;
          is_active?: boolean;
          homepage_type?: string;
          download_url?: string;
          iframe_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      get_site_config: {
        Args: { config_key: string };
        Returns: any; // JSONB
      };
      set_site_config: {
        Args: { 
          config_key: string; 
          config_value: any; 
          config_description?: string 
        };
        Returns: void;
      };
      log_system_event: {
        Args: {
          log_level: 'info' | 'warn' | 'error' | 'debug';
          log_message: string;
          log_context?: any;
          log_source?: string;
          log_user_id?: string;
        };
        Returns: void;
      };
    };
  };
}

// Legacy types for backward compatibility
export type SiteType = 'site-tool' | 'site-game' | 'site-blog';

export interface BacklinkItem {
  id: string;
  name: string;
  url?: string;
  type: 'free' | 'paid';
  category?: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  traffic?: string;
  as?: string; // Maps to as_value in database
  price?: string;
  completed: boolean;
  completedAt: string | null; // Maps to completed_at in database
  notes: string;
}

export interface BacklinkDataResponse {
  free: BacklinkItem[];
  paid: BacklinkItem[];
}

export interface SEOProgressTask {
  [key: string]: boolean;
}

export interface SEOProgressCategory {
  [category: string]: SEOProgressTask;
}

export interface SEOProgressData {
  [month: string]: SEOProgressCategory;
}