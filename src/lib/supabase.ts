import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'donor' | 'volunteer' | 'admin';
          care_points: number;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: 'donor' | 'volunteer' | 'admin';
          care_points?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'donor' | 'volunteer' | 'admin';
          care_points?: number;
          created_at?: string;
        };
      };
      donations: {
        Row: {
          id: string;
          donor_id: string;
          item_name: string;
          category: string;
          quantity: number;
          condition: string;
          description: string;
          pickup_option: boolean;
          image_url?: string;
          status: 'requested' | 'verified' | 'picked' | 'delivered';
          created_at: string;
        };
        Insert: {
          id?: string;
          donor_id: string;
          item_name: string;
          category: string;
          quantity: number;
          condition: string;
          description: string;
          pickup_option: boolean;
          image_url?: string;
          status?: 'requested' | 'verified' | 'picked' | 'delivered';
          created_at?: string;
        };
        Update: {
          id?: string;
          donor_id?: string;
          item_name?: string;
          category?: string;
          quantity?: number;
          condition?: string;
          description?: string;
          pickup_option?: boolean;
          image_url?: string;
          status?: 'requested' | 'verified' | 'picked' | 'delivered';
          created_at?: string;
        };
      };
    };
  };
};