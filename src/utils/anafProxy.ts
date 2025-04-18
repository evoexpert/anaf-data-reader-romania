
import axios from 'axios';

// URL-uri pentru proxy CORS
const CORS_ANYWHERE_URL = 'https://cors-anywhere.herokuapp.com/';
const CORSPROXY_IO_URL = 'https://corsproxy.io/?';
const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';

const ANAF_BASE_URL = 'https://webservicesp.anaf.ro/PlatitorTvaRest/api/v8/ws/tva';

export const anafProxy = async (cui: string, data: string) => {
  const isLovableEnvironment = window.location.hostname.includes('lovableproject.com') || 
                              window.location.hostname.includes('lovable.app');

  try {
    if (isLovableEnvironment) {
      console.log('Utilizăm proxy CORS pentru mediul Lovable...');
      
      // Încercăm prima metodă de proxy CORS (corsproxy.io)
      try {
        const encodedUrl = encodeURIComponent(ANAF_BASE_URL);
        const proxyUrl = `${CORSPROXY_IO_URL}${encodedUrl}`;
        
        console.log('Încercăm proxy via corsproxy.io:', proxyUrl);
        
        const response = await axios.post(proxyUrl, [{
          cui,
          data
        }], {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        console.log('Răspuns primit via corsproxy.io:', response.data);
        return response.data;
      } catch (error) {
        console.error('Eroare la prima metodă de proxy (corsproxy.io):', error);
        
        // Încercăm a doua metodă de proxy CORS (allorigins)
        try {
          const encodedUrl = encodeURIComponent(ANAF_BASE_URL);
          const proxyUrl = `${CORS_PROXY_URL}${encodedUrl}`;
          
          console.log('Încercăm proxy via allorigins:', proxyUrl);
          
          const response = await axios.post(proxyUrl, [{
            cui,
            data
          }], {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          
          console.log('Răspuns primit via allorigins:', response.data);
          return response.data;
        } catch (secondError) {
          console.error('Eroare la a doua metodă de proxy (allorigins):', secondError);
          throw new Error('Toate metodele de proxy CORS au eșuat. Încercați să rulați aplicația local.');
        }
      }
    } else {
      // Metodă standard pentru rulare locală
      const response = await axios.post(ANAF_BASE_URL, [{
        cui,
        data
      }], {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    }
  } catch (error) {
    console.error('Eroare în proxy ANAF:', error);
    throw error;
  }
};
