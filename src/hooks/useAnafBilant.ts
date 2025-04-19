
import { useState } from 'react';
import { CompanyBalance } from '@/types/anafBilant';
import { toast } from '@/components/ui/sonner';
import axios from 'axios';

// URL-uri pentru proxy CORS
const CORS_PROXY_URL = 'https://corsproxy.io/?';
const ANAF_BILANT_URL = 'https://webservicesp.anaf.ro/bilant';

// Mock data pentru testare în mediul Lovable
const MOCK_BILANT_DATA = {
  "an": 2022,
  "cui": "12345678",
  "i": [
    { "indicator": "I1", "val_indicator": 1250000, "val_den_indicator": "Total active imobilizate" },
    { "indicator": "I2", "val_indicator": 895000, "val_den_indicator": "Total active circulante" },
    { "indicator": "I3", "val_indicator": 15000, "val_den_indicator": "Cheltuieli în avans" },
    { "indicator": "I4", "val_indicator": 350000, "val_den_indicator": "Datorii" },
    { "indicator": "I5", "val_indicator": 1810000, "val_den_indicator": "Capitaluri - total" },
    { "indicator": "I6", "val_indicator": 175000, "val_den_indicator": "Provizioane" },
    { "indicator": "I7", "val_indicator": 15000, "val_den_indicator": "Venituri în avans" },
    { "indicator": "I8", "val_indicator": 10000, "val_den_indicator": "Capital subscris vărsat" },
    { "indicator": "I9", "val_indicator": 0, "val_den_indicator": "Patrimoniul regiei" },
    { "indicator": "I10", "val_indicator": 350000, "val_den_indicator": "Patrimoniul public" },
    { "indicator": "I11", "val_indicator": 1500000, "val_den_indicator": "Cifra de afaceri netă" },
    { "indicator": "I13", "val_indicator": 1550000, "val_den_indicator": "Venituri din exploatare - total" },
    { "indicator": "I19", "val_indicator": 1250000, "val_den_indicator": "Cheltuieli de exploatare - total" },
    { "indicator": "I25", "val_indicator": 300000, "val_den_indicator": "Profit din exploatare" },
    { "indicator": "I27", "val_indicator": 1575000, "val_den_indicator": "Venituri totale" },
    { "indicator": "I28", "val_indicator": 1275000, "val_den_indicator": "Cheltuieli totale" },
    { "indicator": "I29", "val_indicator": 300000, "val_den_indicator": "Profit brut" },
    { "indicator": "I31", "val_indicator": 252000, "val_den_indicator": "Profit net" },
    { "indicator": "I33", "val_indicator": 25, "val_den_indicator": "Număr mediu de salariați" }
  ]
};

export const useAnafBilant = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CompanyBalance | null>(null);
  const isLovableEnvironment = window.location.hostname.includes('lovableproject.com') || 
                              window.location.hostname.includes('lovable.app');

  const getBalanceData = async (cui: string, year: number) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Se solicită bilanțul pentru CUI ${cui} și anul ${year}...`);
      
      // Pentru mediul Lovable, returnăm date mock
      if (isLovableEnvironment) {
        console.log('Utilizăm date mock pentru bilanț în mediul Lovable');
        
        // Simulăm o întârziere de rețea pentru a face experiența mai realistă
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Returnăm date mock ajustate pentru anul specificat
        const mockData = {
          ...MOCK_BILANT_DATA,
          an: year,
          cui: cui,
          // Ajustăm valorile pentru a varia în funcție de an
          i: MOCK_BILANT_DATA.i.map(item => ({
            ...item,
            val_indicator: Math.round(item.val_indicator * (0.8 + (year % 10) * 0.05))
          }))
        };
        
        console.log('Date mock bilanț generate:', mockData);
        setData(mockData);
        return mockData;
      }
      
      // În mediul local folosim proxy-ul configurat în vite.config.ts
      let url = `/api/anaf/bilant?an=${year}&cui=${cui}&_ts=${Date.now()}`;
      console.log('Solicitare bilanț prin proxy local:', url);
      
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
        errorMessage = "Eroare de formatare: Răspunsul de la serverul ANAF nu este în format JSON valid. Este posibil ca serviciul să fie indisponibil temporar.";
      }
      
      setError(errorMessage);
      
      // Dacă suntem în mediul Lovable și avem o eroare, returnăm date mock
      if (isLovableEnvironment) {
        console.log('Utilizăm date mock pentru bilanț după eroare în mediul Lovable');
        
        // Returnăm date mock ajustate pentru anul specificat
        const mockData = {
          ...MOCK_BILANT_DATA,
          an: year,
          cui: cui,
          // Ajustăm valorile pentru a varia în funcție de an
          i: MOCK_BILANT_DATA.i.map(item => ({
            ...item,
            val_indicator: Math.round(item.val_indicator * (0.8 + (year % 10) * 0.05))
          }))
        };
        
        console.log('Date mock bilanț generate după eroare:', mockData);
        setData(mockData);
        return mockData;
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getBalanceData, loading, error, data };
};
