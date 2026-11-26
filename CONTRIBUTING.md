# Contributing to Fractoid

This guide covers how to set up the project, check your changes and get them merged.

## Setup

Fractoid uses [pnpm](https://pnpm.io) and the Node version in `.nvmrc` (Node 24).

```bash
pnpm install
pnpm dev
```

`pnpm dev` starts the Vite dev server. `pnpm build` type-checks and builds for production, and `pnpm preview` serves that build.

## Running tests

Tests use [Vitest](https://vitest.dev) with jsdom and live in `test/`, mirroring the layout of `src/`.

```bash
pnpm test:unit        # watch mode
pnpm test:unit run    # single run
```

jsdom has no Web Audio API, so `test/setup.ts` registers mocks from `test/mocks/`. If a test needs browser behaviour the mocks don't have yet, extend the mock to match the real API rather than working around it in the test.

When writing tests:

- Tests should read like normal speech e.g. `it('should not fail', /* ... */)` "it should not fail"
- Avoid real timers and randomness. Use `vi.useFakeTimers()`, and mock `rand` from `@/utils/math` rather than spying on `Math.random`, which `rand` doesn't read at call time.

## Before opening a pull request

Run all of these and make sure they pass:

```bash
pnpm format       # Prettier, src/ only
pnpm lint         # oxlint, then ESLint, both with --fix
pnpm type-check   # vue-tsc, including the tests
pnpm test:unit run
```

`pnpm format` only covers `src/`. Format anything else you touched, such as tests, with `pnpm exec prettier --write <files>`.

If `pnpm type-check` passes but you expected an error, its incremental cache may be stale. Run `pnpm type-check --force`.

## Code style

Prettier handles formatting: no semicolons, single quotes, 2-space indent and 80-column lines. Beyond that, follow the code around you. The full house style, covering naming, arrow functions, imports, Vue components and stores, is written up in [`.claude/skills/fractoid-code-style/SKILL.md`](.claude/skills/fractoid-code-style/SKILL.md).

## Best practices

- **Keep the render loop lean.** The visualizer reads audio data and updates the shader every animation frame. Anything that only changes when an object is created or its config changes must be computed then, not on every frame.
- **Add a test with every bug fix.** It should fail without the fix and pass with it.
- **Keep pull requests focused.** One feature or fix per pull request. Refactors and formatting changes in unrelated code belong in their own pull request.
- **Don't add dependencies lightly.** Check whether the platform or an existing dependency already does the job.
- **Leave no dead code.** Delete unused code instead of commenting it out.

## Branches

Branch names follow [Conventional Branch](https://conventionalbranch.org): a type, a slash, then a short description. `main` is the only branch without a type.

```
<type>/<description>
```

| Type        | Use for                                                                 |
| ----------- | ----------------------------------------------------------------------- |
| `feat/`     | a new feature, or a visible UI change                                   |
| `fix/`      | a bug fix                                                               |
| `hotfix/`   | an urgent fix for the live site                                         |
| `refactor/` | a code change that doesn't change behaviour (a project extension)       |
| `chore/`    | tooling, config, dependencies, docs, or tests that aren't part of a fix |
| `release/`  | preparing a release, such as `release/v1.2.0`                           |

`feat/` and `fix/` are the spec's short aliases for `feature/` and `bugfix/`, used here to match the commit types. `refactor/` isn't in the spec, but the spec allows documented extensions, and refactors get their own pull requests in this project.

The description:

- uses only lowercase letters, numbers, hyphens between words, and dots, as in version numbers;
- never starts or ends with a hyphen or dot, and never has two in a row;
- includes the issue number when there is one, as in `fix/issue-42-empty-bands`.

For example:

```
feat/tab-capture
fix/empty-freq-bands
refactor/band-ranges
chore/cloudflare-migration
```

Branches created by an AI agent use the agent's prefix instead of a type, as the spec defines: `claude/`, `codex/`, `copilot/`, `cursor/`, or `ai/` for any other. That makes AI-generated work visible in review, in line with [AI tooling](#ai-tooling).

## Commit messages

Commits follow [Conventional Commits](https://www.conventionalcommits.org): lowercase, imperative, with no trailing period. An optional scope names the area of the app.

```
<type>(<optional scope>): <description>
```

| Type       | Use for                                     |
| ---------- | ------------------------------------------- |
| `feat`     | a new feature                               |
| `fix`      | a bug fix                                   |
| `refactor` | a code change that doesn't change behaviour |
| `test`     | adding or changing tests                    |
| `style`    | visual or UI styling, not code formatting   |
| `chore`    | tooling, config and dependencies            |

For example:

```
feat: add shader option for formula power
fix(audio): prevent empty freq bands with small fft size
test(audio): add audio analyser tests
```

## AI tooling

Use AI tools sparingly. Their main place in this project is **review**: finding bugs and checking that code is correct. Write the code yourself.

If you do use AI to help with a change:

- Understand every line you submit, and be ready to explain it in review. You are responsible for the change, not the tool.
- Check its claims. Run the code and the tests rather than trusting that it works.
- Hold it to the same standards as any other code: the same style, tests and focused pull requests.
