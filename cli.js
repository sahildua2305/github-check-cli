#!/usr/bin/env node

/*
* @Author: sahildua2305
* @Date:   2016-06-24 20:20:19
* @Last Modified by:   Sahil Dua
* @Last Modified time: 2016-06-25 04:34:41
*/

'use strict'

const yargs = require('yargs')
const request = require('request')
const ora = require('ora')
const Table = require('cli-table')
const chalk = require('chalk')

const BASE_URL = 'https://api.github.com/'

const check403 = (response, body) => {
  if (response.caseless.get('status') == '403 Forbidden') {
    var msg = body.message.split('(')[0]
    apiLimitCrossed(msg, response.caseless.get('x-ratelimit-reset'))
  }
}

const check404 = (response, repo) => {
  if (response.caseless.get('status') == '404 Not Found') {
    notFound(repo)
  }
}

const notFound = (repo) => {
  var msg = '404 Not Found!'
  msg += repo ? ' Please enter a valid combination of GitHub username and repo name.' : ' Please enter a valid GitHub username.';
  console.log(chalk.red.bold(msg))
  reportIssue()
}

const reportIssue = () => {
  console.log(chalk.yellow('If you think there is a bug, please open an issue at https://github.com/sahildua2305/github-check-cli/issues'))
  process.exit(-1)
}

const contributeLink = () => {
  console.log(chalk.yellow('Contribute to this project - https://github.com/sahildua2305/github-check-cli'))
}

const apiLimitCrossed = (message, reset) => {
  console.log(chalk.magenta.bold(message))
  contributeLink()
  process.exit(-1)
}

const requestFailed = () => {
  console.log(chalk.red.bold('Unable to fetch information from GitHub'))
  reportIssue()
}

const argv = yargs
  .usage('Usage: $0 <cmd> [args]')
  .command('user', 'Check GitHub information for any user', function (yargs) {
    const argv = yargs
      .usage('Usage: $0 user <github_username>')
      .demand(2)
      .example('$0 user sahildua2305')
      .argv

    var username = argv._[1]
    const spinner = ora('Fetching information from GitHub').start()

    var options = {
      url: BASE_URL + 'users/' + username,
      headers: {
        'User-Agent': 'User-' + username
      }
    }

    request.get(options, function (err, response) {
      spinner.stop()
      if (err) {
        requestFailed()
      }
      else {
        const userInfo = JSON.parse(response.body)

        check403(response, userInfo)
        check404(response, false)

        var userInfoTable = new Table({
          head: ['Followers', 'Public Repos', 'Following'],
          colWidths: [15, 15, 15],
          style: {
            head: ['cyan']
          }
        })
        userInfoTable.push(
          [userInfo.followers, userInfo.public_repos, userInfo.following]
        )

        if (userInfo.login)
          console.log(chalk.cyan('Username: ') + userInfo.login)
        if (userInfo.name)
          console.log(chalk.cyan('Full Name: ') + userInfo.name)
        if (userInfo.bio)
          console.log(chalk.cyan('Profile Bio: ') + userInfo.bio)
        if (userInfo.blog)
          console.log(chalk.cyan('Website Link: ') + userInfo.blog)
        if (userInfo.location)
          console.log(chalk.cyan('User Location: ') + userInfo.location)
        if (userInfo.html_url)
          console.log(chalk.cyan('GitHub Profile Link: ') + userInfo.html_url)
        console.log(userInfoTable.toString())

        contributeLink()
        process.exit(-1)
      }
    })
  })
.command('repo', 'Check GitHub information for any repo', function (yargs) {
    const argv = yargs
      .usage('Usage: $0 repo <repo_owner_username> <repo_name>')
      .demand(3)
      .example('$0 repo sahildua2305 github-check-cli')
      .argv

    var username = argv._[1]
    var reponame = argv._[2]
    const spinner = ora('Fetching information from GitHub').start()

    var options = {
      url: BASE_URL + 'repos/' + username + '/' + reponame,
      headers: {
        'User-Agent': 'User/Repo-' + username + '/' + reponame
      }
    }

    request.get(options, function (err, response) {
      spinner.stop()
      if (err) {
        requestFailed()
      }
      else {
        const repoInfo = JSON.parse(response.body)

        check403(response, repoInfo)
        check404(response, true)

        var repoInfoTable = new Table({
          head: ['Watching', 'Stars', 'Forks', 'Issues'],
          colWidths: [15, 15, 15, 15],
          style: {
            head: ['cyan']
          }
        })
        repoInfoTable.push(
          [repoInfo.subscribers_count, repoInfo.stargazers_count, repoInfo.forks_count, repoInfo.open_issues_count]
        )

        if (repoInfo.name)
          console.log(chalk.cyan('Name: ') + repoInfo.name)
        if (repoInfo.full_name)
          console.log(chalk.cyan('Full Name: ') + repoInfo.full_name)
        if (repoInfo.description)
          console.log(chalk.cyan('Description: ') + repoInfo.description)
        if (repoInfo.language)
          console.log(chalk.cyan('Language: ') + repoInfo.language)
        if (repoInfo.html_url)
          console.log(chalk.cyan('GitHub Link: ') + repoInfo.html_url)
        console.log(repoInfoTable.toString())

        contributeLink()
        process.exit(-1)
      }
    })
  })
  .help('help')
  .alias('h', 'help')
  .epilog('Copyrights © Sahil Dua (sahildua2305)')
  .argv
