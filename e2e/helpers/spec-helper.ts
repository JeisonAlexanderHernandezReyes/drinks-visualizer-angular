import { WebDriver } from 'selenium-webdriver';
import { SeleniumConfig } from '../config/selenium-config';
import { SpecReporter, StacktraceOption } from 'jasmine-spec-reporter';

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
  // Puedes cambiar a 'firefox' si lo prefieres
  driver = await SeleniumConfig.setup('chrome');
});

// Configuración después de todas las pruebas
afterAll(async () => {
  await SeleniumConfig.teardown();
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