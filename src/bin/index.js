#! /usr/bin/env node

import path from 'path';
import localeapp from '..';
import commander from 'commander';

const conf = {};
const appCfg = require('rc')('localeapp', conf);

let cmdValue = undefined;
let optionsValue = undefined;

commander
  .version('1.0.0')
  .arguments('<cmd> [options]')
  .action(function (cmd, options) {
    cmdValue = cmd ;
    optionsValue = options;
  });

commander
  .command('init')
  .description('To initialise localeapp with the localeapp secret key. Required argument: secret_key.');

commander
  .command('update')
  .description('To update the compiled default locale (without pushing)');

commander
  .command('push')
  .description('To push to localeapp using the bash command??');

commander
  .command('pull')
  .description('To pull from localeapp and update all files (compiled and src)');

commander
  .option('-w, --watch', 'Watch files (calls update on changes)');


commander
  .option('-r, --raw', 'Pull without rebuilding sources');

commander.parse(process.argv);


if (typeof cmdValue === 'undefined') {
  console.error('no command given!');
  process.exit();
} else if (! ['update', 'push', 'pull', 'init'].includes(cmdValue)) {
  console.error('Command not supported or recognised');
  process.exit();
} else {
  if (typeof appCfg.config === 'undefined') {
    console.error('no config file found!');
    process.exit(1);
  }

  let rootPath = path.resolve('./');
  let localeTarget = appCfg.target;
  let localeSource = appCfg.source;
  let defaultLocale = appCfg.default;

  if (cmdValue === 'init') {
    if(!optionsValue && !process.env.LOCALEAPP_KEY) {
      console.error('Localeapp key not specified.');
      process.exit();
    }

    if(!optionsValue && process.env.LOCALEAPP_KEY) {
      optionsValue = process.env.LOCALEAPP_KEY
    }
  }

  if (typeof localeTarget === 'undefined'
    || typeof localeSource === 'undefined'
    || typeof defaultLocale === 'undefined') {
    console.error('Missing config options! Provide root, source, default');
    process.exit();
  }

  const targetPath = rootPath + '/' + localeTarget;
  const sourcePath = rootPath + '/' + localeSource;
  const extra = {
    pushDefault: optionsValue == defaultLocale,
    watchFiles: commander.watch,
    raw: commander.raw,
  };

  localeapp(cmdValue, sourcePath, targetPath, optionsValue || defaultLocale, extra);
}
