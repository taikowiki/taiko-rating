import type { ScoreData, DifficultyScoreData } from "node-hiroba/types"

export interface MeasureKr {
    '상수대역': number,
    '상수': number,
    '원본레벨': number,
    'songno': string
    diff: 'oni' | 'ura'
    '곡명': string
    '노트수': number
    maxroll: number;
}

export interface Measure{
    range: number;
    measureValue: number;
    level: number;
    songno: string;
    diff: 'oni'|'ura';
    title: string;
    notes: number;
    maxroll: number;
}

export interface OniUraScoreData extends ScoreData {
    difficulty: Partial<Record<'oni' | 'ura', DifficultyScoreData>>
}