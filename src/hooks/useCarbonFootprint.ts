import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface CarbonFootprint {
  id: string;
  user_id: string;
  transport_mode: string;
  transport_distance: string;
  energy_usage: string;
  energy_renewable: boolean;
  waste_recycling: boolean;
  waste_composting: boolean;
  created_at: string;
  updated_at: string;
}

export function useCarbonFootprint() {
  const [carbonFootprint, setCarbonFootprint] = useState<CarbonFootprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCarbonFootprint() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        // Check if email is verified
        if (!user.email_confirmed_at) {
          throw new Error('Please verify your email address before accessing carbon footprint data');
        }

        const { data, error } = await supabase
          .from('carbon_footprints')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setCarbonFootprint(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch carbon footprint');
      } finally {
        setLoading(false);
      }
    }

    fetchCarbonFootprint();
  }, []);

  const updateCarbonFootprint = async (updates: Partial<CarbonFootprint>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Check if email is verified
      if (!user.email_confirmed_at) {
        throw new Error('Please verify your email address before updating your carbon footprint');
      }

      const { data, error } = await supabase
        .from('carbon_footprints')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setCarbonFootprint(data);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to update carbon footprint' };
    }
  };

  return { carbonFootprint, loading, error, updateCarbonFootprint };
}