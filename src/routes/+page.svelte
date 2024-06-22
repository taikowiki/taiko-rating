<script lang="ts">
	export let data;
	const { code } = data;
</script>

<div>
	동더히로바에 접속한 후, 주소창에 <code>javascript:</code>를 입력하고 그 뒤에 아래 코드를 붙여넣은
	후 엔터키를 누르세요.
</div>

<button on:click={async () => {
    try{
        await navigator.clipboard.writeText(code);
        alert('복사 성공')
    }
    catch{
        alert('복사 실패')
    }
}}> 복사하기 </button>

<textarea readonly value={code} on:click={(event) => {
    event.currentTarget.select();
}}/>

<style>
	code {
		background-color: rgb(224, 224, 224);
		padding: 4px;
		border-radius: 4px;
	}

    textarea{
        max-width: 100%;
        width: 300px;
        height: 200px;
    }
</style>
