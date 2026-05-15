import { useState, useEffect } from 'react';
import { teamService } from '../services/teamService';

export function useTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeams = () => {
    setLoading(true);
    teamService.getAll()
      .then((res) => setTeams(res.data.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return { teams, loading, error, setTeams, refetch: fetchTeams };
}
