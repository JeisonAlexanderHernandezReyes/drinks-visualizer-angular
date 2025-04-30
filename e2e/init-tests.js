require('ts-node').register({
    project: require('path').join(__dirname, 'tsconfig.e2e.json'),
    transpileOnly: true,
    compilerOptions: {
        module: 'CommonJS'
    }
});

// Configurar Jasmine
const Jasmine = require('jasmine');
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
const fs = require('fs');
const path = require('path');

// Asegurarse de que el directorio de screenshots existe
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
    console.log('Creando directorio de screenshots...');
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

console.log('------------------ Iniciando pruebas E2E ------------------');

// Configurar timeout global
const DEFAULT_TIMEOUT = 60000; // 60 segundos
console.log(`Jasmine timeout configurado a ${DEFAULT_TIMEOUT}ms`);

// Verificar que chromedriver está disponible
try {
    const chromedriverPath = require('chromedriver').path;
    if (fs.existsSync(chromedriverPath)) {
        console.log(`ChromeDriver encontrado en: ${chromedriverPath}`);
    } else {
        console.error(`ADVERTENCIA: ChromeDriver no encontrado en: ${chromedriverPath}`);
        console.log('Ejecutando: npm i chromedriver');
        require('child_process').execSync('npm i chromedriver', { stdio: 'inherit' });
    }
} catch (error) {
    console.error('Error al verificar ChromeDriver:', error.message);
    console.log('Instalando chromedriver con npm...');
    require('child_process').execSync('npm i chromedriver', { stdio: 'inherit' });
}

const jasmine = new Jasmine();

// Configurar el reporte
jasmine.env.clearReporters();
jasmine.env.addReporter(
    new SpecReporter({
        spec: {
            displaySuccessful: true,
            displayFailed: true,
            displayPending: true,
            displayStacktrace: 'raw'
        },
        summary: {
            displayDuration: true
        }
    })
);

// Ejecutar los tests
const testFile = process.argv[2] || 'specs/menu.spec.ts';
console.log(`Ejecutando archivo de prueba: ${testFile}`);

try {
    // Cargar el test
    console.log(`Cargando: ${testFile}`);
    require(`./${testFile}`);
    
    // Ejecutar Jasmine
    console.log('Iniciando ejecución de pruebas...');
    jasmine.execute();
} catch (error) {
    console.error('Error al cargar o ejecutar las pruebas:');
    console.error(error);
    process.exit(1);
}