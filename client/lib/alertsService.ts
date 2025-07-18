import { supabase } from "./supabase";
import type { Database } from "./supabase";

export type Alert = Database["public"]["Tables"]["alerts"]["Row"] & {
  comments?: Comment[];
  userVote?: "up" | "down" | null;
};

export type Comment = Database["public"]["Tables"]["comments"]["Row"] & {
  userVote?: "up" | "down" | null;
  user_profile?: {
    full_name: string;
    avatar_url?: string;
  };
};

export type AlertInsert = Database["public"]["Tables"]["alerts"]["Insert"];
export type CommentInsert = Database["public"]["Tables"]["comments"]["Insert"];

// Get alerts within a radius of a location
export async function getNearbyAlerts(
  latitude: number,
  longitude: number,
  radiusKm: number = 50,
): Promise<Alert[]> {
  try {
    const { data, error } = await supabase
      .from("alerts")
      .select(
        `
        *,
        comments(
          *,
          profiles:user_id(full_name, avatar_url)
        )
      `,
      )
      .eq("status", "active");

    if (error) throw error;

    // Filter by distance (simplified - in production you'd use PostGIS)
    const filtered = data?.filter((alert) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        alert.latitude,
        alert.longitude,
      );
      return distance <= radiusKm;
    });

    return filtered || [];
  } catch (error) {
    console.error("Error fetching nearby alerts:", error);
    return [];
  }
}

// Create a new alert
export async function createAlert(alert: AlertInsert): Promise<Alert | null> {
  try {
    const { data, error } = await supabase
      .from("alerts")
      .insert(alert)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating alert:", error);
    return null;
  }
}

// Vote on an alert
export async function voteOnAlert(
  alertId: string,
  userId: string,
  voteType: "up" | "down",
): Promise<boolean> {
  try {
    // Check if user already voted
    const { data: existingVote } = await supabase
      .from("alert_votes")
      .select("*")
      .eq("alert_id", alertId)
      .eq("user_id", userId)
      .single();

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Remove vote if same type
        await supabase
          .from("alert_votes")
          .delete()
          .eq("alert_id", alertId)
          .eq("user_id", userId);
      } else {
        // Update vote type
        await supabase
          .from("alert_votes")
          .update({ vote_type: voteType })
          .eq("alert_id", alertId)
          .eq("user_id", userId);
      }
    } else {
      // Create new vote
      await supabase.from("alert_votes").insert({
        alert_id: alertId,
        user_id: userId,
        vote_type: voteType,
      });
    }

    // Update alert votes count
    await updateAlertVoteCount(alertId);
    return true;
  } catch (error) {
    console.error("Error voting on alert:", error);
    return false;
  }
}

// Add comment to alert
export async function addComment(
  comment: CommentInsert,
): Promise<Comment | null> {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert(comment)
      .select(
        `
        *,
        profiles:user_id(full_name, avatar_url)
      `,
      )
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error adding comment:", error);
    return null;
  }
}

// Vote on a comment
export async function voteOnComment(
  commentId: string,
  userId: string,
  voteType: "up" | "down",
): Promise<boolean> {
  try {
    // Check if user already voted
    const { data: existingVote } = await supabase
      .from("comment_votes")
      .select("*")
      .eq("comment_id", commentId)
      .eq("user_id", userId)
      .single();

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Remove vote if same type
        await supabase
          .from("comment_votes")
          .delete()
          .eq("comment_id", commentId)
          .eq("user_id", userId);
      } else {
        // Update vote type
        await supabase
          .from("comment_votes")
          .update({ vote_type: voteType })
          .eq("comment_id", commentId)
          .eq("user_id", userId);
      }
    } else {
      // Create new vote
      await supabase.from("comment_votes").insert({
        comment_id: commentId,
        user_id: userId,
        vote_type: voteType,
      });
    }

    // Update comment votes count
    await updateCommentVoteCount(commentId);
    return true;
  } catch (error) {
    console.error("Error voting on comment:", error);
    return false;
  }
}

// Get user's votes for alerts and comments
export async function getUserVotes(userId: string) {
  try {
    const [alertVotes, commentVotes] = await Promise.all([
      supabase
        .from("alert_votes")
        .select("alert_id, vote_type")
        .eq("user_id", userId),
      supabase
        .from("comment_votes")
        .select("comment_id, vote_type")
        .eq("user_id", userId),
    ]);

    return {
      alertVotes: alertVotes.data || [],
      commentVotes: commentVotes.data || [],
    };
  } catch (error) {
    console.error("Error fetching user votes:", error);
    return { alertVotes: [], commentVotes: [] };
  }
}

// Helper function to update alert vote count
async function updateAlertVoteCount(alertId: string) {
  try {
    const { data: votes } = await supabase
      .from("alert_votes")
      .select("vote_type")
      .eq("alert_id", alertId);

    const upVotes = votes?.filter((v) => v.vote_type === "up").length || 0;
    const downVotes = votes?.filter((v) => v.vote_type === "down").length || 0;
    const totalVotes = upVotes - downVotes;

    await supabase
      .from("alerts")
      .update({ votes: totalVotes })
      .eq("id", alertId);
  } catch (error) {
    console.error("Error updating alert vote count:", error);
  }
}

// Helper function to update comment vote count
async function updateCommentVoteCount(commentId: string) {
  try {
    const { data: votes } = await supabase
      .from("comment_votes")
      .select("vote_type")
      .eq("comment_id", commentId);

    const upVotes = votes?.filter((v) => v.vote_type === "up").length || 0;
    const downVotes = votes?.filter((v) => v.vote_type === "down").length || 0;
    const totalVotes = upVotes - downVotes;

    await supabase
      .from("comments")
      .update({ votes: totalVotes })
      .eq("id", commentId);
  } catch (error) {
    console.error("Error updating comment vote count:", error);
  }
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Format time ago string
export function formatTimeAgo(date: string): string {
  const now = new Date();
  const alertDate = new Date(date);
  const diffMs = now.getTime() - alertDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

// Create welcome alert for user's location
export function createWelcomeAlert(
  city: string,
  lat: number,
  lng: number,
): Alert {
  return {
    id: "welcome",
    title: `Welcome to ${city}!`,
    description: `You're now viewing community safety alerts for ${city}. Stay informed about incidents, traffic, and important updates in your area.`,
    type: "community",
    latitude: lat,
    longitude: lng,
    address: city,
    user_id: "system",
    votes: 0,
    is_verified: true,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    comments: [],
  };
}
