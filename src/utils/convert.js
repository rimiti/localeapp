import yaml from 'js-yaml';

/**
 * @description Convert Json to Yaml.
 * @param json
 * @returns {*}
 */
export const jsonToYml = (json) => yaml.safeDump(json);

/**
 * @description Convernt Yaml to JSON.
 * @param yml
 * @returns {*}
 */
export const ymlToJson = (yml) => yaml.safeLoad(yml, null, null, 'JSON_SCHEMA');
