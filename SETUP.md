# Jazzup Setup Guide 🚀

**Complete installation and configuration guide for the Jazzup community safety platform**

## Prerequisites

- **Node.js 18+** installed on your system
- **Google Cloud Platform** account with billing enabled
- **Supabase** account (free tier available)
- Basic knowledge of environment variables and command line

## 🛠️ Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/jazzup.git
cd jazzup
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:

- `@supabase/supabase-js` - Database client
- `@googlemaps/js-api-loader` - Maps integration
- `@types/google.maps` - TypeScript definitions

### 3. Environment Configuration

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Configure your environment variables in `.env`:

```env
# Google Maps API Configuration
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# App Configuration
VITE_APP_NAME=Jazzup
VITE_APP_VERSION=1.0.0

# Optional: Push Notification Configuration
VITE_VAPID_PUBLIC_KEY=your_vapid_public_key_here
```

### 4. Google Maps API Setup

#### 4.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project named "Jazzup" or select existing one
3. Enable billing for your project (required for Maps APIs)

#### 4.2 Enable Required APIs

Navigate to the API Library and enable these APIs:

- **Maps JavaScript API** - Core mapping functionality
- **Places API** - Location search and autocomplete
- **Geocoding API** - Address/coordinate conversion
- **Directions API** - Navigation and routing
- **Geolocation API** - Device location services

#### 4.3 Create and Configure API Key

1. Go to "Credentials" in the Google Cloud Console
2. Click "Create Credentials" → "API Key"
3. **Important**: Restrict your API key for security:
   - **Application restrictions**: HTTP referrers
   - **Website restrictions**: Add your domains (localhost:8080, your-domain.com)
   - **API restrictions**: Select only the APIs listed above
4. Copy the API key to your `.env` file

#### 4.4 Set Up API Quotas (Optional)

- Monitor usage in the Google Cloud Console
- Set up billing alerts to avoid unexpected charges
- Consider quota limits for production deployment

### 5. Supabase Database Setup

#### 5.1 Create Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Choose your organization
4. Set project name: "Jazzup"
5. Create a strong database password
6. Select a region close to your users
7. Wait for the project to be created (1-2 minutes)

#### 5.2 Configure Database Schema

1. Go to the **SQL Editor** in your Supabase dashboard
2. Create a new query and run this SQL to create the required tables:

```sql
-- Enable Row Level Security
alter table auth.users enable row level security;

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  phone text,
  avatar_url text,
  is_verified boolean default false,
  trust_score integer default 0,
  location text,
  emergency_contact_name text,
  emergency_contact_phone text,
  emergency_contact_relationship text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create alerts table
create table public.alerts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  type text check (type in ('safety', 'traffic', 'weather', 'community', 'crime', 'emergency')) not null,
  latitude double precision not null,
  longitude double precision not null,
  address text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  votes integer default 0,
  is_verified boolean default false,
  status text check (status in ('active', 'resolved', 'archived')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  alert_id uuid references public.alerts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  votes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create notifications table
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text check (type in ('alert', 'comment', 'verification', 'emergency')) not null,
  is_read boolean default false,
  related_alert_id uuid references public.alerts(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create voting tables
create table public.alert_votes (
  id uuid default gen_random_uuid() primary key,
  alert_id uuid references public.alerts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  vote_type text check (vote_type in ('up', 'down')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(alert_id, user_id)
);

create table public.comment_votes (
  id uuid default gen_random_uuid() primary key,
  comment_id uuid references public.comments(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  vote_type text check (vote_type in ('up', 'down')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(comment_id, user_id)
);

-- Row Level Security Policies

-- Profiles policies
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Alerts policies
alter table public.alerts enable row level security;

create policy "Alerts are viewable by everyone" on public.alerts
  for select using (true);

create policy "Authenticated users can create alerts" on public.alerts
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update their own alerts" on public.alerts
  for update using (auth.uid() = user_id);

-- Comments policies
alter table public.comments enable row level security;

create policy "Comments are viewable by everyone" on public.comments
  for select using (true);

create policy "Authenticated users can create comments" on public.comments
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update their own comments" on public.comments
  for update using (auth.uid() = user_id);

-- Notifications policies
alter table public.notifications enable row level security;

create policy "Users can view their own notifications" on public.notifications
  for select using (auth.uid() = user_id);

create policy "Users can update their own notifications" on public.notifications
  for update using (auth.uid() = user_id);

-- Voting policies
alter table public.alert_votes enable row level security;
alter table public.comment_votes enable row level security;

create policy "Votes are viewable by everyone" on public.alert_votes
  for select using (true);

create policy "Authenticated users can vote" on public.alert_votes
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update their own votes" on public.alert_votes
  for update using (auth.uid() = user_id);

create policy "Comment votes are viewable by everyone" on public.comment_votes
  for select using (true);

create policy "Authenticated users can vote on comments" on public.comment_votes
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update their own comment votes" on public.comment_votes
  for update using (auth.uid() = user_id);

-- Functions for updating timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger handle_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger handle_updated_at before update on public.alerts
  for each row execute function public.handle_updated_at();

create trigger handle_updated_at before update on public.comments
  for each row execute function public.handle_updated_at();
```

4. Copy your Supabase URL and anon key from Settings > API
5. Add them to your `.env` file

### 5. Run the Application

```bash
npm run dev
```

## Location Permission Flow

The app requests location permissions in this order:

1. **Setup Flow** - During onboarding (recommended)
2. **Feature-Based** - When user tries location features
3. **Just-in-Time** - When creating alerts or getting directions

Users can always skip and use the app with limited functionality.

## Features Enabled

With proper setup, you'll have:

### ✅ Authentication & Profiles

- User registration and login
- Profile management with verification
- Trust scoring system
- Emergency contact setup

### ✅ Real-time Alerts

- Community-driven incident reporting
- Voting and verification system
- Geographic filtering
- Push notifications

### ✅ Navigation & Directions

- Google Maps integration
- Turn-by-turn directions
- Multiple transport modes
- Real-time location tracking

### ✅ Safety Features

- Emergency alert system
- Location sharing
- Community verification
- Real-time notifications

## Testing

To test the app locally:

1. Make sure both Google Maps and Supabase are configured
2. Run `npm run dev`
3. Go to `/onboarding` to test the complete flow
4. Create a test account and explore features

## Production Deployment

For production:

1. Update CORS settings in Supabase
2. Configure proper API key restrictions in Google Cloud
3. Set up domain-specific environment variables
4. Enable proper security headers
5. Configure SSL/TLS certificates

## Troubleshooting

**Google Maps not loading:**

- Check API key is correct
- Verify APIs are enabled
- Check browser console for errors
- Ensure domain is allowed

**Supabase connection issues:**

- Verify URL and anon key
- Check network connectivity
- Review browser console errors
- Confirm RLS policies are correct

**Location permissions:**

- Test on HTTPS (required for geolocation)
- Check browser settings
- Verify permission handling code
- Test fallback scenarios
