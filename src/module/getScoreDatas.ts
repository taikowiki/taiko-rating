import { parse } from "node-hiroba";
import type { ScoreData } from "node-hiroba/types";
import type { Writable } from "svelte/store";

export async function getScoreDatas(songs: { songNo: string, hasUra: boolean }[], completed: Writable<number>) {
    let grouped: { songNo: string, hasUra: boolean }[][] = [
        [], [], [], [], [], [], [], [], [], []
    ]

    songs.forEach((song, index) => {
        grouped[Number(index.toString().at(-1))].push(song);
    })

    const scoreDatas: ScoreData[] = [];
    const errors: { songNo: string, hasUra: boolean }[] = [];

    await Promise.all(grouped.map(async (group) => {
        for (const song of group) {
            const bodies: string[] = [];

            try {
                const fetched = await fetch(`https://donderhiroba.jp/score_detail.php?song_no=${song.songNo}&level=4`);
                const body = await fetched.text();
                bodies.push(body);
                if (song.hasUra) {
                    const fetched = await fetch(`https://donderhiroba.jp/score_detail.php?song_no=${song.songNo}&level=5`);
                    const body = await fetched.text();
                    bodies.push(body);
                }
            }
            catch {
                errors.push(song);
                continue;
            }

            const parsed = parse.parseScoreData([bodies, song.songNo]);

            if (!parsed) continue;
            if (parsed.difficulty?.normal) {
                parsed.difficulty.ura = parsed.difficulty.normal;
                delete parsed.difficulty.normal;
            }
            if (parsed.difficulty?.easy) {
                parsed.difficulty.oni = parsed.difficulty.easy;
                delete parsed.difficulty.easy;
            }

            scoreDatas.push(parsed);
            completed.update(e => e + 1);
        }
    }));

    for (const song of errors) {
        const bodies: string[] = [];

        try {
            const fetched = await fetch(`https://donderhiroba.jp/score_detail.php?song_no=${song.songNo}&level=4`);
            const body = await fetched.text();
            bodies.push(body);
            if (song.hasUra) {
                const fetched = await fetch(`https://donderhiroba.jp/score_detail.php?song_no=${song.songNo}&level=5`);
                const body = await fetched.text();
                bodies.push(body);
            }
        }
        catch {
            console.warn(`Error occured in song ${song.songNo}`);
        }

        const parsed = parse.parseScoreData([bodies, song.songNo]);

        if (!parsed) continue;
        if (parsed.difficulty?.normal) {
            parsed.difficulty.ura = parsed.difficulty.normal;
            delete parsed.difficulty.normal;
        }
        if (parsed.difficulty?.easy) {
            parsed.difficulty.oni = parsed.difficulty.easy;
            delete parsed.difficulty.easy;
        }

        scoreDatas.push(parsed);
        completed.update(e => e + 1);
    }

    return scoreDatas;
}