import ok from './githubClient.js';

export async function getAllRepos() {
  const allPublicRepos = await ok.request('GET /users/Nostromos/repos', {
    username: 'Nostromos',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    },
    type: 'owner', // defaults to `owner`
    sort: 'updated', // defaults to `full_name`
    direction: 'desc', // default `asc` when using `full_name`, otherwise `desc`
    per_page: 5, // default 30
  });

  return allPublicRepos.data;
};
