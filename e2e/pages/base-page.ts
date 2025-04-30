import { WebDriver, WebElement, By, until } from 'selenium-webdriver';

export class BasePage {
  constructor(protected driver: WebDriver, private url: string) {}
  
  /**
   * Navega a la URL de la página
   */
  async navigate(): Promise<void> {
    await this.driver.get(this.url);
  }
  
  /**
   * Espera a que un elemento sea visible
   * @param locator - Localizador del elemento
   * @param timeout - Tiempo máximo de espera en ms
   */
  async waitForElement(locator: By, timeout: number = 10000): Promise<WebElement> {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }
  
  /**
   * Espera a que un elemento sea visible y clickeable
   * @param locator - Localizador del elemento
   * @param timeout - Tiempo máximo de espera en ms
   */
  async waitForClickable(locator: By, timeout: number = 10000): Promise<WebElement> {
    const element = await this.waitForElement(locator, timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    await this.driver.wait(until.elementIsEnabled(element), timeout);
    return element;
  }
  
  /**
   * Espera a que la página se cargue completamente
   */
  async waitForPageLoad(): Promise<void> {
    await this.driver.wait(async () => {
      const readyState = await this.driver.executeScript('return document.readyState');
      return readyState === 'complete';
    }, 30000);
  }
  
  /**
   * Encuentra un elemento
   * @param locator - Localizador del elemento
   */
  async findElement(locator: By): Promise<WebElement> {
    return await this.driver.findElement(locator);
  }
  
  /**
   * Encuentra múltiples elementos
   * @param locator - Localizador de los elementos
   */
  async findElements(locator: By): Promise<WebElement[]> {
    return await this.driver.findElements(locator);
  }
  
  /**
   * Hace click en un elemento
   * @param locator - Localizador del elemento
   */
  async click(locator: By): Promise<void> {
    const element = await this.waitForClickable(locator);
    await element.click();
  }
  
  /**
   * Introduce texto en un elemento
   * @param locator - Localizador del elemento
   * @param text - Texto a introducir
   */
  async sendKeys(locator: By, text: string): Promise<void> {
    const element = await this.waitForElement(locator);
    await element.clear();
    await element.sendKeys(text);
  }
  
  /**
   * Obtiene el texto de un elemento
   * @param locator - Localizador del elemento
   */
  async getText(locator: By): Promise<string> {
    const element = await this.waitForElement(locator);
    return await element.getText();
  }
  
  /**
   * Verifica si un elemento está visible
   * @param locator - Localizador del elemento
   */
  async isElementVisible(locator: By): Promise<boolean> {
    try {
      const element = await this.driver.findElement(locator);
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Toma una captura de pantalla
   * @param fileName - Nombre del archivo
   */
  async takeScreenshot(fileName: string): Promise<void> {
    const screenshot = await this.driver.takeScreenshot();
    const fs = require('fs');
    const path = require('path');
    
    // Crear directorio si no existe
    const dir = './screenshots';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    
    // Guardar screenshot
    fs.writeFileSync(
      path.join(dir, `${fileName}_${new Date().getTime()}.png`),
      screenshot,
      'base64'
    );
  }
}