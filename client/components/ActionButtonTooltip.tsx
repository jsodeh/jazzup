import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ActionButtonTooltipProps {
  children: React.ReactNode;
  tooltip: string;
  position?: "left" | "right";
  className?: string;
  autoShow?: boolean;
  delay?: number;
}

export default function ActionButtonTooltip({
  children,
  tooltip,
  position = "left",
  className,
  autoShow = false,
  delay = 3000,
}: ActionButtonTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAutoShown, setHasAutoShown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoShow && !hasAutoShown) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        setHasAutoShown(true);

        // Auto-hide after 2 seconds
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      }, delay);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [autoShow, delay, hasAutoShown]);

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleTouchStart = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setIsVisible(true);
  };

  const handleTouchEnd = () => {
    hideTimeoutRef.current = setTimeout(() => setIsVisible(false), 2000);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
