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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      checklist_evidence: {
        Row: {
          created_at: string
          id: string
          image_url: string
          lat: number | null
          lng: number | null
          submission_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          lat?: number | null
          lng?: number | null
          submission_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          lat?: number | null
          lng?: number | null
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_evidence_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "checklist_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          id: string
          label: string
          required: boolean
          template_id: string
        }
        Insert: {
          id?: string
          label: string
          required?: boolean
          template_id: string
        }
        Update: {
          id?: string
          label?: string
          required?: boolean
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_submissions: {
        Row: {
          created_at: string
          id: string
          section_id: string
          status: string
          submitted_by: string
          template_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          section_id: string
          status?: string
          submitted_by: string
          template_id: string
        }
        Update: {
          created_at?: string
          id?: string
          section_id?: string
          status?: string
          submitted_by?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_submissions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_submissions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_templates: {
        Row: {
          created_at: string
          id: string
          name: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      incidents: {
        Row: {
          created_at: string
          description: string
          id: string
          section_id: string
          severity: string
          status: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          section_id: string
          severity: string
          status?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          section_id?: string
          severity?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "incidents_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      infra_score_snapshots: {
        Row: {
          created_at: string
          id: string
          project_id: string
          score: number
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          score: number
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "infra_score_snapshots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          region: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          region: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          region?: string
        }
        Relationships: []
      }
      phases: {
        Row: {
          created_at: string
          id: string
          name: string
          project_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          project_id: string
          status: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          project_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          id: string
          name: string
          organization_id: string
          state: string
          status: string
          total_units: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization_id: string
          state: string
          status?: string
          total_units?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          state?: string
          status?: string
          total_units?: number
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          created_at: string
          id: string
          name: string
          phase_id: string
          status: string
          units: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phase_id: string
          status?: string
          units?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phase_id?: string
          status?: string
          units?: number
        }
        Relationships: [
          {
            foreignKeyName: "sections_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          organization_id: string | null
          role: string
          user_id: string
        }
        Insert: {
          organization_id?: string | null
          role: string
          user_id: string
        }
        Update: {
          organization_id?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
