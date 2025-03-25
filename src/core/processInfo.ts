import type { Project } from "../types/types.js";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

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