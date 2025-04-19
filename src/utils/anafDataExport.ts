
import fs from 'fs';
import { anafProxy } from './anafProxy';
import { createObjectCsvWriter } from 'csv-writer';
import { CompanyFullData } from '@/types/anaf';

/**
 * Utilitar pentru extragerea datelor de la ANAF și exportarea în CSV
 * Notă: Acest script este destinat rulării într-un mediu Node.js, nu în browser.
 */

// Configurație pentru extragere
interface ExportConfig {
  startCui: number;           // CUI-ul de la care se începe extragerea
  endCui: number;             // CUI-ul la care se termină extragerea
  delayBetweenRequests: number; // Întârzierea între cereri în milisecunde (ex: 1000 = 1 secundă)
  batchSize: number;          // Numărul de cereri procesate înainte de a salva datele
  outputFilePath: string;     // Calea fișierului CSV de ieșire
}

// Funcție pentru a aștepta un interval de timp
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Funcție pentru a obține data curentă în format YYYY-MM-DD
const getCurrentDate = () => new Date().toISOString().split('T')[0];

/**
 * Exportă datele firmelor într-un fișier CSV
 * @param config Configurația pentru extragere
 */
export async function exportAnafDataToCsv(config: ExportConfig) {
  const { startCui, endCui, delayBetweenRequests, batchSize, outputFilePath } = config;
  
  console.log(`Începe extragerea datelor ANAF de la CUI ${startCui} până la ${endCui}`);
  console.log(`Datele vor fi salvate în ${outputFilePath}`);
  console.log(`Rata de extragere: o firmă la fiecare ${delayBetweenRequests}ms`);
  
  // Creăm writer-ul pentru CSV
  const csvWriter = createObjectCsvWriter({
    path: outputFilePath,
    header: [
      { id: 'cui', title: 'CUI' },
      { id: 'denumire', title: 'Denumire' },
      { id: 'adresa', title: 'Adresa' },
      { id: 'nrRegCom', title: 'Nr. Reg. Com.' },
      { id: 'telefon', title: 'Telefon' },
      { id: 'codPostal', title: 'Cod Poștal' },
      { id: 'stare', title: 'Stare Înregistrare' },
      { id: 'scpTVA', title: 'Înregistrat în scop de TVA' },
      { id: 'dataInceputTVA', title: 'Data Început TVA' },
      { id: 'dataSfarsitTVA', title: 'Data Sfârșit TVA' },
      { id: 'statusTvaIncasare', title: 'TVA la Încasare' },
      { id: 'statusInactivi', title: 'Inactiv' },
      { id: 'dataInactivare', title: 'Data Inactivare' },
      { id: 'dataReactivare', title: 'Data Reactivare' },
      { id: 'codCAEN', title: 'Cod CAEN' },
      { id: 'forma_juridica', title: 'Forma Juridică' },
      { id: 'statusSplitTVA', title: 'Split TVA' },
      // Adăugați mai multe câmpuri după necesități
    ],
    append: fs.existsSync(outputFilePath) // Adăugăm la fișier dacă există deja
  });
  
  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;
  let records: any[] = [];
  const currentDate = getCurrentDate();
  
  console.log(`Data pentru cereri: ${currentDate}`);
  console.log('Începe procesarea...');
  
  try {
    for (let cui = startCui; cui <= endCui; cui++) {
      try {
        // Solicită datele de la ANAF
        const cuiString = cui.toString();
        console.log(`Procesare CUI: ${cuiString}`);
        
        const result = await anafProxy(cuiString, currentDate);
        
        if (result && result.found && result.found.length > 0) {
          const company = result.found[0];
          
          // Transformă datele companiei pentru CSV
          const record = {
            cui: company.date_generale.cui,
            denumire: company.date_generale.denumire,
            adresa: company.date_generale.adresa,
            nrRegCom: company.date_generale.nrRegCom,
            telefon: company.date_generale.telefon,
            codPostal: company.date_generale.codPostal,
            stare: company.date_generale.stare_inregistrare,
            scpTVA: company.inregistrare_scop_Tva.scpTVA,
            dataInceputTVA: company.inregistrare_scop_Tva.perioade_TVA.length > 0 ? 
                           company.inregistrare_scop_Tva.perioade_TVA[0].data_inceput_ScpTVA : '',
            dataSfarsitTVA: company.inregistrare_scop_Tva.perioade_TVA.length > 0 ? 
                          company.inregistrare_scop_Tva.perioade_TVA[0].data_sfarsit_ScpTVA : '',
            statusTvaIncasare: company.inregistrare_RTVAI.statusTvaIncasare,
            statusInactivi: company.stare_inactiv.statusInactivi,
            dataInactivare: company.stare_inactiv.dataInactivare,
            dataReactivare: company.stare_inactiv.dataReactivare,
            codCAEN: company.date_generale.cod_CAEN,
            forma_juridica: company.date_generale.forma_juridica,
            statusSplitTVA: company.inregistrare_SplitTVA.statusSplitTVA,
            // Adăugați mai multe câmpuri după necesități
          };
          
          records.push(record);
          successCount++;
          console.log(`✅ Succes pentru CUI ${cuiString}: ${company.date_generale.denumire}`);
        } else {
          console.log(`ℹ️ Nu s-au găsit date pentru CUI ${cuiString}`);
        }
      } catch (error) {
        console.error(`❌ Eroare la procesarea CUI ${cui}:`, error);
        errorCount++;
      }
      
      processedCount++;
      
      // Salvează datele în batch-uri
      if (records.length >= batchSize) {
        await csvWriter.writeRecords(records);
        console.log(`✍️ Salvat batch de ${records.length} înregistrări în CSV`);
        records = [];
      }
      
      // Afișează statistici periodice
      if (processedCount % 100 === 0) {
        console.log(`--- Statistici: Procesate ${processedCount}, Succes ${successCount}, Erori ${errorCount} ---`);
      }
      
      // Așteaptă timpul specificat înainte de următoarea cerere
      await delay(delayBetweenRequests);
    }
    
    // Salvează orice înregistrări rămase
    if (records.length > 0) {
      await csvWriter.writeRecords(records);
      console.log(`✍️ Salvat ultimele ${records.length} înregistrări în CSV`);
    }
    
    console.log('\n=== EXTRAGERE FINALIZATĂ ===');
    console.log(`Total procesate: ${processedCount}`);
    console.log(`Succes: ${successCount}`);
    console.log(`Erori: ${errorCount}`);
    console.log(`Datele au fost salvate în: ${outputFilePath}`);
    
  } catch (error) {
    console.error('Eroare critică în timpul procesării:', error);
  }
}

/**
 * Exemplu de utilizare a funcției de export
 * Notă: Acest cod trebuie rulat într-un mediu Node.js, nu într-un browser.
 */
if (require.main === module) {
  // Configurație de exemplu - ajustați valorile după necesități
  const config: ExportConfig = {
    startCui: 100000,      // CUI de început
    endCui: 100100,        // CUI de sfârșit (pentru test, folosim doar 100)
    delayBetweenRequests: 1000, // 1 secundă între cereri
    batchSize: 10,         // Salvează după fiecare 10 înregistrări
    outputFilePath: './anaf_data_export.csv'
  };
  
  // Rulează exportul
  exportAnafDataToCsv(config)
    .then(() => console.log('Program terminat'))
    .catch(err => console.error('Eroare în program:', err));
}
