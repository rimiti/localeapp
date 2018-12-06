import fs from 'fs';
import { getConfigPath, getProjectName } from './utils';

/**
 * @description Initialize from key.
 * @param key
 */
export default function init(key) {
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
