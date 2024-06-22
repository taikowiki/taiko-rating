<script lang="ts">
    import Rating from "./rating.svelte";
    import User from "./user.svelte";

    export let data: any;
    export let measures: any;
</script>

<svelte:head>
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, user-scalable=yes"
    />
    <style>
        body {
            background-color: white !important;
        }
    </style>
</svelte:head>

<div>
    <User userData={data.userData} />
    <Rating {measures} scoreDatas={data.scoreDatas} />
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>
