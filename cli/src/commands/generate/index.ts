import {Args, Command, Flags} from '@oclif/core'

export default class Generate extends Command {
  static args = {
    owner: Args.string({description: 'The owner of the repository or the user whose repositories you want to generate info for', required: true}),
    repo: Args.string({description: "The repository to generate for", required: false})
  }
  static description = 'Generate an INFO.yml for a specific repo or all of a user\'s repos.'
  static examples = [
    `<%= config.bin %> <%= command.id %> generate nostromos dotprojectv2
INFO.yml generated at ./.project/INFO.yml!
`,
  ]
  static flags = {
    from: Flags.string({char: 'u', description: 'The user or owner of a repo', required: false}),
  }

  async run(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {args, flags} = await this.parse(Generate)
    
    if (args.repo) {
      this.log(`Generating INFO.yml for repo ${args.repo} by ${args.owner}`)
    } else {
      this.log(`Generating INFO.yml for all of ${args.owner}'s repositories.`)
    }
  }
}
