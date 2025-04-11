# Initial Plan & Thinking

## Core Logic

- [ ] Read/write to file


## Feature List

Core Logic (TS + Node)
- [ ] GitHub API Integration – Fetch repository details using GitHub’s REST or GraphQL API.
  - [x] Dev: Get basic GH auth set up - token
  - [ ] MVP: Create GH app, use app auth, and change endpoint to `only auth'd user`
- [ ] Customizable Data Extraction – Allow users to define what data goes into INFO.json (e.g., repo name, description, language, stars, forks, contributors).
- [ ] Screenshot Discovery or Generation - Find screenshots present in repo and allow users to save copies to their `.project` folder
  - [ ] MVP: Find images in the repo and save them all, then let user pick which ones to keep
  - [ ] May mean offering some basic image processing (changing dimensions, etc.)
  - [ ] FUTURE: Maybe some way of visiting the project site and taking screenshots of each page, or looking in the components section of a react site and generating images of those components on the page
- [ ] Local JSON Generation – Generate and save INFO.json for each repository.
- [ ] [Batch Processing – Support generating INFO.json for multiple repositories at once.](./Batch_Processing.md)
- [ ] Rate Limit Handling – Implement caching or backoff strategies for GitHub API limits.
- [ ] Authentication Support – Allow the use of GitHub tokens for private repo access.
- [ ] Config File Support – Let users define options (e.g., fields to include, output directory) via a config file (config.json).
- [ ] Repository Categorization – Organize repositories into categories based on metadata (e.g., frontend, backend, archived).
- [ ] Dependency Extraction – Parse package.json, requirements.txt, or other dependency files to list frameworks/tools.
- [ ] Repository Health Metrics – Include basic repo health indicators like:
  - [x] Last commit date
  - [ ] Open issues count
  - [x] Number of contributors
  - [ ] Presence of key files (README.md, .gitignore, LICENSE)
- [ ] GitHub Topics & Tags – Fetch and include GitHub topics (e.g., react, nodejs) if available.
- [ ] Code Size & File Breakdown – Get repo size and count files by type (e.g., how many .ts, .js, .py files).
- [ ] License Detection – Extract the repo’s license type from GitHub’s license API.
- [ ] Auto-Update Mechanism – Option to periodically update INFO.json if the repo changes.
- [ ] Error Handling & Logging – Provide structured logging and retry mechanisms for API failures.
- [ ] CLI Integration Ready – Design functions so they can be easily exposed via a CLI tool later.
- [ ] Local Repository Support – If a GitHub repo isn’t available, allow pointing to a local repo directory for analysis.
- [ ] File Format Options – Allow output as JSON, Markdown (INFO.md), or YAML (INFO.yaml).
- [ ] Support for Monorepos – Detect multiple packages/modules in a single repository.

CLI App
- [ ] Command-Line Interface – Simple command like github-info-gen --user yourGitHubUsername.
- [ ] Flags for Customization – Allow flags like --repo, --output-dir, --fields=name,stars,forks.
- [ ] Interactive Mode – Prompt users for input if no flags are provided.
- [ ] Output Formats – Option to output as JSON, Markdown, or YAML.
- [ ] Logging & Error Handling – Display progress and errors in a user-friendly way.
- [ ] Parallel Processing – Speed up fetching for multiple repositories.

Basic Web App
- [ ] OAuth Authentication – Let users log in via GitHub to access their repositories.
- [ ] Dashboard for Repos – Display repositories in a table with filtering/sorting options.
- [ ] Editable Fields – Let users modify the INFO.json before exporting.
- [ ] Download/Export Options – Allow users to download generated INFO.json or push it to a repo.
- [ ] Webhooks for Auto-Update – Automatically update INFO.json when repo data changes.
- [ ] Multi-User Support – Allow multiple users to manage their own projects.

See issues for working list & plan.

## Periodic Updates

| Date | Description |
|------|-------------|
| 04/11 | Getting into RC has thrown me off this a bit. Very tempted to scrap it and either start over or cut a bunch of the features. Middle ground is reappraising feature list, cutting a bunch, and shipping what I've got. Will do that over the weekend and go for MVP on Monday. |