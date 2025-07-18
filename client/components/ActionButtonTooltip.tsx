import { useState } from "react";
import { cn } from "@/lib/utils";

interface ActionButtonTooltipProps {
  children: React.ReactNode;
  tooltip: string;
  position?: "left" | "right";
  className?: string;
}

export default function ActionButtonTooltip({
  children,
  tooltip,
  position = "left",
  className,
}: ActionButtonTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onTouchStart={() => setIsVisible(true)}
      onTouchEnd={() => setTimeout(() => setIsVisible(false), 2000)}
    >
      {children}

      {isVisible && (
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-50 pointer-events-none",
            position === "left"
              ? "-left-2 -translate-x-full"
              : "-right-2 translate-x-full",
            className,
          )}
        >
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            {tooltip}

            {/* Arrow */}
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45",
                position === "left" ? "-right-1" : "-left-1",
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}
