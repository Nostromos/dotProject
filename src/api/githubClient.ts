/**
 * Initializes and exports an authenticated Octokit client for interacting with the GitHub API.
 *
 * This module:
 * - Loads a personal access token from the environment
 * - Authenticates the client using `@octokit/auth-token`
 * - Sets up a default user agent
 * - Validates the authentication by calling GitHub's `getAuthenticated` endpoint on load
 */

import { Octokit } from "octokit";
import { throttling } from "@octokit/plugin-throttling";
// import type { ThrottlingOptions } from "@octokit/plugin-throttling";
import dotenv from 'dotenv';
import type { RequestOptions } from "@octokit/types";

dotenv.config();

const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

if (token) {
  console.log("🔑 Loaded token");
} else {
  console.error("❌ GITHUB_PERSONAL_ACCESS_TOKEN not found. Please set it in your .env file.");
  process.exit(1);
};

const handleRateLimit: any = ( // type used to be ThrottlingOptions['onRateLimit'] but it made typescript complain and I couldn't figure it out after 2 hours of debugging
  retryAfter: number,
  options: RequestOptions,
  octokit: InstanceType<typeof MyOctokit>,
  retryCount: number
) => {
  octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);
  if (retryCount < 1) {
    octokit.log.info(`Retrying after ${retryAfter} seconds!`);
    return true;
  };
  return false;
};

const handleSecondaryRateLimit: any = ( // type used to be ThrottlingOptions['onSecondaryRateLimit'] but it made typescript complain
  retryAfter: number,
  options: RequestOptions,
  octokit: InstanceType<typeof MyOctokit>
) => {
  // does not retry, only logs a warning
  octokit.log.warn(
    `SecondaryRateLimit detected for request ${options.method} ${options.url}`,
  );
  return false;
};

const OCTOKIT_CONFIG: MyOctokitOptions = {
  userAgent: "dotp/v0.0.4",
  auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN, // default auth strategy is token - this will change in future
  timeZone: "America/New_York",
  throttle: {
    onRateLimit: handleRateLimit,
    onSecondaryRateLimit: handleSecondaryRateLimit,
  },
};

const MyOctokit = Octokit.plugin(throttling);
type MyOctokitOptions = ConstructorParameters<typeof MyOctokit>[0];
const octokit = new MyOctokit(OCTOKIT_CONFIG);

/**
 * Validates that the Octokit client is authenticated by making a request to the GitHub API.
 * Logs the authenticated username on success or an error message on failure.
 */
export async function checkAuth() {
  try {
    const { data } = await octokit.rest.users.getAuthenticated();
    console.log(`✅ Authenticated as ${data.login}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Authentication failed:", error.message);
    } else {
      console.error("❌ Authentication failed:", error);
    }
  }
}

checkAuth();

export default octokit;