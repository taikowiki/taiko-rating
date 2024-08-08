import type { ScoreData, DifficultyScoreData } from "node-hiroba/types";
export interface Measure {
    '상수대역': number;
    '상수': number;
    '원본레벨': number;
    'songno': string;
    diff: 'oni' | 'ura';
    '곡명': string;
    '노트수': number;
    'bpm': string;
}
export interface OniUraScoreData extends ScoreData {
    difficulty: Partial<Record<'oni' | 'ura', DifficultyScoreData>>;
}
//# sourceMappingURL=types.d.ts.map