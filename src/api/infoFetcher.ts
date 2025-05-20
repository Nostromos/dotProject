import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import octokit from './githubClient.js';

// Types
type ListReposParams = RestEndpointMethodTypes["repos"]["listForUser"]["parameters"];
type ListReposResponse = RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"];

type GetRepoParams = RestEndpointMethodTypes["repos"]["get"]["parameters"];
type GetRepoResponse = RestEndpointMethodTypes["repos"]["get"]["response"]["data"];

type ListCollaboratorsParams = RestEndpointMethodTypes["repos"]["listCollaborators"]["parameters"];
type ListCollaboratorsResponse = RestEndpointMethodTypes["repos"]["listCollaborators"]["response"]["data"];

type ListLanguagesParams = RestEndpointMethodTypes["repos"]["listLanguages"]["parameters"];
type ListLanguagesResponse = RestEndpointMethodTypes["repos"]["listLanguages"]["response"]["data"];

type GetTopicsParams = RestEndpointMethodTypes["repos"]["getAllTopics"]["parameters"];
type GetTopicsResponse = RestEndpointMethodTypes["repos"]["getAllTopics"]["response"]["data"];

type ListCommitsParams = RestEndpointMethodTypes["repos"]["listCommits"]["parameters"];
type ListCommitsResponse = RestEndpointMethodTypes["repos"]["listCommits"]["response"]["data"];

/**
 * Gets all public repositories for a given user.
 *
 * @param params - Params including the gh `username`.
 * @returns A list of repo metadata.
 *
 * @example
 * ```ts
 * const repos = await getAllRepos({ username: "Nostromos" });
 * ```
 */
export async function getAllRepos(params: ListReposParams): Promise<ListReposResponse> {
  const response = await octokit.rest.repos.listForUser(params);
  return response.data;
}

/**
 * Retrieves metadata about a specific repository.
 *
 * @remarks
 * This method returns more detailed repository information than {@link getAllRepos}.
 *
 * @param params - The params for identifying the repository - including `owner` and `repo`.
 * @returns A GitHub repo object with more detailed metadata.
 *
 * @example
 * ```ts
 * const repo = await getRepo({ owner: "octocat", repo: "hello-world" });
 * console.log(repo.description);
 * ```
 */
export async function getRepo(params: GetRepoParams): Promise<GetRepoResponse> {
  const response = await octokit.rest.repos.get(params);
  return response.data;
}


/**
 * Lists collaborators on a repo.
 *
 * @param params - Params including `owner` and `repo`.
 * @returns An array of users marked as collaborators.
 */
export async function getCollaborators(params: ListCollaboratorsParams): Promise<ListCollaboratorsResponse> {
  console.log("👥 Getting collaborators...");
  const response = await octokit.rest.repos.listCollaborators(params);
  return response.data;
}

/**
 * Retrieves the languages used in a repository.
 *
 * @param params - Params including `owner` and `repo`.
 * @returns An object mapping each language to its byte size in the codebase.
 */
export async function getRepoLanguages(params: ListLanguagesParams): Promise<ListLanguagesResponse> {
  console.log("🗣️ Getting languages...");
  const response = await octokit.rest.repos.listLanguages(params);
  return response.data;
}

/**
 * Retrieves the list of topics assigned to a repository.
 *
 * @param params - Parameters including `owner` and `repo`.
 * @returns An object containing a `names` array of topic strings.
 */
export async function getTopics(params: GetTopicsParams): Promise<GetTopicsResponse> {
  console.log("🏷️ Getting topics...");
  const response = await octokit.rest.repos.getAllTopics(params);
  return response.data;
}

/**
 * Retrieves the ISO timestamp of the most recent commit on the default branch.
 *
 * @param params - Params including `owner` and `repo`. We also pass `per_page` to limit how many commits are returned.
 * @returns A string ISO timestamp of the most recent commit, or `undefined` if no commits exist.
 */
export async function getLastCommit(params: ListCommitsParams): Promise<ListCommitsResponse | string | undefined> {
  console.log("☑️ Getting last commit...");
  const response = await octokit.rest.repos.listCommits(params);

  const [latestCommit] = response.data;
  if (!latestCommit?.commit?.author?.date) return undefined;

  return latestCommit.commit.author.date;
}
