import { csv2json } from "json-2-csv";
import { Measure } from "./types";

/**
 * 상수표 요청
 * @returns 
 */
export async function fetchMeasures() {
    return await fetch('https://raw.githubusercontent.com/taikowiki/taiko-fumen-measure-table/main/main.csv')
        .then(data => data.text())
        .then(text => csv2json(text) as any[])
        .then(measures => {
            const trimedMeasures = measures.map(measure => {
                Object.keys(measure).forEach((key) => {
                    const value = measure[key];
                    delete measure[key];
                    measure[key.trim()] = value;
                });

                if("상수대역" in measure){
                    var measure_: Measure = {
                        range: measure['상수대역'],
                        measureValue: measure['상수'],
                        level: measure['원본레벨'],
                        songno: measure.songno,
                        diff: measure.diff,
                        title: measure['곡명'],
                        notes: measure['노트수'],
                        maxroll: measure.maxroll ?? 0
                    }
                }
                else{
                    var measure_ = measure as Measure;
                }

                return {
                    range: Number(measure_.range),
                    measureValue: Number(measure_.measureValue),
                    level: Number(measure_.level),
                    songno: String(measure_.songno),
                    diff: String(measure_.diff) as 'oni' | 'ura',
                    title: String(measure_.title),
                    notes: Number(measure_.notes),
                    maxroll: Number(measure_.maxroll ?? 0)
                } as Measure
            })

            return trimedMeasures;
        })
}
