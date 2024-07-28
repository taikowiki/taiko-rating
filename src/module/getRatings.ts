import type { ScoreData } from "node-hiroba/types";
import type { Measure } from "./getMeasures";
import { calculateRating } from "./calculateRating";
import * as mathjs from 'mathjs'

export interface Rating {
    songNo: string;
    title: string;
    level: number;
    rating: number;
    diff: string;
    crown: string | null;
    accuracy: number;
}

export function getRatings(scoreDatas: ScoreData[], measures: Measure[]) {
    const ratings: Rating[] = [];

    scoreDatas.forEach(scoreData => {
        const oni = scoreData.difficulty.oni;
        if (oni) {
            const measure = measures.find(measure => `${measure.songno}` === `${scoreData.songNo}` && measure.diff === 'oni');
            if (measure) {
                const rating = {
                    songNo: `${measure.songno}`,
                    title: measure['곡명'],
                    level: measure['원본레벨'],
                    rating: calculateRating(oni, measure['노트수'], measure['상수']),
                    crown: oni.crown,
                    diff: measure.diff,
                    accuracy: mathjs.add(mathjs.divide((oni.good * 2 + oni.ok) * 100, measure['노트수'] * 2), mathjs.min(5, mathjs.divide(oni.roll, 100)))
                }
                ratings.push(rating)
            }
        }

        const ura = scoreData.difficulty.ura;
        if (ura) {
            const measure = measures.find(measure => `${measure.songno}` === `${scoreData.songNo}` && measure.diff === 'ura');
            if (measure) {
                const rating = {
                    songNo: `${measure.songno}`,
                    title: measure['곡명'],
                    level: measure['원본레벨'],
                    rating: calculateRating(ura, measure['노트수'], measure['상수']),
                    crown: ura.crown,
                    diff: measure.diff,
                    accuracy: mathjs.add(mathjs.divide((ura.good * 2 + ura.ok) * 100, measure['노트수'] * 2), mathjs.min(5, mathjs.divide(ura.roll, 100)))
                }
                ratings.push(rating)
            }
        }
    })

    return ratings.sort((a, b) => b.rating - a.rating);
}

export function getTotalRating(ratings: Rating[]): number {
    let firstSum = 0;
    for (let i = 0; i < Math.min(30, ratings.length); i++) {
        firstSum += ratings[i].rating;
    }
    let secondSum = 0;
    if (ratings.length > 30) {
        for (let i = 30; i < Math.min(50, ratings.length); i++) {
            secondSum += ratings[i].rating * 0.9;
        }
    }

    let average = (firstSum + secondSum) / 50;

    let otherSum = 0;
    if (ratings.length > 50) {
        for (let i = 50; i < Math.min(100, ratings.length); i++) {
            otherSum += ratings[i].rating * 0.01;
        }
    }
    if (ratings.length > 100) {
        for (let i = 100; i < Math.min(150, ratings.length); i++) {
            otherSum += ratings[i].rating * 0.001;
        }
    }
    if (ratings.length > 150) {
        for (let i = 150; i < ratings.length; i++) {
            otherSum += ratings[i].rating * 0.0001;
        }
    }

    return Math.round(average + otherSum);
}