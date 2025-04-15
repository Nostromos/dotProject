import prepareFiles from './cli/readWrite.js';
import cleanUp from './utils/index.js';
import { processOneUser } from './core/batchProcessor.js'
import octokit from './api/githubClient.js';

const myoc = octokit;

const username = 'Nostromos';

// Example usage of octokit to fetch user details
(async () => {
  try {
    const { data } = await myoc.rest.users.getByUsername({ username });
    console.log(`Fetched user details for ${username}:`, data);
  } catch (error) {
    console.error(`Failed to fetch user details for ${username}:`, error);
  }
})();

try {
  console.log(`Preparing files...`);
  prepareFiles(username);
} catch (err) {
  console.log('Error here');
  console.error(err);
}

const PATH_PREFIX = "/Users/figgefenk/Dev/projectTemplater/test/examples/";

processOneUser('Nostromos');

// cleanUp();
