# 🛒 Classora TPV — Frontend (React 19)

Pantalla de **caja de supermercado** para la prueba técnica de Classora Technologies (UX/UI + Front).
Prioridades: **rapidez de uso, legibilidad, accesibilidad y prevención de errores**.

> Backend relacionado: `prueba-tecnica-classora-be` (Spring Boot · Hexagonal · DDD).

## 📚 Documentación

| Doc | Contenido |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | **Reglas obligatorias**: arquitectura, exports default/named, Zustand, RHF + Zod, Tailwind v4, accesibilidad, testing |
| [`AI_LOG.md`](AI_LOG.md) | Registro cronológico del uso de IA (entregable de la Parte 4) |
| [`docs/01-negocio-y-requisitos.md`](docs/01-negocio-y-requisitos.md) | Contexto de negocio, alcance, RF, RNF, reglas de negocio, glosario |
| [`docs/02-casos-de-uso.md`](docs/02-casos-de-uso.md) | Casos de uso con flujos alternativos y trazabilidad |
| [`docs/03-ux-ui.md`](docs/03-ux-ui.md) | Principios, layout, frames de Figma, tokens `@theme`, componentes, microcopy, a11y |
| [`docs/04-arquitectura.md`](docs/04-arquitectura.md) | Features, árbol de carpetas, dominio, store, formularios, services/DTO/mappers, ADRs |
| [`docs/05-testing.md`](docs/05-testing.md) | Unit (happy path), integración con MSW, E2E con Playwright + axe |
| [`docs/06-integracion-backend.md`](docs/06-integracion-backend.md) | Contrato con la API Java, errores, fases de integración |
| [`docs/07-roadmap.md`](docs/07-roadmap.md) | Plan de trabajo por hitos |

## 🧰 Stack
React 19 (React Compiler) · TypeScript · Vite · Zustand · TanStack Query · Axios · React Hook Form · Zod · Tailwind CSS v4 · lucide-react · sonner · Vitest · React Testing Library · MSW · Playwright · oxlint · Prettier · Husky · commitlint

## ▶️ Ejecutar *(se completará al implementar)*

```bash
pnpm install
pnpm local            # http://localhost:3000 (MSW activo)
pnpm test             # unit + integración
pnpm e2e              # Playwright
pnpm typecheck && pnpm lint && pnpm format:check
```

## 🔗 Entregables
- Figma: _(pendiente)_
- Demo: _(pendiente)_
