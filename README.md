# playwrigt_cucumber

Proyecto de pruebas end-to-end con **Playwright** + **Cucumber** + **TypeScript**.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
npm run install:browsers
```

## Estructura del proyecto

```
src/
├── features/            # Archivos .feature (Gherkin)
├── step-definitions/    # Implementación de los steps
├── support/
│   ├── world.ts         # CustomWorld (browser, context, page)
│   └── hooks.ts         # Before/After (lanza y cierra el navegador)
└── pages/                # Page objects
```

## Ejecutar las pruebas

```bash
npm test              # modo headless
npm run test:headed   # con navegador visible (HEADLESS=false)
```

Los reportes se generan en `reports/cucumber-report.html` y `reports/cucumber-report.json`.

## Integración continua (GitHub Actions)

El workflow [.github/workflows/tests.yml](.github/workflows/tests.yml) ejecuta la suite completa en cada `push`/`pull request` a `main` (y también puede lanzarse manualmente desde la pestaña *Actions*):

1. Checkout del repositorio
2. Instala Node.js 20 (con cache de `npm`)
3. `npm ci`
4. `npx playwright install --with-deps chromium`
5. `npm test`
6. Sube `reports/` como artefacto descargable (`cucumber-report`), incluso si la ejecución falla

Si tu rama principal se llama `master` en lugar de `main`, actualiza los `branches` del workflow.

## Configuración de VS Code (evitar "undefined step")

La extensión **Cucumber (Official)** (`CucumberOpen.cucumber-official`) resuelve los step definitions de forma independiente al `cucumber.js` usado por la CLI, así que necesita su propia configuración para no marcar los steps del `.feature` como "undefined-step".

La carpeta `.vscode/` está en `.gitignore` (no se versiona), así que cada quien debe crear localmente el archivo `.vscode/settings.json` con este contenido:

```json
{
  "cucumber.features": [
    "src/features/**/*.feature"
  ],
  "cucumber.glue": [
    "src/step-definitions/**/*.ts",
    "src/support/**/*.ts"
  ]
}
```

Estos globs son los mismos que usa `cucumber.js` (`paths` → `cucumber.features`, `require` → `cucumber.glue`), para mantener alineados la CLI y el editor.

Tras crear el archivo, recarga la ventana (`Developer: Reload Window`) para que la extensión detecte los cambios.
