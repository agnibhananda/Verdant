import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Challenge, UserChallenge } from '../types/database';

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        // Fetch all challenges
        const { data: challengesData, error: challengesError } = await supabase
          .from('challenges')
          .select('*')
          .order('created_at', { ascending: false });

        if (challengesError) throw challengesError;
        setChallenges(challengesData);

        // Fetch user's challenges if logged in
        if (user) {
          const { data: userChallengesData, error: userChallengesError } = await supabase
            .from('user_challenges')
            .select('*')
            .eq('user_id', user.id);

          if (userChallengesError) throw userChallengesError;
          setUserChallenges(userChallengesData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch challenges');
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, []);

  const joinChallenge = async (challengeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_challenges')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;
      setUserChallenges([...userChallenges, data]);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to join challenge' };
    }
  };

  const updateChallengeProgress = async (userChallengeId: string, updates: Partial<UserChallenge>) => {
    try {
      const { data, error } = await supabase
        .from('user_challenges')
        .update(updates)
        .eq('id', userChallengeId)
        .select()
        .single();

      if (error) throw error;
      setUserChallenges(userChallenges.map(uc => 
        uc.id === userChallengeId ? data : uc
      ));
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to update challenge progress' };
    }
  };

  return {
    challenges,
    userChallenges,
    loading,
    error,
    joinChallenge,
    updateChallengeProgress
  };
}