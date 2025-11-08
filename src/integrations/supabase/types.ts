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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      compliance_frameworks: {
        Row: {
          control_description: string | null
          control_id: string
          created_at: string | null
          framework_category: string
          framework_id: string
          framework_name: string
          keywords: string[] | null
        }
        Insert: {
          control_description?: string | null
          control_id: string
          created_at?: string | null
          framework_category: string
          framework_id?: string
          framework_name: string
          keywords?: string[] | null
        }
        Update: {
          control_description?: string | null
          control_id?: string
          created_at?: string | null
          framework_category?: string
          framework_id?: string
          framework_name?: string
          keywords?: string[] | null
        }
        Relationships: []
      }
      policies: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          author: string
          category: Database["public"]["Enums"]["policy_category"]
          content: string
          created_at: string | null
          created_by: string | null
          department: string | null
          description: string | null
          file_url: string | null
          id: string
          owner: string | null
          owner_id: string | null
          reviewer: string | null
          reviewer_id: string | null
          status: Database["public"]["Enums"]["policy_status"]
          tags: string[] | null
          title: string
          type: string
          updated_at: string | null
          updated_by: string | null
          version: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          author: string
          category: Database["public"]["Enums"]["policy_category"]
          content: string
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          owner?: string | null
          owner_id?: string | null
          reviewer?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["policy_status"]
          tags?: string[] | null
          title: string
          type?: string
          updated_at?: string | null
          updated_by?: string | null
          version?: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          author?: string
          category?: Database["public"]["Enums"]["policy_category"]
          content?: string
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          owner?: string | null
          owner_id?: string | null
          reviewer?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["policy_status"]
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string | null
          updated_by?: string | null
          version?: number
        }
        Relationships: []
      }
      policy_access_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          policy_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          policy_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          policy_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "policy_access_logs_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_sections: {
        Row: {
          compliance_tags: Json | null
          created_at: string | null
          embedding: string | null
          policy_id: string
          search_vector: unknown
          section_content: string
          section_id: string
          section_number: number
          section_title: string
          updated_at: string | null
        }
        Insert: {
          compliance_tags?: Json | null
          created_at?: string | null
          embedding?: string | null
          policy_id: string
          search_vector?: unknown
          section_content: string
          section_id?: string
          section_number: number
          section_title: string
          updated_at?: string | null
        }
        Update: {
          compliance_tags?: Json | null
          created_at?: string | null
          embedding?: string | null
          policy_id?: string
          search_vector?: unknown
          section_content?: string
          section_id?: string
          section_number?: number
          section_title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "policy_sections_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_tags: {
        Row: {
          policy_id: string
          tag_id: string
        }
        Insert: {
          policy_id: string
          tag_id: string
        }
        Update: {
          policy_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_policy_tags_policy_id"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_policy_tags_tag_id"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["tag_id"]
          },
        ]
      }
      policy_texts: {
        Row: {
          content: string
          policy_id: string
          text_id: string
        }
        Insert: {
          content: string
          policy_id: string
          text_id?: string
        }
        Update: {
          content?: string
          policy_id?: string
          text_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_policy_texts_policy_id"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_versions: {
        Row: {
          category: Database["public"]["Enums"]["policy_category"]
          change_summary: string | null
          content: string
          created_at: string | null
          created_by: string | null
          description: string | null
          file_url: string | null
          id: string
          policy_id: string
          status: Database["public"]["Enums"]["policy_status"]
          tags: string[] | null
          title: string
          version: number
        }
        Insert: {
          category: Database["public"]["Enums"]["policy_category"]
          change_summary?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          policy_id: string
          status: Database["public"]["Enums"]["policy_status"]
          tags?: string[] | null
          title: string
          version: number
        }
        Update: {
          category?: Database["public"]["Enums"]["policy_category"]
          change_summary?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          policy_id?: string
          status?: Database["public"]["Enums"]["policy_status"]
          tags?: string[] | null
          title?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "policy_versions_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      search_logs: {
        Row: {
          created_at: string | null
          log_id: string
          results_count: number | null
          search_filters: Json | null
          search_query: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          log_id?: string
          results_count?: number | null
          search_filters?: Json | null
          search_query?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          log_id?: string
          results_count?: number | null
          search_filters?: Json | null
          search_query?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          tag_id: string
          tag_name: string
        }
        Insert: {
          tag_id?: string
          tag_name: string
        }
        Update: {
          tag_id?: string
          tag_name?: string
        }
        Relationships: []
      }
      versions: {
        Row: {
          created_at: string | null
          description: string | null
          edited_by: string
          policy_id: string
          version_id: string
          version_label: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          edited_by: string
          policy_id: string
          version_id?: string
          version_label: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          edited_by?: string
          policy_id?: string
          version_id?: string
          version_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_versions_policy_id"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      log_policy_access: {
        Args: {
          action_param: string
          ip_address_param?: unknown
          policy_id_param: string
          user_agent_param?: string
        }
        Returns: undefined
      }
      log_search: {
        Args: {
          results_count_param?: number
          search_filters_param?: Json
          search_query_param: string
        }
        Returns: undefined
      }
      search_policies: {
        Args: {
          filter_category?: Database["public"]["Enums"]["policy_category"]
          filter_status?: Database["public"]["Enums"]["policy_status"]
          filter_tags?: string[]
          search_query?: string
        }
        Returns: {
          category: Database["public"]["Enums"]["policy_category"]
          content: string
          created_at: string
          created_by: string
          description: string
          file_url: string
          id: string
          rank: number
          status: Database["public"]["Enums"]["policy_status"]
          tags: string[]
          title: string
          updated_at: string
          updated_by: string
          version: number
        }[]
      }
      search_policies_enhanced: {
        Args: {
          filter_status?: string
          filter_tags?: string[]
          filter_type?: string
          search_query?: string
        }
        Returns: {
          author: string
          content: string
          created_at: string
          description: string
          policy_id: string
          rank: number
          status: string
          tags: string[]
          title: string
          type: string
          updated_at: string
        }[]
      }
      search_policy_sections_keyword: {
        Args: { match_count?: number; search_query: string }
        Returns: {
          policy_id: string
          rank: number
          section_content: string
          section_id: string
          section_title: string
        }[]
      }
      search_policy_sections_semantic: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          policy_id: string
          section_content: string
          section_id: string
          section_title: string
          similarity: number
        }[]
      }
    }
    Enums: {
      policy_category:
        | "Technical Control"
        | "Physical Control"
        | "Organizational Control"
        | "Administrative Control"
      policy_status: "draft" | "active" | "archived" | "under_review"
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
      policy_category: [
        "Technical Control",
        "Physical Control",
        "Organizational Control",
        "Administrative Control",
      ],
      policy_status: ["draft", "active", "archived", "under_review"],
    },
  },
} as const
