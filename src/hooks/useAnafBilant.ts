
import { useState } from 'react';
import { CompanyBalance } from '@/types/anafBilant';

const ANAF_BILANT_URL = '/api/anaf/bilant';

export const useAnafBilant = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CompanyBalance | null>(null);

  const getBalanceData = async (cui: string, year: number) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Se solicită bilanțul pentru CUI ${cui} și anul ${year}...`);
      const response = await fetch(`${ANAF_BILANT_URL}?an=${year}&cui=${cui}`);
      
      if (!response.ok) {
        throw new Error(`Eroare la conectarea cu serverul ANAF (Status: ${response.status})`);
      }

      const result = await response.json();
      console.log("Date bilanț primite:", result);
      setData(result);
    } catch (err) {
      console.error("Eroare în timpul apelului API bilanț:", err);
      let errorMessage = err instanceof Error ? err.message : 'A apărut o eroare neașteptată';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { getBalanceData, loading, error, data };
};
