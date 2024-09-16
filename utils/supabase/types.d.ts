export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      courses: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          length: number;
          name: string;
          technologies: string[];
        };
        Insert: {
          created_at?: string;
          description?: string;
          id: string;
          length: number;
          name?: string;
          technologies: string[];
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          length?: number;
          name?: string;
          technologies?: string[];
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          full_name: string | null;
          id: string;
          updated_at: string | null;
          username: string | null;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      progress: {
        Row: {
          completed: boolean;
          concept: string;
          confidence: number;
          course: string | null;
          created_at: string;
          day: number;
          draft_id: string | null;
          id: string;
          instructions: string;
          level: Database["public"]["Enums"]["level"];
          task: string;
          user_id: string | null;
          week: number;
        };
        Insert: {
          completed?: boolean;
          concept?: string;
          confidence?: number;
          course?: string | null;
          created_at?: string;
          day?: number;
          draft_id?: string | null;
          id?: string;
          instructions?: string;
          level?: Database["public"]["Enums"]["level"];
          task?: string;
          user_id?: string | null;
          week?: number;
        };
        Update: {
          completed?: boolean;
          concept?: string;
          confidence?: number;
          course?: string | null;
          created_at?: string;
          day?: number;
          draft_id?: string | null;
          id?: string;
          instructions?: string;
          level?: Database["public"]["Enums"]["level"];
          task?: string;
          user_id?: string | null;
          week?: number;
        };
        Relationships: [
          {
            foreignKeyName: "progress_course_fkey";
            columns: ["course"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "progress_draft_id_fkey";
            columns: ["draft_id"];
            isOneToOne: false;
            referencedRelation: "progress_draft";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      progress_draft: {
        Row: {
          completed: boolean;
          concept: string;
          confidence: number;
          course: string | null;
          created_at: string;
          day: number;
          id: string;
          instructions: string;
          level: Database["public"]["Enums"]["level"];
          task: string;
          week: number;
        };
        Insert: {
          completed?: boolean;
          concept?: string;
          confidence?: number;
          course?: string | null;
          created_at?: string;
          day?: number;
          id?: string;
          instructions?: string;
          level?: Database["public"]["Enums"]["level"];
          task?: string;
          week?: number;
        };
        Update: {
          completed?: boolean;
          concept?: string;
          confidence?: number;
          course?: string | null;
          created_at?: string;
          day?: number;
          id?: string;
          instructions?: string;
          level?: Database["public"]["Enums"]["level"];
          task?: string;
          week?: number;
        };
        Relationships: [
          {
            foreignKeyName: "progress_draft_course_fkey";
            columns: ["course"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      rel_profiles_courses: {
        Row: {
          course_id: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          user_id: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rel_profiles_courses_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rel_profiles_courses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      role_permissions: {
        Row: {
          id: number;
          permission: Database["public"]["Enums"]["app_permission"];
          role: Database["public"]["Enums"]["app_role"];
        };
        Insert: {
          id?: number;
          permission: Database["public"]["Enums"]["app_permission"];
          role: Database["public"]["Enums"]["app_role"];
        };
        Update: {
          id?: number;
          permission?: Database["public"]["Enums"]["app_permission"];
          role?: Database["public"]["Enums"]["app_role"];
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: number;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: number;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: number;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"];
        };
        Returns: boolean;
      };
      custom_access_token_hook: {
        Args: {
          event: Json;
        };
        Returns: Json;
      };
      handle_enroll_course: {
        Args: {
          course_name: string;
          val_for_user_id: string;
        };
        Returns: string;
      };
    };
    Enums: {
      app_permission:
        | "progress.select"
        | "progress_draft.update"
        | "progress.update"
        | "rel_profile_courses.select";
      app_role: "admin";
      level: "Beginner" | "Intermediate" | "Advanced";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

// Schema: public
// Enums
export enum AppPermission {
  progressSelect = "progress.select",
  progress_draftUpdate = "progress_draft.update",
  progressUpdate = "progress.update",
  rel_profile_coursesSelect = "rel_profile_courses.select",
}

export enum AppRole {
  admin = "admin",
}

export enum Level {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

// Tables
export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type InsertCourse = Database["public"]["Tables"]["courses"]["Insert"];
export type UpdateCourse = Database["public"]["Tables"]["courses"]["Update"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type InsertProfile = Database["public"]["Tables"]["profiles"]["Insert"];
export type UpdateProfile = Database["public"]["Tables"]["profiles"]["Update"];

export type Progress = Database["public"]["Tables"]["progress"]["Row"];
export type InsertProgress = Database["public"]["Tables"]["progress"]["Insert"];
export type UpdateProgress = Database["public"]["Tables"]["progress"]["Update"];

export type ProgressDraft =
  Database["public"]["Tables"]["progress_draft"]["Row"];
export type InsertProgressDraft =
  Database["public"]["Tables"]["progress_draft"]["Insert"];
export type UpdateProgressDraft =
  Database["public"]["Tables"]["progress_draft"]["Update"];

export type RelProfileCourse =
  Database["public"]["Tables"]["rel_profiles_courses"]["Row"];
export type InsertRelProfileCourse =
  Database["public"]["Tables"]["rel_profiles_courses"]["Insert"];
export type UpdateRelProfileCourse =
  Database["public"]["Tables"]["rel_profiles_courses"]["Update"];

export type RolePermission =
  Database["public"]["Tables"]["role_permissions"]["Row"];
export type InsertRolePermission =
  Database["public"]["Tables"]["role_permissions"]["Insert"];
export type UpdateRolePermission =
  Database["public"]["Tables"]["role_permissions"]["Update"];

export type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];
export type InsertUserRole =
  Database["public"]["Tables"]["user_roles"]["Insert"];
export type UpdateUserRole =
  Database["public"]["Tables"]["user_roles"]["Update"];

// Functions
export type ArgsAuthorize =
  Database["public"]["Functions"]["authorize"]["Args"];
export type ReturnTypeAuthorize =
  Database["public"]["Functions"]["authorize"]["Returns"];

export type ArgsCustomAccessTokenHook =
  Database["public"]["Functions"]["custom_access_token_hook"]["Args"];
export type ReturnTypeCustomAccessTokenHook =
  Database["public"]["Functions"]["custom_access_token_hook"]["Returns"];

export type ArgsHandleEnrollCourse =
  Database["public"]["Functions"]["handle_enroll_course"]["Args"];
export type ReturnTypeHandleEnrollCourse =
  Database["public"]["Functions"]["handle_enroll_course"]["Returns"];
