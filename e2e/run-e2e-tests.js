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

// Comando para ejecutar las pruebas
const command = 'ts-node';
const commandArgs = [
  '-P',
  path.join(__dirname, 'tsconfig.e2e.json'), // Ruta al tsconfig.e2e.json
  path.join(__dirname, testFile)
];

console.log('Comando completo:', command, commandArgs.join(' '));

// Ejecutar el comando
const child = spawn(command, commandArgs, {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  console.log(`Proceso terminado con código de salida ${code}`);
  process.exit(code);
});