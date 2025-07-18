import { useState } from "react";
import { ArrowLeft, MapPin, Camera, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const alertTypes = [
  { id: "safety", label: "Safety Alert", icon: "🚨", color: "bg-red-500" },
  { id: "traffic", label: "Traffic Issue", icon: "🚗", color: "bg-yellow-500" },
  { id: "weather", label: "Weather Alert", icon: "⛈️", color: "bg-blue-500" },
  { id: "public", label: "Public Notice", icon: "📢", color: "bg-green-500" },
  { id: "crime", label: "Crime Report", icon: "🔒", color: "bg-purple-500" },
  { id: "emergency", label: "Emergency", icon: "🚑", color: "bg-red-600" },
];

export default function AddAlert() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Current Location");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedType || !title || !description) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate back or show success
      window.history.back();
    }, 2000);
  };

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
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">New Alert</h1>
            <p className="text-sm text-muted-foreground">
              Report an incident in your area
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Alert Type */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Alert Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {alertTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={cn(
                  "bg-card rounded-2xl p-4 border-2 transition-colors",
                  selectedType === type.id
                    ? "border-alert"
                    : "border-transparent",
                )}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <p className="text-sm font-medium text-foreground">
                    {type.label}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Location
          </label>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-alert" />
              <div className="flex-1">
                <p className="text-foreground">{location}</p>
                <p className="text-sm text-muted-foreground">
                  1st Street, San Jose, CA
                </p>
              </div>
              <button className="text-sm text-alert font-medium">Change</button>
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Alert Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief description of the incident"
            className="w-full bg-card rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-alert focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide more details about what happened..."
            rows={4}
            className="w-full bg-card rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-alert focus:border-transparent resize-none"
          />
        </div>

        {/* Media Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-card rounded-2xl p-4 border border-border flex items-center gap-3">
            <Camera className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Add Photo
            </span>
          </button>
          <button className="bg-card rounded-2xl p-4 border border-border flex items-center gap-3">
            <Mic className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Record Audio
            </span>
          </button>
        </div>

        {/* Privacy Notice */}
        <div className="bg-muted rounded-2xl p-4">
          <p className="text-sm text-muted-foreground">
            Your alert will be shared with the community for verification.
            Location data helps others understand the context and relevance.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="p-4 bg-card border-t border-border">
        <button
          onClick={handleSubmit}
          disabled={!selectedType || !title || !description || isSubmitting}
          className={cn(
            "w-full py-4 rounded-2xl font-semibold text-lg transition-colors",
            !selectedType || !title || !description || isSubmitting
              ? "bg-muted text-muted-foreground"
              : "bg-alert text-alert-foreground",
          )}
        >
          {isSubmitting ? "Publishing Alert..." : "Publish Alert"}
        </button>
      </div>
    </div>
  );
}
