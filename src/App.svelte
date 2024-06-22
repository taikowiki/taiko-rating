<script lang="ts">
    import Display from "./components/display.svelte";
    import { data } from "./module/sample";
    import { csv2json } from "json-2-csv";

    async function getMeasures() {
        return await fetch(
            "https://raw.githubusercontent.com/taikowiki/taiko-fumen-measure-table/main/main.csv",
        )
            .then((data) => data.text())
            .then((text) => csv2json(text));
    }
</script>

{#await getMeasures() then measures}
    <Display {data} {measures} />
{/await}
