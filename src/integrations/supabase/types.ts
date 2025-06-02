export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      policies: {
        Row: {
          author: string
          category: Database["public"]["Enums"]["policy_category"]
          content: string
          created_at: string | null
          created_by: string | null
          description: string | null
          file_url: string | null
          id: string
          status: Database["public"]["Enums"]["policy_status"]
          tags: string[] | null
          title: string
          type: string
          updated_at: string | null
          updated_by: string | null
          version: number
        }
        Insert: {
          author: string
          category: Database["public"]["Enums"]["policy_category"]
          content: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          status?: Database["public"]["Enums"]["policy_status"]
          tags?: string[] | null
          title: string
          type?: string
          updated_at?: string | null
          updated_by?: string | null
          version?: number
        }
        Update: {
          author?: string
          category?: Database["public"]["Enums"]["policy_category"]
          content?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
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
          ip_address: unknown | null
          policy_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          policy_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
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
          policy_id_param: string
          action_param: string
          ip_address_param?: unknown
          user_agent_param?: string
        }
        Returns: undefined
      }
      log_search: {
        Args: {
          search_query_param: string
          search_filters_param?: Json
          results_count_param?: number
        }
        Returns: undefined
      }
      search_policies: {
        Args: {
          search_query?: string
          filter_tags?: string[]
          filter_category?: Database["public"]["Enums"]["policy_category"]
          filter_status?: Database["public"]["Enums"]["policy_status"]
        }
        Returns: {
          id: string
          title: string
          description: string
          content: string
          tags: string[]
          category: Database["public"]["Enums"]["policy_category"]
          version: number
          status: Database["public"]["Enums"]["policy_status"]
          file_url: string
          created_by: string
          updated_by: string
          created_at: string
          updated_at: string
          rank: number
        }[]
      }
      search_policies_enhanced: {
        Args: {
          search_query?: string
          filter_tags?: string[]
          filter_type?: string
          filter_status?: string
        }
        Returns: {
          policy_id: string
          title: string
          description: string
          type: string
          status: string
          author: string
          created_at: string
          updated_at: string
          content: string
          tags: string[]
          rank: number
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
