<script lang="ts">
	import { error } from '@sveltejs/kit';

    export let form;

    if(!form){
        throw error(400);
    }

    const {data} = form;

    console.log(data);
</script>