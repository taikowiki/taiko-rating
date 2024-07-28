import { parse } from "node-hiroba";

export async function getUser() {
    const fetched = await fetch('https://donderhiroba.jp');
    const body = await fetched.text();
    const parsed = parse.parseCurrentLogin(body);
    parsed.nickname = parsed.nickname.replace(/\n/g, '').replace(/\t/g, '');
    return parsed;
}