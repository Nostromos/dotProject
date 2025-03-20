import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import octokit from './githubClient.js';

export async function getAllRepos(): Promise<RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"]> {
  const response = await octokit.rest.repos.listForUser({
    username: 'Nostromos'
  })

  if (response.status !== 200) {
    throw new Error("Github API Error:", response.status);
  }

  return response.data;
}

export async function getRepo(repo: string): Promise<RestEndpointMethodTypes["repos"]["get"]["response"]["data"]> {
  const response = await octokit.rest.repos.get({
    owner: 'Nostromos',
    repo: repo,
  });

  if (response.status !== 200) {
    throw new Error("Github API Error:", response.status);
  }

  return response.data;
}

let test = await getRepo("Jammming");
console.log(test);