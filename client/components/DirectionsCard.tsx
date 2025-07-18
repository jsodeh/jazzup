import { useState } from "react";
import {
  Navigation,
  MapPin,
  Search,
  ArrowRight,
  Clock,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Add CSS for hiding scrollbar
const style = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = style;
  document.head.appendChild(styleElement);
}

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
  comments: any[];
}

interface DirectionsCardProps {
  userLocation?: {
    lat: number;
    lng: number;
    city: string;
  } | null;
  alerts?: Alert[];
  onGetDirections?: (destination: string) => void;
  onAlertClick?: (alert: Alert) => void;
}

export default function DirectionsCard({
  userLocation,
  alerts = [],
  onGetDirections,
  onAlertClick,
}: DirectionsCardProps) {
  const [destination, setDestination] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const quickDestinations = [
    "Downtown",
    "Airport",
    "Hospital",
    "Mall",
    "Gas Station",
    "Restaurant",
  ];

  const handleGetDirections = () => {
    if (destination.trim()) {
      onGetDirections?.(destination);
    }
  };

  const handleQuickDestination = (dest: string) => {
    setDestination(dest);
    onGetDirections?.(dest);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && destination.trim()) {
      handleGetDirections();
    }
  };

  return (
    <div className="bg-white rounded-t-3xl shadow-2xl">
      {/* Handle bar */}
      <div className="flex justify-center py-3">
        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
      </div>

      <div className="px-6 pb-6">
        {/* Alert Cards Section */}
        {alerts.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">
                {alerts.length} Alert{alerts.length > 1 ? "s" : ""} Nearby
              </h3>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
              {alerts
                .filter((alert) => alert.id !== "welcome")
                .map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => onAlertClick?.(alert)}
                    className="flex-shrink-0 bg-white border-2 border-gray-200 rounded-xl p-3 cursor-pointer hover:border-red-300 hover:shadow-md transition-all duration-200 w-64"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full mt-1 flex-shrink-0",
                          alert.type === "emergency" && "bg-red-500",
                          alert.type === "crime" && "bg-orange-500",
                          alert.type === "traffic" && "bg-yellow-500",
                          alert.type === "community" && "bg-blue-500",
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">
                          {alert.title}
                        </h4>
                        <p className="text-xs text-gray-600 truncate">
                          {alert.location}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">
                            {alert.timeAgo}
                          </span>
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
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Navigation className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              Need Directions?
            </h2>
            <p className="text-sm text-gray-600">
              {userLocation?.city || "Unknown location"}
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <div
            className={cn(
              "relative rounded-2xl border-2 transition-all duration-200",
              isFocused
                ? "border-blue-500 bg-blue-50/50"
                : "border-gray-200 bg-gray-50",
            )}
          >
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyPress={handleKeyPress}
              placeholder="Search destinations..."
              className="w-full pl-12 pr-16 py-4 bg-transparent text-gray-900 placeholder-gray-500 border-0 focus:ring-0 focus:outline-none font-medium text-lg"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            {destination.trim() && (
              <button
                onClick={handleGetDirections}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Destinations */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">
            Quick destinations
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {quickDestinations.slice(0, 6).map((dest) => (
              <button
                key={dest}
                onClick={() => handleQuickDestination(dest)}
                className="bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105"
              >
                <span className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  {dest}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-500">
            <Zap className="w-4 h-4" />
            <span className="text-sm">Real-time</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Accurate</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Fast</span>
          </div>
        </div>

        {/* Alternative access */}
        <div className="mt-4 text-center">
          <Link
            to="/directions"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Advanced directions options →
          </Link>
        </div>
      </div>
    </div>
  );
}
