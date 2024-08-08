<script lang="ts">
    import createSSC from "styled-svelte-component";
    import hiroba from "node-hiroba";
    import Profile from "./components/profile.svelte";
    import type { CardData, ScoreData } from "node-hiroba/types";
    import { parse } from "node-hiroba";

    const wikiOrigin = "https://localhost:5173";

    const Container = createSSC(
        "div",
        () => `
    width: 100%;
    display:flex;
    flex-direction: column;
    align-items: center;
    `,
    );

    const ErrorDisplay = createSSC(
        "span",
        () => `color:red; font-weight: bold;`,
    );

    let scene: "ready" | "upload" = "ready";

    //message
    let message: string = "";
    let uploadMessage: string = "";
    let counts: number = 0;
    let complete: number = 0;

    //ready
    let sendType: "clear" | "score" = "clear";
    async function send(cardData: CardData, sendType: "clear" | "score") {
        const wikiUser = await (
            await fetch(wikiOrigin + "/api/user", {
                credentials: "include",
            })
        ).json();
        if (wikiUser.logined === false) {
            message = "Wiki Not Logined";
            return;
        }

        try {
            scene = "upload";
            uploadMessage = "";
            if (sendType === "clear") {
                uploadMessage = "Fetching clear data...";
                const clearData = await hiroba.getClearData(null);
                uploadMessage = "Uploading clear data...";
                await fetch(wikiOrigin + "/api/user/donder", {
                    credentials: "include",
                    method: "POST",
                    body: JSON.stringify({
                        donderData: cardData,
                        clearData,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            } else {
                uploadMessage = "Fetching clear data...";
                const clearData = await hiroba.getClearData(null);
                const songNoDatas: { songNo: string; hasUra: boolean }[] = [];
                clearData.forEach((e) => {
                    const hasUra = !(e.difficulty.ura === undefined);
                    songNoDatas.push({
                        songNo: e.songNo,
                        hasUra,
                    });
                });

                counts = clearData.length;
                complete = 0;
                uploadMessage = `Fetch score data... (0/${counts})`;

                let grouped: { songNo: string; hasUra: boolean }[][] = [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                ];
                songNoDatas.forEach((song, index) => {
                    grouped[Number(index.toString().at(-1))].push(song);
                });
                const scoreData: Record<string, ScoreData> = {};
                const errors: { songNo: string; hasUra: boolean }[] = [];
                await Promise.all(
                    grouped.map(async (group) => {
                        for (const song of group) {
                            const response: any = {
                                songNo: song.songNo,
                                body: {},
                            };

                            try {
                                const fetched = await fetch(
                                    `https://donderhiroba.jp/score_detail.php?song_no=${song.songNo}&level=4`,
                                );
                                const body = await fetched.text();
                                response.body.oni = body;
                                if (song.hasUra) {
                                    const fetched = await fetch(
                                        `https://donderhiroba.jp/score_detail.php?song_no=${song.songNo}&level=5`,
                                    );
                                    const body = await fetched.text();
                                    response.body.ura = body;
                                }
                            } catch {
                                errors.push(song);
                                continue;
                            }

                            const parsed = parse.parseScoreData(response);

                            if (parsed) {
                                scoreData[song.songNo] = parsed;
                                complete++;
                                uploadMessage = `Fetch score data... (${complete}/${counts})`;
                            }
                        }
                    }),
                );

                for (const song of errors) {
                    const response: any = {
                        songNo: song.songNo,
                        body: {},
                    };

                    try {
                        const fetched = await fetch(
                            `https://donderhiroba.jp/score_detail.php?song_no=${song.songNo}&level=4`,
                        );
                        const body = await fetched.text();
                        response.body.oni = body;
                        if (song.hasUra) {
                            const fetched = await fetch(
                                `https://donderhiroba.jp/score_detail.php?song_no=${song.songNo}&level=5`,
                            );
                            const body = await fetched.text();
                            response.body.ura = body;
                        }
                    } catch {
                        errors.push(song);
                        continue;
                    }

                    const parsed = parse.parseScoreData(response);

                    if (parsed) {
                        scoreData[song.songNo] = parsed;
                        complete++;
                        uploadMessage = `Fetch score data... (${complete}/${counts})`;
                    }
                }

                await fetch(wikiOrigin + "/api/user/donder", {
                    credentials: "include",
                    method: "POST",
                    body: JSON.stringify({
                        donderData: cardData,
                        clearData,
                        scoreData,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            }

            message = "Upload completed";
            scene = "ready";
            return;
        } catch (err) {
            console.warn(err);
            message = "Upload Error";
            scene = "ready";
            return;
        }
    }

    //upload
</script>

<Container>
    {#await hiroba.getCurrentLogin(null)}
        Loading...
    {:then cardData}
        {#if scene === "ready"}
            {#if message}
                <ErrorDisplay>{message}</ErrorDisplay>
            {/if}
            <Profile {cardData} />
            <label>
                <input type="radio" bind:group={sendType} value="clear" />
                Upload only clear data.
            </label>
            <label>
                <input type="radio" bind:group={sendType} value="score" />
                Upload both clear data and score data.
            </label>
            <button
                on:click={() => {
                    send(cardData, sendType);
                }}
            >
                Upload
            </button>
        {:else if scene === "upload"}
            {uploadMessage}
        {/if}
    {:catch}
        <ErrorDisplay>Not Logined</ErrorDisplay>
    {/await}
</Container>
