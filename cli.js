#!/usr/bin/env node

/*
* @Author: sahildua2305
* @Date:   2016-06-24 20:20:19
* @Last Modified by:   Sahil Dua
* @Last Modified time: 2016-06-24 20:31:40
*/

'use strict';

const yargs = require('yargs')

const argv = yargs
  .usage('$0 <cmd> [args]')
  .option('name', {
    alias: 'n',
    describe: 'provide your GitHub username'
  })
  .command('hello', 'welcome', {}, function (argv) {
    console.log('hello', argv.name, 'Welcome')
  })
  .help('help')
  .argv
