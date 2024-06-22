import {build}  from 'esbuild';
import {config} from 'dotenv';

config();

await build({
    entryPoints: ['./src/lib/module/fetcher.ts'],
    bundle: true,
    minify: true,
    outfile: "./src/lib/module/fetcher.txt",
    define:{
        "process.env.POSTORIGIN": `"${process.env.POSTORIGIN}"`
    }
})

console.log('fetcher builded');

export {};