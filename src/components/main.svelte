<script lang="ts">
    import { writable } from "svelte/store";
    import { getSongs } from "../module/getSongs";
    import {
        getRatings,
        getTotalRating,
        type Rating,
    } from "../module/getRatings";
    import type { CardData, ScoreData } from "node-hiroba/types";
    import { getScoreDatas } from "../module/getScoreDatas";
    import { getMeasures } from "../module/getMeasures";
    import { getUser } from "../module/getUser";

    let scene: "songno" | "crawl" | "result" = "songno";

    const completed = writable(0);
    let totals: number = 0;
    export let scoreDatas: ScoreData[] | undefined = undefined;
    let ratings: Rating[];
    let totalRating: number;
    export let user: CardData | undefined = undefined;;

    async function main() {
        if (!user) {
            user = await getUser();
        }

        const songs = await getSongs();
        totals = songs.length;

        scene = "crawl";

        if (!scoreDatas) {
            scoreDatas = await getScoreDatas(songs, completed);
        }
        ratings = getRatings(scoreDatas, await getMeasures());
        totalRating = getTotalRating(ratings);

        scene = "result";

        console.log(ratings);
    }

    main();
</script>

<div class="container">
    {#if scene === "songno"}
        songNo를 가져오는 중...
    {:else if scene === "crawl"}
        {$completed}/{totals} 완료
    {:else}
        <div>
            {user?.nickname}
            {user?.taikoNumber}
        </div>
        <div>
            <img src={user?.myDon} alt="" />
        </div>
        <div>
            레이팅: {totalRating}
        </div>
        <table>
            <tr>
                <th> songNo </th>
                <th> 곡명 </th>
                <th> diff </th>
                <th> 왕관 </th>
                <th> 정확도 </th>
                <th> 레이팅 </th>
            </tr>
            {#each ratings as rating}
                <tr>
                    <td>
                        {rating.songNo}
                    </td>
                    <td>
                        {rating.title}
                    </td>
                    <td>
                        {rating.diff}
                    </td>
                    <td>
                        {rating.crown}
                    </td>
                    <td>
                        {Math.min(Math.round(rating.accuracy * 10000) / 10000, 105)}%
                    </td>
                    <td>
                        {rating.rating}
                    </td>
                </tr>
            {/each}
        </table>
    {/if}
</div>

<style>
    :default(html, body) {
        height: 99%;
    }

    .container {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    table{
        max-width: 100%;

        border-collapse: collapse;
    }

    th, td {
        text-align: center;
        border: 1px solid black;
    }
</style>
