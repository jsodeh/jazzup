import { useState } from "react";
import {
  ArrowLeft,
  Navigation,
  MapPin,
  Clock,
  Bus,
  Car,
  Footprints,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DirectionStep {
  id: string;
  instruction: string;
  distance: string;
  icon: "straight" | "left" | "right" | "bus" | "walk";
}

interface RouteOption {
  id: string;
  type: "driving" | "transit" | "walking";
  duration: string;
  distance: string;
  description: string;
  steps: DirectionStep[];
}

const mockRoutes: RouteOption[] = [
  {
    id: "1",
    type: "driving",
    duration: "12 min",
    distance: "3.2 miles",
    description: "Fastest route via Highway 101",
    steps: [
      {
        id: "1",
        instruction: "Head north on 1st Street toward E Santa Clara St",
        distance: "0.3 mi",
        icon: "straight",
      },
      {
        id: "2",
        instruction: "Turn right onto Highway 101 N",
        distance: "2.1 mi",
        icon: "right",
      },
      {
        id: "3",
        instruction: "Take exit 394 for Stevens Creek Blvd",
        distance: "0.8 mi",
        icon: "right",
      },
    ],
  },
  {
    id: "2",
    type: "transit",
    duration: "28 min",
    distance: "3.0 miles",
    description: "VTA Bus Route 22 + walking",
    steps: [
      {
        id: "1",
        instruction: "Walk to VTA Bus Stop on 1st St & Santa Clara",
        distance: "2 min walk",
        icon: "walk",
      },
      {
        id: "2",
        instruction: "Take Bus Route 22 toward Eastridge",
        distance: "18 min",
        icon: "bus",
      },
      {
        id: "3",
        instruction: "Get off at Stevens Creek & Winchester",
        distance: "8 min walk",
        icon: "walk",
      },
    ],
  },
  {
    id: "3",
    type: "walking",
    duration: "45 min",
    distance: "2.8 miles",
    description: "Walking route via downtown",
    steps: [
      {
        id: "1",
        instruction: "Head north on 1st Street",
        distance: "0.5 mi",
        icon: "straight",
      },
      {
        id: "2",
        instruction: "Turn right on San Fernando St",
        distance: "1.2 mi",
        icon: "right",
      },
      {
        id: "3",
        instruction: "Continue straight to destination",
        distance: "1.1 mi",
        icon: "straight",
      },
    ],
  },
];

export default function Directions() {
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>(
    mockRoutes[0],
  );
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const getRouteIcon = (type: RouteOption["type"]) => {
    switch (type) {
      case "driving":
        return <Car className="w-5 h-5" />;
      case "transit":
        return <Bus className="w-5 h-5" />;
      case "walking":
        return <Footprints className="w-5 h-5" />;
    }
  };

  const getStepIcon = (icon: DirectionStep["icon"]) => {
    switch (icon) {
      case "straight":
        return "↑";
      case "left":
        return "↰";
      case "right":
        return "↱";
      case "bus":
        return "🚌";
      case "walk":
        return "🚶";
    }
  };

  const startNavigation = () => {
    setIsNavigating(true);
    setCurrentStep(0);
  };

  if (isNavigating) {
    const currentStepData = selectedRoute.steps[currentStep];
    return (
      <div className="h-screen bg-background flex flex-col">
        {/* Status Bar */}
        <div className="h-11 bg-transparent flex items-center justify-between px-4 text-foreground text-sm font-medium">
          <span>12:22</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-foreground rounded-full"></div>
              <div className="w-1 h-3 bg-foreground rounded-full"></div>
              <div className="w-1 h-3 bg-foreground rounded-full"></div>
              <div className="w-1 h-3 bg-foreground/50 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Navigation Header */}
        <div className="bg-card p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => setIsNavigating(false)}
              className="p-2 -ml-2"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">
                Navigation
              </h1>
              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {selectedRoute.steps.length}
              </p>
            </div>
            <button className="p-2">
              <Phone className="w-5 h-5 text-alert" />
            </button>
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-alert text-alert-foreground p-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{getStepIcon(currentStepData.icon)}</div>
            <div className="flex-1">
              <p className="text-lg font-medium mb-1">
                {currentStepData.instruction}
              </p>
              <p className="text-alert-foreground/80">
                {currentStepData.distance}
              </p>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="flex-1 bg-map-bg relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-foreground">
              <Navigation className="w-16 h-16 mx-auto mb-4 text-alert" />
              <p className="text-lg font-medium">Navigation Active</p>
              <p className="text-sm text-muted-foreground">
                Following {selectedRoute.type} route
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="bg-card p-4 border-t border-border">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={cn(
                "px-4 py-2 rounded-xl font-medium",
                currentStep === 0
                  ? "bg-muted text-muted-foreground"
                  : "bg-secondary text-foreground",
              )}
            >
              Previous
            </button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-lg font-semibold text-foreground">
                {selectedRoute.duration}
              </p>
            </div>
            <button
              onClick={() =>
                setCurrentStep(
                  Math.min(selectedRoute.steps.length - 1, currentStep + 1),
                )
              }
              disabled={currentStep === selectedRoute.steps.length - 1}
              className={cn(
                "px-4 py-2 rounded-xl font-medium",
                currentStep === selectedRoute.steps.length - 1
                  ? "bg-muted text-muted-foreground"
                  : "bg-alert text-alert-foreground",
              )}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Status Bar */}
      <div className="h-11 bg-transparent flex items-center justify-between px-4 text-foreground text-sm font-medium">
        <span>12:22</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-foreground rounded-full"></div>
            <div className="w-1 h-3 bg-foreground rounded-full"></div>
            <div className="w-1 h-3 bg-foreground rounded-full"></div>
            <div className="w-1 h-3 bg-foreground/50 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-card p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">
              Directions
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose your route option
            </p>
          </div>
        </div>

        {/* From/To */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">From</p>
              <p className="text-foreground">Current Location</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-3 h-3 text-alert" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">To</p>
              <p className="text-foreground">Stevens Creek Boulevard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Route Options */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {mockRoutes.map((route) => (
          <button
            key={route.id}
            onClick={() => setSelectedRoute(route)}
            className={cn(
              "w-full bg-card rounded-2xl p-4 border-2 transition-colors",
              selectedRoute.id === route.id
                ? "border-alert"
                : "border-transparent",
            )}
          >
            <div className="flex items-center gap-3 mb-2">
              {getRouteIcon(route.type)}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">
                    {route.duration}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    • {route.distance}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {route.description}
                </p>
              </div>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* Steps Preview */}
            {selectedRoute.id === route.id && (
              <div className="mt-3 pt-3 border-t border-border space-y-2">
                {route.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-xs">
                      {getStepIcon(step.icon)}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm text-foreground">
                        {step.instruction}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {step.distance}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Start Navigation Button */}
      <div className="p-4 bg-card border-t border-border">
        <button
          onClick={startNavigation}
          className="w-full bg-alert text-alert-foreground py-4 rounded-2xl font-semibold text-lg"
        >
          Start Navigation
        </button>
      </div>
    </div>
  );
}
