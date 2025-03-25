## Supabase Setup and Configuration

This application uses Supabase as its backend service. Follow these steps to set up your own Supabase instance.

### 1. Create a Supabase Project

1. Sign up or log in at [supabase.com](https://supabase.com)
2. Click "New Project" and provide:
   - Organization (create one if needed)
   - Project name (e.g., "pokemon-team-builder")
   - Database password (save this securely)
   - Region closest to your users
3. Wait for your project to be created (may take a few minutes)

### 2. Database Setup

#### Create Tables

Execute the following SQL in the Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create teams table
CREATE TABLE public.teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  share_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create team_pokemon table
CREATE TABLE public.team_pokemon (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  pokemon_id INTEGER NOT NULL,
  position INTEGER NOT NULL CHECK (position BETWEEN 1 AND 6),
  moves JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (team_id, position)
);

-- Create function to generate random share codes
CREATE OR REPLACE FUNCTION generate_share_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.share_code := substr(md5(random()::text), 1, 8);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to generate share code on team creation
CREATE TRIGGER generate_team_share_code
BEFORE INSERT ON public.teams
FOR EACH ROW
WHEN (NEW.share_code IS NULL)
EXECUTE FUNCTION generate_share_code();
```

### 3. Set Up Row-Level Security (RLS)
Enable Row Level Security for all tables and create policies:
``` sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_pokemon ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Teams policies
CREATE POLICY "Users can view their own teams"
  ON public.teams
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public teams"
  ON public.teams
  FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view shared teams"
  ON public.teams
  FOR SELECT
  USING (share_code IS NOT NULL);

CREATE POLICY "Users can create their own teams"
  ON public.teams
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own teams"
  ON public.teams
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own teams"
  ON public.teams
  FOR DELETE
  USING (auth.uid() = user_id);

-- Team Pokemon policies
CREATE POLICY "Users can view pokemon in their teams"
  ON public.team_pokemon
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.teams 
    WHERE teams.id = team_pokemon.team_id 
    AND teams.user_id = auth.uid()
  ));

CREATE POLICY "Users can view pokemon in public teams"
  ON public.team_pokemon
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.teams 
    WHERE teams.id = team_pokemon.team_id 
    AND teams.is_public = true
  ));

CREATE POLICY "Users can view pokemon in shared teams"
  ON public.team_pokemon
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.teams 
    WHERE teams.id = team_pokemon.team_id 
    AND teams.share_code IS NOT NULL
  ));

CREATE POLICY "Users can add pokemon to their teams"
  ON public.team_pokemon
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.teams 
    WHERE teams.id = team_pokemon.team_id 
    AND teams.user_id = auth.uid()
  ));

CREATE POLICY "Users can update pokemon in their teams"
  ON public.team_pokemon
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.teams 
    WHERE teams.id = team_pokemon.team_id 
    AND teams.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete pokemon from their teams"
  ON public.team_pokemon
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.teams 
    WHERE teams.id = team_pokemon.team_id 
    AND teams.user_id = auth.uid()
  ));
```

### 4. Authentication Setup
1. Go to Authentication > Settings in your Supabase dashboard
2. Under Email Auth, ensure "Enable Email Signup" is turned on
3. Configure Redirect URLs:
 - Add your local development URL (e.g., http://localhost:3000)
 - Add your production URL (e.g., https://yourusername.github.io/pokemon-team-assignment)

### 5. Create Database Indexes
``` sql
-- Indexes for faster lookups
CREATE INDEX team_pokemon_team_id_idx ON public.team_pokemon (team_id);
CREATE INDEX teams_user_id_idx ON public.teams (user_id);
CREATE INDEX teams_share_code_idx ON public.teams (share_code);
```
### 6. Get Your API Keys
1. Go to Project Settings > API in your Supabase dashboard
2. Copy the "Project URL" and "anon public" key
3. Add these to your .env file as described in the Installation section
### 7. Manage CORS Settings
1. Go to Project Settings > API > CORS in your Supabase dashboard
2. Add the following URLs to the "Additional allowed URLs" section:
 - http://localhost:3000
 - https://yourusername.github.io (or your deployment domain)