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
    import { getCrownBonus } from "../module/calculateRating";

    let scene: "songno" | "crawl" | "result" = "songno";

    const completed = writable(0);
    let totals: number = 0;
    export let scoreDatas: ScoreData[] | undefined = undefined;
    let ratings: Rating[];
    let totalRating: number;
    export let user: CardData | undefined = undefined;
    let max100: number;
    let max105: number;

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
        const measures = await getMeasures();
        ratings = getRatings(scoreDatas, measures);
        totalRating = getTotalRating(ratings);

        let max100Ratings: Rating[] = [];
        measures.forEach((measure) => {
            const r: Rating = {
                songNo: `${measure.songno}`,
                title: measure["곡명"],
                level: measure["원본레벨"],
                diff: measure["diff"],
                crown: "donderful",
                accuracy: 100,
                rating: Math.round(
                    (measure["상수"] * 1000000 * getCrownBonus("donderfull")) /
                        1000,
                ),
            };
            max100Ratings.push(r)
        });
        max100 = getTotalRating(max100Ratings);

        let max105Ratings: Rating[] = [];
        measures.forEach((measure) => {
            const r: Rating = {
                songNo: `${measure.songno}`,
                title: measure["곡명"],
                level: measure["원본레벨"],
                diff: measure["diff"],
                crown: "donderful",
                accuracy: 105,
                rating: Math.round(
                    (measure["상수"] * 1050000 * getCrownBonus("donderfull")) /
                        1000,
                ),
            };
            max105Ratings.push(r)
        });
        max105 = getTotalRating(max105Ratings);

        scene = "result";
    }

    async function copy() {
        navigator.permissions
            //@ts-expect-error
            .query({ name: "clipboard-write" })
            .then((result) => {
                if (result.state === "granted" || result.state === "prompt") {
                    try {
                        const data = {
                            userData: user,
                            scoreDatas,
                        };

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
        <div>
            <button on:click={copy}>점수데이터 복사하기</button>
        </div>
        <div>
            정확도 100% 이론치: {max100}
        </div>
        <div>
            정확도 105% 이론치: {max105}
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
                        {Math.min(
                            Math.round(rating.accuracy * 10000) / 10000,
                            105,
                        )}%
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

        background-color: white;
    }

    .container {
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    table {
        max-width: 100%;

        border-collapse: collapse;
    }

    th,
    td {
        text-align: center;
        border: 1px solid black;
    }
</style>
