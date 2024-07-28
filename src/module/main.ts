import Main from "../components/main.svelte";

async function main() {
    document.body.innerHTML = '';
    new Main({
        target: document.body
    })
}

main();