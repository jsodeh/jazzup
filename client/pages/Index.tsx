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
import LocationPermissionModal from "@/components/LocationPermissionModal";
import ActionButtonTooltip from "@/components/ActionButtonTooltip";
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
      "Multiple gun shots heard in the area around 2nd street. Police sirens can be heard approaching. Residents advised to stay indoors and avoid the area until further notice. Multiple witnesses have confirmed hearing 5-6 shots fired in rapid succession.",
    type: "emergency",
    comments: [
      {
        id: "1",
        user: "Sarah M",
        text: "I heard them too, very scary",
        votes: 12,
        avatar: "/avatars/sarah.jpg",
        timeAgo: "8 min ago",
      },
      {
        id: "2",
        user: "Mike D",
        text: "Police are on scene now",
        votes: 8,
        avatar: "/avatars/mike.jpg",
        timeAgo: "5 min ago",
      },
    ],
  },
  {
    id: "2",
    title: "Car Break-in",
    location: "Main St Parking Lot",
    timeAgo: "1.2mi away · 25 min ago",
    votes: 23,
    lat: 37.3356,
    lng: -121.8814,
    description:
      "White sedan with smashed window in the Main Street parking lot. Glass scattered on the ground. No one was hurt but valuable items were stolen from the vehicle.",
    type: "crime",
    comments: [
      {
        id: "3",
        user: "John K",
        text: "Same thing happened to me last week",
        votes: 5,
        avatar: "/avatars/john.jpg",
        timeAgo: "20 min ago",
      },
    ],
  },
  {
    id: "3",
    title: "Road Construction",
    location: "Highway 101",
    timeAgo: "2.1mi away · 1 hr ago",
    votes: 156,
    lat: 37.3318,
    lng: -121.8795,
    description:
      "Major road construction blocking two lanes on Highway 101. Expect significant delays during rush hour. Alternative routes recommended via Stevens Creek Blvd.",
    type: "traffic",
    comments: [],
  },
];

// Mock function to get city from coordinates
const getCityFromCoordinates = async (
  lat: number,
  lng: number,
): Promise<string> => {
  // This would normally use a geocoding service
  // For now, return a mock city based on general San Jose area
  if (lat > 37.3 && lat < 37.4 && lng > -121.9 && lng < -121.8) {
    return "San Jose";
  }
  return "Unknown City";
};

// Mock function to load nearby alerts
const loadNearbyAlerts = async (lat: number, lng: number): Promise<Alert[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockAlerts;
};

// Create welcome alert for user's location
const createWelcomeAlert = (city: string, lat: number, lng: number): Alert => ({
  id: "welcome",
  title: `Welcome to ${city}!`,
  location: city,
  timeAgo: "Just now",
  votes: 0,
  lat,
  lng,
  description: `You're now viewing community safety alerts for ${city}. Stay informed about incidents, traffic, and important updates in your area.`,
  type: "info",
  comments: [],
});

export default function Index() {
  const { isAuthenticated } = useAuth();
  const { hasPermission, requestPermission } = useLocationPermission();
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authPromptType, setAuthPromptType] = useState<
    "vote" | "comment" | "create" | "profile"
  >("vote");
  const [currentPage, setCurrentPage] = useState(0);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    city: string;
  } | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [welcomeAlert, setWelcomeAlert] = useState<Alert | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

    // Show location permission modal on app load
  useEffect(() => {
    setShowLocationModal(true);
  }, []);

  const handleLocationAccept = async () => {
    setShowLocationModal(false);
    setIsLoadingLocation(true);

    try {
      const granted = await requestPermission();
        if (granted) {
          // Get user's current location
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                console.log("Location obtained:", { latitude, longitude });

                // Try to get city name from coordinates
                const city = await getCityFromCoordinates(latitude, longitude);
                setUserLocation({ lat: latitude, lng: longitude, city });

                // Create welcome notification
                const welcome = createWelcomeAlert(city, latitude, longitude);
                setWelcomeAlert(welcome);
                setSelectedAlert(welcome);

                // Load alerts around user's location
                const nearbyAlerts = await loadNearbyAlerts(
                  latitude,
                  longitude,
                );
                setAlerts([welcome, ...nearbyAlerts]);

                console.log(
                  `Welcome to ${city}! Found ${nearbyAlerts.length} nearby alerts.`,
                );
              } catch (error) {
                console.error("Error processing location:", error);
                // Fall back to default behavior
                const fallbackCity = "San Jose";
                setUserLocation({
                  lat: 37.3387,
                  lng: -121.8853,
                  city: fallbackCity,
                });
                const welcome = createWelcomeAlert(
                  fallbackCity,
                  37.3387,
                  -121.8853,
                );
                setWelcomeAlert(welcome);
                setSelectedAlert(welcome);
                setAlerts([welcome, ...mockAlerts]);
              }
            },
            (error) => {
              console.error("Geolocation error:", error);

              // Enhanced error handling with specific error messages
              let errorMessage = "Unknown geolocation error";
              switch (error.code) {
                case 1:
                  errorMessage =
                    "User denied location permission. Please enable location access in your browser settings to see personalized alerts.";
                  break;
                case 2:
                  errorMessage =
                    "Location information unavailable. Your device may not support location services.";
                  break;
                case 3:
                  errorMessage =
                    "Location request timed out. Please check your internet connection and try again.";
                  break;
                default:
                  errorMessage = `Geolocation failed with error code ${error.code}: ${error.message}`;
              }

              // Set user-friendly error message
              setLocationError(errorMessage);

              // Fallback to San Jose if location fails
              const fallbackCity = "San Jose";
              setUserLocation({
                lat: 37.3387,
                lng: -121.8853,
                city: fallbackCity,
              });
              const welcome = createWelcomeAlert(
                fallbackCity,
                37.3387,
                -121.8853,
              );
              setWelcomeAlert(welcome);
              setSelectedAlert(welcome);
              setAlerts([welcome, ...mockAlerts]);
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 300000,
            },
          );
        } else {
          // Permission denied, fall back to default location
          console.warn("Location permission denied, using default location");
          const fallbackCity = "San Jose";
          setUserLocation({
            lat: 37.3387,
            lng: -121.8853,
            city: fallbackCity,
          });
          const welcome = createWelcomeAlert(fallbackCity, 37.3387, -121.8853);
          setWelcomeAlert(welcome);
          setSelectedAlert(welcome);
          setAlerts([welcome, ...mockAlerts]);
        }
      } catch (error) {
        console.error("Error requesting location permission:", error);
        // Fall back to default location on any error
        const fallbackCity = "San Jose";
        setUserLocation({
          lat: 37.3387,
          lng: -121.8853,
          city: fallbackCity,
        });
        const welcome = createWelcomeAlert(fallbackCity, 37.3387, -121.8853);
        setWelcomeAlert(welcome);
        setSelectedAlert(welcome);
        setAlerts([welcome, ...mockAlerts]);
      } finally {
        setIsLoadingLocation(false);
      }
    };

        requestLocationOnLoad();
  }, []); // Empty dependency array - only run once on mount

  const handleCardClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setShowEventModal(true);
  };

  const handleVote = (alertId: string, voteType: "up" | "down") => {
    if (!isAuthenticated) {
      setAuthPromptType("vote");
      setShowAuthPrompt(true);
      return;
    }

    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              votes:
                alert.userVote === voteType
                  ? alert.votes - (voteType === "up" ? 1 : -1)
                  : alert.userVote
                    ? alert.votes + (voteType === "up" ? 2 : -2)
                    : alert.votes + (voteType === "up" ? 1 : -1),
              userVote: alert.userVote === voteType ? null : voteType,
            }
          : alert,
      ),
    );
  };

  const handleCommentVote = (commentId: string, voteType: "up" | "down") => {
    if (!isAuthenticated) {
      setAuthPromptType("vote");
      setShowAuthPrompt(true);
      return;
    }

    if (selectedAlert) {
      const updatedAlert = {
        ...selectedAlert,
        comments: selectedAlert.comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                votes:
                  comment.userVote === voteType
                    ? comment.votes - (voteType === "up" ? 1 : -1)
                    : comment.userVote
                      ? comment.votes + (voteType === "up" ? 2 : -2)
                      : comment.votes + (voteType === "up" ? 1 : -1),
                userVote: comment.userVote === voteType ? null : voteType,
              }
            : comment,
        ),
      };
      setSelectedAlert(updatedAlert);
      setAlerts(
        alerts.map((alert) =>
          alert.id === selectedAlert.id ? updatedAlert : alert,
        ),
      );
    }
  };

  const handleAddComment = (commentText: string) => {
    if (!isAuthenticated) {
      setAuthPromptType("comment");
      setShowAuthPrompt(true);
      return;
    }

    if (selectedAlert) {
      const newComment: Comment = {
        id: Date.now().toString(),
        user: "You",
        text: commentText,
        votes: 1,
        avatar: "/avatars/you.jpg",
        timeAgo: "Just now",
        userVote: "up",
      };

      const updatedAlert = {
        ...selectedAlert,
        comments: [newComment, ...selectedAlert.comments],
      };

      setSelectedAlert(updatedAlert);
      setAlerts(
        alerts.map((alert) =>
          alert.id === selectedAlert.id ? updatedAlert : alert,
        ),
      );
    }
  };

  const alertsPerPage = 3;
  const totalPages = Math.ceil(alerts.length / alertsPerPage);
  const startIndex = currentPage * alertsPerPage;
  const visibleAlerts = alerts.slice(startIndex, startIndex + alertsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (isLoadingLocation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Map placeholder */}
      <div className="h-screen w-full bg-gradient-to-br from-green-100 to-blue-100 relative overflow-hidden">
        {/* Map UI Controls */}
        <div className="absolute top-4 left-4 z-20">
          <button className="bg-white rounded-full p-3 shadow-lg">
            <Home className="h-6 w-6 text-gray-700" />
          </button>
        </div>
        <div className="absolute top-4 right-4 z-20">
          <button
            className="bg-white rounded-full p-3 shadow-lg"
            onClick={() => {
              if (!isAuthenticated) {
                setAuthPromptType("profile");
                setShowAuthPrompt(true);
              }
            }}
          >
            <User className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Location status */}
        {userLocation && (
          <div className="absolute top-20 left-4 z-20 bg-white rounded-lg p-2 shadow-lg">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-700">{userLocation.city}</span>
            </div>
          </div>
        )}

        {/* Location error display */}
        {locationError && (
          <div className="absolute top-20 left-4 right-4 z-20 bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg">
            <div className="flex items-start space-x-2">
              <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-800 font-medium">
                  Location Error
                </p>
                <p className="text-xs text-red-700 mt-1">{locationError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mock map markers */}
        <div className="absolute inset-0">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "absolute w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2",
                alert.type === "emergency" && "bg-red-500",
                alert.type === "crime" && "bg-orange-500",
                alert.type === "traffic" && "bg-yellow-500",
                alert.type === "info" && "bg-blue-500",
                selectedAlert?.id === alert.id && "ring-4 ring-blue-300",
              )}
              style={{
                left: `${50 + (alert.lng + 121.8853) * 1000}%`,
                top: `${50 - (alert.lat - 37.3387) * 1000}%`,
              }}
              onClick={() => handleCardClick(alert)}
            />
          ))}
        </div>

        {/* Current location marker */}
        {userLocation && (
          <div
            className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${50 + (userLocation.lng + 121.8853) * 1000}%`,
              top: `${50 - (userLocation.lat - 37.3387) * 1000}%`,
            }}
          >
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping"></div>
          </div>
        )}

        {/* Floating Action Buttons */}
        <div
          className={cn(
            "absolute right-4 z-20 transition-all duration-300",
            selectedAlert ? "bottom-80" : "bottom-28",
          )}
        >
                  <div className="flex flex-col space-y-4">
            <ActionButtonTooltip tooltip="Get Directions">
              <Link
                to="/directions"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors"
              >
                <Send className="h-6 w-6" />
              </Link>
            </ActionButtonTooltip>

            <ActionButtonTooltip tooltip="Recenter Map">
              <button
                onClick={recenterMap}
                className="bg-white hover:bg-gray-50 text-gray-700 rounded-full p-4 shadow-lg transition-colors"
              >
                <Target className="h-6 w-6" />
              </button>
            </ActionButtonTooltip>

            <ActionButtonTooltip tooltip="Add Alert">
              <button
                className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-colors"
                onClick={() => {
                  if (!isAuthenticated) {
                    setAuthPromptType("create");
                    setShowAuthPrompt(true);
                  }
                }}
              >
                <Plus className="h-6 w-6" />
              </button>
            </ActionButtonTooltip>
          </div>
        </div>

        {/* Bottom Sheet */}
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-10">
          <div className="flex justify-center py-3">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <div className="px-6 pb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Alerts
                </h2>
                <p className="text-sm text-gray-500">
                  {userLocation?.city || "San Jose"} • {alerts.length} active
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {totalPages > 1 && (
                  <>
                    <button
                      onClick={prevPage}
                      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <ChevronUp className="h-4 w-4 text-gray-600" />
                    </button>
                    <span className="text-xs text-gray-500">
                      {currentPage + 1}/{totalPages}
                    </span>
                    <button
                      onClick={nextPage}
                      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <ChevronDown className="h-4 w-4 text-gray-600" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {visibleAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                    selectedAlert?.id === alert.id
                      ? "bg-blue-50 border-blue-200 shadow-md"
                      : "bg-white border-gray-200 hover:bg-gray-50",
                    alert.id === "welcome" &&
                      "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200",
                  )}
                  onClick={() => handleCardClick(alert)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {alert.title}
                        </h3>
                        <span
                          className={cn(
                            "px-2 py-0.5 text-xs font-medium rounded-full",
                            alert.type === "emergency" &&
                              "bg-red-100 text-red-800",
                            alert.type === "crime" &&
                              "bg-orange-100 text-orange-800",
                            alert.type === "traffic" &&
                              "bg-yellow-100 text-yellow-800",
                            alert.type === "info" &&
                              "bg-blue-100 text-blue-800",
                          )}
                        >
                          {alert.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {alert.location}
                      </p>
                      <p className="text-xs text-gray-500">{alert.timeAgo}</p>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      {alert.id !== "welcome" && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(alert.id, "up");
                            }}
                            className={cn(
                              "p-1 rounded transition-colors",
                              alert.userVote === "up"
                                ? "bg-green-100 text-green-600"
                                : "text-gray-400 hover:text-green-600 hover:bg-green-50",
                            )}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <span className="text-sm font-medium text-gray-900">
                            {alert.votes}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(alert.id, "down");
                            }}
                            className={cn(
                              "p-1 rounded transition-colors",
                              alert.userVote === "down"
                                ? "bg-red-100 text-red-600"
                                : "text-gray-400 hover:text-red-600 hover:bg-red-50",
                            )}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <EventDetailsModal
        alert={selectedAlert}
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedAlert(null);
        }}
        onVote={handleVote}
        onCommentVote={handleCommentVote}
        onAddComment={(alertId, commentText) => handleAddComment(commentText)}
        isAuthenticated={isAuthenticated}
        onAuthRequired={() => {
          setAuthPromptType("comment");
          setShowAuthPrompt(true);
        }}
      />

            <AuthPromptModal
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        trigger={authPromptType === "create" ? "add_alert" : authPromptType}
      />

      <LocationPermissionModal
        isOpen={showLocationModal}
        onAccept={handleLocationAccept}
        onDeny={handleLocationDeny}
      />
    </div>
  );
}