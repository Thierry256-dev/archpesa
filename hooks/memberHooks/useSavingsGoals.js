import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export const useSavingsGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("savings_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = async (goalData) => {
    if (!user?.id) {
      Alert.alert("Error", "User not authenticated");
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("savings_goals")
        .insert([
          {
            user_id: user.id,
            goal_name: goalData.title,
            target_amount: parseFloat(goalData.targetAmount),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Optimistic update
      setGoals((prev) => [data, ...prev]);
      return true;
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to create goal");
      console.error("Error adding goal:", error);
      return false;
    }
  };

  return { goals, loading, addGoal, refreshGoals: fetchGoals };
};
