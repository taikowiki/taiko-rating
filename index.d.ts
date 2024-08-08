import { Measure, OniUraScoreData } from "./src/types.js";
export declare function getRating(scoreDatas: Record<string, OniUraScoreData> | OniUraScoreData[], measures: Measure[]): {
    rating: number;
    exp: number;
};
export declare function fetchMeasures(): Promise<Measure[]>;
//# sourceMappingURL=index.d.ts.map