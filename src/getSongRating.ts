import * as mathjs from 'mathjs';
import type { DifficultyScoreData, Crown } from 'node-hiroba/types';

/**
 * 곡의 레이팅을 계산
 * @param difficultyScoreData 
 * @param maxCombo 
 * @param measureValue 
 * @returns 
 */
export function getSongRating(difficultyScoreData: DifficultyScoreData, maxCombo: number, measureValue: number, maxRoll?: number): {value: number; accuracy: number; measureValue: number;} {
    maxRoll = maxRoll ?? 0;

    const accuracyWithNoBonus = mathjs.divide((difficultyScoreData.good * 2 + difficultyScoreData.ok) * 100, maxCombo * 2);
    const rollBonus = maxRoll === 0 ? 0 : mathjs.divide(difficultyScoreData.roll, maxRoll);

    // 최종 정확도 계산
    const accuracy = maxRoll === 0 ? mathjs.min(101, mathjs.multiply(accuracyWithNoBonus, 1.01)) : mathjs.min(101, mathjs.add(accuracyWithNoBonus, rollBonus));
    const compensatedAccuracy = getCompensated(accuracy);

    const value = Math.round(measureValue * compensatedAccuracy * getCrownBonus(difficultyScoreData.crown) / 1000);

    return {
        value,
        accuracy,
        measureValue
    }
}

/**
 * 왕관 보너스 반환
 * @param crown 
 * @returns 
 */
export function getCrownBonus(crown: Crown) {
    switch (crown) {
        case ('played'): {
            return 0.7
        }
        case ('silver'): {
            return 1;
        }
        case ('gold'): {
            return 1.05;
        }
        case ('donderfull'): {
            return 1.1;
        }
        default: {
            return 0
        }
    }
}

/**
 * 정확도 보정치 계산 함수
 * @param accuracy 
 * @returns 
 */
export function getCompensated(accuracy: number): number {
    const multiplied = accuracy * 10000;

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