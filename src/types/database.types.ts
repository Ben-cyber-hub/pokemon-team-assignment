export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          username: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          username: string;
        };
        Update: {
          username?: string;
          updated_at?: string;
        };
      };
      teams: {
        Row: {
          team_id: string;
          user_id: string;
          team_name: string;
          team_description?: string;
          team_code: string;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          team_name: string;
          team_description?: string;
          is_public?: boolean;
        };
        Update: {
          team_name?: string;
          team_description?: string;
          is_public?: boolean;
        };
      };
    };
  };
}