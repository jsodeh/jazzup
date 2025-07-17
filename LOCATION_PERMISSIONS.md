# Location Permission Flow

## When Users See Location Permission Requests

The SafeAlert app requests location permissions at multiple strategic points to ensure the best user experience:

### 1. **Initial Setup Flow** (Primary Request)

- **When**: During the onboarding process in `/setup` (Setup.tsx)
- **Step**: Second step after welcome screens
- **Context**: User sees explanation of why location is needed
- **User Control**: Can choose "Allow Location Access" or "Skip for now"
- **Implementation**: `Setup.tsx` → location step → `requestLocationPermission()`

### 2. **Just-in-Time Requests** (Secondary Requests)

- **When**: User tries to use location-dependent features
- **Triggers**:
  - Tapping the location/target button on main map
  - Creating a new alert (auto-location)
  - Requesting directions
  - Enabling emergency features
- **Implementation**: Various components call `useLocationPermission()` hook

### 3. **Permission Modal** (Contextual Request)

- **When**: User explicitly interacts with location features without permission
- **Component**: `PermissionModal.tsx` with type="location"
- **User Control**: Detailed explanation with benefits and "Allow" or "Skip" options

## Permission States

### State 1: Never Asked

- Show onboarding setup with location step
- Explain benefits clearly
- Allow graceful skip

### State 2: Granted

- Full app functionality
- Real-time location updates
- Precise alerts and directions

### State 3: Denied

- App works with limited functionality
- Manual location entry for alerts
- Generic location for directions
- Periodic re-request prompts

### State 4: Blocked (Hard Denial)

- Show instructions to enable in browser settings
- Provide alternative manual location input
- Graceful degradation of features

## Implementation Details

```typescript
// Location permission is checked in these components:
1. Setup.tsx - Primary onboarding request
2. Index.tsx - When accessing location-based features
3. AddAlert.tsx - When creating location-based alerts
4. Directions.tsx - When getting current location for navigation
5. EmergencyModal.tsx - When sharing location for emergency

// Permission hook usage:
const { hasPermission, requestPermission } = useLocationPermission();
```

## User Experience Guidelines

1. **Always explain WHY** location is needed
2. **Show benefits** of enabling location
3. **Allow users to skip** if they're not ready
4. **Provide fallbacks** for denied permissions
5. **Re-request contextually** when features need it
6. **Never spam** with repeated requests

## Technical Implementation

The location permission system uses:

- Browser Geolocation API
- Custom React hooks for state management
- Graceful error handling
- Fallback location options
- Permission persistence across sessions
