/**
 * Initializes and exports an authenticated Octokit client for interacting with the GitHub API.
 *
 * Features:
 * - Loads a personal access token from the environment.
 * - Sets up throttling to handle API rate limits.
 * - Authenticates with the GitHub API and validates the connection.
 *
 * @module githubClient
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

/**
 * Handles primary API rate limits.
 *
 * @param retryAfter - Delay in seconds before retrying the request.
 * @param options - The request options from Octokit.
 * @param octokit - The Octokit instance handling the request.
 * @param retryCount - The number of times this request has been retried.
 * @returns A boolean indicating whether the request should be retried.
 */
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

/**
 * Handles secondary rate limits by logging a warning without retrying.
 *
 * @param retryAfter - Delay in seconds before retrying the request.
 * @param options - The request options from Octokit.
 * @param octokit - The Octokit instance handling the request.
 * @returns A boolean indicating whether the request should be retried (always false).
 */
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

/**
 * Configuration object for the Octokit client.
 */
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
 * Validates that the Octokit client is authenticated by calling the GitHub API.
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

/**
 * The pre-configured and authenticated Octokit instance for interacting with the GitHub API.
 */
export default octokit;