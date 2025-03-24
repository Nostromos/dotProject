import type { Project } from "../types/types.js";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

import octokit from '../api/githubClient.js';

const PROJECT_INFO = ["title", "description", "topics",]


export default function mapInfo(jsonResponse: RestEndpointMethodTypes["repos"]["get"]["response"]["data"]): Partial<Project> {
  const title = jsonResponse.name;
  const description = jsonResponse.description;
  const urls = {
    respository: jsonResponse.html_url,
    demo: jsonResponse.homepage,
    production: jsonResponse.homepage,
  };
  const date_started = jsonResponse.created_at;
  
  return { title, date_started };
}

// TODO: Params should be owner: string and repoName: string
async function getContributors() {
  console.log("👥 Getting contributors...")
  const response = await octokit.request('GET /repos/{owner}/{repo}/collaborators', {
    owner: "Nostromos",
    repo: "what.lol",
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  console.log(response);
  return response.data;
};

// function getTagsAndTopics(topics) {

// };