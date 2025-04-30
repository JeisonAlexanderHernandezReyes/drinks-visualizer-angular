// e2e/pages/search-page.ts
import { WebDriver, By } from 'selenium-webdriver';
import { BasePage } from './base-page';

export class SearchPage extends BasePage {
  // Localizadores
  private searchInput = By.css("input[formcontrolname='searchControl']");
  private clearButton = By.css("button[aria-label='Clear']");
  private loadingSpinner = By.css(".loading-container mat-spinner");
  private noResultsMessage = By.css(".no-results-container p");
  private errorMessage = By.css(".error-container p");
  private drinkCards = By.css(".drink-card");
  private drinkTitles = By.css(".drink-card mat-card-title");
  
  constructor(driver: WebDriver) {
    // URL basada en localhost - ajustar según el entorno
    super(driver, 'http://localhost:4200/search');
  }
  
  /**
   * Realiza una búsqueda
   * @param searchText - Texto de búsqueda
   */
  async search(searchText: string): Promise<void> {
    await this.sendKeys(this.searchInput, searchText);
    // Esperar a que se complete la búsqueda (con debounce)
    await this.waitForSearchResults();
  }
  
  /**
   * Limpia el campo de búsqueda
   */
  async clearSearch(): Promise<void> {
    try {
      const clearButtonExists = await this.isElementVisible(this.clearButton);
      if (clearButtonExists) {
        await this.click(this.clearButton);
      } else {
        // Si no hay botón de limpiar, limpia manualmente
        const searchField = await this.findElement(this.searchInput);
        await searchField.clear();
      }
    } catch (error) {
      console.error('Error al limpiar la búsqueda:', error);
    }
  }
  
  /**
   * Espera a que se muestren los resultados de la búsqueda
   */
  async waitForSearchResults(): Promise<void> {
    // Esperar a que el spinner desaparezca si está presente
    try {
      await this.driver.wait(async () => {
        const spinners = await this.driver.findElements(this.loadingSpinner);
        return spinners.length === 0 || !(await spinners[0].isDisplayed());
      }, 10000);
    } catch (error) {
      // El spinner puede no aparecer si la búsqueda es rápida
      console.log('No se encontró spinner de búsqueda o ya desapareció');
    }
  }
  
  /**
   * Verifica si hay resultados
   */
  async hasResults(): Promise<boolean> {
    const cards = await this.findElements(this.drinkCards);
    return cards.length > 0;
  }
  
  /**
   * Verifica si se muestra el mensaje de "sin resultados"
   */
  async hasNoResultsMessage(): Promise<boolean> {
    return await this.isElementVisible(this.noResultsMessage);
  }
  
  /**
   * Verifica si hay un mensaje de error
   */
  async hasErrorMessage(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }
  
  /**
   * Obtiene el mensaje de error
   */
  async getErrorMessage(): Promise<string> {
    if (await this.hasErrorMessage()) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }
  
  /**
   * Obtiene el número de tarjetas de bebidas encontradas
   */
  async getDrinkCardCount(): Promise<number> {
    const cards = await this.findElements(this.drinkCards);
    return cards.length;
  }
  
  /**
   * Obtiene los nombres de las bebidas encontradas
   */
  async getDrinkNames(): Promise<string[]> {
    const titleElements = await this.findElements(this.drinkTitles);
    const names: string[] = [];
    
    for (const element of titleElements) {
      names.push(await element.getText());
    }
    
    return names;
  }
  
  /**
   * Hace clic en una tarjeta de bebida específica
   * @param index - Índice de la tarjeta (empezando por 0)
   */
  async clickDrinkCard(index: number): Promise<void> {
    const cards = await this.findElements(this.drinkCards);
    if (index < cards.length) {
      await cards[index].click();
    } else {
      throw new Error(`No existe la tarjeta en el índice ${index}`);
    }
  }
}