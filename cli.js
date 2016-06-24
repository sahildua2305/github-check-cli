#!/usr/bin/env node

/*
* @Author: sahildua2305
* @Date:   2016-06-24 20:20:19
* @Last Modified by:   Sahil Dua
* @Last Modified time: 2016-06-25 02:42:38
*/

'use strict'

const yargs = require('yargs')
const request = require('request')
const ora = require('ora')
const Table = require('cli-table')
const chalk = require('chalk')

const USER_URL = 'https://api.github.com/users/'

const userNotFound = () => {
  console.log(chalk.red.bold('404 Not Found! Please enter a valid GitHub username.'))
  reportIssue()
}

const reportIssue = () => {
  console.log(chalk.yellow('If you think something is wrong, please open an issue at https://github.com/sahildua2305/github-check-cli/issues'))
  process.exit(-1)
}

const contributeLink = () => {
  console.log(chalk.yellow('Contribute to this project - https://github.com/sahildua2305/github-check-cli'))
}

const argv = yargs
  .usage('Usage: $0 <cmd> [args]')
  .command('user', 'welcome', function (yargs) {
    const argv = yargs
      .usage('Usage: $0 user <github_username>')
      .demand(2)
      .example('$0 user sahildua2305')
      .argv

    var username = argv._[1]
    const spinner = ora('Accessing GitHub').start()

    var options = {
      url: USER_URL + username,
      headers: {
        'User-Agent': 'User-' + username
      }
    }

    request.get(options, function (err, response) {
      spinner.stop()
      if (err) {
        console.log('Error!')
      }
      else {
        console.log(response.body)
        console.log(response.caseless.get('x-ratelimit-remaining'))

        if (response.caseless.get('status') == '404 Not Found') {
          userNotFound()
        }

        const userInfo = JSON.parse(response.body)

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
        if (userInfo.html_url)
          console.log(chalk.cyan('GitHub Profile Link: ') + userInfo.html_url)
        console.log(userInfoTable.toString())

        contributeLink()
        process.exit(-1)
      }
    })
  })
  .help('help')
  .alias('h', 'help')
  .epilog('Copyrights © Sahil Dua (sahildua2305)')
  .argv
