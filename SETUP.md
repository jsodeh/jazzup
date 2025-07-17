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

#### 5.3 Get API Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy your **Project URL** and **Anon (public) key**
3. Add them to your `.env` file

#### 5.4 Configure Real-time (Optional)

1. Go to **Database** → **Replication**
2. Enable real-time for the tables you want live updates on
3. This allows instant alert notifications across all users

### 6. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## 🎯 User Experience Flow

### Location Permission Strategy

Jazzup requests location permission **immediately** when users land on the app:

1. **Immediate Request** - Location permission requested on page load
2. **Welcome Card** - Personalized notification for user's area
3. **Graceful Fallback** - App works without location (uses default area)
4. **100km Radius** - Shows all alerts within 100km of user's location

### Authentication Flow

- **Browse Freely** - No barriers to viewing alerts and comments
- **Progressive Enhancement** - Features unlock with account creation
- **Contextual Prompts** - Auth required only for voting, commenting, reporting
- **Clear Value Proposition** - Each prompt explains specific benefits

## 🚀 Features Enabled

With proper setup, you'll have access to:

### ✅ **Real-Time Safety Network**

- **Live incident mapping** with community verification
- **Instant notifications** for alerts in your area
- **Geographic filtering** within 100km radius
- **Multi-category alerts** (Safety, Traffic, Weather, Community, Crime, Emergency)

### ✅ **Community Engagement**

- **Crowd-sourced validation** through voting system
- **Real-time commenting** with community updates
- **Trust scoring** for reliable contributors
- **User verification** badges and profiles

### ✅ **Advanced Navigation**

- **Multi-modal directions** (driving, transit, walking)
- **Real-time route optimization** avoiding incidents
- **Public transportation** integration
- **Emergency routing** during critical situations

### ✅ **Smart Authentication**

- **Progressive user onboarding** without barriers
- **Contextual sign-up flows** explaining benefits
- **Privacy-focused** data handling
- **Emergency features** for authenticated users

### ✅ **Mobile-Optimized Experience**

- **Progressive Web App** capabilities
- **Responsive design** for all screen sizes
- **Touch-friendly interactions** and gestures
- **Offline functionality** for critical features

## 🧪 Testing the Application

### Local Development Testing

1. **Verify Configuration**

   ```bash
   npm run typecheck  # Check TypeScript errors
   npm run test       # Run test suite
   ```

2. **Test Core Features**

   - Visit `http://localhost:8080`
   - Allow location permission when prompted
   - Verify welcome notification appears with your city
   - Test alert interactions (viewing, modal opening)
   - Try authentication flows (voting, commenting)

3. **Test Different Scenarios**
   - **With location**: Full functionality with real coordinates
   - **Without location**: Fallback to San Jose with mock data
   - **Different browsers**: Chrome, Firefox, Safari, Mobile browsers
   - **Different screen sizes**: Mobile, tablet, desktop

### Feature Testing Checklist

- [ ] Location permission requested immediately
- [ ] Welcome card shows user's city
- [ ] Map displays user location (blue dot)
- [ ] Alert markers are clickable
- [ ] Event details modal opens correctly
- [ ] Authentication prompts appear for protected actions
- [ ] Navigation works between pages
- [ ] Responsive design on mobile devices

## 🌐 Production Deployment

### Pre-deployment Checklist

1. **Security Configuration**

   - [ ] Update CORS settings in Supabase for your domain
   - [ ] Restrict Google Maps API key to production domains
   - [ ] Enable Row Level Security policies
   - [ ] Configure rate limiting

2. **Environment Setup**

   ```bash
   # Production environment variables
   VITE_GOOGLE_MAPS_API_KEY=your_production_api_key
   VITE_SUPABASE_URL=your_production_supabase_url
   VITE_SUPABASE_ANON_KEY=your_production_anon_key
   ```

3. **Build and Deploy**
   ```bash
   npm run build      # Create production build
   npm run start      # Test production build locally
   ```

### Deployment Platforms

#### **Netlify (Recommended)**

```bash
# Build command
npm run build

# Publish directory
dist/spa

# Environment variables
# Add your VITE_* variables in Netlify dashboard
```

#### **Vercel**

```bash
# Build command
npm run build

# Output directory
dist/spa
```

#### **Custom Server**

```bash
npm run build
npm run start  # Runs Express server
```

### SSL/TLS Configuration

- **Required for Geolocation API** - HTTPS is mandatory
- **Let's Encrypt** - Free SSL certificates
- **Cloudflare** - CDN with automatic HTTPS

## 🔧 Troubleshooting

### **Google Maps Issues**

**Maps not loading:**

- ✅ Verify API key is correct and has no extra spaces
- ✅ Check that all required APIs are enabled
- ✅ Ensure billing is enabled on your Google Cloud project
- ✅ Check browser console for specific error messages
- ✅ Verify domain restrictions allow your current domain

**"This page can't load Google Maps correctly":**

- ✅ API key restrictions are too strict
- ✅ Billing account is required for Maps APIs
- ✅ Check quotas haven't been exceeded

### **Supabase Connection Issues**

**Database connection failed:**

- ✅ Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- ✅ Check network connectivity
- ✅ Ensure Supabase project is active (not paused)
- ✅ Review browser console for specific errors

**RLS policy errors:**

- ✅ Confirm Row Level Security policies are properly configured
- ✅ Check user authentication status
- ✅ Verify policy conditions match your use case

### **Location Permission Issues**

**Location not working:**

- ✅ **HTTPS required** - Geolocation only works on secure connections
- ✅ Check browser location settings
- ✅ Verify permission handling code
- ✅ Test fallback scenarios (permission denied)

**Permission denied:**

- ✅ App should gracefully fall back to default location
- ✅ User can still view all features with mock data
- ✅ Provide clear instructions for enabling location

### **Build and Development Issues**

**TypeScript errors:**

```bash
npm run typecheck  # Identify specific type issues
```

**Dependency issues:**

```bash
rm -rf node_modules package-lock.json
npm install  # Clean install
```

**Port conflicts:**

```bash
# Change port in package.json or vite.config.ts
npm run dev -- --port 3000
```

### **Performance Optimization**

- **Code splitting** - Implement dynamic imports for large components
- **Image optimization** - Compress and serve appropriate sizes
- **Bundle analysis** - Use `npm run build -- --analyze`
- **CDN usage** - Serve static assets from CDN

### **Monitoring and Analytics**

- **Error tracking** - Integrate Sentry for production error monitoring
- **Performance monitoring** - Use Google Analytics or similar
- **User feedback** - Implement feedback collection system
- **Usage analytics** - Track feature adoption and user flows

## 📞 Getting Help

- **Documentation**: Check this setup guide first
- **GitHub Issues**: Report bugs and feature requests
- **Community Forum**: Connect with other developers
- **Stack Overflow**: Tag questions with `jazzup` and `supabase`

Remember to never commit API keys or sensitive information to version control. Always use environment variables for configuration.
