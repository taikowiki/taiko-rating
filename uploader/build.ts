import { build } from 'esbuild';
import sveltePlugin from 'esbuild-svelte';

await build({
    plugins: [sveltePlugin()],
    entryPoints: ['./uploader/src/main.ts'],
    bundle: true,
    platform: 'browser',
    outdir: './build'
})

export {};