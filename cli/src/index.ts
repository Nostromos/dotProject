export { run } from '@oclif/core'

export default async function testAPIServer() {
  try {
    const response = await fetch("http://127.0.0.1:8080/repos/Nostromos/")
    console.log(response);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(String(error))
    }
  }
}

await testAPIServer();