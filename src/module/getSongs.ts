import { parse } from 'node-hiroba';

export async function getSongs() {
    const bodies: string[] = [];

    const failedGenres: number[] = [];

    await Promise.all([1, 2, 3, 4, 5, 6, 7, 8].map(async (genre) => {
        try {
            const fetched = await fetch(`https://donderhiroba.jp/score_list.php?genre=${genre}`);
            const body = await fetched.text();
            bodies.push(body);
        }
        catch{
            failedGenres.push(genre);
        }
    }))

    await Promise.all(failedGenres.map(async(genre) => {
        try{
            const fetched = await fetch(`https://donderhiroba.jp/score_list.php?genre=${genre}`);
            const body = await fetched.text();
            bodies.push(body);
        }
        catch{
            console.warn(`Error occured in genre ${genre}`)
        }
    }))

    const parsed = parse.parseClearData(bodies);

    return [...new Set(parsed.map((clearData) => {
        return {
            songNo: clearData.songNo,
            hasUra: clearData.difficulty.ura !== undefined
        }
    }))]
}