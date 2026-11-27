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

## How it's deployed

The site is a static Vite build served by a Cloudflare Worker. The default tracks live in a private R2 bucket.

The Worker:

- **`/api/tracks`** lists the MP3s in the bucket and reads each one's ID3 tag and MP3 header with ranged R2 reads, so it returns titles, artists, durations and artwork URLs without downloading the audio. The response is cached at the edge.
- **`/api/artwork/:name`** returns the cover art embedded in a track's tag.
- **`/api/audio/:name`** streams the tracks, with `Range` support for seeking.

All three only answer same-origin requests, and none of them write to the bucket. Everything else is served as static assets, without running Worker code.

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
- "Lost Time" by Evening Land
- "Stars" by JVNA
