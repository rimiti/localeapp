import fs from 'fs';
import {
  getConfigPath,
  getProjectName,
  localeappPush,
  localeappPull,
  ymlToJson,
  jsonToYml,
  toFolders,
  fromFolders
} from './utils';

/**
 * @description Initialize from key.
 * @param key
 */
export function init(key) {
  const configPath = getConfigPath(true);
  const projectName = getProjectName();
  let existingKeys = {};
  try {
    existingKeys = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  catch (e) {
    console.log('No previous keys');
  }

  const combined = { ...existingKeys, [projectName]: key };
  fs.open(configPath, 'w', (err, fd) => {
    if (err) {
      fs.writeFile(configPath, '', (err) => {
        if(err) throw err;
        writeConfig(fd, combined);
      });
    }
    else {
      writeConfig(fd, combined);
    }
  });
}

/**
 * @description Writes key.
 * @param fd
 * @param keys
 */
function writeConfig(fd, keys) {
  fs.write(fd, JSON.stringify(keys), (err, written) => {
    if (err) {
      console.error('Could not save key');
      throw err;
    }
    console.log('Successfully saved localeapp key');
  });
}

/**
 * @description Pull translations.
 * @param rootFolder
 * @param targetPath
 * @param locale
 * @param raw
 * @returns {Promise<any | never | void>}
 */
export function pull(rootFolder, targetPath, locale, raw=false) {
  try {
    const configPath = getConfigPath();
    const projectName = getProjectName();
    const localeappKey = JSON.parse(fs.readFileSync(configPath, 'utf8'))[projectName];
    return localeappPull(localeappKey).then(({ response, body }) => {
      const localesArray = ymlToJson(body);
      console.log(`Successfully pulled locales ${Object.keys(localesArray).join(', ')} from Localeapp`);
      Object.entries(localesArray).map((l) => {
        const ymlLocale = jsonToYml({ [l[0]]: l[1] });
        fs.writeFileSync(`${targetPath}/${l[0]}.yml`, ymlLocale);
      });
      if (raw) return {};
      const compiledLocale = fs.readFileSync(`${targetPath}/${locale}.yml`, 'utf8');
      const updatedFolders = toFolders(rootFolder, compiledLocale, locale);
      console.log('Folders updated');
      return updatedFolders;
    }).catch((err) => console.error(err));
  }
  catch (err) {
    console.error('No localeapp project key found! Please specify one with the init command');
  }
}


/**
 * @description Push translations.
 * @param rootFolder
 * @param targetPath
 * @param locale
 * @param pushDefault
 * @param raw
 * @returns {Promise<any | never | void>}
 */
export function push(rootFolder, targetPath, locale, pushDefault, raw=false) {
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

/**
 * @description Update translations.
 * @param rootFolder
 * @param targetPath
 * @param locale
 * @returns {*}
 */
export function update(rootFolder, targetPath, locale) {
  const finalTranslation = fromFolders(rootFolder, locale);
  try {
    fs.writeFileSync(`${targetPath}/${locale}.yml`, finalTranslation); // file type is hardcoded for now
    console.log(`Updated target file ${locale}.yml`);
  }
  catch (err) {
    console.error(err);
  }
  return finalTranslation;
}
