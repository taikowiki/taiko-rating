import { build } from 'esbuild';
import { config } from 'dotenv';
import sveltePlugin from "esbuild-svelte";
import { sveltePreprocess } from "svelte-preprocess";

config();

const result = await build({
    entryPoints: ['./src/lib/module/fetcher.ts'],
    bundle: true,
    //minify: true,
    outfile: "./static/rating.js",
    plugins: [
        sveltePlugin({
            preprocess: sveltePreprocess(),
            compilerOptions: {
                customElement: true
            }
        })
    ],
    charset: 'utf8',
    ignoreAnnotations: true,
})

console.log('fetcher builded');

export { };