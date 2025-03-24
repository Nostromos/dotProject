import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import octokit from './githubClient.js';

/**
 * Returns a list of public repos that the user owns.
 * 
 * @remarks This method is needed to get the intial list and *some* pieces (but not all) of data to enrich project information. 
 * 
 * @returns An array of Repository Objects
 */
export async function getAllRepos(): Promise<RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"]> {
  const response = await octokit.rest.repos.listForUser({
    username: 'Nostromos'
  })

  if (response.status !== 200) {
    throw new Error("Github API Error:", response.status);
  }

  return response.data;
}

/**
 * Gets detailed information about one repository.
 * 
 * @param repo - The name of the repository you want more information about
 * 
 * @returns An object containing more detailed Repository information than {@link getAllRepos}
 */
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

