import { X, Shield, MessageCircle, ChevronUp, User } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: "vote" | "comment" | "profile" | "add_alert";
}

export default function AuthPromptModal({
  isOpen,
  onClose,
  trigger,
}: AuthPromptModalProps) {
  if (!isOpen) return null;

  const getContent = () => {
    switch (trigger) {
      case "vote":
        return {
          icon: <ChevronUp className="w-12 h-12 text-blue-500" />,
          title: "Verify Community Reports",
          description:
            "Help keep your community safe by verifying incident reports. Your vote helps others know which alerts are accurate.",
          benefits: [
            "Save favorite destinations for quick access",
            "Get personalized route recommendations",
            "Access to verified incident reports along routes",
            "Priority navigation and safety alerts",
          ],
        };
      case "comment":
        return {
          icon: <MessageCircle className="w-12 h-12 text-green-500" />,
          title: "Share Route Information",
          description:
            "Help other travelers by sharing real-time updates about road conditions and incidents along this route.",
          benefits: [
            "Help others plan safer routes",
            "Share real-time traffic updates",
            "Report road hazards and conditions",
            "Build community trust for better navigation",
          ],
        };
      case "add_alert":
        return {
          icon: <Shield className="w-12 h-12 text-red-500" />,
          title: "Report Route Hazards",
          description:
            "Help other travelers by reporting road hazards, traffic incidents, and route conditions that could affect navigation.",
          benefits: [
            "Help others avoid traffic jams",
            "Report road hazards and construction",
            "Share real-time route conditions",
            "Contribute to safer navigation for everyone",
          ],
        };
      case "profile":
      default:
        return {
          icon: <User className="w-12 h-12 text-purple-500" />,
          title: "Join Jazzup Community",
          description:
            "Create your profile to access all Jazzup features and get the best directions and safety updates for your area.",
          benefits: [
            "Save favorite destinations for quick access",
            "Get personalized route recommendations",
            "Access to verified incident reports along routes",
            "Priority navigation and safety alerts",
          ],
        };
    }
  };

  const content = getContent();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-3xl max-w-sm w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-3xl flex items-center justify-center mx-auto mb-4">
              {content.icon}
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              {content.title}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {content.description}
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <h3 className="font-medium text-foreground text-sm">
              What you can do:
            </h3>
            {content.benefits.map((benefit, index) => (
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
            <Link
              to="/setup"
              className="w-full bg-alert text-alert-foreground py-4 rounded-2xl font-semibold text-lg flex items-center justify-center transition-colors hover:bg-alert/90"
            >
              Get Started
            </Link>
            <button
              onClick={onClose}
              className="w-full py-3 text-muted-foreground font-medium hover:text-foreground transition-colors"
            >
              Continue browsing
            </button>
          </div>

          {/* Privacy Note */}
          <div className="mt-4 p-3 bg-muted/30 rounded-xl">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-muted-foreground mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Your privacy is protected. We only use your information to
                provide safety services and build community trust.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
