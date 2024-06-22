<script lang="ts" context="module">
	function getCompensated(score: number): number {
		if (score < 600000) {
			return mathjs
				.subtract(
					mathjs.exp(
						mathjs.multiply(
							mathjs.divide(mathjs.log(400001), 600000),
							score,
						),
					),
					1,
				)
				.valueOf();
		} else if (score < 750000) {
			return mathjs
				.add(
					mathjs.multiply(
						mathjs.divide(5, 3),
						mathjs.subtract(score, 600000),
					),
					400000,
				)
				.valueOf();
		} else if (score < 950000) {
			return mathjs
				.add(
					mathjs.multiply(
						mathjs.divide(3, 2),
						mathjs.subtract(score, 750000),
					),
					650000,
				)
				.valueOf();
		} else {
			return mathjs
				.add(
					mathjs.multiply(
						mathjs.divide(150000, mathjs.log(16)),
						mathjs.log(
							mathjs.add(
								mathjs.divide(
									mathjs.subtract(score, 950000),
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
	}

	function getRating(
		ratings: {
			songNo: string;
			difficulty: string;
			score: number;
			rating: number;
			title: string;
			crown: string;
		}[],
	): number {
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
</script>

<script lang="ts">
	import * as mathjs from "mathjs";

	export let measures: any[];
	export let scoreDatas: any[];

	const ratings: {
		songNo: string;
		difficulty: string;
		score: number;
		rating: number;
		title: string;
		crown: string;
	}[] = [];

	scoreDatas.forEach((song) => {
		const filteredMeasures = measures.filter(
			(measure) => measure.songno.toString() === song.songNo,
		);

		if (filteredMeasures.length === 0) {
			return;
		}

		Object.keys(song.difficulty).forEach((diff) => {
			const measure = filteredMeasures.find((m) => m.diff === diff);
			if (!measure) {
				return;
			}

			const difficulty = song.difficulty[diff];

			let bonus = 1;
			if (difficulty.crown === "silver") {
				bonus = 1.1;
			} else if (difficulty.crown === "gold") {
				bonus = 1.3;
			} else if (difficulty.crown === "donderfull") {
				bonus = 1.45;
			}

			ratings.push({
				songNo: song.songNo,
				difficulty: diff,
				score: difficulty.score,
				rating: Math.round(
					mathjs
						.multiply(
							measure["상수"],
							getCompensated(difficulty.score),
							bonus,
						)
						.valueOf() / 1000,
				),
				title: measure["곡명"],
				crown: difficulty.crown,
			});
		});
	});

	ratings.sort((a, b) => b.rating - a.rating);

	console.log(ratings);
</script>

<div>
	레이팅: {getRating(ratings)}
</div>

<table>
	<tr>
		<th> 곡 번호 </th>
		<th> 곡명 </th>
		<th> 난이도 </th>
		<th> 점수 </th>
		<th> 왕관 </th>
		<th> 레이팅 </th>
	</tr>
	{#each ratings as rating}
		<tr>
			<td>
				{rating.songNo}
			</td>
			<td>
				{rating.title}
			</td>
			<td>
				{rating.difficulty}
			</td>
			<td>
				{rating.score}
			</td>
			<td>
				{rating.crown}
			</td>
			<td>
				{rating.rating}
			</td>
		</tr>
	{/each}
</table>

<style>
	table {
		border-collapse: collapse;
	}

	th,
	td {
		border: 1px solid black;
	}
</style>
