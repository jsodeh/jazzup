import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronUp,
  ChevronDown,
  Home,
  Plus,
  User,
  MapPin,
  Target,
  Send,
  X,
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
  comments: Comment[];
}

interface Comment {
  id: string;
  user: string;
  text: string;
  votes: number;
  avatar: string;
  timeAgo: string;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    title: "Gun Shots Fired",
    location: "1st 2nd St, San Jose",
    timeAgo: "30min away · 10 min ago",
    votes: 84,
    lat: 37.3387,
    lng: -121.8853,
    comments: [
      {
        id: "1",
        user: "ALFRED",
        text: "Comment Text",
        votes: 7,
        avatar: "👨‍💼",
        timeAgo: "5min ago",
      },
      {
        id: "2",
        user: "ROBERT",
        text: "Police said no injuries",
        votes: 61,
        avatar: "👮‍♂️",
        timeAgo: "8min ago",
      },
      {
        id: "3",
        user: "HENRY",
        text: "Ut duis esse laboris pariatur magna aliqua minim aliquip",
        votes: 12,
        avatar: "👨",
        timeAgo: "12min ago",
      },
    ],
  },
];

export default function Index() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(
    mockAlerts[0],
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState("");

  const handleVote = (alertId: string, direction: "up" | "down") => {
    // Handle voting logic
    console.log(`Voting ${direction} on alert ${alertId}`);
  };

  const handleCommentVote = (commentId: string, direction: "up" | "down") => {
    // Handle comment voting logic
    console.log(`Voting ${direction} on comment ${commentId}`);
  };

  const submitComment = () => {
    if (comment.trim()) {
      // Add comment logic
      console.log("Adding comment:", comment);
      setComment("");
    }
  };

  return (
    <div className="h-screen bg-map-bg overflow-hidden relative">
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-11 bg-transparent flex items-center justify-between px-4 z-50 text-white text-sm font-medium">
        <span>12:22</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
          <div className="ml-2">
            <svg width="18" height="12" fill="white">
              <rect width="4" height="12" rx="1" />
              <rect x="6" width="4" height="8" rx="1" />
              <rect x="12" width="4" height="4" rx="1" />
            </svg>
          </div>
          <div className="ml-1 w-6 h-3 border border-white rounded-sm">
            <div className="w-4 h-1.5 bg-white rounded-sm m-0.5"></div>
          </div>
        </div>
      </div>

      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
        {/* Street Grid Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="rgb(180 150 100)"
                strokeWidth="1"
                opacity="0.4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Street Labels */}
        <div className="absolute top-20 left-8 text-map-label font-medium text-lg tracking-wide">
          JAPANTOWN
        </div>
        <div className="absolute top-32 left-12 text-map-label font-medium text-sm">
          N 1st St
        </div>
        <div className="absolute top-40 right-20 text-map-label font-medium text-sm">
          E Santa Clara St
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-map-label font-bold text-2xl">
          San Jose
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-map-label font-medium text-sm">
          DOWNTOWN
        </div>
        <div className="absolute bottom-1/3 left-1/3 mt-4 text-map-label font-medium text-sm">
          SAN JOSE
        </div>

        {/* Highway Markers */}
        <div className="absolute top-16 left-4 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
          480
        </div>
        <div className="absolute top-12 right-32 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
          101
        </div>
        <div className="absolute bottom-20 left-6 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
          280
        </div>
      </div>

      {/* Alert Markers */}
      <div className="absolute top-52 left-20">
        <div className="w-8 h-8 bg-alert rounded-full flex items-center justify-center shadow-lg">
          <MapPin className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-32 right-6 flex flex-col gap-3">
        <Link
          to="/directions"
          className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-lg border border-border"
        >
          <MapPin className="w-6 h-6 text-foreground" />
        </Link>
        <button className="w-12 h-12 bg-alert rounded-full flex items-center justify-center shadow-lg">
          <Target className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Bottom Sheet */}
      {selectedAlert && (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl transition-all duration-300",
            isExpanded ? "h-5/6" : "h-auto",
          )}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-muted rounded-full"></div>
          </div>

          {/* Alert Card */}
          <div className="px-4 pb-4">
            <div className="bg-secondary rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">
                    {selectedAlert.timeAgo}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {selectedAlert.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedAlert.location}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1 ml-4">
                  <button
                    onClick={() => handleVote(selectedAlert.id, "up")}
                    className="p-1"
                  >
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <span className="text-xl font-bold text-foreground">
                    {selectedAlert.votes}
                  </span>
                  <button
                    onClick={() => handleVote(selectedAlert.id, "down")}
                    className="p-1"
                  >
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expand/Collapse Toggle */}
            {!isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                className="w-full flex justify-center py-2"
              >
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="px-4 pb-24 flex-1 overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 p-2"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Comments */}
              <div className="space-y-3 mb-4">
                {selectedAlert.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-secondary rounded-2xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-lg">
                        {comment.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-foreground mb-1">
                          {comment.user}
                        </div>
                        <p className="text-sm text-foreground mb-2">
                          {comment.text}
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => handleCommentVote(comment.id, "up")}
                          className="p-1"
                        >
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <span className="text-sm font-semibold text-foreground">
                          {comment.votes}
                        </span>
                        <button
                          onClick={() => handleCommentVote(comment.id, "down")}
                          className="p-1"
                        >
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment Input */}
              <div className="relative">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Comment"
                  className="w-full bg-secondary rounded-2xl px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground border-2 border-alert focus:outline-none focus:ring-2 focus:ring-alert focus:border-transparent"
                />
                <button
                  onClick={submitComment}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                >
                  <Send className="w-5 h-5 text-alert" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-card border-t border-border">
        <div className="flex items-center justify-around h-full px-8">
          <button className="p-3">
            <Home className="w-6 h-6 text-foreground" />
          </button>
          <Link to="/add-alert" className="p-3">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </Link>
          <Link to="/profile" className="p-3">
            <User className="w-6 h-6 text-muted-foreground" />
          </Link>
        </div>
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>
      </div>
    </div>
  );
}
