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
import DirectionsCard from "@/components/DirectionsCard";
import { useAuth, useLocationPermission } from "@/lib/auth";
import {
  getNearbyAlerts,
  voteOnAlert,
  voteOnComment,
  addComment,
  getUserVotes,
  createWelcomeAlert,
  formatTimeAgo,
  type Alert as DbAlert,
  type Comment as DbComment,
} from "@/lib/alertsService";
import { getAddressFromCoordinates } from "@/lib/googleMaps";

// Display interfaces for the UI
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

// Transform Supabase alert to display format
const transformAlert = (
  alert: DbAlert,
  userVotes: any[],
  commentVotes: any[],
): Alert => {
  const userVote = userVotes.find((v) => v.alert_id === alert.id)?.vote_type;
  const transformedComments = alert.comments?.map((comment) => {
    const commentUserVote = commentVotes.find(
      (v) => v.comment_id === comment.id,
    )?.vote_type;
    return {
      id: comment.id,
      user: comment.user_profile?.full_name || "Anonymous",
      text: comment.content,
      votes: comment.votes,
      avatar: comment.user_profile?.avatar_url || "/avatars/default.jpg",
      timeAgo: formatTimeAgo(comment.created_at),
      userVote: commentUserVote || null,
    };
  });

  return {
    id: alert.id,
    title: alert.title,
    location: alert.address,
    timeAgo: formatTimeAgo(alert.created_at),
    votes: alert.votes,
    lat: alert.latitude,
    lng: alert.longitude,
    description: alert.description,
    type: alert.type,
    userVote: userVote || null,
    comments: transformedComments || [],
  };
};

// Get city from coordinates using Google Maps or fallback
const getCityFromCoordinates = async (
  lat: number,
  lng: number,
): Promise<string> => {
  try {
    const address = await getAddressFromCoordinates({ lat, lng });
    // Extract city from address
    const parts = address.split(",");
    return parts[1]?.trim() || "Unknown City";
  } catch (error) {
    // Fallback for San Jose area
    if (lat > 37.3 && lat < 37.4 && lng > -121.9 && lng < -121.8) {
      return "San Jose";
    }
    return "Unknown City";
  }
};

export default function Index() {
  const { isAuthenticated, user } = useAuth();
  const { requestPermission } = useLocationPermission();
  const [alerts, setAlerts] = useState<Alert[]>([]);
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
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [welcomeAlert, setWelcomeAlert] = useState<Alert | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDirectionsFirst, setShowDirectionsFirst] = useState(true);

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
              const welcomeDb = createWelcomeAlert(city, latitude, longitude);
              const welcome = transformAlert(welcomeDb, [], []);
              setWelcomeAlert(welcome);
              setSelectedAlert(welcome);

              // Load alerts around user's location
              const nearbyAlerts = await getNearbyAlerts(latitude, longitude);

              // Get user votes if authenticated
              let userVotes = { alertVotes: [], commentVotes: [] };
              if (user) {
                userVotes = await getUserVotes(user.id);
              }

              const transformedAlerts = nearbyAlerts.map((alert) =>
                transformAlert(
                  alert,
                  userVotes.alertVotes,
                  userVotes.commentVotes,
                ),
              );

              setAlerts([welcome, ...transformedAlerts]);

              console.log(
                `Welcome to ${city}! Found ${nearbyAlerts.length} nearby alerts.`,
              );
            } catch (error) {
              console.error("Error processing location:", error);
              handleLocationFallback();
            } finally {
              setIsLoadingLocation(false);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            let errorMessage = "Unknown geolocation error";
            switch (error.code) {
              case 1:
                errorMessage = "User denied location permission";
                break;
              case 2:
                errorMessage = "Location information unavailable";
                break;
              case 3:
                errorMessage = "Location request timed out";
                break;
            }
            setLocationError(errorMessage);
            handleLocationFallback();
            setIsLoadingLocation(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000,
          },
        );
      } else {
        handleLocationFallback();
        setIsLoadingLocation(false);
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      handleLocationFallback();
      setIsLoadingLocation(false);
    }
  };

  const handleLocationDeny = () => {
    setShowLocationModal(false);
    handleLocationFallback();
  };

  const handleLocationFallback = async () => {
    const fallbackCity = "San Jose";
    setUserLocation({
      lat: 37.3387,
      lng: -121.8853,
      city: fallbackCity,
    });
    const welcomeDb = createWelcomeAlert(fallbackCity, 37.3387, -121.8853);
    const welcome = transformAlert(welcomeDb, [], []);
    setWelcomeAlert(welcome);
    setSelectedAlert(welcome);

    // Load real alerts for fallback location
    try {
      const nearbyAlerts = await getNearbyAlerts(37.3387, -121.8853);
      let userVotes = { alertVotes: [], commentVotes: [] };
      if (user) {
        userVotes = await getUserVotes(user.id);
      }

      const transformedAlerts = nearbyAlerts.map((alert) =>
        transformAlert(alert, userVotes.alertVotes, userVotes.commentVotes),
      );

      setAlerts([welcome, ...transformedAlerts]);
    } catch (error) {
      console.error("Error loading fallback alerts:", error);
      setAlerts([welcome]);
    }
  };

  const recenterMap = () => {
    if (userLocation) {
      // In a real map implementation, this would recenter the map to user's location
      console.log("Recentering map to:", userLocation);
      // For now, just show a visual feedback
    }
  };

  const handleGetDirections = (destination: string) => {
    // Navigate to directions page with destination pre-filled
    window.location.href = `/directions?destination=${encodeURIComponent(destination)}`;
  };

  const toggleToAlerts = () => {
    setShowDirectionsFirst(false);
  };

  const toggleToDirections = () => {
    setShowDirectionsFirst(true);
  };

  const handleCardClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setShowEventModal(true);
  };

  const handleVote = async (alertId: string, voteType: "up" | "down") => {
    if (!isAuthenticated || !user) {
      setAuthPromptType("vote");
      setShowAuthPrompt(true);
      return;
    }

    // Skip voting on welcome alert
    if (alertId === "welcome") return;

    try {
      const success = await voteOnAlert(alertId, user.id, voteType);
      if (success) {
        // Update local state optimistically
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
      }
    } catch (error) {
      console.error("Error voting on alert:", error);
    }
  };

  const handleCommentVote = async (
    commentId: string,
    voteType: "up" | "down",
  ) => {
    if (!isAuthenticated || !user) {
      setAuthPromptType("vote");
      setShowAuthPrompt(true);
      return;
    }

    if (selectedAlert) {
      try {
        const success = await voteOnComment(commentId, user.id, voteType);
        if (success) {
          // Update local state optimistically
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
      } catch (error) {
        console.error("Error voting on comment:", error);
      }
    }
  };

  const handleAddComment = async (commentText: string) => {
    if (!isAuthenticated || !user) {
      setAuthPromptType("comment");
      setShowAuthPrompt(true);
      return;
    }

    if (selectedAlert && selectedAlert.id !== "welcome") {
      try {
        const comment = await addComment({
          alert_id: selectedAlert.id,
          user_id: user.id,
          content: commentText,
        });

        if (comment) {
          const newComment = {
            id: comment.id,
            user: comment.user_profile?.full_name || "You",
            text: comment.content,
            votes: comment.votes,
            avatar: comment.user_profile?.avatar_url || "/avatars/default.jpg",
            timeAgo: "Just now",
            userVote: null,
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
      } catch (error) {
        console.error("Error adding comment:", error);
      }
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
      {/* Map Section */}
      <div className="h-screen w-full bg-gradient-to-br from-green-100 to-blue-100 relative overflow-hidden">
        {/* Map UI Controls */}
        <div className="absolute top-4 left-4 z-20">
          <button className="bg-white rounded-full p-3 shadow-lg">
            <Home className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Alert indicator when there are nearby alerts */}
        {alerts.length > 1 && showDirectionsFirst && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={toggleToAlerts}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-lg transition-colors flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                {alerts.length - 1} alert{alerts.length > 2 ? "s" : ""} nearby
              </span>
            </button>
          </div>
        )}

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
                alert.type === "community" && "bg-blue-500",
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
            <ActionButtonTooltip tooltip="Get Directions" autoShow delay={3000}>
              <button
                onClick={() => (window.location.href = "/directions")}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors"
              >
                <Send className="h-6 w-6" />
              </button>
            </ActionButtonTooltip>

            <ActionButtonTooltip tooltip="Recenter Map" autoShow delay={4000}>
              <button
                onClick={recenterMap}
                className="bg-white hover:bg-gray-50 text-gray-700 rounded-full p-4 shadow-lg transition-colors"
              >
                <Target className="h-6 w-6" />
              </button>
            </ActionButtonTooltip>

            <ActionButtonTooltip tooltip="Add Alert" autoShow delay={5000}>
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

        {/* Bottom Sheet - Directions Card or Alerts */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          {showDirectionsFirst ? (
            <DirectionsCard
              userLocation={userLocation}
              onGetDirections={handleGetDirections}
            />
          ) : (
            <div className="bg-white rounded-t-3xl shadow-2xl">
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
                      {userLocation?.city || "San Jose"} • {alerts.length}{" "}
                      active
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleToDirections}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Get Directions
                    </button>
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
                                alert.type === "community" &&
                                  "bg-blue-100 text-blue-800",
                              )}
                            >
                              {alert.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {alert.location}
                          </p>
                          <p className="text-xs text-gray-500">
                            {alert.timeAgo}
                          </p>
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
          )}
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
