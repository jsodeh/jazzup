import { useState } from "react";
import { ArrowLeft, Shield, Phone, Mail, Camera, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type VerificationStep = "intro" | "phone" | "email" | "photo" | "complete";

export default function Verification() {
  const [currentStep, setCurrentStep] = useState<VerificationStep>("intro");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoneVerification = async () => {
    setIsSubmitting(true);
    // Simulate sending SMS code
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    // In real app, would send actual SMS
    setCurrentStep("email");
  };

  const handleEmailVerification = async () => {
    setIsSubmitting(true);
    // Simulate email verification
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setCurrentStep("photo");
  };

  const handlePhotoVerification = async () => {
    setIsSubmitting(true);
    // Simulate photo upload and verification
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setCurrentStep("complete");
  };

  const renderStep = () => {
    switch (currentStep) {
      case "intro":
        return (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center px-4 py-4">
              <Link to="/profile" className="p-2 -ml-2">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </Link>
              <h1 className="flex-1 text-center text-lg font-semibold text-foreground">
                Account Verification
              </h1>
              <div className="w-9"></div>
            </div>

            <div className="flex-1 px-6 py-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-12 h-12 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Verify Your Identity
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Help build trust in our community by verifying your account.
                  Verified users have more credibility when reporting incidents.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-card rounded-2xl p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        Phone Verification
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Verify your phone number via SMS
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        Email Verification
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Confirm your email address
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Camera className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        Photo Verification
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Take a selfie to verify your identity
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 rounded-2xl p-4 mb-8">
                <h4 className="font-medium text-foreground mb-2">
                  Benefits of verification:
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Higher trust score in community</li>
                  <li>• Priority alert notifications</li>
                  <li>• Access to verified-only discussions</li>
                  <li>• Enhanced profile badge</li>
                </ul>
              </div>
            </div>

            <div className="p-6">
              <button
                onClick={() => setCurrentStep("phone")}
                className="w-full bg-alert text-alert-foreground py-4 rounded-2xl font-semibold text-lg"
              >
                Start Verification
              </button>
            </div>
          </div>
        );

      case "phone":
        return (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center px-4 py-4">
              <button
                onClick={() => setCurrentStep("intro")}
                className="p-2 -ml-2"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <h1 className="flex-1 text-center text-lg font-semibold text-foreground">
                Phone Verification
              </h1>
              <div className="w-9"></div>
            </div>

            <div className="flex-1 px-6 py-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Verify Phone Number
                </h2>
                <p className="text-muted-foreground">
                  We'll send a verification code to your phone
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full bg-card rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-alert focus:border-transparent"
                  />
                </div>

                {phoneNumber && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="w-full bg-card rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-alert focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <button
                onClick={handlePhoneVerification}
                disabled={!phoneNumber || isSubmitting}
                className={cn(
                  "w-full py-4 rounded-2xl font-semibold text-lg",
                  !phoneNumber || isSubmitting
                    ? "bg-muted text-muted-foreground"
                    : "bg-alert text-alert-foreground",
                )}
              >
                {isSubmitting ? "Sending Code..." : "Send Verification Code"}
              </button>
            </div>
          </div>
        );

      case "email":
        return (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center px-4 py-4">
              <button
                onClick={() => setCurrentStep("phone")}
                className="p-2 -ml-2"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <h1 className="flex-1 text-center text-lg font-semibold text-foreground">
                Email Verification
              </h1>
              <div className="w-9"></div>
            </div>

            <div className="flex-1 px-6 py-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-10 h-10 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Confirm Email
                </h2>
                <p className="text-muted-foreground">
                  Check your email for a verification link
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full bg-card rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-alert focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="p-6">
              <button
                onClick={handleEmailVerification}
                disabled={!email || isSubmitting}
                className={cn(
                  "w-full py-4 rounded-2xl font-semibold text-lg",
                  !email || isSubmitting
                    ? "bg-muted text-muted-foreground"
                    : "bg-alert text-alert-foreground",
                )}
              >
                {isSubmitting ? "Verifying..." : "Verify Email"}
              </button>
            </div>
          </div>
        );

      case "photo":
        return (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center px-4 py-4">
              <button
                onClick={() => setCurrentStep("email")}
                className="p-2 -ml-2"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <h1 className="flex-1 text-center text-lg font-semibold text-foreground">
                Photo Verification
              </h1>
              <div className="w-9"></div>
            </div>

            <div className="flex-1 px-6 py-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-10 h-10 text-purple-500" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Take a Selfie
                </h2>
                <p className="text-muted-foreground">
                  Take a clear photo of yourself to complete verification
                </p>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border text-center mb-6">
                <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Camera will open for verification photo
                </p>
                <button className="bg-secondary text-foreground px-6 py-2 rounded-xl font-medium">
                  Open Camera
                </button>
              </div>

              <div className="bg-muted/30 rounded-2xl p-4">
                <h4 className="font-medium text-foreground mb-2">
                  Photo Guidelines:
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Look directly at the camera</li>
                  <li>• Ensure good lighting</li>
                  <li>• Remove sunglasses and hats</li>
                  <li>• Keep a neutral expression</li>
                </ul>
              </div>
            </div>

            <div className="p-6">
              <button
                onClick={handlePhotoVerification}
                disabled={isSubmitting}
                className={cn(
                  "w-full py-4 rounded-2xl font-semibold text-lg",
                  isSubmitting
                    ? "bg-muted text-muted-foreground"
                    : "bg-alert text-alert-foreground",
                )}
              >
                {isSubmitting ? "Processing..." : "Complete Verification"}
              </button>
            </div>
          </div>
        );

      case "complete":
        return (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-8">
              <Check className="w-16 h-16 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-4">
              Verification Complete!
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Your account is now verified. You'll see a verification badge on
              your profile and have access to enhanced features.
            </p>

            <Link
              to="/profile"
              className="w-full max-w-sm bg-alert text-alert-foreground py-4 rounded-2xl font-semibold text-lg"
            >
              Return to Profile
            </Link>
          </div>
        );
    }
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

      {renderStep()}
    </div>
  );
}
