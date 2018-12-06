import getSectionsTree from './get-sections-tree';
import { find, filter, isEmpty } from 'lodash';
import { ymlToJson, jsonToYml } from './convert';

/**
 * @description Parse folder structure.
 * @param rootFolder
 */
function parseTree(rootFolder) {
  const { children } = getSectionsTree(rootFolder);

  const manifestFile = find(children, { extension: 'json' });
  let final = {};

  if (manifestFile) {
    const manifest = JSON.parse(manifestFile.content);
    for (const key in manifest) {
      if (manifest.hasOwnProperty(key)) {
        const val = manifest[key];
        const matchExample = val.match(/{{(.*)}}/);

        if ( ! isEmpty(matchExample)) {
          const folder = matchExample[1];
          Object.assign(final, {
            [key]: parseTree(`${rootFolder}/${folder}`),
          });
        }

        else {
          Object.assign(final, {
            [key]: val,
          });
        }
      }
    }
  }

  const files = filter(children, { extension: 'yml' });
  if (files) {
    files.map((f) => {
      const translations = ymlToJson(f.content);
      const name = f.name.split('.')[0];
      if (name === 'index') {
        Object.assign(final, {
          ...translations,
        });
      }
      else {
        Object.assign(final, {
          [name]: translations,
        });
      }
    });
  }
  return final;
}

/**
 * @description Parse from folders.
 * @param rootFolder
 * @param locale
 * @returns {*}
 */
export default function fromFolders(rootFolder, locale) {
  const result = Object.assign({}, {
    [locale]: parseTree(rootFolder),
  });
  return jsonToYml(result);
}
