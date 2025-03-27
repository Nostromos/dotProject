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
import { createTokenAuth } from "@octokit/auth-token";
import dotenv from 'dotenv';

dotenv.config();
console.log("🔑 Loaded token");
const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

if (!token) throw new Error("❌ GITHUB_PERSONAL_ACCESS_TOKEN not loaded into env");

const auth = createTokenAuth(token);
const GITHUB_AUTH_TOKEN = await auth();

const OCTOKIT_CONFIG = {
  userAgent: "dotp/v0.0.4",
  auth: GITHUB_AUTH_TOKEN.token,
  // default auth strategy is token - this will change in future
};

const octokit = new Octokit(OCTOKIT_CONFIG);

/**
 * Validates that the Octokit client is authenticated by making a request to the GitHub API.
 * Logs the authenticated username on success or an error message on failure.
 */
async function checkAuth() {
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