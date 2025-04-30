require('ts-node').register({
    project: require('path').join(__dirname, 'tsconfig.e2e.json'),
    transpileOnly: true,
    compilerOptions: {
        module: 'CommonJS'
    }
});

// Configurar Jasmine
const Jasmine = require('jasmine');
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

const jasmine = new Jasmine();

// Configurar el reporte
jasmine.env.clearReporters();
jasmine.env.addReporter(
    new SpecReporter({
        spec: {
            displaySuccessful: true,
            displayFailed: true,
            displayPending: true,
            displayStacktrace: 'raw'
        }
    })
);

// Ejecutar los tests
const testFile = process.argv[2] || 'specs/menu.spec.ts';
require(`./${testFile}`);

// Ejecutar Jasmine
jasmine.execute();