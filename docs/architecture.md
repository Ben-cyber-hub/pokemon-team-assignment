# Architecture Overview

## System Architecture

The Pokemon Team Builder uses a client-side architecture with the following components:

1. **Client Application**: React SPA (Single Page Application)
2. **Data Sources**:
   - PokeAPI (external) - For Pokemon data
   - Supabase (backend-as-a-service) - For user data, authentication, and team storage

### Key Components

1. **Authentication Layer**
   - Uses Supabase Auth for user management
   - JWT tokens for secure authentication
   - Protected routes to control access

2. **Data Layer**
   - React Query for data fetching, caching, and synchronization
   - Custom hooks for data access abstraction
   - Type-safe data handling with TypeScript

3. **UI Layer**
   - Component-based architecture with React
   - Responsive design with Tailwind CSS
   - Accessibility considerations throughout

## Data Flow

1. User authentication flow:
   - User credentials → Supabase Auth → JWT Token → Protected routes

2. Pokemon data flow:
   - User request → React Query → PokeAPI → Component display
   - Cached data used when available to reduce API calls

3. Team management flow:
   - User actions → Team mutation hooks → Supabase Database → UI update

## Database Schema

The application uses the following database tables in Supabase:

1. `profiles` - User profile information
   - `user_id` (PK) - References auth.users
   - `username` - User's display name
   - `created_at` - Profile creation timestamp
   - `updated_at` - Profile update timestamp

2. `teams` - Pokemon teams
   - `team_id` (PK) - Unique identifier
   - `user_id` (FK) - Owner of the team
   - `team_name` - Name of the team
   - `team_description` - Optional description
   - `team_code` - Unique code for sharing
   - `is_public` - Whether the team is publicly accessible
   - `created_at` - Team creation timestamp
   - `updated_at` - Team update timestamp

3. `team_pokemon` - Pokemon within teams
   - `entry_id` (PK) - Unique identifier
   - `team_id` (FK) - References teams
   - `pokemon_id` - Pokemon ID from PokeAPI
   - `position` - Position in team (1-6)
   - `moves` - Optional array of move IDs

## API Integration

The application integrates with two main APIs:

1. **PokeAPI**
   - RESTful API for Pokemon data
   - Endpoints used:
     - `/pokemon` - List and search Pokemon
     - `/pokemon/{id}` - Get Pokemon details
     - `/type/{type}` - Get Pokemon by type

2. **Supabase API**
   - RESTful API for database operations
   - Auth API for user management
   - Real-time subscriptions for data updates