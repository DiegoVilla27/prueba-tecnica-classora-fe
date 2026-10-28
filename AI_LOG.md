# 🤖 AI_LOG — Frontend

Registro del uso de inteligencia artificial en el frontend. Es el entregable de la **Parte 4** de la prueba y se actualiza al terminar cada petición (skill `update-ai-log`).

## Resumen

### Herramientas
| Herramienta | Uso |
|---|---|
| Claude Code (Claude Opus 5.5) | Análisis del enunciado, documentación, reglas del agente y skills; implementación y tests (próximos hitos) |

### Dónde ayudó
- Análisis del PDF: requisitos, casos de uso, plan de trabajo.
- Documentación de negocio, UX/UI, arquitectura, testing e integración.
- Reglas del agente (`CLAUDE.md`) y skills, extraídas de la forma de trabajo del autor en `task-manager-client`.

### Decisiones y correcciones humanas principales
| Qué propuso la IA | Qué decidió el autor | Por qué |
|---|---|---|
| Estructura genérica (`domain/`, `ui/`) | Arquitectura modular por features con `screen/`, `services/` (dtos + mappers), hooks y componentes a nivel de feature y de screen | Convención propia, más cohesión |
| Archivos con nombre propio | Un módulo = una carpeta = `index.tsx` | Imports sin repetir nombres |
| `useReducer` + Context | **Zustand** | Selecciones atómicas, menos boilerplate, su stack habitual |
| CSS Modules | **Tailwind CSS v4** | Su stack habitual; tokens de Figma en `@theme` |
| `fetch` propio | Axios + `httpService` + interceptores | Patrón de task-manager |
| — | Formularios con **React Hook Form + Zod**; regla explícita de exports default/named; accesibilidad como requisito | Indicaciones del autor |

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
