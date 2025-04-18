
import axios from 'axios';

const ANAF_BASE_URL = 'https://webservicesp.anaf.ro/PlatitorTvaRest/api/v8/ws/tva';

export const anafProxy = async (cui: string, data: string) => {
  try {
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
  } catch (error) {
    console.error('Eroare în proxy ANAF:', error);
    throw error;
  }
};
