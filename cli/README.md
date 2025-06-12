dotproject
=================

Programmatically generate projects pages


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dotproject.svg)](https://npmjs.org/package/dotproject)
[![Downloads/week](https://img.shields.io/npm/dw/dotproject.svg)](https://npmjs.org/package/dotproject)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g dotproject
$ dotproject COMMAND
running command...
$ dotproject (--version)
dotproject/0.0.0 darwin-arm64 node-v23.1.0
$ dotproject --help [COMMAND]
USAGE
  $ dotproject COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`dotproject hello PERSON`](#dotproject-hello-person)
* [`dotproject hello world`](#dotproject-hello-world)
* [`dotproject help [COMMAND]`](#dotproject-help-command)
* [`dotproject plugins`](#dotproject-plugins)
* [`dotproject plugins add PLUGIN`](#dotproject-plugins-add-plugin)
* [`dotproject plugins:inspect PLUGIN...`](#dotproject-pluginsinspect-plugin)
* [`dotproject plugins install PLUGIN`](#dotproject-plugins-install-plugin)
* [`dotproject plugins link PATH`](#dotproject-plugins-link-path)
* [`dotproject plugins remove [PLUGIN]`](#dotproject-plugins-remove-plugin)
* [`dotproject plugins reset`](#dotproject-plugins-reset)
* [`dotproject plugins uninstall [PLUGIN]`](#dotproject-plugins-uninstall-plugin)
* [`dotproject plugins unlink [PLUGIN]`](#dotproject-plugins-unlink-plugin)
* [`dotproject plugins update`](#dotproject-plugins-update)

## `dotproject hello PERSON`

Say hello

```
USAGE
  $ dotproject hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ dotproject hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/Nostromos/dotprojectv2/blob/v0.0.0/src/commands/hello/index.ts)_

## `dotproject hello world`

Say hello world

```
USAGE
  $ dotproject hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ dotproject hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/Nostromos/dotprojectv2/blob/v0.0.0/src/commands/hello/world.ts)_

## `dotproject help [COMMAND]`

Display help for dotproject.

```
USAGE
  $ dotproject help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for dotproject.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.28/src/commands/help.ts)_

## `dotproject plugins`

List installed plugins.

```
USAGE
  $ dotproject plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ dotproject plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/index.ts)_

## `dotproject plugins add PLUGIN`

Installs a plugin into dotproject.

```
USAGE
  $ dotproject plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into dotproject.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the DOTPROJECT_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the DOTPROJECT_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ dotproject plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ dotproject plugins add myplugin

  Install a plugin from a github url.

    $ dotproject plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ dotproject plugins add someuser/someplugin
```

## `dotproject plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ dotproject plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ dotproject plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/inspect.ts)_

## `dotproject plugins install PLUGIN`

Installs a plugin into dotproject.

```
USAGE
  $ dotproject plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into dotproject.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the DOTPROJECT_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the DOTPROJECT_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ dotproject plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ dotproject plugins install myplugin

  Install a plugin from a github url.

    $ dotproject plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ dotproject plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/install.ts)_

## `dotproject plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ dotproject plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ dotproject plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/link.ts)_

## `dotproject plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ dotproject plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ dotproject plugins unlink
  $ dotproject plugins remove

EXAMPLES
  $ dotproject plugins remove myplugin
```

## `dotproject plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ dotproject plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/reset.ts)_

## `dotproject plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ dotproject plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ dotproject plugins unlink
  $ dotproject plugins remove

EXAMPLES
  $ dotproject plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/uninstall.ts)_

## `dotproject plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ dotproject plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ dotproject plugins unlink
  $ dotproject plugins remove

EXAMPLES
  $ dotproject plugins unlink myplugin
```

## `dotproject plugins update`

Update installed plugins.

```
USAGE
  $ dotproject plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/update.ts)_
<!-- commandsstop -->
