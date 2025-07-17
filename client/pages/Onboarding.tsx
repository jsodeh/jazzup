import { useState } from "react";
import { ChevronRight, Shield, Users, MapPin, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  background: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to SafeAlert",
    description:
      "Your community-powered safety and navigation companion. Stay informed about incidents in your area and help keep your neighborhood safe.",
    icon: <Shield className="w-16 h-16 text-alert" />,
    background: "bg-gradient-to-br from-alert/20 to-alert/5",
  },
  {
    id: "community",
    title: "Community Driven",
    description:
      "Real people reporting real incidents. Get verified information from your neighbors and contribute to community safety.",
    icon: <Users className="w-16 h-16 text-blue-500" />,
    background: "bg-gradient-to-br from-blue-500/20 to-blue-500/5",
  },
  {
    id: "navigation",
    title: "Smart Navigation",
    description:
      "Get step-by-step directions with multiple transport options. Whether walking, driving, or taking public transit.",
    icon: <MapPin className="w-16 h-16 text-green-500" />,
    background: "bg-gradient-to-br from-green-500/20 to-green-500/5",
  },
  {
    id: "alerts",
    title: "Real-time Alerts",
    description:
      "Receive instant notifications about safety incidents, traffic updates, and important community announcements.",
    icon: <Bell className="w-16 h-16 text-purple-500" />,
    background: "bg-gradient-to-br from-purple-500/20 to-purple-500/5",
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const currentStepData = onboardingSteps[currentStep];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const isLastStep = currentStep === onboardingSteps.length - 1;

  return (
    <div className={cn("h-screen flex flex-col", currentStepData.background)}>
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

      {/* Progress Indicators */}
      <div className="flex justify-center gap-2 pt-8 pb-4">
        {onboardingSteps.map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index <= currentStep ? "bg-alert w-8" : "bg-muted w-2",
            )}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="mb-8">{currentStepData.icon}</div>

        <h1 className="text-3xl font-bold text-foreground mb-4">
          {currentStepData.title}
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
          {currentStepData.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="p-6 space-y-4">
        {isLastStep ? (
          <Link
            to="/setup"
            className="w-full bg-alert text-alert-foreground py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2"
          >
            Get Started
            <ChevronRight className="w-5 h-5" />
          </Link>
        ) : (
          <button
            onClick={nextStep}
            className="w-full bg-alert text-alert-foreground py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2"
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <Link
          to="/setup"
          className="w-full text-center py-4 text-muted-foreground font-medium"
        >
          Skip for now
        </Link>
      </div>

      {/* Home Indicator */}
      <div className="pb-2 flex justify-center">
        <div className="w-32 h-1 bg-foreground/20 rounded-full"></div>
      </div>
    </div>
  );
}
