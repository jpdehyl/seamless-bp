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
      attendance: {
        Row: {
          attendance_id: number
          crew_id: number | null
          date: string
          hours_worked: number
          month: string | null
        }
        Insert: {
          attendance_id?: never
          crew_id?: number | null
          date: string
          hours_worked: number
          month?: string | null
        }
        Update: {
          attendance_id?: never
          crew_id?: number | null
          date?: string
          hours_worked?: number
          month?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "crew"
            referencedColumns: ["crew_id"]
          },
        ]
      }
      crew: {
        Row: {
          crew_id: number
          name: string
          pay_rate: number
        }
        Insert: {
          crew_id?: never
          name: string
          pay_rate: number
        }
        Update: {
          crew_id?: never
          name?: string
          pay_rate?: number
        }
        Relationships: []
      }
      invoices: {
        Row: {
          basic_scope_of_work: string | null
          client_code: string | null
          client_company: Database["public"]["Enums"]["client_company"] | null
          client_id: string | null
          client_project_manager: string | null
          costs: number | null
          created_at: string
          date_issued: string | null
          dehyl_foreman: Database["public"]["Enums"]["dehyl_foreman"] | null
          due_date: string | null
          end_date: string | null
          id: string
          invoice_amount: number
          invoice_number: string
          invoice_status: Database["public"]["Enums"]["invoice_status"] | null
          margin: number | null
          name: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          payment_terms: Database["public"]["Enums"]["payment_terms"] | null
          pm_id: string | null
          po_number: string | null
          project_number: string | null
          project_type: string | null
          site_address: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          basic_scope_of_work?: string | null
          client_code?: string | null
          client_company?: Database["public"]["Enums"]["client_company"] | null
          client_id?: string | null
          client_project_manager?: string | null
          costs?: number | null
          created_at?: string
          date_issued?: string | null
          dehyl_foreman?: Database["public"]["Enums"]["dehyl_foreman"] | null
          due_date?: string | null
          end_date?: string | null
          id?: string
          invoice_amount: number
          invoice_number: string
          invoice_status?: Database["public"]["Enums"]["invoice_status"] | null
          margin?: number | null
          name?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          payment_terms?: Database["public"]["Enums"]["payment_terms"] | null
          pm_id?: string | null
          po_number?: string | null
          project_number?: string | null
          project_type?: string | null
          site_address?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          basic_scope_of_work?: string | null
          client_code?: string | null
          client_company?: Database["public"]["Enums"]["client_company"] | null
          client_id?: string | null
          client_project_manager?: string | null
          costs?: number | null
          created_at?: string
          date_issued?: string | null
          dehyl_foreman?: Database["public"]["Enums"]["dehyl_foreman"] | null
          due_date?: string | null
          end_date?: string | null
          id?: string
          invoice_amount?: number
          invoice_number?: string
          invoice_status?: Database["public"]["Enums"]["invoice_status"] | null
          margin?: number | null
          name?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          payment_terms?: Database["public"]["Enums"]["payment_terms"] | null
          pm_id?: string | null
          po_number?: string | null
          project_number?: string | null
          project_type?: string | null
          site_address?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_project_number_fkey"
            columns: ["project_number"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_number"]
          },
        ]
      }
      pay_period: {
        Row: {
          balance_owed: number | null
          crew_id: number | null
          month: string | null
          pay_period_id: number
          quincena_1: number | null
          quincena_2: number | null
          total_pay: number | null
        }
        Insert: {
          balance_owed?: number | null
          crew_id?: number | null
          month?: string | null
          pay_period_id?: never
          quincena_1?: number | null
          quincena_2?: number | null
          total_pay?: number | null
        }
        Update: {
          balance_owed?: number | null
          crew_id?: number | null
          month?: string | null
          pay_period_id?: never
          quincena_1?: number | null
          quincena_2?: number | null
          total_pay?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pay_period_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "crew"
            referencedColumns: ["crew_id"]
          },
        ]
      }
      payment: {
        Row: {
          crew_id: number | null
          page_number: number
          payment_date: string | null
          payment_id: number
        }
        Insert: {
          crew_id?: number | null
          page_number: number
          payment_date?: string | null
          payment_id?: never
        }
        Update: {
          crew_id?: number | null
          page_number?: number
          payment_date?: string | null
          payment_id?: never
        }
        Relationships: [
          {
            foreignKeyName: "payment_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "crew"
            referencedColumns: ["crew_id"]
          },
        ]
      }
      permits: {
        Row: {
          deadline: string | null
          id: string
          notes: string | null
          project_id: string
          status: Database["public"]["Enums"]["permit_status_enum"]
        }
        Insert: {
          deadline?: string | null
          id?: string
          notes?: string | null
          project_id: string
          status: Database["public"]["Enums"]["permit_status_enum"]
        }
        Update: {
          deadline?: string | null
          id?: string
          notes?: string | null
          project_id?: string
          status?: Database["public"]["Enums"]["permit_status_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_permit_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permits_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          id: string
          image_url: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          id?: string
          image_url?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          image_url?: string | null
        }
        Relationships: []
      }
      project_updates: {
        Row: {
          id: string
          note: string | null
          project_id: string
          timestamp: string
          update_type: Database["public"]["Enums"]["project_update_type"]
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          note?: string | null
          project_id: string
          timestamp?: string
          update_type: Database["public"]["Enums"]["project_update_type"]
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          note?: string | null
          project_id?: string
          timestamp?: string
          update_type?: Database["public"]["Enums"]["project_update_type"]
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          access_details: string | null
          basic_scope_of_work: string | null
          client_code: Database["public"]["Enums"]["client_code_type"] | null
          client_company: Database["public"]["Enums"]["client_company"] | null
          client_id: string
          client_project_manager:
            | Database["public"]["Enums"]["client_project_manager"]
            | null
          costs: number | null
          created_at: string
          dehyl_foreman: Database["public"]["Enums"]["dehyl_foreman"] | null
          end_date: string | null
          id: string
          margin: number | null
          name: string
          pm_id: string
          po_number: string | null
          project_number: string
          project_type: Database["public"]["Enums"]["project_type_enum"] | null
          revenue: number | null
          site_address: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          access_details?: string | null
          basic_scope_of_work?: string | null
          client_code?: Database["public"]["Enums"]["client_code_type"] | null
          client_company?: Database["public"]["Enums"]["client_company"] | null
          client_id: string
          client_project_manager?:
            | Database["public"]["Enums"]["client_project_manager"]
            | null
          costs?: number | null
          created_at?: string
          dehyl_foreman?: Database["public"]["Enums"]["dehyl_foreman"] | null
          end_date?: string | null
          id?: string
          margin?: number | null
          name: string
          pm_id: string
          po_number?: string | null
          project_number: string
          project_type?: Database["public"]["Enums"]["project_type_enum"] | null
          revenue?: number | null
          site_address?: string | null
          start_date?: string | null
          status: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          access_details?: string | null
          basic_scope_of_work?: string | null
          client_code?: Database["public"]["Enums"]["client_code_type"] | null
          client_company?: Database["public"]["Enums"]["client_company"] | null
          client_id?: string
          client_project_manager?:
            | Database["public"]["Enums"]["client_project_manager"]
            | null
          costs?: number | null
          created_at?: string
          dehyl_foreman?: Database["public"]["Enums"]["dehyl_foreman"] | null
          end_date?: string | null
          id?: string
          margin?: number | null
          name?: string
          pm_id?: string
          po_number?: string | null
          project_number?: string
          project_type?: Database["public"]["Enums"]["project_type_enum"] | null
          revenue?: number | null
          site_address?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pm"
            columns: ["pm_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_pm_id_fkey"
            columns: ["pm_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      timecards: {
        Row: {
          balance_owed: number | null
          created_at: string | null
          date: string | null
          hours: number | null
          id: number
          payment_amount: number | null
          payment_date: string | null
          period: string | null
          project: string
          total_pay: number | null
          wage_per_hour: number
          worker_name: string
        }
        Insert: {
          balance_owed?: number | null
          created_at?: string | null
          date?: string | null
          hours?: number | null
          id?: number
          payment_amount?: number | null
          payment_date?: string | null
          period?: string | null
          project: string
          total_pay?: number | null
          wage_per_hour: number
          worker_name: string
        }
        Update: {
          balance_owed?: number | null
          created_at?: string | null
          date?: string | null
          hours?: number | null
          id?: number
          payment_amount?: number | null
          payment_date?: string | null
          period?: string | null
          project?: string
          total_pay?: number | null
          wage_per_hour?: number
          worker_name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          email: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      debug_jwt: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      insert_profile: {
        Args: { p_email: string; p_display_name: string; p_image_url: string }
        Returns: undefined
      }
      is_valid_role: {
        Args: { role: string }
        Returns: boolean
      }
      perform_service_operation: {
        Args: { operation: string }
        Returns: undefined
      }
      requesting_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      set_service_context: {
        Args: { operation: string }
        Returns: undefined
      }
      test_user_access: {
        Args: { user_id: string }
        Returns: {
          user_email: string
          user_role: string
          total_projects: number
          accessible_projects: number
          is_correct: boolean
        }[]
      }
    }
    Enums: {
      client_code_type:
        | "CN2"
        | "CN3"
        | "CN4"
        | "CN6"
        | "CN8"
        | "CN10"
        | "CN11"
        | "CN12"
      client_company:
        | "Snowdon Construction"
        | "Certified Demolition"
        | "Tannen Ventures"
        | "Soma Interiors Ltd"
        | "Horizon Eco Builders"
        | "WD Co-Auto"
        | "Russell & Sons Enterprises Inc"
        | "Collin"
      client_project_manager:
        | "TJ Snowdon"
        | "Trevor Forbes"
        | "Mike Schulz"
        | "Kevin Grey"
        | "James Russell"
        | "Collin"
        | "Simon"
        | "Tyler Zunti"
      dehyl_foreman:
        | "Oscar Samuel Zurita"
        | "Andony de Jesus"
        | "Mario Arauz"
        | "Ivan Diaz Retana"
        | "Paola Navarro"
        | "JP Dominguez"
      invoice_status: "Sent" | "Cancelled" | "Overdue" | "Paid"
      payment_method: "E-transfer" | "Quickbooks" | "Cheque"
      payment_status: "Not paid" | "Paid" | "Cancelled"
      payment_terms: "Upon completion" | "N15" | "N30" | "N45" | "N60"
      permit_status_enum:
        | "required"
        | "applied"
        | "approved"
        | "rejected"
        | "expired"
        | "not applicable"
      project_status:
        | "bidding"
        | "won"
        | "lost"
        | "no-go"
        | "in progress"
        | "completed"
        | "invoiced"
        | "closed"
      project_type_enum:
        | "Labor only"
        | "abatement"
        | "selected demolition"
        | "mold remediation"
        | "drywall"
        | "painting"
        | "carpentry"
        | "cleaning"
      project_update_type:
        | "Status Change"
        | "Note Added"
        | "Permit Updated"
        | "Financial Update"
        | "File Added"
      user_role: "admin" | "pm" | "client"
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
      client_code_type: [
        "CN2",
        "CN3",
        "CN4",
        "CN6",
        "CN8",
        "CN10",
        "CN11",
        "CN12",
      ],
      client_company: [
        "Snowdon Construction",
        "Certified Demolition",
        "Tannen Ventures",
        "Soma Interiors Ltd",
        "Horizon Eco Builders",
        "WD Co-Auto",
        "Russell & Sons Enterprises Inc",
        "Collin",
      ],
      client_project_manager: [
        "TJ Snowdon",
        "Trevor Forbes",
        "Mike Schulz",
        "Kevin Grey",
        "James Russell",
        "Collin",
        "Simon",
        "Tyler Zunti",
      ],
      dehyl_foreman: [
        "Oscar Samuel Zurita",
        "Andony de Jesus",
        "Mario Arauz",
        "Ivan Diaz Retana",
        "Paola Navarro",
        "JP Dominguez",
      ],
      invoice_status: ["Sent", "Cancelled", "Overdue", "Paid"],
      payment_method: ["E-transfer", "Quickbooks", "Cheque"],
      payment_status: ["Not paid", "Paid", "Cancelled"],
      payment_terms: ["Upon completion", "N15", "N30", "N45", "N60"],
      permit_status_enum: [
        "required",
        "applied",
        "approved",
        "rejected",
        "expired",
        "not applicable",
      ],
      project_status: [
        "bidding",
        "won",
        "lost",
        "no-go",
        "in progress",
        "completed",
        "invoiced",
        "closed",
      ],
      project_type_enum: [
        "Labor only",
        "abatement",
        "selected demolition",
        "mold remediation",
        "drywall",
        "painting",
        "carpentry",
        "cleaning",
      ],
      project_update_type: [
        "Status Change",
        "Note Added",
        "Permit Updated",
        "Financial Update",
        "File Added",
      ],
      user_role: ["admin", "pm", "client"],
    },
  },
} as const
