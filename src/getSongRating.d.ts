import type { DifficultyScoreData, Crown } from 'node-hiroba/types';
export declare function getSongRating(difficultyScoreData: DifficultyScoreData, maxCombo: number, measure: number): number;
export declare function getCrownBonus(crown: Crown): 1 | 0.7 | 1.1 | 1.15 | 0;
export declare function getCompensated(percentage: number): number;
//# sourceMappingURL=getSongRating.d.ts.map