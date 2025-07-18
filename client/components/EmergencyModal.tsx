import { useState, useEffect } from "react";
import { X, Phone, Shield, MapPin, Users, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: "panic" | "manual" | "auto";
}

export default function EmergencyModal({
  isOpen,
  onClose,
  trigger,
}: EmergencyModalProps) {
  const [countdown, setCountdown] = useState(10);
  const [isActivated, setIsActivated] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || isActivated) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsActivated(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isActivated]);

  useEffect(() => {
    if (isOpen) {
      setCountdown(10);
      setIsActivated(false);
      setSelectedService(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const emergencyServices = [
    {
      id: "911",
      name: "Emergency Services",
      number: "911",
      description: "Police, Fire, Medical",
      icon: <Phone className="w-6 h-6" />,
      color: "bg-red-500",
    },
    {
      id: "police",
      name: "Police Non-Emergency",
      number: "(408) 277-8900",
      description: "San Jose Police Department",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-blue-500",
    },
    {
      id: "fire",
      name: "Fire Department",
      number: "(408) 535-7700",
      description: "San Jose Fire Department",
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "bg-orange-500",
    },
  ];

  const handleCall = (number: string) => {
    // In a real app, this would initiate a phone call
    if ("tel" in window) {
      window.location.href = `tel:${number}`;
    }
    setSelectedService(number);
  };

  const handleCancel = () => {
    setCountdown(0);
    setIsActivated(false);
    onClose();
  };

  if (isActivated) {
    return (
      <div className="fixed inset-0 bg-red-900/90 flex items-center justify-center p-4 z-50">
        <div className="bg-card rounded-3xl max-w-sm w-full p-6 text-center">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Shield className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">
            Emergency Activated
          </h2>
          <p className="text-muted-foreground mb-6">
            Your location has been shared with emergency services and your
            emergency contacts have been notified.
          </p>

          <div className="space-y-3 mb-6">
            {emergencyServices.map((service) => (
              <button
                key={service.id}
                onClick={() => handleCall(service.number)}
                className={cn(
                  "w-full p-4 rounded-2xl flex items-center gap-3 text-white",
                  service.color,
                )}
              >
                {service.icon}
                <div className="text-left">
                  <p className="font-semibold">{service.name}</p>
                  <p className="text-sm opacity-90">{service.number}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full bg-muted text-foreground py-3 rounded-2xl font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-red-900/90 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-3xl max-w-sm w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Emergency Alert</h2>
          <button
            onClick={handleCancel}
            className="p-2 rounded-full bg-muted/50"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Countdown */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 relative">
            <span className="text-3xl font-bold text-white">{countdown}</span>
            <div className="absolute inset-0 border-4 border-red-300 rounded-full animate-ping"></div>
          </div>
          <p className="text-foreground font-medium mb-2">
            Emergency services will be contacted in
          </p>
          <p className="text-sm text-muted-foreground">
            Tap cancel to stop the emergency alert
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 mb-4">
          <button
            onClick={() => setIsActivated(true)}
            className="w-full bg-red-500 text-white py-4 rounded-2xl font-semibold text-lg"
          >
            Call Emergency Services Now
          </button>
          <button
            onClick={handleCancel}
            className="w-full bg-muted text-foreground py-3 rounded-2xl font-medium"
          >
            Cancel Emergency Alert
          </button>
        </div>

        {/* Info */}
        <div className="bg-muted/30 rounded-xl p-3">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Your current location will be shared:
              </p>
              <p className="text-xs font-medium text-foreground">
                1st Street, San Jose, CA 95113
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
