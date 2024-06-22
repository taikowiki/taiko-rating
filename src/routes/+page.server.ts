import {build}  from 'esbuild';

export async function load({url}){
    const result = await build({
        entryPoints: ['src/lib/module/fetcher.ts'],
        bundle: true,
        minify: true,
        write: false,
        define:{
            "process.env.POSTORIGIN": `"${url.origin}"`
        }
    })

    return{
        code: result.outputFiles[0].text
    }
}