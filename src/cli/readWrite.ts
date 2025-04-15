import { mkdir as fsMkdir, writeFile as fsWriteFile } from 'node:fs/promises';
import type { Project } from '../types/types.js';

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

export async function writeFile(content: Project, pathPrefix: string) {
  try {
    const fileContent = JSON.stringify(content, null, 2);
    const path = pathPrefix + `${content.slug}.json`;
    await fsWriteFile(path, fileContent, { flag: 'w+' })

  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('An unknown error occurred');
    }
  }
}
