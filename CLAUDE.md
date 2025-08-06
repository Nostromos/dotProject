# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

dotProject v2 is a monorepo tool for programmatically generating project information. It consists of:
- **Go API Server** (`/api`) - REST API that interfaces with GitHub API to fetch repository data
- **TypeScript CLI** (`/cli`) - Command-line tool for generating INFO.yml files from repository data

## Development Commands

### API (Go)

Run the API server:
```bash
cd api
go run cmd/server/main.go
```

Run tests:
```bash
cd api
go test ./... -v
```

Build the API:
```bash
cd api
go build -o ../build/api-server cmd/server/main.go
```

### CLI (TypeScript)

Install dependencies:
```bash
cd cli
npm install
```

Build the CLI:
```bash
cd cli
npm run build
```

Run tests:
```bash
cd cli
npm test
```

Lint the code:
```bash
cd cli
npm run lint
```

Run the CLI locally:
```bash
cd cli
./bin/run.js generate [owner] [repo]
```

## Architecture

### API Server Structure
- **Entry Point**: `api/cmd/server/main.go` - Runs on `127.0.0.1:8080`
- **Handlers**: `api/internal/handlers/` - HTTP request handling
  - `/repos/{owner}/` - Fetches all repos for a GitHub user
  - `/health` - Health check endpoint
- **GitHub Integration**: `api/internal/github/` - GitHub API client wrapper
- **Caching**: `api/internal/cache/` - In-memory caching using go-cache
- **Configuration**: `api/internal/setup/` - Environment setup

### CLI Structure
- **Framework**: Built with oclif (Open CLI Framework)
- **Commands**: `cli/src/commands/` - CLI command implementations
  - `generate` command - Generates INFO.yml files
- **Entry Point**: `cli/bin/run.js` - Main executable

### Key Dependencies
- **API**: Chi router, Google's go-github client, go-cache, Viper config
- **CLI**: oclif framework, TypeScript, ESLint, Mocha/Chai for testing

## Testing Approach

- **API Tests**: Uses testify for assertions, incomplete test coverage
- **CLI Tests**: Mocha test runner with TypeScript support
- **CI/CD**: GitHub Actions workflows in `cli/.github/workflows/`
  - Tests run on push (except main branch)
  - Multi-OS testing (Ubuntu, Windows)

## Configuration Requirements

- **Node.js**: >= 21.0.0 (for CLI)
- **Go**: 1.24.3 (for API)
- **GitHub Token**: Required for API authentication (set via environment)

## Important Notes

- The API server must be running for the CLI to function properly
- GitHub API rate limits apply - caching helps mitigate this
- The project uses Go workspaces (`go.work`) for the monorepo structure
- CLI uses ESM modules (type: "module" in package.json)