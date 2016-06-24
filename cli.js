#!/usr/bin/env node

/*
* @Author: sahildua2305
* @Date:   2016-06-24 20:20:19
* @Last Modified by:   Sahil Dua
* @Last Modified time: 2016-06-25 00:51:27
*/

'use strict'

const yargs = require('yargs')
const request = require('request')
const ora = require('ora')

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
        console.log(response.body)
      }
    })
  })
  .help('help')
  .alias('h', 'help')
  .epilog('Copyrights Sahil Dua (sahildua2305) 2016')
  .argv
