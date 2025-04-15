import { getAllRepos, getRepo, getCollaborators, getRepoLanguages, getTopics, getLastCommit } from '../api/infoFetcher.js';
import { writeFile } from '../cli/readWrite.js';

export async function splitIntoBatches<T>(tasks: T[], batchSize: number): Promise<T[][]> {
  const batches: T[][] = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    batches.push(tasks.slice(i, i + batchSize));
  }
  return batches;
}

export async function processInBatches<T>(
  tasks: T[],
  batchSize: number,
  taskHandler: (task: T) => Promise<void>
): Promise<void> {
  const batches = await splitIntoBatches(tasks, batchSize);
  for (const batch of batches) {
    await Promise.all(batch.map(taskHandler));
  }
}

export async function processOneRepo(params: any) {
  const [repo, collaborators, languages, topics, lastCommit] = await Promise.all([
    getRepo(params),
    getCollaborators(params),
    getRepoLanguages(params),
    getTopics(params),
    getLastCommit(params),
  ]);

  const project = {
    title: repo.name,
    description: repo.description,
    tags: Object.keys(languages),
    urls: {
      repository: repo.html_url,
    },
    contributors: collaborators.map((collab: any) => ({
      login: collab.login,
      url: collab.html_url,
    })),
    topics: topics.names,
    lastCommit,
  };

  console.log("✅ Processed project:", project);
}

export async function processOneUser(userName: string) {
  console.log(`Processing repos for user ${userName}...`)
  try {
    console.log(`Calling Github...`);
    const allRepos = await getAllRepos({ username: userName });
    console.log(`Github found`);
    const detailedRepos = new Array();

    for (let repo of allRepos) {
      console.log(`Processing repo: ${repo.name}`)
      const oneRepo = await getRepo({
        owner: repo.owner.login,
        repo: repo.name
      });
      
      const collaborators = await getCollaborators({ owner: userName, repo: oneRepo.name });
      const languages = await getRepoLanguages({ owner: userName, repo: repo.name });
      const topics = await getTopics({ owner: userName, repo: repo.name });
      const lastCommit = await getLastCommit({ owner: userName, repo: repo.name });

      const project = {
        title: oneRepo.name,
        slug: createSlug(oneRepo.name),
        description: oneRepo.description ? oneRepo.description : "",
        tags: topics.names,
        technologies: Object.keys(languages),
        status: "In Progress" as "In Progress",
        urls: {
          repository: oneRepo.html_url,
          production: oneRepo.homepage ?? null,
        },
        contributors: collaborators,
        date_started: oneRepo.created_at,
        last_activity: oneRepo.updated_at,
      };
      const PATH_PREFIX = "/Users/figgefenk/Dev/projectTemplater/test/examples/";
      console.log(`Writing File: ${repo.name}`)
      await writeFile(project, PATH_PREFIX)
    }
  } catch (err) {
    console.error(err);
  }
};

function createSlug(repoName: string): string {
  return repoName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}


