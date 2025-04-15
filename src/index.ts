import prepareFiles from './cli/readWrite.js';
import cleanUp from './utils/index.js';

const username = 'Nostromos';

try {
  prepareFiles(username);
} catch (err) {
  console.log('Error here');
  console.error(err);
}

cleanUp();