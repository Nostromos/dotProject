import { Octokit, App } from "octokit";
import dotenv from 'dotenv';
import type { RequestParameters } from "@octokit/types";

dotenv.config();

const ok = new Octokit({ auth: process.env.GITHUB_API_AUTH_TOKEN });

// The below function is for later...
async function request(type: any, endpoint: any, options: RequestParameters | undefined) {
  // TODO: Add rate limiting here - ie. if request is rate limited, wait for reset time
  const reqString = `${type} ${endpoint}`;
  
  try {
    const response = await ok.request(reqString, options)

    if (response.status !== 200) {
      throw new Error;
    }

    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export default ok;