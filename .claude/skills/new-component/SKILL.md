---
name: new-component
description: Crea un componente React (ui compartido, de feature o de screen) con carpeta kebab-case + index.tsx, su hook, schema RHF+Zod si es un formulario, Tailwind v4, accesibilidad y test unitario. Usar siempre que haya que crear un componente o screen.
---

# new-component

## 1. Ubicación (en este orden)
1. ¿Solo lo usa una screen? → `src/features/<feature>/screen/components/<name>/`
2. ¿Varias partes de la feature? → `src/features/<feature>/components/<name>/`
3. ¿Varias features y sin negocio? → design system con **Atomic Design** (`CLAUDE.md` §2.4): elegir el nivel (`atoms` · `molecules` · `organisms` · `templates`) → `src/shared/components/ui/<nivel>/<name>/` + `export * from './<name>'` en el barrel del nivel (`<nivel>/index.ts`). Solo importa de niveles inferiores; nada de negocio, store ni services.
Empieza en el nivel más bajo; subir es fácil.

## 2. Estructura (kebab-case)
```
<name>/
├── index.tsx            # componente (pinta)
├── index.test.tsx       # unit happy path
├── hooks/index.ts       # (si tiene lógica) use<Name>: estado, store, queries, RHF
├── hooks/index.test.ts
└── schema/index.ts      # (si es un formulario) schema Zod — export default
```

## 3. Exports (CLAUDE.md §2.2)
- Componente de feature/screen: `export const SaleTable: React.FC<Props> = …;` **y** `export default SaleTable;`
- Componente `ui`: **solo named** (`export const Button = React.forwardRef…`; `Button.displayName = 'Button'`).
- Hook: `const useSaleTable = () => {…}; export default useSaleTable;`
- Schema: `const ScanSchema = z.object({…}); export default ScanSchema;`

## 4. Plantilla de componente de screen
```tsx
import React from 'react';
import { Button } from '@shared/components/ui';
import useScanForm from './hooks';

export const ScanForm: React.FC = () => {
  const { register, errors, submit, isSubmitting } = useScanForm();

  return (
    <form onSubmit={submit} noValidate aria-label="Añadir producto">
      <label htmlFor="scan-code" className="text-base font-medium text-ink">Código de producto</label>
      <input
        id="scan-code"
        autoFocus
        inputMode="numeric"
        autoComplete="off"
        aria-invalid={!!errors.code}
        aria-describedby={errors.code ? 'scan-code-error' : undefined}
        className={cn('min-h-target text-scan …', errors.code && 'border-danger')}
        {...register('code')}
      />
      {errors.code && (
        <p id="scan-code-error" role="alert" className="text-danger">{errors.code.message}</p>
      )}
      <Button type="submit" isLoading={isSubmitting}>Añadir</Button>
    </form>
  );
};

export default ScanForm;
```

## 5. Reglas
- **Pinta, no decide**: sin Axios, sin services, sin lógica de negocio. Todo en su hook / store / models.
- Recibe **modelos de dominio**, nunca DTOs.
- Tailwind v4 con tokens (`bg-primary`, `text-total`), `cn()` para condicionales, sin valores arbitrarios ni `@apply`. Variantes en objetos `variants`/`sizes`.
- **Accesibilidad** (skill `react-a11y`): elemento nativo correcto, nombre accesible, `focus-visible:ring-4 focus-visible:ring-focus`, `min-h-target`, errores con `role="alert"` + `aria-describedby`, no comunicar solo con color, `motion-safe:` en animaciones.
- Formularios: RHF + Zod en el hook (skill `react-hook-form-zod`).
- Sin `useMemo`/`useCallback`/`React.memo` (React Compiler).
- ≤ ~150 líneas; si crece, extraer subcomponentes a `components/`.
- TSDoc en props públicas de componentes `ui`.

## 6. Test (skill `write-tests`)
`describe('Checkout: ScanForm')`, AAA, queries por rol/label, `user-event`.

## 7. Checklist
- [ ] Ubicación y exports correctos.
- [ ] Nombre igual que en Figma (`docs/03-ux-ui.md §5`).
- [ ] Teclado + lector de pantalla verificados.
- [ ] Test happy path en verde.
