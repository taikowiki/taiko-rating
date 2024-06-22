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

<button
    on:click={async () => {
        navigator.permissions
            .query({ name: "clipboard-write" })
            .then((result) => {
                if (result.state === "granted" || result.state === "prompt") {
                    try {
                        navigator.clipboard.writeText(JSON.stringify(data));
                        alert("복사 완료");
                    } catch {
                        alert("복사 실패");
                    }
                } else {
                    alert("복사 실패");
                }
            })
            .catch(() => {
                alert("복사 실패");
            });
    }}>점수데이터 복사하기</button
>

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
