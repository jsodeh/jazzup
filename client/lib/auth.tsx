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

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: userData.name,
          phone: userData.phone,
          trust_score: 0,
          is_verified: false,
          emergency_contact_name: userData.emergencyContact?.name || null,
          emergency_contact_phone: userData.emergencyContact?.phone || null,
          emergency_contact_relationship:
            userData.emergencyContact?.relationship || null,
        });

        if (profileError) {
          console.error("Error creating profile:", profileError);
          throw profileError;
        }
      }
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error("No authenticated user");

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) throw error;

      // Refresh profile
      await fetchProfile(user.id);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
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

// Hook for checking if user has location permission
export const useLocationPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkPermission = async () => {
    setIsChecking(true);
    try {
      if (!navigator.geolocation) {
        setHasPermission(false);
        return false;
      }

      // Check if permission is already granted
      if ("permissions" in navigator) {
        const permission = await navigator.permissions.query({
          name: "geolocation" as PermissionName,
        });
        const granted = permission.state === "granted";
        setHasPermission(granted);
        return granted;
      } else {
        // Fallback for browsers without permissions API
        return new Promise<boolean>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            () => {
              setHasPermission(true);
              resolve(true);
            },
            () => {
              setHasPermission(false);
              resolve(false);
            },
          );
        });
      }
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
      navigator.geolocation.getCurrentPosition(
        () => {
          setHasPermission(true);
          resolve(true);
        },
        () => {
          setHasPermission(false);
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
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
    isChecking,
    checkPermission,
    requestPermission,
  };
};

// Hook for notification permissions
export const useNotificationPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const checkPermission = () => {
    if (!("Notification" in window)) {
      setHasPermission(false);
      return false;
    }

    const granted = Notification.permission === "granted";
    setHasPermission(granted);
    return granted;
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
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
    checkPermission,
    requestPermission,
  };
};
