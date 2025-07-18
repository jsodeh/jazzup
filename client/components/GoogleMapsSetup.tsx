import { useState, useEffect } from "react";
import { MapPin, Check, AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoogleMapsSetupProps {
  onComplete: (success: boolean) => void;
}

export default function GoogleMapsSetup({ onComplete }: GoogleMapsSetupProps) {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  // Simulate Google Maps API initialization
  useEffect(() => {
    const initializeGoogleMaps = async () => {
      try {
        // Simulate API loading
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Check if Google Maps is available (in real app, this would check for actual API)
        if (typeof window !== "undefined") {
          setStatus("success");
          onComplete(true);
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
        onComplete(false);
      }
    };

    initializeGoogleMaps();
  }, [onComplete]);

  const handleApiKeySubmit = async () => {
    if (!apiKey.trim()) return;

    setIsValidating(true);
    try {
      // Simulate API key validation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (apiKey.length > 30) {
        // Simulate successful validation
        setStatus("success");
        onComplete(true);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRetry = () => {
    setStatus("loading");
    setApiKey("");
    // Retry initialization after a short delay
    setTimeout(() => {
      setStatus("success");
      onComplete(true);
    }, 1000);
  };

  if (status === "loading") {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Initializing Maps
        </h3>
        <p className="text-muted-foreground text-sm">
          Setting up Google Maps integration...
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Maps Ready!
        </h3>
        <p className="text-muted-foreground text-sm">
          Google Maps integration is active and ready to use.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="py-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-500/5 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Maps Setup Required
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Enter your Google Maps API key to enable mapping features.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Google Maps API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSyB..."
              className="w-full bg-card rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-alert focus:border-transparent"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Get your API key from{" "}
              <a
                href="https://console.cloud.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-alert underline"
              >
                Google Cloud Console
              </a>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleApiKeySubmit}
              disabled={!apiKey.trim() || isValidating}
              className={cn(
                "flex-1 py-3 rounded-2xl font-semibold transition-colors",
                !apiKey.trim() || isValidating
                  ? "bg-muted text-muted-foreground"
                  : "bg-alert text-alert-foreground",
              )}
            >
              {isValidating ? "Validating..." : "Connect Maps"}
            </button>
            <button
              onClick={handleRetry}
              className="px-4 py-3 rounded-2xl bg-secondary text-foreground font-medium"
            >
              Skip
            </button>
          </div>
        </div>

        {/* Features that require Maps */}
        <div className="mt-6 p-4 bg-muted/30 rounded-2xl">
          <h4 className="font-medium text-foreground mb-2">
            Features requiring Maps:
          </h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Precise location-based alerts</li>
            <li>• Turn-by-turn navigation</li>
            <li>• Public transit integration</li>
            <li>• Street-level incident mapping</li>
          </ul>
        </div>
      </div>
    );
  }

  return null;
}
