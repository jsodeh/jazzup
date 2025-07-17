import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  MapPin,
  Bell,
  Shield,
  User,
  Phone,
  Mail,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type SetupStep =
  | "location"
  | "notifications"
  | "account"
  | "emergency"
  | "preferences"
  | "complete";

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export default function Setup() {
  const [currentStep, setCurrentStep] = useState<SetupStep>("location");
  const [showPassword, setShowPassword] = useState(false);
  const [permissions, setPermissions] = useState({
    location: false,
    notifications: false,
  });
  const [accountData, setAccountData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>({
    name: "",
    phone: "",
    relationship: "",
  });
  const [alertPreferences, setAlertPreferences] = useState({
    safety: true,
    traffic: true,
    weather: true,
    community: false,
  });

  const requestLocationPermission = async () => {
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => {
            setPermissions((prev) => ({ ...prev, location: true }));
            setTimeout(() => setCurrentStep("notifications"), 1000);
          },
          () => {
            // Handle denial
            setPermissions((prev) => ({ ...prev, location: false }));
          },
        );
      }
    } catch (error) {
      console.error("Location permission error:", error);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        setPermissions((prev) => ({
          ...prev,
          notifications: permission === "granted",
        }));
        setTimeout(() => setCurrentStep("account"), 1000);
      }
    } catch (error) {
      console.error("Notification permission error:", error);
    }
  };

  const steps: Record<SetupStep, React.ReactNode> = {
    location: (
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

        {/* Progress */}
        <div className="flex justify-center gap-2 pt-8 pb-4">
          <div className="h-2 w-8 bg-alert rounded-full"></div>
          <div className="h-2 w-2 bg-muted rounded-full"></div>
          <div className="h-2 w-2 bg-muted rounded-full"></div>
          <div className="h-2 w-2 bg-muted rounded-full"></div>
          <div className="h-2 w-2 bg-muted rounded-full"></div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-alert/20 to-alert/5 rounded-3xl flex items-center justify-center mb-8">
            <MapPin className="w-12 h-12 text-alert" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">
            Enable Location Services
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-sm mb-8">
            We need your location to show nearby alerts and provide accurate
            directions. Your privacy is protected.
          </p>

          {permissions.location ? (
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
          ) : (
            <div className="space-y-4 w-full max-w-sm">
              <button
                onClick={requestLocationPermission}
                className="w-full bg-alert text-alert-foreground py-4 rounded-2xl font-semibold text-lg"
              >
                Allow Location Access
              </button>
              <button
                onClick={() => setCurrentStep("notifications")}
                className="w-full text-muted-foreground py-2"
              >
                Skip for now
              </button>
            </div>
          )}
        </div>
      </div>
    ),

    notifications: (
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

        {/* Progress */}
        <div className="flex justify-center gap-2 pt-8 pb-4">
          <div className="h-2 w-8 bg-alert rounded-full"></div>
          <div className="h-2 w-8 bg-alert rounded-full"></div>
          <div className="h-2 w-2 bg-muted rounded-full"></div>
          <div className="h-2 w-2 bg-muted rounded-full"></div>
          <div className="h-2 w-2 bg-muted rounded-full"></div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-3xl flex items-center justify-center mb-8">
            <Bell className="w-12 h-12 text-blue-500" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">
            Stay Informed
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-sm mb-8">
            Get instant alerts about safety incidents and important community
            updates in your area.
          </p>

          {permissions.notifications ? (
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
          ) : (
            <div className="space-y-4 w-full max-w-sm">
              <button
                onClick={requestNotificationPermission}
                className="w-full bg-alert text-alert-foreground py-4 rounded-2xl font-semibold text-lg"
              >
                Enable Notifications
              </button>
              <button
                onClick={() => setCurrentStep("account")}
                className="w-full text-muted-foreground py-2"
              >
                Skip for now
              </button>
            </div>
          )}
        </div>
      </div>
    ),

    account: (
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
        <div className="flex items-center px-4 py-4">
          <button
            onClick={() => setCurrentStep("notifications")}
            className="p-2 -ml-2"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex-1 text-center">
            <div className="flex justify-center gap-2">
              <div className="h-2 w-8 bg-alert rounded-full"></div>
              <div className="h-2 w-8 bg-alert rounded-full"></div>
              <div className="h-2 w-8 bg-alert rounded-full"></div>
              <div className="h-2 w-2 bg-muted rounded-full"></div>
              <div className="h-2 w-2 bg-muted rounded-full"></div>
            </div>
          </div>
          <div className="w-9"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-purple-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Create Account
            </h1>
            <p className="text-muted-foreground">
              Join the SafeAlert community
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={accountData.name}
                onChange={(e) =>
                  setAccountData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter your full name"
                className="w-full bg-card rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-alert focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={accountData.email}
                onChange={(e) =>
                  setAccountData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="your.email@example.com"
                className="w-full bg-card rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-alert focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={accountData.phone}
                onChange={(e) =>
                  setAccountData((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="(555) 123-4567"
                className="w-full bg-card rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-alert focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={accountData.password}
                  onChange={(e) =>
                    setAccountData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Create a secure password"
                  className="w-full bg-card rounded-2xl px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-alert focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Eye className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6">
          <button
            onClick={() => setCurrentStep("emergency")}
            disabled={
              !accountData.name || !accountData.email || !accountData.password
            }
            className={cn(
              "w-full py-4 rounded-2xl font-semibold text-lg",
              !accountData.name || !accountData.email || !accountData.password
                ? "bg-muted text-muted-foreground"
                : "bg-alert text-alert-foreground",
            )}
          >
            Continue
          </button>
        </div>
      </div>
    ),

    emergency: (
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
        <div className="flex items-center px-4 py-4">
          <button
            onClick={() => setCurrentStep("account")}
            className="p-2 -ml-2"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex-1 text-center">
            <div className="flex justify-center gap-2">
              <div className="h-2 w-8 bg-alert rounded-full"></div>
              <div className="h-2 w-8 bg-alert rounded-full"></div>
              <div className="h-2 w-8 bg-alert rounded-full"></div>
              <div className="h-2 w-8 bg-alert rounded-full"></div>
              <div className="h-2 w-2 bg-muted rounded-full"></div>
            </div>
          </div>
          <div className="w-9"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-500/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Emergency Contact
            </h1>
            <p className="text-muted-foreground">
              Add someone to notify in case of emergency
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Contact Name
              </label>
              <input
                type="text"
                value={emergencyContact.name}
                onChange={(e) =>
                  setEmergencyContact((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Emergency contact name"
                className="w-full bg-card rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-alert focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={emergencyContact.phone}
                onChange={(e) =>
                  setEmergencyContact((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                placeholder="(555) 123-4567"
                className="w-full bg-card rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-alert focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Relationship
              </label>
              <select
                value={emergencyContact.relationship}
                onChange={(e) =>
                  setEmergencyContact((prev) => ({
                    ...prev,
                    relationship: e.target.value,
                  }))
                }
                className="w-full bg-card rounded-2xl px-4 py-3 text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-alert focus:border-transparent"
              >
                <option value="">Select relationship</option>
                <option value="parent">Parent</option>
                <option value="spouse">Spouse/Partner</option>
                <option value="sibling">Sibling</option>
                <option value="friend">Friend</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 space-y-3">
          <button
            onClick={() => setCurrentStep("preferences")}
            className="w-full bg-alert text-alert-foreground py-4 rounded-2xl font-semibold text-lg"
          >
            Continue
          </button>
          <button
            onClick={() => setCurrentStep("preferences")}
            className="w-full text-muted-foreground py-2"
          >
            Skip for now
          </button>
        </div>
      </div>
    ),

    preferences: (
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
        <div className="flex items-center px-4 py-4">
          <button
            onClick={() => setCurrentStep("emergency")}
            className="p-2 -ml-2"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex-1 text-center">
            <div className="flex justify-center gap-2">
              <div className="h-2 w-8 bg-alert rounded-full"></div>
              <div className="h-2 w-8 bg-alert rounded-full"></div>
              <div className="h-2 w-8 bg-alert rounded-full"></div>
              <div className="h-2 w-8 bg-alert rounded-full"></div>
              <div className="h-2 w-8 bg-alert rounded-full"></div>
            </div>
          </div>
          <div className="w-9"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Bell className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Alert Preferences
            </h1>
            <p className="text-muted-foreground">
              Choose which types of alerts you want to receive
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                key: "safety" as keyof typeof alertPreferences,
                title: "Safety Alerts",
                description: "Crime, emergencies, and security incidents",
                icon: "🚨",
              },
              {
                key: "traffic" as keyof typeof alertPreferences,
                title: "Traffic Updates",
                description: "Road closures, accidents, and delays",
                icon: "🚗",
              },
              {
                key: "weather" as keyof typeof alertPreferences,
                title: "Weather Alerts",
                description: "Severe weather and natural disasters",
                icon: "⛈️",
              },
              {
                key: "community" as keyof typeof alertPreferences,
                title: "Community News",
                description: "Local events and neighborhood updates",
                icon: "📢",
              },
            ].map((alert) => (
              <div
                key={alert.key}
                className="bg-card rounded-2xl p-4 border border-border"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{alert.icon}</div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        {alert.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setAlertPreferences((prev) => ({
                        ...prev,
                        [alert.key]: !prev[alert.key],
                      }))
                    }
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative",
                      alertPreferences[alert.key] ? "bg-alert" : "bg-muted",
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5",
                        alertPreferences[alert.key]
                          ? "translate-x-6"
                          : "translate-x-0.5",
                      )}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6">
          <button
            onClick={() => setCurrentStep("complete")}
            className="w-full bg-alert text-alert-foreground py-4 rounded-2xl font-semibold text-lg"
          >
            Complete Setup
          </button>
        </div>
      </div>
    ),

    complete: (
      <div className="h-screen bg-gradient-to-br from-green-500/20 to-green-500/5 flex flex-col">
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

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <Check className="w-16 h-16 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">
            You're All Set!
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-sm mb-8">
            Welcome to SafeAlert! Your community safety network is now active.
            Start exploring alerts in your area.
          </p>

          <Link
            to="/"
            className="w-full max-w-sm bg-alert text-alert-foreground py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2"
          >
            Start Exploring
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    ),
  };

  return steps[currentStep];
}
