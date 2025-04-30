import { WebDriver, By } from 'selenium-webdriver';
import { BasePage } from './base-page';

export class DrinkDialogPage extends BasePage {
  // Localizadores
  private dialogTitle = By.css(".dialog-header h2");
  private nameInput = By.css("input[formcontrolname='name']");
  private sizeSelect = By.css("mat-select[formcontrolname='size']");
  private priceInput = By.css("input[formcontrolname='price']");
  private cancelButton = By.xpath("//button[text()='Cancel']");
  private submitButton = By.xpath("//button[contains(text(), 'Add') or contains(text(), 'Update')]");
  private nameError = By.css("mat-error");
  
  // Opciones de tamaño
  private sizeOption = (size: string) => By.xpath(`//mat-option/span[contains(text(), '${size}')]`);
  
  constructor(driver: WebDriver) {
    // No tiene URL específica ya que es un diálogo
    super(driver, '');
  }
  
  /**
   * Espera a que el diálogo esté visible
   */
  async waitForDialogVisible(): Promise<void> {
    await this.waitForElement(this.dialogTitle);
  }
  
  /**
   * Obtiene el título del diálogo
   */
  async getDialogTitle(): Promise<string> {
    return await this.getText(this.dialogTitle);
  }
  
  /**
   * Completa el formulario de bebida
   * @param name - Nombre de la bebida
   * @param size - Tamaño (Small, Medium, Large)
   * @param price - Precio
   */
  async fillDrinkForm(name: string, size: string, price: string): Promise<void> {
    // Completar nombre
    await this.sendKeys(this.nameInput, name);
    
    // Seleccionar tamaño
    await this.click(this.sizeSelect);
    await this.click(this.sizeOption(size));
    
    // Completar precio
    await this.sendKeys(this.priceInput, price);
  }
  
  /**
   * Hace clic en el botón de enviar (Add o Update)
   */
  async clickSubmit(): Promise<void> {
    await this.click(this.submitButton);
  }
  
  /**
   * Hace clic en el botón de cancelar
   */
  async clickCancel(): Promise<void> {
    await this.click(this.cancelButton);
  }
  
  /**
   * Verifica si hay errores de validación
   */
  async hasValidationErrors(): Promise<boolean> {
    const errors = await this.findElements(this.nameError);
    return errors.length > 0;
  }
  
  /**
   * Obtiene el mensaje de error para el campo nombre
   */
  async getNameErrorMessage(): Promise<string> {
    const errors = await this.findElements(this.nameError);
    if (errors.length > 0) {
      return await errors[0].getText();
    }
    return '';
  }
  
  /**
   * Completa y envía el formulario
   * @param name - Nombre de la bebida
   * @param size - Tamaño (Small, Medium, Large)
   * @param price - Precio
   */
  async addDrink(name: string, size: string, price: string): Promise<void> {
    await this.fillDrinkForm(name, size, price);
    await this.clickSubmit();
  }
}