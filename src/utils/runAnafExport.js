
#!/usr/bin/env node

// Script pentru a rula exportul de date ANAF
// Folosiți: node runAnafExport.js <startCui> <endCui> <delayMs> <outputFile>

// Importăm modulul ts-node pentru a rula fișiere TypeScript
require('ts-node/register');

console.log('Inițializare script export ANAF...');

try {
  const { exportAnafDataToCsv } = require('./anafDataExport');

  // Parsăm argumentele de comandă
  const args = process.argv.slice(2);
  const startCui = parseInt(args[0] || '100000', 10);
  const endCui = parseInt(args[1] || '100100', 10);
  const delayMs = parseInt(args[2] || '1000', 10);
  const outputFile = args[3] || './anaf_data_export.csv';

  // Verificăm argumentele
  if (isNaN(startCui) || isNaN(endCui) || isNaN(delayMs)) {
    console.error('Eroare: Argumentele startCui, endCui și delayMs trebuie să fie numere.');
    process.exit(1);
  }

  // Afișăm configurația
  console.log('Configurație export ANAF:');
  console.log(`CUI de început: ${startCui}`);
  console.log(`CUI de sfârșit: ${endCui}`);
  console.log(`Întârziere între cereri: ${delayMs}ms`);
  console.log(`Fișier de ieșire: ${outputFile}`);
  console.log('');

  // Configurația pentru export
  const config = {
    startCui,
    endCui,
    delayBetweenRequests: delayMs,
    batchSize: 50,
    outputFilePath: outputFile
  };

  // Rulăm exportul
  console.log('Începe exportul...');
  exportAnafDataToCsv(config)
    .then(() => {
      console.log('Export finalizat cu succes');
      process.exit(0);
    })
    .catch(err => {
      console.error('Eroare în timpul exportului:', err);
      process.exit(1);
    });
} catch (error) {
  console.error('Eroare la inițializarea scriptului:', error);
  process.exit(1);
}
