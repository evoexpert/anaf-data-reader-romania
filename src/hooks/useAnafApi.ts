
import { useState } from 'react';
import { AnafApiResponse } from '@/types/anaf';
import { toast } from '@/components/ui/sonner';

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
      
      // Adăugăm un timestamp pentru a evita cache-ul
      const url = `${ANAF_API_URL}?_ts=${Date.now()}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store',
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
      console.log("Date primite:", result);
      
      // Aici facem transformarea datelor pentru a se potrivi cu tipul AnafApiResponse
      setData(result);
      return result;
    } catch (err) {
      console.error("Eroare în timpul apelului API:", err);
      
      let errorMessage = err instanceof Error ? err.message : 'A apărut o eroare neașteptată';
      
      // Verificăm dacă eroarea este legată de CORS sau conexiune
      if (errorMessage.toLowerCase().includes('fetch') || errorMessage.includes('NetworkError')) {
        errorMessage = "Eroare de conexiune: Nu s-a putut contacta serverul ANAF prin proxy. Asigurați-vă că serverul de dezvoltare Vite rulează și că configurația proxy este corectă.";
      } else if (errorMessage.includes('JSON')) {
        errorMessage = "Eroare de formatare: Răspunsul de la serverul ANAF nu este în format JSON valid. Este posibil ca serviciul să fie indisponibil temporar sau proxy-ul să nu funcționeze corect.";
        toast.error("API-ul ANAF nu a răspuns corect. Încercați din nou mai târziu.");
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { searchCompany, loading, error, data };
};
