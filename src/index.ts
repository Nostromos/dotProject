import { getLastCommit } from "./api/repoFetcher.js"

let response: any = await getLastCommit("Nostromos", "what.lol");

console.log(response.commit.author.date);