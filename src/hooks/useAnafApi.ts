
import { useState } from 'react';
import { AnafApiResponse } from '@/types/anaf';
import { toast } from '@/components/ui/sonner';
import { anafProxy } from '@/utils/anafProxy';

export const useAnafApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnafApiResponse | null>(null);
  const [isLovableEnvironment, setIsLovableEnvironment] = useState<boolean>(
    window.location.hostname.includes('lovableproject.com') || 
    window.location.hostname.includes('lovable.app')
  );

  const searchCompany = async (cui: string) => {
    setLoading(true);
    setError(null);
    
    // Verificăm dacă suntem în mediul Lovable
    if (isLovableEnvironment) {
      console.log("Rulăm în mediul Lovable - API-ul ANAF nu va funcționa fără un proxy adecvat");
      setLoading(false);
      toast.error("API-ul ANAF nu poate fi accesat direct din mediul Lovable");
      setError("API-ul ANAF nu poate fi accesat direct din mediul Lovable. Rulați aplicația local pentru testare completă.");
      return null;
    }

    try {
      console.log("Trimitem request către API-ul ANAF prin anafProxy...");
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Utilizăm funcția anafProxy
      const result = await anafProxy(cui, currentDate);
      console.log("Date primite:", result);
      
      setData(result);
      return result;
    } catch (err) {
      console.error("Eroare în timpul apelului API:", err);
      
      let errorMessage = err instanceof Error ? err.message : 'A apărut o eroare neașteptată';
      
      // Actualizăm mesajul de eroare să fie mai specific
      if (errorMessage.toLowerCase().includes('network') || errorMessage.includes('failed to fetch')) {
        errorMessage = "Eroare de conexiune: Nu s-a putut contacta serverul ANAF. " + 
                      "Verificați conexiunea la internet și asigurați-vă că serverul ANAF este disponibil.";
      } else if (errorMessage.includes('JSON')) {
        errorMessage = "Eroare de formatare: Răspunsul de la serverul ANAF nu este în format JSON valid. " + 
                      "Este posibil ca serviciul să fie indisponibil temporar.";
      }
      
      toast.error("Eroare: " + errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { searchCompany, loading, error, data, isLovableEnvironment };
};
