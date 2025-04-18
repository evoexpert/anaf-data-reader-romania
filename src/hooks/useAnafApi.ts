
import { useState } from 'react';
import { AnafApiResponse } from '@/types/anaf';

const ANAF_API_URL = 'https://webservicesp.anaf.ro/PlatitorTvaRest/api/v8/ws/tva';

export const useAnafApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnafApiResponse | null>(null);

  const searchCompany = async (cui: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const response = await fetch(ANAF_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            cui,
            data: currentDate,
          },
        ]),
      });

      if (!response.ok) {
        throw new Error('Eroare la conectarea cu serverul ANAF');
      }

      const result: AnafApiResponse = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare neașteptată');
    } finally {
      setLoading(false);
    }
  };

  return { searchCompany, loading, error, data };
};
