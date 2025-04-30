import { WebDriver, By } from 'selenium-webdriver';
import { BasePage } from './base-page';

export class MenuPage extends BasePage {
  // Localizadores
  private addDrinkButton = By.xpath("//button[contains(.,'Add New Drink')]");
  private searchInput = By.css("input[placeholder='Search drinks...']");
  private tableRows = By.css("table tr.mat-row");
  private loadingSpinner = By.css(".loading-container mat-spinner");
  private titleHeader = By.css("h1");
  
  // Columnas de la tabla
  private nameColumn = (row: number) => By.css(`table tr.mat-row:nth-child(${row}) td:nth-child(2)`);
  private sizeColumn = (row: number) => By.css(`table tr.mat-row:nth-child(${row}) td:nth-child(3)`);
  private priceColumn = (row: number) => By.css(`table tr.mat-row:nth-child(${row}) td:nth-child(4)`);
  private viewDetailsButton = (row: number) => By.css(`table tr.mat-row:nth-child(${row}) button[mattooltip*='View details']`);
  
  constructor(driver: WebDriver) {
    // URL basada en localhost - ajustar según el entorno
    super(driver, 'http://localhost:4200/menu');
  }
  
  /**
   * Hace clic en el botón "Add New Drink"
   */
  async clickAddDrinkButton(): Promise<void> {
    await this.click(this.addDrinkButton);
  }
  
  /**
   * Filtra la tabla usando el campo de búsqueda
   * @param searchText - Texto de búsqueda
   */
  async filterTable(searchText: string): Promise<void> {
    await this.sendKeys(this.searchInput, searchText);
  }
  
  /**
   * Espera a que la tabla se cargue (desaparece el spinner)
   */
  async waitForTableLoad(): Promise<void> {
    // Esperar a que el spinner desaparezca si está presente
    try {
      await this.driver.wait(async () => {
        const spinners = await this.driver.findElements(this.loadingSpinner);
        return spinners.length === 0 || !(await spinners[0].isDisplayed());
      }, 10000);
    } catch (error) {
      // El spinner puede no aparecer si la carga es rápida
      console.log('No se encontró spinner de carga o ya desapareció');
    }
  }
  
  /**
   * Obtiene el título de la página
   */
  async getTitle(): Promise<string> {
    return await this.getText(this.titleHeader);
  }
  
  /**
   * Obtiene el número de filas en la tabla
   */
  async getRowCount(): Promise<number> {
    await this.waitForTableLoad();
    const rows = await this.findElements(this.tableRows);
    return rows.length;
  }
  
  /**
   * Obtiene el nombre de una bebida en una fila específica
   * @param rowIndex - Índice de la fila (empezando por 1)
   */
  async getDrinkNameAtRow(rowIndex: number): Promise<string> {
    return await this.getText(this.nameColumn(rowIndex));
  }
  
  /**
   * Obtiene el tamaño de una bebida en una fila específica
   * @param rowIndex - Índice de la fila (empezando por 1)
   */
  async getDrinkSizeAtRow(rowIndex: number): Promise<string> {
    return await this.getText(this.sizeColumn(rowIndex));
  }
  
  /**
   * Obtiene el precio de una bebida en una fila específica
   * @param rowIndex - Índice de la fila (empezando por 1)
   */
  async getDrinkPriceAtRow(rowIndex: number): Promise<string> {
    return await this.getText(this.priceColumn(rowIndex));
  }
  
  /**
   * Hace clic en el botón de detalles para una bebida específica
   * @param rowIndex - Índice de la fila (empezando por 1)
   */
  async viewDrinkDetails(rowIndex: number): Promise<void> {
    await this.click(this.viewDetailsButton(rowIndex));
  }
}