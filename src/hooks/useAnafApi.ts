
import { useState } from 'react';
import { AnafApiResponse } from '@/types/anaf';

// Înlocuim URL-ul direct cu proxy-ul configurat în Vite
const ANAF_API_URL = '/api/anaf/PlatitorTvaRest/api/v8/ws/tva';

export const useAnafApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnafApiResponse | null>(null);

  const searchCompany = async (cui: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Trimitem request către API-ul ANAF prin proxy...");
      const currentDate = new Date().toISOString().split('T')[0];
      const response = await fetch(ANAF_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Accept-Language': 'ro-RO,ro;q=0.9,en-US;q=0.8,en;q=0.7',
          'Connection': 'keep-alive'
        },
        body: JSON.stringify([
          {
            cui,
            data: currentDate,
          },
        ]),
      });

      console.log("Răspuns primit:", response);
      
      if (!response.ok) {
        throw new Error(`Eroare la conectarea cu serverul ANAF (Status: ${response.status})`);
      }

      const result: AnafApiResponse = await response.json();
      console.log("Date primite:", result);
      setData(result);
    } catch (err) {
      console.error("Eroare în timpul apelului API:", err);
      
      let errorMessage = err instanceof Error ? err.message : 'A apărut o eroare neașteptată';
      
      // Verificăm dacă eroarea este legată de CORS sau conexiune
      if (errorMessage.toLowerCase().includes('fetch') || errorMessage.includes('NetworkError')) {
        errorMessage = "Eroare de conexiune: Nu s-a putut contacta serverul ANAF prin proxy. Asigurați-vă că serverul de dezvoltare Vite rulează și că configurația proxy este corectă.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { searchCompany, loading, error, data };
};
