import Jasmine from 'jasmine';
import { SpecReporter, StacktraceOption } from 'jasmine-spec-reporter';

// Exporta la función para inicializar Jasmine
export function initializeJasmine() {
  // Define jasmine globalmente
  const jasmine = new Jasmine({});
  (global as any).jasmine = jasmine;

  // Configura el reporter
  jasmine.clearReporters();
  jasmine.addReporter(
    new SpecReporter({
      spec: {
        displaySuccessful: true,
        displayFailed: true,
        displayPending: true,
        displayStacktrace: StacktraceOption.RAW,
      }
    })
  );

  return jasmine;
}