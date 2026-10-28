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
