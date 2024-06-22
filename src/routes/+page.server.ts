export async function load({url}){
    return{
        code: `(async() => {const fetched = await fetch('${url.origin}/rating.js');const script = await fetched.text();(new Function(script))();})();`
    }
}