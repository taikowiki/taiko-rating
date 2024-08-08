import * as mathjs from 'mathjs';
import type { DifficultyScoreData, Crown } from 'node-hiroba/types';

export function getSongRating(difficultyScoreData: DifficultyScoreData, maxCombo: number, measure: number) {
    const percentage = mathjs.add(mathjs.divide((difficultyScoreData.good * 2 + difficultyScoreData.ok) * 100, maxCombo * 2), mathjs.min(5, mathjs.divide(difficultyScoreData.roll, 100)));
    const compensatedPercentage = getCompensated(percentage);

    return Math.round(measure * compensatedPercentage * getCrownBonus(difficultyScoreData.crown) / 1000);
}

export function getCrownBonus(crown: Crown) {
    switch (crown) {
        case ('played'): {
            return 0.7
        }
        case ('silver'): {
            return 1;
        }
        case ('gold'): {
            return 1.1;
        }
        case ('donderfull'): {
            return 1.15;
        }
        default: {
            return 0
        }
    }
}

export function getCompensated(percentage: number): number {
    const multiplied = percentage * 10000;

    let compensated: number;
    if (multiplied < 600000) {
        compensated = mathjs
            .subtract(
                mathjs.exp(
                    mathjs.multiply(
                        mathjs.divide(mathjs.log(400001), 600000),
                        multiplied,
                    ),
                ),
                1,
            )
            .valueOf();
    } else if (multiplied < 750000) {
        compensated = mathjs
            .add(
                mathjs.multiply(
                    mathjs.divide(5, 3),
                    mathjs.subtract(multiplied, 600000),
                ),
                400000,
            )
            .valueOf();
    } else if (multiplied < 950000) {
        compensated = mathjs
            .add(
                mathjs.multiply(
                    mathjs.divide(3, 2),
                    mathjs.subtract(multiplied, 750000),
                ),
                650000,
            )
            .valueOf();
    } else {
        compensated = mathjs
            .add(
                mathjs.multiply(
                    mathjs.divide(150000, mathjs.log(16)),
                    mathjs.log(
                        mathjs.add(
                            mathjs.divide(
                                mathjs.subtract(multiplied, 950000),
                                10000,
                            ),
                            1,
                        ),
                    ),
                ),
                950000,
            )
            .valueOf();
    }

    return compensated;
}