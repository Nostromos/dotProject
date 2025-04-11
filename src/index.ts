import prepareFiles from './cli/readWrite.js';
import cleanUp from './utils/index.js';

const username = 'Nostromos';

prepareFiles(username);

cleanUp();