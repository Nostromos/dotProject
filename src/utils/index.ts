import { rm as fsRm } from "node:fs/promises";

export default async function cleanUp() {
  const PATH = "/Users/figgefenk/Dev/projectTemplater/test/examples";

  try {
    const cleanTestFiles = await fsRm(PATH, { recursive: true });
    console.log(cleanTestFiles);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
    } else {
      console.error("An unknown error has occured cleaning up test files");
    }
  }
}