import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, type Database } from "./supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) throw error;

    // Profile will be created via database trigger
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error("No user logged in");

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(data);
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Location Permission Hook
export const useLocationPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkPermission = async (): Promise<boolean> => {
    if (isChecking) return hasPermission ?? false;

    setIsChecking(true);
    try {
      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by this browser");
        setHasPermission(false);
        return false;
      }

      // Check if permission is already granted
      if ("permissions" in navigator) {
        const permission = await navigator.permissions.query({
          name: "geolocation" as PermissionName,
        });
        if (permission.state === "granted") {
          setHasPermission(true);
          return true;
        } else if (permission.state === "denied") {
          setHasPermission(false);
          return false;
        }
      }

      // For browsers that don't support permissions API or when state is 'prompt'
      return new Promise((resolve) => {
        const timeoutId = setTimeout(() => {
          console.warn("Location permission check timed out");
          setHasPermission(false);
          resolve(false);
        }, 5000);

        navigator.geolocation.getCurrentPosition(
          () => {
            clearTimeout(timeoutId);
            setHasPermission(true);
            resolve(true);
          },
          (error) => {
            clearTimeout(timeoutId);
            console.warn("Permission check failed:", error);
            setHasPermission(false);
            resolve(false);
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 600000,
          },
        );
      });
    } catch (error) {
      console.error("Error checking location permission:", error);
      setHasPermission(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const requestPermission = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by this browser");
        setHasPermission(false);
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        () => {
          console.log("Location permission granted");
          setHasPermission(true);
          resolve(true);
        },
        (error) => {
          let errorMessage = "Unknown geolocation error";
          switch (error.code) {
            case 1:
              errorMessage = "User denied location permission";
              break;
            case 2:
              errorMessage = "Location information unavailable";
              break;
            case 3:
              errorMessage = "Location request timed out";
              break;
          }

          console.warn("Location permission error:", {
            code: error.code,
            message: error.message,
            details: errorMessage,
          });

          setHasPermission(false);
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000,
        },
      );
    });
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return {
    hasPermission,
    requestPermission,
    checkPermission,
    isChecking,
  };
};

// Notification Permission Hook
export const useNotificationPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const checkPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      setHasPermission(false);
      return false;
    }

    const permission = Notification.permission === "granted";
    setHasPermission(permission);
    return permission;
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      setHasPermission(false);
      return false;
    }

    if (Notification.permission === "granted") {
      setHasPermission(true);
      return true;
    }

    if (Notification.permission === "denied") {
      setHasPermission(false);
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === "granted";
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      setHasPermission(false);
      return false;
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return {
    hasPermission,
    requestPermission,
    checkPermission,
  };
};
