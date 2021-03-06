# github-check-cli
[![npm version](https://badge.fury.io/js/github-check-cli.svg)](https://www.npmjs.com/package/github-check-cli) [![npm](https://img.shields.io/npm/dt/github-check-cli.svg?maxAge=86400)](https://www.npmjs.com/package/github-check-cli)

> :octocat: CLI for checking GitHub user profile and repositories information


## Demo
![Demo GitHub Check CLI](https://cloud.githubusercontent.com/assets/5206277/16353421/9b5c05c6-3a97-11e6-9071-0b2da613f26c.gif)

## Install
```
$ npm install -g github-check-cli
```

## Usage

### Commands available
```
$ github <command> [arguments]

Commands:
  user  Fetch information about any GitHub user
  repo  Fetch information about any GitHub repository

Options:
  -h, --help  Show help                             [boolean]
  
```

#### Command `user`
```
$ github user <github_username>

Options:
  -h, --help  Show help                             [boolean]

Examples:
  $ github user sahildua2305

```

#### Command `repo`
```
$ github repo <repo_owner_username> <repo_name>

Options:
  -h, --help  Show help                             [boolean]

Examples:
  $ github repo sahildua2305 github-check-cli

```

## More NodeJS Modules
- [text-watermark](https://github.com/sahildua2305/text-watermark)
- [checkroot](https://github.com/sahildua2305/checkroot)

## License

MIT © [Sahil Dua](http://sahildua.com)
