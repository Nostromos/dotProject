import { writeFile } from 'fs/promises';

export async function buildProject(info: object, path: string) {
  try {
    const content = JSON.stringify(info, null, 2);
    await writeFile(path, content, { flag: 'w+' });
  } catch (err) {
    console.error(err);
  }
};

