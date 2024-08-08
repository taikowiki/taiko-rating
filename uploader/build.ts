import { build } from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import sveltePreprocess from "svelte-preprocess";

await build({
    plugins: [sveltePlugin({
        preprocess: sveltePreprocess()
    })],
    entryPoints: ['./uploader/src/main.ts'],
    bundle: true,
    platform: 'browser',
    outfile: './build/rating.js'
})

export {};