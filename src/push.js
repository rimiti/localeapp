import fs from 'fs';
import {localeappPush, getConfigPath, getProjectName} from './utils';
import update from './update';

/**
 * @description Push translations.
 * @param rootFolder
 * @param targetPath
 * @param locale
 * @param pushDefault
 * @param raw
 * @returns {Promise<any | never | void>}
 */
export default function push(rootFolder, targetPath, locale, pushDefault, raw=false) {
  if (pushDefault && !raw) update(rootFolder, targetPath, locale); // only build if default locale is pushed

  try {
    const localeappKey = JSON.parse(fs.readFileSync(getConfigPath(), 'utf8'))[getProjectName()];
    const filePath = `${targetPath}/${locale}.yml`;
    const data = fs.createReadStream(filePath);
    return localeappPush(localeappKey, data)
      .then(() => {
        console.log(`Successfully pushed ${locale}.yml to Localeapp`);
      })
      .catch((err) => console.error(err));
  }
  catch (err) {
    console.log('No localeapp project key found! Please specify one with the init command');
  }
}
