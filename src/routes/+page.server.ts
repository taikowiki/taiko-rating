export async function load(){
    return{
        code: (await import('$lib/module/fetcher.txt?raw')).default
    }
}