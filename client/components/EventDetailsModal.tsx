import { useState } from "react";
import {
  X,
  ChevronUp,
  ChevronDown,
  Send,
  MapPin,
  Clock,
  User,
  Shield,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  title: string;
  location: string;
  timeAgo: string;
  votes: number;
  lat: number;
  lng: number;
  description: string;
  type: string;
  userVote?: "up" | "down" | null;
  comments: Comment[];
}

interface Comment {
  id: string;
  user: string;
  text: string;
  votes: number;
  avatar: string;
  timeAgo: string;
  userVote?: "up" | "down" | null;
}

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: Alert | null;
  onVote: (alertId: string, direction: "up" | "down") => void;
  onCommentVote: (commentId: string, direction: "up" | "down") => void;
  onAddComment: (alertId: string, comment: string) => void;
  onAuthRequired: () => void;
  isAuthenticated: boolean;
}

export default function EventDetailsModal({
  isOpen,
  onClose,
  alert,
  onVote,
  onCommentVote,
  onAddComment,
  onAuthRequired,
  isAuthenticated,
}: EventDetailsModalProps) {
  const [comment, setComment] = useState("");

  if (!isOpen || !alert) return null;

  const handleVote = (direction: "up" | "down") => {
    // Don't allow voting on welcome alert
    if (alert.id === "welcome") {
      return;
    }

    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }
    onVote(alert.id, direction);
  };

  const handleCommentVote = (commentId: string, direction: "up" | "down") => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }
    onCommentVote(commentId, direction);
  };

  const handleAddComment = () => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }
    if (comment.trim()) {
      onAddComment(alert.id, comment);
      setComment("");
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "safety":
        return "🚨";
      case "traffic":
        return "🚗";
      case "weather":
        return "⛈️";
      case "community":
        return "📢";
      case "crime":
        return "🔒";
      case "emergency":
        return "🚑";
      default:
        return "📍";
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case "safety":
      case "crime":
      case "emergency":
        return "text-red-500";
      case "traffic":
        return "text-yellow-500";
      case "weather":
        return "text-blue-500";
      case "community":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-card rounded-t-3xl w-full max-w-lg h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={cn("text-2xl", getAlertTypeColor(alert.type))}>
              {getAlertTypeIcon(alert.type)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Event Details
              </h2>
              <p className="text-sm text-muted-foreground">{alert.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Event Info */}
        <div className="p-4 border-b border-border">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-foreground mb-2">
              {alert.title}
            </h3>
            <p className="text-foreground mb-4">{alert.description}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{alert.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{alert.timeAgo}</span>
              </div>
            </div>
          </div>

          {/* Voting Section */}
          <div className="flex items-center justify-between bg-secondary rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">
                Community Verification
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVote("up")}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  alert.userVote === "up"
                    ? "bg-green-500 text-white"
                    : "bg-muted hover:bg-muted/80",
                )}
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <span className="text-lg font-bold text-foreground px-2">
                {alert.votes}
              </span>
              <button
                onClick={() => handleVote("down")}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  alert.userVote === "down"
                    ? "bg-red-500 text-white"
                    : "bg-muted hover:bg-muted/80",
                )}
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
            <h4 className="font-semibold text-foreground">
              Community Updates ({alert.comments.length})
            </h4>
          </div>

          <div className="space-y-3">
            {alert.comments.map((comment) => (
              <div key={comment.id} className="bg-secondary rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm">
                    {comment.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">
                        {comment.user}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {comment.timeAgo}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mb-2">
                      {comment.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCommentVote(comment.id, "up")}
                      className={cn(
                        "p-1 rounded transition-colors",
                        comment.userVote === "up"
                          ? "bg-green-500 text-white"
                          : "hover:bg-muted",
                      )}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium text-foreground px-1">
                      {comment.votes}
                    </span>
                    <button
                      onClick={() => handleCommentVote(comment.id, "down")}
                      className={cn(
                        "p-1 rounded transition-colors",
                        comment.userVote === "down"
                          ? "bg-red-500 text-white"
                          : "hover:bg-muted",
                      )}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {alert.comments.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  No community updates yet. Be the first to share information!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  isAuthenticated
                    ? "Share what you know about this incident..."
                    : "Sign in to share updates"
                }
                disabled={!isAuthenticated}
                className="w-full bg-secondary rounded-2xl px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground border-0 focus:outline-none focus:ring-2 focus:ring-alert disabled:opacity-50"
                onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                disabled={!comment.trim() || !isAuthenticated}
                className={cn(
                  "absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors",
                  comment.trim() && isAuthenticated
                    ? "text-alert hover:bg-alert/10"
                    : "text-muted-foreground",
                )}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="mt-3 p-3 bg-muted/30 rounded-xl">
              <p className="text-sm text-muted-foreground text-center">
                <button
                  onClick={onAuthRequired}
                  className="text-alert font-medium hover:underline"
                >
                  Sign in
                </button>{" "}
                to verify incidents and share community updates
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
