import { getAllRepos, getRepo, getCollaborators, getRepoLanguages, getTopics, getLastCommit } from "../api/repoFetcher.js";

export async function processOneUser(userName: string) {
  try {
    const allRepos = await getAllRepos({ username: userName });
    const detailedRepos = new Array(allRepos.length);
    
    for (let repo of allRepos) {
      const oneRepo = await getRepo({
        owner: repo.owner.login,
        repo: repo.name
      });
      detailedRepos.push(oneRepo);
      console.log(detailedRepos);
      break;
    }
  } catch (err) {
    console.error(err);
  }
};

processOneUser('Nostromos');