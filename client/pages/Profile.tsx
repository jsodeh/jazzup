import {
  ArrowLeft,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  CheckCircle,
  Star,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  return (
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
      <div className="bg-card p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Profile</h1>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-card p-6 border-b border-border">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-semibold text-foreground">
                John Doe
              </h2>
              <div className="bg-green-500/20 px-2 py-1 rounded-lg">
                <span className="text-xs font-medium text-green-500">
                  VERIFIED
                </span>
              </div>
            </div>
            <p className="text-muted-foreground mb-2">San Jose, CA</p>
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-foreground">
                4.8 Trust Score
              </span>
              <span className="text-xs text-muted-foreground">
                (127 reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">47</p>
            <p className="text-xs text-muted-foreground">Alerts Posted</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">89</p>
            <p className="text-xs text-muted-foreground">Verifications</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">156</p>
            <p className="text-xs text-muted-foreground">Helpful Votes</p>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="flex-1 p-4 space-y-2">
        <button className="w-full bg-card rounded-2xl p-4 flex items-center gap-3">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1 text-left">
            <p className="font-medium text-foreground">Notifications</p>
            <p className="text-sm text-muted-foreground">
              Manage alert preferences
            </p>
          </div>
        </button>

        <button className="w-full bg-card rounded-2xl p-4 flex items-center gap-3">
          <Shield className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1 text-left">
            <p className="font-medium text-foreground">Privacy & Safety</p>
            <p className="text-sm text-muted-foreground">
              Location and data settings
            </p>
          </div>
        </button>

        <button className="w-full bg-card rounded-2xl p-4 flex items-center gap-3">
          <Settings className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1 text-left">
            <p className="font-medium text-foreground">Settings</p>
            <p className="text-sm text-muted-foreground">
              App preferences and account
            </p>
          </div>
        </button>

        <button className="w-full bg-card rounded-2xl p-4 flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1 text-left">
            <p className="font-medium text-foreground">Help & Support</p>
            <p className="text-sm text-muted-foreground">
              FAQ and contact support
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
