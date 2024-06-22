import { build } from 'esbuild';
import sveltePlugin from "esbuild-svelte";
import { sveltePreprocess } from "svelte-preprocess";

const result = await build({
    entryPoints: ['./src/module/rating.ts'],
    bundle: true,
    //minify: true,
    outfile: "./build/rating.js",
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