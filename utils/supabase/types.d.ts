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
      course: {
        Row: {
          created_at: string;
          description: string;
          length: number;
          name: string;
          technologies: string[];
        };
        Insert: {
          created_at?: string;
          description?: string;
          length: number;
          name: string;
          technologies: string[];
        };
        Update: {
          created_at?: string;
          description?: string;
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
          id: string;
          instructions: string;
          level: Database["public"]["Enums"]["level"];
          task: string;
          user: string | null;
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
          user?: string | null;
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
          user?: string | null;
          week?: number;
        };
        Relationships: [
          {
            foreignKeyName: "progress_course_fkey";
            columns: ["course"];
            isOneToOne: false;
            referencedRelation: "course";
            referencedColumns: ["name"];
          },
          {
            foreignKeyName: "progress_user_fkey";
            columns: ["user"];
            isOneToOne: false;
            referencedRelation: "users";
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
            referencedRelation: "course";
            referencedColumns: ["name"];
          },
        ];
      };
      rel_profiles_course: {
        Row: {
          course_name: string;
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          course_name: string;
          created_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          course_name?: string;
          created_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rel_profiles_course_course_name_fkey";
            columns: ["course_name"];
            isOneToOne: false;
            referencedRelation: "course";
            referencedColumns: ["name"];
          },
          {
            foreignKeyName: "rel_profiles_course_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
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
export enum Level {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

// Tables
export type Course = Database["public"]["Tables"]["course"]["Row"];
export type InsertCourse = Database["public"]["Tables"]["course"]["Insert"];
export type UpdateCourse = Database["public"]["Tables"]["course"]["Update"];

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
  Database["public"]["Tables"]["rel_profiles_course"]["Row"];
export type InsertRelProfileCourse =
  Database["public"]["Tables"]["rel_profiles_course"]["Insert"];
export type UpdateRelProfileCourse =
  Database["public"]["Tables"]["rel_profiles_course"]["Update"];
