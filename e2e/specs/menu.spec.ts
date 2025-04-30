import { By } from 'selenium-webdriver';
import { driver, takeScreenshotOnFailure } from '../helpers/spec-helper';
import { MenuPage } from '../pages/menu-page';
import { DrinkDialogPage } from '../pages/drink-dialog-page';

describe('Menu Component', () => {
  let menuPage: MenuPage;
  let drinkDialogPage: DrinkDialogPage;

  beforeAll(async () => {
    menuPage = new MenuPage(driver);
    drinkDialogPage = new DrinkDialogPage(driver);
  });

  beforeEach(async () => {
    // Navegar a la página del menú antes de cada prueba
    await menuPage.navigate();
    await menuPage.waitForPageLoad();
  });

  afterEach(async function(this: { currentTest?: { state: string; fullTitle: () => string } }) {
    // Tomar captura de pantalla en caso de fallo
    if (this.currentTest?.state === 'failed') {
      await takeScreenshotOnFailure(this.currentTest.fullTitle());
    }
  });

  it('debería mostrar el título correcto', async () => {
    const title = await menuPage.getTitle();
    expect(title).toEqual('VirtualCoffee Menu');
  });

  it('debería cargar la tabla de bebidas', async () => {
    await menuPage.waitForTableLoad();
    const rowCount = await menuPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  it('debería filtrar la tabla correctamente', async () => {
    await menuPage.waitForTableLoad();
    
    // Obtener el primer nombre de bebida
    const firstDrinkName = await menuPage.getDrinkNameAtRow(1);
    
    // Usar parte del nombre para filtrar
    const searchText = firstDrinkName.substring(0, 3);
    await menuPage.filterTable(searchText);
    
    // Verificar que el resultado contiene el texto buscado
    const filteredRowCount = await menuPage.getRowCount();
    expect(filteredRowCount).toBeGreaterThan(0);
    
    // Verificar que la primera fila contiene el texto buscado
    const filteredDrinkName = await menuPage.getDrinkNameAtRow(1);
    expect(filteredDrinkName.toLowerCase()).toContain(searchText.toLowerCase());
  });

  it('debería abrir el diálogo para añadir una nueva bebida', async () => {
    // Hacer clic en el botón "Add New Drink"
    await menuPage.clickAddDrinkButton();
    
    // Verificar que se abre el diálogo
    await drinkDialogPage.waitForDialogVisible();
    const dialogTitle = await drinkDialogPage.getDialogTitle();
    expect(dialogTitle).toEqual('Add New Drink');
  });

  it('debería cerrar el diálogo al hacer clic en cancelar', async () => {
    // Abrir el diálogo
    await menuPage.clickAddDrinkButton();
    await drinkDialogPage.waitForDialogVisible();
    
    // Cancelar
    await drinkDialogPage.clickCancel();
    
    // Verificar que el diálogo se cerró (esperando a que desaparezca)
    try {
      // Intentar obtener el título del diálogo - debería fallar si el diálogo se cerró
      await driver.wait(async () => {
        const elements = await driver.findElements(By.css(".dialog-header h2"));
        return elements.length === 0;
      }, 5000);
      
      // Si llegamos aquí, el diálogo se cerró correctamente
      expect(true).toBe(true);
    } catch (error) {
      // Si hay un error, significa que el diálogo no se cerró
      fail('El diálogo no se cerró al hacer clic en Cancelar');
    }
  });

  // Este test requiere que el backend esté funcionando o un mock adecuado
  it('debería añadir una nueva bebida al menú', async () => {
    // Guardar el número actual de filas
    await menuPage.waitForTableLoad();
    const initialRowCount = await menuPage.getRowCount();
    
    // Abrir el diálogo
    await menuPage.clickAddDrinkButton();
    await drinkDialogPage.waitForDialogVisible();
    
    // Completar y enviar el formulario
    const testDrinkName = `Test Coffee ${new Date().getTime()}`;
    await drinkDialogPage.addDrink(testDrinkName, 'Medium', '3.99');
    
    // Esperar a que se actualice la tabla
    await menuPage.waitForTableLoad();
    
    // Verificar que se añadió una nueva fila
    const newRowCount = await menuPage.getRowCount();
    
    // Esta verificación depende de cómo el backend responde
    // Podría requerir ajustes basados en la implementación real
    expect(newRowCount).toEqual(initialRowCount + 1);
  });
});