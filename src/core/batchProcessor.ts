import { getRepo, getCollaborators, getRepoLanguages, getTopics, getLastCommit } from '../api/repoFetcher.js';

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



