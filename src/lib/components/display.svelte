<script lang="ts">
	import Rating from './rating.svelte';
	import User from './user.svelte';

	export let data: any;
	export let measures: any;
</script>

<svelte:head>
    <style>
        body{
            background-color: white !important;
        }
    </style>
</svelte:head>

<div>
	<User userData={data.userData} />
	<Rating {measures} scoreDatas={data.scoreDatas} />
</div>

<style>
    div{
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>