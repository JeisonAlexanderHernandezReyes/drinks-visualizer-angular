import { Builder, WebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as firefox from 'selenium-webdriver/firefox';
import * as path from 'path';
import * as fs from 'fs';

export class SeleniumConfig {
  private static driver: WebDriver | null = null;
  
  /**
   * Inicializa y configura el WebDriver
   * @param browser - El navegador a usar ('chrome' o 'firefox')
   * @returns WebDriver instancia
   */
  static async setup(browser: string = 'chrome'): Promise<WebDriver> {
    // Si ya hay un driver activo, lo devuelve
    if (this.driver) {
      return this.driver;
    }

    console.log(`Configurando WebDriver para ${browser}...`);

    try {
      // Opciones del navegador
      switch (browser.toLowerCase()) {
        case 'chrome':
          // Verificar ubicación de chromedriver
          const chromeDriverPath = path.resolve(require.resolve('chromedriver'), '..', '..', '.bin', process.platform === 'win32' ? 'chromedriver.exe' : 'chromedriver');
          console.log(`Ruta del chromedriver: ${chromeDriverPath}`);
          
          if (fs.existsSync(chromeDriverPath)) {
            console.log('ChromeDriver encontrado en: ' + chromeDriverPath);
          } else {
            console.error('ChromeDriver no encontrado en: ' + chromeDriverPath);
          }

          // Configurar opciones de Chrome
          const options = new chrome.Options();
          options.addArguments('--window-size=1920,1080');
          options.addArguments('--no-sandbox');
          options.addArguments('--disable-dev-shm-usage');
          options.addArguments('--disable-extensions');
          options.addArguments('--disable-gpu');
          
          // Crear servicio de Chrome
          const chromeServiceBuilder = new chrome.ServiceBuilder(chromeDriverPath);
          
          // Construir WebDriver con service explícito
          console.log('Inicializando Chrome WebDriver...');
          this.driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .setChromeService(chromeServiceBuilder)
            .build();
            
          console.log('Chrome WebDriver inicializado correctamente');
          break;
          
        case 'firefox':
          // Configurar opciones de Firefox
          const firefoxOptions = new firefox.Options();
          firefoxOptions.addArguments('--width=1920', '--height=1080');
          
          console.log('Inicializando Firefox WebDriver...');
          this.driver = await new Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(firefoxOptions)
            .build();
            
          console.log('Firefox WebDriver inicializado correctamente');
          break;
          
        default:
          throw new Error(`Navegador '${browser}' no soportado`);
      }
      
      // Configurar timeouts
      console.log('Configurando timeouts del WebDriver...');
      await this.driver.manage().setTimeouts({
        implicit: 10000,
        pageLoad: 30000,
        script: 30000
      });
      
      console.log('WebDriver configurado correctamente');
      return this.driver;
      
    } catch (error) {
      console.error('Error al inicializar WebDriver:', error);
      throw error;  // Re-lanzar el error para mejor diagnóstico
    }
  }
  
  /**
   * Cierra el WebDriver
   */
  static async teardown(): Promise<void> {
    console.log('Cerrando WebDriver...');
    if (this.driver) {
      try {
        await this.driver.quit();
        this.driver = null;
        console.log('WebDriver cerrado correctamente');
      } catch (error) {
        console.error('Error al cerrar WebDriver:', error);
      }
    } else {
      console.log('No hay WebDriver activo para cerrar');
    }
  }
}