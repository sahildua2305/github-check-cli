#!/usr/bin/env node

/*
* @Author: sahildua2305
* @Date:   2016-06-24 20:20:19
* @Last Modified by:   Sahil Dua
* @Last Modified time: 2016-06-25 01:30:50
*/

'use strict'

const yargs = require('yargs')
const request = require('request')
const ora = require('ora')
const Table = require('cli-table')

const USER_URL = 'https://api.github.com/users/'

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
        console.log(response.caseless.get('x-ratelimit-remaining'))
        console.log(response.body)

        const userInfo = JSON.parse(response.body)
        console.log(userInfo.name)

        var userNameTable = new Table({
          head: ['Username', 'Full Name', 'GitHub profile link'],
          colWidths: [15, 15, 70],
          style: {
            head: ['cyan']
          },
          chars: {
            'top': '',
            'top-mid': '',
            'top-left': '',
            'top-right': '',
            'bottom': '',
            'bottom-mid': '',
            'bottom-left': '',
            'bottom-right': '',
            'left': '',
            'left-mid': '',
            'mid': '',
            'mid-mid': '',
            'right': '',
            'right-mid': '',
            'middle': ' '
          }
        })
        userNameTable.push(
          [userInfo.login, userInfo.name, userInfo.html_url]
        )

        var userInfoTable = new Table({
          head: ['Followers', 'Public Repos', 'Following'],
          colWidths: [15, 15, 15],
          style: {
            head: ['green']
          }
        })
        userInfoTable.push(
          [userInfo.followers, userInfo.public_repos, userInfo.following]
        )

        console.log(userNameTable.toString())
        console.log(userInfoTable.toString())
      }
    })
  })
  .help('help')
  .alias('h', 'help')
  .epilog('Copyrights Sahil Dua (sahildua2305) 2016')
  .argv
