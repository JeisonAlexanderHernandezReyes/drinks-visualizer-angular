const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Verificar que existe la carpeta de screenshots
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Determinar qué prueba ejecutar
const args = process.argv.slice(2);
let testFile = 'specs/menu.spec.ts'; // Por defecto, ejecuta la prueba del menú

if (args.length > 0) {
  // Si se proporciona un argumento, asume que es el nombre del archivo de prueba
  const specFile = args[0];
  if (specFile) {
    if (specFile.endsWith('.ts')) {
      testFile = `specs/${specFile}`;
    } else {
      testFile = `specs/${specFile}.spec.ts`;
    }
  }
}

console.log(`Ejecutando prueba: ${testFile}`);

// Ruta al archivo tsconfig.e2e.json, relativa al directorio actual del script
const tsconfigPath = path.join(__dirname, 'tsconfig.e2e.json');

// Verificar que el archivo tsconfig.e2e.json existe
if (!fs.existsSync(tsconfigPath)) {
  console.error(`ERROR: No se encontró el archivo ${tsconfigPath}`);
  process.exit(1);
}

// Crear un archivo temporal que inicializa Jasmine y luego ejecuta el test
const tempFile = path.join(__dirname, '_temp-runner.ts');
const testFilePath = path.join(__dirname, testFile);

const tempContent = `
// Archivo temporal para inicializar Jasmine y ejecutar las pruebas
import { initializeJasmine } from './init-jasmine';

// Inicializar Jasmine
const jasmine = initializeJasmine();

// Importar y ejecutar el archivo de prueba
require('${testFilePath.replace(/\\/g, '\\\\')}');

// Ejecutar Jasmine
jasmine.execute();
`;

fs.writeFileSync(tempFile, tempContent);

// Comando para ejecutar las pruebas con el inicializador
const command = 'ts-node';
const commandArgs = [
  '-P',
  tsconfigPath,
  tempFile
];

console.log('Comando completo:', command, commandArgs.join(' '));

// Ejecutar el comando
const child = spawn(command, commandArgs, {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  // Eliminar el archivo temporal
  try {
    fs.unlinkSync(tempFile);
  } catch (err) {
    console.error('Error al eliminar archivo temporal:', err);
  }
  
  console.log(`Proceso terminado con código de salida ${code}`);
  process.exit(code);
});