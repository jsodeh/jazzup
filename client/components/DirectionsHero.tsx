import { useState } from "react";
import { Navigation, MapPin, Search, Clock, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DirectionsHeroProps {
  userLocation?: {
    lat: number;
    lng: number;
    city: string;
  } | null;
  onGetDirections?: (destination: string) => void;
}

export default function DirectionsHero({
  userLocation,
  onGetDirections,
}: DirectionsHeroProps) {
  const [destination, setDestination] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const quickDestinations = [
    { name: "Downtown", icon: "🏢" },
    { name: "Airport", icon: "✈️" },
    { name: "Hospital", icon: "🏥" },
    { name: "Mall", icon: "🛍️" },
  ];

  const handleGetDirections = () => {
    if (destination.trim()) {
      setIsAnimating(true);
      setTimeout(() => {
        onGetDirections?.(destination);
        setIsAnimating(false);
      }, 800);
    }
  };

  const handleQuickDestination = (dest: string) => {
    setDestination(dest);
    setIsAnimating(true);
    setTimeout(() => {
      onGetDirections?.(dest);
      setIsAnimating(false);
    }, 800);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 px-6 py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJtMzYgMzQgdjEwIGgxMCBWMzQgeiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-8 right-8 animate-pulse">
        <div className="w-4 h-4 bg-white/20 rounded-full"></div>
      </div>
      <div className="absolute bottom-12 left-8 animate-bounce">
        <Navigation className="w-6 h-6 text-white/30" />
      </div>

      <div className="relative max-w-md mx-auto text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Navigation className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Where to next?</h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            Get turn-by-turn directions with real-time safety alerts along your
            route
          </p>
        </div>

        {/* Current Location Display */}
        {userLocation && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 mb-6 flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <MapPin className="w-4 h-4 text-white/80" />
            <span className="text-white/90 text-sm font-medium">
              {userLocation.city}
            </span>
          </div>
        )}

        {/* Destination Input */}
        <div className="relative mb-6">
          <div className="relative">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where do you want to go?"
              className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-sm rounded-2xl text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-white/50 focus:outline-none font-medium"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Get Directions Button */}
          <button
            onClick={handleGetDirections}
            disabled={!destination.trim() || isAnimating}
            className={cn(
              "mt-4 w-full py-4 px-6 bg-white text-blue-600 rounded-2xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
              isAnimating && "scale-95",
              !isAnimating &&
                destination.trim() &&
                "hover:bg-blue-50 hover:scale-105 shadow-lg",
            )}
          >
            {isAnimating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                Getting directions...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Navigation className="w-5 h-5" />
                Get Directions
              </div>
            )}
          </button>
        </div>

        {/* Quick Destinations */}
        <div className="space-y-3 mb-6">
          <h3 className="text-white/80 text-sm font-medium">
            Quick destinations
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickDestinations.map((dest) => (
              <button
                key={dest.name}
                onClick={() => handleQuickDestination(dest.name)}
                className="bg-white/10 backdrop-blur-lg hover:bg-white/20 border border-white/20 rounded-xl p-4 text-left transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{dest.icon}</span>
                  <span className="text-white font-medium text-sm">
                    {dest.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="flex items-center justify-center gap-6 text-white/70 text-xs">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>Real-time</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            <span>Accurate</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Fast</span>
          </div>
        </div>
      </div>
    </div>
  );
}
