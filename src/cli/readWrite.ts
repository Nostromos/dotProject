import { mkdir as fsMkdir } from 'node:fs/promises';

const PATH_PREFIX = "/Users/figgefenk/Dev/projectTemplater/test/examples/";

export default async function prepareFiles(userName: string) {
  try {
    const path = PATH_PREFIX + userName + "/" + ".cache";
    const createDir = await fsMkdir(path, { recursive: true });

    console.log(`Folder created successfully at ${createDir}`);
    return createDir;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('An unknown error occurred');
    }
  }
}