---
name: fractoid-code-style
description: The house code style for the Fractoid repo (Vue 3 + TypeScript + Pinia + Quasar + WebGL audio visualizer). Use this whenever writing, editing, refactoring or reviewing any code in this project — new functions, classes, Vue components, Pinia stores, constants, types, workers or Vitest tests — even for a one-line change, and even if the user doesn't mention style. Covers whitespace and blank-line rhythm, arrow functions vs methods, naming (files, classes, constants, booleans, handlers, CSS classes), types vs interfaces, imports and barrels, Vue SFC layout, store shape, test layout, commit messages and branch names.
---

# Fractoid code style

New code in this repo should look like it was written by the same person as the code around it. Prettier handles the mechanical formatting; this skill covers what Prettier doesn't decide. When a file you're editing does something differently from what's written here, follow the file: local consistency beats this guide.

## What Prettier and the editor already enforce

Don't fight these, and don't hand-format to them. Write the code and let `pnpm format` (Prettier) settle it.

- No semicolons, single quotes, 2-space indent, no tabs
- `printWidth` 80, trailing commas `es5` (objects/arrays yes, function params no)
- LF line endings, final newline, no trailing whitespace

One consequence of no semicolons: a line starting with `[` or `(` needs a leading `;`, as in `;[a[i], b[j]] = [b[j], a[i]]` in `src/utils/index.ts`.

## Blank lines

The code uses blank lines to separate _steps_, not to pad. That vertical rhythm is the most recognisable thing about the style.

- A blank line after a group of declarations, before the code that uses them.
- A blank line before `return` when the function body has more than one statement.
- A blank line between sibling blocks: `if` blocks, loops, class members, store sections.
- No blank line between a short value and its setter when they read as a pair (in stores: `const playing = ref(false)` directly above `const setPlaying = ...`).
- One blank line between top-level declarations. Never two.

```ts
shuffle() {
  const currentId = this.currentTrack!.id

  this.idsMemo = [...this.ids]

  let randIndex: number

  for (let i = this.ids.length - 1; i >= 0; i--) {
    randIndex = FLOOR(rand(1) * i)

    swap(this.ids, i, this.ids, randIndex)
  }

  this.currentIndex = this.ids.indexOf(currentId)
}
```

## Functions

- **Standalone functions are always `const` arrow functions.** There are no `function` declarations in `src/`. This applies to utils, store internals and `<script setup>` handlers.
- **Classes use method syntax**, not arrow properties: `add(track: AudioTrack) { ... }`.
- Use an **expression body** when the function is a single expression, and a block body otherwise. Utilities are often one-liners that wrap after `=>`:
  ```ts
  export const clamp = (n: number, min: number, max: number): number =>
    MIN(MAX(n, min), max)
  ```
- **Exported utilities declare their return type** (nearly all do). Local handlers and store functions usually let it be inferred.
- Inline callbacks always parenthesise the parameter: `(fn) => fn()`, `(value) => value`.
- When a call or signature doesn't fit on one line, Prettier puts one parameter per line. Let it.
- Short guard clauses may skip braces: `if (!hooks[name]?.hide) return`. Anything with an `else` branch or more than one statement uses braces.

## Naming

| Thing                                 | Convention                                                                                                     | Examples                                                               |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Classes and their files               | PascalCase, one class per file, file named after the class                                                     | `AudioAnalyser.ts`, `TrackList.ts`                                     |
| Vue components                        | PascalCase file and name, grouped in a PascalCase folder when related                                          | `PlaylistItem.vue`, `ShaderControls/ShaderInput.vue`                   |
| Module files holding several exports  | lowercase by domain, kebab-case if multi-word                                                                  | `utils/audio.ts`, `consts/eq-presets.ts`                               |
| Workers                               | `<Name>.worker.ts`                                                                                             | `WaveformVisualizer.worker.ts`                                         |
| Functions and variables               | camelCase                                                                                                      | `getSpectrumWidth`, `bufferToObjectURL`                                |
| Module constants                      | SCREAMING_SNAKE, `_DEFAULT` suffix for default config                                                          | `AUDIO_CHANNELS`, `ANALYSER_CONFIG_DEFAULT`, `VOLUME_DEFAULT`          |
| Aliased `Math` functions              | SCREAMING_SNAKE, destructured once in `utils/math.ts`                                                          | `FLOOR`, `MIN`, `MAX`, `RANDOM`                                        |
| Booleans (state)                      | `is` / `has` prefix                                                                                            | `isShuffled`, `isCurrentTrack`, `hasValue`                             |
| Booleans (visibility, options, props) | named after what they switch on or off: `show*` for visibility, `auto*` / `disable*` / a bare verb for options | `showPlaylist`, `showLabels`, `autoResize`, `disableAttach`, `animate` |
| Setters in stores                     | `set` + name, paired with the ref                                                                              | `setLoading`, `setCurrentTrack`                                        |
| Toggles                               | `toggle` + name                                                                                                | `togglePlayback`, `toggleRepeat`                                       |
| Event handlers in components          | `handle<Thing>` or `on<Thing><Event>`                                                                          | `handleClick`, `handleChange`, `onEditClick`                           |
| Unsubscribe functions                 | returned by `on(...)`, stored as `off` or in `unsubscribeHandlers`                                             | `const off = controller.value!.on(...)`                                |
| Private backing fields                | `_` prefix only when a public getter/setter of the same name exists                                            | `_shuffleTracks` behind `get shuffleTracks()`                          |
| Shader uniforms                       | `u` + PascalCase                                                                                               | `uResolution`, `uRotateScene`, `uCTime`                                |
| Pinia stores                          | `use<Name>Store`, store id is the lowercase name                                                               | `useAudioStore = defineStore('audio', ...)`                            |

Names are spelled out (`frequencyBinCount`, `smoothingTimeConstant`). The exception is tight maths, where short names are fine: `n`, `d`, `i`, `a`/`b`, `min1`/`max1`.

## Types

- **`interface` for object shapes**, especially exported ones (`AnalyserConfig`, `ShaderProgramConfig`).
- **`type` for unions, literal sets, aliases and mapped types** (`AudioChannelID = 0 | 1 | ...`, `ValueOf<T>`, `GraphicEqPreset = Record<...>`).
- **No `enum`.** Use a union type plus a `const` object typed as `Record<Union, Value>`, so the values can be looked up and checked at compile time:
  ```ts
  export const AUDIO_CORE_EVENTS: Record<AudioCoreEvent, AudioCoreEvent> = {
    audioprocess: 'audioprocess',
    // ...
  }
  ```
- Shared types live in `src/types/<domain>.ts` and are re-exported from `src/types/index.ts`. Types used by only one module can stay next to it (`RepeatType` in `AudioController.ts`).
- Long unions break one member per line with a leading `|`. Prettier does this.
- Fixed-length tuples use tuple types: `[number, number]`.
- `tsconfig` has `noUncheckedIndexedAccess` on. The code uses `!` where a value is known to exist (`this.filters[frequency]!`, `controller.value!`) and `?.` / `??` where it might not. Follow that split rather than adding runtime checks for things that can't be missing.

## Imports and modules

- Import through the `@/` alias and the folder barrels: `import { AudioAnalyser } from '@/audio'`, `import { FLOOR } from '@/utils'`. Files inside the same folder import each other by relative path (`import type { AudioTrack } from './AudioTrack'`, `import visibility from './visibility'`), which also avoids circular imports through their own barrel.
- Every folder under `src/` with several modules has an `index.ts` made of `export * from './x'` lines. Add new modules to it.
- Types are imported in their own top-level `import type` statement, never with an inline `type` specifier. When a module provides both values and types, import it twice:

  ```ts
  import { AudioController } from '@/audio'

  import type { RepeatType } from '@/audio'
  ```

  oxlint enforces this (`import/consistent-type-specifier-style` and `typescript/consistent-type-imports`), and `pnpm lint` fixes it.

- Value imports come first, then a blank line, then all type imports. Within each block the order is framework (`vue`, `pinia`, `quasar`), then other packages, then `@/` imports, then relative imports:

  ```ts
  import { computed } from 'vue'
  import { QBtn } from 'quasar'
  import { useAudioStore } from '@/stores/audio'
  import { hhmmss } from '@/utils'

  import type { PropType } from 'vue'
  import type { AudioTrack } from '@/audio'
  ```

  No tool enforces this order, so check it yourself. When you edit a file whose imports don't follow it yet, put its type imports in this order as part of the change.

- Named exports everywhere. The only default export in `src/` is the `visibility` store factory, besides `.d.ts` shims.

## Classes

Members are ordered:

1. Fields, grouped by modifier with a blank line between groups. Most classes put `private` fields (including backing `_fields`) first, then `readonly`, then other public fields. A few lead with `readonly` instead, so follow the file you're in.
2. `constructor`
3. Getters and setters, getter first in each pair
4. Public methods
5. Private helper methods, usually after the public ones

Initialise in the field declaration when the value doesn't depend on constructor arguments (`private ids: string[] = []`). Use `!` definite assignment for fields set later in the constructor (`head!: BiquadFilterNode`). Config objects merge defaults by spreading:

```ts
this.config = {
  ...ANALYSER_CONFIG_DEFAULT,
  ...config,
}
```

Event-emitting classes extend `EventEmitter<Events>` from `@/utils`. Their `on()` returns an unsubscribe function rather than having a separate `off()`.

## Vue components

- Order of blocks: `<template>`, then `<script lang="ts" setup>`, then `<style lang="scss" scoped>`.
- Quasar components are **imported explicitly** from `'quasar'` and used in **PascalCase** in templates (`<QBtn>`, `<QItemSection>`). Their props are written in **camelCase** (`hideBottomSpace`, `labelColor`, `transitionShow`).
- Attribute order in templates is loose. Static `class` usually comes first and `@event` handlers last.
- Leave a blank line between sibling elements that are blocks in their own right (sections, buttons, list items).
- Props use the **runtime object syntax** of `defineProps`, with `PropType` for complex types. Assign it to `props` only when the script reads it:
  ```ts
  const props = defineProps({
    track: {
      type: Object as PropType<AudioTrack>,
      required: true,
    },
  })
  ```
- In `<script setup>`: imports, then store instances (`const audio = useAudioStore()`), then props, then refs/computeds, then handlers, then lifecycle hooks (`onBeforeMount`, `onMounted`, `onBeforeUnmount`) at the bottom.
- Stores are named after their domain, without `Store`: `const audio = useAudioStore()`, `const shaders = useShadersStore()`.
- CSS classes are BEM keyed to the component name: `.PlaylistItem`, `&__missingCover`, `&__controls`. The element part is camelCase. Use Quasar utility classes (`q-pa-sm`, `text-secondary`, `row`) for spacing and colour before writing custom CSS.

## Pinia stores

Stores use the setup-function form: `defineStore('name', () => { ... })`. Inside:

- Each piece of state is a `ref` directly followed by its `set`/`toggle` function, as one group, with a blank line between groups.
- Single-line setters use an arrow body with an assignment in parentheses: `const setLoading = (value: boolean) => (loading.value = value)`.
- Wrapping the underlying controller goes through `controller.value?.method()` and returns its result.
- The return object lists everything the store exposes, one per line.

## Comments

The code is mostly uncommented. Names and small functions carry the meaning. Add a comment only when the _why_ isn't visible in the code: a workaround, a non-obvious constraint, a unit. JSDoc (`/** ... */`) is fine on a private helper whose behaviour has a gotcha. `// @ts-expect-error - <reason>` always includes a reason. Don't leave commented-out code.

## Tests

- Tests live in `test/`, mirroring `src/` (`src/audio/AudioAnalyser.ts` → `test/audio/AudioAnalyser.test.ts`). Browser API mocks go in `test/mocks/` and are registered from `test/setup.ts` with `vi.stubGlobal`.
- One top-level `describe` per class, named after it; nested `describe` per method or area (`'initialization'`, `'band getters'`, `'getFrequency'`).
- `it` titles start with `should`. With `it.each`, use `$field` placeholders in the title so each case names itself.
- A local `setup(...)` arrow function builds the object under test and assigns to `let` variables declared at the top of the `describe`.
- Use `expect(x)` with one argument. oxlint's `valid-expect` rejects a second message argument; parametrise with `it.each` instead.
- Import `describe`, `it`, `expect`, `vi` from `'vitest'`, never from `node:test`.

## Commit messages

Conventional Commits, lowercase, imperative, no trailing period, with an optional scope for the area of the app: `feat: add shader option for formula power`, `fix(audio): prevent empty freq bands with small fft size`, `test(audio): add audio analyser tests`. Types used: `feat`, `fix`, `refactor`, `test`, `chore`, `style` (visual/UI styling changes, not code formatting).

## Branch names

[Conventional Branch](https://conventionalbranch.org): `<type>/<description>`, with `main` as the only branch without a type.

- Types: `feat/`, `fix/`, `hotfix/` (urgent fix for the live site), `refactor/` (a documented project extension), `chore/` (tooling, config, dependencies, docs, standalone tests) and `release/` (such as `release/v1.2.0`). Visible UI changes go under `feat/`. Use the short `feat/` and `fix/`, not `feature/` and `bugfix/`, to match the commit types.
- The description uses only lowercase letters, numbers, single hyphens between words, and dots. It never starts or ends with a hyphen or dot, and has no underscores, spaces or uppercase. Include the issue number when there is one: `fix/issue-42-empty-bands`.
- **When you create a branch yourself, use the `claude/` prefix instead of a type**, as the spec defines for AI agents: `claude/tab-capture`. `CONTRIBUTING.md` asks for AI-generated work to be identifiable in review.
- Don't rename existing branches that predate this convention.

## Before you finish

Format what you touched with Prettier. `pnpm format` only covers `src/`, so for files elsewhere (such as `test/`) run `pnpm exec prettier --write <files>`. Then run `pnpm type-check` and `pnpm lint`, which runs oxlint and then ESLint, both with `--fix`. Read your diff once against the blank-line, naming and import-order rules above. Those are the parts no tool checks.
