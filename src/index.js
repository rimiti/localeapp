import watch from 'node-watch';
import {init, pull, push, update} from './actions';

/**
 * @description Wrapper entry point.
 * @param command
 * @param rootFolder
 * @param targetPath
 * @param option
 * @param extra
 * @returns {*}
 */
export default function localeapp(command, rootFolder, targetPath, option, extra) {
  const { pushDefault, watchFiles, raw } = extra;
  const defaultLocale = option;
  if (command === 'init') {
    init(option);
  }
  else if (command === 'update') {
    if (watchFiles) {
      console.log('Louki watching for changes in root folder...');
      update(rootFolder, targetPath, defaultLocale); // run once
      watch(rootFolder, { recursive: true, filter: /\.(json|yml)$/ }, (evt, fileName) => {
        console.log(evt, fileName.replace(rootFolder, ''));
        return update(rootFolder, targetPath, defaultLocale);
      });
    }
    else {
      return update(rootFolder, targetPath, defaultLocale);
    }
  }  else if (command === 'push') {
    return push(rootFolder, targetPath, defaultLocale, pushDefault, raw);
  }  else if (command === 'pull') {
    return pull(rootFolder, targetPath, defaultLocale, raw);
  }  else {
    console.error('Command not found');
  }
}
