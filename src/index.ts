import prepareFiles from './cli/readWrite.js';
// import cleanUp from './utils/index.js';
import { processOneUser } from './core/batchProcessor.js'
// import octokit from './api/githubClient.js';
import octokit from './api/githubClient.js';

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
const username = 'Nostromos';

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
