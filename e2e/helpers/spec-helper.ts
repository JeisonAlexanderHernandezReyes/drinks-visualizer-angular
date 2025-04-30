import { WebDriver } from 'selenium-webdriver';
import { SeleniumConfig } from '../config/selenium-config';
import { SpecReporter, StacktraceOption } from 'jasmine-spec-reporter';

// Aumentar el tiempo de espera predeterminado a 60 segundos
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

// Configurar los reportes de Jasmine
jasmine.getEnv().addReporter(
    new SpecReporter({
      spec: {
        displaySuccessful: true,
        displayFailed: true,
        displayPending: true,
        displayStacktrace: StacktraceOption.RAW,
      }
    })
  );

// Variables globales para las pruebas
let driver: WebDriver;

// Configuración antes de todas las pruebas
beforeAll(async () => {
  try {
    console.log('Inicializando WebDriver en beforeAll...');
    driver = await SeleniumConfig.setup('chrome');
    console.log('WebDriver inicializado correctamente en beforeAll');
    
    // Verificar que el driver está funcionando
    console.log('Verificando que el WebDriver responde...');
    await driver.getWindowHandle(); // Esto lanzará un error si el driver no está funcionando
    console.log('WebDriver respondiendo correctamente');
  } catch (error) {
    console.error('Error en beforeAll al inicializar el WebDriver:', error);
    throw error; // Re-lanzar para que Jasmine sepa que falló
  }
});

// Configuración después de todas las pruebas
afterAll(async () => {
  try {
    console.log('Cerrando WebDriver en afterAll...');
    await SeleniumConfig.teardown();
    console.log('WebDriver cerrado correctamente en afterAll');
  } catch (error) {
    console.error('Error en afterAll al cerrar el WebDriver:', error);
  }
});

// Función auxiliar para tomar capturas de pantalla en pruebas fallidas
async function takeScreenshotOnFailure(testName: string): Promise<void> {
  try {
    const screenshotName = `failure-${testName.replace(/\s+/g, '_')}`;
    await driver.takeScreenshot().then((image) => {
      require('fs').writeFileSync(
        `./screenshots/${screenshotName}.png`,
        image,
        'base64'
      );
    });
  } catch (error) {
    console.error('Error al tomar captura de pantalla:', error);
  }
}

// Exportar variables y funciones útiles
export {
  driver,
  takeScreenshotOnFailure
};