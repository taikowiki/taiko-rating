import { ScoreData } from "node-hiroba/types";
import { Measure, OniUraScoreData } from "./src/types.js";
import { getSongRating } from "./src/getSongRating.js";
import { csv2json } from "json-2-csv";
import groupBy from "object.groupby";

export function getRating(scoreDatas: Record<string, OniUraScoreData> | OniUraScoreData[], measures: Measure[]) {
    let groupedScoreData: Record<string, ScoreData>;
    if (Array.isArray(scoreDatas)) {
        let grouped = groupBy(scoreDatas, (scoreData) => scoreData.songNo);
        Object.keys(grouped).forEach(songNo => {
            // @ts-expect-error
            grouped[songNo] = grouped[songNo][0]
        })
        groupedScoreData = grouped as unknown as Record<string, ScoreData>;
    }
    else {
        groupedScoreData = scoreDatas
    }

    const songRatingDatas: { songNo: string; difficulty: 'oni' | 'ura'; songRating: {value: number; accuracy: number;}; }[] = [];
    measures.forEach(measure => {
        const difficultyScoreData = groupedScoreData[measure.songno]?.difficulty?.[measure.diff];
        if (!difficultyScoreData) {
            return;
        }

        const songRating = getSongRating(difficultyScoreData, measure['노트수'], measure['상수']);

        songRatingDatas.push({
            songNo: measure.songno,
            difficulty: measure.diff,
            songRating
        })
    })

    songRatingDatas.sort((a, b) => b.songRating.value - a.songRating.value);

    //rating
    let top50Sum = 0;
    for (let i = 0; i < Math.min(50, songRatingDatas.length); i++) {
        top50Sum += songRatingDatas[i].songRating.value;
    }
    const rating = Math.ceil(top50Sum / 50);

    //exp
    let firstSum = 0;
    for (let i = 0; i < Math.min(30, songRatingDatas.length); i++) {
        firstSum += songRatingDatas[i].songRating.value;
    }
    let secondSum = 0;
    if (songRatingDatas.length > 30) {
        for (let i = 30; i < Math.min(50, songRatingDatas.length); i++) {
            secondSum += songRatingDatas[i].songRating.value * 0.9;
        }
    }
    let average = (firstSum + secondSum) / 50;
    let otherSum = 0;
    if (songRatingDatas.length > 50) {
        for (let i = 50; i < Math.min(100, songRatingDatas.length); i++) {
            otherSum += songRatingDatas[i].songRating.value * 0.01;
        }
    }
    if (songRatingDatas.length > 100) {
        for (let i = 100; i < Math.min(150, songRatingDatas.length); i++) {
            otherSum += songRatingDatas[i].songRating.value * 0.001;
        }
    }
    if (songRatingDatas.length > 150) {
        for (let i = 150; i < songRatingDatas.length; i++) {
            otherSum += songRatingDatas[i].songRating.value * 0.0001;
        }
    }
    const exp = Math.ceil(average + otherSum);

    return {
        rating,
        exp,
        songRatingDatas
    }
}

export async function fetchMeasures() {
    return await fetch('https://raw.githubusercontent.com/taikowiki/taiko-fumen-measure-table/main/main.csv')
        .then(data => data.text())
        .then(text => csv2json(text) as (Measure & { "노트수\r"?: number })[])
        .then(measures => {
            if ("노트수\r" in measures[0]) {
                measures.forEach(measure => {
                    const notes = measure['노트수\r'] as number;
                    delete measure['노트수\r'];
                    measure['노트수'] = notes;
                })
            }
            return measures as Measure[];
        })
}
