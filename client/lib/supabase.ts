import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create either a real or mock Supabase client
let supabaseClient: any;

if (supabaseUrl && supabaseAnonKey) {
  // Real Supabase client
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
} else {
  // Mock client for development
  console.warn(
    "Supabase credentials not configured. Using mock client for development.",
  );
  supabaseClient = {
    auth: {
      getSession: () =>
        Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      signUp: () =>
        Promise.resolve({
          data: { user: null },
          error: new Error("Supabase not configured"),
        }),
      signInWithPassword: () =>
        Promise.resolve({
          data: { user: null },
          error: new Error("Supabase not configured"),
        }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({
              data: null,
              error: new Error("Supabase not configured"),
            }),
        }),
      }),
      insert: () =>
        Promise.resolve({
          error: new Error("Supabase not configured"),
        }),
      update: () => ({
        eq: () =>
          Promise.resolve({
            error: new Error("Supabase not configured"),
          }),
      }),
    }),
  };
}

export const supabase = supabaseClient;

// Database types for TypeScript
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          is_verified: boolean;
          trust_score: number;
          location: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          emergency_contact_relationship: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          is_verified?: boolean;
          trust_score?: number;
          location?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          emergency_contact_relationship?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          is_verified?: boolean;
          trust_score?: number;
          location?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          emergency_contact_relationship?: string | null;
          updated_at?: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          title: string;
          description: string;
          type:
            | "safety"
            | "traffic"
            | "weather"
            | "community"
            | "crime"
            | "emergency";
          latitude: number;
          longitude: number;
          address: string;
          user_id: string;
          votes: number;
          is_verified: boolean;
          status: "active" | "resolved" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          type:
            | "safety"
            | "traffic"
            | "weather"
            | "community"
            | "crime"
            | "emergency";
          latitude: number;
          longitude: number;
          address: string;
          user_id: string;
          votes?: number;
          is_verified?: boolean;
          status?: "active" | "resolved" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          type?:
            | "safety"
            | "traffic"
            | "weather"
            | "community"
            | "crime"
            | "emergency";
          latitude?: number;
          longitude?: number;
          address?: string;
          user_id?: string;
          votes?: number;
          is_verified?: boolean;
          status?: "active" | "resolved" | "archived";
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          alert_id: string;
          user_id: string;
          content: string;
          votes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          alert_id: string;
          user_id: string;
          content: string;
          votes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          alert_id?: string;
          user_id?: string;
          content?: string;
          votes?: number;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: "alert" | "comment" | "verification" | "emergency";
          is_read: boolean;
          related_alert_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type: "alert" | "comment" | "verification" | "emergency";
          is_read?: boolean;
          related_alert_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: "alert" | "comment" | "verification" | "emergency";
          is_read?: boolean;
          related_alert_id?: string | null;
        };
      };
      alert_votes: {
        Row: {
          id: string;
          alert_id: string;
          user_id: string;
          vote_type: "up" | "down";
          created_at: string;
        };
        Insert: {
          id?: string;
          alert_id: string;
          user_id: string;
          vote_type: "up" | "down";
          created_at?: string;
        };
        Update: {
          id?: string;
          alert_id?: string;
          user_id?: string;
          vote_type?: "up" | "down";
        };
      };
      comment_votes: {
        Row: {
          id: string;
          comment_id: string;
          user_id: string;
          vote_type: "up" | "down";
          created_at: string;
        };
        Insert: {
          id?: string;
          comment_id: string;
          user_id: string;
          vote_type: "up" | "down";
          created_at?: string;
        };
        Update: {
          id?: string;
          comment_id?: string;
          user_id?: string;
          vote_type?: "up" | "down";
        };
      };
    };
  };
};
