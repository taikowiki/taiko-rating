<script>
    import Main from "./components/main.svelte";

    import {data as sample} from './module/sample.js'
</script>

<Main
    user={sample.userData}
    scoreDatas={sample.scoreDatas}
/>