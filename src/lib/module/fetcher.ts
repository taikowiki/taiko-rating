import { parse } from 'node-hiroba';
import { csv2json } from 'json-2-csv';
import User from '$lib/components/user.svelte';
import Rating from '$lib/components/rating.svelte';
import Display from '$lib/components/display.svelte';

function createDialog() {
    const background = document.createElement('div');

    background.style.position = 'fixed';
    background.style.top = '0';
    background.style.left = '0';
    background.style.backgroundColor = 'gray';
    background.style.width = '100%';
    background.style.minHeight = '100%';
    background.style.zIndex = '10000';

    const dialog = document.createElement('div');

    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';

    dialog.style.width = 'min(500px, 100%)';
    dialog.style.minHeight = 'min(500px, 100%)';

    dialog.style.backgroundColor = 'white';
    dialog.style.border = '2px solid black';
    dialog.style.borderRadius = '10px';

    dialog.style.display = 'flex';
    dialog.style.flexDirection = 'column';
    dialog.style.justifyContent = 'center';
    dialog.style.alignItems = 'center';

    dialog.style.zIndex = '10001';

    document.body.appendChild(background);
    document.body.appendChild(dialog);

    return dialog;
}

async function getUser() {
    const fetched = await fetch('https://donderhiroba.jp');
    const body = await fetched.text();
    const parsed = parse.parseCurrentLogin(body);
    parsed.nickname = parsed.nickname.replace(/\n/g, '').replace(/\t/g, '');
    return parsed;
}

async function getSongNos() {
    const bodies: string[] = [];
    await Promise.all([1, 2, 3, 4, 5, 6, 7, 8].map(async (genre) => {
        const fetched = await fetch(`https://donderhiroba.jp/score_list.php?genre=${genre}`);
        const body = await fetched.text();
        bodies.push(body);
    }))

    const parsed = parse.parseClearData(bodies);

    return [...new Set(parsed.map((clearData) => clearData.songNo))]
}

async function getScoreDatas(songNos: string[], dialog: HTMLDivElement) {
    let grouped: string[][] = [
        [], [], [], [], [], [], [], [], [], []
    ]

    songNos.forEach((songNo, index) => {
        grouped[Number(index.toString().at(-1))].push(songNo);
    })

    let scoreDatas: any[] = [];

    let completed = 0;

    dialog.innerHTML = `${completed}/${songNos.length} 완료`;

    await Promise.all(grouped.map(async (group) => {
        for (const songNo of group) {
            const bodies: string[] = [];
            for (const diff of [4, 5]) {
                const fetched = await fetch(`https://donderhiroba.jp/score_detail.php?song_no=${songNo}&level=${diff}`);
                const body = await fetched.text();
                bodies.push(body);
            }
            const parsed = parse.parseScoreData([bodies, songNo]);

            if (!parsed) continue;
            if (parsed.difficulty?.normal) {
                parsed.difficulty.ura = parsed.difficulty.normal;
                delete parsed.difficulty.normal;
            }
            if (parsed.difficulty?.easy) {
                parsed.difficulty.oni = parsed.difficulty.easy;
                delete parsed.difficulty.easy;
            }

            scoreDatas.push(parsed);
            completed++;
            dialog.innerHTML = `${completed}/${songNos.length} 완료`;
        }
    }));

    return scoreDatas;
}

async function getMeasures() {
    return await fetch('https://raw.githubusercontent.com/taikowiki/taiko-fumen-measure-table/main/main.csv')
        .then(data => data.text())
        .then(text => csv2json(text))
}

async function main() {
    const dialog = createDialog();

    dialog.innerHTML = '유저 데이터를 가져오는 중...';
    let userData;
    try {
        userData = await getUser();
    }
    catch (err) {
        console.warn(err);
        dialog.innerHTML = '에러가 발생했습니다.';
        return;
    }

    dialog.innerHTML = 'song no를 가져오는 중...'
    let songNos;
    try {
        songNos = await getSongNos();
    }
    catch (err) {
        console.warn(err);
        dialog.innerHTML = '에러가 발생했습니다.';
        return;
    }
    dialog.innerHTML = 'song no 가져오기 완료!'

    let scoreDatas;
    try {
        scoreDatas = await getScoreDatas(songNos, dialog)
    }
    catch (err) {
        console.warn(err);
        dialog.innerHTML = '에러가 발생했습니다.';
        return;
    }

    dialog.innerHTML = '';

    const data = {
        userData,
        scoreDatas
    };

    const measures = await getMeasures();

    document.body.innerHTML = '';

    new Display({
        target: document.body,
        props: {
            data,
            measures
        }
    })
}

main();