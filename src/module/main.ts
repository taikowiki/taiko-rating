import Main from "../components/main.svelte";

async function main() {
    document.body.innerHTML = '';
    document.body.style.backgroundColor = 'white';
    new Main({
        target: document.body
    })
}

main();