
import { useState } from 'react';
import { CompanyBalance } from '@/types/anafBilant';
import { toast } from '@/components/ui/sonner';

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
      
      // Adăugăm un timestamp pentru a evita cache-ul
      const url = `${ANAF_BILANT_URL}?an=${year}&cui=${cui}&_ts=${Date.now()}`;
      
      const response = await fetch(url);
      
      // Verificăm content type-ul pentru a ne asigura că primim JSON
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        console.error(`Răspuns non-JSON primit: ${contentType}`);
        
        // Pentru debugging, încercăm să citim text-ul răspunsului
        const textResponse = await response.text();
        console.error("Conținut răspuns:", textResponse.substring(0, 200) + "...");
        
        throw new Error('Răspuns invalid primit de la server. Serverul ANAF nu a returnat JSON valid.');
      }
      
      if (!response.ok) {
        throw new Error(`Eroare la conectarea cu serverul ANAF (Status: ${response.status})`);
      }

      const result = await response.json();
      console.log("Date bilanț primite:", result);
      setData(result);
      return result;
    } catch (err) {
      console.error("Eroare în timpul apelului API bilanț:", err);
      let errorMessage = err instanceof Error ? err.message : 'A apărut o eroare neașteptată';
      
      if (errorMessage.includes('JSON')) {
        errorMessage = "Eroare de formatare: Răspunsul de la serverul ANAF nu este în format JSON valid. Este posibil ca serviciul să fie indisponibil temporar sau proxy-ul să nu funcționeze corect.";
        toast.error("API-ul ANAF nu a răspuns corect. Încercați din nou mai târziu.");
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getBalanceData, loading, error, data };
};
