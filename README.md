# ![Fractoid Logo](./public/favicon-32x32.png) Fractoid

An audio visualizer app built with Vue & WebGL. A Julia set fractal, rendered in a fragment shader, moves and changes colour with the music.

View live at [fractoid.dev](https://fractoid.dev)

## Features

- **Fractal visualizer:** a Julia set shader whose shape, colour and scene respond to seven frequency bands, from sub-bass to brilliance.
- **Shader controls:** tune the fractal, colours and scene, and link any setting to a frequency band.
- **Your own music:** add audio files from your computer, by picking them or dropping them onto the app.
- **Playlist and playback:** shuffle, repeat, and a 12-band graphic equalizer with presets.
- **Waveform:** a live waveform, drawn in a Web Worker on an offscreen canvas.

## Built with

- [Vue 3](https://vuejs.org), [TypeScript](https://www.typescriptlang.org), [Pinia](https://pinia.vuejs.org) and [Quasar](https://quasar.dev)
- WebGL with a GLSL fragment shader for the fractal
- The Web Audio API for analysis and equalization
- [Vite](https://vite.dev) and [Vitest](https://vitest.dev)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) and [R2](https://developers.cloudflare.com/r2/) for hosting, with [Hono](https://hono.dev) in the Worker

### AI usage

Everything up to the [`hand-written`](https://github.com/SeanFree/Fractoid/tree/hand-written) tag (March 2026) was written by hand, without AI assistance. Since November 2026 I've used Claude Code to assist with specific features, such as migrating from Netlify to Cloudflare and some performance fixes.

All AI-assisted work follows the same process. I pitch an idea to Claude for feasibility and value. If the idea is sound then Claude creates a detailed plan. I review, revise and approve the plan before any code is written. The code is written in small batches either by me or Claude, then I review and test each batch until the plan is complete.

## How it's deployed

The site is a static Vite build served by a Cloudflare Worker. The default tracks live in a private R2 bucket. The Worker serves them at `/audio/*` on the same origin, and refuses requests from other sites. Everything else is served as static assets, without running Worker code.

Pushes to `main` are built and deployed by [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/). Lint, tests and type-check run as part of the build, so a failing commit is never deployed. Other branches get preview URLs.

## Development

```bash
pnpm install
pnpm exec wrangler login
pnpm dev
```

`pnpm dev` runs the app and the Worker together through the [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/). It reads the default tracks from the real R2 bucket, which is why it needs `wrangler login` and access to the Cloudflare account.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for tests, checks, code style and commit conventions.

## Music

The default tracks are from the [YouTube Audio Library](https://www.youtube.com/audiolibrary):

- "New Moon" by Bad Snacks
- "Subway Dreams" by Dan Henig
- "Ebb and Flow" by Dyalla
- "Lost Time" by Eveningland
- "Stars" by JVNA
