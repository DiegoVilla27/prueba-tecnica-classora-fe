# 🤖 AI_LOG — Frontend

Registro del uso de inteligencia artificial en el frontend. Es el entregable de la **Parte 4** de la prueba y se actualiza al terminar cada petición (skill `update-ai-log`).

## Resumen

### Herramientas
| Herramienta | Uso |
|---|---|
| Claude Code (Claude Opus 5.5) | Análisis del enunciado, documentación, reglas del agente y skills; implementación de los hitos 1–8, tests, revisión visual y de accesibilidad en navegador, CI/CD y despliegue |
| Conector de Figma | Intento de leer el archivo (límite del plan Starter): el diseño se trabajó con capturas exportadas por el autor |
| Playwright (scripts de la IA) | Capturas para comparar con Figma, auditoría de teclado y árbol accesible, GIF de la demo |

### Dónde ayudó
- Documentación, reglas (`CLAUDE.md`) y skills extraídas de `task-manager-client`.
- Implementación por hitos con tests: setup con React Compiler, login, lógica de la venta (TDD), design system con Atomic Design, pantalla de caja, CI con e2e contra la API real.
- Tokens medidos sobre las capturas de Figma con cálculo de contraste WCAG.

### Fallos que se encontraron (y cómo)
| Fallo | Cómo se detectó | Solución |
|---|---|---|
| Botón principal con contraste 2,08:1 (`tailwind-merge` eliminaba `text-on-primary`) | `axe` en un e2e con navegador real | Registrar la escala tipográfica en `extendTailwindMerge` + tests |
| Se perdían escaneos rápidos (`reset()` de RHF + React Compiler) | Revisión visual en Chromium; jsdom no lo reproducía | `setValue` + `clearErrors`, regla en `CLAUDE.md`, e2e a velocidad de lector |
| `Enter` en "Finalizar" cancelaba (foco en el primer botón del `<dialog>`) | e2e del flujo completo | `data-autofocus` tras `showModal()` |
| El campo de código no recibía el foco al cargar | Test de integración I-01 | Foco al habilitarse |
| Los e2e "full-stack" corrieron contra MSW durante varios hitos | Al recuperar una venta tras recargar daba 0 filas | Error de proceso de la IA (servidores de Vite huérfanos): se mataron, se paran por puerto y se repitieron contra la API real |
| Tests intermitentes (texto duplicado en toast y `aria-live`; `axe` midiendo animaciones) | Repetir la batería varias veces | Consultas acotadas al toast; excluir toasts del análisis |

### Decisiones y correcciones humanas principales
| Qué propuso la IA | Qué decidió el autor | Por qué |
|---|---|---|
| Estructura genérica (`domain/`, `ui/`) | Arquitectura modular por features con `screen/`, `services/` (dtos + mappers), hooks y componentes a nivel de feature y de screen | Convención propia, más cohesión |
| Archivos con nombre propio | Un módulo = una carpeta = `index.tsx` | Imports sin repetir nombres |
| `useReducer` + Context | **Zustand** | Selecciones atómicas, menos boilerplate, su stack habitual |
| CSS Modules | **Tailwind CSS v4** | Su stack habitual |
| `fetch` propio | Axios + `httpService` + interceptores | Patrón de task-manager |
| — | Formularios con **React Hook Form + Zod**; regla explícita de exports default/named; accesibilidad como requisito | Indicaciones del autor |
| — | **React Compiler** obligatorio | Indicación del autor |
| Componentes de UI en una carpeta plana | **Atomic Design** en `shared/components/ui` | Indicación del autor |
| Leer las variables de Figma | Tokens y tipografía definidos por el proyecto | El archivo no tenía variables |
| — | Valores simples para los secretos de los entornos efímeros; dominios `classora-tpv-dev/prod` en Vercel | Decisión del autor (configuró Vercel y Render) |
| — | Pasada manual con VoiceOver | La hizo el autor: correcta |

---

## Registro

### #01 · 2026-10-28 ~14:40 · Analizar la prueba y proponer un plan
- **Herramienta:** Claude Code (Claude Opus 5.5)
- **Prompt (resumen):** Leer el PDF "Caso Práctico_UXUI_Front" y armar un plan para abordar la prueba completa: requisitos, casos de uso, endpoints, DDD y arquitecturas.
- **Qué hizo la IA:** Extrajo las 4 partes del enunciado y qué evalúan. Propuso RF/RNF, casos de uso con atajos de teclado, wireframe, arquitectura React (hexagonal ligera), endpoints Java con formato de error, guion para documentar el uso de IA y una planificación por horas.
- **Decisiones / correcciones humanas:** Ninguna en este paso; sirvió como base para la siguiente petición.
- **Resultado:** Plan entregado en el chat (sin archivos). Hora aproximada: la petición se hizo antes de crear las carpetas de los proyectos (14:48).

### #02 · 2026-10-28 15:12 · Documentar el proyecto front y sus reglas
- **Herramienta:** Claude Code (Claude Opus 5.5)
- **Prompt (resumen):** Crear los `.md` del proyecto front con todo desglosado (negocio, casos de uso, requisitos…), arquitectura modular por features (`components/`, `hooks/`, `services/` con DTOs y mappers, `screen/` con sus hooks y componentes), todo archivo como `index.tsx` en su carpeta, tests unit happy path + integración con MSW + E2E Playwright de flujos importantes, y principios SOLID/DRY/KISS/YAGNI como reglas del agente o skills.
- **Qué hizo la IA:** Creó `README.md`, `CLAUDE.md`, `docs/01…08` y las skills `new-component`, `new-feature`, `new-service` y `write-tests`.
- **Decisiones / correcciones humanas:** El autor fijó la estructura de carpetas y la regla `index.tsx`. La IA propuso `index.ts` para archivos sin JSX y lo dejó señalado para que el autor lo confirmara.
- **Resultado:** Docs creados; sin código.

### #03 · 2026-10-28 15:40 · Ajustar el stack y adoptar la forma de trabajo de task-manager-client
- **Herramienta:** Claude Code (Claude Opus 5.5)
- **Prompt (resumen):** Usar Zustand para la venta, Tailwind 4 para estilos y React Hook Form + Zod para formularios. Cuidar qué se exporta por default y qué no, y la accesibilidad. Analizar `task-manager-client` como referencia de su forma de trabajo y sacar de ahí reglas y skills generales. Crear un log de IA con fecha y hora por petición.
- **Qué hizo la IA:**
  - Analizó `task-manager-client` (estructura, `.agents/AGENTS.md`, 24 skills, configs, código y tests).
  - Reescribió `CLAUDE.md`: stack, carpetas en kebab-case, tabla de exports default/named, Zustand, RHF + Zod, Tailwind v4, sección de accesibilidad WCAG 2.2 AA, convenciones de test AAA.
  - Reescribió `docs/04-arquitectura.md`, `05-testing.md`, `06-integracion-backend.md` y `07-roadmap.md`, y ajustó `01`, `02` y `03` (tokens `@theme`, nombres de componentes, checklist de a11y ampliada).
  - Copió 17 skills del autor que aplican a este stack (`clean-code`, `conventional-commits`, `react-core`, `react-a11y`, `react-zustand`, `react-hook-form(-zod)`, `react-zod`, `react-tanstack-query`, `web-tailwind`, `web-typescript(-react)`, `web-tsdoc`, `web-modern-testing`, `web-performance`, `vite-react-optimization`, `web-advanced-ui-ux`). Descartó las que no aplican: animaciones, micro-frontends, Redux, View Transitions y Jest.
  - Reescribió las skills del proyecto y añadió `update-ai-log`.
  - Sustituyó `docs/08-uso-ia.md` por este `AI_LOG.md`.
- **Decisiones / correcciones humanas:**
  - Zustand en lugar de `useReducer`.
  - Tailwind v4 en lugar de CSS Modules.
  - RHF + Zod.
  - Adoptar las convenciones de task-manager-client.
- **Decisiones de la IA, sujetas a revisión:**
  - Se mantienen Playwright en lugar de Cypress y `screen/` en lugar de `pages/`, porque el autor los pidió explícitamente.
  - El interceptor de errores no lanza toasts globales: en caja el error va inline.
  - Sin React Router (una sola pantalla).
- **Resultado:** Docs y skills actualizados; sin código.

### #04 · 2026-10-28 15:48 · Commit y push de la documentación
- **Herramienta:** Claude Code (Claude Opus 5.5)
- **Prompt (resumen):** Hacer commit y push en cada proyecto, siempre con Conventional Commits.
- **Qué hizo la IA:** Primer commit en `main` (`docs: add project documentation, agent rules and skills`) y push a `origin/main`; después este commit con la entrada del log.
- **Decisiones / correcciones humanas:** El autor fija Conventional Commits como norma para todos los commits.
- **Resultado:** Hecho; rama `main` publicada en GitHub.

### #05 · 2026-10-28 16:02 · Ampliar el alcance: front completo, con login y desplegado
- **Herramienta:** Claude Code (Claude Opus 5.5)
- **Prompt (resumen):** Entregar todo funcional y realista: front y back, en local con Docker y en dev/prod (Vercel para el front, Render para el back), con autenticación JWT. Ajustar primero los `.md`.
- **Qué hizo la IA:**
  - Ajustó el alcance en `01` (login, sesión, recuperar venta, arranque en frío; RF-15…RF-19).
  - Añadió a `02` los casos de uso de login, cierre de sesión y carga/recuperación de la venta.
  - Añadió a `03` los frames y textos de login, sesión caducada y "Conectando con el servidor…".
  - Reescribió `04`: features `auth`/`catalog`/`checkout`, React Router con guards, interceptor JWT con refresh silencioso, venta en servidor con Zustand y mutations optimistas serializadas (`scope`), resiliencia y ADRs.
  - Reescribió `05`: integración con MSW con estado, y E2E Playwright en dos proyectos (`mocked` y `full-stack`).
  - Reescribió `06` (flujo completo contra la API) y `07` (roadmap).
  - Creó `08-despliegue.md` (Docker + nginx, Vercel, CI).
  - Actualizó `CLAUDE.md` (stack, árbol, §3 estado, git) y las skills.
- **Decisiones / correcciones humanas:** El autor amplía el alcance a una entrega completa y desplegada con JWT, y decide empezar por el back.
- **Decisiones de la IA, sujetas a revisión:**
  - La venta vive en el servidor y Zustand guarda la copia optimista.
  - Finalizar y vaciar no son optimistas.
  - Tokens en `localStorage`, como en task-manager (alternativa con cookie `HttpOnly` documentada).
  - Contenedor con build + nginx en lugar de `vite dev`.
- **Resultado:** Docs y skills actualizados; sin código; sin commit.

### #06 · 2026-10-28 16:06 · Quitar roles: un único usuario, el cajero
- **Herramienta:** Claude Code (Claude Opus 5.5)
- **Prompt (resumen):** Sin roles; el único usuario del sistema es el cajero (decisión que afecta sobre todo al back).
- **Qué hizo la IA:** Ajustó el actor de `docs/02-casos-de-uso.md` (sin `CASHIER`/`SUPERVISOR`). El resto del front ya trataba al usuario como cajero.
- **Decisiones / correcciones humanas:** Corrección del autor: el supervisor no estaba en el enunciado.
- **Resultado:** Doc actualizado; sin commit.

### #07 · 2026-10-28 16:10 · Commit y push del nuevo alcance
- **Herramienta:** Claude Code (Claude Opus 5.5)
- **Prompt (resumen):** Hacer commit y push en ambos repos.
- **Qué hizo la IA:** Commit `docs: expand scope to authenticated server-backed checkout` con los cambios de las peticiones #05 y #06, push a `origin/main` y este commit del log.
- **Decisiones / correcciones humanas:** Ninguna.
- **Resultado:** Hecho.

### #08 · 2026-10-29 00:30 · Hito 0: Figma, tokens propios y design system con Atomic Design
- **Herramienta:** Claude Code (Claude Opus 5.5) + conector de Figma
- **Prompt (resumen):** Revisar los diseños de Figma. Definir nosotros los tokens y la tipografía de forma profesional. Todos los componentes reutilizables en `shared/components/ui` con Atomic Design. Cerrar el hito 0 y meter React Compiler en el hito 1.
- **Qué hizo la IA:**
  - El conector de Figma se conectó, pero la primera lectura del archivo devolvió el límite de llamadas del plan Starter. El usuario exportó las capturas a `docs/figma/` (9 frames).
  - **Tokens:** midió el color exacto de los píxeles de las capturas y calculó el contraste WCAG de cada par.
    - Corrigió `ink-subtle` (`#798a84` → `#5f716a`, de 3,3:1 a 4,7:1).
    - Añadió `border-strong` (`#758981`, 3,7:1) para el borde de los inputs, que en Figma no llegaba al 3:1.
    - Tipografía Inter Variable autoalojada con `tabular-nums` y escala `total`/`display`/`title`/`scan`/`body`/`overline`; radios, sombra, alturas y movimiento.
    - Todo documentado con el `@theme` completo en `docs/03-ux-ui.md` §4.
  - **Atomic Design:**
    - Nueva sección `CLAUDE.md` §2.4: niveles, qué puede importar cada uno, sin negocio, API consistente, accesible por defecto y tests con `axe`.
    - Inventario de 26 piezas sacadas de los frames (12 atoms, 8 molecules, 4 organisms, 2 templates) y de los componentes de pantalla que las componen (`docs/03-ux-ui.md` §5).
    - Rutas actualizadas en `04-arquitectura`, `02-casos-de-uso`, `05-testing` y el skill `new-component`.
  - **Frames y textos:** tabla de frames (diseñados vs construidos en código) y microcopy literal de Figma (§3 y §6).
  - **Roadmap:** hito 0 ✅; hito 1 con React Compiler detallado; hito 4 rehecho para Atomic Design.
- **Decisiones / correcciones humanas:** Los tokens los define el proyecto (Figma no tiene variables). Atomic Design en `shared/components/ui`.
- **Resultado:** Hito 0 completado. Commit `docs: close hito 0 with design tokens and atomic design system` y push a `origin/main`.

### #09 · 2026-10-29 00:55 · Hito 1: setup del proyecto con React Compiler
- **Herramienta:** Claude Code (Claude Opus 5.5)
- **Prompt (resumen):** Empezar el hito 1, con React Compiler sí o sí.
- **Qué hizo la IA:**
  - **Base:**
    - Vite 8, React 19 y TypeScript 6 `strict` (con `noUncheckedIndexedAccess`), alias `@core`/`@features`/`@shared`, puerto 3000.
    - Modos `localhost`/`mock`/`dev`/`prod` y `.env.test`; `index.html` en `lang="es"`.
    - Tokens de `docs/03-ux-ui.md` §4 en el `@theme` e Inter Variable autoalojada.
  - **React Compiler:**
    - `babel-plugin-react-compiler` 1.0 (estable) vía `@rolldown/plugin-babel` y `reactCompilerPreset`. No el compilador en Rust, que la documentación marca como experimental.
    - Sus reglas (`eslint-plugin-react-hooks`) corren en oxlint como `react-compiler/*`; comprobado con un componente de prueba que llama a `setState` en el render.
    - Comprobado en el build: `react.memo_cache_sentinel` aparece en el bundle y en las dos pantallas.
  - **Versiones:** `pnpm` instaló majors nuevas (React Router 8, TypeScript 7, Vitest 5, MSW 3). Se fijaron React Router 7, como pide el stack del `CLAUDE.md`, y las mismas majors de task-manager (TS 6, Vitest 4, MSW 2). `@babel/core` 7, para usar el mismo AST que el compilador.
  - **Calidad:**
    - oxlint con `react`, `typescript`, `oxc`, `jsx-a11y` e `import`. Las reglas de dependencia (§2.3) y los niveles de Atomic Design (§2.4) son errores de `no-restricted-imports`.
    - Se desactivaron las reglas que chocan con convenciones ya decididas (export default + named, clase `StorageService`).
    - Prettier, Husky + lint-staged + commitlint (probado: rechaza un mensaje no convencional).
  - **`core/`:**
    - `axiosInstance`, `httpService` y `ApiError` (distingue "sin respuesta" de un código HTTP).
    - Interceptor de errores sin toasts globales.
    - Interceptor JWT con **un único refresh** para 401 concurrentes, reintento una sola vez y cierre de sesión solo si falla el refresh.
    - Router con `PublicGuard`/`PrivateGuard` y pantallas `lazy`; `AppProviders` + `createQueryClient`; MSW (worker + agregador).
  - **`shared/`:** `cn`, `StorageService`, servidor MSW de tests, `renderRoute` y `expectNoA11yViolations` (axe-core).
  - **Pantallas:** login y caja como marcadores, para que router y guards funcionen ya; se construyen en los hitos 2 y 5.
  - **Tests:**
    - 22 unitarios: utils, axios, http, `ApiError`, ambos interceptores (Bearer, refresh único con 2 peticiones concurrentes, sesión caducada, login 401 sin refresh), rutas y providers. Cobertura del 92 % en líneas y 86 % en ramas.
    - Smoke e2e en Chromium con `@axe-core/playwright` (login en `es`, sin violaciones graves).
  - **Entrega:**
    - Dockerfile multi-stage (node 22 + nginx con fallback SPA y caché de `/assets`), probado con `docker compose`: `/` y `/login` dan 200.
    - `vercel.json` con build según `VERCEL_ENV`, rewrite SPA, CSP limitada a las APIs de Render y cabeceras de seguridad. `.vscode/` con etiquetas de pestaña para los `index`.
  - **Corrección propia:**
    - El primer interceptor JWT cerraba la sesión si el **reintento** fallaba por otro motivo; se separó el refresh del reintento.
    - El chunk de MSW (412 kB) salía en el build de prod; ahora la condición usa `import.meta.env` y Vite lo elimina.
  - **Docs:** el `CLAUDE.md` decía `forwardRef` (React 19 usa `ref` como prop). `04`/`06` decían que el refresh usaba un service de `auth` (ahora es una llamada directa, para que `core` no dependa de `features`). Roadmap del hito 1 ✅.
- **Decisiones / correcciones humanas:** React Compiler obligatorio.
- **Resultado:** `typecheck`, `lint` (0 avisos), `format:check`, `test:unit`, `test:integration`, `build:prod`, `e2e` y Docker en verde. Commit `build: set up vite, react 19 with react compiler and core infrastructure` en `feature/hito-1-setup`, merge fast-forward a `main` y push.

### #10 · 2026-10-29 01:20 · Hito 2: login, sesión y primeras piezas del design system
- **Herramienta:** Claude Code (Claude Opus 5.5)
- **Prompt (resumen):** Empezar el hito 2.
- **Qué hizo la IA:**
  - **Contrato:** comprobó contra el back local las respuestas reales (401 `Invalid credentials.`, 400 con `errors[]`, tokens, `/users/me` y CORS para `localhost:3000`).
  - **Feature `auth`:**
    - modelo `Cashier` (nombre completo, iniciales), DTOs con Zod y mapper;
    - `loginSvc`, con un timeout de 60 s para que el primer login del día aguante el arranque en frío de Render, `getMeSvc` y `logoutSvc`;
    - handlers MSW con las mismas respuestas que la API;
    - `useMe` y `useLogout`, este último limpiando tokens y toda la caché de Query.
  - **Decisión:** `use-me` vive en `auth` y no en `shared/hooks`, como decían los docs, porque necesita service, DTO y mapper y `shared` no puede importar de `features`. Docs actualizados.
  - **Pantalla:** `LoginScreen` = `AuthLayout` + `BrandPanel` + `LoginForm` (RHF + Zod en `useLoginForm`), con los textos literales de Figma.
    - Errores: 401 vacía la contraseña y le da el foco; 429; red y 5xx con "No se pudo conectar con el servidor…"; aviso de `?expired=1`.
    - La caja provisional ya muestra el cajero y "Salir".
  - **Design system adelantado del hito 4** para que el login sea fiel: `Button`, `Input`, `Label`, `Logo`, `Overline`, `Spinner`, `FormField`, `PasswordField`, `Alert` y `AuthLayout`. Sin `forwardRef` (React 19) y cada uno con test y `axe`. El `Spinner` usa `<output>`, como sugirió `jsx-a11y`.
  - **Tests:**
    - 53 unitarios con un 94 % de cobertura en líneas y un 91 % en ramas.
    - 8 de integración: L-01…L-03, email mal formado, red caída, 429, sesión caducada y logout.
    - E2E `login` en `mocked` y en `full-stack` contra la API real (en verde).
  - **Fidelidad:** capturas en Chromium comparadas con el frame. Se ajustaron el interlineado del titular (1,2 → 1,5, medido en Figma) y el ancho del panel (5/12 → 7/16, 600 de 1366 px).
- **Fallos encontrados y corregidos:**
  - **Contraste del botón principal (2,08:1), detectado por `axe` en el e2e.** `tailwind-merge` no conocía la escala tipográfica propia: tomaba `text-body` por un color y eliminaba `text-on-primary`. Se registró la escala con `extendTailwindMerge`; hay test en `cn` y en `Button`.
  - El test de `getMeSvc` no registraba el interceptor JWT.
  - El selector `getByLabel('Contraseña')` de Playwright también encontraba el botón "Mostrar contraseña"; ahora es exacto.
  - Los imports de los e2e necesitaban la extensión `.ts` por `nodenext`.
- **Docs:** `CLAUDE.md`, `02`, `03` (token `display`), `04`, `06`, skill `new-component` (sin `forwardRef`) y roadmap (hito 2 ✅; hito 4 con lo que queda).
- **Decisiones / correcciones humanas:** Ninguna.
- **Resultado:** `typecheck`, `lint` (0 avisos), `format:check`, unit, integración, `build:prod`, e2e `mocked` y `full-stack` en verde. Commit `feat(auth): add login screen, session hooks and first design system pieces` en `feature/hito-2-auth`, merge fast-forward a `main` y push.

### #11 · 2026-10-29 15:30 · Hito 3: lógica de la venta (modelos, store, servicios, mutaciones)
- **Herramienta:** Claude Code (Claude Opus 5.5)
- **Prompt (resumen):** Empezar el hito 3.
- **Qué hizo la IA:**
  - **Contrato:** comprobó contra el back local la forma exacta de `SaleResponseDTO`, el 422 al pasar de 999 y al cobrar vacía, el 404 del producto y el 204 al cancelar. Las ventas de prueba quedaron canceladas.
  - **Modelos (TDD, tests primero):**
    - `money` en céntimos, `quantity` (1–999) y `sale-line`;
    - `sale`: añadir (suma si ya está; `MaxQuantityExceededError` sin tocar la venta), cambiar cantidad, quitar, deshacer, total, artículos, productos y `canCompleteSale`.
  - **`catalog`:** `getProductByCodeSvc` (404 → `ProductNotFoundError`; los demás errores pasan tal cual para distinguir "no existe" de "sin conexión"), mapper y `useProductLookup` con caché de 5 min. Mocks generados desde la `V3` del back: los mismos 20 EAN-13, UUID y precios.
  - **`checkout`:**
    - 7 servicios (abrir con 409 → devuelve la venta existente) y DTOs Zod;
    - mock MSW con una venta en memoria y las mismas reglas que el agregado del back;
    - `useCurrentSale` con reintentos de arranque en frío solo para "sin respuesta" o 5xx;
    - `useSaleMutations`.
  - **Decisiones de diseño tras leer el código de TanStack Query** (con `scope`, `onMutate` corre al instante y solo la petición hace cola):
    - las líneas se identifican por **producto**, y el id real se resuelve con `serverSale` cuando sale la petición; así funciona pulsar "+" antes de que responda el escaneo;
    - solo la **última** respuesta de la cola pinta la pantalla (`confirmSale`); las anteriores actualizan `serverSale` y así no parpadean los cambios posteriores;
    - el `rollback` vuelve a la última venta confirmada.
  - **Deshacer:** la línea vuelve **al final**, porque es lo que hace la API (`POST /lines` añade al final) y así no salta la fila. Doc `02` corregido.
  - **Euros a céntimos:** `fromEuros` pasa a `@shared/utils/money`, para que `catalog` y `checkout` no dependan uno del otro.
  - **Tests:** 89 unitarios en verde, con un 94 % de cobertura en líneas y un 87 % en ramas. Incluyen escaneo, escaneo y cambio de cantidad antes de ninguna respuesta, >999 sin petición, 500 con rollback, eliminar con deshacer, cobrar y venta nueva, y vaciar.
  - **Docs:** `CLAUDE.md` §3, `02`, `04` (store, extracto de mutación, árbol), `06`, skill `new-service` y roadmap (hito 3 ✅).
- **Decisiones / correcciones humanas:** Ninguna.
- **Resultado:** `typecheck`, `lint`, `format:check`, unit, integración, `build:prod` y e2e en verde. Commit `feat(checkout): add sale domain, store, services and optimistic mutations` en `feature/hito-3-sale-logic`, merge fast-forward a `main` y push.

### #12 · 2026-10-29 16:45 · Hito 4: design system completo con Atomic Design
- **Herramienta:** Claude Code (Claude Opus 5.5)
- **Prompt (resumen):** Empezar el hito 4.
- **Qué hizo la IA:**
  - **Comprobaciones previas:**
    - jsdom no implementa `<dialog>.showModal()`, así que se añadió un *polyfill* mínimo en `setupTests`;
    - `useEffectEvent` está disponible en React 19.3;
    - `Intl` en `es-ES` da `14,94 €`, como en Figma.
  - **Utilidades:**
    - `formatMoney`, el único sitio donde el dinero se convierte en texto;
    - `useHotkeys`, con un único listener vía `useEffectEvent`, que no roba `+`/`-`/`Supr` a los campos salvo que el atajo lo permita (`F12`, `Esc`, `Ctrl+Z`) y acepta ⌘ como Ctrl;
    - `useAnnouncer`, con una sola región `aria-live` que repite el anuncio aunque el texto sea igual.
  - **Design system (26 piezas en total):**
    - átomos `IconButton`, `Badge`, `Avatar`, `Kbd`, `Money` (céntimos, `tabular-nums`) y `Card` (`as` semántico);
    - moléculas `QuantityStepper` (`<fieldset>`, `+` deshabilitado en 999 y `−` activo en 1 para que la pantalla pregunte), `KeyValue` (`<dl>`), `ShortcutHint`, `UserBadge` y `EmptyState`;
    - organismos `Modal` sobre `<dialog>` nativo (fondo inerte, `alertdialog` si es destructivo, `Esc` bloqueado con `isBusy`), `AppHeader`, `ShortcutsBar` y `DataTable` (tabla semántica con `caption`, `scope` y filas resaltada y seleccionada);
    - plantilla `AppLayout` 70/30.
    - Cada pieza con test, incluido `axe` donde tiene sentido.
  - **`Toaster`** con el estilo del frame "Producto eliminado / Deshacer".
  - **Caja provisional:** usa ya el design system (cabecera con `UserBadge` y "Salir", título con `Badge`, `EmptyState`, panel del total y barra de atajos). La captura en Chromium se comparó con el frame y se ajustaron las teclas: en Figma son texto plano, así que hay un nuevo tono `plain` del `Kbd`.
  - **Lint:** `jsx-a11y` pidió `<section>` en lugar de `role="region"` (de ahí la prop `as` de `Card`) y `<fieldset>` en lugar de `role="group"`. Se quitó una clase `animate-in` que no existe en Tailwind v4.
  - **Docs:** `03` §5 (variantes reales, `Modal` nativo, `Toast`) y §7, roadmap (hito 4 ✅).
- **Decisiones / correcciones humanas:** Ninguna.
- **Resultado:** 115 unitarios (95 % de cobertura en líneas y 90 % en ramas), integración, `build:prod`, e2e `mocked` y `full-stack` en verde. Commit `feat(ui): complete the design system with atomic design` en `feature/hito-4-design-system`, merge fast-forward a `main` y push.

### #13 · 2026-10-29 18:30 · Hito 5: pantalla de caja completa
- **Herramienta:** Claude Code (Claude Opus 5.5)
- **Prompt (resumen):** Empezar el hito 5.
- **Qué hizo la IA:**
  - **Componentes de la caja:**
    - `ScanForm`: `parseScanInput` con el multiplicador `N*código`; una cola de escaneos en orden; errores inline de código no válido, inexistente, sin conexión y máximo 999.
    - `SaleTable`/`SaleLineRow`: la key es `productId`, porque la línea optimista cambia de id al confirmarse; resaltado y scroll del último añadido.
    - `TotalPanel`, `ServerStatus`, `SaleCompleted`, `CheckoutHeader` y los modales de finalizar, vaciar y cerrar sesión.
    - `useLineActions`: − / +, quitar con toast "Deshacer" y deshacer.
    - `useCheckoutScreen`: carga, modales, foco y atajos.
  - **`useHotkeys`:** un handler puede devolver `false` para que `+`, `-`, `Supr` o `Ctrl+Z` sigan escribiendo en el campo cuando no hay línea seleccionada.
  - **409:** recarga la venta del servidor.
  - **Decisiones:**
    - `−` en cantidad 1 elimina con Deshacer, en lugar de preguntar (CU-02 B1).
    - No hay edición directa del número de cantidad (YAGNI).
    - La pantalla de éxito espera a "Nueva venta".
- **Fallos reales encontrados y corregidos:**
  1. **Se perdían escaneos rápidos, detectado en la revisión visual con Chromium.**
     - `reset()` de React Hook Form desregistra el campo y cuenta con que `register()` devuelva un `ref` nuevo en el siguiente render. El React Compiler lo memoiza, así que el campo dejaba de actualizarse.
     - Se cambió por `setValue('', …)` + `clearErrors`; la regla queda en `CLAUDE.md` §4. jsdom no lo reproducía, así que lo cubre el e2e `checkout-happy-path` a velocidad de lector.
  2. **`Enter` en el modal de finalizar cancelaba en vez de confirmar.** El `autoFocus` de React corre antes de `showModal()` y el diálogo enfocaba el primer botón. El `Modal` ahora enfoca el elemento marcado con `data-autofocus`.
  3. **El campo de código no recibía el foco al cargar**, porque `autoFocus` no actúa sobre un campo deshabilitado. Ahora recibe el foco al habilitarse (I-01).
  4. **Fidelidad con Figma:** "Deshacer" se partía en dos líneas, el toast tapaba la barra de atajos y el anillo azul ocultaba el borde rojo del error.
- **Fallos del propio proceso de la IA:**
  - Los scripts de capturas dejaban servidores de Vite vivos: `pkill -f "vite --mode mock"` nunca coincidía. Playwright reutilizaba el servidor de mock del puerto 3000, así que las ejecuciones `full-stack` posteriores a la captura del hito 2 (final del hito 2 y hitos 3 y 4) probablemente corrieron contra MSW.
  - Se descubrió porque recuperar la venta tras recargar daba 0 filas; la venta ni existía en la BD.
  - Se mataron los procesos y ahora se paran por puerto. Los `full-stack` van en serie (mismo cajero, una venta abierta), recargan solo con la red en reposo y se ejecutaron de verdad contra el back del 8080.
- **Tests inestables corregidos:** el texto del toast también está en la región `aria-live`, así que se busca dentro del toast; `axe` excluye los toasts, que se medían a mitad de animación.
- **Verificación:**
  - 134 unitarios (88 % de cobertura en líneas y 83 % en ramas) y 25 de integración. Vitest completo pasó 5 veces seguidas.
  - e2e `mocked` 7/7 (dos ejecuciones) y `full-stack` 4/4 contra la API real.
  - Capturas comparadas con los frames 01, 04, 11, 13 y 16.
- **Docs:** `CLAUDE.md` §4, `02` (A4, A6, A7, B1–B4, CU-04), `04` (árbol), `05` (e2e) y roadmap (hito 5 ✅, e2e del hito 6 adelantados).
- **Decisiones / correcciones humanas:** Ninguna.
- **Resultado:** Commit `feat(checkout): add the checkout screen with scan queue, modals and shortcuts` en `feature/hito-5-checkout-screen`, merge fast-forward a `main` y push.

### #14 · 2026-10-29 17:30 · Hito 6: auditoría de accesibilidad y fidelidad con Figma
- **Herramienta:** Claude Code (Claude Opus 5.5)
- **Prompt (resumen):** Empezar el hito 6.
- **Qué hizo la IA:**
  - **Auditoría en Chromium:**
    - orden de Tab en login y caja, lógico e igual al visual;
    - foco visible en cada interactivo;
    - árbol accesible completo (lo que recibe un lector de pantalla);
    - zoom al 200 % (683 px) y tablet (1024 px) sin scroll horizontal.
  - **Mejoras que salieron del árbol accesible:**
    - Cada `QuantityStepper` era una región `aria-live` (`<output>`), así que con varias filas cada cambio sonaba suelto ("3"). Ahora es texto normal y la cantidad se anuncia una sola vez por el anunciador: "Leche entera 1L, cantidad 3".
    - "Finalizar venta F12" tenía la tecla dentro del nombre accesible. Ahora usa `aria-keyshortcuts="F12"` y la tecla visible es `aria-hidden`.
    - Hay aserciones nuevas para ambas cosas en la integración.
  - **Fidelidad:**
    - 9 capturas de la app contra la API real, una por frame (01, 02, 04, 05, 08, 11, 13, 16, 17). Para "Finalizando…" se retrasó `PATCH /complete` con `page.route`, que contra MSW no es posible.
    - Compuestas junto a Figma en `docs/figma/vs-app/`: solo difieren los datos de ejemplo.
  - **Checklist WCAG** en `docs/03-ux-ui.md` §7 con la evidencia de cada punto, más un **guion de VoiceOver** para la pasada manual.
- **Límite declarado:** la IA no puede escuchar VoiceOver: la pasada real queda para el autor (👤 en la checklist).
- **Observación:** en la BD local faltan las ventas anteriores a las 17:04, incluidas las de pruebas de la IA de la mañana. El front no puede borrar ventas; se avisó al usuario por si fue una limpieza manual. Las ventas de las capturas quedaron cerradas.
- **Verificación:** 134 unitarios, 25 de integración, `build:prod`, e2e `mocked` 7/7 y `full-stack` 4/4 (puerto 3000 libre antes de empezar).
- **Decisiones / correcciones humanas:** Ninguna.
- **Resultado:** Hecho; ver #15.

### #15 · 2026-10-29 17:45 · Revisión manual con VoiceOver
- **Herramienta:** Claude Code (Claude Opus 5.5)
- **Prompt (resumen):** El usuario no conocía VoiceOver; pidió cómo hacerlo y después confirmó que lo ve bien.
- **Qué hizo la IA:** Explicó VoiceOver paso a paso: `Cmd + F5`, navegar con `Tab` y leer el panel de subtítulos en lugar de escuchar. Dio una tabla de lo que debía leer en cada paso. Con la confirmación del usuario, marcó el punto como revisado en la checklist (`docs/03-ux-ui.md` §7) y en el roadmap.
- **Decisiones / correcciones humanas:** El autor hizo la pasada manual con VoiceOver: sin incidencias.
- **Resultado:** Hito 6 completo, sin puntos pendientes. Commit `feat(a11y): audit accessibility and compare the app with figma` en `feature/hito-6-a11y-quality`, merge fast-forward a `main` y push.

### #16 · 2026-10-29 18:30 · Hito 7: CI/CD, Vercel y CORS
- **Herramienta:** Claude Code (Claude Opus 5.5)
- **Prompt (resumen):** Empezar el hito 7. El usuario creó el proyecto en Vercel, los dominios y el CORS en Render siguiendo las instrucciones, y pidió el paso a paso de Render.
- **Qué hizo la IA:**
  - **`ci.yml`** con el estilo de task-manager (sin filtro de rutas, Sonar ni Discord):
    - comprobación de la rama de origen de los PR a `main`, Prettier, oxlint y `tsc`;
    - unit con cobertura, integración, e2e `mocked` con axe y build de producción;
    - **e2e `full-stack`**: PostgreSQL 16 como servicio con las credenciales del perfil `local` del back, más la imagen del back construida desde su repo y arrancada con `--network host`. Cada PR del front se prueba así contra la API real.
    - Todo confluye en `🛡️ Frontend CI Quality Gate`. Verde a la primera en el PR #1.
  - **Ramas:** creó `dev` desde `main` y protegió `main` y `dev` con `gh` (PR obligatorio, check del quality gate, también para admins).
  - **Vercel** (instrucciones y verificación):
    - `ENABLE_EXPERIMENTAL_COREPACK=1` para usar pnpm 11.
    - Producción en https://classora-tpv-prod.vercel.app: 200, CSP del `vercel.json`, fallback SPA y bundle contra `pos-api-prod` sin MSW.
    - El aviso "No Deployment" de `dev` se debe a que la rama se creó antes que el proyecto y se arregla con el primer merge.
  - **CORS:** valores exactos por servicio y paso a paso de Render. Verificado con preflight: los orígenes de Vercel permitidos y uno ajeno con 403. Prod sigue aceptando `localhost` (el usuario lo dejó; opcional quitarlo).
  - **Prueba real:** login en la web de producción con el cajero de prod, sin errores.
  - **Docs:** `08` y `06` con las URLs reales y el job `full-stack`; roadmap (hito 7 ✅).
- **Decisiones / correcciones humanas:** El usuario configuró Vercel (dominios `classora-tpv-prod` y `classora-tpv-dev`) y Render.
- **Resultado:** PR #1 (`feature/hito-7-ci-cd` → `dev`) y PR `dev` → `main` mergeados con el CI en verde; primer despliegue de `dev` en Vercel.

### #17 · 2026-10-29 19:00 · Primer despliegue de dev y producción verificados
- **Herramienta:** Claude Code (Claude Opus 5.5)
- **Prompt (resumen):** Llevar el hito 7 hasta `main`; el usuario desactivó la Deployment Protection de Vercel.
- **Qué hizo la IA:**
  - Subió los docs al PR #1, esperó el CI (verde, más la preview de Vercel) y lo mergeó en `dev`. Abrió el PR #2 `dev` → `main`, con el CI en verde, y lo mergeó.
  - **Producción:** bundle contra `pos-api-prod`, login OK.
  - **Dev:** respondía 302 a `vercel.com/sso-api`, por la Deployment Protection de Vercel, que protege las previews. Se dio el paso a paso para desactivarla; ahora responde 200 y el bundle va contra `pos-api-dev`.
  - El primer login en dev mostró "No se pudo conectar con el servidor…" porque la API de dev estaba dormida (arranque en frío): es el mensaje previsto para ese caso. Al repetir, todo funcionó: login, escaneo de leche ×2 y bolsa ×3 con total 2,20 €, y la venta de prueba vaciada.
  - Nota de la Deployment Protection añadida en `docs/08-despliegue.md`.
- **Decisiones / correcciones humanas:** El usuario desactivó la Deployment Protection.
- **Resultado:** Front desplegado y verificado en dev y prod. Esta entrada y la nota de `08` van en el PR del hito 8 (`main` está protegida).

### #18 · 2026-10-29 19:40 · Hito 8: entrega
- **Herramienta:** Claude Code (Claude Opus 5.5)
- **Prompt (resumen):** Empezar el hito 8.
- **Qué hizo la IA:**
  - **GIF del flujo** (`docs/demo/checkout.gif`, 277 KB): login, escaneos, código inexistente, +, eliminar y deshacer, F12 y nueva venta. Hecho con capturas de Playwright y Pillow, sin instalar `ffmpeg` en el equipo del autor.
  - **README final:**
    - URLs y cajeros demo por entorno, aviso del arranque en frío, códigos para probar y atajos;
    - **tabla de entregables por parte del enunciado** y la sección **Integración con el backend Java (Parte 3)** con el recorrido de `GET /products/{code}` por ambas capas;
    - arquitectura, cómo ejecutar, calidad, CI/CD y decisiones.
    - Comprobó las anclas y los enlaces de Swagger (prod respondió al segundo intento por el arranque en frío).
  - **`AI_LOG` revisado:** el resumen era de antes de implementar; ahora recoge herramientas, **fallos encontrados y cómo** (incluido el error de proceso de la IA con los e2e full-stack) y decisiones humanas. Numeración #01–#18 continua.
  - **Back** (rama `feature/delivery-frontend-links`): README y `docs/07` con el front y el CORS por entorno; su `AI_LOG` #28 corregido y #29 nuevo.
  - **Roadmap:** hito 8 ✅.
- **Decisiones / correcciones humanas:** Ninguna.
- **Resultado:** Commit y PR hasta `main` en los dos repos con el CI en verde; proyecto entregado.
