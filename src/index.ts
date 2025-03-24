import { getRepo } from "./api/repoFetcher.js"

let response = await getRepo("what.lol");

console.log(response);