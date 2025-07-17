import { useState } from "react";
import { X, MapPin, Bell, Shield, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "location" | "notification" | "emergency";
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

export default function PermissionModal({
  isOpen,
  onClose,
  type,
  onPermissionGranted,
  onPermissionDenied,
}: PermissionModalProps) {
  const [isRequesting, setIsRequesting] = useState(false);

  if (!isOpen) return null;

  const permissionConfig = {
    location: {
      icon: <MapPin className="w-12 h-12 text-blue-500" />,
      title: "Location Permission Required",
      description:
        "SafeAlert needs access to your location to show nearby alerts and provide accurate directions. Your location data is kept private and secure.",
      benefits: [
        "See alerts in your immediate area",
        "Get precise navigation directions",
        "Receive location-based safety notifications",
        "Help your community with accurate incident reporting",
      ],
      primaryAction: "Allow Location Access",
      secondaryAction: "Use Without Location",
    },
    notification: {
      icon: <Bell className="w-12 h-12 text-green-500" />,
      title: "Enable Push Notifications",
      description:
        "Stay informed about critical safety alerts, emergency situations, and important community updates in real-time.",
      benefits: [
        "Instant emergency alerts",
        "Real-time safety notifications",
        "Community updates and warnings",
        "Traffic and weather alerts",
      ],
      primaryAction: "Enable Notifications",
      secondaryAction: "Skip Notifications",
    },
    emergency: {
      icon: <Shield className="w-12 h-12 text-red-500" />,
      title: "Emergency Features",
      description:
        "Enable emergency features to quickly contact authorities and alert your emergency contacts during critical situations.",
      benefits: [
        "One-tap emergency calling",
        "Automatic location sharing",
        "Emergency contact notifications",
        "Silent alarm activation",
      ],
      primaryAction: "Enable Emergency Features",
      secondaryAction: "Set Up Later",
    },
  };

  const config = permissionConfig[type];

  const handlePrimaryAction = async () => {
    setIsRequesting(true);

    try {
      if (type === "location") {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            () => {
              onPermissionGranted?.();
              onClose();
            },
            () => {
              onPermissionDenied?.();
            },
          );
        }
      } else if (type === "notification") {
        if ("Notification" in window) {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            onPermissionGranted?.();
          } else {
            onPermissionDenied?.();
          }
          onClose();
        }
      } else if (type === "emergency") {
        // Emergency features setup
        onPermissionGranted?.();
        onClose();
      }
    } catch (error) {
      console.error("Permission request failed:", error);
      onPermissionDenied?.();
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSecondaryAction = () => {
    onPermissionDenied?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-3xl max-w-sm w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-muted/50"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-3xl flex items-center justify-center mx-auto mb-4">
              {config.icon}
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              {config.title}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {config.description}
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            {config.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-sm text-foreground">{benefit}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handlePrimaryAction}
              disabled={isRequesting}
              className={cn(
                "w-full py-4 rounded-2xl font-semibold text-lg transition-colors",
                isRequesting
                  ? "bg-muted text-muted-foreground"
                  : "bg-alert text-alert-foreground",
              )}
            >
              {isRequesting ? "Requesting..." : config.primaryAction}
            </button>
            <button
              onClick={handleSecondaryAction}
              className="w-full py-3 text-muted-foreground font-medium"
            >
              {config.secondaryAction}
            </button>
          </div>

          {/* Privacy Note */}
          <div className="mt-4 p-3 bg-muted/30 rounded-xl">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-muted-foreground mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Your privacy is protected. We only use this data to provide
                safety services and never share it with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
