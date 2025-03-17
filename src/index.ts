import { getAllRepos } from './api/repoFetcher.js';
import { buildProject } from './core/jsonGenerator.js';

const data = await getAllRepos();

const path = "./examples/test2/project.json";

buildProject(data[0], path);