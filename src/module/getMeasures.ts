import { csv2json } from "json-2-csv"

export interface Measure {
    '상수대역': number,
    '상수': number,
    '원본레벨': number,
    'songno': number
    diff: 'oni' | 'ura'
    '곡명': string
    '노트수': number
    'bpm': string
}

export async function getMeasures(): Promise<Measure[]> {
    return await fetch('https://raw.githubusercontent.com/taikowiki/taiko-fumen-measure-table/main/main.csv')
        .then(data => data.text())
        .then(text => csv2json(text) as Measure[])
}