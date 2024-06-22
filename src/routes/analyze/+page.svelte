<script lang="ts">
	import Rating from '$lib/components/rating.svelte';
    import User from '$lib/components/user.svelte';
	import { error } from '@sveltejs/kit';
    import { csv2json } from 'json-2-csv';

	export let form;

    if(!form){
        throw error(400);
    }

    const {data} = form;

    const measures = fetch('https://raw.githubusercontent.com/taikowiki/taiko-fumen-measure-table/main/main.csv')
                    .then(data => data.text())
                    .then(text => csv2json(text))
</script>

<User userData={data.userData} />
{#await measures then measures}
    <Rating {measures} scoreDatas={data.scoreDatas}/>
{/await}
