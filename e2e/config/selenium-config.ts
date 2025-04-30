import { Builder, WebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as firefox from 'selenium-webdriver/firefox';

export class SeleniumConfig {
  private static driver: WebDriver | null;
  
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

    // Configurar opciones del navegador
    let options;
    
    switch (browser.toLowerCase()) {
      case 'chrome':
        options = new chrome.Options();
        // Puedes añadir opciones como headless, ventana maximizada, etc.
        // options.addArguments('--headless');
        options.addArguments('--window-size=1920,1080');
        
        this.driver = await new Builder()
          .forBrowser('chrome')
          .setChromeOptions(options)
          .build();
        break;
        
      case 'firefox':
        options = new firefox.Options();
        // options.addArguments('--headless');
        
        this.driver = await new Builder()
          .forBrowser('firefox')
          .setFirefoxOptions(options)
          .build();
        break;
        
      default:
        throw new Error(`Navegador '${browser}' no soportado`);
    }
    
    // Configurar timeouts
    await this.driver.manage().setTimeouts({
      implicit: 10000,      // Espera implícita
      pageLoad: 30000,      // Espera para cargar la página
      script: 30000         // Espera para scripts
    });
    
    return this.driver;
  }
  
  /**
   * Cierra el WebDriver
   */
  static async teardown(): Promise<void> {
    if (this.driver) {
      await this.driver.quit();
      this.driver = null;
    }
  }
}