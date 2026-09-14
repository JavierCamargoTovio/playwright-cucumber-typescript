# Plan de pruebas — Login SauceDemo

## 1. Objetivo

Verificar que el módulo de login de [SauceDemo](https://www.saucedemo.com/) permite el acceso con credenciales válidas y rechaza correctamente los accesos con credenciales inválidas, incompletas o de usuarios restringidos, mostrando en cada caso el resultado o mensaje de error esperado.

## 2. Alcance

**Incluye:**
- Autenticación en la pantalla de login (`https://www.saucedemo.com/`).
- Validación del acceso a la página de productos (`inventory.html`) tras un login exitoso.
- Validación de los mensajes de error mostrados ante credenciales inválidas o campos vacíos.

**No incluye:**
- Funcionalidad posterior al login (carrito, checkout, catálogo, logout).
- Pruebas de rendimiento o carga (`performance_glitch_user` no está cubierto en este plan).
- Pruebas visuales/pixel-perfect (`visual_user` no está cubierto en este plan).
- Pruebas de seguridad (inyección, fuerza bruta, rate limiting).

## 3. Estrategia y herramientas

| Aspecto | Detalle |
|---|---|
| Tipo de prueba | Funcional, automatizada, end-to-end |
| Framework | Playwright + Cucumber (BDD) + TypeScript |
| Navegador | Chromium (headless en CI, headed opcional en local) |
| Patrón de diseño | Page Object Model ([LoginPage.ts](src/pages/LoginPage.ts), [InventoryPage.ts](src/pages/InventoryPage.ts)) |
| Ubicación de los casos | [src/features/login.feature](src/features/login.feature) |
| Ejecución | Local (`npm test`) y en CI (GitHub Actions, ver [README](README.md#integración-continua-github-actions)) |
| Reporte | HTML/JSON generado por Cucumber, publicado en GitHub Pages tras cada ejecución en `main` |

## 4. Entorno de pruebas

- **URL bajo prueba:** `https://www.saucedemo.com/` (ambiente público de demo, sin necesidad de datos propios).
- **Usuarios de prueba** (provistos por el propio sitio, contraseña `secret_sauce` para todos):

| Usuario | Rol en las pruebas |
|---|---|
| `standard_user` | Usuario válido de referencia (ruta feliz) |
| `problem_user` | Usuario válido con comportamiento de UI defectuoso conocido |
| `locked_out_user` | Usuario bloqueado (caso negativo) |

## 5. Criterios de entrada y salida

**Entrada:**
- El sitio `saucedemo.com` está accesible públicamente.
- Las dependencias del proyecto están instaladas (`npm install`) y los navegadores de Playwright disponibles.

**Salida (éxito del ciclo de pruebas):**
- Los 9 escenarios de [login.feature](src/features/login.feature) finalizan en estado `passed`.
- El reporte generado no contiene pasos `undefined` ni `pending`.

## 6. Matriz de escenarios

| # | Escenario | Tipo | Usuario | Contraseña | Resultado esperado |
|---|---|---|---|---|---|
| 1 | Login exitoso con credenciales válidas | Ruta feliz | `standard_user` | `secret_sauce` | Redirige a `inventory.html`, título "Products" |
| 2 | Login exitoso con usuario con problemas de UI | Ruta feliz | `problem_user` | `secret_sauce` | Redirige a `inventory.html`, título "Products" |
| 3 | Login fallido con usuario bloqueado | Negativo | `locked_out_user` | `secret_sauce` | Error: "Epic sadface: Sorry, this user has been locked out." |
| 4 | Contraseña incorrecta | Negativo | `standard_user` | `contrasena_mala` | Error: "Epic sadface: Username and password do not match any user in this service" |
| 5 | Usuario inexistente | Negativo | `usuario_falso` | `secret_sauce` | Error: "Epic sadface: Username and password do not match any user in this service" |
| 6 | Usuario válido con mayúsculas (case-sensitive) | Negativo | `STANDARD_USER` | `secret_sauce` | Error: "Epic sadface: Username and password do not match any user in this service" |
| 7 | Usuario vacío | Negativo | *(vacío)* | `secret_sauce` | Error: "Epic sadface: Username is required" |
| 8 | Contraseña vacía | Negativo | `standard_user` | *(vacío)* | Error: "Epic sadface: Password is required" |
| 9 | Usuario y contraseña vacíos | Negativo | *(vacío)* | *(vacío)* | Error: "Epic sadface: Username is required" |

> Los escenarios 4–9 están implementados como un único `Scenario Outline` con `Examples` en el feature, para evitar duplicar los pasos.

## 7. Trazabilidad

| Caso de prueba | Feature | Steps | Page objects |
|---|---|---|---|
| Todos (1–9) | [login.feature](src/features/login.feature) | [login.steps.ts](src/step-definitions/login.steps.ts) | [LoginPage.ts](src/pages/LoginPage.ts), [InventoryPage.ts](src/pages/InventoryPage.ts) |

## 8. Riesgos y supuestos

- **Dependencia de un sitio externo:** al probar contra `saucedemo.com` directamente (sin mocks), un cambio en el sitio, caída del servicio o cambio en los mensajes de error puede romper las pruebas sin que haya un defecto real en "nuestro" código.
- **Datos de prueba fijos:** los usuarios (`standard_user`, `locked_out_user`, etc.) son mantenidos por el sitio demo; si SauceDemo los modifica o elimina, hay que actualizar el feature.
- **Sin aislamiento de estado:** cada escenario crea su propio navegador/contexto (`Before`/`After` en [hooks.ts](src/support/hooks.ts)), por lo que no hay dependencia de orden entre escenarios.

## 9. Pendientes / posible ampliación

- Cobertura de `performance_glitch_user` (tiempos de carga) y `visual_user` (regresión visual).
- Prueba de logout y expiración de sesión.
- Prueba de accesibilidad básica del formulario de login (labels, foco, navegación por teclado).
