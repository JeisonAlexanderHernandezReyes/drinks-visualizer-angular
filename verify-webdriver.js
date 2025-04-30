// Guardar este archivo como verify-webdriver.js y ejecutarlo con: node verify-webdriver.js

const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

async function verifyWebDriverSetup() {
  console.log('Verificando configuración de WebDriver...');
  
  // Verificar si chromedriver está instalado
  try {
    const chromedriverPath = require('chromedriver').path;
    console.log(`ChromeDriver encontrado en: ${chromedriverPath}`);
    
    if (fs.existsSync(chromedriverPath)) {
      console.log('✓ ChromeDriver es accesible');
    } else {
      console.error('✗ ChromeDriver NO es accesible en la ruta especificada');
      return false;
    }
  } catch (error) {
    console.error('✗ Error al buscar ChromeDriver:', error.message);
    console.log('Recomendación: Ejecuta "npm install chromedriver" para instalar ChromeDriver');
    return false;
  }
  
  // Verificar si se puede instanciar un WebDriver
  let driver = null;
  try {
    console.log('Intentando crear una instancia de WebDriver...');
    
    const options = new chrome.Options();
    options.addArguments('--window-size=1200,800');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
      
    console.log('✓ WebDriver creado exitosamente');
    
    // Intentar navegar a una página
    console.log('Intentando navegar a google.com...');
    await driver.get('https://www.google.com');
    console.log('✓ Navegación exitosa');
    
    // Verificar aplicación Angular
    console.log('Verificando si la aplicación Angular está en ejecución...');
    try {
      await driver.get('http://localhost:4200');
      console.log('✓ Aplicación Angular accesible en http://localhost:4200');
    } catch (error) {
      console.error('✗ No se pudo acceder a la aplicación Angular en http://localhost:4200');
      console.log('Recomendación: Ejecuta "ng serve" en otra terminal');
    }
    
    return true;
  } catch (error) {
    console.error('✗ Error al crear o usar WebDriver:', error.message);
    return false;
  } finally {
    if (driver) {
      console.log('Cerrando WebDriver...');
      await driver.quit();
    }
  }
}

// Ejecutar verificación
verifyWebDriverSetup().then(success => {
  if (success) {
    console.log('\n✅ La configuración de WebDriver parece correcta. Deberías poder ejecutar las pruebas e2e.');
  } else {
    console.log('\n❌ Se detectaron problemas con la configuración de WebDriver. Revisa los errores anteriores.');
  }
});