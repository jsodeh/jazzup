Jazzup 🚨

Community-Powered Safety & Navigation Platform

Jazzup is a real-time community safety alert system that keeps neighborhoods informed and connected. Get instant notifications about safety incidents, traffic issues, weather alerts, and community updates within 100km of your location.

[App Preview image placeholder]

FEATURES

REAL-TIME SAFETY MAP
- Live incident tracking with community-verified alerts
- Interactive map interface showing your exact location
- 100km radius coverage for comprehensive area awareness
- Multiple alert types: Safety, Traffic, Weather, Community, Crime, Emergency

COMMUNITY-DRIVEN VERIFICATION
- Crowd-sourced validation through community voting
- Trust scoring system for reliable information
- Real-time comments and updates from local residents
- User verification badges for trusted community members

MOBILE-FIRST EXPERIENCE
- Responsive design optimized for mobile devices
- Progressive web app capabilities
- Offline functionality for critical safety features
- Push notifications for immediate alerts

SMART AUTHENTICATION FLOW
- Browse freely without account creation barriers
- Progressive enhancement - features unlock with authentication
- Contextual sign-up prompts explaining specific benefits
- Privacy-focused approach to user data

ADVANCED NAVIGATION
- Multi-modal directions (driving, transit, walking)
- Real-time route optimization avoiding incidents
- Public transport integration with bus/train schedules
- Emergency route planning during critical situations

EMERGENCY FEATURES
- One-tap emergency alerts with automatic location sharing
- Emergency contact integration for family safety
- Silent alarm system for discreet help requests
- Emergency services quick dial with local numbers

TECH STACK

Frontend
- React 18 - Modern UI library with hooks
- TypeScript - Type-safe development
- Vite - Fast build tool and dev server
- TailwindCSS 3 - Utility-first styling
- React Router 6 - SPA routing
- Framer Motion - Smooth animations

UI Components
- Radix UI - Accessible component primitives
- Lucide React - Beautiful icon library
- Sonner - Toast notifications
- React Hook Form - Form management

Backend & Database
- Supabase - PostgreSQL database with real-time subscriptions
- Row Level Security - Fine-grained data access control
- Real-time subscriptions - Live updates across clients
- Edge Functions - Serverless backend logic

Maps & Location
- Google Maps API - Interactive mapping
- Geolocation API - Precise location services
- Places API - Location search and autocomplete
- Directions API - Multi-modal routing

Development Tools
- Vitest - Fast unit testing
- ESLint + Prettier - Code quality and formatting
- TypeScript strict mode - Enhanced type safety
- Hot module replacement - Instant development feedback

Quick Start

Prerequisites
- Node.js 18+ installed
- Google Cloud Platform account (for Maps API)
- Supabase account (for database)

1. Clone & Install
   git clone https://github.com/your-username/jazzup.git
   cd jazzup
   npm install

2. Environment Setup
   cp .env.example .env
   Add your API credentials to .env:
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_APP_NAME=Jazzup
   VITE_APP_VERSION=1.0.0

3. Database Setup
   Run the SQL schema in your Supabase dashboard (see SETUP.md for details).

4. Start Development
   npm run dev
   Visit http://localhost:8080 to see the app in action!

User Experience

First-Time User Journey
1. Land on map -> Location permission requested immediately
2. Location granted -> Map centers on user's area
3. Welcome notification -> "Here's where you'll get notified on everything happening in/around [Your City]"
4. Explore freely -> View all alerts and community updates without barriers
5. Engage when ready -> Authentication prompts appear for voting, commenting, or reporting

Core Interactions
- View alerts -> Click map markers to see incident details
- Verify incidents -> Vote up/down to build community trust
- Share updates -> Add comments with local knowledge
- Report incidents -> Create new alerts for the community
- Get directions -> Navigate safely around incidents

Community Features
- Trust scoring -> Build reputation through helpful contributions
- Verification badges -> Earn recognition for reliable reporting
- Real-time chat -> Discuss incidents with neighbors
- Emergency network -> Connect during critical situations

Development

Project Structure
client/                 # React frontend application
├── components/         # Reusable UI components
│   ├── ui/            # Base UI component library
│   └── modals/        # Modal components
├── pages/             # Route components
├── lib/               # Utilities and configurations
│   ├── auth.tsx       # Authentication context
│   ├── supabase.ts    # Database client
│   └── googleMaps.ts  # Maps integration
└── hooks/             # Custom React hooks

server/                # Express API backend (optional)
├── routes/            # API endpoints
└── middleware/        # Server middleware

shared/                # Types shared between client/server
└── types.ts           # TypeScript type definitions

Available Scripts
npm run dev           # Start development server
npm run build         # Production build
npm run start         # Start production server
npm run test          # Run test suite
npm run typecheck     # TypeScript validation
npm run format        # Format code with Prettier

Key Components
- Index.tsx - Main map interface
- EventDetailsModal.tsx - Alert details and comments
- AuthPromptModal.tsx - Authentication flows
- PermissionModal.tsx - Location/notification permissions
- Setup.tsx - Multi-step onboarding

Authentication & Permissions

Permission Flow
- Location -> Requested immediately for personalized experience
- Notifications -> Optional, enhances real-time alerting
- Camera/Microphone -> For incident reporting with media

Authentication Triggers
- Voting on alerts -> "Verify Community Reports" prompt
- Adding comments -> "Share Community Updates" prompt
- Creating alerts -> "Report Safety Incidents" prompt
- Profile access -> "Join Jazzup Community" prompt

User Roles
- Anonymous -> View alerts, read comments
- Registered -> Vote, comment, create alerts
- Verified -> Enhanced trust score, priority features
- Moderator -> Community management tools

API Reference

Alert Management
GET /api/alerts?lat={lat}&lng={lng}&radius={km}
POST /api/alerts
  title: string,
  description: string,
  type: 'safety' | 'traffic' | 'weather' | 'community',
  latitude: number,
  longitude: number
POST /api/alerts/{id}/vote
  type: 'up' | 'down'

User Management
GET /api/profile
PATCH /api/profile
  full_name?: string,
  emergency_contact?: string,
  notification_preferences?: object
POST /api/profile/verify
  verification_type: 'phone' | 'email' | 'photo'

Real-time Subscriptions
supabase
  .channel("alerts")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "alerts",
    },
    handleAlertUpdate,
  )
  .subscribe();

Security & Privacy

Data Protection
- Row Level Security on all database tables
- JWT authentication with secure session management
- API rate limiting to prevent abuse
- Input validation and sanitization

Privacy Features
- Minimal data collection - only what's necessary for safety
- Location precision control - users choose sharing level
- Anonymous reporting options for sensitive situations
- Data retention policies - automatic cleanup of old alerts

Safety Measures
- Content moderation for inappropriate reports
- Spam detection and automated filtering
- Emergency escalation to local authorities when needed
- User blocking and reporting tools

Mobile App Features

PWA Capabilities
- Installable on mobile home screens
- Offline mode for viewing cached alerts
- Background sync for pending actions
- Native-like navigation with smooth transitions

Push Notifications
- Real-time alerts for incidents in your area
- Emergency broadcasts from local authorities
- Community updates on incidents you're following
- Customizable notification radius and types

Contributing
We welcome contributions from the community! Please read our Contributing Guidelines for details.

Development Setup
1. Fork the repository
2. Create a feature branch
3. Follow our coding standards
4. Add tests for new features
5. Submit a pull request

Code Standards
- TypeScript strict mode for type safety
- ESLint + Prettier for consistent formatting
- Conventional commits for clear history
- Test coverage for critical paths

License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
- Supabase - For the amazing backend-as-a-service platform
- Google Maps - For reliable mapping and location services
- Radix UI - For accessible component primitives
- Tailwind CSS - For the utility-first styling approach
- Community contributors - For making neighborhoods safer

Support
- Documentation: docs.jazzup.app
- Community Forum: community.jazzup.app
- Bug Reports: GitHub Issues
- Security Issues: security@jazzup.app

---

Made with love for safer communities
Jazzup - Keeping neighborhoods connected, informed, and safe. 