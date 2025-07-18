import { useState } from "react";
import { MapPin, X, Shield, AlertTriangle } from "lucide-react";

interface LocationPermissionModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDeny: () => void;
}

export default function LocationPermissionModal({
  isOpen,
  onAccept,
  onDeny,
}: LocationPermissionModalProps) {
  const [isRequesting, setIsRequesting] = useState(false);

  if (!isOpen) return null;

  const handleAccept = async () => {
    setIsRequesting(true);
    await onAccept();
    setIsRequesting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Location Access Required
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Jazzup needs access to your location to show you relevant safety
            alerts and incidents in your area.
          </p>
        </div>

        {/* Benefits */}
        <div className="px-6 pb-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Personalized Safety Alerts
                </p>
                <p className="text-xs text-gray-600">
                  Get notifications about incidents near you
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Accurate Location Display
                </p>
                <p className="text-xs text-gray-600">
                  See your exact position on the map
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Emergency Features
                </p>
                <p className="text-xs text-gray-600">
                  Quickly share your location in emergencies
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="px-6 pb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 leading-relaxed">
              <span className="font-medium">Privacy:</span> Your location is
              only used to show relevant content and is never shared with other
              users without your permission.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-2 flex gap-3">
          <button
            onClick={onDeny}
            disabled={isRequesting}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Not Now
          </button>
          <button
            onClick={handleAccept}
            disabled={isRequesting}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isRequesting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Requesting...
              </>
            ) : (
              "Allow Location"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
