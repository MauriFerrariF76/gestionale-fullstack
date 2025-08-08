// Test per verificare la mappatura dei campi cliente
const ts = require('ts-node');
ts.register();

const { mapClienteFields, mapClienteFieldsToFrontend } = require('./src/utils/fieldMapper.ts');

// Test dati dal frontend (PascalCase)
const frontendData = {
  RagioneSocialeC: "Test Cliente",
  Telefono: "123456789",
  IndirizzoC: "Via Test 123",
  CAPc: "12345",
  CITTAc: "Test City",
  PROVc: "TS",
  NAZc: "Italia",
  CodiceFiscale: "TSTCLT80A01H123X",
  PartitaIva: "12345678901"
};

console.log("=== Test Mappatura Frontend -> Backend ===");
console.log("Dati frontend:", frontendData);

const backendData = mapClienteFields(frontendData);
console.log("Dati backend:", backendData);

console.log("\n=== Test Mappatura Backend -> Frontend ===");
const frontendData2 = mapClienteFieldsToFrontend(backendData);
console.log("Dati frontend (roundtrip):", frontendData2);

console.log("\n=== Verifica Validazione ===");
console.log("ragioneSocialeC presente:", !!backendData.ragioneSocialeC);
console.log("telefono presente:", !!backendData.telefono);
