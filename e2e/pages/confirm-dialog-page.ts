// e2e/pages/confirm-dialog-page.ts
import { WebDriver, By } from 'selenium-webdriver';
import { BasePage } from './base-page';

export class ConfirmDialogPage extends BasePage {
  // Localizadores
  private dialogTitle = By.css("h2[mat-dialog-title]");
  private dialogMessage = By.css("mat-dialog-content p");
  private cancelButton = By.xpath("//button[contains(text(), 'Cancel')]");
  private confirmButton = By.xpath("//button[contains(text(), 'Confirm')]");
  private icon = By.css(".dialog-header mat-icon");
  
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
   * Obtiene el mensaje del diálogo
   */
  async getDialogMessage(): Promise<string> {
    return await this.getText(this.dialogMessage);
  }
  
  /**
   * Obtiene el icono del diálogo
   */
  async getDialogIcon(): Promise<string> {
    const iconElement = await this.findElement(this.icon);
    return await iconElement.getText();
  }
  
  /**
   * Hace clic en el botón de confirmar
   */
  async confirm(): Promise<void> {
    await this.click(this.confirmButton);
  }
  
  /**
   * Hace clic en el botón de cancelar
   */
  async cancel(): Promise<void> {
    await this.click(this.cancelButton);
  }
}