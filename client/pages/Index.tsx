import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronUp,
  ChevronDown,
  Home,
  Plus,
  User,
  MapPin,
  Target,
  Send,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import EventDetailsModal from "@/components/EventDetailsModal";
import AuthPromptModal from "@/components/AuthPromptModal";
import { useAuth, useLocationPermission } from "@/lib/auth";

interface Alert {
  id: string;
  title: string;
  location: string;
  timeAgo: string;
  votes: number;
  lat: number;
  lng: number;
  description: string;
  type: string;
  userVote?: "up" | "down" | null;
  comments: Comment[];
}

interface Comment {
  id: string;
  user: string;
  text: string;
  votes: number;
  avatar: string;
  timeAgo: string;
  userVote?: "up" | "down" | null;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    title: "Gun Shots Fired",
    location: "1st 2nd St, San Jose",
    timeAgo: "30min away · 10 min ago",
    votes: 84,
    lat: 37.3387,
    lng: -121.8853,
    description:
      "Multiple gunshots heard in the downtown area. Police are responding to the scene. Residents advised to stay indoors until further notice.",
    type: "safety",
    userVote: null,
    comments: [
      {
        id: "1",
        user: "ALFRED",
        text: "I heard it too, sounded like 3-4 shots. Police arrived within 5 minutes.",
        votes: 7,
        avatar: "👨‍💼",
        timeAgo: "5min ago",
        userVote: null,
      },
      {
        id: "2",
        user: "ROBERT",
        text: "Police said no injuries reported. Area is now secure.",
        votes: 61,
        avatar: "👮‍♂️",
        timeAgo: "8min ago",
        userVote: null,
      },
      {
        id: "3",
        user: "HENRY",
        text: "This intersection has had security issues before. Glad everyone is safe.",
        votes: 12,
        avatar: "👨",
        timeAgo: "12min ago",
        userVote: null,
      },
    ],
  },
  {
    id: "2",
    title: "Road Closure - Construction",
    location: "Highway 101 & Stevens Creek",
    timeAgo: "1 hour ago",
    votes: 23,
    lat: 37.3688,
    lng: -121.9026,
    description:
      "Emergency road work blocking two lanes on Highway 101. Expect significant delays during rush hour.",
    type: "traffic",
    userVote: null,
    comments: [
      {
        id: "4",
        user: "SARAH",
        text: "Traffic backed up for miles. Use alternative routes.",
        votes: 15,
        avatar: "👩",
        timeAgo: "45min ago",
        userVote: null,
      },
    ],
  },
  {
    id: "3",
    title: "Severe Weather Alert",
    location: "Downtown San Jose",
    timeAgo: "2 hours ago",
    votes: 156,
    lat: 37.3382,
    lng: -121.8863,
    description:
      "Heavy rain and strong winds expected. Flash flood warning in effect for low-lying areas.",
    type: "weather",
    userVote: null,
    comments: [],
  },
];

export default function Index() {
  const { isAuthenticated } = useAuth();
  const { hasPermission, requestPermission } = useLocationPermission();

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authPromptTrigger, setAuthPromptTrigger] = useState<
    "vote" | "comment" | "profile" | "add_alert"
  >("profile");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    city: string;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [welcomeAlert, setWelcomeAlert] = useState<Alert | null>(null);

  // Request location permission immediately on app load
  useEffect(() => {
    const requestLocationOnLoad = async () => {
      setIsLoadingLocation(true);
      try {
        const granted = await requestPermission();
        if (granted) {
          // Get user's current location
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;

              // Try to get city name from coordinates (mock for now)
              const city = await getCityFromCoordinates(latitude, longitude);

              setUserLocation({ lat: latitude, lng: longitude, city });

              // Create welcome alert
              const welcome = createWelcomeAlert(city, latitude, longitude);
              setWelcomeAlert(welcome);
              setSelectedAlert(welcome);

              // Load alerts around user's location
              const nearbyAlerts = await loadNearbyAlerts(latitude, longitude);
              setAlerts([welcome, ...nearbyAlerts]);
            },
            (error) => {
              console.error("Location error:", error);
              // Fallback to San Jose if location fails
              setUserLocation({
                lat: 37.3387,
                lng: -121.8853,
                city: "San Jose",
              });
              const welcome = createWelcomeAlert(
                "San Jose",
                37.3387,
                -121.8853,
              );
              setWelcomeAlert(welcome);
              setSelectedAlert(welcome);
              setAlerts([welcome, ...mockAlerts]);
            },
          );
        } else {
          // Use default San Jose location
          setUserLocation({ lat: 37.3387, lng: -121.8853, city: "San Jose" });
          const welcome = createWelcomeAlert("San Jose", 37.3387, -121.8853);
          setWelcomeAlert(welcome);
          setSelectedAlert(welcome);
          setAlerts([welcome, ...mockAlerts]);
        }
      } catch (error) {
        console.error("Permission error:", error);
        // Fallback to San Jose
        setUserLocation({ lat: 37.3387, lng: -121.8853, city: "San Jose" });
        const welcome = createWelcomeAlert("San Jose", 37.3387, -121.8853);
        setWelcomeAlert(welcome);
        setSelectedAlert(welcome);
        setAlerts([welcome, ...mockAlerts]);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    requestLocationOnLoad();
  }, [requestPermission]);

  const handleVote = (alertId: string, direction: "up" | "down") => {
    if (!isAuthenticated) {
      setAuthPromptTrigger("vote");
      setShowAuthPrompt(true);
      return;
    }

    // Handle voting logic
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              votes: alert.votes + (direction === "up" ? 1 : -1),
              userVote: direction,
            }
          : alert,
      ),
    );
    console.log(`Voting ${direction} on alert ${alertId}`);
  };

  const handleCommentVote = (commentId: string, direction: "up" | "down") => {
    if (!isAuthenticated) {
      setAuthPromptTrigger("vote");
      setShowAuthPrompt(true);
      return;
    }

    // Handle comment voting logic
    console.log(`Voting ${direction} on comment ${commentId}`);
  };

  const submitComment = () => {
    if (!isAuthenticated) {
      setAuthPromptTrigger("comment");
      setShowAuthPrompt(true);
      return;
    }

    if (comment.trim()) {
      // Add comment logic
      console.log("Adding comment:", comment);
      setComment("");
    }
  };

  const handleAddAlert = () => {
    if (!isAuthenticated) {
      setAuthPromptTrigger("add_alert");
      setShowAuthPrompt(true);
      return;
    }
    // Navigate to add alert page
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setAuthPromptTrigger("profile");
      setShowAuthPrompt(true);
      return;
    }
    // Navigate to profile
  };

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setShowEventDetails(true);
  };

  const handleLocationRequest = async () => {
    const granted = await requestPermission();
    if (granted) {
      // Load alerts within 100km of user location
      console.log("Location granted, loading nearby alerts");
    }
  };

  // Helper function to get city name from coordinates
  const getCityFromCoordinates = async (
    lat: number,
    lng: number,
  ): Promise<string> => {
    try {
      // In a real app, this would use Google Maps Geocoding API
      // For now, we'll use a simple mock based on coordinates
      if (lat >= 37.2 && lat <= 37.5 && lng >= -122.0 && lng <= -121.7) {
        return "San Jose";
      } else if (lat >= 37.7 && lat <= 37.8 && lng >= -122.5 && lng <= -122.3) {
        return "San Francisco";
      } else if (lat >= 37.4 && lat <= 37.5 && lng >= -122.3 && lng <= -122.1) {
        return "Palo Alto";
      } else {
        return "Your Area";
      }
    } catch (error) {
      return "Your Area";
    }
  };

  // Helper function to create welcome alert
  const createWelcomeAlert = (
    city: string,
    lat: number,
    lng: number,
  ): Alert => {
    return {
      id: "welcome",
      title: "Welcome to SafeAlert",
      location: `${city}, CA`,
      timeAgo: "Just now",
      votes: 0,
      lat,
      lng,
      description: `Here's where you'll get notified on everything happening in and around ${city}. SafeAlert keeps you informed about safety incidents, traffic issues, weather alerts, and community updates within 100km of your location. Your community is working together to keep everyone safe and informed.`,
      type: "community",
      userVote: null,
      comments: [
        {
          id: "welcome-1",
          user: "SAFEALERT",
          text: `🎯 You'll receive alerts within 100km of ${city}`,
          votes: 0,
          avatar: "🛡️",
          timeAgo: "Just now",
          userVote: null,
        },
        {
          id: "welcome-2",
          user: "SAFEALERT",
          text: "🔔 Enable notifications to get real-time alerts",
          votes: 0,
          avatar: "🛡️",
          timeAgo: "Just now",
          userVote: null,
        },
        {
          id: "welcome-3",
          user: "SAFEALERT",
          text: "👥 Join the community to verify and report incidents",
          votes: 0,
          avatar: "🛡️",
          timeAgo: "Just now",
          userVote: null,
        },
      ],
    };
  };

  // Helper function to load nearby alerts (mock for now)
  const loadNearbyAlerts = async (
    lat: number,
    lng: number,
  ): Promise<Alert[]> => {
    // In a real app, this would fetch alerts from the backend within 100km
    // For now, return mock alerts with adjusted coordinates near user
    return mockAlerts.map((alert) => ({
      ...alert,
      lat: lat + (Math.random() - 0.5) * 0.1, // Random offset within ~10km
      lng: lng + (Math.random() - 0.5) * 0.1,
    }));
  };

  return (
    <div className="h-screen bg-map-bg overflow-hidden relative">
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-11 bg-transparent flex items-center justify-between px-4 z-50 text-white text-sm font-medium">
        <span>12:22</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
          <div className="ml-2">
            <svg width="18" height="12" fill="white">
              <rect width="4" height="12" rx="1" />
              <rect x="6" width="4" height="8" rx="1" />
              <rect x="12" width="4" height="4" rx="1" />
            </svg>
          </div>
          <div className="ml-1 w-6 h-3 border border-white rounded-sm">
            <div className="w-4 h-1.5 bg-white rounded-sm m-0.5"></div>
          </div>
        </div>
      </div>

      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
        {/* Street Grid Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="rgb(180 150 100)"
                strokeWidth="1"
                opacity="0.4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Dynamic Street Labels based on user location */}
        {userLocation ? (
          <>
            <div className="absolute top-20 left-8 text-map-label font-medium text-lg tracking-wide">
              {userLocation.city.toUpperCase()}
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-map-label font-bold text-2xl">
              {userLocation.city}
            </div>
            <div className="absolute bottom-1/3 left-1/3 text-map-label font-medium text-sm">
              YOUR AREA
            </div>
          </>
        ) : (
          <>
            <div className="absolute top-20 left-8 text-map-label font-medium text-lg tracking-wide">
              LOCATING...
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-map-label font-bold text-2xl">
              Finding Location
            </div>
          </>
        )}

        {/* Highway Markers */}
        <div className="absolute top-16 left-4 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
          480
        </div>
        <div className="absolute top-12 right-32 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
          101
        </div>
        <div className="absolute bottom-20 left-6 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
          280
        </div>
      </div>

      {/* Alert Markers */}
      {alerts.map((alert, index) => (
        <button
          key={alert.id}
          onClick={() => handleAlertClick(alert)}
          className="absolute top-52 left-20 w-8 h-8 bg-alert rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          style={{
            left: `${20 + index * 40}%`,
            top: `${52 - index * 10}%`,
          }}
        >
          <MapPin className="w-5 h-5 text-white" />
        </button>
      ))}

      {/* Action Buttons */}
      <div
        className={cn(
          "absolute right-6 flex flex-col gap-3 z-40 transition-all duration-300",
          selectedAlert && !isExpanded
            ? "bottom-1/2 transform translate-y-1/2"
            : "bottom-32",
        )}
      >
        <Link
          to="/directions"
          className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-lg border border-border hover:scale-105 transition-transform"
        >
          <MapPin className="w-6 h-6 text-foreground" />
        </Link>
        <button
          onClick={handleLocationRequest}
          className="w-12 h-12 bg-alert rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <Target className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Loading State */}
      {isLoadingLocation && (
        <div className="absolute top-20 left-4 right-4 bg-card rounded-2xl p-4 shadow-lg border border-border z-30">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 text-alert animate-spin">📍</div>
            <div className="flex-1">
              <p className="font-medium text-foreground mb-1">
                Finding your location...
              </p>
              <p className="text-sm text-muted-foreground">
                Getting alerts for your area
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={showEventDetails}
        onClose={() => setShowEventDetails(false)}
        alert={selectedAlert}
        onVote={handleVote}
        onCommentVote={handleCommentVote}
        onAddComment={(alertId, comment) => {
          // Handle adding comment
          console.log("Adding comment to alert:", alertId, comment);
        }}
        onAuthRequired={() => {
          setAuthPromptTrigger("comment");
          setShowAuthPrompt(true);
        }}
        isAuthenticated={isAuthenticated}
      />

      {/* Authentication Prompt Modal */}
      <AuthPromptModal
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        trigger={authPromptTrigger}
      />

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-card border-t border-border">
        <div className="flex items-center justify-around h-full px-8">
          <button className="p-3">
            <Home className="w-6 h-6 text-foreground" />
          </button>
          <button onClick={handleAddAlert} className="p-3">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </button>
          <button onClick={handleProfileClick} className="p-3">
            <User className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>
      </div>
    </div>
  );
}
