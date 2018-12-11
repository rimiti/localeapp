import fs from 'fs';
import path from 'path';
export * from './api';
export * from './convert';
export fromFolders from './from-folders';
export toFolders from './to-folders';

export const localeReplacer = ['{{locale}}', '{{ locale }}'];

/**
 * @description Returns config path.
 * @param create
 * @returns {string}
 */
export function getConfigPath(create=false) {
  const home = require('user-home');
  const directory = `${home}/.localeapp`;
  if (!fs.existsSync(directory) && create) {
    fs.mkdirSync(directory);
  }
  return `${directory}/config.json`;
}

/**
 * @description Returns project name.
 * @returns {*}
 */
export function getProjectName() {
  const pathToPackage = path.resolve('package.json');
  const name = JSON.parse(fs.readFileSync(pathToPackage, 'utf8')).name;
  if (! name) {
    console.log('Missing required "name" in package.json');
    process.exit();
  }
  return name;
}

/**
 * @description Create folder and file.
 * @param path
 * @param locale
 * @param content
 */
export function createFile(path, locale, content) {
  let pathTmp = path;
  localeReplacer.map((item) => pathTmp = pathTmp.replace(item, locale));
  if (!fs.existsSync(pathTmp)) {
    fs.mkdirSync(pathTmp);
  }
  fs.writeFileSync(`${pathTmp}/${locale}.yml`, content);
}
