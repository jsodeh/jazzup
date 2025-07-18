import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Navigation,
  MapPin,
  Clock,
  Bus,
  Car,
  Footprints,
  Search,
  Target,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";

type TravelMode = "driving" | "transit" | "walking";

interface DirectionResult {
  duration: string;
  distance: string;
  description: string;
  steps: string[];
}

export default function Directions() {
  const [searchParams] = useSearchParams();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedMode, setSelectedMode] = useState<TravelMode>("driving");
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<DirectionResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const destinationParam = searchParams.get("destination");
    if (destinationParam) {
      setDestination(destinationParam);
    }
  }, [searchParams]);

  const handleCalculateDirections = async () => {
    if (!origin.trim() || !destination.trim()) {
      setError("Please enter both starting point and destination");
      return;
    }

    setIsCalculating(true);
    setError("");

    try {
      // Simulate API call for directions
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock result for demonstration
      const mockResult: DirectionResult = {
        duration: "12 min",
        distance: "3.2 miles",
        description: `Fastest route from ${origin} to ${destination}`,
        steps: [
          `Head north from ${origin}`,
          "Turn right onto Highway 101 N",
          "Continue for 2.1 miles",
          "Take exit 394 for Stevens Creek Blvd",
          `Arrive at ${destination}`,
        ],
      };

      setResults(mockResult);
    } catch (err) {
      setError("Failed to calculate directions. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setOrigin("Current Location");
        },
        (error) => {
          setError("Could not get current location");
        },
      );
    } else {
      setError("Geolocation is not supported by this browser");
    }
  };

  const getModeIcon = (mode: TravelMode) => {
    switch (mode) {
      case "driving":
        return <Car className="w-5 h-5" />;
      case "transit":
        return <Bus className="w-5 h-5" />;
      case "walking":
        return <Footprints className="w-5 h-5" />;
    }
  };

  const getModeColor = (mode: TravelMode) => {
    switch (mode) {
      case "driving":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "transit":
        return "text-green-600 bg-green-50 border-green-200";
      case "walking":
        return "text-orange-600 bg-orange-50 border-orange-200";
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Directions</h1>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {!results ? (
          /* Input Form */
          <div className="p-6 space-y-6">
            {/* From Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">From</label>
              <div className="relative">
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Enter starting point"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button
                  onClick={useCurrentLocation}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Target className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* To Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">To</label>
              <div className="relative">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter destination"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Travel Mode Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Travel Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["driving", "transit", "walking"] as TravelMode[]).map(
                  (mode) => (
                    <button
                      key={mode}
                      onClick={() => setSelectedMode(mode)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 border rounded-lg transition-all",
                        selectedMode === mode
                          ? getModeColor(mode)
                          : "text-gray-600 bg-white border-gray-200 hover:bg-gray-50",
                      )}
                    >
                      {getModeIcon(mode)}
                      <span className="text-sm font-medium capitalize">
                        {mode}
                      </span>
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Calculate Button */}
            <button
              onClick={handleCalculateDirections}
              disabled={isCalculating || !origin.trim() || !destination.trim()}
              className="w-full bg-blue-600 text-white py-4 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCalculating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Calculating Route...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </>
              )}
            </button>

            {/* Quick Suggestions */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">
                Quick Suggestions
              </h3>
              <div className="space-y-2">
                {[
                  "Downtown San Jose",
                  "San Jose Airport",
                  "Stanford University",
                  "Santana Row",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setDestination(suggestion)}
                    className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {suggestion}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="flex flex-col h-full">
            {/* Route Summary */}
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setResults(null)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  ← Change Route
                </button>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {getModeIcon(selectedMode)}
                  <span className="capitalize">{selectedMode}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {results.description}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{results.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{results.distance}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Turn-by-turn Directions */}
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Turn-by-turn Directions
              </h3>
              <div className="space-y-4">
                {results.steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm text-gray-900">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Navigation Button */}
            <div className="p-6 bg-white border-t border-gray-200">
              <button className="w-full bg-orange-500 text-white py-4 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                Start Navigation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
