export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          age: number;
          bio: string;
          city: string;
          region: string;
          pronouns: string | null;
          languages: string[];
          interests: string[];
          relationship_intent: string;
          values: string[];
          lifestyle: string[];
          communication_style: string;
          photo_url: string;
          gallery: string[];
          profile_completion: number;
          is_verified: boolean;
          onboarded: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
      conversations: {
        Row: {
          id: string;
          connection_id: string;
          user1_id: string;
          user2_id: string;
          last_message: string | null;
          last_message_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['conversations']['Row']> & {
          user1_id: string;
          user2_id: string;
        };
        Update: Partial<Database['public']['Tables']['conversations']['Row']>;
      };
      conversation_reads: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          last_read_at: string;
        };
        Insert: Partial<Database['public']['Tables']['conversation_reads']['Row']>;
        Update: Partial<Database['public']['Tables']['conversation_reads']['Row']>;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          text: string;
          status: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['messages']['Row']> & {
          conversation_id: string;
          text: string;
        };
        Update: Partial<Database['public']['Tables']['messages']['Row']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          read: boolean;
          action_user_id: string | null;
          action_user_photo: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['notifications']['Row']>;
        Update: Partial<Database['public']['Tables']['notifications']['Row']>;
      };
      blocked_users: {
        Row: {
          id: string;
          user_id: string;
          blocked_user_id: string;
          display_name: string;
          photo_url: string;
          status: string;
          reason: string | null;
          blocked_at: string;
        };
        Insert: Partial<Database['public']['Tables']['blocked_users']['Row']>;
        Update: Partial<Database['public']['Tables']['blocked_users']['Row']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
